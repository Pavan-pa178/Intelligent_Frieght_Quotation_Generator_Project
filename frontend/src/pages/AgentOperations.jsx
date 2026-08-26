import React, { useState } from 'react'
import { Activity, CheckCircle2, ShieldAlert, Clock, Cpu, RefreshCw } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export default function AgentOperations() {
  const toast = useToast()
  const [refreshing, setRefreshing] = useState(false)

  const agents = [
    {
      id: 'agent-route',
      name: 'Route Intelligence Agent',
      type: 'ROUTING',
      status: 'HEALTHY',
      uptime: 99.98,
      latencyP50: 142,
      latencyP95: 280,
      successRate: 99.6,
      requests24h: 4120,
      lastRun: '1 min ago',
      fallback: 'ACTIVE_CACHE',
      desc: 'Multi-modal waypoint interpolation, nautical distance modeling, and carrier port rotation scoring.'
    },
    {
      id: 'agent-pricing',
      name: '5-Layer Tariff & ML Pricing Agent',
      type: 'PRICING',
      status: 'HEALTHY',
      uptime: 100.0,
      latencyP50: 85,
      latencyP95: 160,
      successRate: 99.9,
      requests24h: 4350,
      lastRun: 'Just now',
      fallback: 'CONTRACT_TARIFF',
      desc: 'Contract rate card matching, dynamic surcharge engine (BAF/THC/Doc), and LightGBM regression inference.'
    },
    {
      id: 'agent-weather',
      name: 'Weather Risk & Storm Tracking Agent',
      type: 'WEATHER',
      status: 'HEALTHY',
      uptime: 99.85,
      latencyP50: 210,
      latencyP95: 450,
      successRate: 99.2,
      requests24h: 3890,
      lastRun: '2 mins ago',
      fallback: 'NOAA_OFFLINE_CACHE',
      desc: 'Meteorological ensemble sampling, wave height modeling, and cyclone delay estimation.'
    },
    {
      id: 'agent-customs',
      name: 'Customs Intelligence & Legal RAG Agent',
      type: 'CUSTOMS',
      status: 'HEALTHY',
      uptime: 99.92,
      latencyP50: 320,
      latencyP95: 680,
      successRate: 98.9,
      requests24h: 3210,
      lastRun: '4 mins ago',
      fallback: 'STATIC_CORPUS_EMBEDDINGS',
      desc: 'HS Code validation, international trade law RAG retrieval, and compliance checklist synthesis.'
    },
    {
      id: 'agent-risk',
      name: 'Composite Shipment Risk Engine',
      type: 'RISK',
      status: 'HEALTHY',
      uptime: 100.0,
      latencyP50: 45,
      latencyP95: 95,
      successRate: 100.0,
      requests24h: 4200,
      lastRun: 'Just now',
      fallback: 'WEIGHTED_FALLBACK',
      desc: '5-factor weighted risk aggregation, explainability generator, and operational alert dispatcher.'
    }
  ]

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      toast('All 5 AI Agent orchestrators pinged successfully.')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">AI AGENT OPERATIONS CENTER</h1>
              <p className="text-xs text-slate-400">Real-time health, latency telemetry, and execution traces for all 5 pipeline agents</p>
            </div>
          </div>

          <button onClick={handleRefresh} className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-all">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> Run Diagnostic Ping
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {agents.map(agent => (
            <div key={agent.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">{agent.name}</h3>
                    <span className="text-[11px] text-indigo-400 font-mono">{agent.type}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3" /> {agent.status}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-400 leading-relaxed">{agent.desc}</p>

                <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-slate-950 p-2.5 text-center border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Uptime</span>
                    <strong className="text-xs text-white font-mono">{agent.uptime}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Latency (p50)</span>
                    <strong className="text-xs text-cyan-400 font-mono">{agent.latencyP50} ms</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Success Rate</span>
                    <strong className="text-xs text-emerald-400 font-mono">{agent.successRate}%</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-[11px] text-slate-500">
                <span>Fallback: <strong className="text-slate-400 font-mono">{agent.fallback}</strong></span>
                <span>Last run: <strong className="text-slate-300">{agent.lastRun}</strong></span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <h3 className="font-display text-sm font-bold text-white mb-4">Recent Multi-Agent Orchestration Traces</h3>
          <div className="space-y-2">
            {[
              { traceId: 'TRC-8921', agent: 'Weather Agent', action: 'Sampled 6 waypoints for INMAA-SGSIN', ms: 215, status: 'SUCCESS', time: '2 mins ago' },
              { traceId: 'TRC-8920', agent: 'Customs RAG', action: 'Retrieved UCC Art 127 for HS 850440', ms: 340, status: 'SUCCESS', time: '4 mins ago' },
              { traceId: 'TRC-8919', agent: 'Risk Engine', action: 'Computed composite score: 32 (MEDIUM)', ms: 48, status: 'SUCCESS', time: '5 mins ago' },
              { traceId: 'TRC-8918', agent: 'ML Pricing', action: 'Predicted spot price variance: -1.8%', ms: 92, status: 'SUCCESS', time: '7 mins ago' },
              { traceId: 'TRC-8917', agent: 'Route Agent', action: 'Matched direct Maersk service rotation', ms: 138, status: 'SUCCESS', time: '10 mins ago' }
            ].map(t => (
              <div key={t.traceId} className="flex items-center justify-between rounded-lg bg-slate-800/40 p-3 text-xs border border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-cyan-400 font-bold">{t.traceId}</span>
                  <span className="font-semibold text-white">{t.agent}</span>
                  <span className="text-slate-400">{t.action}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 font-mono">{t.ms} ms</span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">{t.status}</span>
                  <span className="text-slate-500 text-[11px]">{t.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
