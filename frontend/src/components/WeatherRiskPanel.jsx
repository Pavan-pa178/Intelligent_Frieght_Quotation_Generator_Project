import React from 'react'
import { CloudRain, Wind, Waves, AlertTriangle, CheckCircle2, ShieldAlert, Compass } from 'lucide-react'

export default function WeatherRiskPanel({ weather }) {
  if (!weather) return null

  const {
    riskScore = 24,
    riskLevel = 'LOW',
    delayProbabilityPct = 8,
    maxWaveHeightM = 1.2,
    maxWindSpeedKts = 14,
    waypoints = [],
    storms = [],
    routeAdvice,
    provider = 'Open-Meteo & NOAA Satellite Marine Ensemble'
  } = weather

  const isHigh = riskLevel === 'HIGH' || riskLevel === 'CRITICAL'
  const isMed = riskLevel === 'MEDIUM'

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line pb-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isHigh ? 'bg-rose-50 text-rose-600' : isMed ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            <CloudRain className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold tracking-wide text-brand-navy">WEATHER INTELLIGENCE & STORM RISK</h4>
            <p className="text-xs text-brand-slate">{provider}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            isHigh 
              ? 'bg-rose-50 text-rose-700 border border-rose-200' 
              : isMed 
                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {isHigh ? <ShieldAlert className="h-3.5 w-3.5" /> : isMed ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            {riskLevel} RISK ({riskScore}/100)
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-brand-cloud p-3.5 border border-brand-line">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-slate">
            <Waves className="h-3.5 w-3.5 text-cyan-600" /> Max Swell
          </div>
          <p className="mt-1 font-display text-lg font-bold text-brand-navy">{maxWaveHeightM} m</p>
          <span className="text-[11px] text-brand-slateLight">Significant wave height</span>
        </div>

        <div className="rounded-xl bg-brand-cloud p-3.5 border border-brand-line">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-slate">
            <Wind className="h-3.5 w-3.5 text-sky-600" /> Wind Speed
          </div>
          <p className="mt-1 font-display text-lg font-bold text-brand-navy">{maxWindSpeedKts} kts</p>
          <span className="text-[11px] text-brand-slateLight">Sustained marine wind</span>
        </div>

        <div className="rounded-xl bg-brand-cloud p-3.5 border border-brand-line">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-slate">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Delay Risk
          </div>
          <p className="mt-1 font-display text-lg font-bold text-brand-navy">{delayProbabilityPct}%</p>
          <span className="text-[11px] text-brand-slateLight">Transit contingency chance</span>
        </div>

        <div className="rounded-xl bg-brand-cloud p-3.5 border border-brand-line">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-slate">
            <Compass className="h-3.5 w-3.5 text-emerald-600" /> Waypoints
          </div>
          <p className="mt-1 font-display text-lg font-bold text-brand-navy">{waypoints.length || 6} Sampled</p>
          <span className="text-[11px] text-brand-slateLight">Geo-interpolated route</span>
        </div>
      </div>

      {storms && storms.length > 0 && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
            <span>Active Advisory: {storms[0].name} ({storms[0].severity} Severity)</span>
          </div>
        </div>
      )}

      {routeAdvice && (
        <div className="mt-4 rounded-xl bg-brand-cloud p-3.5 text-xs text-brand-slate border border-brand-line">
          <strong className="text-brand-navy font-semibold">Voyage Forecast & Advisory:</strong> {routeAdvice}
        </div>
      )}
    </div>
  )
}
