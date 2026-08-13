import { seedShipments, seedQuotes, routeAnalytics, demoUser, adminUser, agentUser, RATES } from './mockData'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
export const MOCK_MODE = !API_BASE

const TOKEN_KEY = 'portline_access_token'
const QUOTES_STORAGE_KEY = 'portline_saved_quotes'
const USERS_STORAGE_KEY = 'portline_registered_users'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

function delay(ms = 30) {
  return new Promise((resolve) => setTimeout(resolve, Math.min(ms, 50)))
}

async function apiFetch(path, options = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 4000)

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        ...(options.headers || {}),
      },
    })
    clearTimeout(timeoutId)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.detail || `Request failed (${res.status})`)
    }
    return res.status === 204 ? null : res.json()
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your backend connection.')
    }
    if (err.name === 'TypeError' || (err.message && err.message.includes('fetch'))) {
      throw new Error('Failed to connect to backend server. Operating in offline mode.')
    }
    throw err
  }
}

// ---------------- Auth ----------------

export const BUILTIN_USERS = {
  'admin@portline.in': { password: 'admin123', user: adminUser },
  'agent@portline.in': { password: 'agent123', user: agentUser },
  'demo@portline.in': { password: 'demo123', user: demoUser },
  'ravi@sharmatextiles.in': { password: 'demo123', user: demoUser },
}

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function getMockUsers() {
  const stored = getStoredUsers()
  return { ...stored, ...BUILTIN_USERS }
}

function saveMockUser(email, userData) {
  try {
    const stored = getStoredUsers()
    stored[email.trim().toLowerCase()] = userData
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(stored))
  } catch (err) {
    console.error('Failed to save mock user:', err)
  }
}

export async function loginRequest({ email, password }) {
  const cleanEmail = (email || '').trim().toLowerCase()
  const cleanPw = (password || '').trim()
  if (!cleanEmail || !cleanPw) throw new Error('Email and password are required')

  // Helper for local mock authentication check
  const tryLocalAuth = () => {
    // 1. Direct built-in account check
    if (BUILTIN_USERS[cleanEmail]) {
      const target = BUILTIN_USERS[cleanEmail]
      if (cleanPw === target.password || cleanPw.toLowerCase() === target.password.toLowerCase()) {
        setToken('mock_jwt_token_' + Date.now())
        return target.user
      } else {
        throw new Error('Invalid password. Please check your credentials.')
      }
    }

    // 2. User accounts saved from signup in localStorage
    const storedUsers = getStoredUsers()
    const foundKey = Object.keys(storedUsers).find(k => k.trim().toLowerCase() === cleanEmail)
    const found = foundKey ? storedUsers[foundKey] : null
    
    if (found) {
      const storedPw = (typeof found === 'object' ? (found.password || found.user?.password || '') : '').trim()
      const userObj = found.user || found
      
      if (storedPw && storedPw !== cleanPw && storedPw.toLowerCase() !== cleanPw.toLowerCase()) {
        throw new Error('Invalid password. Please check your credentials.')
      }
      setToken('mock_jwt_token_' + Date.now())
      return userObj
    }

    throw new Error('No account found with this email. Please click "Create account" tab to sign up first.')
  }

  if (MOCK_MODE) {
    await delay(30)
    return tryLocalAuth()
  }

  try {
    const data = await apiFetch('/api/v1/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email: cleanEmail, password: cleanPw }),
    })
    setToken(data.access)
    saveMockUser(cleanEmail, { password: cleanPw, user: data.user })
    return data.user
  } catch (err) {
    // If backend connection fails or times out, fallback seamlessly to stored user / built-in user
    if (err.message && (err.message.includes('timed out') || err.message.includes('Failed to fetch') || err.message.includes('network') || err.message.includes('connection'))) {
      try {
        return tryLocalAuth()
      } catch (localErr) {
        throw localErr
      }
    }
    throw err
  }
}

export async function signupRequest({ name, company, email, password }) {
  const cleanEmail = (email || '').trim().toLowerCase()
  const cleanPw = (password || '').trim()
  if (!cleanEmail || !cleanPw) throw new Error('Email and password are required')

  const createLocalUser = () => {
    const users = getMockUsers()
    if (users[cleanEmail]) {
      throw new Error('An account with this email address already exists.')
    }

    const newUser = {
      name: (name || 'New User').trim(),
      company: (company || 'Company').trim(),
      email: cleanEmail,
      role: 'customer',
      phone: '+91 98765 43210',
      since: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }

    saveMockUser(cleanEmail, { password: cleanPw, user: newUser })
    setToken('mock_jwt_token_' + Date.now())
    return newUser
  }

  if (MOCK_MODE) {
    await delay(30)
    return createLocalUser()
  }

  try {
    const data = await apiFetch('/api/v1/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ name: (name || '').trim(), company: (company || '').trim(), email: cleanEmail, password: cleanPw }),
    })
    setToken(data.access)
    saveMockUser(cleanEmail, { password: cleanPw, user: data.user })
    return data.user
  } catch (err) {
    // If backend is unreachable or times out, fallback to local registration
    if (err.message && (err.message.includes('timed out') || err.message.includes('Failed to fetch') || err.message.includes('network') || err.message.includes('connection'))) {
      return createLocalUser()
    }
    throw err
  }
}

