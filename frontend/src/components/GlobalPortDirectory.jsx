import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Ship, Plane, Globe, MapPin, Anchor,
  Compass, ArrowRight, CheckCircle2, Filter, X,
  Route, Truck, Layers
} from 'lucide-react'
import { GATEWAYS } from '../lib/pricing/constants'

const REGIONS = [
  { key: 'ALL', label: 'All Regions' },
  { key: 'IN', label: 'India & South Asia' },
  { key: 'ME', label: 'Middle East & Gulf' },
  { key: 'APAC', label: 'Asia-Pacific' },
  { key: 'EU', label: 'Europe' },
  { key: 'NA', label: 'North America' },
  { key: 'LATAM', label: 'South America' },
  { key: 'AFRICA', label: 'Africa' },
  { key: 'OCEANIA', label: 'Australia & NZ' },
]

function getRegionKey(countryCode) {
  const code = (countryCode || '').toUpperCase()
  if (['IN', 'LK', 'BD', 'PK'].includes(code)) return 'IN'
  if (['AE', 'SA', 'OM', 'QA', 'KW', 'BH'].includes(code)) return 'ME'
  if (['SG', 'MY', 'TH', 'VN', 'ID', 'PH', 'CN', 'HK', 'TW', 'KR', 'JP'].includes(code)) return 'APAC'
  if (['NL', 'BE', 'DE', 'GB', 'FR', 'ES', 'IT', 'GR', 'TR', 'PL', 'CH', 'AT'].includes(code)) return 'EU'
  if (['US', 'CA', 'MX'].includes(code)) return 'NA'
  if (['BR', 'AR', 'CL', 'PE', 'CO'].includes(code)) return 'LATAM'
  if (['EG', 'MA', 'ZA', 'KE', 'TZ', 'NG', 'GH', 'DJ', 'ET'].includes(code)) return 'AFRICA'
  if (['AU', 'NZ'].includes(code)) return 'OCEANIA'
  return 'OTHER'
}

