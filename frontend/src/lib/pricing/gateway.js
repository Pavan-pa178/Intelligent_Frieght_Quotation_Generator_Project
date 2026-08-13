import { GATEWAYS } from './constants'

/**
 * Resolves a search string (city name, port code, airport IATA, country) to candidate ports / airports / rail ICDs / road hubs
 * @param {string} query 
 * @param {string} mode - OCEAN | AIR | GROUND_RAIL | EXPRESS_AIR | ALL
 * @returns {Array} List of matching gateway records
 */
export function resolveGateway(query, mode = 'OCEAN') {
  const q = (query || '').toLowerCase().trim()

  return GATEWAYS.filter(g => {
    // Mode match check
    let matchesMode = true
    if (mode === 'OCEAN') {
      matchesMode = g.type === 'PORT'
    } else if (mode === 'AIR' || mode === 'EXPRESS_AIR') {
      matchesMode = g.type === 'AIRPORT'
    } else if (mode === 'GROUND_RAIL') {
      // Ground & Rail can take cargo from Ports, Airports, Rail ICDs, and Road Hubs
      matchesMode = true
    }

    if (!matchesMode) return false
    if (!q) return true

    // Fuzzy search check across all fields
    const code = (g.code || '').toLowerCase()
    const name = (g.name || '').toLowerCase()
    const city = (g.city || '').toLowerCase()
    const country = (g.country || '').toLowerCase()
    const countryCode = (g.countryCode || '').toLowerCase()

    const matchesText = (
      code.includes(q) ||
      name.includes(q) ||
      city.includes(q) ||
      country.includes(q) ||
      countryCode === q
    )

    return matchesText
  })
}

export function getGatewayByCode(code) {
  if (!code) return null
  const target = code.toUpperCase().trim()
  return GATEWAYS.find(g => (g.code || '').toUpperCase() === target)
}

export function getAllGateways() {
  return GATEWAYS
}
