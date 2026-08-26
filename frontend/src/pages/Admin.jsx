import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  LayoutDashboard, Route, FileText, Package, ChevronRight, CheckCircle2,
  XCircle, Clock, AlertTriangle, DollarSign, Ship, Plane, Truck, RefreshCw,
  Eye, Database, Users, UserPlus, ShieldCheck, UserCheck, Building, Key,
  Trash2, Edit3, Filter, Check, X, Lock, Plus, Search, Shield, LogOut
} from 'lucide-react'
import PageBanner from '../components/PageBanner'
import StatusBadge from '../components/StatusBadge'
import AdminMasterData from '../components/AdminMasterData'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import {
  fetchAllQuotes, fetchShipments, fetchAllUsers,
  adminCreateUser, adminUpdateUser, adminDeleteUser,
  agentActionOnQuote
} from '../lib/api'
import { routeAnalytics } from '../lib/mockData'

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'users', label: 'User Management', icon: Users },
  { key: 'masterdata', label: 'Master Database', icon: Database },
  { key: 'routes', label: 'Route Management', icon: Route },
  { key: 'quotes', label: 'Quotes', icon: FileText },
  { key: 'shipments', label: 'Shipments', icon: Package },
]


function getAgentDisplayName(agent) {
  if (!agent || agent === 'Unassigned' || agent === 'unassigned') return 'Unassigned'
  if (agent.includes('@')) {
    const prefix = agent.split('@')[0].toLowerCase()
    if (prefix === 'agent') return 'Rajesh Kumar'
    if (prefix === 'agentop') return 'Alex Chen'
    if (prefix === 'customs') return 'Kavita Menon'
    if (prefix === 'admin') return 'Priya Sharma'
    return prefix.charAt(0).toUpperCase() + prefix.slice(1)
  }
  return agent
}
function AgentReviewBadge({ review }) {
  if (!review || review.status === 'pending' || !review.status) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 border border-amber-200">
        <Clock className="h-3 w-3" /> Pending
      </span>
    )
  }
  if (review.status === 'approved') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="h-3 w-3" /> Approved
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 border border-red-200">
      <XCircle className="h-3 w-3" /> Rejected
    </span>
  )
}

function RoleBadge({ role }) {
  const r = (role || 'customer').toLowerCase()
  if (r === 'admin') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 border border-amber-200">
        <Shield className="h-3 w-3 text-amber-600" /> Admin / Manager
      </span>
    )
  }
  if (r === 'agent' || r === 'broker') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-800 border border-purple-200">
        <UserCheck className="h-3 w-3 text-purple-600" /> Broker / Agent
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-800 border border-blue-200">
      <Building className="h-3 w-3 text-blue-600" /> Shipper / User
    </span>
  )
}

const MOCK_ROUTES = [
  { id: 'R001', origin: 'INNSA', dest: 'AEJEA', lane: 'Mumbai -> Dubai', mode: 'Ocean FCL', carriers: 4, transit: '6-10 d', vol: 412, onTime: 96, active: true },
  { id: 'R002', origin: 'INNSA', dest: 'NLRTM', lane: 'Mumbai -> Rotterdam', mode: 'Ocean FCL', carriers: 3, transit: '24-28 d', vol: 318, onTime: 93, active: true },
  { id: 'R003', origin: 'BOM', dest: 'DXB', lane: 'Mumbai -> Dubai', mode: 'Air Freight', carriers: 5, transit: '5-7 d', vol: 142, onTime: 97, active: true },
  { id: 'R004', origin: 'INNSA', dest: 'SGSIN', lane: 'Mumbai -> Singapore', mode: 'Ocean LCL', carriers: 3, transit: '11-16 d', vol: 276, onTime: 98, active: true },
  { id: 'R005', origin: 'MAA', dest: 'DEHAM', lane: 'Chennai -> Hamburg', mode: 'Ocean FCL', carriers: 2, transit: '26-31 d', vol: 184, onTime: 91, active: false },
  { id: 'R006', origin: 'INNSA', dest: 'PECLL', lane: 'Mumbai -> Callao', mode: 'Ocean FCL', carriers: 1, transit: 'TBD', vol: 6, onTime: null, active: false },
]

