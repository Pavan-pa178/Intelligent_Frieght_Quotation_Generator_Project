import { FALLBACK_SEED } from '../masterSeedData'

// Helpers to get master collections (from localStorage / cache or FALLBACK_SEED)
export function getMasterCollection(colKey) {
  try {
    const raw = localStorage.getItem(`portline_master_${colKey}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {}
  return FALLBACK_SEED[colKey] || []
}

/**
 * Deterministic Master Data-Driven 5-Layer Quotation Pricing Engine:
 * 1. Queries Master Rate Cards for lane base rate & container tariffs
 * 2. Queries Surcharge Rules (BAF %, Origin THC, Documentation fee)
 * 3. Computes Total Landed Buy Cost
 * 4. Queries Margin Policies (floor / target margin rules)
 * 5. Computes Final Commercial Sell Price
 */
export function indicativeTotal(originGw, destGw, mode = 'OCEAN', loadType = 'FCL', weightObj = {}, distance = 1200) {
  const ogCode = originGw?.code || 'INMAA'
  const dgCode = destGw?.code || 'SGSIN'
  const laneKey = `${ogCode}-${dgCode}-${mode}`
  const reverseLaneKey = `${dgCode}-${ogCode}-${mode}`
  const shortLaneKey = `${ogCode}-${dgCode}`
  const distVal = distance > 0 ? distance : 1200
  const currency = 'INR'

  const rateCards = getMasterCollection('rate_cards')
  const marginPolicies = getMasterCollection('margin_policies')

  // Find matching margin policy from master data
  const modePolicyKey = mode === 'OCEAN' ? (loadType === 'FCL' ? 'OCEAN_FCL' : 'OCEAN_LCL') : mode
  const matchedPolicy = marginPolicies.find(p => p.active && (p.applies_to === modePolicyKey || p.code === `MP-${modePolicyKey}`)) ||
                        marginPolicies.find(p => p.active && (p.applies_to === 'ALL' || p.code === 'MP-GLOBAL'))
  const marginPct = (matchedPolicy?.target_margin_pct ? matchedPolicy.target_margin_pct / 100 : 0.15)

  let baseRate = 0
  let bafPct = 0.10
  let bafAmount = 0
  let thcAmount = 0
  let docFee = 3000
  let basisLabel = 'Per container - FCL'

  if (mode === 'OCEAN') {
    if (weightObj.isContainer || (weightObj.basis === 'PER_CONTAINER' && loadType === 'FCL')) {
      const containerType = weightObj.containerType || '40HC'
      const count = weightObj.units || 1

      // 1. Search in Master Rate Cards
      let matchedRateLine = null
      for (const card of rateCards) {
        if (!card.active && card.active !== undefined) continue
        if (Array.isArray(card.rates)) {
          const found = card.rates.find(r => 
            (r.lane_code === laneKey || r.lane_code === reverseLaneKey || r.lane_code === shortLaneKey || r.lane_code === `${shortLaneKey}-OCEAN`) &&
            (r.container === containerType || (!r.container && containerType === '40HC'))
          )
          if (found) {
            matchedRateLine = found
            break
          }
        }
      }

      let ratePerContainer = 50000
      let thcPerContainer = 8000

      if (matchedRateLine) {
        ratePerContainer = matchedRateLine.base_rate_inr || (matchedRateLine.base_rate_usd ? matchedRateLine.base_rate_usd * 83.33 : 50000)
        thcPerContainer = matchedRateLine.thc_origin_inr || (matchedRateLine.thc_origin_usd ? matchedRateLine.thc_origin_usd * 83.33 : 8000)
        if (matchedRateLine.baf_pct) bafPct = matchedRateLine.baf_pct / 100
        if (matchedRateLine.doc_fee_inr) docFee = matchedRateLine.doc_fee_inr
      } else {
        const typeFactor = containerType === '20GP' ? 0.70 : containerType === '45HC' ? 1.15 : containerType === 'REEFER' ? 1.6 : 1.0
        ratePerContainer = Math.round((24000 + (distVal * 12)) * typeFactor)
      }

      baseRate = Math.round(ratePerContainer * count)
      bafAmount = Math.round(baseRate * bafPct)
      thcAmount = Math.round(thcPerContainer * count)
      basisLabel = `${count} x ${containerType} (FCL)`
    } else {
      // Ocean LCL
      const perRtRate = Math.round(3200 + (distVal * 1.2))
      const units = weightObj.chargeableVal || weightObj.units || 1
      baseRate = Math.max(12000, perRtRate * units)
      bafAmount = Math.round(baseRate * 0.10)
      thcAmount = Math.round(1800 * units)
      docFee = 3000
      basisLabel = 'Revenue tons - LCL'
    }
  } else if (mode === 'AIR') {
    const perKgRate = Math.round(110 + (distVal * 0.025))
    const kg = weightObj.chargeableVal || weightObj.units || 10
    baseRate = Math.max(8000, perKgRate * kg)
    bafAmount = Math.round(baseRate * 0.12)
    thcAmount = Math.round(12 * kg)
    docFee = 2500
    basisLabel = 'Chargeable weight - Air'
  } else if (mode === 'EXPRESS_AIR') {
    const perKgRate = Math.round(180 + (distVal * 0.035))
    const kg = weightObj.chargeableVal || weightObj.units || 10
    baseRate = Math.max(12000, perKgRate * kg)
    bafAmount = Math.round(baseRate * 0.15)
    thcAmount = Math.round(15 * kg)
    docFee = 2500
    basisLabel = 'Express Air Courier'
  } else {
    // Ground & Rail
    const perKgRate = Math.round(18 + (distVal * 0.008))
    const kg = weightObj.chargeableVal || weightObj.units || 10
    baseRate = Math.max(5000, perKgRate * kg)
    bafAmount = Math.round(baseRate * 0.08)
    thcAmount = 1500
    docFee = 1500
    basisLabel = 'Ground / Rail'
  }

  const totalCost = baseRate + bafAmount + thcAmount + docFee
  const marginAmount = Math.round(totalCost * marginPct)
  const amount = totalCost + marginAmount

  const breakdown = [
    { label: 'Base Freight', val: baseRate },
    { label: `BAF (${Math.round(bafPct * 100)}%)`, val: bafAmount },
    { label: 'Origin THC', val: thcAmount },
    { label: 'Documentation Fee', val: docFee },
    { label: 'Total Cost', val: totalCost, isSubtotal: true },
    { label: `Margin (${Math.round(marginPct * 100)}%)`, val: marginAmount },
    { label: 'Final Sell Price', val: amount, isTotal: true }
  ]

  return {
    amount,
    baseRate,
    bafAmount,
    thcAmount,
    docFee,
    totalCost,
    marginRate: marginPct,
    marginAmount,
    currency,
    is_indicative: true,
    basisLabel,
    breakdown
  }
}
