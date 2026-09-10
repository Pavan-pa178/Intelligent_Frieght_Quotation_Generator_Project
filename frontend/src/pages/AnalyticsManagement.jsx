import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, DollarSign, BrainCircuit, BarChart3, Users, Package,
  FileText, CheckCircle2, Clock, XCircle, AlertTriangle, ShieldCheck,
  Building2, Plus, Trash2, Search, ExternalLink, RefreshCw, X, ChevronRight, Eye
} from 'lucide-react'
import PageBanner from '../components/PageBanner'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import {
  fetchAllQuotes, fetchCompanies, addCompanyAgent, removeCompanyAgent
} from '../lib/api'

export default function AnalyticsManagement() {
  const { user } = useApp()
  const navigate = useNavigate()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'requests' | 'agents'
  const [quotes, setQuotes] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCarrierKey, setSelectedCarrierKey] = useState('')

  // Modal for adding an agent
  const [showAddAgentModal, setShowAddAgentModal] = useState(false)
  const [newAgentForm, setNewAgentForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [addingAgent, setAddingAgent] = useState(false)
  const [requestSearch, setRequestSearch] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [q, c] = await Promise.all([
        fetchAllQuotes(),
        fetchCompanies()
      ])
      setQuotes(Array.isArray(q) ? q : [])
      setCompanies(Array.isArray(c) ? c : [])
    } catch (err) {
      console.warn('Failed to load manager data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Detect which company the manager represents
  const userEmail = (user?.email || '').toLowerCase()
  const detectedCarrier = useMemo(() => {
    if (selectedCarrierKey) return selectedCarrierKey

    if (userEmail.includes('cma')) return 'CMA CGM'
    if (userEmail.includes('msc')) return 'MSC'
    if (userEmail.includes('maersk')) return 'Maersk'
    if (userEmail.includes('hapag')) return 'Hapag-Lloyd'
    if (userEmail.includes('evergreen')) return 'Evergreen'
    if (userEmail.includes('cosco')) return 'COSCO'
    if (userEmail.includes('one')) return 'ONE'
    if (userEmail.includes('air')) return 'Air'
    if (userEmail.includes('express')) return 'Express'

    // Check user.company string
    const uComp = (user?.company || '').toLowerCase()
    if (uComp.includes('cma')) return 'CMA CGM'
    if (uComp.includes('msc')) return 'MSC'
    if (uComp.includes('maersk')) return 'Maersk'
    if (uComp.includes('hapag')) return 'Hapag-Lloyd'
    if (uComp.includes('evergreen')) return 'Evergreen'
    if (uComp.includes('cosco')) return 'COSCO'
    if (uComp.includes('one')) return 'ONE'

    // Default to CMA CGM or first available
    return 'CMA CGM'
  }, [userEmail, user?.company, selectedCarrierKey])

  // Active company object
  const activeCompany = useMemo(() => {
    return companies.find(c => 
      c.carrier_key === detectedCarrier || 
      c.name?.toLowerCase().includes(detectedCarrier.toLowerCase())
    ) || companies[0] || {
      company_id: 'COMP-CMA-01',
      name: 'CMA CGM',
      carrier_key: 'CMA CGM',
      status: 'APPROVED',
      is_eligible: true,
      contract_tier: 'Tier 1 Strategic Ocean Carrier',
      sla_hours: '2h Fast-Track Review',
      agents: []
    }
  }, [companies, detectedCarrier])

  // Company Shipment Requests (Quotes allocated to this carrier)
  const companyQuotes = useMemo(() => {
    const key = (activeCompany.carrier_key || activeCompany.name || '').toLowerCase()
    return quotes.filter(q => {
      const qCarrier = (q.carrier || q.selected_route?.carrier || q.selectedCarrier || '').toLowerCase()
      return key && (qCarrier.includes(key) || key.includes(qCarrier))
    })
  }, [quotes, activeCompany])

  const pendingCount = companyQuotes.filter(q => 
    !q.agent_review || 
    q.agent_review.status === 'pending' || 
    (q.status && (q.status.includes('Pending') || q.status.includes('Awaiting')))
  ).length

  const approvedCount = companyQuotes.filter(q => 
    q.status && (q.status.includes('Approved') || q.status === 'Booked')
  ).length

  const bookedCount = companyQuotes.filter(q => q.status === 'Booked' || q.pipeline_status === 'BOOKED').length

  const totalCommercialVolume = companyQuotes.reduce((s, q) => s + (Number(q.indicativeTotal) || 0), 0)

  // Handle Add Agent
  const handleAddAgent = async (e) => {
    e.preventDefault()
    if (!newAgentForm.email.trim() || !newAgentForm.password.trim()) {
      toast('Agent email and password are required.')
      return
    }
    setAddingAgent(true)
    try {
      await addCompanyAgent(activeCompany.company_id, {
        name: newAgentForm.name.trim() || newAgentForm.email.split('@')[0],
        email: newAgentForm.email.trim().toLowerCase(),
        password: newAgentForm.password.trim(),
        phone: newAgentForm.phone.trim() || '+91 98200 00000'
      })
      toast(`Agent ${newAgentForm.email} onboarded for ${activeCompany.name}!`)
      setNewAgentForm({ name: '', email: '', password: '', phone: '' })
      setShowAddAgentModal(false)
      loadData()
    } catch (err) {
      toast(err.message || 'Failed to onboard agent')
    } finally {
      setAddingAgent(false)
    }
  }

  // Handle Remove Agent
  const handleRemoveAgent = async (agentEmail) => {
    if (!window.confirm(`Are you sure you want to remove agent ${agentEmail}?`)) return
    try {
      await removeCompanyAgent(activeCompany.company_id, agentEmail)
      toast(`Agent ${agentEmail} removed.`)
      loadData()
    } catch (err) {
      toast('Failed to remove agent')
    }
  }

  return (
    <div className="min-h-screen bg-brand-cloud pb-16">
      <PageBanner
        crumb="Operations / Company Manager Console"
        title="COMPANY MANAGER OPERATIONS HUB"
        subtitle="Manage shipment requests, configure company operational agents, and monitor freight performance"
        icon={Building2}
      />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* COMPANY PROFILE & CARRIER DESK HEADER */}
        <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center font-display font-bold text-white shadow-xs text-lg"
              style={{ backgroundColor: activeCompany.logo_color || '#0A2540' }}
            >
              {(activeCompany.carrier_key || activeCompany.name || 'CO').slice(0, 3).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-display text-xl font-bold text-brand-navy">{activeCompany.name}</h2>
                <span className="font-mono text-xs font-bold text-brand-slateLight px-2 py-0.5 rounded bg-brand-cloud border border-brand-line">
                  {activeCompany.company_id}
                </span>
                {activeCompany.is_eligible ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" /> Eligible (Customer Visible)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                    <Clock className="h-3 w-3" /> Pending Admin Verification
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-slate mt-1 font-medium">
                {activeCompany.contract_tier} · <span className="text-brand-orange font-semibold">{activeCompany.sla_hours}</span> · Manager: <span className="font-mono">{userEmail || activeCompany.manager_email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Carrier Desk Switcher for Supervisor */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-slate font-medium hidden sm:inline">Switch Carrier Desk:</span>
              <select
                value={activeCompany.carrier_key}
                onChange={(e) => setSelectedCarrierKey(e.target.value)}
                className="text-xs font-semibold text-brand-navy bg-brand-cloud/60 border border-brand-line rounded-xl px-3 py-2 focus:border-brand-marine focus:outline-none"
              >
                {companies.map(c => (
                  <option key={c.company_id} value={c.carrier_key}>
                    {c.name} ({c.company_id})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => navigate(`/agent?desk=${encodeURIComponent(activeCompany.carrier_key)}`)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-brand-navy hover:bg-brand-marine rounded-xl transition-all shadow-xs"
            >
              <span>Open Agent Desk</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* MANAGER NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-brand-line pb-3">
          {[
            { id: 'dashboard', label: 'Overview & Telemetry', icon: BarChart3 },
            { id: 'requests', label: 'Shipment Requests List', icon: Package, badge: pendingCount > 0 ? pendingCount : null },
            { id: 'agents', label: 'Company Agent List & Setup', icon: Users, badge: activeCompany.agents?.length || 0 }
          ].map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-brand-navy text-white shadow-xs'
                    : 'bg-white text-brand-slate hover:bg-brand-cloud hover:text-brand-navy border border-brand-line'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${active ? 'bg-white/20 text-white' : 'bg-brand-cloud text-brand-slate'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* TAB 1: OVERVIEW & TELEMETRY */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Summary Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-brand-line bg-white p-5 shadow-xs">
                <span className="text-xs text-brand-slate font-medium">Assigned Quote Requests</span>
                <p className="mt-1 font-display text-2xl font-bold text-brand-navy">{companyQuotes.length}</p>
                <span className="mt-1 block text-[11px] text-brand-slateLight">Allocated to this Carrier</span>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-xs">
                <span className="text-xs text-amber-800 font-medium">Pending Agent Verification</span>
                <p className="mt-1 font-display text-2xl font-bold text-amber-700">{pendingCount}</p>
                <span className="mt-1 block text-[11px] text-amber-600">Requires Operational Review</span>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-xs">
                <span className="text-xs text-emerald-800 font-medium">Booked Shipments Secured</span>
                <p className="mt-1 font-display text-2xl font-bold text-emerald-700">{bookedCount}</p>
                <span className="mt-1 block text-[11px] text-emerald-600">Confirmed Booking Slots</span>
              </div>
              <div className="rounded-2xl border border-brand-line bg-white p-5 shadow-xs">
                <span className="text-xs text-brand-slate font-medium">Commercial Volume</span>
                <p className="mt-1 font-display text-2xl font-bold text-brand-orange">
                  Rs. {(totalCommercialVolume / 100000).toFixed(1)}L
                </p>
                <span className="mt-1 block text-[11px] text-brand-slateLight">Pipeline Revenue</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Risk Score Distribution */}
              <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-sm">
                <h3 className="font-display text-sm font-bold text-brand-navy mb-4">Shipment Risk Score Distribution</h3>
                <div className="space-y-4">
                  {[
                    { label: 'LOW (0 - 30 pts)', count: 890, pct: 62.7, color: 'bg-emerald-500' },
                    { label: 'MEDIUM (31 - 60 pts)', count: 380, pct: 26.8, color: 'bg-amber-500' },
                    { label: 'HIGH (61 - 80 pts)', count: 125, pct: 8.8, color: 'bg-rose-500' },
                    { label: 'CRITICAL (81 - 100 pts)', count: 25, pct: 1.7, color: 'bg-rose-700' }
                  ].map((r, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-brand-slate font-medium">{r.label}</span>
                        <span className="font-mono text-brand-navy font-bold">{r.count} shipments ({r.pct}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ML Pricing Engine Telemetry */}
              <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-brand-line pb-3">
                  <div>
                    <h3 className="font-display text-sm font-bold text-brand-navy">ML Pricing Model Governance</h3>
                    <p className="text-xs text-brand-slate">LightGBM Gradient Boosted Regressor (v3.2.0)</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-0.5 text-xs font-bold">
                    PRODUCTION LIVE
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 my-4">
                  <div className="bg-brand-cloud p-3 rounded-xl border border-brand-line text-center">
                    <span className="text-[10px] text-brand-slate uppercase font-semibold">Test R2 Score</span>
                    <p className="text-base font-bold text-brand-navy font-mono">0.942</p>
                  </div>
                  <div className="bg-brand-cloud p-3 rounded-xl border border-brand-line text-center">
                    <span className="text-[10px] text-brand-slate uppercase font-semibold">Mean Abs Error</span>
                    <p className="text-base font-bold text-brand-navy font-mono">Rs. 2,420</p>
                  </div>
                  <div className="bg-brand-cloud p-3 rounded-xl border border-brand-line text-center">
                    <span className="text-[10px] text-brand-slate uppercase font-semibold">RMSE Error</span>
                    <p className="text-base font-bold text-brand-navy font-mono">Rs. 3,850</p>
                  </div>
                </div>

                <div className="text-xs text-brand-slate space-y-1.5 mt-4">
                  <p>• Trained on 11,063 real-world verified multimodal records</p>
                  <p>• Top Features: Nautical Distance (34%), Weight Density (28%), Bunker Fuel BAF (21%)</p>
                  <p>• Automated retraining interval: Bi-weekly</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SHIPMENT REQUESTS LIST */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-brand-line bg-white p-4 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-slateLight" />
                <input
                  type="text"
                  value={requestSearch}
                  onChange={(e) => setRequestSearch(e.target.value)}
                  placeholder="Filter by quote ID, customer, or lane..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-brand-line focus:border-brand-marine focus:outline-none"
                />
              </div>
              <div className="text-xs text-brand-slate">
                Showing <strong className="text-brand-navy">{companyQuotes.length}</strong> shipment requests allocated to {activeCompany.name}
              </div>
            </div>

            <div className="rounded-2xl border border-brand-line bg-white shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-brand-cloud/60 text-brand-slate font-semibold border-b border-brand-line">
                      <th className="py-3 px-4">Quote ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Trade Lane</th>
                      <th className="py-3 px-4">Mode / Cargo</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Workflow Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-line">
                    {companyQuotes
                      .filter(q => {
                        if (!requestSearch) return true
                        const s = requestSearch.toLowerCase()
                        return (
                          (q.id || '').toLowerCase().includes(s) ||
                          (q.customer || '').toLowerCase().includes(s) ||
                          (q.laneName || '').toLowerCase().includes(s) ||
                          (q.user_email || '').toLowerCase().includes(s)
                        )
                      })
                      .map(q => (
                        <tr key={q.id} className="hover:bg-brand-cloud/30 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-brand-navy">{q.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-brand-navy">{q.customer || 'Direct Shipper'}</div>
                            <div className="text-[11px] text-brand-slateLight font-mono">{q.user_email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-brand-navy">{q.laneName || q.laneCode}</div>
                            <div className="text-[10px] text-brand-slateLight">{q.transit || 'Direct transit'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="rounded bg-brand-cloud border border-brand-line px-2 py-0.5 text-[10px] font-semibold text-brand-slate">
                              {q.mode}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-brand-orange">
                            Rs. {Number(q.indicativeTotal || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={q.status || 'Agent Approval Pending'} />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => navigate(`/quotes/${q.id}`)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-brand-marine hover:underline"
                            >
                              <span>Inspect</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {companyQuotes.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-brand-slate text-xs">
                          No shipment requests currently allocated to {activeCompany.name}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPANY AGENT LIST & SETUP ("Agent list - make the agent for the process, add the agent - email and password") */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-brand-line bg-white p-6 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-brand-orange" />
                  <h3 className="text-base font-bold text-brand-navy">{activeCompany.name} Operational Agent Team</h3>
                </div>
                <p className="text-xs text-brand-slate mt-0.5">
                  Manage authorized verification agents assigned to the {activeCompany.name} partner operations desk.
                </p>
              </div>
              <button
                onClick={() => setShowAddAgentModal(true)}
                className="flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-brand-orangeLight transition-all self-start sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Add Agent (Email & Password)</span>
              </button>
            </div>

            {/* AGENT CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(activeCompany.agents || []).map((agt, idx) => (
                <div key={idx} className="rounded-2xl border border-brand-line bg-white p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3 border-b border-brand-line pb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-brand-cloud border border-brand-line flex items-center justify-center font-bold text-brand-navy text-sm">
                          {(agt.name || agt.email).slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-brand-navy text-sm">{agt.name || 'Agent'}</h4>
                          <span className="font-mono text-[10px] text-brand-slateLight font-semibold">
                            {agt.agent_id || `AGT-${(idx+1).toString().padStart(2, '0')}`}
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Active
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-brand-slate mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-brand-slateLight font-medium">Login Email:</span>
                        <span className="font-mono font-semibold text-brand-navy">{agt.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-brand-slateLight font-medium">Role:</span>
                        <span className="capitalize font-semibold text-brand-navy">{agt.role || 'Carrier Agent'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-brand-slateLight font-medium">Contact Phone:</span>
                        <span className="font-mono text-brand-navy">{agt.phone || '+91 98200 00000'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-brand-line pt-3 mt-2">
                    <button
                      onClick={() => navigate(`/agent?desk=${encodeURIComponent(activeCompany.carrier_key)}`)}
                      className="text-xs font-semibold text-brand-marine hover:underline flex items-center gap-1"
                    >
                      <span>Open Desk Queue</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleRemoveAgent(agt.email)}
                      className="text-xs font-semibold text-red-600 hover:text-red-800 p-1 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}

              {(!activeCompany.agents || activeCompany.agents.length === 0) && (
                <div className="col-span-full rounded-2xl border border-dashed border-brand-line bg-white/50 p-8 text-center">
                  <Users className="h-8 w-8 text-brand-slateLight mx-auto mb-2" />
                  <p className="text-sm font-bold text-brand-navy">No agents mapped to {activeCompany.name} yet</p>
                  <p className="text-xs text-brand-slate mt-1 mb-4">Click below to create an agent login with email and password.</p>
                  <button
                    onClick={() => setShowAddAgentModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orangeLight rounded-xl shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add First Agent</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD AGENT (Email and Password) */}
      {showAddAgentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-brand-line animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-brand-line pb-3 mb-4">
              <div>
                <h3 className="font-display font-bold text-brand-navy text-base">Add Company Agent</h3>
                <p className="text-xs text-brand-slate">Create operational agent login for {activeCompany.name}</p>
              </div>
              <button onClick={() => setShowAddAgentModal(false)} className="text-brand-slate hover:text-brand-navy p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddAgent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">Agent Full Name</label>
                <input
                  type="text"
                  value={newAgentForm.name}
                  onChange={(e) => setNewAgentForm({ ...newAgentForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full rounded-xl border border-brand-line px-3 py-2 text-xs text-brand-navy focus:border-brand-marine focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">Agent Email (Login ID) *</label>
                <input
                  type="email"
                  required
                  value={newAgentForm.email}
                  onChange={(e) => setNewAgentForm({ ...newAgentForm, email: e.target.value })}
                  placeholder={`e.g. agent.${(activeCompany.carrier_key || 'carrier').toLowerCase().replace(/[^a-z0-9]/g, '')}@portline.in`}
                  className="w-full rounded-xl border border-brand-line px-3 py-2 text-xs text-brand-navy focus:border-brand-marine focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">Initial Password *</label>
                <input
                  type="password"
                  required
                  value={newAgentForm.password}
                  onChange={(e) => setNewAgentForm({ ...newAgentForm, password: e.target.value })}
                  placeholder="Create secure password for agent"
                  className="w-full rounded-xl border border-brand-line px-3 py-2 text-xs text-brand-navy focus:border-brand-marine focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={newAgentForm.phone}
                  onChange={(e) => setNewAgentForm({ ...newAgentForm, phone: e.target.value })}
                  placeholder="+91 98200 00000"
                  className="w-full rounded-xl border border-brand-line px-3 py-2 text-xs text-brand-navy focus:border-brand-marine focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-line">
                <button
                  type="button"
                  onClick={() => setShowAddAgentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-brand-slate hover:bg-brand-cloud rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingAgent}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orangeLight rounded-xl disabled:opacity-50 shadow-xs"
                >
                  {addingAgent ? 'Creating Agent...' : 'Onboard Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
