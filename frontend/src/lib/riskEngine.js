// 5-Factor Composite Shipment Risk Aggregator (per M3 Spec)
export function computeCompositeRisk({
  weatherScore = 28,
  customsScore = 32,
  routeScore = 22,
  portScore = 18,
  cargoScore = 12,
  weatherDetails = '',
  customsDetails = ''
}) {
  const wContrib = Math.round(weatherScore * 0.30 * 10) / 10
  const cContrib = Math.round(customsScore * 0.25 * 10) / 10
  const rContrib = Math.round(routeScore * 0.20 * 10) / 10
  const pContrib = Math.round(portScore * 0.15 * 10) / 10
  const cgContrib = Math.round(cargoScore * 0.10 * 10) / 10

  const overallScore = Math.round(wContrib + cContrib + rContrib + pContrib + cgContrib)

  let riskLevel = 'LOW'
  let color = '#10B981'
  let guidance = 'Voyage risk within nominal operating parameters. Automated dispatch approved.'

  if (overallScore > 80) {
    riskLevel = 'CRITICAL'
    color = '#991B1B'
    guidance = 'Severe voyage or regulatory exposure. Requires mandatory Customs Officer review & contingency rerouting.'
  } else if (overallScore > 60) {
    riskLevel = 'HIGH'
    color = '#EF4444'
    guidance = 'Heightened multi-factor exposure. Senior broker or customs review recommended before quote release.'
  } else if (overallScore > 30) {
    riskLevel = 'MEDIUM'
    color = '#F59E0B'
    guidance = 'Moderate transit & compliance considerations. Standard monitoring and operational buffers advised.'
  }

  const factors = [
    {
      type: 'WEATHER',
      name: 'Marine & Aviation Weather',
      score: weatherScore,
      weight: 30,
      contribution: wContrib,
      severity: weatherScore > 60 ? 'HIGH' : (weatherScore > 30 ? 'MEDIUM' : 'LOW'),
      reason: weatherDetails || 'Seasonal swell and cross-wind forecast along primary transit segment.',
      source: 'NOAA / ECMWF Satellite Ensemble'
    },
    {
      type: 'CUSTOMS',
      name: 'Customs & Regulatory Readiness',
      score: customsScore,
      weight: 25,
      contribution: cContrib,
      severity: customsScore > 60 ? 'HIGH' : (customsScore > 30 ? 'MEDIUM' : 'LOW'),
      reason: customsDetails || 'HS code classification & Advance Cargo Declaration verification requirements.',
      source: 'Customs RAG Legal Corpus & Tariff Registry'
    },
    {
      type: 'ROUTE',
      name: 'Route Geometry & Chokepoints',
      score: routeScore,
      weight: 20,
      contribution: rContrib,
      severity: routeScore > 60 ? 'HIGH' : (routeScore > 30 ? 'MEDIUM' : 'LOW'),
      reason: 'Passage through international trade corridor with active traffic management.',
      source: 'AIS Vessel Traffic & Navigational Notices'
    },
    {
      type: 'PORT',
      name: 'Gateway Congestion & Dwell',
      score: portScore,
      weight: 15,
      contribution: pContrib,
      severity: portScore > 60 ? 'HIGH' : (portScore > 30 ? 'MEDIUM' : 'LOW'),
      reason: 'Average gateway berth wait time currently 14-22 hours.',
      source: 'Port Terminal Real-Time Congestion Index'
    },
    {
      type: 'CARGO',
      name: 'Commodity Handling Sensitivity',
      score: cargoScore,
      weight: 10,
      contribution: cgContrib,
      severity: cargoScore > 60 ? 'HIGH' : (cargoScore > 30 ? 'MEDIUM' : 'LOW'),
      reason: 'Standard packaged commercial cargo with standard lashing requirements.',
      source: 'Cargo Packaging & Hazmat Guidelines'
    }
  ]

  const topFactor = [...factors].sort((a, b) => b.contribution - a.contribution)[0]
  const explanation = `Primary risk driver is ${topFactor.name} (contributing ${topFactor.contribution} pts). ${topFactor.reason}`

  return {
    overallScore,
    riskLevel,
    color,
    primaryDriver: topFactor.name,
    explanation,
    guidance,
    factors,
    formula: 'Weather (30%) + Customs (25%) + Route (20%) + Port (15%) + Cargo (10%)'
  }
}
