
/**
 * routeScore.js
 * 
 * Computes multi-criteria route ranking scores and synthesizes dynamic,
 * mode-appropriate carrier route options across Ocean, Air, Express Air,
 * and Ground & Rail.
 */

/**
 * Retrieves verified & eligible registered companies for a specific service mode.
 */
function getEligibleCompaniesForMode(mode) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem('portline_companies')
      if (raw) {
        const companies = JSON.parse(raw)
        if (Array.isArray(companies) && companies.length > 0) {
          return companies.filter(c => {
            if (c.status === 'SUSPENDED' || c.is_eligible === false) return false
            const cat = (c.service_category || '').toUpperCase()
            const modes = (c.modes || []).map(m => String(m).toUpperCase())
            if (mode === 'OCEAN') {
              return cat === 'OCEAN' || modes.some(m => m.includes('OCEAN') || m.includes('FCL') || m.includes('LCL') || m.includes('LINER'))
            } else if (mode === 'AIR' || mode === 'EXPRESS_AIR') {
              return cat === 'AIR' || modes.some(m => m.includes('AIR') || m.includes('EXPRESS') || m.includes('COURIER') || m.includes('CHARTER'))
            } else if (mode === 'GROUND_RAIL') {
              return cat === 'GROUND_RAIL' || modes.some(m => m.includes('GROUND') || m.includes('RAIL') || m.includes('ROAD') || m.includes('FTL') || m.includes('LTL') || m.includes('INTERMODAL'))
            }
            return true
          })
        }
      }
    }
  } catch (err) {
    console.warn('Error reading registered companies for mode:', err)
  }
  return []
}

/**
 * Filters route options against Admin Verification & Eligibility status
 */
function filterEligibleRoutes(routes) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem('portline_companies')
      if (raw) {
        const companies = JSON.parse(raw)
        if (Array.isArray(companies) && companies.length > 0) {
          const eligible = routes.filter(r => {
            const rCarrier = (r.carrier || '').toLowerCase().trim()
            const comp = companies.find(c => {
              const cKey = (c.carrier_key || '').toLowerCase().trim()
              const cName = (c.name || '').toLowerCase().trim()
              return (cKey && rCarrier.includes(cKey)) || (cName && rCarrier.includes(cName)) || (cKey && cKey.includes(rCarrier))
            })
            // If the company is tracked and explicitly suspended/unapproved, exclude it
            if (comp) {
              return comp.is_eligible !== false && comp.status !== 'SUSPENDED'
            }
            return true
          })
          if (eligible.length > 0) {
            if (!eligible.some(r => r.recommended)) {
              eligible[0].recommended = true
            }
            return eligible
          }
        }
      }
    }
  } catch (err) {
    console.warn('Error filtering eligible routes:', err)
  }
  return routes
}

/**
 * Computes composite ranking score for a route option (0 to 1)
 */
export function scoreRoute(transitScore, costScore, reliabilityScore, congestionScore, missesDeliveryDate = false) {
  let score = (0.35 * transitScore) + (0.30 * costScore) + (0.20 * reliabilityScore) + (0.15 * congestionScore)
  if (missesDeliveryDate) {
    score = score * 0.4 // heavy penalty
  }
  return Number(score.toFixed(2))
}

/**
 * Builds ranked list of route options for a shipment depending on mode
 */
