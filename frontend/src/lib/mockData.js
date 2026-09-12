export const demoUser = {
  name: 'Ravi Sharma',
  role: 'customer',
  company: 'Sharma Textiles',
  email: 'ravi@sharmatextiles.in',
  phone: '+91 98765 43210',
  since: 'January 2024',
}

export const globalShipperUser = {
  name: 'Hello Shipper',
  role: 'customer',
  company: 'Global Shippers Corp',
  email: 'hello1@gmail.com',
  phone: '+91 99887 00001',
  since: 'March 2025',
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

// Dedicated Isolated Demo Dashboard Users
export const customerDemoUser = {
  name: 'Demo Shipper',
  role: 'customer',
  company: 'Global Trade Corp (Demo)',
  email: 'customer.demo@portline.in',
  phone: '+91 98765 00000',
  since: 'January 2025',
}

export const adminDemoUser = {
  name: 'Demo Admin',
  role: 'admin',
  company: 'PORTLINE Operations (Demo)',
  email: 'admin.demo@portline.in',
  phone: '+91 99000 11111',
  since: 'March 2023',
}

export const agentDemoUser = {
  name: 'Demo Agent Lead',
  role: 'agent',
  company: 'PORTLINE Logistics (Demo)',
  email: 'agent.demo@portline.in',
  phone: '+91 99000 22222',
  since: 'June 2024',
}

export const customsDemoUser = {
  name: 'Demo Customs Officer',
  role: 'customs_officer',
  company: 'CBIC Indian Customs (Demo)',
  email: 'customs.demo@portline.in',
  phone: '+91 98111 33333',
  since: 'January 2023',
}

export const agentOperatorDemoUser = {
  name: 'Demo AI Agent Ops',
  role: 'agent_operator',
  company: 'PORTLINE AI Ops & Telemetry (Demo)',
  email: 'agentop.demo@portline.in',
  phone: '+91 98222 44444',
  since: 'May 2024',
}

export const managerDemoUser = {
  name: 'Demo Analytics Manager',
  role: 'manager',
  company: 'PORTLINE Commercial Analytics (Demo)',
  email: 'manager.demo@portline.in',
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

export const DEMO_EMAIL_LIST = []
export const DEMO_QUOTES = []

// ---------------------------------------------------------------------------
// CARRIER → DEDICATED AGENT DESK CONFIGURATION
// ---------------------------------------------------------------------------
export {
  DEFAULT_CARRIER_THEME,
  DEFAULT_THEME,
  CARRIER_DESK_CONFIG,
  CARRIER_AGENT_MAP,
  extractCarrierName,
  getRegisteredCompanies,
  buildDynamicCarrierDesk,
  getAgentDesk,
  isCarrierMatch,
  resolveAssignedAgent
} from './carrierConfig.js'
