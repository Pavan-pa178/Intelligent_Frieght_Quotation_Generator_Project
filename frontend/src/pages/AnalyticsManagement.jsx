import React from 'react'
import { TrendingUp, DollarSign, BrainCircuit } from 'lucide-react'

export default function AnalyticsManagement() {
  const kpis = [
    { label: 'Total Quotes Generated', value: '1,420', change: '+18.4% vs last mo', color: 'text-white' },
    { label: 'Quotes Issued', value: '1,180', change: '83.1% approval rate', color: 'text-emerald-400' },
    { label: 'Pipeline Commercial Value', value: 'Rs. 18.45 Cr', change: 'INR Total', color: 'text-cyan-400' },
    { label: 'Average Realized Margin', value: '16.4%', change: 'Target 15%', color: 'text-amber-400' }
  ]

  const lanes = [
    { lane: 'Chennai (INMAA) -> Singapore (SGSIN)', teu: '420 TEU', revenue: 'Rs. 3.12 Cr', margin: '15.2%' },
    { lane: 'Nhava Sheva (INNSA) -> Jebel Ali (AEJEA)', teu: '380 TEU', revenue: 'Rs. 2.84 Cr', margin: '16.8%' },
    { lane: 'Nhava Sheva (INNSA) -> Rotterdam (NLRTM)', teu: '290 TEU', revenue: 'Rs. 4.89 Cr', margin: '18.1%' },
    { lane: 'Mundra (INMUN) -> Jebel Ali (AEJEA)', teu: '210 TEU', revenue: 'Rs. 1.58 Cr', margin: '14.9%' }
  ]

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">EXECUTIVE ANALYTICS & REVENUE INTELLIGENCE</h1>
            <p className="text-xs text-slate-400">Commercial margins, risk distribution, lane performance, and ML model accuracy</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
              <span className="text-xs text-slate-400">{kpi.label}</span>
              <p className={`mt-1 font-display text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <span className="mt-1 block text-[11px] text-slate-500">{kpi.change}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h3 className="font-display text-sm font-bold text-white mb-4">Shipment Risk Score Distribution</h3>
            <div className="space-y-3">
              {[
                { label: 'LOW (0 - 30 pts)', count: 890, pct: 62.7, color: 'bg-emerald-500' },
                { label: 'MEDIUM (31 - 60 pts)', count: 380, pct: 26.8, color: 'bg-amber-500' },
                { label: 'HIGH (61 - 80 pts)', count: 125, pct: 8.8, color: 'bg-rose-500' },
                { label: 'CRITICAL (81 - 100 pts)', count: 25, pct: 1.7, color: 'bg-rose-800' }
              ].map((r, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{r.label}</span>
                    <span className="text-slate-400">{r.count} quotes ({r.pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-indigo-500/30 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-indigo-400" /> ML Pricing Model Performance
              </h3>
              <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300 font-bold">LightGBM v3.2</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div className="rounded-lg bg-slate-800/60 p-3 border border-slate-700/40">
                <span className="text-[10px] text-slate-400 uppercase">Test R2 Score</span>
                <p className="text-base font-bold text-indigo-300">0.942</p>
              </div>
              <div className="rounded-lg bg-slate-800/60 p-3 border border-slate-700/40">
                <span className="text-[10px] text-slate-400 uppercase">Test MAE</span>
                <p className="text-base font-bold text-white">Rs. 2,420</p>
              </div>
              <div className="rounded-lg bg-slate-800/60 p-3 border border-slate-700/40">
                <span className="text-[10px] text-slate-400 uppercase">Within ?5%</span>
                <p className="text-base font-bold text-emerald-400">94.8%</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Model trained across 48,500 real-world carrier booking contracts. Evaluates bunker fuel, seasonal demand, port congestion dwell, and lane density.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <h3 className="font-display text-sm font-bold text-white mb-4">Top Volume Trade Lanes & Commercial Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">Corridor</th>
                  <th className="px-4 py-3">Volume</th>
                  <th className="px-4 py-3">Total Revenue</th>
                  <th className="px-4 py-3 text-right">Avg Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {lanes.map((l, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-semibold text-white">{l.lane}</td>
                    <td className="px-4 py-3">{l.teu}</td>
                    <td className="px-4 py-3 font-mono text-cyan-300">{l.revenue}</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-400">{l.margin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
