import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  UserCheck, CheckCircle2, XCircle, Clock, MessageSquare, AlertTriangle, 
  Send, Eye, RefreshCw, Inbox, Ship, ShieldCheck, MapPin, User, ArrowRight, Filter
} from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { fetchAllQuotes, agentActionOnQuote, getAgentActions, sortQuotesByTime, enrichQuoteWithLocalState, resolveEffectiveQuoteStatus } from '../lib/api'
import { seedQuotes, resolveAssignedAgent, getAgentDesk, CARRIER_DESK_CONFIG, isCarrierMatch, DEFAULT_CARRIER_THEME } from '../lib/mockData'

const DEFAULT_THEME = DEFAULT_CARRIER_THEME || {
  primaryColor: '#0A2540',
  accentColor: '#D9500A',
  badgeBg: 'bg-orange-50',
  badgeText: 'text-brand-orange',
  badgeBorder: 'border-orange-200',
  bannerGradient: 'from-[#0A2540] via-[#103052] to-[#1C4977]',
  tagline: 'Lead Freight Brokerage, Multi-Carrier Routing & Margin Review',
  contractTier: 'Master Brokerage Operations Hub',
  slaHours: '2h SLA'
}

const TABS = [
  { key: 'queue', label: 'Review Queue', icon: Inbox },
  { key: 'booked', label: 'Booked Shipments', icon: Ship },
  { key: 'activity', label: 'My Activity', icon: CheckCircle2 },
  { key: 'messages', label: 'Customer Messages', icon: MessageSquare },
]

// Merge seed agent_review data with localStorage agent actions & enrich
function mergeAgentData(quotes, agentActions) {
  return quotes.map(q => {
    const localAction = agentActions[q.id]
    const base = localAction ? { ...q, agent_review: localAction } : q
    return enrichQuoteWithLocalState(base)
  })
}

const MSGS_KEY = 'portline_agent_messages'
function loadMessages() {
  try { return JSON.parse(localStorage.getItem(MSGS_KEY) || '{}') } catch { return {} }
}
function saveMessages(msgs) {
  try { localStorage.setItem(MSGS_KEY, JSON.stringify(msgs)) } catch {}
}

