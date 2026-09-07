import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Anchor,
  CheckCircle2,
  Save,
  ArrowLeft,
  Clock,
  Award,
  Bell,
  Sparkles,
  Edit3,
  X,
  Radio,
  SlidersHorizontal
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { getAgentDesk, CARRIER_DESK_CONFIG } from '../lib/mockData'

export default function Profile() {
  const { user, updateProfile, loggedIn } = useApp()
  const navigate = useNavigate()
  const toast = useToast()

  // Strict customer protection: customer users manage their profile on /portal and must never access this page
  useEffect(() => {
    if (loggedIn && user?.role === 'customer') {
      navigate('/portal', { replace: true })
    }
  }, [loggedIn, user, navigate])

  const desk = getAgentDesk(user)
  const isAgent = user?.role === 'agent' || user?.role === 'broker'
  const isCustoms = user?.role === 'customs_officer'
  const isAdmin = user?.role === 'admin'
  const isAgentOp = user?.role === 'agent_operator'
  const isManager = user?.role === 'manager'
  const isCustomer = user?.role === 'customer'
  const showQueueAvailability = isAgent || isAgentOp

  // By default, profile is displayed in read-only mode
  const [isEditing, setIsEditing] = useState(false)

  const [name, setName] = useState(user?.name || desk?.agentName || 'Staff Member')
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210')
  const [company, setCompany] = useState(user?.company || desk?.deskName || 'PORTLINE Logistics')
  const [carrierDesk, setCarrierDesk] = useState(user?.carrierDesk || desk?.carrierKey || 'General')
  const [portHub, setPortHub] = useState(user?.portHub || 'Nhava Sheva (INNSA) / Mumbai Maritime Cluster')
  const [operatingStatus, setOperatingStatus] = useState(user?.operatingStatus || 'AVAILABLE')
  const [approvalLimit, setApprovalLimit] = useState(user?.approvalLimit || '₹10,00,000 / shipment')
  const [notifications, setNotifications] = useState({
    emailOnRouteSelect: true,
    instantSmsAlerts: false,
    customsClearancePings: true,
    ...user?.notifications
  })
  const [saving, setSaving] = useState(false)

  // Sync state when user object updates
  useEffect(() => {
    if (user) {
      setName(user.name || desk?.agentName || 'Staff Member')
      setPhone(user.phone || '+91 98765 43210')
      setCompany(user.company || desk?.deskName || 'PORTLINE Logistics')
      if (user.carrierDesk) setCarrierDesk(user.carrierDesk)
      if (user.portHub) setPortHub(user.portHub)
      if (user.operatingStatus) setOperatingStatus(user.operatingStatus)
      if (user.approvalLimit) setApprovalLimit(user.approvalLimit)
      if (user.notifications) setNotifications(prev => ({ ...prev, ...user.notifications }))
    }
  }, [user, desk])

  const getRoleTitle = () => {
    if (isAdmin) return 'System Administrator'
    if (isCustoms) return 'Customs Clearance Officer'
    if (isAgentOp) return 'AI Operations Specialist'
    if (isManager) return 'Commercial Analytics Manager'
    if (isAgent) return `${desk.carrierKey} Dedicated Freight Broker`
    return 'Staff Member'
  }

  const getDashboardPath = () => {
    if (isAdmin) return '/admin'
    if (isCustoms) return '/customs'
    if (isAgentOp) return '/agents'
    if (isManager) return '/analytics'
    if (isAgent) return '/agent'
    return '/portal'
  }

  const handleCancel = () => {
    setName(user?.name || desk?.agentName || 'Staff Member')
    setPhone(user?.phone || '+91 98765 43210')
    setCompany(user?.company || desk?.deskName || 'PORTLINE Logistics')
    setCarrierDesk(user?.carrierDesk || desk?.carrierKey || 'General')
    setPortHub(user?.portHub || 'Nhava Sheva (INNSA) / Mumbai Maritime Cluster')
    setOperatingStatus(user?.operatingStatus || 'AVAILABLE')
    setApprovalLimit(user?.approvalLimit || '₹10,00,000 / shipment')
    setNotifications({
      emailOnRouteSelect: true,
      instantSmsAlerts: false,
      customsClearancePings: true,
      ...user?.notifications
    })
    setIsEditing(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updatedFields = {
        name: name.trim(),
        phone: phone.trim(),
        company: company.trim(),
        carrierDesk,
        portHub: portHub.trim(),
        operatingStatus,
        approvalLimit,
        notifications
      }
      updateProfile(updatedFields)
      setTimeout(() => {
        setSaving(false)
        setIsEditing(false)
        toast('Profile and desk preferences updated successfully!')
      }, 300)
    } catch {
      setSaving(false)
      toast('Failed to save profile changes. Please try again.')
    }
  }

  if (loggedIn && isCustomer) {
    return null
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-brand-cloud py-16 px-4">
        <div className="mx-auto max-w-md rounded-2xl border border-brand-line bg-white p-8 text-center shadow-sm">
          <Shield className="mx-auto mb-3 h-12 w-12 text-brand-orange" />
          <h2 className="text-xl font-bold text-brand-navy">Authentication Required</h2>
          <p className="mt-1 text-sm text-brand-slate">Please log in to view your profile settings.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 w-full rounded-xl bg-brand-navy py-2.5 text-xs font-semibold text-white hover:bg-brand-marine transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const currentDeskConfig = CARRIER_DESK_CONFIG[carrierDesk] || desk

  return (
    <div className="min-h-screen bg-brand-cloud pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-brand-navy py-10 px-4 sm:px-6 lg:px-8 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_600px_300px_at_80%_20%,rgba(0,102,204,.2),transparent_70%)]" />
        <div className="mx-auto max-w-5xl relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <button
                type="button"
                onClick={() => navigate(getDashboardPath())}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white mb-2 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Workspace ({getDashboardPath()})</span>
              </button>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Account & Operator Profile</h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {isEditing
                  ? 'Update your credentials, assigned carrier desk authority, and contact details.'
                  : 'Review your verified credentials, assigned carrier desk authority, contact details, and notification rules.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {showQueueAvailability && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  {operatingStatus === 'AVAILABLE' ? 'Online & Available' : operatingStatus === 'BUSY' ? 'Busy in Review' : 'Offline'}
                </span>
              )}

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orangeLight px-4 py-2 text-xs font-bold text-white shadow-xs hover:opacity-95 transition-opacity"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Cancel Editing</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Profile Summary & Desk Badge */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-sm">
              <div className="text-center">
                <div className="relative mx-auto mb-4 h-20 w-20">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-navy to-brand-marine font-display text-2xl font-bold text-white shadow-md">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-xs border border-brand-line text-brand-orange">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-brand-navy">{name}</h3>
                <p className="text-xs font-mono text-brand-slateLight mt-0.5">{user?.email}</p>

                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-brand-cloud border border-brand-line px-3 py-1 text-xs font-semibold text-brand-navy">
                  <Shield className="h-3 w-3 text-brand-marine" />
                  <span>{getRoleTitle()}</span>
                </div>
              </div>

              {isAgent && (
                <div className="mt-6 rounded-xl border border-brand-line bg-brand-cloud/60 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-brand-slate mb-2">Carrier Desk Allocation</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-brand-navy">{currentDeskConfig?.carrierName || desk.carrierName}</span>
                    <span className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${currentDeskConfig?.theme?.badgeBg || desk.theme.badgeBg} ${currentDeskConfig?.theme?.badgeText || desk.theme.badgeText} ${currentDeskConfig?.theme?.badgeBorder || desk.theme.badgeBorder}`}>
                      {currentDeskConfig?.short || desk.short}
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-slate mt-1.5 leading-relaxed">
                    {currentDeskConfig?.theme?.tagline || desk.theme.tagline}
                  </p>
                </div>
              )}

              <div className="mt-6 space-y-3 pt-6 border-t border-brand-line text-xs text-brand-slate">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-brand-marine" /> Organization
                  </span>
                  <span className="font-medium text-brand-navy">{company}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-brand-marine" /> Contact Phone
                  </span>
                  <span className="font-medium text-brand-navy">{phone}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Anchor className="h-3.5 w-3.5 text-brand-marine" /> Port Cluster
                  </span>
                  <span className="font-medium text-brand-navy text-right truncate max-w-[140px]">{portHub}</span>
                </div>

                {isAgent && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 text-amber-500" /> Margin Authority
                    </span>
                    <span className="font-medium text-brand-navy">{approvalLimit}</span>
                  </div>
                )}
              </div>

              {!isEditing && (
                <div className="mt-6 pt-5 border-t border-brand-line">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-brand-line bg-brand-cloud py-2.5 text-xs font-bold text-brand-navy hover:bg-brand-marinePale hover:text-brand-marine transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-brand-marine" />
                    <span>Edit Profile Details</span>
                  </button>
                </div>
              )}
            </div>

            {/* SLA Operating Protocol (Only for Carrier Desk Agents) */}
            {isAgent && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 text-xs text-blue-900 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-blue-950 mb-1.5">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Operating Protocols</span>
                </div>
                <p className="leading-relaxed text-blue-800">
                  Quotes assigned to your desk require turnaround within <strong>{desk.theme.slaHours || '2 hours'}</strong>. Commercial margin overrides exceeding 15% require senior supervisor approval.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Read-Only View OR Edit Mode */}
          <div className="lg:col-span-2">
            {!isEditing ? (
              /* ================= READ-ONLY PROFILE VIEW ================= */
              <div className="rounded-2xl border border-brand-line bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-brand-line pb-4">
                  <div>
                    <h3 className="font-display text-base font-bold text-brand-navy flex items-center gap-2">
                      <User className="h-4 w-4 text-brand-marine" />
                      <span>Profile Information & Desk Details</span>
                    </h3>
                    <p className="text-xs text-brand-slate mt-0.5">
                      Your verified account information and active desk operational configuration.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-brand-line bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-navy hover:bg-brand-cloud transition-colors shadow-2xs"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-brand-orange" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* Personal & Contact Information Card */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-brand-slate mb-3 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-brand-marine" /> Personal & Contact Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-brand-line/70 bg-brand-cloud/40 p-3.5">
                      <span className="block text-[11px] font-semibold text-brand-slate">Full Name</span>
                      <span className="text-sm font-bold text-brand-navy mt-0.5 block">{name}</span>
                    </div>

                    <div className="rounded-xl border border-brand-line/70 bg-brand-cloud/40 p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-brand-slate">Email Address</span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Verified
                        </span>
                      </div>
                      <span className="text-sm font-mono font-medium text-brand-navy mt-0.5 block truncate">{user?.email}</span>
                    </div>

                    <div className="rounded-xl border border-brand-line/70 bg-brand-cloud/40 p-3.5">
                      <span className="block text-[11px] font-semibold text-brand-slate">Phone Number</span>
                      <span className="text-sm font-medium text-brand-navy mt-0.5 block">{phone}</span>
                    </div>

                    <div className="rounded-xl border border-brand-line/70 bg-brand-cloud/40 p-3.5">
                      <span className="block text-[11px] font-semibold text-brand-slate">Organization / Division</span>
                      <span className="text-sm font-medium text-brand-navy mt-0.5 block">{company}</span>
                    </div>
                  </div>
                </div>

                {/* Commercial Desk Allocation (Only for Agents) */}
                {isAgent && (
                  <div className="pt-4 border-t border-brand-line">
                    <div className="text-xs font-bold uppercase tracking-wider text-brand-slate mb-3 flex items-center gap-1.5">
                      <Anchor className="h-3.5 w-3.5 text-brand-marine" /> Commercial Desk Allocation
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-brand-line/70 bg-brand-cloud/40 p-3.5">
                        <span className="block text-[11px] font-semibold text-brand-slate">Assigned Carrier Desk</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-brand-navy">{currentDeskConfig?.carrierName}</span>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold border ${currentDeskConfig?.theme?.badgeBg} ${currentDeskConfig?.theme?.badgeText} ${currentDeskConfig?.theme?.badgeBorder}`}>
                            {currentDeskConfig?.short}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-brand-line/70 bg-brand-cloud/40 p-3.5">
                        <span className="block text-[11px] font-semibold text-brand-slate">Home Port Hub / Terminal</span>
                        <span className="text-sm font-medium text-brand-navy mt-0.5 block">{portHub}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Queue & Operational Availability (Only for Agents and AI Operators) */}
                {showQueueAvailability && (
                  <div className="pt-4 border-t border-brand-line">
                    <div className="text-xs font-bold uppercase tracking-wider text-brand-slate mb-3 flex items-center gap-1.5">
                      <Radio className="h-3.5 w-3.5 text-brand-marine" /> Queue & Operational Availability
                    </div>
                    <div className="rounded-xl border border-brand-line/70 bg-brand-cloud/40 p-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${operatingStatus === 'AVAILABLE' ? 'bg-emerald-500 animate-pulse' : operatingStatus === 'BUSY' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                          <span className="text-sm font-bold text-brand-navy">
                            {operatingStatus === 'AVAILABLE' ? 'Available — Accepting new route reviews' : operatingStatus === 'BUSY' ? 'Busy in Review — Working on active queue' : 'Offline / Leave — Temporary auto-reroute'}
                          </span>
                        </div>
                        <p className="text-xs text-brand-slate mt-1">
                          Status dictates live algorithmic balancing and quote assignment routing. To modify, click Edit Profile.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="text-xs font-bold text-brand-orange hover:text-brand-orangeLight"
                      >
                        Change Status &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {/* Alert & Notification Preferences Summary */}
                <div className="pt-4 border-t border-brand-line">
                  <div className="text-xs font-bold uppercase tracking-wider text-brand-slate mb-3 flex items-center gap-1.5">
                    <Bell className="h-3.5 w-3.5 text-brand-marine" /> Active Notification Preferences
                  </div>
                  <div className="space-y-2 text-xs text-brand-navy">
                    {isAgent ? (
                      <>
                        <div className="flex items-center gap-2.5">
                          {notifications.emailOnRouteSelect ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-slate-300 shrink-0" />
                          )}
                          <span className={notifications.emailOnRouteSelect ? 'font-medium' : 'text-slate-400'}>
                            Email alert immediately when a shipper chooses my carrier option
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          {notifications.customsClearancePings ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-slate-300 shrink-0" />
                          )}
                          <span className={notifications.customsClearancePings ? 'font-medium' : 'text-slate-400'}>
                            Notify when Customs Officer clears documentation for final booking
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          {notifications.instantSmsAlerts ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-slate-300 shrink-0" />
                          )}
                          <span className={notifications.instantSmsAlerts ? 'font-medium' : 'text-slate-400'}>
                            SMS / WhatsApp instant notification for urgent commercial margin requests
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span className="font-medium">System security and administrative audit alerts</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          {notifications.customsClearancePings ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-slate-300 shrink-0" />
                          )}
                          <span className={notifications.customsClearancePings ? 'font-medium' : 'text-slate-400'}>
                            Workflow clearance queue alerts and daily summary digest
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Edit Action */}
                <div className="pt-5 border-t border-brand-line flex items-center justify-between">
                  <span className="text-xs text-brand-slate">To modify any of the information above, click Edit Profile.</span>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-marine transition-colors shadow-xs"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Profile Details</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ================= EDIT PROFILE MODE ================= */
              <form onSubmit={handleSave} className="rounded-2xl border border-brand-line bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-brand-line pb-4">
                  <div>
                    <h3 className="font-display text-base font-bold text-brand-navy flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-brand-marine" />
                      <span>Edit Profile Details</span>
                    </h3>
                    <p className="text-xs text-brand-slate mt-0.5">
                      Update your contact details and operational preferences, then click Save Profile Details.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-1 rounded-lg border border-brand-line px-3 py-1.5 text-xs font-semibold text-brand-slate hover:bg-brand-cloud hover:text-brand-navy transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-brand-line px-3.5 py-2.5 text-xs text-brand-navy focus:border-brand-marine focus:outline-none shadow-2xs"
                      placeholder="e.g. Vikram Singh"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full rounded-xl border border-brand-line bg-brand-cloud/60 px-3.5 py-2.5 text-xs text-brand-slate cursor-not-allowed"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Verified
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-brand-line px-3.5 py-2.5 text-xs text-brand-navy focus:border-brand-marine focus:outline-none shadow-2xs"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">Organization / Division</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full rounded-xl border border-brand-line px-3.5 py-2.5 text-xs text-brand-navy focus:border-brand-marine focus:outline-none shadow-2xs"
                      placeholder="e.g. PORTLINE MSC Partner Desk"
                    />
                  </div>
                </div>

                {/* Carrier Desk Assignment Section for Agents */}
                {isAgent && (
                  <div className="pt-4 border-t border-brand-line">
                    <h4 className="font-display text-sm font-bold text-brand-navy flex items-center gap-2 mb-1">
                      <Anchor className="h-4 w-4 text-brand-marine" />
                      <span>Commercial Desk Allocation</span>
                    </h4>
                    <p className="text-xs text-brand-slate mb-3">
                      Your assigned carrier desk dictates which route recommendations appear in your commercial review queue.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-brand-navy mb-1.5">Assigned Carrier Desk</label>
                        <select
                          value={carrierDesk}
                          onChange={(e) => setCarrierDesk(e.target.value)}
                          className="w-full rounded-xl border border-brand-line px-3 py-2.5 text-xs text-brand-navy focus:border-brand-marine focus:outline-none bg-white shadow-2xs"
                        >
                          {Object.entries(CARRIER_DESK_CONFIG).map(([key, cfg]) => (
                            <option key={key} value={cfg.carrierKey}>
                              {cfg.deskName} ({cfg.carrierName})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-brand-navy mb-1.5">Home Port Hub / Terminal</label>
                        <input
                          type="text"
                          value={portHub}
                          onChange={(e) => setPortHub(e.target.value)}
                          className="w-full rounded-xl border border-brand-line px-3.5 py-2.5 text-xs text-brand-navy focus:border-brand-marine focus:outline-none shadow-2xs"
                          placeholder="Nhava Sheva (INNSA) / Visakhapatnam"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Operational Status (Only for Agents and AI Operators) */}
                {showQueueAvailability && (
                  <div className="pt-4 border-t border-brand-line">
                    <h4 className="font-display text-sm font-bold text-brand-navy mb-1">Queue & Operational Availability</h4>
                    <p className="text-xs text-brand-slate mb-3">Set your status to automatically balance quotation assignments.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { key: 'AVAILABLE', label: 'Available', desc: 'Accepting new route reviews', color: 'emerald' },
                        { key: 'BUSY', label: 'Busy in Review', desc: 'Working on active queue', color: 'amber' },
                        { key: 'OFFLINE', label: 'Offline / Leave', desc: 'Temporary auto-reroute', color: 'slate' }
                      ].map(s => (
                        <label
                          key={s.key}
                          onClick={() => setOperatingStatus(s.key)}
                          className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                            operatingStatus === s.key
                              ? 'border-brand-navy bg-brand-cloud shadow-2xs'
                              : 'border-brand-line hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-brand-navy">{s.label}</span>
                            <input
                              type="radio"
                              name="status"
                              checked={operatingStatus === s.key}
                              onChange={() => setOperatingStatus(s.key)}
                              className="text-brand-navy"
                            />
                          </div>
                          <span className="text-[11px] text-brand-slate">{s.desc}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notification Preferences */}
                <div className="pt-4 border-t border-brand-line">
                  <h4 className="font-display text-sm font-bold text-brand-navy flex items-center gap-2 mb-1">
                    <Bell className="h-4 w-4 text-brand-marine" />
                    <span>Alert & Notification Preferences</span>
                  </h4>
                  <p className="text-xs text-brand-slate mb-3">
                    {isAgent
                      ? 'Choose how you wish to be notified when customers select your carrier.'
                      : 'Choose which operational and workflow alerts to receive.'}
                  </p>

                  <div className="space-y-2.5 text-xs text-brand-navy">
                    {isAgent ? (
                      <>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.emailOnRouteSelect}
                            onChange={(e) => setNotifications(prev => ({ ...prev, emailOnRouteSelect: e.target.checked }))}
                            className="rounded border-brand-line text-brand-navy"
                          />
                          <span>Email alert immediately when a shipper chooses my carrier option</span>
                        </label>

                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.customsClearancePings}
                            onChange={(e) => setNotifications(prev => ({ ...prev, customsClearancePings: e.target.checked }))}
                            className="rounded border-brand-line text-brand-navy"
                          />
                          <span>Notify when Customs Officer clears documentation for final booking</span>
                        </label>

                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.instantSmsAlerts}
                            onChange={(e) => setNotifications(prev => ({ ...prev, instantSmsAlerts: e.target.checked }))}
                            className="rounded border-brand-line text-brand-navy"
                          />
                          <span>SMS / WhatsApp instant notification for urgent commercial margin requests</span>
                        </label>
                      </>
                    ) : (
                      <>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={true}
                            disabled
                            className="rounded border-brand-line text-brand-navy cursor-not-allowed"
                          />
                          <span>System security and administrative audit alerts (Mandatory)</span>
                        </label>

                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.customsClearancePings}
                            onChange={(e) => setNotifications(prev => ({ ...prev, customsClearancePings: e.target.checked }))}
                            className="rounded border-brand-line text-brand-navy"
                          />
                          <span>Workflow clearance queue alerts and daily summary digest</span>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-brand-line flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-xl border border-brand-line px-5 py-2.5 text-xs font-semibold text-brand-slate hover:bg-brand-cloud hover:text-brand-navy transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-marine transition-colors shadow-xs"
                  >
                    {saving ? (
                      <>
                        <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        <span>Save Profile Details</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
