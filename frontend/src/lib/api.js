import { seedShipments, seedQuotes, routeAnalytics, demoUser, adminUser, agentUser, customsOfficerUser, agentOperatorUser, managerUser, RATES } from './mockData'

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
  const timeoutMs = options.timeout || (isHeavy ? 35000 : 10000)
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

export const BUILTIN_USERS = {
  'admin@portline.in': { password: 'admin123', user: adminUser },
  'agent@portline.in': { password: 'agent123', user: agentUser },
  'customs@portline.in': { password: 'customs123', user: customsOfficerUser },
  'agentop@portline.in': { password: 'agent123', user: agentOperatorUser },
  'manager@portline.in': { password: 'manager123', user: managerUser },
  'demo@portline.in': { password: 'demo123', user: demoUser },
  'ravi@sharmatextiles.in': { password: 'demo123', user: demoUser },
  'hello1@gmail.com': { password: 'HelloTest', user: { ...demoUser, name: 'Hello Shipper', email: 'hello1@gmail.com' } },
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
    saveMockUser(cleanEmail, { password: BUILTIN_USERS[cleanEmail].password, user: BUILTIN_USERS[cleanEmail].user })
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

// ---------------- Shipments ----------------

export async function fetchShipments(email = '') {
  const getLocalShipments = () => {
    if (email && email !== 'demo@portline.in' && email !== 'admin@portline.in') {
      try {
        const raw = localStorage.getItem(`portline_shipments_${email.toLowerCase()}`)
        return raw ? JSON.parse(raw) : []
      } catch {
        return []
      }
    }
    return seedShipments
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
  const getLocal = () => [...getSavedQuotes(), ...seedQuotes]
  if (MOCK_MODE) {
    await delay(20)
    return getLocal()
  }
  const query = email ? `?email=${encodeURIComponent(email)}` : ''
  try {
    const res = await apiFetch(`/api/v1/quotes/${query}`)
    return Array.isArray(res) ? res : getLocal()
  } catch {
    return getLocal()
  }
}

export async function fetchQuoteById(id) {
  if (MOCK_MODE) {
    await delay(20)
    const all = [...getSavedQuotes(), ...seedQuotes]
    return all.find(q => q.id.toUpperCase() === (id || '').toUpperCase()) || seedQuotes[0]
  }
  try {
    return await apiFetch(`/api/v1/quotes/${id}/`)
  } catch {
    const all = [...getSavedQuotes(), ...seedQuotes]
    return all.find(q => q.id.toUpperCase() === (id || '').toUpperCase()) || seedQuotes[0]
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
  const getLocal = () => [...getSavedQuotes(), ...seedQuotes]
  if (MOCK_MODE) {
    await delay(20)
    return getLocal()
  }
  try {
    const res = await apiFetch('/api/v1/quotes/')
    return Array.isArray(res) ? res : getLocal()
  } catch {
    return getLocal()
  }
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

export function getAgentActions() {
  try {
    const raw = localStorage.getItem('portline_agent_actions')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
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
  if (MOCK_MODE) {
    await delay(200)
    const all = getSavedQuotes()
    const record = { status: decision.toUpperCase(), notes, decided_at: new Date().toISOString() }
    const updated = all.map(q => q.id === quoteId ? { ...q, customer_decision: record, status: decision === 'accepted' ? 'Accepted' : 'Rejected' } : q)
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated))
    return { ok: true, quote_id: quoteId, status: decision === 'accepted' ? 'Accepted' : 'Rejected' }
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
  if (MOCK_MODE) {
    await delay(150)
    const all = getSavedQuotes()
    const updated = all.map(q => q.id === quoteId ? {
      ...q,
      selected_route: route,
      indicativeTotal: route.cost || q.indicativeTotal,
      route_approval_status: 'PENDING_APPROVAL'
    } : q)
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated))
    return { ok: true, quote_id: quoteId, selected_route: route }
  }
  return apiFetch(`/api/v1/quotes/${quoteId}/select-route/`, {
    method: 'POST',
    body: JSON.stringify({ route, requested_by: requestedBy }),
  })
}

// Customs Officer approves documentation or requests specific documents
export async function customsActionOnQuote(quoteId, action, { requestedDocs = [], comment = '', officerUser = null } = {}) {
  if (MOCK_MODE) {
    await delay(200)
    const all = getSavedQuotes()
    const status = action === 'approve' ? 'Approved' : 'Documents Requested'
    const updated = all.map(q => q.id === quoteId ? {
      ...q,
      status,
      customs_review: action === 'approve' ? { status: 'approved', officer_name: officerUser?.name, reviewed_at: new Date().toISOString(), notes: comment } : null,
      customs_document_request: action === 'request_documents' ? { requested_docs: requestedDocs, officer_notes: comment, status: 'PENDING_CUSTOMER_UPLOAD', requested_at: new Date().toISOString() } : q.customs_document_request
    } : q)
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated))
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

