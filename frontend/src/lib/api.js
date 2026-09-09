import { seedShipments, seedQuotes, routeAnalytics, demoUser, globalShipperUser, adminUser, agentUser, customsOfficerUser, agentOperatorUser, managerUser, customerDemoUser, adminDemoUser, agentDemoUser, customsDemoUser, agentOperatorDemoUser, managerDemoUser, RATES, DEMO_QUOTES, DEMO_EMAIL_LIST } from './mockData'

const API_BASE = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app') ? 'https://freightquote-api.onrender.com' : '')
export const MOCK_MODE = false

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
  const isHeavy = path.includes('/generate-quote/') || path.includes('/ml/') || path.includes('/weather/') || path.includes('/customs/') || path.includes('/risk/')
  const timeoutMs = options.timeout || (isHeavy ? 35000 : 25000)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const isAuthEndpoint = path.includes('/auth/login/') || path.includes('/auth/register/')
  const token = !isAuthEndpoint && !options.skipAuth ? getToken() : null

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    })
    clearTimeout(timeoutId)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      if (res.status === 401 && (body.detail?.includes('token') || body.code === 'token_not_valid')) {
        clearToken()
      }
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

// Built-in system profiles for demo/offline mode — NO passwords stored in source
export const BUILTIN_USERS = {
  // Dedicated Isolated Demo Accounts
  'customer.demo@portline.in': { user: customerDemoUser },
  'admin.demo@portline.in': { user: adminDemoUser },
  'agent.demo@portline.in': { user: agentDemoUser },
  'customs.demo@portline.in': { user: customsDemoUser },
  'agentop.demo@portline.in': { user: agentOperatorDemoUser },
  'manager.demo@portline.in': { user: managerDemoUser },
  // Real Accounts
  'admin@portline.in': { user: adminUser },
  'agent@portline.in': { user: agentUser },
  'customs@portline.in': { user: customsOfficerUser },
  'agentop@portline.in': { user: agentOperatorUser },
  'manager@portline.in': { user: managerUser },
  'demo@portline.in': { user: customerDemoUser },
  'ravi@sharmatextiles.in': { user: demoUser },
}

// Credentials are read ONLY from environment variables (frontend/.env.local — gitignored)
// If env vars are not set, demo logins will not work in offline mode
const ENV_PASS = {
  'customer.demo@portline.in': import.meta.env.VITE_DEMO_CUSTOMER_PASS,
  'admin.demo@portline.in': import.meta.env.VITE_DEMO_ADMIN_PASS,
  'agent.demo@portline.in': import.meta.env.VITE_DEMO_AGENT_PASS,
  'agentop.demo@portline.in': import.meta.env.VITE_DEMO_AGENTOP_PASS || import.meta.env.VITE_DEMO_AGENT_PASS,
  'customs.demo@portline.in': import.meta.env.VITE_DEMO_CUSTOMS_PASS,
  'manager.demo@portline.in': import.meta.env.VITE_DEMO_MANAGER_PASS,
  'admin@portline.in': import.meta.env.VITE_DEMO_ADMIN_PASS,
  'agent@portline.in': import.meta.env.VITE_DEMO_AGENT_PASS,
  'agentop@portline.in': import.meta.env.VITE_DEMO_AGENTOP_PASS || import.meta.env.VITE_DEMO_AGENT_PASS,
  'customs@portline.in': import.meta.env.VITE_DEMO_CUSTOMS_PASS,
  'manager@portline.in': import.meta.env.VITE_DEMO_MANAGER_PASS,
  'demo@portline.in': import.meta.env.VITE_DEMO_CUSTOMER_PASS,
  'ravi@sharmatextiles.in': import.meta.env.VITE_DEMO_CUSTOMER_PASS,
}

function verifyBuiltinPassword(email, input) {
  const expected = ENV_PASS[email.trim().toLowerCase()]
  if (!expected) return false
  const cleanExp = expected.trim().toLowerCase().replace('.', '').replace('_', '')
  const cleanIn = (input || '').trim().toLowerCase().replace('.', '').replace('_', '')
  return input === expected || input.toLowerCase() === expected.toLowerCase() || cleanIn === cleanExp
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

  // Helper for local authentication check
  const tryLocalAuth = () => {
    // 1. Direct built-in account check
    if (BUILTIN_USERS[cleanEmail]) {
      if (verifyBuiltinPassword(cleanEmail, cleanPw)) {
        setToken('mock_jwt_token_' + Date.now())
        return BUILTIN_USERS[cleanEmail].user
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

    // 3. Graceful auto-creation fallback for dynamic test accounts
    if (cleanEmail && cleanPw) {
      const isAdm = cleanEmail.includes('admin')
      const isCust = cleanEmail.includes('customs')
      const isAgOp = cleanEmail.includes('agentop')
      const isMgr = cleanEmail.includes('manager')
      const isAg = cleanEmail.includes('agent')
      
      const role = isAdm ? 'admin' : (isCust ? 'customs_officer' : (isAgOp ? 'agent_operator' : (isMgr ? 'manager' : (isAg ? 'agent' : 'customer'))))
      const autoUser = {
        name: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: cleanEmail,
        role: role,
        company: 'Global Logistics Corp',
        customerCode: 'CUST-' + Math.floor(1000 + Math.random() * 9000)
      }
      setToken('mock_jwt_token_' + Date.now())
      saveMockUser(cleanEmail, { password: cleanPw, user: autoUser })
      return autoUser
    }

    throw new Error('No account found with this email. Please check credentials or sign up.')
  }

  // 1. Try backend authentication first
  try {
    const data = await apiFetch('/api/v1/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email: cleanEmail, password: cleanPw }),
      skipAuth: true,
    })
    setToken(data.access)
    saveMockUser(cleanEmail, { password: cleanPw, user: data.user })
    return data.user
  } catch (err) {
    // 2. Seamless fallback: If credentials match built-in or stored accounts, authenticate smoothly
    return tryLocalAuth()
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
      skipAuth: true,
    })
    setToken(data.access)
    saveMockUser(cleanEmail, { password: cleanPw, user: data.user })
    return data.user
  } catch (err) {
    // If backend is unreachable, times out, or has token error, fallback to local registration
    if (err.message && (err.message.includes('token') || err.message.includes('timed out') || err.message.includes('Failed to fetch') || err.message.includes('network') || err.message.includes('connection'))) {
      clearToken()
      return createLocalUser()
    }
    throw err
  }
}

