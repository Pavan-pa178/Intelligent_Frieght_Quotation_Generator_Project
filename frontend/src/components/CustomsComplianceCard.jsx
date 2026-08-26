import React from 'react'
import { FileCheck, ShieldCheck, AlertCircle, ExternalLink, Check, Clock, XCircle } from 'lucide-react'

export default function CustomsComplianceCard({ customs }) {
  if (!customs) return null

  const { hsCode, hsDescription, readinessScore = 100, complianceStatus = 'APPROVED', checklist = [], citations = [], summary, requiresOfficerReview } = customs

  const isApproved = complianceStatus === 'APPROVED'
  const isHeld = complianceStatus === 'NEEDS_DOCUMENTS' || complianceStatus === 'OFFICER_REVIEW_REQUIRED'
  const isRejected = complianceStatus === 'REJECTED'

  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-900/90 p-5 text-white shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isApproved ? 'bg-emerald-500/20 text-emerald-400' : isHeld ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold tracking-wide text-white">CUSTOMS COMPLIANCE & RAG VERIFICATION</h4>
            <p className="text-xs text-slate-400">HS Code: <span className="font-semibold text-white">{hsCode}</span> ? {hsDescription}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${isApproved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : isHeld ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
            {isApproved ? <ShieldCheck className="h-3.5 w-3.5" /> : isHeld ? <Clock className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
            {complianceStatus.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Regulatory Document Readiness</span>
          <span className="font-bold text-white">{readinessScore}% Complete</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div className={`h-full transition-all duration-500 ${readinessScore >= 80 ? 'bg-emerald-500' : readinessScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${readinessScore}%` }} />
        </div>
      </div>

      <div className="mt-4">
        <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mandatory Document Checklist</h5>
        <div className="mt-2 space-y-1.5">
          {checklist.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-800/50 p-2 text-xs border border-slate-700/30">
              <div className="flex items-center gap-2">
                {item.uploaded ? <Check className="h-4 w-4 text-emerald-400" /> : <Clock className="h-4 w-4 text-amber-400" />}
                <span className={item.uploaded ? 'text-slate-200' : 'text-amber-200 font-medium'}>{item.name}</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded ${item.uploaded ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {citations && citations.length > 0 && (
        <div className="mt-3.5 rounded-lg bg-black/20 p-2.5 text-xs text-slate-300 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <ExternalLink className="h-3 w-3 text-cyan-400" />
            <strong className="text-slate-200">Legal Citation:</strong> {citations[0].citation}
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-2">{citations[0].content}</p>
        </div>
      )}
    </div>
  )
}
