import { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react'
import { seedShipments, demoUser } from '../lib/mockData'
import { loginRequest, signupRequest, logoutRequest, trackShipmentRequest, fetchShipments, cancelShipmentRequest } from '../lib/api'

const AppContext = createContext(null)

// One-time reset check to guarantee clean slate across all users
if (typeof window !== 'undefined' && !localStorage.getItem('portline_shipment_wipe_v5')) {
  try {
    const toRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('portline_shipments_')) {
        toRemove.push(k)
      }
    }
    toRemove.forEach(k => localStorage.removeItem(k))
    localStorage.setItem('portline_shipment_wipe_v5', 'true')
  } catch {}
}

// Helper to load user shipments safely from localStorage
const loadUserShipments = (userObj) => {
  if (!userObj || typeof userObj !== 'object' || !userObj.email || typeof userObj.email !== 'string') {
    return []
  }
  const emailLower = userObj.email.toLowerCase()
  if (emailLower === (demoUser.email || '').toLowerCase() || emailLower === 'demo@portline.in') {
    return []
  }
  try {
    const raw = localStorage.getItem(`portline_shipments_${emailLower}`)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const saveUserShipments = (userObj, updatedShipments) => {
  if (!userObj || typeof userObj !== 'object' || !userObj.email || typeof userObj.email !== 'string') {
    return
  }
  try {
    localStorage.setItem(`portline_shipments_${userObj.email.toLowerCase()}`, JSON.stringify(updatedShipments || []))
  } catch {
    // ignore storage error
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('portline_user_profile')
      if (!saved) return null
      const parsed = JSON.parse(saved)
      return parsed && typeof parsed === 'object' ? parsed : null
    } catch {
      return null
    }
  })

  const [shipments, setShipments] = useState(() => loadUserShipments(user))

  const loggedIn = !!user

  useEffect(() => {
    if (user && typeof user === 'object') {
      try {
        localStorage.setItem('portline_user_profile', JSON.stringify(user))
      } catch {
        // ignore
      }
      const local = loadUserShipments(user)
      setShipments(local)
      
      // Fetch user shipments from backend API
      fetchShipments(user.email).then(remote => {
        if (Array.isArray(remote)) {
          setShipments(remote)
          saveUserShipments(user, remote)
        }
      }).catch(() => {})
    } else {
      try {
        localStorage.removeItem('portline_user_profile')
      } catch {
        // ignore
      }
      setShipments([])
    }
  }, [user])

  const login = useCallback(async ({ email, password }) => {
    const loggedInUser = await loginRequest({ email, password })
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const loginDemo = useCallback(async () => {
    setUser(demoUser)
    return demoUser
  }, [])

  const signup = useCallback(async (payload) => {
    const newUser = await signupRequest(payload)
    setUser(newUser)
    saveUserShipments(newUser, [])
    return newUser
  }, [])

  const logout = useCallback(async () => {
    await logoutRequest()
    setUser(null)
  }, [])

  const addShipment = useCallback((shipment) => {
    setShipments((prev) => {
      const updated = [shipment, ...(Array.isArray(prev) ? prev : [])]
      if (user) {
        saveUserShipments(user, updated)
      }
      return updated
    })
  }, [user])

  const cancelShipment = useCallback(async (trackingNumber, reason = 'Cancelled by customer') => {
    try {
      await cancelShipmentRequest(trackingNumber, reason)
    } catch {
      // ignore
    }
    setShipments((prev) => {
      const updated = (Array.isArray(prev) ? prev : []).map((s) => {
        const matchTn = (s.tn || s.trackingNumber || '').trim().toUpperCase()
        if (matchTn === (trackingNumber || '').trim().toUpperCase()) {
          const updatedSteps = (s.steps || []).map((step) => {
            if (step.current) {
              return { ...step, current: false }
            }
            return step
          })
          return {
            ...s,
            status: 'Cancelled',
            cancellationReason: reason,
            cancelledAt: new Date().toISOString(),
            steps: [
              ...updatedSteps,
              { label: 'Cancelled', loc: 'Customer Portal', ts: 'Just now', done: true, current: true, cancelled: true }
            ]
          }
        }
        return s
      })
      if (user) {
        saveUserShipments(user, updated)
      }
      return updated
    })
  }, [user])

  const findShipment = useCallback(
    async (trackingNumber) => trackShipmentRequest(trackingNumber, shipments),
    [shipments]
  )

  const value = useMemo(
    () => ({ user, loggedIn, shipments, login, loginDemo, signup, logout, addShipment, cancelShipment, findShipment }),
    [user, loggedIn, shipments, login, loginDemo, signup, logout, addShipment, cancelShipment, findShipment]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp() must be used inside <AppProvider>')
  return ctx
}
