/**
 * carrierConfig.js
 * 
 * Production Carrier Desk Configuration, Theme Engine, Dynamic Carrier Support,
 * and Agent Route Assignment Logic.
 * Kept completely isolated from mock data fixtures.
 */

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

export const DEFAULT_THEME = DEFAULT_CARRIER_THEME

export const CARRIER_DESK_CONFIG = {
  'CMA CGM': {
    carrierKey: 'CMA CGM',
    carrierName: 'CMA CGM',
    serviceCategory: 'OCEAN',
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
    serviceCategory: 'OCEAN',
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
    serviceCategory: 'OCEAN',
    deskName: 'Maersk Line Partner Operations Desk',
    agentName: 'Kiran Reddy',
    email: 'agent.maersk@portline.in',
    short: 'Maersk Desk',
    theme: {
      primaryColor: '#002B49',
      accentColor: '#0284C7',
      badgeBg: 'bg-sky-50',
      badgeText: 'text-sky-700',
      badgeBorder: 'border-sky-200',
      bannerGradient: 'from-[#001D33] via-[#002B49] to-[#034A75]',
      tagline: 'Integrated Cold Chain, End-to-End Intermodal & Spot Allocation',
      contractTier: 'Premier Global Freight Partner',
      slaHours: '1h Priority Turnaround'
    }
  },
  'Hapag-Lloyd': {
    carrierKey: 'Hapag-Lloyd',
    carrierName: 'Hapag-Lloyd',
    serviceCategory: 'OCEAN',
    deskName: 'Hapag-Lloyd Express Cargo Desk',
    agentName: 'Sanjay Mehta',
    email: 'agent.hapag@portline.in',
    short: 'Hapag Desk',
    theme: {
      primaryColor: '#0F172A',
      accentColor: '#EA580C',
      badgeBg: 'bg-orange-50',
      badgeText: 'text-orange-700',
      badgeBorder: 'border-orange-200',
      bannerGradient: 'from-[#0A0F1D] via-[#15203B] to-[#1E305C]',
      tagline: 'Transatlantic, North America Direct & Dangerous Cargo Protocols',
      contractTier: 'Quality Service Verified Carrier',
      slaHours: '2h Express SLA'
    }
  },
  'ONE': {
    carrierKey: 'ONE',
    carrierName: 'Ocean Network Express (ONE)',
    serviceCategory: 'OCEAN',
    deskName: 'ONE Pacific & Intra-Asia Operations Desk',
    agentName: 'Ananya Roy',
    email: 'agent.one@portline.in',
    short: 'ONE Desk',
    theme: {
      primaryColor: '#831843',
      accentColor: '#DB2777',
      badgeBg: 'bg-pink-50',
      badgeText: 'text-pink-700',
      badgeBorder: 'border-pink-200',
      bannerGradient: 'from-[#500724] via-[#831843] to-[#9D174D]',
      tagline: 'Fast Intra-Asia Shuttle & Transpacific Liner Operations',
      contractTier: 'Core Regional Partner',
      slaHours: '3h SLA'
    }
  },
  'Evergreen': {
    carrierKey: 'Evergreen',
    carrierName: 'Evergreen Marine',
    serviceCategory: 'OCEAN',
    deskName: 'Evergreen Marine Logistics Desk',
    agentName: 'Ramesh Patel',
    email: 'agent.evergreen@portline.in',
    short: 'Evergreen Desk',
    theme: {
      primaryColor: '#064E3B',
      accentColor: '#059669',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      badgeBorder: 'border-emerald-200',
      bannerGradient: 'from-[#022C22] via-[#064E3B] to-[#065F46]',
      tagline: 'Asia-Europe Mainline & Round-The-World Service',
      contractTier: 'Strategic Volume Agreement',
      slaHours: '2h SLA'
    }
  },
  'COSCO': {
    carrierKey: 'COSCO',
    carrierName: 'COSCO Shipping Lines',
    serviceCategory: 'OCEAN',
    deskName: 'COSCO Shipping Operations Desk',
    agentName: 'Sunil Gupta',
    email: 'agent.cosco@portline.in',
    short: 'COSCO Desk',
    theme: {
      primaryColor: '#1E3A5F',
      accentColor: '#2563EB',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-700',
      badgeBorder: 'border-blue-200',
      bannerGradient: 'from-[#0F1E33] via-[#1E3A5F] to-[#2B548A]',
      tagline: 'Belt and Road Maritime Corridor & Direct China Feeder',
      contractTier: 'Preferred Carrier Contract',
      slaHours: '3h SLA'
    }
  },
  // --- Air Freight & Express Air Carriers ---
  'Air India Cargo': {
    carrierKey: 'Air India Cargo',
    carrierName: 'Air India Cargo',
    serviceCategory: 'AIR',
    deskName: 'Air India Cargo Special Operations Desk',
    agentName: 'Pooja Verma',
    email: 'agent.airindia@portline.in',
    short: 'Air India Desk',
    theme: {
      primaryColor: '#7F1D1D',
      accentColor: '#DC2626',
      badgeBg: 'bg-red-50',
      badgeText: 'text-red-700',
      badgeBorder: 'border-red-200',
      bannerGradient: 'from-[#450A0A] via-[#7F1D1D] to-[#991B1B]',
      tagline: 'National Carrier Priority Belly Space & Express Perishables',
      contractTier: 'National Flag Carrier Air Priority',
      slaHours: '45m Express Air SLA'
    }
  },
  'Emirates SkyCargo': {
    carrierKey: 'Emirates SkyCargo',
    carrierName: 'Emirates SkyCargo',
    serviceCategory: 'AIR',
    deskName: 'Emirates SkyCargo Gulf & Europe Desk',
    agentName: 'Farhan Khan',
    email: 'agent.emirates@portline.in',
    short: 'Emirates Desk',
    theme: {
      primaryColor: '#7C2D12',
      accentColor: '#EA580C',
      badgeBg: 'bg-orange-50',
      badgeText: 'text-orange-700',
      badgeBorder: 'border-orange-200',
      bannerGradient: 'from-[#431407] via-[#7C2D12] to-[#9A3412]',
      tagline: 'Dubai World Central Hub Connections & Pharma Cool-Chain',
      contractTier: 'Global Air Cargo Strategic SLA',
      slaHours: '30m Urgent Air SLA'
    }
  },
  'Lufthansa Cargo': {
    carrierKey: 'Lufthansa Cargo',
    carrierName: 'Lufthansa Cargo',
    serviceCategory: 'AIR',
    deskName: 'Lufthansa Cargo European Hub Desk',
    agentName: 'Marcus Weber',
    email: 'agent.lufthansa@portline.in',
    short: 'Lufthansa Desk',
    theme: {
      primaryColor: '#0F172A',
      accentColor: '#F59E0B',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-700',
      badgeBorder: 'border-amber-200',
      bannerGradient: 'from-[#0B1120] via-[#1E293B] to-[#334155]',
      tagline: 'Frankfurt Hub Transatlantic Pharma, Heavy & Tech Express',
      contractTier: 'Premium Express Air Carrier',
      slaHours: '45m Urgent Air SLA'
    }
  },
  'DTDC Express': {
    carrierKey: 'DTDC Express',
    carrierName: 'DTDC Express Global Cargo',
    serviceCategory: 'AIR',
    deskName: 'DTDC Express Air & Cross-Border Desk',
    agentName: 'Naveen Kumar',
    email: 'agent.dtdc@portline.in',
    short: 'DTDC Desk',
    theme: {
      primaryColor: '#1E3A8A',
      accentColor: '#EF4444',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-700',
      badgeBorder: 'border-blue-200',
      bannerGradient: 'from-[#0F172A] via-[#1E3A8A] to-[#2563EB]',
      tagline: 'Express Air Parcel, Priority Courier & Cross-Border Customs Priority',
      contractTier: 'Express Integrator Direct Contract',
      slaHours: '30m Rapid SLA'
    }
  },
  'Cocanada Xpress': {
    carrierKey: 'Cocanada Xpress',
    carrierName: 'Cocanada Xpress Logistics',
    serviceCategory: 'AIR',
    deskName: 'Cocanada Xpress Aviation & Intermodal Desk',
    agentName: 'Rao Srinivas',
    email: 'agent.cocanada@portline.in',
    short: 'Cocanada Desk',
    theme: {
      primaryColor: '#047857',
      accentColor: '#10B981',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      badgeBorder: 'border-emerald-200',
      bannerGradient: 'from-[#064E3B] via-[#047857] to-[#059669]',
      tagline: 'Eastern Seaboard High-Speed Air & Feeder Cargo Distribution',
      contractTier: 'Regional Aviation Freight Partner',
      slaHours: '1h Priority SLA'
    }
  },
  'Delta Cargo Movers': {
    carrierKey: 'Delta Cargo Movers',
    carrierName: 'Delta Cargo Movers International',
    serviceCategory: 'AIR',
    deskName: 'Delta Cargo Movers North America & Transpacific Desk',
    agentName: 'Sarah Jenkins',
    email: 'agent.deltacargo@portline.in',
    short: 'Delta Cargo Desk',
    theme: {
      primaryColor: '#1E1B4B',
      accentColor: '#6366F1',
      badgeBg: 'bg-indigo-50',
      badgeText: 'text-indigo-700',
      badgeBorder: 'border-indigo-200',
      bannerGradient: 'from-[#0F172A] via-[#1E1B4B] to-[#312E81]',
      tagline: 'Direct Transpacific Air Cargo, Heavy Freight & Aerospace Logistics',
      contractTier: 'Transatlantic Air Cargo Contract',
      slaHours: '45m Urgent Air SLA'
    }
  },
  'Blue Dart Aviation': {
    carrierKey: 'Blue Dart Aviation',
    carrierName: 'Blue Dart Aviation',
    serviceCategory: 'AIR',
    deskName: 'Blue Dart Aviation Dedicated Freighter Desk',
    agentName: 'Kavita Chawla',
    email: 'agent.bluedart@portline.in',
    short: 'Blue Dart Desk',
    theme: {
      primaryColor: '#1E3A8A',
      accentColor: '#F59E0B',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-800',
      badgeBorder: 'border-blue-200',
      bannerGradient: 'from-[#0A1A3A] via-[#1E3A8A] to-[#1D4ED8]',
      tagline: 'Dedicated Boeing Freighter Fleet, Night Express & High-Value Cargo',
      contractTier: 'Premier Domestic & Regional Air Carrier',
      slaHours: '30m Express SLA'
    }
  },
  'VRL Air Cargo': {
    carrierKey: 'VRL Air Cargo',
    carrierName: 'VRL Air Cargo',
    serviceCategory: 'AIR',
    deskName: 'VRL Air Cargo National Express Desk',
    agentName: 'Girish Patil',
    email: 'agent.vrl@portline.in',
    short: 'VRL Air Desk',
    theme: {
      primaryColor: '#854D0E',
      accentColor: '#EAB308',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-800',
      badgeBorder: 'border-amber-200',
      bannerGradient: 'from-[#422006] via-[#713F12] to-[#A16207]',
      tagline: 'National Air Charter, Tier-2/Tier-3 Air Connect & Express Perishables',
      contractTier: 'Strategic Domestic Air Partner',
      slaHours: '1h Rapid SLA'
    }
  },
  // --- Ground & Rail Carriers ---
  'CONCOR': {
    carrierKey: 'CONCOR',
    carrierName: 'Container Corporation of India (CONCOR)',
    serviceCategory: 'GROUND_RAIL',
    deskName: 'CONCOR Rail Intermodal & DFC Terminal Desk',
    agentName: 'Arvind Sharma',
    email: 'agent.concor@portline.in',
    short: 'CONCOR Desk',
    theme: {
      primaryColor: '#14532D',
      accentColor: '#22C55E',
      badgeBg: 'bg-green-50',
      badgeText: 'text-green-700',
      badgeBorder: 'border-green-200',
      bannerGradient: 'from-[#052E16] via-[#14532D] to-[#166534]',
      tagline: 'Western & Eastern Dedicated Freight Corridor (DFC) Double-Stack Rakes',
      contractTier: 'National Rail Intermodal Undertaking',
      slaHours: '2h DFC Clearance SLA'
    }
  },
  'VRL Logistics': {
    carrierKey: 'VRL Logistics',
    carrierName: 'VRL Logistics (Surface & FTL)',
    serviceCategory: 'GROUND_RAIL',
    deskName: 'VRL Logistics National Road Transport Desk',
    agentName: 'Anand Kulkarni',
    email: 'agent.vrllogistics@portline.in',
    short: 'VRL Logistics Desk',
    theme: {
      primaryColor: '#78350F',
      accentColor: '#D97706',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-700',
      badgeBorder: 'border-amber-200',
      bannerGradient: 'from-[#451A03] via-[#78350F] to-[#92400E]',
      tagline: 'Largest Commercial Truck Fleet in India, High-Capacity FTL & Parcel',
      contractTier: 'Premier Surface Transport Carrier',
      slaHours: '1.5h Road Dispatch SLA'
    }
  },
  'TCI Freight': {
    carrierKey: 'TCI Freight',
    carrierName: 'TCI Freight (Transport Corp of India)',
    serviceCategory: 'GROUND_RAIL',
    deskName: 'TCI Freight Multimodal Rail & Road Operations Desk',
    agentName: 'Rajesh Agarwal',
    email: 'agent.tci@portline.in',
    short: 'TCI Freight Desk',
    theme: {
      primaryColor: '#1E3A5F',
      accentColor: '#3B82F6',
      badgeBg: 'bg-sky-50',
      badgeText: 'text-sky-700',
      badgeBorder: 'border-sky-200',
      bannerGradient: 'from-[#0C2340] via-[#1E3A5F] to-[#2B548A]',
      tagline: 'Heavy ODC Cargo, Integrated Rail Rake & Pan-India Hub-and-Spoke',
      contractTier: 'Strategic Surface Logistics Agreement',
      slaHours: '2h Guaranteed SLA'
    }
  },
  'GATI-KWE': {
    carrierKey: 'GATI-KWE',
    carrierName: 'GATI-Kintetsu World Express',
    serviceCategory: 'GROUND_RAIL',
    deskName: 'GATI-KWE Express Distribution & Cross-Dock Desk',
    agentName: 'Praveen Nair',
    email: 'agent.gati@portline.in',
    short: 'GATI Desk',
    theme: {
      primaryColor: '#4C1D95',
      accentColor: '#8B5CF6',
      badgeBg: 'bg-purple-50',
      badgeText: 'text-purple-700',
      badgeBorder: 'border-purple-200',
      bannerGradient: 'from-[#2E1065] via-[#4C1D95] to-[#6D28D9]',
      tagline: 'Express Surface Cargo, Automated Sorting Cross-Docks & Cold Distribution',
      contractTier: 'Express Road Freight Partner',
      slaHours: '1h Express SLA'
    }
  },
  'Allcargo Logistics': {
    carrierKey: 'Allcargo Logistics',
    carrierName: 'Allcargo Logistics (CFS & Rail)',
    serviceCategory: 'GROUND_RAIL',
    deskName: 'Allcargo CFS & Inland Rail Intermodal Desk',
    agentName: 'Manisha Joshi',
    email: 'agent.allcargo@portline.in',
    short: 'Allcargo Desk',
    theme: {
      primaryColor: '#0F172A',
      accentColor: '#0EA5E9',
      badgeBg: 'bg-cyan-50',
      badgeText: 'text-cyan-700',
      badgeBorder: 'border-cyan-200',
      bannerGradient: 'from-[#081225] via-[#0F172A] to-[#1E293B]',
      tagline: 'Pan-India CFS Network, Container Train Operations (CTO) & Intermodal ICD',
      contractTier: 'Premier Multimodal Logistics Partner',
      slaHours: '2h CFS Turnaround'
    }
  },
  'Delhivery Freight': {
    carrierKey: 'Delhivery Freight',
    carrierName: 'Delhivery Freight (Heavy & PTL/FTL)',
    serviceCategory: 'GROUND_RAIL',
    deskName: 'Delhivery Surface Freight Automation Desk',
    agentName: 'Aman Bhardwaj',
    email: 'agent.delhivery@portline.in',
    short: 'Delhivery Desk',
    theme: {
      primaryColor: '#831843',
      accentColor: '#EC4899',
      badgeBg: 'bg-pink-50',
      badgeText: 'text-pink-700',
      badgeBorder: 'border-pink-200',
      bannerGradient: 'from-[#4C0519] via-[#831843] to-[#9D174D]',
      tagline: 'Automated Mega Gateway Sorting, PTL/FTL Fleet & Real-Time Telematics',
      contractTier: 'Tech-Driven Surface Freight Carrier',
      slaHours: '1h Priority Dispatch'
    }
  },
  'default': {
    carrierKey: 'General',
    carrierName: 'PORTLINE Freight Operations Desk',
    serviceCategory: 'OCEAN',
    deskName: 'PORTLINE Commercial Operations Desk',
    agentName: 'Freight Operations Lead',
    email: 'agent@portline.in',
    short: 'PORTLINE Operations',
    theme: DEFAULT_CARRIER_THEME
  }
}