export function buildRouteOptions(originGw, destGw, mode = 'OCEAN', baseCost = 384500) {
  const ogCode = originGw?.code || 'INNSA'
  const dgCode = destGw?.code || 'AEJEA'
  const ogCity = originGw?.city || 'Origin Port'
  const dgCity = destGw?.city || 'Destination Port'

  const registeredEligible = getEligibleCompaniesForMode(mode)

  if (mode === 'OCEAN') {
    const defaultOceanCarriers = [
      { name: 'Maersk', service: 'MECL Mainline Express', type: 'Direct Express', freq: 'Weekly sailing', rel: 94, factor: 1.0, days: 14, trScore: 0.92, relScore: 0.94 },
      { name: 'CMA CGM', service: 'FAL Asia-Europe Rotation', type: '1 transhipment via Salalah', freq: 'Biweekly departure', rel: 89, factor: 0.91, days: 17, trScore: 0.78, relScore: 0.89 },
      { name: 'Hapag-Lloyd', service: 'IMEX Mediterranean Shuttle', type: 'Direct Linehaul', freq: 'Weekly sailing', rel: 92, factor: 1.04, days: 15, trScore: 0.85, relScore: 0.92 },
      { name: 'MSC', service: 'Dragon Feeder & Mainline Loop', type: 'Direct Feeder', freq: 'Every 4 days', rel: 91, factor: 0.88, days: 18, trScore: 0.72, relScore: 0.91 },
      { name: 'Evergreen', service: 'Ocean Alliance Round-The-World', type: 'Direct Transpacific', freq: 'Weekly sailing', rel: 90, factor: 0.95, days: 16, trScore: 0.81, relScore: 0.90 }
    ]

    const carrierPool = registeredEligible.length >= 3
      ? registeredEligible.map((c, i) => ({
          name: c.name || c.carrier_key,
          service: `${c.carrier_key || c.name} Scheduled Liner Service`,
          type: i === 0 ? 'Direct Express' : i === 1 ? '1 transhipment' : 'Direct Feeder',
          freq: i === 0 ? 'Weekly sailing' : 'Biweekly departure',
          rel: 90 + ((i * 3) % 8),
          factor: i === 0 ? 1.0 : i === 1 ? 0.92 : 1.05,
          days: 14 + (i * 2),
          trScore: 0.90 - (i * 0.08),
          relScore: 0.92
        }))
      : defaultOceanCarriers

    const routes = carrierPool.slice(0, 3).map((item, idx) => ({
      id: `r-ocean-${idx + 1}`,
      carrier: item.name,
      serviceCategory: 'OCEAN',
      serviceName: item.service,
      type: item.type,
      sailingFrequency: item.freq,
      reliabilityPct: item.rel,
      recommended: idx === 0,
      cost: Math.round(baseCost * item.factor),
      transitDays: item.days,
      indicative: true,
      legs: [
        {
          fromCode: ogCode,
          fromCity: ogCity,
          toCode: dgCode,
          toCity: dgCity,
          distanceNm: 1850,
          sailingDays: item.days
        }
      ],
      scores: {
        transit: Number(item.trScore.toFixed(2)),
        cost: Number((1.0 - (item.factor - 0.85) * 0.8).toFixed(2)),
        reliability: Number((item.rel / 100).toFixed(2)),
        congestion: 0.80,
        composite: Number((0.35 * item.trScore + 0.30 * (1.0 - (item.factor - 0.85) * 0.8) + 0.20 * (item.rel / 100) + 0.15 * 0.80).toFixed(2))
      }
    }))

    return filterEligibleRoutes(routes)

  } else if (mode === 'AIR') {
    const defaultAirCarriers = [
      { name: 'Air India Cargo', service: 'AI Scheduled Freighter Service', type: 'Direct Flight', freq: 'Daily flights', rel: 95, factor: 1.0, days: 2, trScore: 0.94, relScore: 0.95 },
      { name: 'Emirates SkyCargo', service: 'EK Direct Belly & Freighter Cargo', type: 'Direct Flight', freq: '3x daily flights', rel: 97, factor: 1.08, days: 1, trScore: 0.98, relScore: 0.97 },
      { name: 'DTDC Express', service: 'DTDC Premium Air Logistics', type: 'Scheduled Air Feeder', freq: 'Daily departures', rel: 92, factor: 0.91, days: 3, trScore: 0.82, relScore: 0.92 },
      { name: 'Delta Cargo Movers', service: 'Delta Dedicated Freight Carrier', type: '1-stop Hub Connection', freq: 'Daily departure', rel: 90, factor: 0.88, days: 3, trScore: 0.80, relScore: 0.90 },
      { name: 'Cocanada Xpress', service: 'Cocanada Coastal & Regional Air Link', type: 'Direct Priority Air', freq: 'Daily flights', rel: 93, factor: 0.94, days: 2, trScore: 0.88, relScore: 0.93 },
      { name: 'Blue Dart Aviation', service: 'Blue Dart Scheduled Domestic & SAARC Air', type: 'Direct Cargo Jet', freq: 'Daily flights', rel: 96, factor: 1.05, days: 1, trScore: 0.96, relScore: 0.96 },
      { name: 'Lufthansa Cargo', service: 'LH European Hub & Intercontinental', type: 'Hub Connection via FRA', freq: 'Daily flights', rel: 95, factor: 1.12, days: 2, trScore: 0.91, relScore: 0.95 },
      { name: 'VRL Air Cargo', service: 'VRL Priority Air Movement', type: 'Direct Charter / Commercial', freq: 'Daily departures', rel: 91, factor: 0.89, days: 3, trScore: 0.81, relScore: 0.91 }
    ]

    const carrierPool = registeredEligible.length >= 3
      ? registeredEligible.map((c, i) => ({
          name: c.name || c.carrier_key,
          service: `${c.carrier_key || c.name} Scheduled Air Cargo`,
          type: i === 0 ? 'Direct Flight' : i === 1 ? 'Priority Cargo Jet' : '1-stop Hub Connection',
          freq: 'Daily departures',
          rel: 92 + ((i * 2) % 6),
          factor: i === 0 ? 1.0 : i === 1 ? 0.93 : 1.07,
          days: 1 + i,
          trScore: 0.95 - (i * 0.06),
          relScore: 0.94
        }))
      : defaultAirCarriers

    const routes = carrierPool.slice(0, 3).map((item, idx) => ({
      id: `r-air-${idx + 1}`,
      carrier: item.name,
      serviceCategory: 'AIR',
      serviceName: item.service,
      type: item.type,
      sailingFrequency: item.freq,
      reliabilityPct: item.rel,
      recommended: idx === 0,
      cost: Math.round(baseCost * item.factor),
      transitDays: item.days,
      indicative: true,
      legs: [
        {
          fromCode: ogCode,
          fromCity: ogCity,
          toCode: dgCode,
          toCity: dgCity,
          distanceKm: 2400,
          flightHours: item.days * 8
        }
      ],
      scores: {
        transit: Number(item.trScore.toFixed(2)),
        cost: Number((1.0 - (item.factor - 0.85) * 0.8).toFixed(2)),
        reliability: Number((item.rel / 100).toFixed(2)),
        congestion: 0.85,
        composite: Number((0.35 * item.trScore + 0.30 * (1.0 - (item.factor - 0.85) * 0.8) + 0.20 * (item.rel / 100) + 0.15 * 0.85).toFixed(2))
      }
    }))

    return filterEligibleRoutes(routes)

  } else if (mode === 'EXPRESS_AIR') {
    const defaultExpressCarriers = [
      { name: 'DTDC Express', service: 'DTDC Next-Flight-Out (NFO) Express', type: 'Express Flight', freq: 'Next Available Flight', rel: 98, factor: 1.0, days: 1, trScore: 0.99, relScore: 0.98 },
      { name: 'Blue Dart Aviation', service: 'Apex Priority Overnight Air Charter', type: 'Dedicated Air Cargo Jet', freq: 'Same-day / Overnight', rel: 97, factor: 1.06, days: 1, trScore: 0.98, relScore: 0.97 },
      { name: 'Delta Cargo Movers', service: 'Delta Rapid Express Air Transit', type: 'Direct Air Courier', freq: 'Daily express departure', rel: 93, factor: 0.92, days: 2, trScore: 0.90, relScore: 0.93 },
      { name: 'Emirates SkyCargo', service: 'EK AOG & Urgent Pharma Express', type: 'Priority International Express', freq: '3x daily flights', rel: 98, factor: 1.15, days: 1, trScore: 0.99, relScore: 0.98 },
      { name: 'Air India Cargo', service: 'AI Priority Express Space Guarantee', type: 'Direct National Carrier', freq: 'Daily flights', rel: 94, factor: 0.95, days: 2, trScore: 0.92, relScore: 0.94 }
    ]

    const carrierPool = registeredEligible.length >= 3
      ? registeredEligible.map((c, i) => ({
          name: c.name || c.carrier_key,
          service: `${c.carrier_key || c.name} Rapid Express Air`,
          type: i === 0 ? 'Express Flight (NFO)' : 'Dedicated Air Courier',
          freq: 'Priority dispatch',
          rel: 94 + (i % 5),
          factor: i === 0 ? 1.0 : i === 1 ? 0.94 : 1.09,
          days: 1,
          trScore: 0.98 - (i * 0.04),
          relScore: 0.96
        }))
      : defaultExpressCarriers

    const routes = carrierPool.slice(0, 3).map((item, idx) => ({
      id: `r-express-${idx + 1}`,
      carrier: item.name,
      serviceCategory: 'AIR',
      serviceName: item.service,
      type: item.type,
      sailingFrequency: item.freq,
      reliabilityPct: item.rel,
      recommended: idx === 0,
      cost: Math.round(baseCost * item.factor),
      transitDays: item.days,
      indicative: true,
      legs: [
        {
          fromCode: ogCode,
          fromCity: ogCity,
          toCode: dgCode,
          toCity: dgCity,
          distanceKm: 2400,
          flightHours: 5.5
        }
      ],
      scores: {
        transit: Number(item.trScore.toFixed(2)),
        cost: Number((1.0 - (item.factor - 0.85) * 0.8).toFixed(2)),
        reliability: Number((item.rel / 100).toFixed(2)),
        congestion: 0.90,
        composite: Number((0.35 * item.trScore + 0.30 * (1.0 - (item.factor - 0.85) * 0.8) + 0.20 * (item.rel / 100) + 0.15 * 0.90).toFixed(2))
      }
    }))

    return filterEligibleRoutes(routes)

  } else {
    // GROUND_RAIL
    const defaultGroundCarriers = [
      { name: 'CONCOR', service: 'Western Dedicated Freight Corridor (DFC) Rail', type: 'Direct Rail Intermodal', freq: 'Daily scheduled rail rake', rel: 95, factor: 1.0, days: 3, trScore: 0.92, relScore: 0.95 },
      { name: 'VRL Logistics', service: 'VRL National Express Road Corridor (FTL)', type: 'Direct Highway Linehaul', freq: 'Daily departures', rel: 93, factor: 0.92, days: 4, trScore: 0.85, relScore: 0.93 },
      { name: 'TCI Freight', service: 'TCI Multimodal Rail-Road Link', type: 'Intermodal Truck + Rail', freq: 'Daily dispatch', rel: 91, factor: 0.87, days: 5, trScore: 0.78, relScore: 0.91 },
      { name: 'GATI-KWE', service: 'GATI Surface Express Road Corridor', type: 'Direct Road FTL', freq: 'Daily departures', rel: 92, factor: 0.96, days: 3, trScore: 0.88, relScore: 0.92 },
      { name: 'Allcargo Logistics', service: 'Allcargo CFS to ICD Rail Feeder', type: 'Rail Intermodal Shuttle', freq: 'Every 2 days', rel: 90, factor: 0.89, days: 4, trScore: 0.81, relScore: 0.90 },
      { name: 'Delhivery Freight', service: 'Delhivery Automated Hub & Spoke Road Network', type: 'Smart Road Freight (FTL/LTL)', freq: 'Continuous dispatch', rel: 94, factor: 0.98, days: 3, trScore: 0.89, relScore: 0.94 }
    ]

    const carrierPool = registeredEligible.length >= 3
      ? registeredEligible.map((c, i) => ({
          name: c.name || c.carrier_key,
          service: `${c.carrier_key || c.name} Road/Rail Corridor`,
          type: i === 0 ? 'Direct Rail Intermodal' : i === 1 ? 'Direct Highway Linehaul' : 'Multimodal Link',
          freq: 'Daily departure',
          rel: 91 + (i % 6),
          factor: i === 0 ? 1.0 : i === 1 ? 0.91 : 1.03,
          days: 3 + i,
          trScore: 0.90 - (i * 0.07),
          relScore: 0.92
        }))
      : defaultGroundCarriers

    const routes = carrierPool.slice(0, 3).map((item, idx) => ({
      id: `r-ground-${idx + 1}`,
      carrier: item.name,
      serviceCategory: 'GROUND_RAIL',
      serviceName: item.service,
      type: item.type,
      sailingFrequency: item.freq,
      reliabilityPct: item.rel,
      recommended: idx === 0,
      cost: Math.round(baseCost * item.factor),
      transitDays: item.days,
      indicative: true,
      legs: [
        {
          fromCode: ogCode,
          fromCity: ogCity,
          toCode: dgCode,
          toCity: dgCity,
          distanceKm: 1650,
          roadDays: item.days
        }
      ],
      scores: {
        transit: Number(item.trScore.toFixed(2)),
        cost: Number((1.0 - (item.factor - 0.85) * 0.8).toFixed(2)),
        reliability: Number((item.rel / 100).toFixed(2)),
        congestion: 0.82,
        composite: Number((0.35 * item.trScore + 0.30 * (1.0 - (item.factor - 0.85) * 0.8) + 0.20 * (item.rel / 100) + 0.15 * 0.82).toFixed(2))
      }
    }))

    return filterEligibleRoutes(routes)
  }
}