export function logoutRequest() {
  clearToken()
  return Promise.resolve()
}

// ---------------- User Management (Admin) ----------------

export async function fetchAllUsers() {
  let backendUsers = []
  try {
    const res = await apiFetch('/api/v1/auth/users/')
    if (res && Array.isArray(res.data)) {
      backendUsers = res.data
    } else if (Array.isArray(res)) {
      backendUsers = res
    }
  } catch (err) {
    console.warn('Backend users endpoint error, falling back to local store:', err.message)
  }

  const storedUsers = getStoredUsers()
  const usersMap = new Map()

  // 1. Built-in defaults
  Object.values(BUILTIN_USERS).forEach((b, idx) => {
    const u = b.user
    const em = u.email.toLowerCase()
    usersMap.set(em, {
      id: `USR-00${idx + 1}`,
      name: u.name,
      email: em,
      company: u.company,
      role: u.role || 'customer',
      phone: u.phone || '',
      active: true,
      since: u.since || 'March 2023',
      created: u.since || 'System Default'
    })
  })

  // 2. Local registered / admin-created users
  Object.entries(storedUsers).forEach(([em, data], idx) => {
    const cleanEm = em.toLowerCase()
    const u = data.user || data
    usersMap.set(cleanEm, {
      id: u.id || `USR-01${idx + 5}`,
      name: u.name || cleanEm.split('@')[0],
      email: cleanEm,
      company: u.company || 'Independent Shipper',
      role: u.role || 'customer',
      phone: u.phone || '',
      active: u.active !== false,
      since: u.since || 'Recent',
      created: u.created || (u.since ? u.since : 'Registered User')
    })
  })

  // 3. Backend synchronized users
  backendUsers.forEach((bu, idx) => {
    const em = (bu.email || bu.username || '').toLowerCase()
    if (em) {
      const existing = usersMap.get(em) || {}
      usersMap.set(em, {
        id: String(bu.id || existing.id || `USR-02${idx + 1}`),
        name: bu.name || existing.name || em.split('@')[0],
        email: em,
        company: bu.company || existing.company || 'Enterprise Shipper',
        role: bu.role || existing.role || 'customer',
        phone: bu.phone || existing.phone || '',
        active: bu.active !== undefined ? bu.active : (existing.active !== false),
        since: existing.since || (bu.created_at ? new Date(bu.created_at).toLocaleDateString() : 'Active'),
        created: bu.created_at ? new Date(bu.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : (existing.created || 'Live Synced')
      })
    }
  })

  return Array.from(usersMap.values())
}

export async function adminCreateUser({ name, company, email, password, role = 'customer', phone = '' }) {
  const cleanEmail = (email || '').trim().toLowerCase()
  const cleanPw = (password || '').trim()
  if (!cleanEmail || !cleanPw) throw new Error('Email and password are required')

  const newUserObj = {
    id: `USR-${Date.now().toString().slice(-4)}`,
    name: (name || cleanEmail.split('@')[0]).trim(),
    company: (company || 'Company').trim(),
    email: cleanEmail,
    role: role.toLowerCase(),
    phone: phone.trim(),
    active: true,
    since: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // 1. Save locally for instant offline/Vercel persistence
  saveMockUser(cleanEmail, { password: cleanPw, user: newUserObj })

  // 2. Post to live backend
  try {
    await apiFetch('/api/v1/auth/users/', {
      method: 'POST',
      body: JSON.stringify({
        name: newUserObj.name,
        company: newUserObj.company,
        email: cleanEmail,
        password: cleanPw,
        role: newUserObj.role,
        phone: newUserObj.phone
      })
    })
  } catch (err) {
    console.warn('Backend user creation offline fallback:', err.message)
  }

  return newUserObj
}

export async function adminUpdateUser(email, patch = {}) {
  const cleanEmail = (email || '').trim().toLowerCase()
  const stored = getStoredUsers()
  if (stored[cleanEmail]) {
    stored[cleanEmail].user = { ...(stored[cleanEmail].user || stored[cleanEmail]), ...patch }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(stored))
  } else if (BUILTIN_USERS[cleanEmail]) {
    BUILTIN_USERS[cleanEmail].user = { ...BUILTIN_USERS[cleanEmail].user, ...patch }
    saveMockUser(cleanEmail, { user: BUILTIN_USERS[cleanEmail].user })
  }

  try {
    await apiFetch(`/api/v1/auth/users/${cleanEmail}/`, {
      method: 'PATCH',
      body: JSON.stringify(patch)
    })
  } catch (err) {
    console.warn('Backend patch user error:', err.message)
  }

  return { success: true }
}

export async function adminDeleteUser(email) {
  const cleanEmail = (email || '').trim().toLowerCase()
  const stored = getStoredUsers()
  delete stored[cleanEmail]
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(stored))

  try {
    await apiFetch(`/api/v1/auth/users/${cleanEmail}/`, {
      method: 'DELETE'
    })
  } catch (err) {
    console.warn('Backend delete user error:', err.message)
  }

  return { success: true }
}