export default function Admin() {
  const { user, loggedIn, logout } = useApp()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  const toast = useToast()
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'overview')
  const [quotes, setQuotes] = useState([])
  const [shipments, setShipments] = useState([])
  const [usersList, setUsersList] = useState([])
  const [routes, setRoutes] = useState(MOCK_ROUTES)
  const [loading, setLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(false)

  // Sync active tab if URL parameter changes
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    setSearchParams(newTab === 'overview' ? {} : { tab: newTab })
  }

  // Search & Filter states
  const [quoteSearch, setQuoteSearch] = useState('')
  const [inspectQuote, setInspectQuote] = useState(null)

  const handleApproveQuote = async (quoteId) => {
    try {
      await agentActionOnQuote(quoteId, 'approved', 'Approved by Operations Admin', user)
      setQuotes(prev => prev.map(q => q.id === quoteId ? {
        ...q,
        status: 'Ready',
        agent_review: {
          status: 'approved',
          comment: 'Approved by Operations Admin',
          reviewed_at: new Date().toISOString()
        }
      } : q))
      if (inspectQuote && inspectQuote.id === quoteId) {
        setInspectQuote(prev => ({
          ...prev,
          status: 'Ready',
          agent_review: {
            status: 'approved',
            comment: 'Approved by Operations Admin',
            reviewed_at: new Date().toISOString()
          }
        }))
      }
      toast(`Quote ${quoteId} APPROVED successfully! Status set to Ready.`)
    } catch (err) {
      toast('Failed to approve quote')
    }
  }

  const handleRejectQuote = async (quoteId) => {
    try {
      await agentActionOnQuote(quoteId, 'rejected', 'Rejected by Operations Admin', user)
      setQuotes(prev => prev.map(q => q.id === quoteId ? {
        ...q,
        status: 'Rejected',
        agent_review: {
          status: 'rejected',
          comment: 'Rejected by Operations Admin',
          reviewed_at: new Date().toISOString()
        }
      } : q))
      if (inspectQuote && inspectQuote.id === quoteId) {
        setInspectQuote(prev => ({
          ...prev,
          status: 'Rejected',
          agent_review: {
            status: 'rejected',
            comment: 'Rejected by Operations Admin',
            reviewed_at: new Date().toISOString()
          }
        }))
      }
      toast(`Quote ${quoteId} REJECTED. Status set to Blocked/Rejected.`)
    } catch (err) {
      toast('Failed to reject quote')
    }
  }
  const [shipSearch, setShipSearch] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('ALL')

  // Create User Modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    role: 'customer',
    phone: '',
  })
  const [creatingUser, setCreatingUser] = useState(false)

  const isAdmin = user?.role === 'admin'

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [q, s, u] = await Promise.all([
        fetchAllQuotes(),
        fetchShipments(''),
        fetchAllUsers(),
      ])
      setQuotes(Array.isArray(q) ? q : [])
      setShipments(Array.isArray(s) ? s : [])
      setUsersList(Array.isArray(u) ? u : [])
    } catch {
      // Graceful fallback to seeded dashboard
    } finally {
      setLoading(false)
    }
  }, [])

  const reloadUsers = useCallback(async () => {
    setUsersLoading(true)
    try {
      const u = await fetchAllUsers()
      setUsersList(Array.isArray(u) ? u : [])
    } catch (err) {
      console.warn('Failed to reload users:', err)
    } finally {
      setUsersLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // Handlers for User Management
  const handleCreateUser = async (e) => {
    e.preventDefault()
    if (!newUserForm.name.trim() || !newUserForm.email.trim() || !newUserForm.password.trim()) {
      toast('Please fill all required fields (Name, Email, Password).')
      return
    }
    setCreatingUser(true)
    try {
      await adminCreateUser(newUserForm)
      toast(`User "${newUserForm.name}" created successfully as ${newUserForm.role.toUpperCase()}!`)
      setShowCreateModal(false)
      setNewUserForm({
        name: '',
        company: '',
        email: '',
        password: '',
        role: 'customer',
        phone: '',
      })
      await reloadUsers()
    } catch (err) {
      toast(err.message || 'Failed to create user')
    } finally {
      setCreatingUser(false)
    }
  }

  const handleRoleChange = async (email, newRole) => {
    try {
      await adminUpdateUser(email, { role: newRole })
      setUsersList(prev => prev.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, role: newRole } : u))
      toast(`Role for ${email} updated to ${newRole.toUpperCase()}`)
    } catch (err) {
      toast('Failed to update role')
    }
  }

  const handleToggleStatus = async (email, currentActive) => {
    try {
      await adminUpdateUser(email, { active: !currentActive })
      setUsersList(prev => prev.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, active: !currentActive } : u))
      toast(`Account ${email} is now ${!currentActive ? 'Active' : 'Inactive'}`)
    } catch (err) {
      toast('Failed to toggle status')
    }
  }

  const handleDeleteUser = async (email, name) => {
    if (email === 'admin@portline.in') {
      toast('The primary Administrator account cannot be removed.')
      return
    }
    if (!window.confirm(`Are you sure you want to remove user "${name || email}"?`)) return

    try {
      await adminDeleteUser(email)
      setUsersList(prev => prev.filter(u => u.email.toLowerCase() !== email.toLowerCase()))
      toast(`User ${email} removed`)
    } catch (err) {
      toast('Failed to delete user')
    }
  }

  if (!loggedIn || !isAdmin) {
    return (
      <>
        <PageBanner crumb="Admin" title="Admin Panel" subtitle="System management and operations dashboard." icon={LayoutDashboard} />
        <section className="pt-14 pb-20">
          <div className="mx-auto max-w-[1220px] px-8 sm:px-5">
            <div className="mx-auto max-w-[460px] rounded-2xl border border-brand-line bg-white px-9 py-11 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-brand-navy">Admin Access Required</h3>
              <p className="mb-2 text-sm text-brand-slate">This area is restricted to PORTLINE administrators.</p>
              <p className="mb-6 font-mono text-xs text-brand-slateLight">Login: admin@portline.in / admin123</p>
              <button onClick={() => navigate('/login')} className="rounded-xl bg-brand-navy px-6 py-3 text-sm font-semibold text-white hover:bg-brand-marine">
                Log in as Admin
              </button>
            </div>
          </div>
        </section>
      </>
    )
  }

  const totalRevenue = quotes.reduce((s, q) => s + (Number(q.indicativeTotal) || 0), 0)
  const pendingCount = quotes.filter(q => !q.agent_review || q.agent_review.status === 'pending').length

  const filteredQuotes = quotes.filter(q => {
    if (!quoteSearch) return true
    const s = quoteSearch.toLowerCase()
    return (q.id || '').toLowerCase().includes(s) || (q.customer || '').toLowerCase().includes(s) || (q.laneName || '').toLowerCase().includes(s)
  })

  const filteredShipments = shipments.filter(s => {
    if (!shipSearch) return true
    const q = shipSearch.toLowerCase()
    return (s.tn || '').toLowerCase().includes(q) || (s.from || '').toLowerCase().includes(q) || (s.to || '').toLowerCase().includes(q)
  })

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = !userSearch || (
      (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.company || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.role || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phone || '').includes(userSearch)
    )
    const matchesRole = userRoleFilter === 'ALL' || (
      userRoleFilter === 'CUSTOMER' && (u.role === 'customer' || !u.role)
    ) || (
      userRoleFilter === 'AGENT' && (u.role === 'agent' || u.role === 'broker')
    ) || (
      userRoleFilter === 'ADMIN' && u.role === 'admin'
    )
    return matchesSearch && matchesRole
  })

  const customerCount = usersList.filter(u => u.role === 'customer' || !u.role).length
  const agentCount = usersList.filter(u => u.role === 'agent' || u.role === 'broker').length
  const adminRoleCount = usersList.filter(u => u.role === 'admin').length

  return (
    <>
      <PageBanner
        crumb="Admin Panel"
        title="Operations & Management Console"
        subtitle="Manage users, master data, trade routes, quotes, shipments and approval rules."
        icon={LayoutDashboard}
      />

      <section className="pt-10 pb-20">
        <div className="mx-auto max-w-[1220px] px-8 sm:px-5">

          {/* ADMIN SESSION & LOGOUT BAR */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-line bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white font-display text-sm font-bold shadow-xs">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-bold text-brand-navy">{user?.name || 'Administrator'}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10.5px] font-bold text-amber-800 border border-amber-200">
                    <Shield className="h-3 w-3 text-amber-600" /> Platform Admin
                  </span>
                </div>
                <div className="text-[11px] text-brand-slate font-mono">{user?.email || 'admin@portline.in'} · {user?.company || 'PORTLINE Operations'}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                className="flex items-center gap-1.5 rounded-xl border border-brand-line bg-brand-cloud/50 px-3.5 py-2 text-xs font-semibold text-brand-slate hover:bg-brand-cloud hover:text-brand-navy transition-colors"
                title="Refresh All Data"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={() => {
                  logout()
                  toast('Logged out successfully')
                  navigate('/login')
                }}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/80 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 hover:text-red-800 transition-colors shadow-xs"
                title="Log out of Admin Console"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* TOP KPI STRIP */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <KpiCard icon={DollarSign} label="Pipeline Revenue" value={`Rs.${(totalRevenue / 100000).toFixed(1)}L`} colorClass="bg-emerald-50 text-emerald-600" />
            <KpiCard icon={Clock} label="Pending Review" value={pendingCount} colorClass="bg-amber-50 text-amber-600" />
            <KpiCard icon={Users} label="Total Users" value={usersList.length} colorClass="bg-blue-50 text-blue-600" />
            <KpiCard icon={Route} label="Active Routes" value={routes.filter(r => r.active).length} colorClass="bg-purple-50 text-purple-600" />
          </div>

          {/* TAB NAV */}
          <div className="mb-6 flex flex-wrap gap-2 border-b border-brand-line pb-3">
            {TABS.map(tab => {
              const Icon = tab.icon
              const active = activeTab === tab.key
              let badge = null
              if (tab.key === 'quotes' && pendingCount > 0) badge = pendingCount
              if (tab.key === 'users') badge = usersList.length
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-brand-navy text-white shadow-xs'
                      : 'border border-brand-line bg-white text-brand-slate hover:bg-brand-cloud hover:text-brand-navy'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {badge !== null && (
                    <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${active ? 'bg-white/20 text-white' : 'bg-brand-cloud text-brand-slate'}`}>
                      {badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <button
                  onClick={() => handleTabChange('users')}
                  className="flex items-center gap-4 rounded-xl border border-brand-line bg-white p-5 text-left transition-all hover:border-brand-marine hover:shadow-sm group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <UserPlus className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-brand-navy">User Management</div>
                    <div className="text-xs text-brand-slate">{usersList.length} users registered (Shippers, Agents, Admins)</div>
                  </div>
                </button>

                <button
                  onClick={() => handleTabChange('masterdata')}
                  className="flex items-center gap-4 rounded-xl border border-brand-line bg-white p-5 text-left transition-all hover:border-brand-marine hover:shadow-sm group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-brand-navy">Master Database Explorer</div>
                    <div className="text-xs text-brand-slate">534 live records across 20 MongoDB collections</div>
                  </div>
                </button>

                <button
                  onClick={() => handleTabChange('quotes')}
                  className="flex items-center gap-4 rounded-xl border border-brand-line bg-white p-5 text-left transition-all hover:border-brand-marine hover:shadow-sm group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-brand-navy">Quotes & Approvals</div>
                    <div className="text-xs text-brand-slate">{pendingCount} quotes pending agent/manager review</div>
                  </div>
                </button>
              </div>

              {/* Performance Analytics Strip */}
              <div className="rounded-xl border border-brand-line bg-white p-6">
                <div className="flex items-center justify-between border-b border-brand-line pb-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-brand-navy">Lane Performance & Transit Scoreboard</h3>
                    <p className="text-xs text-brand-slate">Real-time statistics across active freight corridors</p>
                  </div>
                  <button onClick={loadData} className="flex items-center gap-1 text-xs text-brand-marine hover:underline">
                    <RefreshCw className="h-3.5 w-3.5" /> Refresh
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-brand-cloud/40 p-4 border border-brand-line/50">
                    <div className="text-xs text-brand-slate">Overall On-Time Delivery</div>
                    <div className="font-display text-2xl font-bold text-brand-navy mt-1">94.8%</div>
                    <div className="text-[11px] text-emerald-600 mt-0.5">↑ +1.2% this month</div>
                  </div>
                  <div className="rounded-lg bg-brand-cloud/40 p-4 border border-brand-line/50">
                    <div className="text-xs text-brand-slate">Average Ocean Transit</div>
                    <div className="font-display text-2xl font-bold text-brand-navy mt-1">16.4 Days</div>
                    <div className="text-[11px] text-brand-slateLight mt-0.5">Top 50 global trade lanes</div>
                  </div>
                  <div className="rounded-lg bg-brand-cloud/40 p-4 border border-brand-line/50">
                    <div className="text-xs text-brand-slate">Quote Conversion Rate</div>
                    <div className="font-display text-2xl font-bold text-brand-navy mt-1">68.2%</div>
                    <div className="text-[11px] text-emerald-600 mt-0.5">From enquiry to booking</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USER MANAGEMENT TAB */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              
              {/* Top User Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="rounded-xl border border-brand-line bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-brand-slate">Total Registered Users</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold">
                      <Users className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="font-display text-2xl font-bold text-brand-navy">{usersList.length}</div>
                  <div className="text-[11px] text-emerald-600 mt-0.5">All customer, broker & admin accounts</div>
                </div>

                <div className="rounded-xl border border-brand-line bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-brand-slate">Shippers / Customers</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 font-bold">
                      <Building className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="font-display text-2xl font-bold text-brand-navy">{customerCount}</div>
                  <div className="text-[11px] text-brand-slateLight mt-0.5">External shipper portal access</div>
                </div>

                <div className="rounded-xl border border-brand-line bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-brand-slate">Brokers / Agents</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 font-bold">
                      <UserCheck className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="font-display text-2xl font-bold text-brand-navy">{agentCount}</div>
                  <div className="text-[11px] text-purple-600 mt-0.5">Quotation evaluation workbench</div>
                </div>

                <div className="rounded-xl border border-brand-line bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-brand-slate">Pricing Admins</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 font-bold">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="font-display text-2xl font-bold text-brand-navy">{adminRoleCount}</div>
                  <div className="text-[11px] text-amber-600 mt-0.5">Full governance & approval access</div>
                </div>
              </div>

              {/* Filter, Search & Create User Strip */}
              <div className="rounded-xl border border-brand-line bg-white p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-brand-slateLight" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    placeholder="Search user name, email, company, role, or phone..."
                    className="w-full rounded-xl border border-brand-line pl-9 pr-8 py-2 text-xs text-brand-navy focus:border-brand-marine focus:outline-none"
                  />
                  {userSearch && (
                    <button onClick={() => setUserSearch('')} className="absolute right-2.5 top-2.5 text-xs text-brand-slate hover:text-brand-navy">×</button>
                  )}
                </div>

                {/* Filter Pills & Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center rounded-lg border border-brand-line bg-brand-cloud/40 p-1 text-xs">
                    <button
                      onClick={() => setUserRoleFilter('ALL')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${userRoleFilter === 'ALL' ? 'bg-brand-navy text-white' : 'text-brand-slate hover:text-brand-navy'}`}
                    >
                      All ({usersList.length})
                    </button>
                    <button
                      onClick={() => setUserRoleFilter('CUSTOMER')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${userRoleFilter === 'CUSTOMER' ? 'bg-blue-600 text-white' : 'text-brand-slate hover:text-brand-navy'}`}
                    >
                      Customers ({customerCount})
                    </button>
                    <button
                      onClick={() => setUserRoleFilter('AGENT')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${userRoleFilter === 'AGENT' ? 'bg-purple-600 text-white' : 'text-brand-slate hover:text-brand-navy'}`}
                    >
                      Agents ({agentCount})
                    </button>
                    <button
                      onClick={() => setUserRoleFilter('ADMIN')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${userRoleFilter === 'ADMIN' ? 'bg-amber-600 text-white' : 'text-brand-slate hover:text-brand-navy'}`}
                    >
                      Admins ({adminRoleCount})
                    </button>
                  </div>

                  <button
                    onClick={reloadUsers}
                    className="flex items-center gap-1.5 rounded-xl border border-brand-line bg-white px-3 py-2 text-xs font-semibold text-brand-slate hover:bg-brand-cloud"
                    title="Reload users"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${usersLoading ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orangeLight px-4 py-2 text-xs font-semibold text-white shadow-xs hover:shadow-sm transition-all"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Create New User</span>
                  </button>
                </div>

              </div>

              {/* Users Data Table */}
              <div className="rounded-xl border border-brand-line bg-white overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-brand-line bg-brand-cloud/50 text-[11px] font-semibold text-brand-slate uppercase tracking-wider">
                        <th className="px-5 py-3.5">User Profile</th>
                        <th className="px-5 py-3.5">Company / Shipper</th>
                        <th className="px-5 py-3.5">Role & Access</th>
                        <th className="px-5 py-3.5">Contact Phone</th>
                        <th className="px-5 py-3.5">Account Status</th>
                        <th className="px-5 py-3.5">Registered / Joined</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-line/50">
                      {filteredUsers.map((u, i) => {
                        const initials = (u.name || u.email || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                        const roleLower = (u.role || 'customer').toLowerCase()
                        const avatarBg = roleLower === 'admin' ? 'bg-amber-500 text-white' : roleLower === 'agent' ? 'bg-purple-600 text-white' : 'bg-brand-navy text-white'

                        return (
                          <tr key={u.email || i} className="hover:bg-brand-cloud/30 transition-colors">
                            {/* User details */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className={`flex h-9 w-9 items-center justify-center rounded-xl font-display text-xs font-bold shadow-xs ${avatarBg}`}>
                                  {initials}
                                </div>
                                <div>
                                  <div className="font-bold text-brand-navy text-xs flex items-center gap-2">
                                    <span>{u.name || 'User'}</span>
                                    {u.created === 'Recent' && (
                                      <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                                        NEW
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-brand-slate font-mono">{u.email}</div>
                                </div>
                              </div>
                            </td>

                            {/* Company */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-1.5 text-xs text-brand-navy font-medium">
                                <Building className="h-3.5 w-3.5 text-brand-slateLight flex-shrink-0" />
                                <span>{u.company || 'Enterprise Shipper'}</span>
                              </div>
                            </td>

                            {/* Role with selector */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <RoleBadge role={u.role} />
                                <select
                                  value={roleLower}
                                  onChange={(e) => handleRoleChange(u.email, e.target.value)}
                                  className="rounded-lg border border-brand-line bg-white px-2 py-1 text-[11px] text-brand-navy font-medium focus:border-brand-marine focus:outline-none"
                                  title="Change role"
                                >
                                  <option value="customer">Shipper (User)</option>
                                  <option value="agent">Broker (Agent)</option>
                                  <option value="admin">Pricing Admin</option>
                                </select>
                              </div>
                            </td>

                            {/* Phone */}
                            <td className="px-5 py-3.5 text-xs text-brand-slate font-mono">
                              {u.phone || <span className="italic text-brand-slateLight">N/A</span>}
                            </td>

                            {/* Status Toggle */}
                            <td className="px-5 py-3.5">
                              <button
                                onClick={() => handleToggleStatus(u.email, u.active !== false)}
                                className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold transition-colors border ${
                                  u.active !== false
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                {u.active !== false ? '● Active' : '○ Inactive'}
                              </button>
                            </td>

                            {/* Registered */}
                            <td className="px-5 py-3.5 text-xs text-brand-slate">
                              {u.created || u.since || 'Active'}
                            </td>

                            {/* Delete/Actions */}
                            <td className="px-5 py-3.5 text-right">
                              <button
                                onClick={() => handleDeleteUser(u.email, u.name)}
                                className="rounded-lg p-1 text-brand-slateLight hover:bg-red-50 hover:text-red-600 transition-colors"
                                title="Delete user"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        )
                      })}

                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-xs text-brand-slate">
                            <Users className="mx-auto mb-2 h-8 w-8 text-brand-slateLight opacity-40" />
                            <p className="font-semibold text-brand-navy">No users found matching your search</p>
                            <p className="text-brand-slateLight mt-0.5">Try searching by email or clearing the role filter.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* MASTER DATABASE TAB */}
          {activeTab === 'masterdata' && (
            <AdminMasterData />
          )}

          {/* ROUTES TAB */}
          {activeTab === 'routes' && (
            <div className="rounded-xl border border-brand-line bg-white">
              <div className="flex items-center justify-between border-b border-brand-line px-6 py-4">
                <h3 className="text-lg font-bold text-brand-navy">Configured Shipping Lanes</h3>
                <span className="rounded-full bg-brand-cloud px-3 py-1 text-xs font-semibold text-brand-slate">{routes.length} lanes</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-brand-line bg-brand-cloud/50">
                      {['Route ID', 'Lane', 'Mode', 'Carriers', 'Transit', 'On-time', 'Volume', 'Status'].map(h => (
                        <th key={h} className="px-5 py-3 font-semibold text-brand-slate text-xs uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map(route => (
                      <tr key={route.id} className="border-b border-brand-line/50 hover:bg-brand-cloud/30">
                        <td className="px-5 py-4 font-mono text-xs font-semibold text-brand-marine">{route.id}</td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-brand-navy text-[13px]">{route.lane}</div>
                          <div className="font-mono text-xs text-brand-slate">{route.origin} to {route.dest}</div>
                        </td>
                        <td className="px-5 py-4 text-xs text-brand-slate">{route.mode}</td>
                        <td className="px-5 py-4 text-xs font-semibold text-brand-navy">{route.carriers} lines</td>
                        <td className="px-5 py-4 font-mono text-xs">{route.transit}</td>
                        <td className="px-5 py-4">
                          {route.onTime ? (
                            <span className="font-mono text-xs font-semibold text-emerald-600">{route.onTime}%</span>
                          ) : (
                            <span className="font-mono text-xs text-brand-slateLight">N/A</span>
                          )}
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-brand-navy">{route.vol} TEU/mo</td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => {
                              setRoutes(prev => prev.map(r => r.id === route.id ? { ...r, active: !r.active } : r))
                              toast(`Route ${route.id} ${route.active ? 'deactivated' : 'activated'}`)
                            }}
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors border ${route.active ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'}`}
                          >
                            {route.active ? '● Active' : '○ Inactive'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* QUOTES TAB */}
          {activeTab === 'quotes' && (
            <div className="rounded-xl border border-brand-line bg-white">
              <div className="flex flex-wrap items-center gap-3 border-b border-brand-line px-6 py-4">
                <h3 className="text-lg font-bold text-brand-navy">All Quotations</h3>
                <span className="rounded-full bg-brand-cloud px-3 py-1 text-xs font-semibold text-brand-slate">{filteredQuotes.length}</span>
                <input
                  value={quoteSearch}
                  onChange={e => setQuoteSearch(e.target.value)}
                  placeholder="Search ID, customer, lane..."
                  className="ml-auto rounded-lg border border-brand-line px-3 py-2 text-xs text-brand-navy focus:border-brand-marine focus:outline-none w-64"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm table-auto">
                  <thead>
                    <tr className="border-b border-brand-line bg-brand-cloud/50 text-[11px] font-semibold text-brand-slate uppercase tracking-wider">
                      <th className="px-4 py-3">Quote ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Lane</th>
                      <th className="px-4 py-3">Mode</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Assigned Agent</th>
                      <th className="px-4 py-3">Agent Decision</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-line/50">
                    {filteredQuotes.map(q => {
                      const agentName = getAgentDisplayName(q.assigned_agent)
                      return (
                        <tr key={q.id} className="hover:bg-brand-cloud/30 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-marine whitespace-nowrap">{q.id}</td>
                          <td className="px-4 py-3 text-[13px] font-medium text-brand-navy max-w-[130px] truncate" title={q.customer}>{q.customer || 'N/A'}</td>
                          <td className="px-4 py-3 text-xs">
                            <div className="font-mono text-xs text-brand-navy font-semibold">{q.laneCode || 'N/A'}</div>
                            <div className="text-[11px] text-brand-slate max-w-[140px] truncate" title={q.laneName}>{q.laneName || ''}</div>
                          </td>
                          <td className="px-4 py-3 text-xs text-brand-slate whitespace-nowrap">{q.mode || 'N/A'}</td>
                          <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-navy whitespace-nowrap">
                            {q.indicativeTotal ? `Rs.${Number(q.indicativeTotal).toLocaleString('en-IN')}` : 'N/A'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <StatusBadge status={q.status || 'Draft'} />
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {agentName !== 'Unassigned' ? (
                              <span className="font-medium text-brand-navy">{agentName}</span>
                            ) : (
                              <span className="text-brand-slateLight italic">Unassigned</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div>
                              <AgentReviewBadge review={q.agent_review} />
                              {q.agent_review?.reviewed_at && (
                                <div className="mt-0.5 text-[10px] text-brand-slateLight">
                                  {new Date(q.agent_review.reviewed_at).toLocaleDateString('en-GB')}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => setInspectQuote(q)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-marine hover:underline"
                            >
                              <Eye className="h-3.5 w-3.5" /> View
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                    {filteredQuotes.length === 0 && (
                      <tr><td colSpan={9} className="px-6 py-10 text-center text-sm text-brand-slateLight">No quotes found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SHIPMENTS TAB */}
          {activeTab === 'shipments' && (
            <div className="rounded-xl border border-brand-line bg-white">
              <div className="flex flex-wrap items-center gap-3 border-b border-brand-line px-6 py-4">
                <h3 className="text-lg font-bold text-brand-navy">All Shipments</h3>
                <span className="rounded-full bg-brand-cloud px-3 py-1 text-xs font-semibold text-brand-slate">{filteredShipments.length}</span>
                <input
                  value={shipSearch}
                  onChange={e => setShipSearch(e.target.value)}
                  placeholder="Search tracking #, origin, destination..."
                  className="ml-auto rounded-lg border border-brand-line px-3 py-2 text-xs text-brand-navy focus:border-brand-marine focus:outline-none w-64"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-brand-line bg-brand-cloud/50">
                      {['Tracking #', 'Route', 'Service', 'Weight', 'Cost', 'Date', 'Status'].map(h => (
                        <th key={h} className="px-4 py-3 font-semibold text-brand-slate text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShipments.map((s, i) => (
                      <tr key={s.tn || i} className="border-b border-brand-line/50 hover:bg-brand-cloud/30">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-marine">{s.tn || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <div className="text-[13px] font-medium text-brand-navy">{s.from} to {s.to}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-brand-slate">{s.service || 'N/A'}</td>
                        <td className="px-4 py-3 font-mono text-xs">{s.weight ? `${Number(s.weight).toLocaleString()} kg` : 'N/A'}</td>
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-navy">
                          {s.cost ? `Rs.${Number(s.cost).toLocaleString('en-IN')}` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-xs text-brand-slate">{s.date || 'N/A'}</td>
                        <td className="px-4 py-3"><StatusBadge status={s.status || 'Booked'} /></td>
                      </tr>
                    ))}
                    {filteredShipments.length === 0 && (
                      <tr><td colSpan={7} className="px-6 py-10 text-center text-sm text-brand-slateLight">No shipments found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-brand-line bg-white shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="border-b border-brand-line bg-brand-cloud/40 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy text-white shadow-xs">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-navy">Create New Platform User</h3>
                  <p className="text-xs text-brand-slate">Assign role, access permissions, and organization details</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1.5 text-brand-slate hover:bg-brand-cloud hover:text-brand-navy"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                    Full Name <span className="text-brand-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserForm.name}
                    onChange={e => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Vikram Mehta"
                    className="w-full rounded-xl border border-brand-line px-3.5 py-2.5 text-xs text-brand-navy focus:border-brand-marine focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                    Email Address <span className="text-brand-danger">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={e => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. vikram@mehtatrade.com"
                    className="w-full rounded-xl border border-brand-line px-3.5 py-2.5 text-xs text-brand-navy focus:border-brand-marine focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                    Company / Organization <span className="text-brand-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserForm.company}
                    onChange={e => setNewUserForm(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g. Mehta Global Exim"
                    className="w-full rounded-xl border border-brand-line px-3.5 py-2.5 text-xs text-brand-navy focus:border-brand-marine focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newUserForm.phone}
                    onChange={e => setNewUserForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. +91 98200 12345"
                    className="w-full rounded-xl border border-brand-line px-3.5 py-2.5 text-xs text-brand-navy focus:border-brand-marine focus:outline-none"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                  Platform Role <span className="text-brand-danger">*</span>
                </label>
                <select
                  value={newUserForm.role}
                  onChange={e => setNewUserForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full rounded-xl border border-brand-line px-3.5 py-2.5 text-xs text-brand-navy font-semibold focus:border-brand-marine focus:outline-none bg-white"
                >
                  <option value="customer">Shipper / User (Customer Portal Access)</option>
                  <option value="agent">Broker / Agent (Human Evaluation & Review Queue)</option>
                  <option value="admin">Pricing Manager / Admin (Full Governance & Master Data)</option>
                </select>

                {/* Role Description Helper */}
                <div className="mt-2 rounded-lg bg-brand-cloud/60 p-3 border border-brand-line/60 text-[11px] text-brand-slate">
                  {newUserForm.role === 'customer' && (
                    <span><strong>Customer Role:</strong> Accesses Customer Portal (`/portal`), creates enquiries, views quotes at sell-rate only, and accepts/declines bookings.</span>
                  )}
                  {newUserForm.role === 'agent' && (
                    <span><strong>Broker / Agent Role:</strong> Accesses Review Queue (`/agent`), inspects automated agent findings, modifies routes/surcharges, and evaluates quotations.</span>
                  )}
                  {newUserForm.role === 'admin' && (
                    <span><strong>Admin Role:</strong> Full system governance across all 20 Master Database collections, margin floor policies, approval threshold rules, and user management.</span>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                  Initial Password <span className="text-brand-danger">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newUserForm.password}
                  onChange={e => setNewUserForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Min 6 characters (e.g. user123)"
                  className="w-full rounded-xl border border-brand-line px-3.5 py-2.5 text-xs text-brand-navy focus:border-brand-marine focus:outline-none font-mono"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-brand-line flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-brand-line bg-brand-cloud px-4 py-2.5 text-xs font-semibold text-brand-slate hover:bg-brand-marinePale hover:text-brand-navy"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="rounded-xl bg-brand-navy px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-marine shadow-xs disabled:opacity-50"
                >
                  {creatingUser ? 'Creating Account...' : 'Create Platform User'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
            {/* Quote Inspector Modal */}
        {inspectQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
            <div className="w-full max-w-2xl rounded-2xl border border-brand-line bg-white p-6 shadow-2xl animate-in zoom-in-95 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-brand-line pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-brand-navy">{inspectQuote.id}</span>
                    <StatusBadge status={inspectQuote.status || 'Draft'} />
                    <AgentReviewBadge review={inspectQuote.agent_review} />
                  </div>
                  <p className="text-xs text-brand-slate mt-0.5">{inspectQuote.laneName} ? {inspectQuote.mode}</p>
                </div>
                <button onClick={() => setInspectQuote(null)} className="rounded-lg p-1.5 text-brand-slate hover:bg-brand-cloud hover:text-brand-navy font-bold text-sm">?</button>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-brand-cloud/40 p-3 rounded-xl border border-brand-line">
                  <div><span className="text-brand-slate">Customer:</span> <strong className="text-brand-navy block text-[13px]">{inspectQuote.customer}</strong></div>
                  <div><span className="text-brand-slate">Indicative Total:</span> <strong className="text-brand-orange block text-base font-display font-bold">Rs. {Number(inspectQuote.indicativeTotal || 0).toLocaleString('en-IN')}</strong></div>
                  <div><span className="text-brand-slate">Transit Estimate:</span> <strong className="text-brand-navy block">{inspectQuote.transit || '14-18 days'}</strong></div>
                  <div><span className="text-brand-slate">Corridor:</span> <strong className="font-mono text-brand-marine block">{inspectQuote.laneCode}</strong></div>
                </div>

                {inspectQuote.details && (
                  <div>
                    <h5 className="font-semibold text-brand-navy mb-1.5 uppercase text-[11px]">5-Layer Cost Build-Up</h5>
                    <div className="space-y-1 rounded-xl bg-brand-cloud/20 p-3 border border-brand-line">
                      <div className="flex justify-between py-1 border-b border-brand-line/40">
                        <span className="text-brand-slate">1. Ocean Base Freight Rate</span>
                        <span className="font-mono font-semibold text-brand-navy">Included</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-brand-line/40">
                        <span className="text-brand-slate">2. Mandatory Surcharges (BAF, THC, Doc)</span>
                        <span className="font-mono font-semibold text-brand-navy">Included</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-brand-line/40">
                        <span className="text-brand-slate">3. Origin & Destination Handling</span>
                        <span className="font-mono font-semibold text-brand-navy">Included</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-brand-line/40">
                        <span className="text-brand-slate">4. Value Added Services / Insurance</span>
                        <span className="font-mono font-semibold text-brand-navy">Included</span>
                      </div>
                      <div className="flex justify-between py-1 pt-1.5">
                        <span className="font-bold text-brand-navy">5. Total Commercial Selling Price</span>
                        <span className="font-mono font-bold text-brand-orange text-sm">Rs. {Number(inspectQuote.indicativeTotal || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-brand-line pt-4">
                <button
                  onClick={() => { setInspectQuote(null); navigate(`/quotes/${inspectQuote.id}`) }}
                  className="text-xs font-semibold text-brand-marine hover:underline flex items-center gap-1"
                >
                  <Eye className="h-3.5 w-3.5" /> Open Dedicated Page View ?
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRejectQuote(inspectQuote.id)}
                    className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                  >
                    Reject Quote
                  </button>
                  <button
                    onClick={() => handleApproveQuote(inspectQuote.id)}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-xs"
                  >
                    Approve Quotation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  )
}

function KpiCard({ icon: Icon, label, value, colorClass }) {
  return (
    <div className="rounded-xl border border-brand-line bg-white p-5 shadow-sm">
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="font-display text-2xl font-bold text-brand-navy">{value}</div>
      <div className="mt-1 text-xs font-medium text-brand-slate">{label}</div>
    
        </div>
  )
}
