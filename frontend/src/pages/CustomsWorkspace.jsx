import React, { useState } from 'react'
import { FileCheck, ShieldCheck, AlertTriangle, Clock, XCircle, Search, Check, ExternalLink, ShieldAlert, History } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { REGULATION_CORPUS } from '../lib/customsRAG'

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
      citation: 'India-Singapore CECA Rules of Origin'
    }
  ])

  const [auditLogs, setAuditLogs] = useState([
    { eventId: 'AUD-901', actor: 'Customs Officer', action: 'AUTO_PASS_CECA', checkId: 'CUST-CHK-63024', timestamp: '1 hour ago' }
  ])

  const handleSignOff = (decision) => {
    if (!selectedCase) return
    const newStatus = decision === 'APPROVE' ? 'APPROVED' : (decision === 'REQUEST_DOCS' ? 'HOLD' : 'REJECTED')
    setCases(prev => prev.map(c => c.checkId === selectedCase.checkId ? { ...c, status: newStatus, requiresOfficer: false } : c))
    
    const newAudit = {
      eventId: 'AUD-' + Date.now().toString().slice(-4),
      actor: 'Officer (Current Session)',
      action: 'CUSTOMS_' + decision,
      checkId: selectedCase.checkId,
      comments: officerComments || 'Formal decision recorded in customs ledger.',
      timestamp: 'Just now'
    }
    setAuditLogs([newAudit, ...auditLogs])

    toast(decision === 'APPROVE' ? 'Compliance Approved - Quote Unblocked' : (decision === 'REQUEST_DOCS' ? 'Documents Requested - Quote Placed on Hold' : 'Shipment Rejected - Quote Blocked'))
    setSelectedCase(null)
    setOfficerComments('')
  }

  const filteredCases = cases.filter(c => 
    c.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.hsCode.includes(searchQuery) ||
    c.commodity.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">CUSTOMS COMPLIANCE WORKSPACE</h1>
              <p className="text-xs text-slate-400">Harmonized System (HS) Validation, Legal RAG Corpus & Human Sign-off Desk</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2 text-center">
              <span className="text-[11px] text-slate-400 uppercase">Pending Review</span>
              <p className="text-lg font-bold text-amber-400">{cases.filter(c => c.requiresOfficer).length}</p>
            </div>
            <div className="rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2 text-center">
              <span className="text-[11px] text-slate-400 uppercase">Auto-Passed</span>
              <p className="text-lg font-bold text-emerald-400">{cases.filter(c => c.status === 'APPROVED').length}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2 border-b border-slate-800 pb-3">
          <button onClick={() => setActiveTab('pending')} className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${activeTab === 'pending' ? 'bg-brand-orange text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
            Pending Reviews ({cases.filter(c => c.requiresOfficer).length})
          </button>
          <button onClick={() => setActiveTab('regulations')} className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${activeTab === 'regulations' ? 'bg-brand-orange text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
            Regulation Legal Corpus
          </button>
          <button onClick={() => setActiveTab('audit')} className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${activeTab === 'audit' ? 'bg-brand-orange text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
            Sign-off Audit Trail ({auditLogs.length})
          </button>
        </div>

        {activeTab === 'pending' && (
          <div className="mt-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by HS code, commodity, or shipment ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-brand-orange focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400">
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
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCases.map(c => (
                    <tr key={c.checkId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-white">{c.checkId}</span>
                        <div className="text-[11px] text-slate-500">{c.shipmentId}</div>
                      </td>
                      <td className="px-4 py-3.5 font-medium">{c.origin} ? {c.destination}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-cyan-300 font-bold">{c.hsCode}</span>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{c.commodity}</div>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-white">{c.readinessScore}%</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${c.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : c.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {c.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold ${c.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300' : c.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button onClick={() => setSelectedCase(c)} className="rounded-lg bg-brand-navy border border-brand-orange/40 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-orange transition-all">
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

        {activeTab === 'regulations' && (
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {REGULATION_CORPUS.map(reg => (
              <div key={reg.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-display text-sm font-bold text-white">{reg.title}</h4>
                  <span className="text-[11px] text-cyan-400 font-mono">{reg.citation}</span>
                </div>
                <div className="mt-3 space-y-3">
                  {reg.sections.map(sec => (
                    <div key={sec.sectionId} className="rounded-lg bg-slate-800/50 p-3 text-xs border border-slate-700/40">
                      <div className="font-semibold text-slate-200">{sec.title}</div>
                      <p className="mt-1 text-slate-400 text-[11px] leading-relaxed">{sec.content}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {sec.requiredDocs.map((doc, idx) => (
                          <span key={idx} className="rounded bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h4 className="font-display text-sm font-bold text-white mb-4">Immutable Compliance Audit Log</h4>
            <div className="space-y-2">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-800/40 p-3 text-xs border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-cyan-400 font-bold">{log.eventId}</span>
                    <span className="font-semibold text-white">{log.actor}</span>
                    <span className="rounded bg-slate-900 px-2 py-0.5 text-[11px] text-amber-300">{log.action}</span>
                    <span className="text-slate-400">({log.checkId})</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">Customs Compliance Case Review</h3>
                  <p className="text-xs text-slate-400">{selectedCase.checkId} ? {selectedCase.shipmentId}</p>
                </div>
                <button onClick={() => setSelectedCase(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">?</button>
              </div>

              <div className="mt-4 space-y-4 max-h-[65vh] overflow-y-auto pr-1 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <div><span className="text-slate-400">Corridor:</span> <strong className="text-white block">{selectedCase.origin} ? {selectedCase.destination}</strong></div>
                  <div><span className="text-slate-400">HS Code:</span> <strong className="text-cyan-300 block">{selectedCase.hsCode} ? {selectedCase.commodity}</strong></div>
                </div>

                <div>
                  <h5 className="font-semibold text-slate-300 mb-1.5 uppercase text-[11px]">Required Documents Inspection</h5>
                  <div className="space-y-1.5">
                    {selectedCase.checklist.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-800/40 p-2.5 border border-slate-700/30">
                        <span className="text-slate-200">{item.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${item.uploaded ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-slate-800/30 p-3 border border-slate-800 text-[11px]">
                  <strong className="text-slate-200">Legal Citation:</strong> {selectedCase.citation}
                  <p className="mt-1 text-slate-400">{selectedCase.summary}</p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Compliance Officer Decision Comments</label>
                  <textarea
                    value={officerComments}
                    onChange={e => setOfficerComments(e.target.value)}
                    placeholder="Enter official customs clearance remarks or conditional requirements..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-orange focus:outline-none h-20"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5 border-t border-slate-800 pt-4">
                <button onClick={() => handleSignOff('APPROVE')} className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all">
                  Approve Compliance (Unblock Quote)
                </button>
                <button onClick={() => handleSignOff('REQUEST_DOCS')} className="rounded-lg bg-amber-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-500 transition-all">
                  Request Docs (Hold)
                </button>
                <button onClick={() => handleSignOff('REJECT')} className="rounded-lg bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-500 transition-all">
                  Reject (Block Quote)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
