import React, { useState } from 'react'
import { Activity, CheckCircle2, ShieldAlert, Clock, Cpu, RefreshCw } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import PageBanner from '../components/PageBanner'

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
      successRate: 98.8,
      requests24h: 3420,
      lastRun: '5 mins ago',
      fallback: 'CBIC_LOCAL_EMBEDDINGS',
      desc: 'Vector retrieval across CBIC/EU/US customs codes, document verification, and officer handoff trigger.'
    },
    {
      id: 'agent-risk',
      name: '5-Factor Composite Risk Agent',
      type: 'RISK',
      status: 'HEALTHY',
      uptime: 99.99,
      latencyP50: 65,
      latencyP95: 120,
      successRate: 99.9,
      requests24h: 4410,
      lastRun: 'Just now',
      fallback: 'DEFAULT_SAFETY_BUFFER',
      desc: 'Calculates weighted risk score (Weather 25%, Customs 25%, Route 20%, Port 15%, Cargo 15%).'
    }
  ]

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      toast('Agent health metrics and telemetry synchronized')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-brand-cloud pb-16">
      <PageBanner
        crumb="Operations / AI Ops Telemetry"
        title="AI AGENT OPERATIONS & TELEMETRY"
        subtitle="Live multi-agent orchestration, health telemetry, and fallback routing"
        icon={Cpu}
      />

      <div className="mx-auto max-w-[1220px] px-8 sm:px-5 pt-8">
        
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-line bg-white p-5 rounded-2xl shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold text-brand-navy">Orchestration Cluster</span>
              <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold">
                5 OF 5 ONLINE
              </span>
            </div>
            <p className="text-xs text-brand-slate mt-0.5">Real-time latency SLAs, cache fallbacks, and task throughput</p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2 text-xs font-semibold text-white hover:bg-brand-marine transition-colors shadow-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
          </button>
        </div>

        {/* Global Cluster Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-brand-line bg-white p-5 shadow-xs">
            <span className="text-xs text-brand-slate font-medium">Cluster Uptime (30d)</span>
            <p className="mt-1 font-display text-2xl font-bold text-emerald-600">99.95%</p>
            <span className="mt-1 block text-[11px] text-brand-slateLight">Zero Sev-1 incidents</span>
          </div>
          <div className="rounded-2xl border border-brand-line bg-white p-5 shadow-xs">
            <span className="text-xs text-brand-slate font-medium">Avg Inference Latency</span>
            <p className="mt-1 font-display text-2xl font-bold text-brand-navy">164 ms</p>
            <span className="mt-1 block text-[11px] text-brand-slateLight">p50 across 5 agents</span>
          </div>
          <div className="rounded-2xl border border-brand-line bg-white p-5 shadow-xs">
            <span className="text-xs text-brand-slate font-medium">Total 24h Invocations</span>
            <p className="mt-1 font-display text-2xl font-bold text-brand-orange">20,190</p>
            <span className="mt-1 block text-[11px] text-brand-slateLight">+12% peak quote load</span>
          </div>
          <div className="rounded-2xl border border-brand-line bg-white p-5 shadow-xs">
            <span className="text-xs text-brand-slate font-medium">Circuit Breaker Fallback</span>
            <p className="mt-1 font-display text-2xl font-bold text-emerald-600">STANDBY</p>
            <span className="mt-1 block text-[11px] text-brand-slateLight">Local cache active</span>
          </div>
        </div>

        {/* Individual Agent Health Cards */}
        <div className="mt-8 space-y-4">
          <h3 className="font-display text-base font-bold text-brand-navy">Autonomous Domain Agents</h3>

          <div className="grid grid-cols-1 gap-4">
            {agents.map(agent => (
              <div key={agent.id} className="rounded-2xl border border-brand-line bg-white p-6 shadow-sm hover:border-brand-marine/50 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-cloud border border-brand-line text-brand-navy">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display text-sm font-bold text-brand-navy">{agent.name}</h4>
                        <span className="rounded-md bg-brand-navy/10 px-2 py-0.5 font-mono text-[10px] font-bold text-brand-navy">
                          {agent.type}
                        </span>
                      </div>
                      <p className="text-xs text-brand-slate mt-0.5">{agent.desc}</p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 font-mono text-xs font-bold">
                    {agent.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 text-xs">
                  <div>
                    <span className="text-brand-slate">Uptime:</span>
                    <strong className="block font-mono text-emerald-600 font-bold mt-0.5">{agent.uptime}%</strong>
                  </div>
                  <div>
                    <span className="text-brand-slate">Latency (p50 / p95):</span>
                    <strong className="block font-mono text-brand-navy font-bold mt-0.5">{agent.latencyP50}ms / {agent.latencyP95}ms</strong>
                  </div>
                  <div>
                    <span className="text-brand-slate">Success Rate:</span>
                    <strong className="block font-mono text-brand-navy font-bold mt-0.5">{agent.successRate}%</strong>
                  </div>
                  <div>
                    <span className="text-brand-slate">24h Volume:</span>
                    <strong className="block font-mono text-brand-navy font-bold mt-0.5">{agent.requests24h.toLocaleString()} calls</strong>
                  </div>
                  <div>
                    <span className="text-brand-slate">Fallback Mechanism:</span>
                    <strong className="block font-mono text-brand-marine font-semibold text-[11px] mt-0.5">{agent.fallback}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
