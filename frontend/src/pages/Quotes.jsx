
function formatRelativeTime(dateInput, fallbackInput) {
  const target = (dateInput && dateInput !== 'Just now') ? dateInput : (fallbackInput && fallbackInput !== 'Just now' ? fallbackInput : null)
  if (!target) return 'Just now'
  const date = new Date(target)
  if (isNaN(date.getTime())) {
    return target
  }
  const now = new Date()
  const diffMs = now - date
  if (diffMs < 0 && Math.abs(diffMs) < 60000) return 'Just now'
  const diffSec = Math.floor(Math.max(0, diffMs) / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay === 1) return 'Yesterday'
  if (diffDay < 7) return `${diffDay}d ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Search, Plus, Lock, Trash2 } from 'lucide-react'
import PageBanner from '../components/PageBanner'
import StatusBadge from '../components/StatusBadge'
import { fetchQuotes, clearAllQuotes, deleteQuote, resolveEffectiveQuoteStatus } from '../lib/api'
import { useApp } from '../context/AppContext'

export default function Quotes() {
  const navigate = useNavigate()
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [laneFilter, setLaneFilter] = useState('All')
  const [modeFilter, setModeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const { user } = useApp()
  const isElevated = user?.role === 'admin' || user?.role === 'agent' || user?.role === 'broker' || user?.role === 'customs_officer' || user?.role === 'agent_operator' || user?.role === 'manager'
  const [activeTab, setActiveTab] = useState(isElevated ? 'all' : 'mine')

  useEffect(() => {
    if (!user) {
      setQuotes([])
      setLoading(false)
      return
    }

    setLoading(true)
    const queryEmail = isElevated ? (activeTab === 'mine' ? user?.email : null) : user?.email

    fetchQuotes(queryEmail).then((res) => {
      let list = Array.isArray(res) ? res : []
      // Normalize effective quote status (ensure booked quotes reflect Accepted)
      list = list.map(q => ({
        ...q,
        status: resolveEffectiveQuoteStatus(q)
      }))
      // Sort newest first
      list.sort((a, b) => {
        const dateA = new Date(a.created_at || a.created || 0)
        const dateB = new Date(b.created_at || b.created || 0)
        return dateB - dateA
      })
      setQuotes(list)
      setLoading(false)
    })
  }, [user, isElevated, activeTab])

  const filteredQuotes = useMemo(() => {
    const userEmail = (user?.email || '').trim().toLowerCase()

    return quotes.filter((q) => {
      // STRICT FILTER: Regular customers strictly see ONLY their own quotes
      if (!isElevated) {
        if (!userEmail) return false
        const qEmail = (q.user_email || '').trim().toLowerCase()
        if (qEmail !== userEmail) return false
      } else if (activeTab === 'mine' && userEmail) {
        const qEmail = (q.user_email || '').trim().toLowerCase()
        if (qEmail !== userEmail) return false
      }

      const matchSearch =
        !search ||
        q.id.toLowerCase().includes(search.toLowerCase()) ||
        (q.customer && q.customer.toLowerCase().includes(search.toLowerCase())) ||
        (q.laneName && q.laneName.toLowerCase().includes(search.toLowerCase())) ||
        (q.laneCode && q.laneCode.toLowerCase().includes(search.toLowerCase()))

      const matchLane = laneFilter === 'All' || q.region === laneFilter
      const matchMode = modeFilter === 'All' || q.mode.toLowerCase().includes(modeFilter.toLowerCase())
      
      const qStatus = resolveEffectiveQuoteStatus(q).toLowerCase()
      const sf = statusFilter.toLowerCase()
      const matchStatus = 
        statusFilter === 'All' ||
        qStatus === sf ||
        (sf === 'draft' && (qStatus === 'draft' || qStatus === 'quoted' || qStatus.includes('awaiting'))) ||
        (sf === 'approved' && (qStatus === 'approved' || qStatus === 'agent approved')) ||
        (sf === 'accepted' && (qStatus === 'accepted' || qStatus === 'booked')) ||
        (sf === 'rejected' && (qStatus.includes('reject') || qStatus === 'declined')) ||
        (sf === 'documents requested' && qStatus.includes('doc'))

      return matchSearch && matchLane && matchMode && matchStatus
    })
  }, [quotes, search, laneFilter, modeFilter, statusFilter, activeTab, user, isElevated])

  return (
    <>
      <PageBanner
        crumb={isElevated ? "Quotations" : "My Quotations"}
        title={isElevated ? "Quotations Workbench" : "My Quotations"}
        subtitle={
          isElevated
            ? "Manage, filter and review calculated freight quotations across global trade lanes."
            : `Confidential freight quotations for ${user?.email || 'your account'}. Review pricing, accept routes, and manage booking requests.`
        }
        icon={FileText}
      />
      
      <section className="pt-10 pb-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          
          {!user ? (
            <div className="rounded-lg2 border border-brand-line bg-white p-12 text-center shadow-sm2 max-w-lg mx-auto my-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-marinePale text-brand-marine">
                <Lock className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-brand-navy">Sign In to View Your Quotations</h2>
              <p className="mt-2 text-xs text-brand-slate leading-relaxed">
                Quotations are confidential and strictly scoped to individual verified user accounts. Please log in or register to access your calculated rates and bookings.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => navigate('/login?redirect=/quotes')}
                  className="w-full sm:w-auto rounded-xl bg-brand-navy px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-navy/90 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate('/login?tab=signup&redirect=/quotes')}
                  className="w-full sm:w-auto rounded-xl border border-brand-line bg-brand-cloud px-6 py-2.5 text-xs font-semibold text-brand-navy hover:bg-brand-marinePale transition-colors"
                >
                  Create Account
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-4 mb-7 md:grid-cols-4">
                <KpiCard
                  label={isElevated ? "Quotes loaded" : "My Quotes"}
                  value={quotes.length.toString()}
                  delta={isElevated ? "Active in system" : "Active in your account"}
                  deltaType="up"
                />
                <KpiCard
                  label="Ocean FCL quotes"
                  value={quotes.filter(q => q.mode?.toLowerCase().includes('ocean')).length.toString()}
                  delta="Ocean transport"
                  deltaType="up"
                />
                <KpiCard
                  label="Air Freight quotes"
                  value={quotes.filter(q => q.mode?.toLowerCase().includes('air')).length.toString()}
                  delta="Air express transport"
                />
                <KpiCard
                  label="Calculated routes"
                  value={(quotes.length * 3).toString()}
                  delta="3 options per quote"
                  deltaType="up"
                />
              </div>

              {/* Table Container */}
              <div className="rounded-lg2 border border-brand-line bg-white shadow-sm2 overflow-hidden">
                
                {/* Filters bar */}
                <div className="p-6 border-b border-brand-line bg-white">
                  {/* Tab Selector — Only visible to elevated staff */}
                  {isElevated && (
                    <div className="flex items-center gap-2 mb-4 border-b border-brand-line/50 pb-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('all')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          activeTab === 'all'
                            ? 'bg-brand-navy text-white shadow-xs'
                            : 'text-brand-slate hover:text-brand-navy hover:bg-brand-cloud'
                        }`}
                      >
                        All Quotations ({quotes.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('mine')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          activeTab === 'mine'
                            ? 'bg-brand-navy text-white shadow-xs'
                            : 'text-brand-slate hover:text-brand-navy hover:bg-brand-cloud'
                        }`}
                      >
                        My Assigned ({quotes.filter(q => (q.user_email || '').toLowerCase() === (user?.email || '').toLowerCase()).length})
                      </button>
                    </div>
                  )}

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[220px] max-w-[320px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-slateLight" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Quote no, customer, lane…"
                    className="w-full rounded-[10px] border-[1.5px] border-brand-line pl-10 pr-4 py-2.5 text-xs font-medium text-brand-navy focus:border-brand-marine focus:outline-none"
                  />
                </div>

                <select
                  value={laneFilter}
                  onChange={(e) => setLaneFilter(e.target.value)}
                  className="rounded-[10px] border-[1.5px] border-brand-line px-3.5 py-2.5 text-xs font-medium bg-white text-brand-navy focus:border-brand-marine"
                >
                  <option value="All">All lanes</option>
                  <option value="Asia–Europe">Asia–Europe</option>
                  <option value="Middle East">Middle East</option>
                  <option value="Intra-Asia">Intra-Asia</option>
                  <option value="India–India">Domestic (India–India)</option>
                </select>

                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="rounded-[10px] border-[1.5px] border-brand-line px-3.5 py-2.5 text-xs font-medium bg-white text-brand-navy focus:border-brand-marine"
                >
                  <option value="All">All modes</option>
                  <option value="ocean">Ocean FCL</option>
                  <option value="air">Air Freight</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-[10px] border-[1.5px] border-brand-line px-3.5 py-2.5 text-xs font-medium bg-white text-brand-navy focus:border-brand-marine"
                >
                  <option value="All">All statuses</option>
                  <option value="Draft">Draft / Quoted</option>
                  <option value="Approved">Approved</option>
                  <option value="Accepted">Accepted / Booked</option>
                  <option value="Documents Requested">Documents Requested</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button
                  type="button"
                  onClick={() => { setSearch(''); setLaneFilter('All'); setModeFilter('All'); setStatusFilter('All'); setActiveTab(isElevated ? 'all' : 'mine') }}
                  className="rounded-[10px] border-[1.5px] border-brand-line px-4 py-2.5 text-xs font-semibold text-brand-slate hover:bg-brand-cloud"
                  title="Reset search and filter selections"
                >
                  Reset Filters
                </button>

                {isElevated && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to clear all registered quotes? Counters will reset to zero.')) {
                        await clearAllQuotes()
                        setQuotes([])
                      }
                    }}
                    className="rounded-[10px] border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs"
                  >
                    Clear All Quotes
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => navigate('/ship')}
                  className="ml-auto inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-br from-brand-orange to-brand-orangeLight px-4 py-2.5 text-xs font-semibold text-white shadow-xs"
                >
                  <Plus className="h-4 w-4" /> New enquiry
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-cloud text-brand-slate font-display text-[11px] uppercase tracking-wider border-b border-brand-line">
                    <th className="py-3.5 px-5">Quote no</th>
                    <th className="py-3.5 px-5">Customer</th>
                    <th className="py-3.5 px-5">Lane</th>
                    <th className="py-3.5 px-5">Mode</th>
                    <th className="py-3.5 px-5">Basis</th>
                    <th className="py-3.5 px-5">Transit</th>
                    <th className="py-3.5 px-5">Indicative total</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5">Created</th>
                    <th className="py-3.5 px-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-line/60 font-medium text-brand-navy">
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-brand-slate">Loading quotations…</td>
                    </tr>
                  ) : filteredQuotes.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center">
                        <div className="mx-auto max-w-sm">
                          <FileText className="mx-auto h-9 w-9 text-brand-slateLight mb-2.5 opacity-70" />
                          <div className="font-bold text-brand-navy text-sm">No quotations found for your account</div>
                          <div className="text-xs text-brand-slate mt-1 mb-4 leading-relaxed">
                            {search || laneFilter !== 'All' || modeFilter !== 'All' || statusFilter !== 'All'
                              ? 'No quotations match the active filter criteria. Try clearing search filters.'
                              : `You haven't generated any quotations under ${user?.email || 'this account'} yet.`}
                          </div>
                          <button
                            type="button"
                            onClick={() => navigate('/ship')}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orangeLight px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:opacity-95 transition-opacity"
                          >
                            <Plus className="h-4 w-4" /> Calculate New Quote
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredQuotes.map((q) => (
                      <tr key={q.id} className="hover:bg-brand-cloud/70 transition-colors">
                        <td className="py-4 px-5 font-mono font-bold text-brand-marine">{q.id}</td>
                        <td className="py-4 px-5">
                          <div className="font-semibold text-brand-navy">{q.customer}</div>
                          <div className="text-[11px] text-brand-slateLight">{q.city}</div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="font-mono font-semibold text-brand-navy">{q.laneCode}</div>
                          <div className="text-[11px] text-brand-slateLight">{q.laneName}</div>
                        </td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                            q.modeKey === 'air' ? 'bg-brand-orangePale text-brand-orange' : 'bg-brand-marinePale text-brand-marine'
                          }`}>
                            {q.mode}
                          </span>
                        </td>
                        <td className="py-4 px-5 font-mono">{q.basis}</td>
                        <td className="py-4 px-5">{q.transit}</td>
                        <td className="py-4 px-5 font-mono font-bold text-brand-navy">
                          {q.indicativeTotal ? `₹ ${q.indicativeTotal.toLocaleString('en-IN')}` : 'Not serviced'}
                        </td>
                        <td className="py-4 px-5">
                          <StatusBadge status={resolveEffectiveQuoteStatus(q)} />
                        </td>
                        <td className="py-4 px-5 text-brand-slateLight">{formatRelativeTime(q.created_at, q.created)}</td>
                        <td className="py-4 px-5 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/quotes/${q.id}`, { state: { from: '/quotes', fromLabel: 'Back to Quotations' } })}
                              className="rounded-lg border-[1.5px] border-brand-line bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-navy hover:border-brand-marine shadow-xs"
                            >
                              Open
                            </button>
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.stopPropagation()
                                if (window.confirm(`Are you sure you want to delete quotation ${q.id}? This cannot be undone.`)) {
                                  await deleteQuote(q.id)
                                  setQuotes(prev => prev.filter(item => item.id !== q.id))
                                }
                              }}
                              title={`Delete ${q.id}`}
                              className="rounded-lg border border-brand-line bg-white p-1.5 text-brand-slateLight hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-2xs"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between p-5 border-t border-brand-line text-xs text-brand-slate">
              <span>Showing 1–{filteredQuotes.length} of {quotes.length}</span>
              <div className="flex gap-2">
                <button className="rounded-lg border border-brand-line px-3.5 py-1.5 hover:bg-brand-cloud disabled:opacity-40" disabled>← Prev</button>
                <button className="rounded-lg border border-brand-line px-3.5 py-1.5 hover:bg-brand-cloud disabled:opacity-40" disabled>Next →</button>
              </div>
            </div>

          </div>
          </>
        )}

        </div>
      </section>
    </>
  )
}

function KpiCard({ label, value, delta, deltaType }) {
  return (
    <div className="rounded-lg2 border border-brand-line bg-white p-6 shadow-sm2">
      <div className="text-[11px] font-semibold text-brand-slate uppercase tracking-wide">{label}</div>
      <div className="font-display text-[26px] font-bold text-brand-navy my-1">{value}</div>
      <div className={`text-xs font-semibold ${
        deltaType === 'up' ? 'text-brand-success' : deltaType === 'down' ? 'text-brand-danger' : 'text-brand-slate'
      }`}>
        {delta}
      </div>
    </div>
  )
}
