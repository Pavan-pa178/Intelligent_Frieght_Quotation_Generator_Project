import { useState, useEffect, useCallback } from 'react'
import {
  Database, RefreshCw, Search, Plus, Trash2, Edit3, CheckCircle2,
  XCircle, AlertCircle, Ship, Plane, Route, Shield, DollarSign,
  TrendingUp, Box, Layers, AlertTriangle, FileText, FileCheck,
  CreditCard, ShieldCheck, Coins, ArrowRightLeft, Globe, Package,
  Files, Users, Check, X, Sparkles, Filter
} from 'lucide-react'
import {
  fetchMasterOverview, fetchMasterCollection, createMasterRecord,
  updateMasterRecord, deleteMasterRecord, triggerMasterSeed
} from '../lib/api'
import { MASTER_COLLECTIONS_META } from '../lib/masterSeedData'
import { useToast } from '../context/ToastContext'

const ICON_MAP = {
  Ship, Plane, Route, Shield, DollarSign, TrendingUp, Box, Layers,
  AlertTriangle, FileText, FileCheck, CreditCard, ShieldCheck,
  Coins, ArrowRightLeft, Globe, Package, Files, Users
}

export default function AdminMasterData() {
  const toast = useToast()
  const [selectedCol, setSelectedCol] = useState('ports')
  const [overview, setOverview] = useState(null)
  const [items, setItems] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all') // 'all' | 'active' | 'inactive'
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [modalJson, setModalJson] = useState('')
  const [jsonError, setJsonError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load overview
  const loadOverview = useCallback(async () => {
    try {
      const res = await fetchMasterOverview()
      setOverview(res)
    } catch {
      // ignore
    }
  }, [])

  // Load current collection
  const loadCollection = useCallback(async (colKey = selectedCol, q = searchQuery, act = activeFilter) => {
    setLoading(true)
    try {
      const params = { q: q.trim(), limit: 200 }
      if (act === 'active') params.active = true
      if (act === 'inactive') params.active = false
      const res = await fetchMasterCollection(colKey, params)
      setItems(res?.items || [])
      setTotalCount(res?.total || 0)
    } catch {
      toast(`Failed to load ${colKey} collection`)
    } finally {
      setLoading(false)
    }
  }, [selectedCol, searchQuery, activeFilter, toast])

  useEffect(() => {
    loadOverview()
  }, [loadOverview])

  useEffect(() => {
    loadCollection(selectedCol, searchQuery, activeFilter)
  }, [selectedCol, searchQuery, activeFilter, loadCollection])

  const handleSeed = async (drop = false) => {
    const confirmMsg = drop 
      ? "Reset and re-seed all 19 collections with fresh real-world data?"
      : "Populate all 19 collections with real-world master data?"
    if (!window.confirm(confirmMsg)) return

    setSeeding(true)
    try {
      await triggerMasterSeed(drop)
      toast("Master database seeded successfully!")
      await loadOverview()
      await loadCollection()
    } catch (e) {
      toast("Seeding failed: " + (e.message || "error"))
    } finally {
      setSeeding(false)
    }
  }

  const handleToggleActive = async (item) => {
    const docId = item.id || item._id || item.locode || item.iata || item.code || item.card_id
    const newActiveState = !item.active
    try {
      await updateMasterRecord(selectedCol, docId, { active: newActiveState })
      setItems(prev => prev.map(i => (i === item ? { ...i, active: newActiveState } : i)))
      toast(`Record ${newActiveState ? 'activated' : 'deactivated'}`)
    } catch {
      toast("Failed to update status")
    }
  }

  const handleDelete = async (item, hard = false) => {
    const docId = item.id || item._id || item.locode || item.iata || item.code || item.card_id
    if (!window.confirm(`Are you sure you want to ${hard ? 'permanently delete' : 'deactivate'} this record?`)) return

    try {
      await deleteMasterRecord(selectedCol, docId, hard)
      toast(hard ? "Record permanently deleted" : "Record deactivated")
      loadCollection()
      loadOverview()
    } catch {
      toast("Failed to delete record")
    }
  }

  const openAddModal = () => {
    setEditItem(null)
    setJsonError('')
    // Template from first item or sample structure
    const sample = items[0] ? { ...items[0] } : { code: 'NEW', name: 'Sample Name', active: true }
    delete sample.id
    delete sample._id
    delete sample._created_at
    delete sample._updated_at
    delete sample._created_by
    setModalJson(JSON.stringify(sample, null, 2))
    setShowAddModal(true)
  }

  const openEditModal = (item) => {
    setEditItem(item)
    setJsonError('')
    const clean = { ...item }
    delete clean.id
    delete clean._id
    delete clean._created_at
    delete clean._updated_at
    delete clean._created_by
    setModalJson(JSON.stringify(clean, null, 2))
    setShowAddModal(true)
  }

  const handleSaveModal = async () => {
    setJsonError('')
    let parsed
    try {
      parsed = JSON.parse(modalJson)
    } catch (err) {
      setJsonError("Invalid JSON: " + err.message)
      return
    }

    setIsSubmitting(true)
    try {
      if (editItem) {
        const docId = editItem.id || editItem._id || editItem.locode || editItem.iata || editItem.code || editItem.card_id
        await updateMasterRecord(selectedCol, docId, parsed)
        toast("Record updated successfully")
      } else {
        await createMasterRecord(selectedCol, parsed)
        toast("New record added to " + selectedCol)
      }
      setShowAddModal(false)
      loadCollection()
      loadOverview()
    } catch (err) {
      setJsonError(err.message || "Failed to save record")
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentColMeta = MASTER_COLLECTIONS_META.find(m => m.key === selectedCol) || MASTER_COLLECTIONS_META[0]
  const ColIcon = ICON_MAP[currentColMeta.icon] || Database

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Stats */}
      <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy text-white">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-navy">Master Database Control Hub</h3>
                <p className="text-xs text-brand-slate">
                  Centralized, production-grade master data for all 19 global freight collections in MongoDB Atlas.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSeed(false)}
              disabled={seeding}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-cloud px-4 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-line/60 transition-colors"
            >
              <Sparkles className={`h-3.5 w-3.5 text-amber-500 ${seeding ? 'animate-spin' : ''}`} />
              {seeding ? 'Seeding...' : 'Seed Master DB'}
            </button>
            <button
              onClick={() => handleSeed(true)}
              disabled={seeding}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Re-seed & Reset
            </button>
            <button
              onClick={() => { loadOverview(); loadCollection(); }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-brand-line bg-white px-3.5 py-2 text-xs font-semibold text-brand-slate hover:text-brand-navy transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Global Stats bar */}
        {overview && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-brand-line pt-4 text-xs">
            <div>
              <span className="text-brand-slateLight">Collections Active:</span>
              <div className="font-mono text-sm font-bold text-brand-navy">{overview.collections_count} Collections</div>
            </div>
            <div>
              <span className="text-brand-slateLight">Total Global Records:</span>
              <div className="font-mono text-sm font-bold text-emerald-600">
                {overview.total_records > 0 ? overview.total_records.toLocaleString() : 'Ready to seed'}
              </div>
            </div>
            <div>
              <span className="text-brand-slateLight">Selected Collection:</span>
              <div className="font-mono text-sm font-bold text-brand-marine">{selectedCol}</div>
            </div>
            <div>
              <span className="text-brand-slateLight">Collection Records:</span>
              <div className="font-mono text-sm font-bold text-brand-navy">{totalCount} items</div>
            </div>
          </div>
        )}
      </div>

      {/* Collection Navigation Tabs (Pill Grid) */}
      <div className="rounded-2xl border border-brand-line bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-slate">
            Select Master Collection (19)
          </span>
          <span className="text-[11px] text-brand-slateLight">
            Click any collection to view, search, and manage records
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1">
          {MASTER_COLLECTIONS_META.map(col => {
            const Icon = ICON_MAP[col.icon] || Database
            const isSelected = selectedCol === col.key
            const count = overview?.collections?.[col.key]?.count
            return (
              <button
                key={col.key}
                onClick={() => setSelectedCol(col.key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'bg-brand-cloud/70 text-brand-slate hover:bg-brand-line/60 hover:text-brand-navy'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{col.label}</span>
                {count !== undefined && (
                  <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-brand-line text-brand-slate'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Collection Table & Actions */}
      <div className="rounded-2xl border border-brand-line bg-white shadow-sm">
        
        {/* Table Header Controls */}
        <div className="flex flex-col gap-3 border-b border-brand-line p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ColIcon className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-brand-navy text-base">{currentColMeta.label}</h4>
                <span className="rounded-full bg-brand-cloud px-2.5 py-0.5 font-mono text-[11px] font-semibold text-brand-slate">
                  {totalCount} records
                </span>
              </div>
              <p className="text-xs text-brand-slateLight">{currentColMeta.desc}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-brand-slateLight" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Search in ${currentColMeta.label}...`}
                className="w-48 sm:w-60 rounded-xl border border-brand-line pl-8 pr-3 py-1.5 text-xs text-brand-navy focus:border-brand-marine focus:outline-none"
              />
            </div>

            {/* Active Filter */}
            <div className="flex items-center rounded-xl border border-brand-line p-0.5 text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`rounded-lg px-2.5 py-1 font-semibold ${activeFilter === 'all' ? 'bg-brand-navy text-white' : 'text-brand-slate'}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('active')}
                className={`rounded-lg px-2.5 py-1 font-semibold ${activeFilter === 'active' ? 'bg-emerald-600 text-white' : 'text-brand-slate'}`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveFilter('inactive')}
                className={`rounded-lg px-2.5 py-1 font-semibold ${activeFilter === 'inactive' ? 'bg-red-600 text-white' : 'text-brand-slate'}`}
              >
                Inactive
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-marine px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-marine/90 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Record
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-xs text-brand-slate">
              <RefreshCw className="mr-2 h-4 w-4 animate-spin text-brand-marine" /> Loading records...
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <Database className="mx-auto mb-2 h-8 w-8 text-brand-slateLight opacity-50" />
              <p className="text-sm font-semibold text-brand-navy">No records found</p>
              <p className="text-xs text-brand-slate">Try clicking "Seed Master DB" above to populate real-world data.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-line bg-brand-cloud/40 text-[11px] uppercase tracking-wider text-brand-slate">
                  <th className="px-4 py-3 font-semibold">Identifier / Key</th>
                  <th className="px-4 py-3 font-semibold">Primary Details</th>
                  <th className="px-4 py-3 font-semibold">Specifications / Attributes</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-line/50">
                {items.map((item, idx) => {
                  const keyVal = item.code || item.locode || item.iata || item.scac || item.card_id || item.lane_code || item.hs6 || item.iso_code || `Item #${idx + 1}`
                  const nameVal = item.name || item.desc || item.trade || item.category || ''
                  const subVal = item.city ? `${item.city}, ${item.country}` : item.country || item.mode || item.category || ''
                  
                  return (
                    <tr key={item.id || item._id || idx} className="hover:bg-brand-cloud/30 transition-colors">
                      
                      {/* Key */}
                      <td className="px-4 py-3 font-mono font-bold text-brand-marine whitespace-nowrap">
                        {keyVal}
                      </td>

                      {/* Primary Details */}
                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-semibold text-brand-navy text-[13px] line-clamp-1">{nameVal || keyVal}</div>
                        {subVal && <div className="text-[11px] text-brand-slate">{subVal}</div>}
                      </td>

                      {/* Dynamic Details / Specs */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {Object.entries(item)
                            .filter(([k]) => !['_id', 'id', 'active', 'name', 'code', 'locode', 'iata', 'scac', 'desc', '_created_at', '_updated_at', '_created_by'].includes(k))
                            .slice(0, 4)
                            .map(([k, v]) => (
                              <span key={k} className="inline-flex items-center rounded-md bg-brand-cloud px-2 py-0.5 text-[10px] text-brand-slate">
                                <strong className="mr-1 text-brand-navy">{k}:</strong> {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                              </span>
                            ))}
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(item)}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border transition-colors ${
                            item.active !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                          }`}
                        >
                          {item.active !== false ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {item.active !== false ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(item)}
                            title="Edit record JSON"
                            className="rounded-lg p-1.5 text-brand-slate hover:bg-brand-cloud hover:text-brand-navy"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item, false)}
                            title="Soft delete / deactivate"
                            className="rounded-lg p-1.5 text-brand-slate hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit JSON Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-brand-line bg-white shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-brand-line px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy text-white">
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-navy">
                    {editItem ? 'Edit Master Record' : `Add New Record to '${selectedCol}'`}
                  </h4>
                  <p className="text-[11px] text-brand-slate">Direct schema format matching MongoDB Atlas collection.</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1.5 text-brand-slate hover:bg-brand-cloud"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6">
              {jsonError && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{jsonError}</span>
                </div>
              )}

              <label className="mb-1.5 block text-xs font-semibold text-brand-navy">
                Document JSON Payload
              </label>
              <textarea
                rows={12}
                value={modalJson}
                onChange={e => setModalJson(e.target.value)}
                className="w-full rounded-xl border border-brand-line p-3 font-mono text-xs text-brand-navy bg-slate-900 text-emerald-400 focus:outline-none focus:border-brand-marine"
                spellCheck={false}
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-brand-line bg-brand-cloud/40 px-6 py-3.5">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-brand-line bg-white px-4 py-2 text-xs font-semibold text-brand-slate hover:bg-brand-cloud"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy px-5 py-2 text-xs font-semibold text-white hover:bg-brand-marine transition-colors"
              >
                {isSubmitting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                {editItem ? 'Save Changes' : 'Create Record'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