export function logoutRequest() {
  clearToken()
  return Promise.resolve()
}

// ---------------- Shipments ----------------

export async function fetchShipments(email) {
  if (MOCK_MODE) {
    await delay(20)
    const emailLower = (email || '').toLowerCase().trim()
    if (!emailLower || emailLower === 'ravi@sharmatextiles.in' || emailLower === 'demo@portline.in') {
      return seedShipments
    }
    try {
      const raw = localStorage.getItem(`portline_shipments_${emailLower}`)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }
  const query = email ? `?email=${encodeURIComponent(email)}` : ''
  return apiFetch(`/api/v1/shipments/${query}`)
}

export async function createShipmentRequest(payload) {
  if (MOCK_MODE) {
    await delay(30)
    return { ...payload, date: new Date().toISOString().slice(0, 10) }
  }
  return apiFetch('/api/v1/shipments/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function trackShipmentRequest(trackingNumber, localShipments = []) {
  if (MOCK_MODE) {
    await delay(30)
    const all = [...localShipments, ...seedShipments]
    return all.find((s) => s.tn.toLowerCase() === trackingNumber.trim().toLowerCase()) || null
  }
  try {
    return await apiFetch(`/api/v1/shipments/track/${encodeURIComponent(trackingNumber.trim())}/`)
  } catch {
    return null
  }
}

export function getRateTable() {
  return RATES
}

// ---------------- Quotations & Intelligence ----------------

export function getSavedQuotes() {
  try {
    const raw = localStorage.getItem(QUOTES_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export async function saveQuote(quote) {
  const existing = getSavedQuotes()
  const updated = [quote, ...existing.filter(q => q.id !== quote.id)]
  localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated))
  if (!MOCK_MODE) {
    try {
      await apiFetch('/api/v1/quotes/', {
        method: 'POST',
        body: JSON.stringify(quote)
      })
    } catch {
      // fallback saved locally
    }
  }
  return quote
}

export async function fetchQuotes(email) {
  if (MOCK_MODE) {
    await delay(20)
    const local = getSavedQuotes()
    return [...local, ...seedQuotes]
  }
  const query = email ? `?email=${encodeURIComponent(email)}` : ''
  return apiFetch(`/api/v1/quotes/${query}`)
}

export async function fetchQuoteById(id) {
  if (MOCK_MODE) {
    await delay(20)
    const all = [...getSavedQuotes(), ...seedQuotes]
    return all.find(q => q.id.toUpperCase() === (id || '').toUpperCase()) || seedQuotes[0]
  }
  return apiFetch(`/api/v1/quotes/${id}/`)
}

export async function fetchRouteAnalytics() {
  if (MOCK_MODE) {
    await delay(20)
    return routeAnalytics
  }
  return apiFetch('/api/v1/routes/analytics/')
}

export async function sendContactMessage(payload) {
  if (MOCK_MODE) {
    await delay(30)
    return { ok: true }
  }
  return apiFetch('/api/v1/contact/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Fetch ALL quotes (for admin panel — all users)
export async function fetchAllQuotes() {
  if (MOCK_MODE) {
    await delay(20)
    const local = getSavedQuotes()
    return [...local, ...seedQuotes]
  }
  return apiFetch('/api/v1/quotes/')
}

// Agent approves or rejects a quote
export async function agentActionOnQuote(quoteId, action, comment, agentUser) {
  const AGENT_ACTIONS_KEY = 'portline_agent_actions'
  const reviewObj = {
    status: action, // 'approved' | 'rejected' | 'pending'
    comment: comment || '',
    agent_name: agentUser?.name || 'Agent',
    agent_email: agentUser?.email || '',
    reviewed_at: new Date().toISOString()
  }

  if (MOCK_MODE) {
    await delay(300)
    // Update saved quotes in localStorage
    const all = getSavedQuotes()
    const updated = all.map(q => q.id === quoteId ? { ...q, agent_review: reviewObj } : q)
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated))
    // Also track in a separate agent actions store
    try {
      const raw = localStorage.getItem(AGENT_ACTIONS_KEY)
      const actions = raw ? JSON.parse(raw) : {}
      actions[quoteId] = reviewObj
      localStorage.setItem(AGENT_ACTIONS_KEY, JSON.stringify(actions))
    } catch {}
    return { ok: true, quoteId, review: reviewObj }
  }

  return apiFetch(`/api/v1/quotes/${quoteId}/action/`, {
    method: 'POST',
    body: JSON.stringify({ action, comment, agent_email: agentUser?.email }),
  })
}

// Get all agent actions from localStorage (mock mode)
export function getAgentActions() {
  try {
    const raw = localStorage.getItem('portline_agent_actions')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// ---------------- Master Database (Admin Only) ----------------
import { FALLBACK_SEED, MASTER_COLLECTIONS_META } from './masterSeedData'

function getLocalMasterCollection(name) {
  const key = `portline_master_${name}`
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {}
  const initial = FALLBACK_SEED[name] || []
  try {
    localStorage.setItem(key, JSON.stringify(initial))
  } catch {}
  return initial
}

function saveLocalMasterCollection(name, items) {
  const key = `portline_master_${name}`
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch {}
}

export async function fetchMasterOverview() {
  if (MOCK_MODE) {
    await delay(30)
    const collections = {}
    let total = 0
    MASTER_COLLECTIONS_META.forEach(m => {
      const items = getLocalMasterCollection(m.key)
      collections[m.key] = {
        count: items.length,
        seed_available: items.length,
        is_empty: items.length === 0,
      }
      total += items.length
    })
    return { collections_count: MASTER_COLLECTIONS_META.length, total_records: total, collections }
  }
  return apiFetch('/api/v1/master/overview/', {
    headers: { 'X-User-Role': 'admin' }
  })
}

export async function fetchMasterCollection(collectionName, params = {}) {
  const { q = '', active = null, page = 1, limit = 100 } = params
  if (MOCK_MODE) {
    await delay(30)
    let items = getLocalMasterCollection(collectionName)
    if (active !== null) {
      items = items.filter(i => i.active === (active === true || active === 'true'))
    }
    if (q) {
      const query = q.toLowerCase()
      items = items.filter(i => {
        return Object.values(i).some(val => 
          typeof val === 'string' && val.toLowerCase().includes(query)
        )
      })
    }
    return {
      collection: collectionName,
      total: items.length,
      page,
      limit,
      items: items.slice((page - 1) * limit, page * limit)
    }
  }
  const searchParams = new URLSearchParams()
  if (q) searchParams.set('q', q)
  if (active !== null) searchParams.set('active', active)
  if (page) searchParams.set('page', page)
  if (limit) searchParams.set('limit', limit)
  const qs = searchParams.toString() ? `?${searchParams.toString()}` : ''
  return apiFetch(`/api/v1/master/${collectionName}/${qs}`, {
    headers: { 'X-User-Role': 'admin' }
  })
}

export async function createMasterRecord(collectionName, recordData) {
  if (MOCK_MODE) {
    await delay(50)
    const items = getLocalMasterCollection(collectionName)
    const newDoc = {
      ...recordData,
      id: 'doc_' + Math.random().toString(36).substr(2, 9),
      active: recordData.active !== false,
      _created_at: new Date().toISOString(),
    }
    items.unshift(newDoc)
    saveLocalMasterCollection(collectionName, items)
    return newDoc
  }
  return apiFetch(`/api/v1/master/${collectionName}/`, {
    method: 'POST',
    headers: { 'X-User-Role': 'admin' },
    body: JSON.stringify(recordData),
  })
}

export async function updateMasterRecord(collectionName, docId, recordData) {
  if (MOCK_MODE) {
    await delay(50)
    const items = getLocalMasterCollection(collectionName)
    const idx = items.findIndex(i => (i.id === docId || i._id === docId || i.locode === docId || i.iata === docId || i.code === docId || i.card_id === docId))
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...recordData, _updated_at: new Date().toISOString() }
      saveLocalMasterCollection(collectionName, items)
      return items[idx]
    }
    throw new Error('Record not found')
  }
  return apiFetch(`/api/v1/master/${collectionName}/${docId}/`, {
    method: 'PUT',
    headers: { 'X-User-Role': 'admin' },
    body: JSON.stringify(recordData),
  })
}

export async function deleteMasterRecord(collectionName, docId, hard = false) {
  if (MOCK_MODE) {
    await delay(50)
    let items = getLocalMasterCollection(collectionName)
    if (hard) {
      items = items.filter(i => !(i.id === docId || i._id === docId || i.locode === docId || i.iata === docId || i.code === docId || i.card_id === docId))
    } else {
      items = items.map(i => {
        if (i.id === docId || i._id === docId || i.locode === docId || i.iata === docId || i.code === docId || i.card_id === docId) {
          return { ...i, active: false, _deleted_at: new Date().toISOString() }
        }
        return i
      })
    }
    saveLocalMasterCollection(collectionName, items)
    return { ok: true, id: docId, hard }
  }
  const qs = hard ? '?hard=true' : ''
  return apiFetch(`/api/v1/master/${collectionName}/${docId}/${qs}`, {
    method: 'DELETE',
    headers: { 'X-User-Role': 'admin' },
  })
}

export async function triggerMasterSeed(drop = false) {
  if (MOCK_MODE) {
    await delay(200)
    MASTER_COLLECTIONS_META.forEach(m => {
      const initial = FALLBACK_SEED[m.key] || []
      localStorage.setItem(`portline_master_${m.key}`, JSON.stringify(initial))
    })
    return { success: true, message: 'Local master seed loaded successfully.' }
  }
  return apiFetch('/api/v1/master/seed/', {
    method: 'POST',
    headers: { 'X-User-Role': 'admin' },
    body: JSON.stringify({ drop }),
  })
}

