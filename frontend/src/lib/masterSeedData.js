/**
 * Real-world Master Database Seed Data & Metadata for Frontend (Offline/Mock & Preview)
 */

export const MASTER_COLLECTIONS_META = [
  { key: 'ports', label: 'Ports & Terminals', icon: 'Ship', desc: '60 Sea Ports with UN/LOCODE, coordinates, max draft, and terminals' },
  { key: 'airports', label: 'Cargo Airports', icon: 'Plane', desc: '40 International Cargo Hubs with IATA codes and 24h customs info' },
  { key: 'trade_lanes', label: 'Trade Lanes', icon: 'Route', desc: '50 Shipping Lanes with nautical distances, transit days, and canal routes' },
  { key: 'carriers', label: 'Carriers & Lines', icon: 'Shield', desc: '20 Ocean Container Lines & 10 Airlines with SCAC/IATA codes and reliability scores' },
  { key: 'rate_cards', label: 'Rate Cards', icon: 'DollarSign', desc: 'Active carrier contract rate sheets with base freight, THC, and BAF' },
  { key: 'surcharge_rules', label: 'Surcharge Rules', icon: 'Percent', desc: 'Dynamic surcharges: PSS, Red Sea War Risk, Congestion, Hazardous, Reefer' },
  { key: 'margin_policies', label: 'Margin Policies', icon: 'TrendingUp', desc: 'Tiered profit margins, floor/ceiling thresholds, and customer tier pricing' },
  { key: 'container_types', label: 'Container Types', icon: 'Box', desc: 'ISO 20GP, 40GP, 40HC, 45HC, 20RF, 40RF, Flat Rack & Open Top specifications' },
  { key: 'service_types', label: 'Service Types', icon: 'Layers', desc: 'Ocean FCL, LCL, Air General, Air Express, Road FTL & Rail freight modes' },
  { key: 'cargo_types', label: 'Cargo Types', icon: 'AlertTriangle', desc: 'General, Perishable, Pharma, and IMO Hazmat Classes 2, 3, 4, 6, 8, 9' },
  { key: 'commodities', label: 'Commodities (HS)', icon: 'FileText', desc: '30 Real 6-digit Harmonized System (HS) codes with typical customs duty rates' },
  { key: 'incoterms', label: 'Incoterms 2020', icon: 'FileCheck', desc: 'All 11 ICC Incoterms rules with seller/buyer cost responsibilities' },
  { key: 'charge_heads', label: 'Charge Heads', icon: 'CreditCard', desc: '25 Standardized freight, terminal, customs, and administrative charge codes' },
  { key: 'customs_tariffs', label: 'Customs Tariffs', icon: 'ShieldCheck', desc: 'Country import duties, GST/VAT rates, and mandatory clearance documents' },
  { key: 'currencies', label: 'Currencies', icon: 'Coins', desc: '12 Major trading currencies (USD, INR, EUR, AED, GBP, SGD, CNY, etc.)' },
  { key: 'exchange_rates', label: 'Exchange Rates', icon: 'ArrowRightLeft', desc: 'Current foreign exchange conversion rates against USD base' },
  { key: 'countries', label: 'Countries', icon: 'Globe', desc: '30 Key maritime and trade nations with customs union affiliations' },
  { key: 'packaging_types', label: 'Packaging Types', icon: 'Package', desc: 'Euro/GMA Pallets, Cartons, Wooden Crates, Steel/Plastic Drums, Flexitanks' },
  { key: 'document_types', label: 'Document Types', icon: 'Files', desc: '15 Shipping documents: BL, AWB, COO, EUR.1, MSDS, Phytosanitary, ISF' },
  { key: 'customer_tiers', label: 'Customer Tiers', icon: 'Users', desc: 'Standard, Silver, Gold, Platinum, Enterprise SLAs and discount ceilings' },
]

