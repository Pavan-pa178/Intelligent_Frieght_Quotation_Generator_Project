import React from 'react'
import { Shield, AlertTriangle, ShieldAlert, CheckCircle2, Info } from 'lucide-react'

export default function CompositeRiskCard({ risk }) {
  if (!risk) return null

  const { overallScore = 28, riskLevel = 'LOW', color = '#10B981', explanation, guidance, factors = [], formula } = risk

  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-900/90 p-5 text-white shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-white">
            <Shield className="h-5 w-5" style={{ color }} />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold tracking-wide text-white">COMPOSITE SHIPMENT RISK ENGINE</h4>
            <p className="text-xs text-slate-400">{formula}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold border" style={{ backgroundColor: `${color}20`, borderColor: `${color}40`, color }}>
            {riskLevel} RISK ({overallScore}/100)
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {factors.map((f, idx) => (
          <div key={idx} className="rounded-lg bg-slate-800/40 p-2.5 text-xs border border-slate-700/30">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-200">{f.name} ({f.weight}%)</span>
              <span className="font-bold" style={{ color: f.severity === 'HIGH' ? '#EF4444' : f.severity === 'MEDIUM' ? '#F59E0B' : '#10B981' }}>
                {f.score}/100 (+{f.contribution} pts)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{f.reason}</p>
          </div>
        ))}
      </div>

      {explanation && (
        <div className="mt-3.5 rounded-lg bg-black/25 p-3 text-xs text-slate-300 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold mb-1">
            <Info className="h-3.5 w-3.5 text-cyan-400" /> Risk Explainability & Guidance
          </div>
          <p className="text-xs text-slate-300">{explanation}</p>
          <p className="mt-1 text-[11px] text-slate-400">{guidance}</p>
        </div>
      )}
    </div>
  )
}
