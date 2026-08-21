// Calibrated Freight Tariff Cards (in INR)
const OCEAN_FCL_LANE_RATES = {
  // Chennai (INMAA) -> Singapore (SGSIN)
  'INMAA-SGSIN': { '20GP': 35000, '40GP': 48000, '40HC': 50000, '45HC': 58000, 'REEFER': 82000 },
  // Nhava Sheva (INNSA) -> Singapore (SGSIN)
  'INNSA-SGSIN': { '20GP': 38000, '40GP': 51000, '40HC': 52000, '45HC': 60000, 'REEFER': 85000 },
  // Nhava Sheva (INNSA) -> Jebel Ali (AEJEA)
  'INNSA-AEJEA': { '20GP': 42000, '40GP': 56000, '40HC': 60000, '45HC': 70000, 'REEFER': 95000 },
  // Mundra (INMUN) -> Jebel Ali (AEJEA)
  'INMUN-AEJEA': { '20GP': 40000, '40GP': 54000, '40HC': 58000, '45HC': 68000, 'REEFER': 92000 },
  // Chennai (INMAA) -> Port Klang (MYPKG)
  'INMAA-MYPKG': { '20GP': 32000, '40GP': 44000, '40HC': 46000, '45HC': 54000, 'REEFER': 78000 },
  // Nhava Sheva (INNSA) -> Rotterdam (NLRTM)
  'INNSA-NLRTM': { '20GP': 95000, '40GP': 135000, '40HC': 140000, '45HC': 160000, 'REEFER': 210000 },
}

/**
 * Calculates deterministic 5-layer quotation build-up:
 * Base Freight -> Surcharges (BAF + THC + Doc) -> Total Cost -> Margin -> Final Sell Price
 */
export function indicativeTotal(originGw, destGw, mode = 'OCEAN', loadType = 'FCL', weightObj = {}, distance = 1200) {
  const ogCode = originGw?.code || 'INMAA'
  const dgCode = destGw?.code || 'SGSIN'
  const laneKey = `${ogCode}-${dgCode}`
  const reverseLaneKey = `${dgCode}-${ogCode}`
  const distVal = distance > 0 ? distance : 1200
  const currency = 'INR'

  let baseRate = 0
  let bafPct = 0.10 // 10% Bunker Adjustment Factor
  let bafAmount = 0
  let thcAmount = 0
  let docFee = 3000 // ?3,000 documentation fee
  let marginPct = 0.15 // 15% standard margin
  let basisLabel = 'Per container ? FCL'

  if (mode === 'OCEAN') {
    if (weightObj.isContainer || (weightObj.basis === 'PER_CONTAINER' && loadType === 'FCL')) {
      const containerType = weightObj.containerType || '40HC'
      const count = weightObj.units || 1

      // 1. Look up exact contract tariff or compute calibrated rate
      let ratePerContainer = 50000
      const matchedLane = OCEAN_FCL_LANE_RATES[laneKey] || OCEAN_FCL_LANE_RATES[reverseLaneKey]
      if (matchedLane) {
        ratePerContainer = matchedLane[containerType] || matchedLane['40HC'] || 50000
      } else {
        const typeFactor = containerType === '20GP' ? 0.70 : containerType === '45HC' ? 1.15 : containerType === 'REEFER' ? 1.6 : 1.0
        ratePerContainer = Math.round((24000 + (distVal * 12)) * typeFactor)
      }

      baseRate = ratePerContainer * count
      bafAmount = Math.round(baseRate * bafPct)
      
      // Origin THC: ?8,000 per container
      const thcPerContainer = 8000
      thcAmount = thcPerContainer * count

      basisLabel = `${count} ? ${containerType} ? FCL`
    } else {
      // Ocean LCL: per Revenue Ton
      const perRtRate = Math.round(3200 + (distVal * 1.2))
      const units = weightObj.chargeableVal || weightObj.units || 1
      baseRate = Math.max(12000, perRtRate * units)
      bafAmount = Math.round(baseRate * 0.10)
      thcAmount = Math.round(1800 * units)
      docFee = 3000
      basisLabel = 'Revenue tons ? LCL'
    }
  } else if (mode === 'AIR') {
    const perKgRate = Math.round(110 + (distVal * 0.025))
    const kg = weightObj.chargeableVal || weightObj.units || 10
    baseRate = Math.max(8000, perKgRate * kg)
    bafAmount = Math.round(baseRate * 0.12)
    thcAmount = Math.round(12 * kg)
    docFee = 2500
    basisLabel = 'Chargeable weight ? Air'
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
