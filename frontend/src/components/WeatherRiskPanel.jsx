import React from 'react'
import { CloudRain, Wind, Waves, AlertTriangle, CheckCircle2, ShieldAlert, Compass } from 'lucide-react'

export default function WeatherRiskPanel({ weather }) {
  if (!weather) return null

  const { riskScore = 25, riskLevel = 'LOW', delayProbabilityPct = 12, maxWaveHeightM = 1.4, maxWindSpeedKts = 16, waypoints = [], storms = [], routeAdvice } = weather

  const isHigh = riskLevel === 'HIGH' || riskLevel === 'CRITICAL'
  const isMed = riskLevel === 'MEDIUM'

  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-900/90 p-5 text-white shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isHigh ? 'bg-rose-500/20 text-rose-400' : isMed ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            <CloudRain className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold tracking-wide text-white">WEATHER RISK & STORM TRACKING</h4>
            <p className="text-xs text-slate-400">NOAA / ECMWF Satellite Ensemble (v4.2)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${isHigh ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : isMed ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
            {isHigh ? <ShieldAlert className="h-3.5 w-3.5" /> : isMed ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            {riskLevel} RISK ({riskScore}/100)
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg bg-slate-800/60 p-3 border border-slate-700/40">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Waves className="h-3.5 w-3.5 text-cyan-400" /> Max Wave
          </div>
          <p className="mt-1 font-display text-base font-bold text-white">{maxWaveHeightM} m</p>
          <span className="text-[11px] text-slate-400">Significant swell</span>
        </div>

        <div className="rounded-lg bg-slate-800/60 p-3 border border-slate-700/40">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Wind className="h-3.5 w-3.5 text-sky-400" /> Max Wind
          </div>
          <p className="mt-1 font-display text-base font-bold text-white">{maxWindSpeedKts} kts</p>
          <span className="text-[11px] text-slate-400">Sustained cross-wind</span>
        </div>

        <div className="rounded-lg bg-slate-800/60 p-3 border border-slate-700/40">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> Delay Risk
          </div>
          <p className="mt-1 font-display text-base font-bold text-amber-400">{delayProbabilityPct}%</p>
          <span className="text-[11px] text-slate-400">Weather delay chance</span>
        </div>

        <div className="rounded-lg bg-slate-800/60 p-3 border border-slate-700/40">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Compass className="h-3.5 w-3.5 text-emerald-400" /> Waypoints
          </div>
          <p className="mt-1 font-display text-base font-bold text-white">{waypoints.length} Sampled</p>
          <span className="text-[11px] text-slate-400">Marine GPS path</span>
        </div>
      </div>

      {storms && storms.length > 0 && (
        <div className="mt-3.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
            <span>Active Advisory: {storms[0].name} ({storms[0].severity} Severity)</span>
          </div>
        </div>
      )}

      {routeAdvice && (
        <p className="mt-3 rounded-lg bg-black/20 p-2.5 text-xs text-slate-300 border border-slate-800/60">
          <strong className="text-slate-200">Voyage Advisory:</strong> {routeAdvice}
        </p>
      )}
    </div>
  )
}
