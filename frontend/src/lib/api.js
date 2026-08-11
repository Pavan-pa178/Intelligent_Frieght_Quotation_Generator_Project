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

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail || `Request failed (${res.status})`)
  }
  return res.status === 204 ? null : res.json()
}

// ---------------- Auth ----------------

export const BUILTIN_USERS = {
  'admin@portline.in': { password: 'admin123', user: adminUser },
  'agent@portline.in': { password: 'agent123', user: agentUser },
  'demo@portline.in': { password: 'demo123', user: demoUser },
  'ravi@sharmatextiles.in': { password: 'demo123', user: demoUser },
}

function getMockUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    const stored = raw ? JSON.parse(raw) : {}
    return { ...stored, ...BUILTIN_USERS }
  } catch {
    return { ...BUILTIN_USERS }
  }
}

function saveMockUser(email, userData) {
  const users = getMockUsers()
  users[email.toLowerCase()] = userData
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export async function loginRequest({ email, password }) {
  if (MOCK_MODE) {
    await delay(250)
    if (!email || !password) throw new Error('Email and password are required')
    
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanPw = (password || '').trim()

    // 1. Direct built-in account check
    if (BUILTIN_USERS[cleanEmail]) {
      const target = BUILTIN_USERS[cleanEmail]
      if (cleanPw === target.password || cleanPw.toLowerCase() === target.password.toLowerCase()) {
        setToken('mock_jwt_token_' + Date.now())
        return target.user
      } else {
        throw new Error('Invalid password for ' + cleanEmail + '. Please check your credentials.')
      }
    }

    // 2. User accounts saved from signup in localStorage
    const users = getMockUsers()
    const found = users[cleanEmail]
    
    if (found) {
      if (found.password !== cleanPw) {
        throw new Error('Invalid email or password. Please check your credentials.')
      }
      setToken('mock_jwt_token_' + Date.now())
      return found.user
    }

    throw new Error('No account found with this email. Please sign up first.')
  }

  const data = await apiFetch('/api/v1/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email: (email || '').trim().toLowerCase(), password: (password || '').trim() }),
  })
  setToken(data.access)
  return data.user
}

export async function signupRequest({ name, company, email, password }) {
  if (MOCK_MODE) {
    await delay(350)
    if (!email || !password) throw new Error('Email and password are required')
    
    const users = getMockUsers()
    if (users[email.toLowerCase()]) {
      throw new Error('An account with this email address already exists.')
    }

    const newUser = {
      name: name || 'New User',
      company: company || 'Company',
      email: email,
      role: 'Broker',
      phone: '+91 98765 43210',
      since: 'August 2026'
    }

    saveMockUser(email, { password, user: newUser })
    setToken('mock_jwt_token_' + Date.now())
    return newUser
  }

  const data = await apiFetch('/api/v1/auth/register/', {
    method: 'POST',
    body: JSON.stringify({ name, company, email, password }),
  })
  setToken(data.access)
  return data.user
}

export function logoutRequest() {
  clearToken()
  return Promise.resolve()
}

// ---------------- Shipments ----------------

export async function fetchShipments(email) {
  if (MOCK_MODE) {
    await delay(200)
    return seedShipments
  }
  const query = email ? `?email=${encodeURIComponent(email)}` : ''
  return apiFetch(`/api/v1/shipments/${query}`)
}

export async function createShipmentRequest(payload) {
  if (MOCK_MODE) {
    await delay(500)
    return { ...payload, date: new Date().toISOString().slice(0, 10) }
  }
  return apiFetch('/api/v1/shipments/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function trackShipmentRequest(trackingNumber, localShipments = []) {
  if (MOCK_MODE) {
    await delay(250)
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
    await delay(200)
    const local = getSavedQuotes()
    return [...local, ...seedQuotes]
  }
  const query = email ? `?email=${encodeURIComponent(email)}` : ''
  return apiFetch(`/api/v1/quotes/${query}`)
}

export async function fetchQuoteById(id) {
  if (MOCK_MODE) {
    await delay(150)
    const all = [...getSavedQuotes(), ...seedQuotes]
    return all.find(q => q.id.toUpperCase() === (id || '').toUpperCase()) || seedQuotes[0]
  }
  return apiFetch(`/api/v1/quotes/${id}/`)
}

export async function fetchRouteAnalytics() {
  if (MOCK_MODE) {
    await delay(200)
    return routeAnalytics
  }
  return apiFetch('/api/v1/routes/analytics/')
}

export async function sendContactMessage(payload) {
  if (MOCK_MODE) {
    await delay(400)
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
    await delay(200)
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