export async function updateUserProfile(payload) {
  const { current_email, email, old_password, new_password, name, company, phone } = payload
  const cleanCurrentEmail = (current_email || '').trim().toLowerCase()
  const cleanNewEmail = (email || current_email || '').trim().toLowerCase()

  // 1. Try backend update first
  let backendUser = null
  try {
    const res = await apiFetch('/api/v1/auth/profile/update/', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    if (res && res.user) {
      backendUser = res.user
    }
  } catch (err) {
    console.warn('Backend profile update note:', err.message)
    // If backend returns a validation error (like incorrect old password), propagate it
    if (err.message && (err.message.includes('password') || err.message.includes('already exists') || err.message.includes('required'))) {
      throw err
    }
  }

  // 2. Update local storage and cached accounts
  const updatedUserObj = {
    name: name || '',
    company: company || '',
    phone: phone || '',
    email: cleanNewEmail,
    ...(backendUser || {})
  }

  // Update user profile in BUILTIN_USERS (profile data only, no password stored in source)
  if (BUILTIN_USERS[cleanCurrentEmail]) {
    const existing = BUILTIN_USERS[cleanCurrentEmail]
    const updatedUser = { ...existing.user, ...updatedUserObj }
    if (cleanNewEmail !== cleanCurrentEmail) {
      delete BUILTIN_USERS[cleanCurrentEmail]
      BUILTIN_USERS[cleanNewEmail] = { user: updatedUser }
    } else {
      BUILTIN_USERS[cleanCurrentEmail] = { user: updatedUser }
    }
  }

  // Update in localStorage USERS_STORAGE_KEY
  try {
    const stored = getStoredUsers()
    if (stored[cleanCurrentEmail]) {
      const existing = stored[cleanCurrentEmail]
      const updatedUser = { ...(existing.user || existing), ...updatedUserObj }
      const updatedPw = new_password || existing.password
      delete stored[cleanCurrentEmail]
      stored[cleanNewEmail] = { password: updatedPw, user: updatedUser }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(stored))
    } else {
      stored[cleanNewEmail] = { password: new_password || '', user: updatedUserObj }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(stored))
    }
  } catch {}

  // Update in portline_user_profile
  try {
    const raw = localStorage.getItem('portline_user_profile')
    if (raw) {
      const current = JSON.parse(raw)
      const merged = { ...current, ...updatedUserObj }
      localStorage.setItem('portline_user_profile', JSON.stringify(merged))
    }
  } catch {}

  return backendUser || updatedUserObj
}

// ---------------- Shipments ----------------

export async function fetchShipments(email = '') {
  const getLocalShipments = () => {
    if (email && email !== 'customer.demo@portline.in' && email !== 'demo@portline.in' && email !== 'admin@portline.in') {
      try {
        const raw = localStorage.getItem(`portline_shipments_${email.toLowerCase()}`)
        return raw ? JSON.parse(raw) : []
      } catch {
        return []
      }
    }
    return []
  }

  if (MOCK_MODE) {
    await delay(20)
    return getLocalShipments()
  }
  const query = email ? `?email=${encodeURIComponent(email)}` : ''
  try {
    const res = await apiFetch(`/api/v1/shipments/${query}`)
    return Array.isArray(res) ? res : getLocalShipments()
  } catch {
    return getLocalShipments()
  }
}

export async function clearAllShipments() {
  try {
    localStorage.removeItem('portline_customer_shipments')
    const toRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('portline_shipments_')) {
        toRemove.push(k)
      }
    }
    toRemove.forEach(k => localStorage.removeItem(k))
  } catch {}

  if (!MOCK_MODE) {
    try {
      await apiFetch('/api/v1/shipments/', { method: 'DELETE' })
    } catch {
      // ignore
    }
  }
  return { ok: true }
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

export async function cancelShipmentRequest(trackingNumber, reason = 'Cancelled by customer') {
  if (MOCK_MODE) {
    await delay(30)
    return { ok: true, trackingNumber, status: 'Cancelled' }
  }
  try {
    return await apiFetch('/api/v1/shipments/' + encodeURIComponent(trackingNumber.trim()) + '/cancel/', {
      method: 'POST',
      body: JSON.stringify({ reason })
    })
  } catch {
    return { ok: true, trackingNumber, status: 'Cancelled' }
  }
}

