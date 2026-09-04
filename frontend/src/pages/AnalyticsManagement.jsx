import React from 'react'
import { TrendingUp, DollarSign, BrainCircuit, BarChart3 } from 'lucide-react'
import PageBanner from '../components/PageBanner'

export default function AnalyticsManagement() {
  const kpis = [
    { label: 'Total Quotes Generated', value: '1,420', change: '+18.4% vs last mo', color: 'text-brand-navy' },
    { label: 'Quotes Issued', value: '1,180', change: '83.1% approval rate', color: 'text-emerald-600' },
    { label: 'Pipeline Commercial Value', value: 'Rs. 18.45 Cr', change: 'INR Total', color: 'text-brand-orange' },
    { label: 'Average Realized Margin', value: '16.4%', change: 'Target 15%', color: 'text-brand-marine' }
  ]

  const lanes = [
    { lane: 'Chennai (INMAA) ? Singapore (SGSIN)', teu: '420 TEU', revenue: 'Rs. 3.12 Cr', margin: '15.2%' },
    { lane: 'Nhava Sheva (INNSA) ? Jebel Ali (AEJEA)', teu: '380 TEU', revenue: 'Rs. 2.84 Cr', margin: '16.8%' },
    { lane: 'Nhava Sheva (INNSA) ? Rotterdam (NLRTM)', teu: '290 TEU', revenue: 'Rs. 4.89 Cr', margin: '18.1%' },
    { lane: 'Mundra (INMUN) ? Jebel Ali (AEJEA)', teu: '210 TEU', revenue: 'Rs. 1.58 Cr', margin: '14.9%' }
  ]

  return (
    <div className="min-h-screen bg-brand-cloud pb-16">
      <PageBanner
        crumb="Operations / Executive Analytics"
        title="EXECUTIVE ANALYTICS & REVENUE INTELLIGENCE"
        subtitle="Commercial margins, risk distribution, lane performance, and ML model accuracy"
        icon={BarChart3}
      />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* KPI Summary Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="rounded-2xl border border-brand-line bg-white p-5 shadow-xs">
              <span className="text-xs text-brand-slate font-medium">{kpi.label}</span>
              <p className={`mt-1 font-display text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <span className="mt-1 block text-[11px] text-brand-slateLight">{kpi.change}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          
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
              <p>? Trained on 11,063 real-world verified multimodal records</p>
              <p>? Top Features: Nautical Distance (34%), Weight Density (28%), Bunker Fuel BAF (21%)</p>
              <p>? Automated retraining interval: Bi-weekly</p>
            </div>
          </div>

        </div>

        {/* Top Corridor Performance */}
        <div className="mt-8 rounded-2xl border border-brand-line bg-white p-6 shadow-sm">
          <h3 className="font-display text-sm font-bold text-brand-navy mb-4">Top Volume Corridors & Realized Revenue</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-brand-line bg-brand-cloud/60 text-[11px] uppercase tracking-wider text-brand-slate font-semibold">
                <tr>
                  <th className="px-4 py-3">Shipping Lane</th>
                  <th className="px-4 py-3">Monthly Volume</th>
                  <th className="px-4 py-3">Realized Revenue</th>
                  <th className="px-4 py-3 text-right">Gross Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-line/50">
                {lanes.map((l, idx) => (
                  <tr key={idx} className="hover:bg-brand-cloud/40 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-brand-navy">{l.lane}</td>
                    <td className="px-4 py-3.5 font-mono text-brand-slate">{l.teu}</td>
                    <td className="px-4 py-3.5 font-mono font-bold text-brand-navy">{l.revenue}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-600">{l.margin}</td>
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