// Aliases
CARRIER_DESK_CONFIG['General'] = CARRIER_DESK_CONFIG['default']
CARRIER_DESK_CONFIG['GENERAL'] = CARRIER_DESK_CONFIG['default']
CARRIER_DESK_CONFIG.GENERAL = CARRIER_DESK_CONFIG['default']
CARRIER_DESK_CONFIG.General = CARRIER_DESK_CONFIG['default']

export const CARRIER_AGENT_MAP = CARRIER_DESK_CONFIG

export function extractCarrierName(text) {
  if (!text || typeof text !== 'string') return ''
  const t = text.trim()
  if (t.toLowerCase().endsWith(' desk')) {
    return t.slice(0, -5).trim()
  }
  return t
}

export function getRegisteredCompanies() {
  try {
    const raw = localStorage.getItem('portline_companies')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {}
  return []
}

/**
 * Dynamically construct a carrier desk configuration for any registered carrier company.
 */
export function buildDynamicCarrierDesk(companyName, compMeta = {}, agentUser = null) {
  const cName = companyName || compMeta.name || 'Carrier Partner'
  const cKey = compMeta.carrier_key || cName

  let hash = 0
  for (let i = 0; i < cName.length; i++) {
    hash = (hash << 5) - hash + cName.charCodeAt(i)
    hash |= 0
  }
  const colorOptions = ['#0A2540', '#0F172A', '#064E3B', '#1E3A5F', '#7F1D1D', '#312E81', '#1E293B']
  const logoColor = compMeta.logo_color || colorOptions[Math.abs(hash) % colorOptions.length]

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
 */
export function getAgentDesk(user, queryDesk = null) {
  const fallback = CARRIER_DESK_CONFIG['default']

  if (queryDesk && typeof queryDesk === 'string') {
    const q = queryDesk.trim()
    if (q && q !== 'ALL' && q !== 'default' && q !== 'General') {
      const hardcoded = Object.entries(CARRIER_DESK_CONFIG).find(([k]) => k !== 'default' && k !== 'General' && isCarrierMatch(k, q))
      if (hardcoded) {
        return {
          ...hardcoded[1],
          theme: { ...DEFAULT_CARRIER_THEME, ...(hardcoded[1]?.theme || {}) }
        }
      }
      const reg = getRegisteredCompanies().find(c => isCarrierMatch(c.carrier_key || c.name, q))
      if (reg) {
        return buildDynamicCarrierDesk(reg.name, reg, user)
      }
      return buildDynamicCarrierDesk(q, {}, user)
    }
  }

  if (!user) return { ...fallback, theme: { ...DEFAULT_CARRIER_THEME, ...(fallback.theme || {}) } }

  const email = (user.email || '').toLowerCase().trim()
  const name = (user.name || '').toLowerCase()
  const carrierKey = (user.carrier_key || user.carrierKey || '').trim()
  const userCompany = extractCarrierName(user.company_name || user.company || user.carrier_desk || user.carrierDesk || carrierKey)
  const deskField = (user.carrierDesk || user.desk || '').toLowerCase()

  const isPlatformLead = (email === 'agent@portline.in' || email === 'agent.demo@portline.in') && !carrierKey && !userCompany
  if (isPlatformLead) {
    return { ...fallback, theme: { ...DEFAULT_CARRIER_THEME, ...(fallback.theme || {}) } }
  }

  const registeredComps = getRegisteredCompanies()
  if (registeredComps.length > 0) {
    const byAgentEmail = registeredComps.find(c => (c.agents || []).some(a => (a.email || '').trim().toLowerCase() === email))
    if (byAgentEmail) {
      return buildDynamicCarrierDesk(byAgentEmail.name, byAgentEmail, user)
    }

    const byManager = registeredComps.find(c => (c.manager_email || '').trim().toLowerCase() === email)
    if (byManager) {
      return buildDynamicCarrierDesk(byManager.name, byManager, user)
    }

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

  let matched = null

  for (const [key, desk] of Object.entries(CARRIER_DESK_CONFIG)) {
    if (key === 'default' || key === 'General' || key === 'GENERAL') continue
    if (desk?.email && desk.email.toLowerCase() === email) {
      matched = desk
      break
    }
  }

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

  const candidateCarrier = carrierKey || userCompany
  if (candidateCarrier && candidateCarrier.toLowerCase() !== 'general') {
    return buildDynamicCarrierDesk(candidateCarrier, {}, user)
  }

  return {
    ...fallback,
    theme: {
      ...DEFAULT_CARRIER_THEME,
      ...(fallback?.theme || {})
    }
  }
}

export function isCarrierMatch(deskKey, routeCarrier) {
  if (!deskKey || !routeCarrier) return false
  const a = deskKey.toLowerCase().replace(/[^a-z0-9]/g, '')
  const b = routeCarrier.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (a === b) return true
  if (a.includes(b) || b.includes(a)) return true

  const synonyms = [
    ['maersk', 'maerskline', 'apm'],
    ['msc', 'mediterranean', 'mediterraneanshipping'],
    ['cmacgm', 'cma', 'cgm'],
    ['hapaglloyd', 'hapag', 'hlag'],
    ['one', 'oceannetworkexpress'],
    ['evergreen', 'evergreenmarine'],
    ['cosco', 'coscoshipping'],
    ['airindia', 'airindiacargo'],
    ['emirates', 'emiratesskycargo'],
    ['lufthansa', 'lufthansacargo'],
    ['dtdc', 'dtdcexpress'],
    ['cocanada', 'cocanadaxpress', 'cocanadaexpress'],
    ['deltacargo', 'deltacargomovers', 'deltamover'],
    ['bluedart', 'bluedartaviation'],
    ['vrl', 'vrlair', 'vrlaircargo'],
    ['concor', 'containercooperationofindia', 'containercooperation'],
    ['vrllogistics', 'vrlroad', 'vrlsurface'],
    ['tci', 'tcifreight', 'tcilogistics', 'transportcorpofindia'],
    ['gati', 'gatikwe', 'gatiexpress'],
    ['allcargo', 'allcargologistics', 'allcargocfs'],
    ['delhivery', 'delhiveryfreight', 'delhiverysurface']
  ]

  for (const group of synonyms) {
    const aInGroup = group.some(item => a.includes(item) || item.includes(a))
    const bInGroup = group.some(item => b.includes(item) || item.includes(b))
    if (aInGroup && bInGroup) return true
  }

  return false
}

export function resolveAssignedAgent(quote) {
  const fallback = CARRIER_DESK_CONFIG['default']
  if (!quote) return { ...fallback, theme: { ...DEFAULT_CARRIER_THEME, ...(fallback.theme || {}) } }

  const carrier =
    quote.selected_route?.carrier ||
    quote.carrier ||
    quote.details?.carrier ||
    quote.assigned_carrier ||
    quote.routes?.[0]?.carrier ||
    quote.route_options?.[0]?.carrier ||
    quote.route_breakdown?.carrier

  if (!carrier) {
    return { ...fallback, theme: { ...DEFAULT_CARRIER_THEME, ...(fallback.theme || {}) } }
  }

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

  const regComp = getRegisteredCompanies().find(c => isCarrierMatch(c.carrier_key || c.name, carrier))
  if (regComp) {
    return buildDynamicCarrierDesk(regComp.name, regComp)
  }

  return buildDynamicCarrierDesk(carrier, {})
}
