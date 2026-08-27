import React, { useState } from 'react'
import { FileCheck, ShieldCheck, AlertTriangle, Clock, XCircle, Search, Check, ExternalLink, ShieldAlert, History, X } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { REGULATION_CORPUS } from '../lib/customsRAG'
import PageBanner from '../components/PageBanner'

export default function CustomsWorkspace() {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCase, setSelectedCase] = useState(null)
  const [officerComments, setOfficerComments] = useState('')

  const [cases, setCases] = useState([
    {
      checkId: 'CUST-CHK-78210',
      shipmentId: 'SHP-7821',
      origin: 'Chennai (INMAA)',
      destination: 'Rotterdam (NLRTM)',
      hsCode: '850440',
      commodity: 'Static Converters & Solar Inverters',
      readinessScore: 88,
      riskLevel: 'HIGH',
      status: 'PENDING_REVIEW',
      requiresOfficer: true,
      summary: 'EU Union Customs Code Art 127 advance filing verified. CE / Low Voltage Directive declaration pending sign-off.',
      checklist: [
        { name: 'Commercial Invoice (USD/EUR)', uploaded: true, status: 'VERIFIED' },
        { name: 'Packing List with Net/Gross Weight', uploaded: true, status: 'VERIFIED' },
        { name: 'Ocean Bill of Lading (B/L)', uploaded: true, status: 'VERIFIED' },
        { name: 'EU Declaration of Conformity (DoC)', uploaded: true, status: 'PENDING_SIGN_OFF' },
        { name: 'RoHS 3 Compliance Certificate', uploaded: true, status: 'VERIFIED' }
      ],
      citation: 'UCC Regulation (EU) No 952/2013 Art 127'
    },
    {
      checkId: 'CUST-CHK-41902',
      shipmentId: 'SHP-4190',
      origin: 'Nhava Sheva (INNSA)',
      destination: 'Singapore (SGSIN)',
      hsCode: '290511',
      commodity: 'Industrial Methanol (Chemical)',
      readinessScore: 65,
      riskLevel: 'CRITICAL',
      status: 'PENDING_REVIEW',
      requiresOfficer: true,
      summary: 'IMO Class 3 Flammable Liquid. Dangerous goods declaration and UN packaging certificate mandatory.',
      checklist: [
        { name: 'IMO Multimodal DG Declaration', uploaded: true, status: 'VERIFIED' },
        { name: '16-Point Material Safety Data Sheet (MSDS)', uploaded: true, status: 'VERIFIED' },
        { name: 'Singapore SCDF Chemical Import Permit', uploaded: false, status: 'MISSING' },
        { name: 'UN Approved Packaging Certificate', uploaded: true, status: 'PENDING_SIGN_OFF' }
      ],
      citation: 'SOLAS Convention Chap VII & Singapore Fire Safety Act'
    },
    {
      checkId: 'CUST-CHK-63024',
      shipmentId: 'SHP-6302',
      origin: 'Chennai (INMAA)',
      destination: 'Singapore (SGSIN)',
      hsCode: '851762',
      commodity: 'Enterprise Network Switches',
      readinessScore: 100,
      riskLevel: 'LOW',
      status: 'APPROVED',
      requiresOfficer: false,
      summary: 'Full trade documentation set auto-verified under India-Singapore CECA treaty.',
      checklist: [
        { name: 'Commercial Invoice', uploaded: true, status: 'VERIFIED' },
        { name: 'Packing List', uploaded: true, status: 'VERIFIED' },
        { name: 'Preferential Certificate of Origin (CECA)', uploaded: true, status: 'VERIFIED' }
      ],
      citation: 'India-Singapore Comprehensive Economic Cooperation Agreement (CECA)'
    }
  ])

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'AUD-991',
      checkId: 'CUST-CHK-63024',
      action: 'AUTO_PASSED',
      actor: 'Customs Legal RAG Engine',
      timestamp: '2026-08-10 14:32 IST',
      notes: '100% HS 851762 match with CECA duty exemption rule.'
    }
  ])

  const handleDecision = (decision) => {
    if (!selectedCase) return
    const newStatus = decision === 'APPROVE' ? 'APPROVED' : decision === 'REJECT' ? 'REJECTED' : 'HOLD'

    setCases(prev => prev.map(c => c.checkId === selectedCase.checkId ? { ...c, status: newStatus, requiresOfficer: false } : c))

    setAuditLogs(prev => [
      {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        checkId: selectedCase.checkId,
        action: `${decision}_BY_OFFICER`,
        actor: 'Customs Officer Desk',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
        notes: officerComments || `Officer validated case with decision: ${decision}`
      },
      ...prev
    ])

    toast(`Case ${selectedCase.checkId} ${newStatus.toLowerCase()} successfully`)
    setSelectedCase(null)
    setOfficerComments('')
  }

  const filteredCases = cases.filter(c => {
    const q = searchQuery.toLowerCase()
    return c.checkId.toLowerCase().includes(q) || c.commodity.toLowerCase().includes(q) || c.hsCode.includes(q) || c.shipmentId.toLowerCase().includes(q)
  })

  return (
    <div className="min-h-screen bg-brand-cloud pb-16">
      <PageBanner
        crumb="Operations / Customs Compliance"
        title="CUSTOMS COMPLIANCE WORKSPACE"
        subtitle="Harmonized System (HS) Validation, Legal RAG Corpus & Human Sign-off Desk"
        icon={ShieldCheck}
      />

      <div className="mx-auto max-w-[1220px] px-8 sm:px-5 pt-8">
        
        {/* Top Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-line bg-white p-5 rounded-2xl shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold text-brand-navy">Active Clearance Queues</span>
              <span className="rounded-full bg-brand-orangePale px-2.5 py-0.5 text-xs font-bold text-brand-orange">
                CBIC Desk Live
              </span>
            </div>
            <p className="text-xs text-brand-slate mt-0.5">Automated screening & human-in-the-loop regulatory sign-off</p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-xl bg-brand-cloud border border-brand-line px-4 py-2 text-center shadow-xs">
              <span className="text-[11px] text-brand-slate uppercase font-semibold">Pending Review</span>
              <p className="text-xl font-bold text-amber-600 font-display">{cases.filter(c => c.requiresOfficer).length}</p>
            </div>
            <div className="rounded-xl bg-brand-cloud border border-brand-line px-4 py-2 text-center shadow-xs">
              <span className="text-[11px] text-brand-slate uppercase font-semibold">Auto-Passed</span>
              <p className="text-xl font-bold text-emerald-600 font-display">{cases.filter(c => c.status === 'APPROVED').length}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-brand-line pb-3">
          <button
            onClick={() => setActiveTab('pending')}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all shadow-xs ${
              activeTab === 'pending' ? 'bg-brand-navy text-white' : 'bg-white border border-brand-line text-brand-slate hover:text-brand-navy hover:bg-brand-cloud'
            }`}
          >
            Pending Reviews ({cases.filter(c => c.requiresOfficer).length})
          </button>
          <button
            onClick={() => setActiveTab('regulations')}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all shadow-xs ${
              activeTab === 'regulations' ? 'bg-brand-navy text-white' : 'bg-white border border-brand-line text-brand-slate hover:text-brand-navy hover:bg-brand-cloud'
            }`}
          >
            Regulation Legal Corpus
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all shadow-xs ${
              activeTab === 'audit' ? 'bg-brand-navy text-white' : 'bg-white border border-brand-line text-brand-slate hover:text-brand-navy hover:bg-brand-cloud'
            }`}
          >
            Sign-off Audit Trail ({auditLogs.length})
          </button>
        </div>

        {/* TAB 1: PENDING REVIEWS */}
        {activeTab === 'pending' && (
          <div className="mt-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-slate" />
                <input
                  type="text"
                  placeholder="Search by HS code, commodity, or shipment ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-brand-line bg-white py-2 pl-9 pr-3 text-xs text-brand-navy placeholder-brand-slate focus:border-brand-marine focus:outline-none shadow-xs"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-brand-line bg-brand-cloud/60 text-[11px] uppercase tracking-wider text-brand-slate font-semibold">
                  <tr>
                    <th className="px-4 py-3.5">Case ID / Shipment</th>
                    <th className="px-4 py-3.5">Corridor</th>
                    <th className="px-4 py-3.5">HS Code & Cargo</th>
                    <th className="px-4 py-3.5">Readiness</th>
                    <th className="px-4 py-3.5">Risk Level</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-line/50">
                  {filteredCases.map(c => (
                    <tr key={c.checkId} className="hover:bg-brand-cloud/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-brand-navy font-mono text-xs">{c.checkId}</span>
                        <div className="text-[11px] text-brand-slate">{c.shipmentId}</div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-brand-navy">{c.origin} ? {c.destination}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block rounded-md bg-brand-navy/10 px-2 py-0.5 font-mono text-[11px] text-brand-navy font-bold">{c.hsCode}</span>
                        <div className="text-[11px] text-brand-slate max-w-[200px] truncate mt-0.5">{c.commodity}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-14 rounded-full bg-slate-200 overflow-hidden">
                            <div className={`h-full ${c.readinessScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${c.readinessScore}%` }} />
                          </div>
                          <span className="font-mono font-bold text-[11px] text-brand-navy">{c.readinessScore}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold border ${
                          c.riskLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' : c.riskLevel === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {c.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold border ${
                          c.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : c.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedCase(c)}
                          className="rounded-xl bg-brand-navy px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-marine transition-colors shadow-xs"
                        >
                          Inspect & Sign-Off
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: REGULATION LEGAL CORPUS */}
        {activeTab === 'regulations' && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {Object.entries(REGULATION_CORPUS).map(([code, reg]) => (
              <div key={code} className="rounded-2xl border border-brand-line bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-brand-line pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-brand-navy/10 px-2 py-0.5 font-mono text-xs font-bold text-brand-navy">HS {code}</span>
                    <h4 className="font-semibold text-brand-navy text-xs">{reg.description}</h4>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-brand-slate uppercase">{reg.jurisdiction}</span>
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <p className="text-brand-slate"><strong className="text-brand-navy">Legal Rule:</strong> {reg.ruleSummary}</p>
                  <p className="text-[11px] font-mono text-brand-marine"><strong className="text-brand-slate">Statutory Citation:</strong> {reg.citation}</p>
                  <div>
                    <strong className="text-brand-navy block mb-1 text-[11px]">Mandatory Filings:</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {reg.mandatoryDocs.map((doc, i) => (
                        <span key={i} className="rounded-md bg-brand-cloud px-2 py-0.5 text-[10px] text-brand-slate border border-brand-line font-medium">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="mt-6 rounded-2xl border border-brand-line bg-white p-5 shadow-sm">
            <h3 className="font-display text-sm font-bold text-brand-navy mb-4">Official Customs Sign-Off Audit Trail</h3>
            <div className="space-y-3">
              {auditLogs.map(log => (
                <div key={log.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-line/50 pb-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-brand-navy">{log.id}</span>
                    <span className="mx-2 text-brand-slateLight">?</span>
                    <span className="font-mono text-brand-marine">{log.checkId}</span>
                    <span className="mx-2 text-brand-slateLight">?</span>
                    <span className="font-semibold text-brand-slate">{log.action}</span>
                    <p className="text-xs text-brand-slate mt-0.5">{log.notes}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[11px] text-brand-slateLight block">{log.timestamp}</span>
                    <span className="text-[10px] font-semibold text-emerald-600 block">By: {log.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INSPECTION MODAL */}
        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-2xl rounded-2xl border border-brand-line bg-white p-6 shadow-2xl animate-in zoom-in-95 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-brand-line pb-4">
                <div>
                  <h3 className="font-display text-base font-bold text-brand-navy">Customs Clearance File & Sign-Off</h3>
                  <p className="text-xs text-brand-slate">{selectedCase.checkId} ? {selectedCase.shipmentId}</p>
                </div>
                <button onClick={() => setSelectedCase(null)} className="rounded-lg p-1.5 text-brand-slate hover:bg-brand-cloud hover:text-brand-navy font-bold">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-brand-cloud/60 p-3 rounded-xl border border-brand-line">
                  <div><span className="text-brand-slate">Corridor:</span> <strong className="text-brand-navy block text-[13px]">{selectedCase.origin} ? {selectedCase.destination}</strong></div>
                  <div><span className="text-brand-slate">HS Code:</span> <strong className="text-brand-navy block text-[13px]">{selectedCase.hsCode} ? {selectedCase.commodity}</strong></div>
                  <div><span className="text-brand-slate">Statutory Citation:</span> <strong className="text-brand-marine block font-mono text-[11px]">{selectedCase.citation}</strong></div>
                  <div><span className="text-brand-slate">Regulatory Readiness:</span> <strong className="text-brand-navy block text-base font-display font-bold">{selectedCase.readinessScore}%</strong></div>
                </div>

                <div>
                  <h4 className="font-semibold text-brand-navy mb-2 uppercase text-[11px]">Required Trade Documentation Checklist</h4>
                  <div className="space-y-2 rounded-xl bg-brand-cloud/20 p-3 border border-brand-line">
                    {selectedCase.checklist.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between border-b border-brand-line/40 py-1.5 last:border-0">
                        <span className="text-brand-navy font-medium">{doc.name}</span>
                        <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                          doc.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : doc.status === 'MISSING' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-brand-navy font-semibold mb-1">Customs Officer Findings & Sign-off Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Enter clearance remarks, conditional waivers, or tariff verification notes..."
                    value={officerComments}
                    onChange={e => setOfficerComments(e.target.value)}
                    className="w-full rounded-xl border border-brand-line p-2.5 text-xs text-brand-navy focus:border-brand-marine focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-brand-line pt-4">
                <button
                  onClick={() => handleDecision('REJECT')}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                >
                  Reject Clearance
                </button>
                <button
                  onClick={() => handleDecision('HOLD')}
                  className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-500 hover:text-white transition-colors"
                >
                  Place on Border Hold
                </button>
                <button
                  onClick={() => handleDecision('APPROVE')}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-xs"
                >
                  Approve & Issue Sign-Off
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
