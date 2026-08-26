import React from 'react'
import { BrainCircuit, TrendingDown, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react'

export default function MLPricingCard({ mlPricing }) {
  if (!mlPricing) return null

  const { rulePrice, mlPredictedPrice, varianceInr, variancePct, lowerBound, upperBound, marketSentiment, recommendation, explanation, modelName, accuracyR2 } = mlPricing

  const isLower = varianceInr < 0

  return (
    <div className="rounded-xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 p-5 text-white shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/30 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold tracking-wide text-white flex items-center gap-2">
              ML PRICE PREDICTION & BENCHMARK <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            </h4>
            <p className="text-xs text-indigo-200/70">{modelName} - Test R2 = {accuracyR2}</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
          {marketSentiment} CAPACITY
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-800/60 p-3 border border-slate-700/40">
          <span className="text-xs text-slate-400">Rule-Based Tariff</span>
          <p className="mt-1 font-display text-lg font-bold text-white"> Rs. {rulePrice.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Contract Rate Card</span>
        </div>

        <div className="rounded-lg bg-indigo-950/60 p-3 border border-indigo-500/30">
          <span className="text-xs text-indigo-300 flex items-center gap-1">
            ML Spot Prediction {isLower ? <TrendingDown className="h-3.5 w-3.5 text-emerald-400" /> : <TrendingUp className="h-3.5 w-3.5 text-amber-400" />}
          </span>
          <p className="mt-1 font-display text-lg font-bold text-indigo-200"> Rs. {mlPredictedPrice.toLocaleString()}</p>
          <span className={`text-[11px] font-semibold ${isLower ? 'text-emerald-400' : 'text-amber-400'}`}>
            {variancePct >= 0 ? '+' : ''}{variancePct}% vs Rule
          </span>
        </div>

        <div className="rounded-lg bg-slate-800/60 p-3 border border-slate-700/40">
          <span className="text-xs text-slate-400">95% Confidence Band</span>
          <p className="mt-1 font-display text-xs font-bold text-slate-200"> Rs. {lowerBound.toLocaleString()} - ?{upperBound.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">Dynamic Spot Range</span>
        </div>
      </div>

      <p className="mt-3 rounded-lg bg-black/20 p-2.5 text-xs text-indigo-200/90 border border-indigo-900/50">
        <strong>Broker Guidance:</strong> {explanation}
      </p>
    </div>
  )
}
