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
export const DEFAULT_CARRIER_THEME = {
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
    theme: DEFAULT_CARRIER_THEME
  }
}

// Map aliases so lookups by 'General', 'GENERAL', etc. never return undefined
CARRIER_DESK_CONFIG['General'] = CARRIER_DESK_CONFIG['default']
CARRIER_DESK_CONFIG['GENERAL'] = CARRIER_DESK_CONFIG['default']
CARRIER_DESK_CONFIG.GENERAL = CARRIER_DESK_CONFIG['default']
CARRIER_DESK_CONFIG.General = CARRIER_DESK_CONFIG['default']

// Backwards-compatible alias for existing imports
export const CARRIER_AGENT_MAP = CARRIER_DESK_CONFIG

/**
 * Extract clean carrier name from company strings (e.g. "PORTLINE Essar Desk" -> "Essar")
 */
export function extractCarrierName(str) {
  if (!str || typeof str !== 'string') return ''
  let s = str.trim()
  s = s.replace(/^PORTLINE\s+/i, '')
  s = s.replace(/\s+Desk$/i, '')
  s = s.replace(/\s+Commercial\s+Operations$/i, '')
  s = s.replace(/\s+Operations$/i, '')
  s = s.replace(/\s+Network$/i, '')
  s = s.replace(/\s*\(.*?\)\s*/g, '')
  const lower = s.toLowerCase()
  if (lower === 'independent shipper' || lower === 'company' || lower === 'general' || lower === 'default') {
    return ''
  }
  return s.trim()
}

/**
 * Safely retrieve dynamic registered companies from localStorage cache
 */
