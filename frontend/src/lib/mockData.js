export const demoUser = {
  name: 'Ravi Sharma',
  role: 'customer',
  company: 'Sharma Textiles',
  email: 'ravi@sharmatextiles.in',
  phone: '+91 98765 43210',
  since: 'January 2024',
}

export const adminUser = {
  name: 'Priya Admin',
  role: 'admin',
  company: 'PORTLINE Operations',
  email: 'admin@portline.in',
  phone: '+91 99000 11111',
  since: 'March 2023',
}

export const agentUser = {
  name: 'Arjun Agent',
  role: 'agent',
  company: 'PORTLINE Logistics',
  email: 'agent@portline.in',
  phone: '+91 99000 22222',
  since: 'June 2024',
}

export const customsOfficerUser = {
  name: 'Inspector Rajesh Kumar',
  role: 'customs_officer',
  company: 'Indian Customs / CBIC Desk',
  email: 'customs@portline.in',
  phone: '+91 98111 33333',
  since: 'January 2023',
}

export const agentOperatorUser = {
  name: 'Suresh Varma',
  role: 'agent_operator',
  company: 'PORTLINE AI Ops & Telemetry',
  email: 'agentop@portline.in',
  phone: '+91 98222 44444',
  since: 'May 2024',
}

export const managerUser = {
  name: 'Ananya Roy',
  role: 'manager',
  company: 'PORTLINE Revenue & Commercial',
  email: 'manager@portline.in',
  phone: '+91 98333 55555',
  since: 'October 2022',
}

export const seedShipments = []

export const RATES = {
  ocean: { label: 'Ocean Freight', base: 14500, perKg: 68, transit: '18–26 days' },
  air: { label: 'Air Freight', base: 21000, perKg: 260, transit: '3–5 days' },
  ground: { label: 'Ground & Rail', base: 9500, perKg: 95, transit: '5–9 days' },
  express: { label: 'Express Air', base: 27500, perKg: 420, transit: '1–2 days' },
}

export const seedQuotes = []

export const routeAnalytics = {
  kpis: {
    routesAnalysed: '12,450',
    laneCoveragePct: '98.5%',
    transitMaeDays: '1.7 d',
    avgOptionsPerLane: '3.2'
  },
  lanePerformance: [
    { lane: 'INNSA→AEJEA', sub: 'Asia–Middle East', transit: '6–10 d', onTimePct: 96, vol: 412, status: 'ok' },
    { lane: 'INNSA→NLRTM', sub: 'Asia–Europe', transit: '24–28 d', onTimePct: 93, vol: 318, status: 'ok' },
    { lane: 'INNSA→SGSIN', sub: 'Intra-Asia', transit: '11–16 d', onTimePct: 98, vol: 276, status: 'ok' },
    { lane: 'INNSA→DEHAM', sub: 'Asia–Europe', transit: '26–31 d', onTimePct: 91, vol: 184, status: 'warn' },
    { lane: 'BOM→DXB', sub: 'Air · Middle East', transit: '5–7 d', onTimePct: 97, vol: 142, status: 'ok' },
    { lane: 'INNSA→PECLL', sub: 'Asia–South America', transit: '—', onTimePct: null, vol: 6, status: 'no_data' }
  ]
}
