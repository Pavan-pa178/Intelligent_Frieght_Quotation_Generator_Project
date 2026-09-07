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

// ---------------------------------------------------------------------------
// DEMO QUOTES — pre-seeded quotes for demo accounts (ravi@sharmatextiles.in,
// demo@portline.in). These are hardcoded and NEVER wiped by Admin "Clear All".
// They will not appear in production customer accounts.
// ---------------------------------------------------------------------------
export const DEMO_EMAIL_LIST = ['customer.demo@portline.in', 'shipper.demo@portline.in', 'ravi@sharmatextiles.in', 'demo@portline.in']

export const DEMO_QUOTES = [
  {
    id: 'QT-DEMO-00101',
    _isDemo: true,
    user_email: 'customer.demo@portline.in',
    customer: 'Sharma Textiles',
    city: 'Nhava Sheva',
    laneCode: 'INNSA → AEJEA',
    laneName: 'Nhava Sheva → Jebel Ali',
    region: 'India–UAE',
    mode: 'Ocean FCL',
    modeKey: 'ocean',
    basis: '1 × 40HC',
    transit: '6–9 days',
    indicativeTotal: 148500,
    status: 'Approved',
    pipeline_status: 'CUSTOMS_APPROVED',
    created: '2026-08-01T08:30:00.000Z',
    created_at: '2026-08-01T08:30:00.000Z',
    agent_review: { status: 'approved', agent_name: 'Arjun Agent', reviewed_at: '2026-08-02T10:00:00.000Z' },
    customs_review: { status: 'approved', officer_name: 'Inspector Rajesh Kumar', reviewed_at: '2026-08-03T09:00:00.000Z' },
    details: {
      originGw: { code: 'INNSA', name: 'Jawaharlal Nehru Port', city: 'Nhava Sheva', country: 'India', countryCode: 'IN' },
      destGw: { code: 'AEJEA', name: 'Jebel Ali Port', city: 'Dubai', country: 'UAE', countryCode: 'AE' },
      commodity: 'Cotton Fabric Rolls',
      hsCode: '520811',
      grossWeightKg: 18000,
    }
  },
  {
    id: 'QT-DEMO-00102',
    _isDemo: true,
    user_email: 'ravi@sharmatextiles.in',
    customer: 'Sharma Textiles',
    city: 'Mumbai',
    laneCode: 'BOM → FRA',
    laneName: 'Mumbai → Frankfurt',
    region: 'India–Germany',
    mode: 'Air Freight',
    modeKey: 'air',
    basis: '380 kg / 2.14 CBM',
    transit: '3–5 days',
    indicativeTotal: 98750,
    status: 'Draft',
    pipeline_status: 'DRAFT',
    created: '2026-08-15T11:00:00.000Z',
    created_at: '2026-08-15T11:00:00.000Z',
    details: {
      originGw: { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', countryCode: 'IN' },
      destGw: { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', countryCode: 'DE' },
      commodity: 'Textile Samples',
      hsCode: '621000',
      grossWeightKg: 380,
    }
  },
  {
    id: 'QT-DEMO-00103',
    _isDemo: true,
    user_email: 'ravi@sharmatextiles.in',
    customer: 'Sharma Textiles',
    city: 'Nhava Sheva',
    laneCode: 'INNSA → SGSIN',
    laneName: 'Nhava Sheva → Singapore',
    region: 'India–Singapore',
    mode: 'Ocean FCL',
    modeKey: 'ocean',
    basis: '2 × 20GP',
    transit: '11–15 days',
    indicativeTotal: 186000,
    status: 'Accepted',
    pipeline_status: 'ACCEPTED',
    customer_decision: { status: 'ACCEPTED', decided_at: '2026-08-20T07:30:00.000Z' },
    created: '2026-08-18T09:00:00.000Z',
    created_at: '2026-08-18T09:00:00.000Z',
    details: {
      originGw: { code: 'INNSA', name: 'Jawaharlal Nehru Port', city: 'Nhava Sheva', country: 'India', countryCode: 'IN' },
      destGw: { code: 'SGSIN', name: 'Port of Singapore', city: 'Singapore', country: 'Singapore', countryCode: 'SG' },
      commodity: 'Woven Fabric',
      hsCode: '520811',
      grossWeightKg: 24000,
    }
  },
]

// ---------------------------------------------------------------------------
// CARRIER → DEDICATED AGENT DESK CONFIGURATION
// Detailed desk styling, brand identities, badges, and agent assignments.
// ---------------------------------------------------------------------------
export const CARRIER_DESK_CONFIG = {
  'CMA CGM': {
    carrierKey: 'CMA CGM',
    carrierName: 'CMA CGM',
    deskName: 'CMA CGM Commercial Operations Desk',
    agentName: 'Deepa Nair',
    email: 'agent.cmacgm@portline.in',
    short: 'CMA CGM Desk',
    theme: {
      primaryColor: '#0A2540',
      accentColor: '#E11D48',
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-700',
      badgeBorder: 'border-rose-200',
      bannerGradient: 'from-[#07162C] via-[#0E2A54] to-[#1C3D6E]',
      tagline: 'Direct Mediterranean, Red Sea & North Africa Container Allocation',
      contractTier: 'Tier 1 Strategic Ocean Carrier',
      slaHours: '2h Fast-Track Review'
    }
  },
  'MSC': {
    carrierKey: 'MSC',
    carrierName: 'MSC (Mediterranean Shipping Co)',
    deskName: 'MSC Mediterranean Shipping Desk',
    agentName: 'Vikram Singh',
    email: 'agent.msc@portline.in',
    short: 'MSC Desk',
    theme: {
      primaryColor: '#1E293B',
      accentColor: '#D97706',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-700',
      badgeBorder: 'border-amber-200',
      bannerGradient: 'from-[#111827] via-[#1E293B] to-[#334155]',
      tagline: 'Global Container Network, Feeder Transit & Coastal Rotation',
      contractTier: 'Global Alliance Direct Contract',
      slaHours: '2h Guaranteed SLA'
    }
  },
  'Maersk': {
    carrierKey: 'Maersk',
    carrierName: 'Maersk Line',
    deskName: 'Maersk Line Partner Operations Desk',
    agentName: 'Kiran Reddy',
    email: 'agent.maersk@portline.in',
    short: 'Maersk Desk',
    theme: {
      primaryColor: '#0369A1',
      accentColor: '#0284C7',
      badgeBg: 'bg-sky-50',
      badgeText: 'text-sky-700',
      badgeBorder: 'border-sky-200',
      bannerGradient: 'from-[#08203D] via-[#0C3562] to-[#15508D]',
      tagline: 'AP Moller Direct MECL Sailings & Cold-Chain Logistics Hub',
      contractTier: 'Premier Partner EDI Verified',
      slaHours: '1.5h Priority Review'
    }
  },
  'Evergreen': {
    carrierKey: 'Evergreen',
    carrierName: 'Evergreen Marine',
    deskName: 'Evergreen Marine Operations Desk',
    agentName: 'Amrita Pillai',
    email: 'agent.evergreen@portline.in',
    short: 'Evergreen Desk',
    theme: {
      primaryColor: '#065F46',
      accentColor: '#059669',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      badgeBorder: 'border-emerald-200',
      bannerGradient: 'from-[#04281E] via-[#094736] to-[#13664F]',
      tagline: 'Transpacific & Southeast Asia Dedicated Berth Allocation',
      contractTier: 'Ocean Alliance Verified Partner',
      slaHours: '2h Guaranteed SLA'
    }
  },
  'Hapag-Lloyd': {
    carrierKey: 'Hapag-Lloyd',
    carrierName: 'Hapag-Lloyd',
    deskName: 'Hapag-Lloyd IMEX Operations Desk',
    agentName: 'Sunil Verma',
    email: 'agent.hapag@portline.in',
    short: 'Hapag Desk',
    theme: {
      primaryColor: '#9A3412',
      accentColor: '#EA580C',
      badgeBg: 'bg-orange-50',
      badgeText: 'text-orange-700',
      badgeBorder: 'border-orange-200',
      bannerGradient: 'from-[#2A1406] via-[#4A240B] to-[#713710]',
      tagline: 'IMEX & Trans-Atlantic Quality Service Guarantee Desk',
      contractTier: 'THE Alliance Verified Contract',
      slaHours: '2h Standard SLA'
    }
  },
  'COSCO': {
    carrierKey: 'COSCO',
    carrierName: 'COSCO Shipping Lines',
    deskName: 'COSCO Shipping Operations Desk',
    agentName: 'Ravi Shankar',
    email: 'agent.cosco@portline.in',
    short: 'COSCO Desk',
    theme: {
      primaryColor: '#1D4ED8',
      accentColor: '#2563EB',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-700',
      badgeBorder: 'border-blue-200',
      bannerGradient: 'from-[#091D38] via-[#10325E] to-[#1A4E8C]',
      tagline: 'Maritime Silk Road & Far East Intermodal Coordination',
      contractTier: 'Ocean Alliance Direct Contract',
      slaHours: '2h Guaranteed SLA'
    }
  },
  'ONE': {
    carrierKey: 'ONE',
    carrierName: 'Ocean Network Express (ONE)',
    deskName: 'Ocean Network Express (ONE) Desk',
    agentName: 'Pooja Menon',
    email: 'agent.one@portline.in',
    short: 'ONE Desk',
    theme: {
      primaryColor: '#BE185D',
      accentColor: '#DB2777',
      badgeBg: 'bg-pink-50',
      badgeText: 'text-pink-700',
      badgeBorder: 'border-pink-200',
      bannerGradient: 'from-[#2C061A] via-[#480A2A] to-[#6E0F41]',
      tagline: 'Japan-Asia-Europe High Frequency Dedicated Network',
      contractTier: 'THE Alliance Verified Partner',
      slaHours: '2h Standard SLA'
    }
  },
  'Air': {
    carrierKey: 'Air',
    carrierName: 'Air Cargo Express',
    deskName: 'PORTLINE Global Air Cargo Desk',
    agentName: 'Meera Iyer',
    email: 'agent.air@portline.in',
    short: 'Air Desk',
    theme: {
      primaryColor: '#6D28D9',
      accentColor: '#7C3AED',
      badgeBg: 'bg-purple-50',
      badgeText: 'text-purple-700',
      badgeBorder: 'border-purple-200',
      bannerGradient: 'from-[#1A0C33] via-[#2D1457] to-[#451F85]',
      tagline: 'IATA Expedited Air Waybill & Priority ULD Aircraft Allocation',
      contractTier: 'IATA Direct Carrier Integration',
      slaHours: '1h Priority SLA'
    }
  },
  'Express': {
    carrierKey: 'Express',
    carrierName: 'Express Courier & Parcel',
    deskName: 'PORTLINE Express Courier Desk',
    agentName: 'Nitesh Dubey',
    email: 'agent.express@portline.in',
    short: 'Express Desk',
    theme: {
      primaryColor: '#B45309',
      accentColor: '#D97706',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-700',
      badgeBorder: 'border-amber-200',
      bannerGradient: 'from-[#241A06] via-[#3D2C0B] to-[#594110]',
      tagline: 'Time-Definite Air Express & Cross-Border Customs Priority',
      contractTier: 'Express Integrator Direct Contract',
      slaHours: '30m Rapid SLA'
    }
  },
  'default': {
    carrierKey: 'General',
    carrierName: 'PORTLINE General Carrier Network',
    deskName: 'PORTLINE Commercial Operations Desk',
    agentName: 'Arjun Agent',
    email: 'agent@portline.in',
    short: 'General Desk',
    theme: {
      primaryColor: '#0A2540',
      accentColor: '#D9500A',
      badgeBg: 'bg-orange-50',
      badgeText: 'text-brand-orange',
      badgeBorder: 'border-orange-200',
      bannerGradient: 'from-[#0A2540] via-[#103052] to-[#1C4977]',
      tagline: 'Lead Freight Brokerage, Multi-Carrier Routing & Margin Review',
      contractTier: 'Master Brokerage Operations Hub',
      slaHours: '2h SLA'
    }
  }
}

// Backwards-compatible alias for existing imports
export const CARRIER_AGENT_MAP = CARRIER_DESK_CONFIG

/**
 * Determine which dedicated carrier desk an agent belongs to based on user profile.
 */
export function getAgentDesk(user) {
  if (!user) return CARRIER_DESK_CONFIG['default']
  const email = (user.email || '').toLowerCase().trim()
  const name = (user.name || '').toLowerCase()
  const company = (user.company || '').toLowerCase()
  const deskField = (user.carrierDesk || user.desk || '').toLowerCase()

  // Match by specific desk email first
  for (const [key, desk] of Object.entries(CARRIER_DESK_CONFIG)) {
    if (key === 'default') continue
    if (desk.email.toLowerCase() === email) return desk
  }

  // Match by desk/company/name keywords
  for (const [key, desk] of Object.entries(CARRIER_DESK_CONFIG)) {
    if (key === 'default') continue
    const kLower = key.toLowerCase()
    if (deskField.includes(kLower) || email.includes(kLower) || name.includes(kLower) || company.includes(kLower)) {
      return desk
    }
  }

  return CARRIER_DESK_CONFIG['default']
}

/**
 * Resolve the assigned carrier desk for a quote based on its selected route carrier.
 * Prioritizes explicitly selected routes, then quote-level carrier, then route recommendations.
 */
export function resolveAssignedAgent(quote) {
  const carrier = (
    quote?.selected_route?.carrier ||
    quote?.selectedCarrier ||
    quote?.carrier ||
    quote?.selected_carrier ||
    quote?.route?.carrier ||
    quote?.details?.selected_route?.carrier ||
    quote?.details?.routes?.[0]?.carrier ||
    ''
  ).trim()

  if (!carrier) return CARRIER_DESK_CONFIG['default']

  const key = Object.keys(CARRIER_DESK_CONFIG).find(k => k !== 'default' && carrier.toLowerCase().includes(k.toLowerCase()))
  return key ? CARRIER_DESK_CONFIG[key] : CARRIER_DESK_CONFIG['default']
}