export default function GlobalPortDirectory({ onSelectPort, isModal = false, activeMode = 'ALL', onClose }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const getInitialModeFilter = () => {
    if (activeMode === 'OCEAN') return 'PORT'
    if (activeMode === 'AIR' || activeMode === 'EXPRESS_AIR') return 'AIRPORT'
    return 'ALL'
  }

  const [modeFilter, setModeFilter] = useState(getInitialModeFilter())
  const [regionFilter, setRegionFilter] = useState('ALL')

  const isOceanMode = activeMode === 'OCEAN'
  const isAirMode = activeMode === 'AIR' || activeMode === 'EXPRESS_AIR'

  const filteredGateways = useMemo(() => {
    const q = search.toLowerCase().trim()
    return GATEWAYS.filter(g => {
      // Mode lock checks if invoked from specific freight mode
      if (isOceanMode && g.type !== 'PORT') return false
      if (isAirMode && g.type !== 'AIRPORT') return false

      // Tab filter match
      if (modeFilter !== 'ALL' && g.type !== modeFilter) return false

      // Region match
      if (regionFilter !== 'ALL' && getRegionKey(g.countryCode) !== regionFilter) return false

      // Search query match
      if (!q) return true
      const code = (g.code || '').toLowerCase()
      const name = (g.name || '').toLowerCase()
      const city = (g.city || '').toLowerCase()
      const country = (g.country || '').toLowerCase()
      const countryCode = (g.countryCode || '').toLowerCase()

      return (
        code.includes(q) ||
        name.includes(q) ||
        city.includes(q) ||
        country.includes(q) ||
        countryCode === q
      )
    })
  }, [search, modeFilter, regionFilter, isOceanMode, isAirMode])

  const portsCount = GATEWAYS.filter(g => g.type === 'PORT').length
  const airportsCount = GATEWAYS.filter(g => g.type === 'AIRPORT').length
  const railCount = GATEWAYS.filter(g => g.type === 'RAIL_TERMINAL').length
  const roadCount = GATEWAYS.filter(g => g.type === 'ROAD_HUB').length

  const handleSelect = (g, asOrigin = true) => {
    let sMode = 'ocean'
    if (g.type === 'AIRPORT') sMode = 'air'
    else if (g.type === 'RAIL_TERMINAL') sMode = 'rail'
    else if (g.type === 'ROAD_HUB') sMode = 'ground'

    if (onSelectPort) {
      onSelectPort(g, asOrigin)
      if (onClose) onClose()
    } else {
      navigate(`/ship?${asOrigin ? 'origin' : 'dest'}=${g.code}&service=${sMode}`)
    }
  }

  const getTypeMeta = (type) => {
    switch (type) {
      case 'AIRPORT':
        return { label: 'AIRPORT', icon: Plane, color: 'bg-amber-50 text-amber-700 border-amber-200' }
      case 'RAIL_TERMINAL':
        return { label: 'RAIL ICD', icon: Route, color: 'bg-purple-50 text-purple-700 border-purple-200' }
      case 'ROAD_HUB':
        return { label: 'ROAD HUB', icon: Truck, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
      default:
        return { label: 'SEA PORT', icon: Ship, color: 'bg-blue-50 text-blue-700 border-blue-200' }
    }
  }

  return (
    <div className={`rounded-2xl border border-brand-line bg-white shadow-sm overflow-hidden ${isModal ? 'max-w-4xl w-full' : ''}`}>
      
      {/* Header */}
      <div className="border-b border-brand-line bg-brand-cloud/40 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy text-white shadow-xs">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-navy">
                {isOceanMode ? 'Commercial Sea Port Directory' : isAirMode ? 'International Air Cargo Hub Directory' : 'Global Freight Gateway Directory'}
              </h3>
              <p className="text-xs text-brand-slate">
                {isOceanMode 
                  ? `Search and select from ${portsCount} commercial sea ports worldwide.` 
                  : isAirMode 
                    ? `Search and select from ${airportsCount} international air cargo hubs worldwide.`
                    : `Explore ${GATEWAYS.length} multimodal hubs: Sea Ports (${portsCount}), Cargo Airports (${airportsCount}), Rail ICDs (${railCount}), and Road Cross-Dock Hubs (${roadCount}).`
                }
              </p>
            </div>
          </div>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-brand-slate hover:bg-brand-cloud hover:text-brand-navy transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Search Bar & Filters */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-brand-slateLight" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={
                isOceanMode 
                  ? "Search sea port name, city, UN/LOCODE, or country... e.g. JNPT, Rotterdam, Singapore"
                  : isAirMode 
                    ? "Search airport name, IATA code, city, or country... e.g. BOM, DXB, Frankfurt, JFK"
                    : "Search port, airport, rail ICD, road hub, UN/LOCODE, IATA, city... e.g. JNPT, Dadri, FRA, Bhiwandi"
              }
              className="w-full rounded-xl border border-brand-line pl-10 pr-9 py-2.5 text-xs text-brand-navy bg-white focus:border-brand-marine focus:outline-none shadow-xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-slateLight/20 text-brand-slate text-xs hover:bg-brand-slateLight/40"
              >
                ×
              </button>
            )}
          </div>

          {/* Type filters (only show multi-tabs if not locked to single mode) */}
          {!isOceanMode && !isAirMode && (
            <div className="flex flex-wrap items-center rounded-xl border border-brand-line bg-white p-1 text-xs shadow-xs">
              <button
                onClick={() => setModeFilter('ALL')}
                className={`rounded-lg px-2.5 py-1.5 font-semibold transition-colors ${modeFilter === 'ALL' ? 'bg-brand-navy text-white' : 'text-brand-slate hover:text-brand-navy'}`}
              >
                All ({GATEWAYS.length})
              </button>
              <button
                onClick={() => setModeFilter('PORT')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-semibold transition-colors ${modeFilter === 'PORT' ? 'bg-brand-marine text-white' : 'text-brand-slate hover:text-brand-navy'}`}
              >
                <Ship className="h-3.5 w-3.5" /> Ports ({portsCount})
              </button>
              <button
                onClick={() => setModeFilter('AIRPORT')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-semibold transition-colors ${modeFilter === 'AIRPORT' ? 'bg-amber-600 text-white' : 'text-brand-slate hover:text-brand-navy'}`}
              >
                <Plane className="h-3.5 w-3.5" /> Airports ({airportsCount})
              </button>
              <button
                onClick={() => setModeFilter('RAIL_TERMINAL')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-semibold transition-colors ${modeFilter === 'RAIL_TERMINAL' ? 'bg-purple-600 text-white' : 'text-brand-slate hover:text-brand-navy'}`}
              >
                <Route className="h-3.5 w-3.5" /> Rail ICDs ({railCount})
              </button>
              <button
                onClick={() => setModeFilter('ROAD_HUB')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-semibold transition-colors ${modeFilter === 'ROAD_HUB' ? 'bg-emerald-600 text-white' : 'text-brand-slate hover:text-brand-navy'}`}
              >
                <Truck className="h-3.5 w-3.5" /> Road Hubs ({roadCount})
              </button>
            </div>
          )}

        </div>

        {/* Region Filter Pills */}
        <div className="mt-3 flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {REGIONS.map(reg => (
            <button
              key={reg.key}
              onClick={() => setRegionFilter(reg.key)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                regionFilter === reg.key
                  ? 'bg-brand-slate text-white'
                  : 'bg-white border border-brand-line text-brand-slate hover:bg-brand-cloud'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>

      </div>

      {/* Results List */}
      <div className="p-4 sm:p-6 max-h-[480px] overflow-y-auto">
        <div className="mb-3 flex items-center justify-between text-xs text-brand-slate">
          <span>Found <strong>{filteredGateways.length}</strong> matching gateways</span>
          {search && <span className="text-brand-marine font-medium">Filtering by "{search}"</span>}
        </div>

        {filteredGateways.length === 0 ? (
          <div className="py-12 text-center text-xs text-brand-slate">
            <Globe className="mx-auto mb-2 h-8 w-8 text-brand-slateLight opacity-40" />
            <p className="font-semibold text-brand-navy">No matching gateways found</p>
            <p className="text-brand-slateLight">Try searching by city (e.g. "Mumbai", "Frankfurt", "Chicago") or UN/LOCODE.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGateways.map(g => {
              const meta = getTypeMeta(g.type)
              const Icon = meta.icon
              return (
                <div
                  key={g.code}
                  className="group flex flex-col justify-between rounded-xl border border-brand-line bg-white p-4 transition-all hover:border-brand-marine hover:shadow-sm"
                >
                  <div>
                    {/* Top Row: Code and Type Badge */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-sm font-bold text-brand-marine bg-brand-marinePale px-2 py-0.5 rounded-md">
                        {g.code}
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${meta.color}`}>
                        <Icon className="h-3 w-3" />
                        {meta.label}
                      </span>
                    </div>

                    {/* Name & Location */}
                    <h4 className="font-bold text-brand-navy text-[13px] line-clamp-1 group-hover:text-brand-marine transition-colors">
                      {g.name}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-brand-slate mt-0.5">
                      <MapPin className="h-3 w-3 text-brand-slateLight flex-shrink-0" />
                      <span>{g.city}, {g.country}</span>
                    </div>

                    {/* Lat / Lon */}
                    {g.lat && g.lon && (
                      <div className="mt-2 text-[10.5px] font-mono text-brand-slateLight flex items-center gap-1">
                        <Compass className="h-3 w-3" /> {g.lat.toFixed(2)}°N, {g.lon.toFixed(2)}°E
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-3.5 pt-3 border-t border-brand-line/60 flex items-center gap-2">
                    <button
                      onClick={() => handleSelect(g, true)}
                      className="flex-1 rounded-lg bg-brand-cloud py-1.5 text-center text-[11px] font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
                    >
                      Ship Origin
                    </button>
                    <button
                      onClick={() => handleSelect(g, false)}
                      className="flex-1 rounded-lg bg-brand-marinePale py-1.5 text-center text-[11px] font-bold text-brand-marine hover:bg-brand-marine hover:text-white transition-colors"
                    >
                      Ship Destination
                    </button>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