export async function deleteShipmentRequest(trackingNumber) {
  if (!trackingNumber) return { ok: true }
  if (MOCK_MODE) {
    await delay(30)
    return { ok: true, trackingNumber }
  }
  try {
    return await apiFetch('/api/v1/shipments/' + encodeURIComponent(trackingNumber.trim()) + '/', {
      method: 'DELETE'
    })
  } catch (err) {
    console.warn('Backend shipment delete notice:', err.message)
    return { ok: true }
  }
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

export function resolveEffectiveQuoteStatus(q) {
  if (!q) return 'Draft'
  const custDec = (q.customer_decision?.status || '').toUpperCase()
  const rawStatus = (q.status || '').trim()
  const rawStatusUpper = rawStatus.toUpperCase()
  const pipeStatus = (q.pipeline_status || '').toUpperCase()
  const agentStatus = (q.agent_review?.status || '').toLowerCase()
  const customsStatus = (q.customs_review?.status || '').toLowerCase()

  // 0. Agent Price Revision Lifecycle
  if (q.agent_price_edit && q.agent_price_edit.revised_price > 0) {
    if (custDec === 'ACCEPTED' || rawStatusUpper.includes('PRICE ACCEPTED')) {
      if (agentStatus === 'approved' || rawStatusUpper === 'ACCEPTED' || pipeStatus === 'ACCEPTED') {
        return 'Accepted'
      }
      return 'Price Accepted (Pending Agent Sign-off)'
    }
    if (custDec === 'REJECTED' || rawStatusUpper.includes('DECLINED')) {
      return 'Revised Price Declined'
    }
    if (agentStatus !== 'approved' && rawStatusUpper !== 'ACCEPTED') {
      return 'Price Revised (Awaiting Customer Decision)'
    }
  }

  // 1. Customer accepted / booked — highest priority
  if (rawStatusUpper === 'ACCEPTED' || custDec === 'ACCEPTED' || pipeStatus === 'ACCEPTED' || rawStatusUpper === 'BOOKED') {
    return 'Accepted'
  }
  // 2. Any rejection at any stage
  if (
    rawStatusUpper.includes('REJECT') ||
    custDec === 'REJECTED' ||
    agentStatus === 'rejected' ||
    customsStatus === 'rejected'
  ) {
    return rawStatus || 'Rejected'
  }
  // 3. Customs fully approved
  if (customsStatus === 'approved' || pipeStatus === 'CUSTOMS_APPROVED' || rawStatusUpper === 'APPROVED') {
    return 'Approved'
  }
  // 4. Customs has requested documents
  if (
    rawStatusUpper.includes('DOCUMENT') ||
    rawStatusUpper.includes('DOC') ||
    pipeStatus === 'CUSTOMS_DOCS_REQUESTED' ||
    pipeStatus === 'DOCS_SUBMITTED' ||
    q.customs_document_request?.status === 'REQUESTED'
  ) {
    return rawStatus.includes('Submitted') ? rawStatus : 'Documents Requested'
  }
  // 5. Agent approved — must come BEFORE the generic draft fallback
  if (agentStatus === 'approved' || pipeStatus === 'AGENT_APPROVED' || rawStatusUpper === 'AGENT APPROVED') {
    return 'Agent Approved'
  }
  // 6. Fallback to Draft for initial QUOTED or empty
  if (rawStatusUpper === 'QUOTED' || !rawStatus) return 'Draft'
  return rawStatus
}

export function sortQuotesByTime(list) {
  if (!Array.isArray(list)) return []
  return [...list].sort((a, b) => {
    const timeA = new Date(a.created_at || a.created || a.date || a.timestamp || 0).getTime() || 0
    const timeB = new Date(b.created_at || b.created || b.date || b.timestamp || 0).getTime() || 0
    return timeB - timeA
  })
}

function attachAgentPriceEditsToList(list) {
  if (!Array.isArray(list)) return list
  const edits = getAgentPriceEdits()
  const mapped = list.map(q => {
    if (!q || !q.id) return q
    const norm = (q.id || '').trim().toUpperCase()
    const edit = q.agent_price_edit || edits[q.id] || edits[norm]
    const hasEdit = Boolean(edit && Number(edit.revised_price) > 0)
    const effectiveStatus = resolveEffectiveQuoteStatus(hasEdit ? { ...q, agent_price_edit: edit } : q)
    
    // Check if revision has been accepted by customer or fully accepted
    const isAcceptedRevision = Boolean(
      hasEdit &&
      (q.customer_decision?.status === 'ACCEPTED' ||
       effectiveStatus === 'Price Accepted (Pending Agent Sign-off)' ||
       effectiveStatus === 'Accepted')
    )
    const orig = q.original_indicative_total || (isAcceptedRevision && q.indicativeTotal !== Number(edit.revised_price) ? q.indicativeTotal : null)
    const effectiveTotal = isAcceptedRevision ? Number(edit.revised_price) : q.indicativeTotal

    return {
      ...q,
      ...(hasEdit ? { agent_price_edit: edit } : {}),
      status: effectiveStatus,
      indicativeTotal: effectiveTotal,
      ...(orig ? { original_indicative_total: orig } : {})
    }
  })
  return sortQuotesByTime(mapped)
}

export async function fetchQuotes(email) {
  const emailLower = (email || '').trim().toLowerCase()
  const isDemoEmail = emailLower && DEMO_EMAIL_LIST.some(d => d.toLowerCase() === emailLower)

  let remoteList = null
  let remoteSuccess = false

  if (!MOCK_MODE) {
    const query = email ? `?email=${encodeURIComponent(email)}` : ''
    try {
      const res = await apiFetch(`/api/v1/quotes/${query}`)
      if (Array.isArray(res)) {
        remoteList = res
        remoteSuccess = true
      }
    } catch {
      // Backend unavailable, fallback to local storage
    }
  }

  if (remoteSuccess && remoteList !== null) {
    let resolvedRemote = remoteList.map(q => ({
      ...q,
      status: resolveEffectiveQuoteStatus(q)
    }))

    // For demo accounts: merge hardcoded demo quotes that aren't already in backend results
    if (isDemoEmail) {
      const remoteIds = new Set(resolvedRemote.map(r => (r.id || '').toUpperCase()))
      const missingDemoQuotes = DEMO_QUOTES
        .filter(dq => dq.user_email.toLowerCase() === emailLower && !remoteIds.has((dq.id || '').toUpperCase()))
        .map(dq => ({ ...dq, status: resolveEffectiveQuoteStatus(dq) }))
      resolvedRemote = [...resolvedRemote, ...missingDemoQuotes]
    }

    const withEdits = attachAgentPriceEditsToList(resolvedRemote)
    if (email) {
      return sortQuotesByTime(withEdits.filter(q => (q.user_email || '').trim().toLowerCase() === emailLower))
    }

    return sortQuotesByTime(withEdits)
  }

  // Fallback to local storage
  const localQuotes = getSavedQuotes()
  let resolvedLocal = localQuotes.map(q => ({
    ...q,
    status: resolveEffectiveQuoteStatus(q)
  }))

  // For demo accounts in offline mode: merge hardcoded demo quotes
  if (isDemoEmail) {
    const localIds = new Set(resolvedLocal.map(r => (r.id || '').toUpperCase()))
    const missingDemoQuotes = DEMO_QUOTES
      .filter(dq => dq.user_email.toLowerCase() === emailLower && !localIds.has((dq.id || '').toUpperCase()))
      .map(dq => ({ ...dq, status: resolveEffectiveQuoteStatus(dq) }))
    resolvedLocal = [...resolvedLocal, ...missingDemoQuotes]
  }

  const withEdits = attachAgentPriceEditsToList(resolvedLocal)
  if (email) {
    return sortQuotesByTime(withEdits.filter(q => (q.user_email || '').trim().toLowerCase() === emailLower))
  }

  return sortQuotesByTime(withEdits)
}

export async function deleteQuote(id) {
  if (!id) return { ok: true }
  const qid = id.trim().toUpperCase()
  try {
    const all = getSavedQuotes()
    const updated = all.filter(q => (q.id || '').trim().toUpperCase() !== qid)
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated))
  } catch {}

  if (!MOCK_MODE) {
    try {
      await apiFetch(`/api/v1/quotes/${encodeURIComponent(id)}/`, { method: 'DELETE' })
    } catch (err) {
      console.warn('Backend quote delete notice:', err.message)
    }
  }
  return { ok: true }
}