export default function Agent() {
  const { user, loggedIn } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const deskParam = searchParams.get('desk')
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('queue')
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionStates, setActionStates] = useState({}) // { quoteId: { loading, comment, showComment } }
  const [messages, setMessages] = useState(loadMessages())
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [newMsg, setNewMsg] = useState('')
  const [selectedDeskFilter, setSelectedDeskFilter] = useState(deskParam || 'ALL')
  const [supervisorCategory, setSupervisorCategory] = useState('ALL')

  const isAgent = user?.role === 'agent' || user?.role === 'broker' || user?.role === 'admin'
  const currentDesk = getAgentDesk(user, deskParam) || CARRIER_DESK_CONFIG['default'] || {}
  const deskTheme = currentDesk?.theme || DEFAULT_THEME
  const isMasterAdmin = user?.role === 'admin'
  const isPlatformLeadAgent = user?.email?.toLowerCase() === 'agent@portline.in' || user?.email?.toLowerCase() === 'agent.demo@portline.in'
  // Supervisor mode applies ONLY to platform lead agents or admin who are not viewing a specific desk
  const isSupervisor = (isMasterAdmin || isPlatformLeadAgent) && (!deskParam || deskParam === 'ALL')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const all = await fetchAllQuotes()
      const agentActions = getAgentActions()
      setQuotes(sortQuotesByTime(mergeAgentData(Array.isArray(all) ? all : seedQuotes, agentActions)))
    } catch {
      setQuotes(sortQuotesByTime(mergeAgentData(seedQuotes, getAgentActions())))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // Live synchronization across tabs & components
  useEffect(() => {
    const handleSync = () => { loadData() }
    window.addEventListener('portline_quote_updated', handleSync)
    window.addEventListener('portline_shipment_updated', handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      window.removeEventListener('portline_quote_updated', handleSync)
      window.removeEventListener('portline_shipment_updated', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [loadData])

  const safeQuotes = Array.isArray(quotes) ? quotes : []

  // Strictly filter quotes for this agent's specific carrier desk
  const agentEmail = (user?.email || '').toLowerCase()
  const myDeskQuotes = safeQuotes.filter(q => {
    if (q._isDemo) return false // never show demo seed quotes in agent queue
    
    // Customer must finalise quote first! Unfinalised draft quotes remain in customer workspace
    if (!q.is_finalised) return false

    const assigned = resolveAssignedAgent(q)
    
    // If admin or supervisor lead agent (agent@portline.in):
    if (isSupervisor) {
      if (selectedDeskFilter === 'ALL') return true
      return assigned.carrierKey === selectedDeskFilter
    }
    
    // Specific Carrier Agent: strictly isolate by carrier key or exact agent email
    const matchCarrier =
      isCarrierMatch(currentDesk?.carrierKey, assigned?.carrierKey) ||
      isCarrierMatch(currentDesk?.carrierKey, assigned?.carrierName) ||
      isCarrierMatch(currentDesk?.carrierKey, q.selected_route?.carrier) ||
      isCarrierMatch(currentDesk?.carrierName, assigned?.carrierKey) ||
      isCarrierMatch(currentDesk?.carrierName, assigned?.carrierName) ||
      isCarrierMatch(currentDesk?.carrierName, q.selected_route?.carrier)
    const matchEmail = assigned?.email && assigned.email.toLowerCase() === agentEmail
    return Boolean(matchCarrier || matchEmail)
  })

  const isBookingComplete = (q) => resolveEffectiveQuoteStatus(q) === 'Booked'

  const isAgentPending = (q) => {
    if (isBookingComplete(q)) return false
    const effStatus = resolveEffectiveQuoteStatus(q)
    if (effStatus === 'Agent Approval Pending' || effStatus === 'Revised Priced Accepted (Agent Approval Pending)') return true
    if (!q.agent_review || q.agent_review.status === 'pending') {
      return effStatus !== 'Approved by Agent and Awaiting Customs Clearance' && 
             !effStatus.includes('Customs') && 
             !effStatus.includes('Rejected') && 
             !effStatus.includes('Declined')
    }
    return false
  }

  const booked = myDeskQuotes.filter(isBookingComplete)
  const pending = myDeskQuotes.filter(isAgentPending)
  const reviewed = myDeskQuotes.filter(q => !isAgentPending(q) && !isBookingComplete(q))

  const getState = (id) => actionStates[id] || { loading: false, comment: '', showComment: false }
  const setState = (id, patch) => setActionStates(prev => ({ ...prev, [id]: { ...getState(id), ...patch } }))

  const handleAction = async (quoteId, action) => {
    const st = getState(quoteId)
    setState(quoteId, { loading: true })
    try {
      await agentActionOnQuote(quoteId, action, st.comment, user)
      toast(action === 'approved' ? 'Quote approved by Agent! Forwarded to Customs Clearance desk.' : 'Quote rejected with comment')
      await loadData()
      setState(quoteId, { loading: false, comment: '', showComment: false })
    } catch {
      toast('Action failed, please try again')
      setState(quoteId, { loading: false })
    }
  }

  const handleSendMessage = (quoteId) => {
    if (!newMsg.trim()) return
    const msgs = loadMessages()
    if (!msgs[quoteId]) msgs[quoteId] = []
    msgs[quoteId].push({
      from: user?.name || currentDesk?.agentName || 'Agent',
      role: 'agent',
      text: newMsg.trim(),
      ts: new Date().toISOString()
    })
    saveMessages(msgs)
    setMessages({ ...msgs })
    setNewMsg('')
    toast('Message sent')
  }

  if (!loggedIn || !isAgent) {
    return (
      <section className="pt-24 pb-20">
        <div className="mx-auto max-w-[1220px] px-8 sm:px-5">
          <div className="mx-auto max-w-[460px] rounded-2xl border border-brand-line bg-white px-9 py-11 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-brand-navy">Agent Access Required</h3>
            <p className="mb-2 text-sm text-brand-slate">This area is restricted to authorized carrier line and lead freight desk agents.</p>
            <p className="mb-6 font-mono text-xs text-brand-slateLight">Login with your carrier agent account (e.g. agent.cmacgm@portline.in or agent.msc@portline.in)</p>
            <button onClick={() => navigate('/login')} className="rounded-xl bg-brand-navy px-6 py-3 text-sm font-semibold text-white hover:bg-brand-marine transition-colors">
              Log in as Agent
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Carrier-Specific Custom Desk Header Banner */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${deskTheme.bannerGradient || DEFAULT_THEME.bannerGradient} text-white shadow-lg border-b border-white/10 pt-6 pb-8`}>
        {/* Subtle background grid & ambient light */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Left: Carrier Identity & Desk Information */}
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-xs ${deskTheme.badgeBg || DEFAULT_THEME.badgeBg} ${deskTheme.badgeText || DEFAULT_THEME.badgeText} ${deskTheme.badgeBorder || DEFAULT_THEME.badgeBorder}`}>
                  <Ship className="h-3.5 w-3.5" />
                  {currentDesk?.carrierKey || 'GENERAL'} DESK
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/15">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  {deskTheme.contractTier || 'Carrier Verified Tier 1'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-amber-300 border border-white/15">
                  <Clock className="h-3 w-3" />
                  {deskTheme.slaHours || '2h Guaranteed SLA'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-white">
                {currentDesk?.deskName || 'PORTLINE Commercial Operations Desk'}
              </h1>

              <p className="mt-2 text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                Commercial carrier operations console for {currentDesk?.carrierName || 'PORTLINE General Carrier Network'}. Review route selections, validate liner tariffs, negotiate margins, and approve vessel berth allocations.
              </p>

              {/* Desk Officer & Hub Details */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg border border-white/10">
                  <User className="h-3.5 w-3.5 text-brand-orangeLight" />
                  <span>Officer: <strong className="text-white">{user?.name || currentDesk?.agentName || 'Arjun Agent'}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg border border-white/10">
                  <MapPin className="h-3.5 w-3.5 text-sky-400" />
                  <span>Home Hub: <strong className="text-white">{user?.portHub || 'Nhava Sheva (JNPT), Mumbai'}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-300 font-semibold">{user?.operatingStatus || 'Available · Live Queue'}</span>
                </div>
              </div>
            </div>

            {/* Right: Desk Profile Quick Navigation & KPI Cards */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center justify-between gap-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 px-4 py-3 text-sm font-semibold text-white shadow-md backdrop-blur-sm transition-all group"
                title="View & Edit Carrier Desk Profile"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs text-white">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold leading-tight flex items-center gap-1">
                      Desk Profile & Settings
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono">Edit contact & approval limits</div>
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-2 bg-black/35 rounded-xl p-2.5 border border-white/15">
                <div className="flex-1 text-center px-2.5 border-r border-white/15">
                  <div className="text-lg font-bold font-mono text-amber-400">{pending.length}</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300">Pending</div>
                </div>
                <div className="flex-1 text-center px-2.5 border-r border-white/15">
                  <div className="text-lg font-bold font-mono text-emerald-400">{booked.length}</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 font-semibold">Booked</div>
                </div>
                <div className="flex-1 text-center px-2.5 border-r border-white/15">
                  <div className="text-lg font-bold font-mono text-slate-200">{reviewed.length}</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300">Reviewed</div>
                </div>
                <div className="flex-1 text-center px-2.5">
                  <div className="text-xs font-bold font-mono text-white truncate max-w-[100px]">
                    {user?.marginApprovalLimit || 'Rs. 15L'}
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300">Margin Limit</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <section className="pt-6 pb-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">

          {/* Supervisor / Lead Agent Carrier Desk Switcher Bar */}
          {isSupervisor && (
            <div className="mb-6 rounded-2xl border border-brand-line bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-brand-marine" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                    Carrier Desk Switcher (Lead / Supervisor Operations)
                  </span>
                </div>
                <span className="text-xs text-brand-slate">
                  Switch between individual carrier desk allocations or view unified network queue
                </span>
              </div>
              {/* Category Filter Pills for Supervisor */}
              <div className="flex items-center gap-1.5 mb-2.5 overflow-x-auto pb-1">
                {[
                  { id: 'ALL', label: 'All Categories' },
                  { id: 'OCEAN', label: '🌊 Ocean' },
                  { id: 'AIR', label: '✈️ Air & Express' },
                  { id: 'GROUND_RAIL', label: '🚆 Ground & Rail' }
                ].map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSupervisorCategory(c.id)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors whitespace-nowrap ${
                      supervisorCategory === c.id
                        ? 'bg-brand-navy text-white shadow-xs'
                        : 'bg-brand-cloud/70 text-brand-slate hover:bg-brand-cloud hover:text-brand-navy'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedDeskFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedDeskFilter === 'ALL'
                      ? 'bg-brand-navy text-white shadow-xs'
                      : 'bg-brand-cloud text-brand-slate hover:bg-brand-marinePale hover:text-brand-navy'
                  }`}
                >
                  All Carrier Desks ({safeQuotes.filter(q => !q._isDemo).length})
                </button>
                {Object.entries(CARRIER_DESK_CONFIG)
                  .filter(([k]) => k !== 'GENERAL' && k !== 'default' && k !== 'General')
                  .filter(([k, desk]) => {
                    if (supervisorCategory === 'ALL') return true
                    return (desk.serviceCategory || 'OCEAN') === supervisorCategory
                  })
                  .map(([key, desk]) => {
                  const deskCount = safeQuotes.filter(q => !q._isDemo && resolveAssignedAgent(q).carrierKey === key).length
                  const active = selectedDeskFilter === key
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDeskFilter(key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        active
                          ? 'bg-brand-marine text-white shadow-xs'
                          : 'bg-brand-cloud text-brand-slate hover:bg-brand-marinePale hover:text-brand-navy'
                      }`}
                    >
                      <span>{key}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-white text-brand-slate'}`}>
                        {deskCount}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tab Bar */}
          <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-brand-line bg-white p-1.5 shadow-sm">
            {TABS.map(tab => {
              const Icon = tab.icon
              const active = activeTab === tab.key
              const badge = tab.key === 'queue' ? pending.length : tab.key === 'booked' ? booked.length : tab.key === 'activity' ? reviewed.length : null
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${active ? 'bg-brand-navy text-white shadow-sm' : 'text-brand-slate hover:text-brand-navy hover:bg-brand-cloud'}`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {badge !== null && badge > 0 && (
                    <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${active ? 'bg-white/20 text-white' : (tab.key === 'booked' ? 'bg-emerald-100 text-emerald-800' : 'bg-brand-cloud text-brand-slate')}`}>
                      {badge}
                    </span>
                  )}
                </button>
              )
            })}
            <div className="ml-auto flex items-center">
              <button onClick={loadData} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-brand-slate hover:bg-brand-cloud hover:text-brand-navy">
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Feed
              </button>
            </div>
          </div>

          {/* BOOKED SHIPMENTS TAB */}
          {activeTab === 'booked' && (
            <div className="space-y-4">
              {booked.length === 0 && (
                <div className="rounded-xl border border-dashed border-brand-line bg-white p-12 text-center">
                  <Ship className="mx-auto mb-3 h-10 w-10 text-emerald-500" />
                  <h4 className="mb-1 text-base font-semibold text-brand-navy">No booked shipments yet</h4>
                  <p className="text-sm text-brand-slate">Quotations confirmed and booked by customers for this carrier desk will appear here with live tracking & slot status.</p>
                </div>
              )}
              {booked.map(q => {
                const assigned = resolveAssignedAgent(q)
                const deskConf = (assigned?.carrierKey && CARRIER_DESK_CONFIG[assigned.carrierKey]) || CARRIER_DESK_CONFIG['General'] || CARRIER_DESK_CONFIG['default'] || {}
                const cardTheme = deskConf?.theme || assigned?.theme || DEFAULT_THEME
                const bookingTs = q.customer_decision?.decided_at || q.updated_at || q.created_at
                const finalCost = q.agent_price_edit?.revised_price > 0 ? Number(q.agent_price_edit.revised_price) : Number(q.indicativeTotal || 0)

                return (
                  <div key={q.id} className="rounded-xl border-2 border-emerald-500/40 bg-white shadow-sm overflow-hidden hover:border-emerald-500 transition-colors">
                    <div className="flex flex-wrap items-start gap-4 border-b border-brand-line px-6 py-4 bg-emerald-50/40">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">{q.id}</span>
                          <span className="font-mono text-xs font-bold text-brand-navy bg-white px-2 py-0.5 rounded border border-brand-line">
                            {q.tn || `TN26-${q.id.replace('QT-', '')}`}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-bold text-white shadow-xs">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Booked & Slot Secured
                          </span>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border shadow-xs ${cardTheme.badgeBg || 'bg-slate-50'} ${cardTheme.badgeText || 'text-slate-700'} ${cardTheme.badgeBorder || 'border-slate-200'}`}>
                            <Ship className="h-3 w-3" /> {assigned?.carrierKey || 'Carrier'} Desk
                          </span>
                        </div>
                        <h4 className="mt-1.5 text-base font-bold text-brand-navy">{q.customer} — {q.laneName}</h4>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-slate">
                          <span className="font-semibold text-brand-navy">Carrier: {assigned?.carrier || 'Carrier Line'}</span>
                          <span>{q.mode}</span>
                          <span>{q.basis}</span>
                          <span>Transit: {q.transit || 'Direct Maritime'}</span>
                          <span className="font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                            Booked Tariff: ₹ {finalCost.toLocaleString('en-IN')}
                          </span>
                          {bookingTs && (
                            <span className="text-slate-400">Booked: {new Date(bookingTs).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/quotes/${q.id}?view=agent`, { state: { from: '/agent' } })}
                          className="flex items-center gap-1.5 rounded-lg border border-brand-line bg-brand-cloud px-3.5 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-marinePale hover:text-brand-marine transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" /> Quote File
                        </button>
                        <button
                          onClick={() => navigate(`/tracking?tn=${encodeURIComponent(q.tn || `TN26-${q.id.replace('QT-', '')}`)}`)}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors"
                        >
                          <Ship className="h-3.5 w-3.5" /> Live Tracking
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* REVIEW QUEUE TAB */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              {pending.length === 0 && (
                <div className="rounded-xl border border-dashed border-brand-line bg-white p-12 text-center">
                  <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-400" />
                  <h4 className="mb-1 text-base font-semibold text-brand-navy">All caught up!</h4>
                  <p className="text-sm text-brand-slate">
                    {isSupervisor && selectedDeskFilter !== 'ALL' 
                      ? `No quotes awaiting review for the ${selectedDeskFilter} desk.` 
                      : `No quotes pending review for ${currentDesk?.deskName || 'this desk'}.`}
                  </p>
                </div>
              )}
              {pending.map(q => {
                const st = getState(q.id)
                const assigned = resolveAssignedAgent(q)
                const deskConf = (assigned?.carrierKey && CARRIER_DESK_CONFIG[assigned.carrierKey]) || CARRIER_DESK_CONFIG['General'] || CARRIER_DESK_CONFIG['default'] || {}
                const cardTheme = deskConf?.theme || assigned?.theme || DEFAULT_THEME

                return (
                  <div key={q.id} className="rounded-xl border border-brand-line bg-white shadow-sm overflow-hidden hover:border-brand-marine/40 transition-colors">
                    {/* Quote header */}
                    <div className="flex flex-wrap items-start gap-4 border-b border-brand-line px-6 py-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-brand-marine">{q.id}</span>
                          <StatusBadge status={resolveEffectiveQuoteStatus(q)} />
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border shadow-xs ${cardTheme.badgeBg || 'bg-slate-50'} ${cardTheme.badgeText || 'text-slate-700'} ${cardTheme.badgeBorder || 'border-slate-200'}`}>
                            <Ship className="h-3 w-3" /> {assigned?.carrierKey || 'General'} Desk
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                            <Clock className="h-3 w-3" /> Awaiting review
                          </span>
                        </div>
                        <h4 className="mt-1.5 text-[15px] font-bold text-brand-navy">{q.customer} — {q.laneName}</h4>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-slate">
                          <span className="font-semibold text-brand-navy">Carrier: {assigned?.carrier || 'Multi-Carrier'}</span>
                          <span>{q.mode}</span>
                          <span>{q.basis}</span>
                          <span>Transit: {q.transit}</span>
                          {q.agent_price_edit && q.agent_price_edit.revised_price > 0 ? (
                            <span className="font-mono font-bold text-emerald-700">
                              Rs.{Number(q.agent_price_edit.revised_price).toLocaleString('en-IN')}
                              <span className="ml-1 text-[10px] font-sans text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Revised</span>
                            </span>
                          ) : q.indicativeTotal ? (
                            <span className="font-mono font-semibold text-brand-navy">Rs.{Number(q.indicativeTotal).toLocaleString('en-IN')}</span>
                          ) : null}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/quotes/${q.id}?view=agent`, { state: { from: '/agent' } })}
                        className="flex items-center gap-1.5 rounded-lg border border-brand-line bg-brand-cloud px-3 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-marinePale hover:text-brand-marine transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" /> View Details
                      </button>
                    </div>

                    {/* Customer Accepted Revision Alert */}
                    {q.agent_price_edit && q.customer_decision?.status === 'ACCEPTED' && q.status !== 'Accepted' && (
                      <div className="mx-6 mt-4 rounded-xl bg-emerald-50 border border-emerald-300 p-4 flex items-center justify-between gap-3 shadow-2xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-950">Customer Accepted Revised Price: ₹{Number(q.agent_price_edit.revised_price).toLocaleString('en-IN')}</span>
                            <span className="rounded-full bg-emerald-200 text-emerald-900 text-[10px] px-2.5 py-0.5 font-bold border border-emerald-300">Action Needed</span>
                          </div>
                          <p className="text-[11px] text-emerald-800 mt-1">Customer accepted your revised tariff. Please review and grant final carrier sign-off or reject using the actions below.</p>
                        </div>
                      </div>
                    )}

                    {/* Comment box (shown when requested) */}
                    {st.showComment && (
                      <div className="bg-brand-cloud/50 px-6 py-4 border-b border-brand-line">
                        <label className="mb-1.5 block text-xs font-semibold text-brand-navy">Comment / Reason</label>
                        <textarea
                          rows={2}
                          value={st.comment}
                          onChange={e => setState(q.id, { comment: e.target.value })}
                          placeholder="Add a note for the customer, customs desk, or admin..."
                          className="w-full rounded-lg border border-brand-line bg-white px-3 py-2 text-xs text-brand-navy focus:border-brand-marine focus:outline-none resize-none"
                        />
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3 px-6 py-4">
                      <button
                        disabled={st.loading}
                        onClick={() => handleAction(q.id, 'approved')}
                        className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 shadow-sm"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Approve for {assigned?.carrierKey || 'Carrier'}
                      </button>
                      <button
                        disabled={st.loading}
                        onClick={() => handleAction(q.id, 'rejected')}
                        className="flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50 shadow-sm"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </button>
                      <button
                        onClick={() => setState(q.id, { showComment: !st.showComment })}
                        className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors ${st.showComment ? 'border-brand-marine bg-brand-marinePale text-brand-marine' : 'border-brand-line text-brand-slate hover:border-brand-marine hover:text-brand-marine'}`}
                      >
                        <MessageSquare className="h-4 w-4" /> {st.showComment ? 'Hide comment' : 'Add comment'}
                      </button>
                      {st.loading && <span className="text-xs text-brand-slateLight animate-pulse">Processing...</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              {reviewed.length === 0 && (
                <div className="rounded-xl border border-dashed border-brand-line bg-white p-12 text-center">
                  <Clock className="mx-auto mb-3 h-10 w-10 text-brand-slateLight" />
                  <h4 className="mb-1 text-base font-semibold text-brand-navy">No activity yet</h4>
                  <p className="text-sm text-brand-slate">Quotes you approve or reject for this desk will appear here.</p>
                </div>
              )}
              {reviewed.map(q => {
                const rev = q.agent_review
                const isApproved = rev?.status === 'approved'
                const assigned = resolveAssignedAgent(q)
                const deskConf = (assigned?.carrierKey && CARRIER_DESK_CONFIG[assigned.carrierKey]) || CARRIER_DESK_CONFIG['General'] || CARRIER_DESK_CONFIG['default'] || {}
                const cardTheme = deskConf?.theme || assigned?.theme || DEFAULT_THEME

                return (
                  <div key={q.id} className="flex flex-wrap items-start gap-4 rounded-xl border border-brand-line bg-white px-6 py-4 shadow-sm">
                    <div className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${isApproved ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                      {isApproved ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-brand-marine">{q.id}</span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border shadow-xs ${cardTheme.badgeBg || 'bg-slate-50'} ${cardTheme.badgeText || 'text-slate-700'} ${cardTheme.badgeBorder || 'border-slate-200'}`}>
                          <Ship className="h-2.5 w-2.5" /> {assigned?.carrierKey || 'General'} Desk
                        </span>
                        <StatusBadge status={resolveEffectiveQuoteStatus(q)} />
                      </div>
                      <div className="mt-1 text-[13px] font-semibold text-brand-navy">{q.customer} — {q.laneName}</div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-brand-slate">
                        <span className="font-semibold text-brand-navy">Carrier: {assigned?.carrier || 'Multi-Carrier'}</span>
                        <span>{q.mode} · {q.basis}</span>
                        {q.indicativeTotal && <span className="font-mono font-semibold text-brand-navy">Rs.{Number(q.indicativeTotal).toLocaleString('en-IN')}</span>}
                      </div>
                      {rev?.comment && (
                        <div className="mt-2 rounded-lg bg-brand-cloud px-3 py-2 text-xs text-brand-slate italic">"{rev.comment}"</div>
                      )}
                      {rev?.reviewed_at && (
                        <div className="mt-1.5 text-[10px] text-brand-slateLight">
                          Reviewed on {new Date(rev.reviewed_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/quotes/${q.id}?view=agent`, { state: { from: '/agent' } })}
                      className="flex items-center gap-1 text-xs font-semibold text-brand-marine hover:underline mt-1"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
              {/* Quote list sidebar - strictly filtered to this desk */}
              <div className="rounded-xl border border-brand-line bg-white overflow-hidden">
                <div className="border-b border-brand-line px-4 py-3 bg-brand-cloud/40">
                  <h4 className="text-sm font-bold text-brand-navy flex items-center justify-between">
                    <span>Quotes ({myDeskQuotes.length})</span>
                    <span className="text-[10px] font-mono text-brand-marine font-semibold">{currentDesk?.carrierKey || 'GENERAL'}</span>
                  </h4>
                </div>
                <div className="divide-y divide-brand-line max-h-[500px] overflow-y-auto">
                  {myDeskQuotes.length === 0 && (
                    <div className="p-6 text-center text-xs text-brand-slateLight">
                      No quotes assigned to this desk yet.
                    </div>
                  )}
                  {myDeskQuotes.map(q => {
                    const qMsgs = messages[q.id] || []
                    const isSelected = selectedQuote?.id === q.id
                    return (
                      <button
                        key={q.id}
                        onClick={() => setSelectedQuote(q)}
                        className={`w-full px-4 py-3 text-left transition-colors ${isSelected ? 'bg-brand-marinePale' : 'hover:bg-brand-cloud'}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-mono text-[11px] font-semibold text-brand-marine">{q.id}</div>
                            <div className="mt-0.5 truncate text-xs font-medium text-brand-navy">{q.customer}</div>
                            <div className="mt-0.5 truncate text-[11px] text-brand-slateLight">{q.laneName}</div>
                          </div>
                          {qMsgs.length > 0 && (
                            <span className="flex-shrink-0 rounded-full bg-brand-marine px-1.5 py-0.5 text-[9px] font-bold text-white">
                              {qMsgs.length}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Chat panel */}
              {selectedQuote ? (
                <div className="flex flex-col rounded-xl border border-brand-line bg-white overflow-hidden" style={{ minHeight: 400 }}>
                  {/* Chat header */}
                  <div className="flex items-center gap-3 border-b border-brand-line px-5 py-3">
                    <div>
                      <div className="font-mono text-xs font-semibold text-brand-marine">{selectedQuote.id}</div>
                      <div className="text-sm font-bold text-brand-navy">{selectedQuote.customer} — {selectedQuote.laneName}</div>
                    </div>
                    <StatusBadge status={resolveEffectiveQuoteStatus(selectedQuote)} />
                  </div>

                  {/* Messages */}
                  <div className="flex-1 space-y-3 overflow-y-auto p-5" style={{ maxHeight: 340 }}>
                    {(messages[selectedQuote.id] || []).length === 0 && (
                      <div className="py-8 text-center text-xs text-brand-slateLight">No messages yet. Start the conversation below.</div>
                    )}
                    {(messages[selectedQuote.id] || []).map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'agent' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.role === 'agent' ? 'bg-brand-navy text-white rounded-br-sm' : 'bg-brand-cloud text-brand-navy rounded-bl-sm'}`}>
                          <div className="text-[10px] font-semibold mb-1 opacity-70">{m.from}</div>
                          {m.text}
                          <div className="mt-1 text-[9px] opacity-50">{new Date(m.ts).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message input */}
                  <div className="border-t border-brand-line p-4">
                    <div className="flex gap-2">
                      <input
                        value={newMsg}
                        onChange={e => setNewMsg(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage(selectedQuote.id)}
                        placeholder="Type a message to the customer..."
                        className="flex-1 rounded-lg border border-brand-line px-3 py-2 text-sm text-brand-navy focus:border-brand-marine focus:outline-none"
                      />
                      <button
                        onClick={() => handleSendMessage(selectedQuote.id)}
                        className="flex items-center gap-1.5 rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-marine transition-colors"
                      >
                        <Send className="h-4 w-4" /> Send
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-xl border border-dashed border-brand-line bg-white p-12 text-center">
                  <div>
                    <MessageSquare className="mx-auto mb-3 h-10 w-10 text-brand-slateLight" />
                    <p className="text-sm text-brand-slate">Select a quote to view or start a conversation</p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </section>
    </>
  )
}