export function getRegisteredCompanies() {
  try {
    const raw = localStorage.getItem('portline_companies')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return []
}

/**
 * Dynamically construct carrier desk identity and theme for any custom company
 */
export function buildDynamicCarrierDesk(carrierName, compMeta = {}, agentUser = null) {
  const cName = carrierName || compMeta?.name || 'Carrier'
  const cKey = compMeta?.carrier_key || cName
  const logoColor = compMeta?.logo_color || '#0E3B43'
  const contractTier = compMeta?.contract_tier || agentUser?.contract_tier || 'Tier 1 Strategic Carrier'
  const slaHours = compMeta?.sla_hours || agentUser?.sla_hours || '2h SLA'
  const officerName = agentUser?.name || compMeta?.agents?.[0]?.name || `${cName} Operations Agent`
  const officerEmail = agentUser?.email || compMeta?.agents?.[0]?.email || compMeta?.manager_email || `agent.${cKey.toLowerCase().replace(/[^a-z0-9]/g, '')}@portline.in`

  return {
    carrierKey: cKey,
    carrierName: cName,
    deskName: cName.toLowerCase().includes('desk') ? cName : `${cName} Commercial Operations Desk`,
    agentName: officerName,
    email: officerEmail,
    short: `${cKey} Desk`,
    theme: {
      primaryColor: logoColor,
      accentColor: '#D9500A',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      badgeBorder: 'border-emerald-200',
      bannerGradient: 'from-[#0B2538] via-[#0E354D] to-[#164E63]',
      tagline: `${cName} Dedicated Logistics & Freight Operations Desk`,
      contractTier,
      slaHours
    }
  }
}

/**
 * Determine which dedicated carrier desk an agent belongs to based on user profile or explicit queryDesk.
 * Fully supports dynamically onboarded companies (e.g. Essar, dynamic freight forwarders).
 */
export function getAgentDesk(user, queryDesk = null) {
  const fallback = CARRIER_DESK_CONFIG['default']

  // 1. Explicit queryDesk override (e.g. from Admin "Open Carrier Desk" or /agent?desk=Essar)
  if (queryDesk && typeof queryDesk === 'string') {
    const q = queryDesk.trim()
    if (q && q !== 'ALL' && q !== 'default' && q !== 'General') {
      // Check built-in carrier desk config
      const hardcoded = Object.entries(CARRIER_DESK_CONFIG).find(([k]) => k !== 'default' && k !== 'General' && isCarrierMatch(k, q))
      if (hardcoded) {
        return {
          ...hardcoded[1],
          theme: { ...DEFAULT_CARRIER_THEME, ...(hardcoded[1]?.theme || {}) }
        }
      }
      // Check registered dynamic companies
      const reg = getRegisteredCompanies().find(c => isCarrierMatch(c.carrier_key || c.name, q))
      if (reg) {
        return buildDynamicCarrierDesk(reg.name, reg, user)
      }
      // Direct build for specified carrier key
      return buildDynamicCarrierDesk(q, {}, user)
    }
  }

  if (!user) return { ...fallback, theme: { ...DEFAULT_CARRIER_THEME, ...(fallback.theme || {}) } }

  const email = (user.email || '').toLowerCase().trim()
  const name = (user.name || '').toLowerCase()
  const carrierKey = (user.carrier_key || user.carrierKey || '').trim()
  const userCompany = extractCarrierName(user.company_name || user.company || user.carrier_desk || user.carrierDesk || carrierKey)
  const deskField = (user.carrierDesk || user.desk || '').toLowerCase()

  // 2. Check if user is explicit master platform supervisor
  const isPlatformLead = (email === 'agent@portline.in' || email === 'agent.demo@portline.in') && !carrierKey && !userCompany
  if (isPlatformLead) {
    return { ...fallback, theme: { ...DEFAULT_CARRIER_THEME, ...(fallback.theme || {}) } }
  }

  // 3. Search dynamic registered companies
  const registeredComps = getRegisteredCompanies()
  if (registeredComps.length > 0) {
    // 3a. Match by exact agent email listed in company agents
    const byAgentEmail = registeredComps.find(c => (c.agents || []).some(a => (a.email || '').trim().toLowerCase() === email))
    if (byAgentEmail) {
      return buildDynamicCarrierDesk(byAgentEmail.name, byAgentEmail, user)
    }

    // 3b. Match by company manager email
    const byManager = registeredComps.find(c => (c.manager_email || '').trim().toLowerCase() === email)
    if (byManager) {
      return buildDynamicCarrierDesk(byManager.name, byManager, user)
    }

    // 3c. Match by carrier key or company name
    const byCompMatch = registeredComps.find(c => {
      const cK = c.carrier_key || c.name || ''
      const cN = c.name || ''
      return (
        (carrierKey && (isCarrierMatch(cK, carrierKey) || isCarrierMatch(cN, carrierKey))) ||
        (userCompany && (isCarrierMatch(cK, userCompany) || isCarrierMatch(cN, userCompany))) ||
        (deskField && (isCarrierMatch(cK, deskField) || isCarrierMatch(cN, deskField)))
      )
    })
    if (byCompMatch) {
      return buildDynamicCarrierDesk(byCompMatch.name, byCompMatch, user)
    }
  }

  // 4. Search built-in CARRIER_DESK_CONFIG
  let matched = null

  // 4a. Match by desk email
  for (const [key, desk] of Object.entries(CARRIER_DESK_CONFIG)) {
    if (key === 'default' || key === 'General' || key === 'GENERAL') continue
    if (desk?.email && desk.email.toLowerCase() === email) {
      matched = desk
      break
    }
  }

  // 4b. Match by carrierKey or company name
  if (!matched && (carrierKey || userCompany)) {
    const target = carrierKey || userCompany
    for (const [key, desk] of Object.entries(CARRIER_DESK_CONFIG)) {
      if (key === 'default' || key === 'General' || key === 'GENERAL') continue
      if (isCarrierMatch(key, target) || isCarrierMatch(desk.carrierName, target)) {
        matched = desk
        break
      }
    }
  }

  // 4c. Match by desk/company/name keywords if not matched yet
  if (!matched) {
    for (const [key, desk] of Object.entries(CARRIER_DESK_CONFIG)) {
      if (key === 'default' || key === 'General' || key === 'GENERAL') continue
      const kLower = key.toLowerCase()
      if (deskField.includes(kLower) || email.includes(kLower) || name.includes(kLower)) {
        matched = desk
        break
      }
    }
  }

  if (matched) {
    return {
      ...matched,
      theme: {
        ...DEFAULT_CARRIER_THEME,
        ...(matched?.theme || {})
      }
    }
  }

  // 5. If company name is present and not a generic shipper, dynamically build desk
  const candidateCarrier = carrierKey || userCompany
  if (candidateCarrier && candidateCarrier.toLowerCase() !== 'general') {
    return buildDynamicCarrierDesk(candidateCarrier, {}, user)
  }

  // 6. Fallback only if no carrier identity is associated
  return {
    ...fallback,
    theme: {
      ...DEFAULT_CARRIER_THEME,
      ...(fallback?.theme || {})
    }
  }
}

/**
 * Normalized carrier matching between desk key and quote/route carrier name.
 */
export function isCarrierMatch(deskKey, routeCarrier) {
  if (!deskKey || !routeCarrier) return false
  const d = String(deskKey).toLowerCase().replace(/[^a-z0-9]/g, '')
  const r = String(routeCarrier).toLowerCase().replace(/[^a-z0-9]/g, '')

  if (d === r || d.includes(r) || r.includes(d)) return true

  // Common carrier aliases and brand variants
  if ((d.includes('hapag') || d.includes('hlag')) && (r.includes('hapag') || r.includes('hlag'))) return true
  if (d.includes('cma') && r.includes('cma')) return true
  if (d.includes('maersk') && r.includes('maersk')) return true
  if (d.includes('msc') && r.includes('msc')) return true
  if (d.includes('evergreen') && r.includes('evergreen')) return true
  if (d.includes('cosco') && r.includes('cosco')) return true
  if ((d.includes('one') || d.includes('oceannetwork')) && (r.includes('one') || r.includes('oceannetwork'))) return true
  if (d.includes('air') && r.includes('air')) return true
  if (d.includes('express') && r.includes('express')) return true

  return false
}

/**
 * Resolve the assigned carrier desk for a quote based on its selected route carrier.
 * Prioritizes explicitly selected routes, then quote-level carrier, then route recommendations.
 * Fully supports dynamic carrier companies.
 */
export function resolveAssignedAgent(quote) {
  const fallback = CARRIER_DESK_CONFIG['default']
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

  if (!carrier) {
    return { ...fallback, theme: { ...DEFAULT_CARRIER_THEME, ...(fallback.theme || {}) } }
  }

  // 1. Check built-in carrier desk config
  const key = Object.keys(CARRIER_DESK_CONFIG).find(k => k !== 'default' && k !== 'General' && k !== 'GENERAL' && isCarrierMatch(k, carrier))
  if (key && CARRIER_DESK_CONFIG[key]) {
    const found = CARRIER_DESK_CONFIG[key]
    return {
      ...found,
      theme: {
        ...DEFAULT_CARRIER_THEME,
        ...(found?.theme || {})
      }
    }
  }

  // 2. Check registered dynamic companies
  const regComp = getRegisteredCompanies().find(c => isCarrierMatch(c.carrier_key || c.name, carrier))
  if (regComp) {
    return buildDynamicCarrierDesk(regComp.name, regComp)
  }

  // 3. Dynamically build desk for carrier name
  return buildDynamicCarrierDesk(carrier, {})
}