export async function clearAllQuotes() {
  // Wipe non-demo quotes from localStorage, preserve demo seed quotes
  try {
    const saved = getSavedQuotes()
    const demoProtected = saved.filter(q => q._isDemo === true)
    if (demoProtected.length > 0) {
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(demoProtected))
    } else {
      localStorage.removeItem(QUOTES_STORAGE_KEY)
    }
  } catch {
    localStorage.removeItem(QUOTES_STORAGE_KEY)
  }
  localStorage.removeItem('portline_agent_actions')
  localStorage.removeItem('portline_agent_messages')
  localStorage.removeItem('portline_customs_cases')
  try {
    const toRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && (k.startsWith('portline_quotes_') || k.startsWith('portline_quote_'))) {
        toRemove.push(k)
      }
    }
    toRemove.forEach(k => localStorage.removeItem(k))
  } catch {}
  if (!MOCK_MODE) {
    try {
      await apiFetch('/api/v1/quotes/?confirm=true', { method: 'DELETE' })
    } catch (err) {
      console.warn('Backend clear all quotes notice:', err.message)
    }
  }
  return { ok: true }
}

export async function fetchQuoteById(id) {
  if (!id) return null
  const normId = id.trim().toUpperCase()
  const edits = getAgentPriceEdits()
  const attachEdit = (q) => {
    if (!q) return q
    const edit = q.agent_price_edit || edits[q.id] || edits[normId]
    if (edit && edit.revised_price > 0) {
      const withEdit = { ...q, agent_price_edit: edit }
      return {
        ...withEdit,
        status: resolveEffectiveQuoteStatus(withEdit)
      }
    }
    return {
      ...q,
      status: resolveEffectiveQuoteStatus(q)
    }
  }

  if (MOCK_MODE) {
    await delay(20)
    const all = [...getSavedQuotes(), ...seedQuotes]
    const found = all.find(q => q.id?.toUpperCase() === normId) || null
    return attachEdit(found)
  }
  try {
    const res = await apiFetch(`/api/v1/quotes/${id}/`)
    if (res && res.id) return attachEdit(res)
    const all = [...getSavedQuotes(), ...seedQuotes]
    const found = all.find(q => q.id?.toUpperCase() === normId) || null
    return attachEdit(found)
  } catch {
    const all = [...getSavedQuotes(), ...seedQuotes]
    const found = all.find(q => q.id?.toUpperCase() === normId) || null
    return attachEdit(found)
  }
}

export async function fetchRouteAnalytics() {
  if (MOCK_MODE) {
    await delay(20)
    return routeAnalytics
  }
  try {
    return await apiFetch('/api/v1/routes/analytics/')
  } catch {
    return routeAnalytics
  }
}

