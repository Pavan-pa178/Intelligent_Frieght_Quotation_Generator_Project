import React, { useState, useEffect } from 'react'
import { FileCheck, ShieldCheck, AlertTriangle, Clock, XCircle, Search, Check, ExternalLink, ShieldAlert, History, X, FileText, Send, CheckCircle2, Eye, Download, CheckSquare } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { useApp } from '../context/AppContext'
import { REGULATION_CORPUS, HS_CODE_CATALOG } from '../lib/customsRAG'
import { fetchAllQuotes, customsActionOnQuote } from '../lib/api'
import PageBanner from '../components/PageBanner'

export default function CustomsWorkspace() {
  const toast = useToast()
  const { user } = useApp()
  const [activeTab, setActiveTab] = useState('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCase, setSelectedCase] = useState(null)
  const [officerComments, setOfficerComments] = useState('')
  const [showDocRequestModal, setShowDocRequestModal] = useState(false)
  const [selectedDocsToRequest, setSelectedDocsToRequest] = useState([])
  const [docRequestNotes, setDocRequestNotes] = useState('')
  const [previewDoc, setPreviewDoc] = useState(null)

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
      citation: 'UCC Regulation (EU) No 952/2013 Art 127',
      customerUploadedDocuments: [
        {
          name: 'EU Declaration of Conformity (DoC)',
          file_name: 'eu_declaration_of_conformity_signed.pdf',
          file_size: '284 KB',
          uploaded_by: 'Consignor Exporter',
          uploaded_at: '2026-09-02T16:20:00Z'
        },
        {
          name: 'RoHS 3 Compliance Certificate',
          file_name: 'rohs_compliance_cert_2026.pdf',
          file_size: '192 KB',
          uploaded_by: 'Consignor Exporter',
          uploaded_at: '2026-09-02T16:22:00Z'
        }
      ]
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

  useEffect(() => {
    fetchAllQuotes().then((quotes) => {
      if (!quotes || quotes.length === 0) return
      const relevantQuotes = quotes.filter(q => 
        q.agent_review?.status === 'approved' || 
        q.pipeline_status === 'AGENT_APPROVED' ||
        q.pipeline_status === 'CUSTOMS_DOCS_REQUESTED' ||
        q.pipeline_status === 'DOCS_SUBMITTED' ||
        q.status === 'Agent Approved' ||
        q.status === 'Documents Requested' ||
        q.status === 'Documents Submitted (Pending Customs Sign-off)'
      )

      if (relevantQuotes.length > 0) {
        const dynamicCases = relevantQuotes.map(q => {
          const d = q.details || {}
          const m3_c = q.m3_customs || {}
          const checklist = m3_c.checklist || [
            { name: 'Commercial Invoice (USD/EUR)', uploaded: true, status: 'VERIFIED' },
            { name: 'Packing List with Net/Gross Weight', uploaded: true, status: 'VERIFIED' },
            { name: 'EU Declaration of Conformity', uploaded: false, status: 'MISSING' },
            { name: 'RoHS 3 Compliance Certificate', uploaded: false, status: 'MISSING' }
          ]
          const isApproved = q.customs_review?.status === 'approved' || q.status === 'Approved'
          return {
            quoteId: q.id,
            checkId: `CUST-${q.id.replace('QT-', '')}`,
            shipmentId: q.id,
            origin: `${d.originGw?.city || 'Origin'} (${d.originGw?.code || 'INMAA'})`,
            destination: `${d.destGw?.city || 'Destination'} (${d.destGw?.code || 'NLRTM'})`,
            hsCode: d.hsCode || '850440',
            commodity: d.commodity || 'Static Converters & Solar Inverters',
            readinessScore: m3_c.readiness_score || (isApproved ? 100 : 70),
            riskLevel: m3_c.risk_level || 'MEDIUM',
            status: isApproved ? 'APPROVED' : (
              (q.pipeline_status === 'DOCS_SUBMITTED' || (q.customer_uploaded_documents && q.customer_uploaded_documents.length > 0)) 
                ? 'DOCS_SUBMITTED' 
                : (q.pipeline_status === 'CUSTOMS_DOCS_REQUESTED' ? 'DOCS_FLAGGED' : 'PENDING_REVIEW')
            ),
            requiresOfficer: !isApproved,
            summary: m3_c.summary || 'Trade compliance file generated from customs RAG engine.',
            customerUploadedDocuments: q.customer_uploaded_documents || [],
            checklist: checklist.map(c => {
              const cName = c.item_name || c.name
              const hasUpload = (q.customer_uploaded_documents || []).some(
                ud => (ud.name || '').toLowerCase() === (cName || '').toLowerCase()
              )
              return {
                name: cName,
                uploaded: hasUpload || (c.document_uploaded ?? c.uploaded ?? false),
                status: hasUpload ? 'CUSTOMER_UPLOADED' : (c.status || 'PENDING')
              }
            }),
            citation: m3_c.citations?.[0]?.citation || 'EU Union Customs Code Art 127 advance filing & Low Voltage Directive'
          }
        })
        setCases(prev => {
          const existingIds = new Set(dynamicCases.map(c => c.checkId))
          return [...dynamicCases, ...prev.filter(c => !existingIds.has(c.checkId))]
        })
      }
    })
  }, [])

  const handleDecision = async (decision) => {
    if (!selectedCase) return
    const newStatus = decision === 'APPROVE' ? 'APPROVED' : decision === 'REJECT' ? 'REJECTED' : 'HOLD'

    if (selectedCase.quoteId) {
      try {
        await customsActionOnQuote(selectedCase.quoteId, decision === 'APPROVE' ? 'approve' : 'reject', {
          comment: officerComments || `Customs Officer sign-off decision: ${decision}`,
          officerUser: user
        })
      } catch (err) {
        console.warn('Customs action API error:', err.message)
      }
    }

    setCases(prev => prev.map(c => c.checkId === selectedCase.checkId ? { ...c, status: newStatus, requiresOfficer: false } : c))

    setAuditLogs(prev => [
      {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        checkId: selectedCase.checkId,
        action: `${decision}_BY_OFFICER`,
        actor: user?.name || 'Customs Officer Desk',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
        notes: officerComments || `Officer validated case with decision: ${decision}`
      },
      ...prev
    ])

    toast(`Case ${selectedCase.checkId} ${newStatus.toLowerCase()} successfully!`)
    setSelectedCase(null)
    setOfficerComments('')
  }

  const handleVerifyDoc = (docIndex, docName) => {
    setSelectedCase(prev => {
      if (!prev) return prev
      const updatedUploads = [...(prev.customerUploadedDocuments || [])]
      if (updatedUploads[docIndex]) {
        updatedUploads[docIndex] = { ...updatedUploads[docIndex], verified: true }
      } else {
        // match by name
        for (let i = 0; i < updatedUploads.length; i++) {
          if ((updatedUploads[i].name || '').toLowerCase() === (docName || '').toLowerCase()) {
            updatedUploads[i] = { ...updatedUploads[i], verified: true }
          }
        }
      }

      const updatedChecklist = prev.checklist.map(ci => 
        (ci.name || '').toLowerCase() === (docName || '').toLowerCase() ? { ...ci, status: 'VERIFIED', uploaded: true } : ci
      )

      return {
        ...prev,
        customerUploadedDocuments: updatedUploads,
        checklist: updatedChecklist,
        readinessScore: 100
      }
    })
    toast(`Verified ${docName || 'document'} successfully!`)
  }

  const handleSendDocumentRequest = async () => {
    if (!selectedCase) return
    if (selectedDocsToRequest.length === 0) {
      toast('Please select at least one document to request from customer')
      return
    }

    if (selectedCase.quoteId) {
      try {
        await customsActionOnQuote(selectedCase.quoteId, 'request_documents', {
          requestedDocs: selectedDocsToRequest,
          comment: docRequestNotes || 'Please upload the specified certificates for regulatory customs clearance.',
          officerUser: user
        })
      } catch (err) {
        console.warn('Customs document request error:', err.message)
      }
    }

    setCases(prev => prev.map(c => c.checkId === selectedCase.checkId ? { ...c, status: 'DOCS_FLAGGED' } : c))
    setAuditLogs(prev => [
      {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        checkId: selectedCase.checkId,
        action: 'DOCUMENTS_FLAGGED_BY_OFFICER',
        actor: user?.name || 'Customs Officer Desk',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
        notes: `Flagged ${selectedDocsToRequest.length} document(s): ${selectedDocsToRequest.join(', ')}. Note: ${docRequestNotes}`
      },
      ...prev
    ])

    toast(`Document request alert sent to customer for ${selectedCase.checkId}!`)
    setShowDocRequestModal(false)
    setSelectedCase(null)
    setSelectedDocsToRequest([])
    setDocRequestNotes('')
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
                          c.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          c.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          c.status === 'DOCS_SUBMITTED' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                          c.status === 'DOCS_FLAGGED' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {c.status === 'DOCS_SUBMITTED' ? 'DOCS SUBMITTED' : c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedCase(c)}
                          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold shadow-xs flex items-center gap-1.5 ml-auto transition-colors ${
                            c.status === 'DOCS_SUBMITTED'
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-brand-navy text-white hover:bg-brand-marine'
                          }`}
                        >
                          {c.status === 'DOCS_SUBMITTED' ? <FileCheck className="h-3.5 w-3.5" /> : null}
                          {c.status === 'DOCS_SUBMITTED' ? 'Inspect Docs & Sign' : 'Inspect & Sign-Off'}
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
          <div className="mt-6 space-y-6">
            {/* Treaties & Statutory Acts Section */}
            <div>
              <h3 className="font-display text-sm font-bold text-brand-navy mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-marine" />
                International Maritime & Customs Legal Treaties
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {REGULATION_CORPUS.map((reg) => (
                  <div key={reg.id} className="rounded-2xl border border-brand-line bg-white p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-brand-line pb-2.5 mb-2.5">
                        <span className="rounded-md bg-brand-navy/10 px-2 py-0.5 font-mono text-[11px] font-bold text-brand-navy">{reg.id}</span>
                        <span className="text-[10px] font-mono font-semibold text-brand-slate">{reg.authority}</span>
                      </div>
                      <h4 className="font-semibold text-brand-navy text-xs leading-snug">{reg.title}</h4>
                      <p className="text-[11px] font-mono text-brand-marine mt-1">{reg.citation}</p>
                      
                      <div className="mt-3 space-y-2 border-t border-brand-line/60 pt-2.5">
                        {reg.sections.map(sec => (
                          <div key={sec.sectionId} className="rounded-lg bg-brand-cloud/40 p-2.5 border border-brand-line/40">
                            <div className="font-semibold text-brand-navy text-[11px]">{sec.title}</div>
                            <p className="text-[11px] text-brand-slate mt-1 leading-relaxed">{sec.content}</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {sec.requiredDocs.map((d, di) => (
                                <span key={di} className="rounded bg-white px-1.5 py-0.5 text-[9.5px] font-medium text-brand-navy border border-brand-line shadow-2xs">
                                  {d}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HS Code Regulatory Catalog Section */}
            <div>
              <h3 className="font-display text-sm font-bold text-brand-navy mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Harmonized System (HS) Statutory Tariffs & Document Requirements
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(HS_CODE_CATALOG).map(([code, meta]) => (
                  <div key={code} className="rounded-2xl border border-brand-line bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-brand-line pb-2.5 mb-2.5">
                      <span className="rounded-lg bg-brand-orangePale px-2 py-0.5 font-mono text-xs font-bold text-brand-orange">
                        HS {code}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                        meta.defaultRisk === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        meta.defaultRisk === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {meta.defaultRisk} RISK
                      </span>
                    </div>

                    <h4 className="font-semibold text-brand-navy text-xs leading-snug">{meta.description}</h4>
                    <p className="text-[11px] text-brand-slate mt-1">Chapter {meta.chapter} ? {meta.prohibited ? 'Prohibited Cargo' : meta.restricted ? 'Special Restricted Clearance' : 'Standard Commercial Cargo'}</p>

                    <div className="mt-3">
                      <span className="block text-[11px] font-semibold text-brand-navy mb-1.5">Mandatory Compliance Filings:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {meta.mandatoryDocs.map((doc, di) => (
                          <span key={di} className="rounded-md bg-brand-cloud px-2 py-0.5 text-[10px] text-brand-slate border border-brand-line font-medium">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

                {/* CUSTOMER UPLOADED DOCUMENTS SECTION */}
                <div className="rounded-xl border-2 border-blue-200 bg-blue-50/40 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold text-brand-navy text-xs uppercase tracking-wide">
                        Customer Uploaded Compliance Documents ({selectedCase.customerUploadedDocuments?.length || 0})
                      </h4>
                    </div>
                    {selectedCase.customerUploadedDocuments && selectedCase.customerUploadedDocuments.length > 0 && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        Ready for Inspection
                      </span>
                    )}
                  </div>

                  {(!selectedCase.customerUploadedDocuments || selectedCase.customerUploadedDocuments.length === 0) ? (
                    <p className="text-xs text-brand-slate italic py-1">No custom certificates uploaded by customer yet. Standard baseline trade filings apply.</p>
                  ) : (
                    <div className="space-y-2 mt-2">
                      {selectedCase.customerUploadedDocuments.map((doc, dIdx) => (
                        <div key={dIdx} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-3 border border-blue-100 shadow-2xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-brand-navy text-xs block truncate">{doc.name}</span>
                              <span className="text-[11px] font-mono text-brand-slateLight block">
                                {doc.file_name || 'certificate.pdf'} ? {doc.file_size || '245 KB'} ? Uploaded {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleTimeString() : 'Recently'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewDoc({ ...doc, _index: dIdx })}
                              className="flex items-center gap-1 rounded-lg bg-brand-cloud px-3 py-1.5 text-xs font-semibold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors border border-brand-line shadow-2xs"
                            >
                              <Eye className="h-3.5 w-3.5" /> Inspect File
                            </button>
                            {doc.verified ? (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-300 shadow-2xs">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Verified
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleVerifyDoc(dIdx, doc.name)}
                                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors shadow-xs"
                              >
                                <Check className="h-3.5 w-3.5" /> Verify
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-brand-line pt-4">
                <button
                  type="button"
                  onClick={() => {
                    const missing = selectedCase.checklist.filter(c => !c.uploaded).map(c => c.name)
                    setSelectedDocsToRequest(missing.length > 0 ? missing : [selectedCase.checklist[0]?.name || 'Commercial Invoice'])
                    setShowDocRequestModal(true)
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs"
                >
                  <FileText className="h-3.5 w-3.5 text-amber-600" />
                  Flag / Request Specific Documents
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleDecision('REJECT')}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDecision('APPROVE')}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approve Documentation Sign-Off
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        
        {/* DOCUMENT PREVIEW MODAL */}
        {previewDoc && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" style={{ zIndex: 9999 }}>
            <div className="w-full max-w-xl rounded-2xl border border-brand-line bg-white p-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-brand-line pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-brand-navy">{previewDoc.name}</h3>
                    <p className="text-[11px] font-mono text-brand-slate">{previewDoc.file_name || 'document.pdf'} ? {previewDoc.file_size || '245 KB'}</p>
                  </div>
                </div>
                <button onClick={() => setPreviewDoc(null)} className="rounded-lg p-1.5 text-brand-slate hover:bg-brand-cloud">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Simulated Certificate Display */}
              <div className="mt-4 rounded-xl border border-brand-line bg-brand-cloud/40 p-5 font-serif text-xs text-brand-navy shadow-inner space-y-3">
                <div className="text-center border-b border-brand-line pb-3">
                  <span className="text-[10px] tracking-widest uppercase font-mono font-bold text-brand-slate">Statutory International Trade Certificate</span>
                  <h4 className="text-sm font-bold mt-1 text-brand-navy">{previewDoc.name}</h4>
                  <p className="text-[11px] italic text-brand-slate">Compliance Reference: {selectedCase?.hsCode ? `HS ${selectedCase.hsCode}` : 'ISO / CE Standard'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                  <div><strong>Issuer / Signatory:</strong> <span className="text-brand-slate">Authorized Quality & Safety Lab</span></div>
                  <div><strong>Standard:</strong> <span className="text-brand-slate">Directives 2014/35/EU / RoHS 3</span></div>
                  <div><strong>Status:</strong> <span className="text-emerald-700 font-bold">DIGITALLY SIGNED & VERIFIED</span></div>
                  <div><strong>Submission Date:</strong> <span className="text-brand-slate">{previewDoc.uploaded_at ? new Date(previewDoc.uploaded_at).toLocaleDateString() : 'Active'}</span></div>
                </div>

                <div className="rounded-lg bg-white p-3 border border-brand-line/60 font-mono text-[10.5px] text-brand-slate leading-relaxed">
                  "This document certifies that the consignment under Case {selectedCase?.checkId} matches the statutory technical file and complies with all mandatory customs import regulations."
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-brand-line pt-4">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="rounded-xl border border-brand-line px-4 py-2 text-xs font-semibold text-brand-slate hover:text-brand-navy"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleVerifyDoc(previewDoc._index ?? -1, previewDoc.name)
                    setPreviewDoc(null)
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Document Verified
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OFFICER DOCUMENT REQUEST MODAL */}
        {showDocRequestModal && selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl border border-brand-line bg-white p-6 shadow-2xl animate-in fade-in">
              <div className="flex items-center justify-between border-b border-brand-line pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-600" />
                  <h3 className="text-base font-bold text-brand-navy">Flag Required Documents for Customer</h3>
                </div>
                <button onClick={() => setShowDocRequestModal(false)} className="rounded-full p-1 text-brand-slate hover:bg-brand-cloud">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-3 text-xs text-brand-slate">
                Select the specific documents required from the shipper/customer before clearance approval can be granted:
              </p>

              <div className="mt-4 space-y-2 max-h-[40vh] overflow-y-auto">
                {selectedCase.checklist.map((doc, idx) => {
                  const isChecked = selectedDocsToRequest.includes(doc.name)
                  return (
                    <label key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-brand-line bg-brand-cloud/30 hover:bg-brand-cloud cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDocsToRequest(prev => [...prev, doc.name])
                            } else {
                              setSelectedDocsToRequest(prev => prev.filter(n => n !== doc.name))
                            }
                          }}
                          className="rounded accent-amber-600 h-4 w-4"
                        />
                        <span className="text-xs font-semibold text-brand-navy">{doc.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${doc.uploaded ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {doc.uploaded ? 'UPLOADED' : 'MISSING'}
                      </span>
                    </label>
                  )
                })}
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-brand-navy mb-1">Officer Instructions / Directive to Customer</label>
                <textarea
                  rows={2}
                  value={docRequestNotes}
                  onChange={(e) => setDocRequestNotes(e.target.value)}
                  placeholder="e.g. Please provide EU Declaration of Conformity citing Low Voltage Directive and RoHS test report..."
                  className="w-full rounded-xl border border-brand-line p-2.5 text-xs text-brand-navy focus:border-brand-marine focus:outline-none"
                />
              </div>

              <div className="mt-5 flex justify-end gap-3 border-t border-brand-line pt-4">
                <button
                  type="button"
                  onClick={() => setShowDocRequestModal(false)}
                  className="rounded-xl border border-brand-line px-4 py-2 text-xs font-semibold text-brand-slate hover:bg-brand-cloud"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendDocumentRequest}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-5 py-2 text-xs font-bold text-white hover:bg-amber-700 shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Document Request to Customer
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  )
}
