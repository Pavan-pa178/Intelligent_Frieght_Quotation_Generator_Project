import { seedShipments, seedQuotes, routeAnalytics, demoUser, RATES } from './mockData'

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

function getMockUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveMockUser(email, userData) {
  const users = getMockUsers()
  users[email.toLowerCase()] = userData
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export async function loginRequest({ email, password }) {
  if (MOCK_MODE) {
    await delay(350)
    if (!email || !password) throw new Error('Email and password are required')
    
    const users = getMockUsers()
    const found = users[email.toLowerCase()]
    
    if (found) {
      if (found.password !== password) {
        throw new Error('Invalid email or password. Please check your credentials.')
      }
      setToken('mock_jwt_token_' + Date.now())
      return found.user
    }

    // Default demo account handling
    if (password === 'demo' || password.length >= 4) {
      const u = { ...demoUser, email }
      saveMockUser(email, { password, user: u })
      setToken('mock_jwt_token_' + Date.now())
      return u
    }

    throw new Error('Invalid email or password. Please check your credentials.')
  }

  const data = await apiFetch('/api/v1/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
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

export async function fetchShipments() {
  if (MOCK_MODE) {
    await delay(200)
    return seedShipments
  }
  return apiFetch('/api/v1/shipments/')
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

export function saveQuote(quote) {
  const existing = getSavedQuotes()
  const updated = [quote, ...existing.filter(q => q.id !== quote.id)]
  localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated))
  return quote
}

export async function fetchQuotes() {
  if (MOCK_MODE) {
    await delay(200)
    const local = getSavedQuotes()
    return [...local, ...seedQuotes]
  }
  return apiFetch('/api/v1/quotes/')
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