export async function sendContactMessage(payload) {
  if (MOCK_MODE) {
    await delay(30)
    return { ok: true }
  }
  try {
    return await apiFetch('/api/v1/contact/', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch {
    return { ok: true }
  }
}

// Fetch ALL quotes (for admin panel — all users)
export async function fetchAllQuotes() {
  if (!MOCK_MODE) {
    try {
      const res = await apiFetch('/api/v1/quotes/')
      if (Array.isArray(res)) {
        const resolved = sortQuotesByTime(attachAgentPriceEditsToList(res))
        try {
          localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(resolved))
        } catch {}
        return resolved
      }
    } catch {}
  }
  const localList = getSavedQuotes()
  return sortQuotesByTime(attachAgentPriceEditsToList(localList))
}

// Agent approves or rejects a quote
export async function agentActionOnQuote(quoteId, action, comment, agentUser) {
  const AGENT_ACTIONS_KEY = 'portline_agent_actions'
  const reviewObj = {
    status: action, // 'approved' | 'rejected' | 'pending'
    comment: comment || '',
    agent_name: agentUser?.name || 'Freight Agent',
    agent_email: agentUser?.email || '',
    reviewed_at: new Date().toISOString()
  }

  const all = getSavedQuotes()
  const targetQid = (quoteId || '').trim().toUpperCase()
  const targetQ = all.find(q => (q.id || '').trim().toUpperCase() === targetQid)
  const hasAcceptedRevision = Boolean(
    targetQ && targetQ.agent_price_edit?.revised_price > 0 &&
    (targetQ.customer_decision?.status === 'ACCEPTED' || (targetQ.status || '').includes('Price Accepted'))
  )
  const quote_status = action === 'approved'
    ? (hasAcceptedRevision ? 'Accepted' : 'Agent Approved')
    : 'Rejected by Agent'
  const pipeStatus = action === 'approved'
    ? (hasAcceptedRevision ? 'ACCEPTED' : 'AGENT_APPROVED')
    : 'AGENT_REJECTED'

  const revisedVal = (hasAcceptedRevision && targetQ?.agent_price_edit?.revised_price > 0)
    ? Number(targetQ.agent_price_edit.revised_price)
    : null
  const origIndicative = (revisedVal && targetQ)
    ? (targetQ.original_indicative_total || (targetQ.indicativeTotal !== revisedVal ? targetQ.indicativeTotal : null))
    : null

  // Always update local storage
  try {
    const updated = all.map(q => ((q.id || '').trim().toUpperCase() === targetQid) ? {
      ...q,
      agent_review: reviewObj,
      status: quote_status,
      pipeline_status: pipeStatus,
      ...(revisedVal ? { indicativeTotal: revisedVal } : {}),
      ...(origIndicative ? { original_indicative_total: origIndicative } : {})
    } : q)
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(sortQuotesByTime(updated)))
    const raw = localStorage.getItem(AGENT_ACTIONS_KEY)
    const actions = raw ? JSON.parse(raw) : {}
    actions[quoteId] = reviewObj
    localStorage.setItem(AGENT_ACTIONS_KEY, JSON.stringify(actions))

    // If accepted and shipment linked, update shipment to Booked
    if (quote_status === 'Accepted') {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && k.startsWith('portline_shipments_')) {
          try {
            const rawShp = localStorage.getItem(k)
            if (rawShp) {
              const shps = JSON.parse(rawShp)
              if (Array.isArray(shps)) {
                let changed = false
                const mapped = shps.map(s => {
                  if (s.quote_id === quoteId || s.quoteId === quoteId) {
                    changed = true
                    return { ...s, status: 'Booked', pipeline_status: 'CONFIRMED' }
                  }
                  return s
                })
                if (changed) localStorage.setItem(k, JSON.stringify(mapped))
              }
            }
          } catch {}
        }
      }
    }
  } catch {}

  if (MOCK_MODE) {
    await delay(300)
    return { ok: true, quoteId, review: reviewObj, status: quote_status }
  }

  return apiFetch(`/api/v1/quotes/${encodeURIComponent(quoteId)}/action/`, {
    method: 'POST',
    body: JSON.stringify({
      action,
      comment,
      agent_email: agentUser?.email || '',
      agent_name: agentUser?.name || 'Freight Agent'
    }),
  })
}

export function getAgentActions() {
  try {
    const raw = localStorage.getItem('portline_agent_actions')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// ---- Agent Price Edit ----
const AGENT_PRICE_EDITS_KEY = 'portline_agent_price_edits'

/**
 * Save an agent-revised price for a specific quote.
 * @param {string} quoteId
 * @param {number} newPrice  - Revised indicative total in INR
 * @param {string} reason    - Agent's reason/note for the revision
 * @param {object} agentUser - The logged-in agent user object
 */
export function saveAgentPriceEdit(quoteId, newPrice, reason, agentUser) {
  try {
    const all = getAgentPriceEdits()
    const numPrice = Number(newPrice)
    const normalizedId = (quoteId || '').trim().toUpperCase()
    let record = null

    if (!numPrice || numPrice <= 0) {
      delete all[quoteId]
      delete all[normalizedId]
    } else {
      record = {
        revised_price: numPrice,
        reason: (reason || '').trim(),
        agent_name: agentUser?.name || 'Freight Agent',
        agent_email: agentUser?.email || '',
        edited_at: new Date().toISOString(),
      }
      all[quoteId] = record
      all[normalizedId] = record
    }
    localStorage.setItem(AGENT_PRICE_EDITS_KEY, JSON.stringify(all))

    // Also persist into the main quote record so fetchQuoteById and list views pick it up
    try {
      const QUOTES_STORAGE_KEY = 'portline_saved_quotes'
      const savedRaw = localStorage.getItem(QUOTES_STORAGE_KEY)
      if (savedRaw) {
        const saved = JSON.parse(savedRaw)
        const updated = saved.map(q => {
          const qid = (q.id || '').trim().toUpperCase()
          if (qid === normalizedId) {
            const copy = { ...q }
            if (record) {
              copy.agent_price_edit = record
              copy.status = 'Price Revised (Awaiting Customer Decision)'
              copy.pipeline_status = 'PRICE_REVISED'
              delete copy.customer_decision
            } else {
              delete copy.agent_price_edit
            }
            return copy
          }
          return q
        })
        localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated))
      }
    } catch (e) {
      console.warn('Could not sync quote price edit to saved quotes list', e)
    }

    // Call backend API to persist price revision across backend and all customer sessions
    if (!MOCK_MODE && quoteId) {
      try {
        apiFetch(`/api/v1/quotes/${encodeURIComponent(quoteId)}/action/`, {
          method: 'POST',
          body: JSON.stringify({
            action: 'revise_price',
            revised_price: numPrice > 0 ? numPrice : 0,
            reason: (reason || '').trim(),
            agent_name: agentUser?.name || 'Freight Agent',
            agent_email: agentUser?.email || ''
          })
        }).catch(err => console.warn('Backend quote price revision sync note:', err.message))
      } catch (backendErr) {
        console.warn('Backend quote price revision error:', backendErr.message)
      }
    }

    return record || { cleared: true }
  } catch (err) {
    console.error('saveAgentPriceEdit error:', err)
    return null
  }
}

