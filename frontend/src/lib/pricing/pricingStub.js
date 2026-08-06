export const FLAT_UPLIFT = 0.35 // 35% indicative uplift placeholder for M1

/**
 * Calculates dynamic indicative total based on distance, mode, and chargeable weight/units
 */
export function indicativeTotal(originGw, destGw, mode = 'OCEAN', loadType = 'FCL', weightObj = {}, distance = 1200) {
  let baseRate = 0
  const currency = 'INR'

  const distVal = distance > 0 ? distance : 1200

  if (mode === 'OCEAN') {
    if (weightObj.basis === 'PER_CONTAINER' || loadType === 'FCL') {
      // Ocean FCL rate: distance component + per container base
      const perContainerBase = 95000 + (distVal * 45)
      const count = weightObj.units || 1
      baseRate = perContainerBase * count
    } else {
      // Ocean LCL rate: per Revenue Ton (CBM vs Metric Tonnes)
      const perRtRate = 12500 + (distVal * 8)
      const units = weightObj.units || 1
      baseRate = Math.max(25000, perRtRate * units)
    }
  } else if (mode === 'AIR') {
    // Air Freight: distance component + per chargeable kg
    const perKgRate = 180 + (distVal * 0.05)
    const kg = weightObj.units || weightObj.chargeableVal || 100
    baseRate = Math.max(30000, (perKgRate * kg) + (distVal * 15))
  } else if (mode === 'EXPRESS_AIR') {
    // Express Air: priority handling + per chargeable kg
    const perKgRate = 280 + (distVal * 0.08)
    const kg = weightObj.units || weightObj.chargeableVal || 100
    baseRate = Math.max(45000, (perKgRate * kg) + (distVal * 25))
  } else {
    // Ground & Rail: distance component + weight component
    const perKgRate = 45 + (distVal * 0.02)
    const kg = weightObj.units || weightObj.chargeableVal || 100
    baseRate = Math.max(15000, (perKgRate * kg) + (distVal * 20))
  }

  // BAF (Bunker Adjustment Factor) / FSC (Fuel Surcharge)
  const fuelSurcharge = Math.round(baseRate * 0.08)
  const subtotal = baseRate + fuelSurcharge

  // Apply 35% indicative uplift
  const amount = Math.round(subtotal * (1 + FLAT_UPLIFT))

  return {
    amount,
    baseRate: Math.round(baseRate),
    fuelSurcharge,
    currency,
    is_indicative: true,
    basisLabel: mode === 'OCEAN' && loadType === 'FCL' ? 'Per container — FCL' :
                mode === 'OCEAN' && loadType === 'LCL' ? 'Revenue tons — LCL' :
                'Chargeable weight'
  }
}