export const FALLBACK_SEED = {
  ports: [
    { locode: 'INNSA', name: 'Jawaharlal Nehru Port (JNPT)', city: 'Navi Mumbai', country: 'IN', lat: 18.95, lon: 72.9514, type: 'SEA', max_draft_m: 14.5, terminal: 'APMT / Gateway Terminals', tier: 1, active: true },
    { locode: 'INMAA', name: 'Chennai Port', city: 'Chennai', country: 'IN', lat: 13.0827, lon: 80.2989, type: 'SEA', max_draft_m: 13.0, terminal: 'CCTL / QCPL', tier: 1, active: true },
    { locode: 'INMUN', name: 'Mundra Port', city: 'Mundra', country: 'IN', lat: 22.8394, lon: 69.7141, type: 'SEA', max_draft_m: 17.0, terminal: 'APMT Mundra', tier: 1, active: true },
    { locode: 'AEJEA', name: 'Jebel Ali Port', city: 'Dubai', country: 'AE', lat: 24.9857, lon: 55.064, type: 'SEA', max_draft_m: 17.0, terminal: 'DP World Jebel Ali (T1/T2/T3)', tier: 1, active: true },
    { locode: 'SGSIN', name: 'Port of Singapore (PSA)', city: 'Singapore', country: 'SG', lat: 1.2655, lon: 103.8232, type: 'SEA', max_draft_m: 18.0, terminal: 'Tanjong Pagar / Brani / Keppel', tier: 1, active: true },
    { locode: 'NLRTM', name: 'Port of Rotterdam', city: 'Rotterdam', country: 'NL', lat: 51.95, lon: 4.14, type: 'SEA', max_draft_m: 23.0, terminal: 'ECT / APM Terminals Maasvlakte', tier: 1, active: true },
    { locode: 'DEHAM', name: 'Port of Hamburg', city: 'Hamburg', country: 'DE', lat: 53.5389, lon: 9.99, type: 'SEA', max_draft_m: 15.6, terminal: 'HHLA / Eurogate Hamburg', tier: 1, active: true },
    { locode: 'CNSHA', name: 'Port of Shanghai (Yangshan)', city: 'Shanghai', country: 'CN', lat: 30.6236, lon: 122.0712, type: 'SEA', max_draft_m: 18.0, terminal: 'SIPG Yangshan Deep Water Port', tier: 1, active: true },
    { locode: 'USLAX', name: 'Port of Los Angeles', city: 'Los Angeles', country: 'US', lat: 33.7364, lon: -118.2717, type: 'SEA', max_draft_m: 16.8, terminal: 'APM Terminals Pier 400', tier: 1, active: true },
    { locode: 'GBLGP', name: 'Port of Felixstowe', city: 'Felixstowe', country: 'GB', lat: 51.9659, lon: 1.3329, type: 'SEA', max_draft_m: 17.0, terminal: 'Felixstowe North / South', tier: 1, active: true },
  ],
  airports: [
    { iata: 'BOM', icao: 'VABB', name: 'Chhatrapati Shivaji Maharaj Intl Airport', city: 'Mumbai', country: 'IN', lat: 19.0896, lon: 72.8656, cargo_tier: 1, customs_open_24h: true, active: true },
    { iata: 'DEL', icao: 'VIDP', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'IN', lat: 28.5665, lon: 77.1031, cargo_tier: 1, customs_open_24h: true, active: true },
    { iata: 'DXB', icao: 'OMDB', name: 'Dubai International Airport', city: 'Dubai', country: 'AE', lat: 25.2532, lon: 55.3657, cargo_tier: 1, customs_open_24h: true, active: true },
    { iata: 'SIN', icao: 'WSSS', name: 'Singapore Changi Airport', city: 'Singapore', country: 'SG', lat: 1.3644, lon: 103.9915, cargo_tier: 1, customs_open_24h: true, active: true },
    { iata: 'FRA', icao: 'EDDF', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'DE', lat: 50.0379, lon: 8.5622, cargo_tier: 1, customs_open_24h: true, active: true },
    { iata: 'LHR', icao: 'EGLL', name: 'London Heathrow Airport', city: 'London', country: 'GB', lat: 51.47, lon: -0.4543, cargo_tier: 1, customs_open_24h: true, active: true },
    { iata: 'JFK', icao: 'KJFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'US', lat: 40.6413, lon: -73.7781, cargo_tier: 1, customs_open_24h: true, active: true },
  ],
  trade_lanes: [
    { lane_code: 'INNSA-AEJEA-OCEAN', origin_locode: 'INNSA', dest_locode: 'AEJEA', mode: 'OCEAN', dist_nm: 1250, transit_days_min: 4, transit_days_max: 7, canals_crossed: [], active: true },
    { lane_code: 'INNSA-NLRTM-OCEAN', origin_locode: 'INNSA', dest_locode: 'NLRTM', mode: 'OCEAN', dist_nm: 7950, transit_days_min: 18, transit_days_max: 24, canals_crossed: ['SUEZ'], active: true },
    { lane_code: 'INNSA-SGSIN-OCEAN', origin_locode: 'INNSA', dest_locode: 'SGSIN', mode: 'OCEAN', dist_nm: 2730, transit_days_min: 8, transit_days_max: 12, canals_crossed: ['MALACCA'], active: true },
    { lane_code: 'BOM-DXB-AIR', origin_locode: 'BOM', dest_locode: 'DXB', mode: 'AIR', dist_nm: 1203, transit_days_min: 1, transit_days_max: 2, canals_crossed: [], active: true },
    { lane_code: 'BOM-FRA-AIR', origin_locode: 'BOM', dest_locode: 'FRA', mode: 'AIR', dist_nm: 4284, transit_days_min: 1, transit_days_max: 3, canals_crossed: [], active: true },
  ],
  carriers: [
    { scac: 'MAEU', name: 'Maersk Line', type: 'OCEAN', alliance: '2M', reliability_score: 91, tracking_url: 'https://www.maersk.com/tracking/', active: true },
    { scac: 'MSCU', name: 'MSC Mediterranean Shipping Company', type: 'OCEAN', alliance: '2M', reliability_score: 87, tracking_url: 'https://www.msc.com/track-a-shipment', active: true },
    { scac: 'CMDU', name: 'CMA CGM', type: 'OCEAN', alliance: 'OCEAN Alliance', reliability_score: 88, tracking_url: 'https://www.cma-cgm.com/ebusiness/tracking', active: true },
    { scac: 'HLCU', name: 'Hapag-Lloyd', type: 'OCEAN', alliance: 'THE Alliance', reliability_score: 90, tracking_url: 'https://www.hapag-lloyd.com', active: true },
    { scac: 'EK', name: 'Emirates SkyCargo', type: 'AIR', iata: 'EK', alliance: 'Independent', reliability_score: 95, tracking_url: 'https://www.skycargo.com', active: true },
    { scac: 'FX', name: 'FedEx International Priority', type: 'AIR_EXPRESS', iata: 'FX', alliance: 'Independent', reliability_score: 96, tracking_url: 'https://www.fedex.com', active: true },
  ],
  rate_cards: [
    { card_id: 'RC-2026-MAEU-INME-001', carrier_scac: 'MAEU', trade: 'INDIA - MIDDLE EAST', service_type: 'OCEAN_FCL', currency: 'USD', tier: 'STANDARD', active: true },
    { card_id: 'RC-2026-HLCU-INEU-001', carrier_scac: 'HLCU', trade: 'INDIA - NORTH EUROPE', service_type: 'OCEAN_FCL', currency: 'USD', tier: 'STANDARD', active: true },
    { card_id: 'RC-2026-EK-INME-AIR-001', carrier_scac: 'EK', trade: 'INDIA - MIDDLE EAST (AIR)', service_type: 'AIR_GEN', currency: 'USD', tier: 'STANDARD', active: true },
  ],
  surcharge_rules: [
    { code: 'SUR-PSS-2026Q1', name: 'Peak Season Surcharge Q1 2026', applies_to_modes: ['OCEAN_FCL', 'OCEAN_LCL'], amount_usd_20gp: 200, amount_usd_40hc: 350, active: true },
    { code: 'SUR-WAR-REDSEA-2026', name: 'Red Sea / Suez War Risk Surcharge', applies_to_modes: ['OCEAN_FCL', 'OCEAN_LCL'], amount_usd_20gp: 450, amount_usd_40hc: 700, active: true },
    { code: 'SUR-CONG-JNPT-2026', name: 'JNPT Port Congestion Surcharge', applies_to_modes: ['OCEAN_FCL'], amount_usd_20gp: 75, amount_usd_40hc: 120, active: true },
  ],
  margin_policies: [
    { code: 'MP-GLOBAL', name: 'Global Fallback Margin Policy', target_margin_pct: 18, floor_margin_pct: 8, ceiling_margin_pct: 40, active: true },
    { code: 'MP-OCEAN-FCL', name: 'Ocean FCL Standard Margin', target_margin_pct: 15, floor_margin_pct: 6, ceiling_margin_pct: 35, active: true },
    { code: 'MP-AIR', name: 'Air Freight Margin Policy', target_margin_pct: 22, floor_margin_pct: 10, ceiling_margin_pct: 45, active: true },
    { code: 'MP-TIER-GOLD', name: 'Gold Customer Reduced Margin', target_margin_pct: 12, floor_margin_pct: 5, ceiling_margin_pct: 30, active: true },
  ],
  container_types: [
    { code: '20GP', name: '20ft General Purpose', teu: 1, internal_cbm: 33.2, max_payload_kg: 21800, is_reefer: false, active: true },
    { code: '40GP', name: '40ft General Purpose', teu: 2, internal_cbm: 67.7, max_payload_kg: 26600, is_reefer: false, active: true },
    { code: '40HC', name: '40ft High Cube', teu: 2, internal_cbm: 76.4, max_payload_kg: 28800, is_reefer: false, active: true },
    { code: '20RF', name: '20ft Reefer', teu: 1, internal_cbm: 28.3, max_payload_kg: 21000, is_reefer: true, active: true },
  ],
}