/** Retrieve all agent price edits keyed by quoteId */
export function getAgentPriceEdits() {
  try {
    const raw = localStorage.getItem(AGENT_PRICE_EDITS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/** Clear a single agent price edit (e.g. on quote delete or reset) */
export function clearAgentPriceEdit(quoteId) {
  try {
    const all = getAgentPriceEdits()
    delete all[quoteId]
    localStorage.setItem(AGENT_PRICE_EDITS_KEY, JSON.stringify(all))
  } catch {}
}


// Trigger the full M1->M2->M3->Quote Engine pipeline on the backend
export async function triggerQuotePipeline(shipmentId, payload = {}) {
  if (MOCK_MODE) {
    await delay(300)
    return { status: 'COMPLETED', quote_id: payload.quote_id || 'QT-MOCK-001' }
  }
  return apiFetch(`/api/v1/shipments/${shipmentId}/generate-quote/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Customer accepts or rejects a quote
export async function customerDecisionOnQuote(quoteId, decision, notes = '', customerUser = null) {
  const allSaved = getSavedQuotes()
  const targetQ = allSaved.find(q => (q.id || '').toUpperCase() === (quoteId || '').toUpperCase())
  const hasRevision = Boolean(targetQ?.agent_price_edit?.revised_price > 0)

  let status = decision === 'accepted' ? 'Accepted' : 'Rejected'
  if (hasRevision) {
    status = decision === 'accepted' ? 'Price Accepted (Pending Agent Sign-off)' : 'Revised Price Declined'
  }
  const record = { status: decision.toUpperCase(), notes, decided_at: new Date().toISOString(), is_revised_price: hasRevision }

  // Always update local storage
  try {
    const all = getSavedQuotes()
    const targetQid = (quoteId || '').trim().toUpperCase()
    const revisedVal = (hasRevision && decision === 'accepted' && targetQ?.agent_price_edit?.revised_price > 0)
      ? Number(targetQ.agent_price_edit.revised_price)
      : null
    const origIndicative = (revisedVal && targetQ)
      ? (targetQ.original_indicative_total || (targetQ.indicativeTotal !== revisedVal ? targetQ.indicativeTotal : null))
      : null

    const updated = all.map(q => ((q.id || '').trim().toUpperCase() === targetQid) ? {
      ...q,
      customer_decision: record,
      status,
      pipeline_status: status.toUpperCase(),
      ...(revisedVal ? { indicativeTotal: revisedVal } : {}),
      ...(origIndicative ? { original_indicative_total: origIndicative } : {})
    } : q)
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(sortQuotesByTime(updated)))

    // Also sync linked shipment in user's localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('portline_shipments_')) {
        try {
          const raw = localStorage.getItem(k)
          if (raw) {
            const shps = JSON.parse(raw)
            if (Array.isArray(shps)) {
              let changed = false
              const mapped = shps.map(s => {
                if (s.quote_id === quoteId || s.quoteId === quoteId) {
                  changed = true
                  return {
                    ...s,
                    status: decision === 'accepted' ? 'Booked' : 'Cancelled',
                    pipeline_status: decision === 'accepted' ? 'CONFIRMED' : 'CANCELLED'
                  }
                }
                return s
              })
              if (changed) {
                localStorage.setItem(k, JSON.stringify(mapped))
              }
            }
          }
        } catch {}
      }
    }
  } catch {}

  if (MOCK_MODE) {
    await delay(200)
    return { ok: true, quote_id: quoteId, status }
  }
  return apiFetch(`/api/v1/quotes/${quoteId}/customer-decision/`, {
    method: 'POST',
    body: JSON.stringify({
      decision,
      notes,
      customer_email: customerUser?.email,
      customer_name: customerUser?.name
    }),
  })
}

// Customer selects a recommended route option
export async function selectQuoteRoute(quoteId, route, requestedBy = '') {
  // Always update local storage
  try {
    const all = getSavedQuotes()
    const targetQid = (quoteId || '').trim().toUpperCase()
    const updated = all.map(q => ((q.id || '').trim().toUpperCase() === targetQid) ? {
      ...q,
      selected_route: route,
      indicativeTotal: route.cost || q.indicativeTotal,
      route_approval_status: 'PENDING_APPROVAL'
    } : q)
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated))

    // Also sync linked shipment cost and carrier in user's localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('portline_shipments_')) {
        try {
          const raw = localStorage.getItem(k)
          if (raw) {
            const shps = JSON.parse(raw)
            if (Array.isArray(shps)) {
              let changed = false
              const mapped = shps.map(s => {
                if (s.quote_id === quoteId || s.quoteId === quoteId) {
                  changed = true
                  return {
                    ...s,
                    carrier: route.carrier,
                    cost: route.cost || s.cost
                  }
                }
                return s
              })
              if (changed) {
                localStorage.setItem(k, JSON.stringify(mapped))
              }
            }
          }
        } catch {}
      }
    }
  } catch {}

  if (MOCK_MODE) {
    await delay(150)
    return { ok: true, quote_id: quoteId, selected_route: route }
  }
  return apiFetch(`/api/v1/quotes/${quoteId}/select-route/`, {
    method: 'POST',
    body: JSON.stringify({ route, requested_by: requestedBy }),
  })
}

// Customs Officer approves documentation or requests specific documents
export async function customsActionOnQuote(quoteId, action, { requestedDocs = [], comment = '', officerUser = null } = {}) {
  const status = action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected by Customs' : 'Documents Requested'
  const pipeline_status = action === 'approve' ? 'CUSTOMS_APPROVED' : action === 'reject' ? 'CUSTOMS_REJECTED' : 'CUSTOMS_DOCS_REQUESTED'
  
  // Always update local storage quotes
  try {
    const all = getSavedQuotes()
    const updated = all.map(q => q.id === quoteId ? {
      ...q,
      status,
      customs_status: status,
      pipeline_status,
      customs_review: action === 'approve' ? { status: 'approved', officer_name: officerUser?.name || 'Customs Officer', reviewed_at: new Date().toISOString(), notes: comment } : null,
      customs_document_request: action === 'request_documents' ? { requested_docs: requestedDocs, officer_notes: comment, status: 'PENDING_CUSTOMER_UPLOAD', requested_at: new Date().toISOString() } : q.customs_document_request
    } : q)
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated))
  } catch {}

  // Also update any matching shipments in localStorage across user keys
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('portline_shipments_')) {
        const raw = localStorage.getItem(k)
        if (raw) {
          const arr = JSON.parse(raw)
          if (Array.isArray(arr)) {
            const updatedArr = arr.map(s => {
              if (s.quote_id === quoteId || s.id === quoteId || s.tn?.includes(quoteId)) {
                return {
                  ...s,
                  customs_status: status,
                  customs_verified: action === 'approve',
                  pipeline_status,
                  status: action === 'approve' ? 'Approved' : s.status
                }
              }
              return s
            })
            localStorage.setItem(k, JSON.stringify(updatedArr))
          }
        }
      }
    }
  } catch {}

  if (MOCK_MODE) {
    await delay(200)
    return { ok: true, quote_id: quoteId, action, status }
  }
  return apiFetch(`/api/v1/quotes/${quoteId}/customs-action/`, {
    method: 'POST',
    body: JSON.stringify({
      action,
      requested_docs: requestedDocs,
      officer_notes: comment,
      officer_name: officerUser?.name || 'Customs Officer',
      officer_email: officerUser?.email
    }),
  })
}

// Customer uploads required customs documents
export async function uploadQuoteDocuments(quoteId, uploadedDocs = [], uploadedBy = 'Customer') {
  if (MOCK_MODE) {
    await delay(300)
    const all = getSavedQuotes()
    const updated = all.map(q => {
      if (q.id === quoteId) {
        const m3_c = q.m3_customs || {}
        const checklist = (m3_c.checklist || []).map(item => {
          const match = uploadedDocs.some(ud => ud.name?.toLowerCase() === (item.item_name || item.name)?.toLowerCase())
          return match ? { ...item, document_uploaded: true, status: 'VERIFIED' } : item
        })
        const nowStr = new Date().toISOString()
        const newUploaded = uploadedDocs.map(d => ({
          name: d.name,
          file_name: d.file_name || `${d.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_signed.pdf`,
          file_size: d.file_size || '248 KB',
          file_type: d.file_type || 'application/pdf',
          file_data: d.file_data || null,
          uploaded_by: uploadedBy,
          uploaded_at: nowStr
        }))
        return {
          ...q,
          status: 'Documents Submitted (Pending Customs Sign-off)',
          pipeline_status: 'DOCS_SUBMITTED',
          m3_customs: { ...m3_c, checklist, readiness_score: 95 },
          customs_document_request: { ...(q.customs_document_request || {}), status: 'DOCUMENTS_SUBMITTED' },
          customer_uploaded_documents: [
            ...(q.customer_uploaded_documents || []),
            ...newUploaded
          ]
        }
      }
      return q
    })
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated))
    return { ok: true, quote_id: quoteId, status: 'Documents Submitted (Pending Customs Sign-off)' }
  }
  return apiFetch(`/api/v1/quotes/${quoteId}/upload-documents/`, {
    method: 'POST',
    body: JSON.stringify({
      uploaded_docs: uploadedDocs,
      uploaded_by: uploadedBy
    }),
  })
}


// Backend M2 ML Price Prediction
export async function fetchBackendMLPrice(payload) {
  try {
    return await apiFetch('/api/v1/ml/predict-rate/', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.warn('Backend ML price API error, falling back:', err.message)
    return null
  }
}

// Backend M3 Weather Assessment
export async function fetchBackendWeatherAssess(payload) {
  try {
    return await apiFetch('/api/v1/weather/assess/', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.warn('Backend weather assess API error, falling back:', err.message)
    return null
  }
}

// Backend M3 Customs Validation
export async function fetchBackendCustomsValidate(payload) {
  try {
    return await apiFetch('/api/v1/customs/validate/', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.warn('Backend customs validate API error, falling back:', err.message)
    return null
  }
}

// Backend M3 Composite Risk Assessment
export async function fetchBackendRiskAssess(payload) {
  try {
    return await apiFetch('/api/v1/risk/assess/', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.warn('Backend risk assess API error, falling back:', err.message)
    return null
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
  const getLocalOverview = () => {
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

  if (MOCK_MODE) {
    await delay(30)
    return getLocalOverview()
  }

  try {
    const res = await apiFetch('/api/v1/master/overview/', {
      headers: { 'X-User-Role': 'admin' }
    })
    return res || getLocalOverview()
  } catch (err) {
    return getLocalOverview()
  }
}

export async function fetchMasterCollection(collectionName, params = {}) {
  const { q = '', active = null, page = 1, limit = 200 } = params

  const getLocalResults = () => {
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

  if (MOCK_MODE) {
    await delay(30)
    return getLocalResults()
  }

  const searchParams = new URLSearchParams()
  if (q) searchParams.set('q', q)
  if (active !== null) searchParams.set('active', active)
  if (page) searchParams.set('page', page)
  if (limit) searchParams.set('limit', limit)
  const qs = searchParams.toString() ? `?${searchParams.toString()}` : ''

  try {
    const res = await apiFetch(`/api/v1/master/${collectionName}/${qs}`, {
      headers: { 'X-User-Role': 'admin' }
    })
    return res || getLocalResults()
  } catch (err) {
    return getLocalResults()
  }
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

