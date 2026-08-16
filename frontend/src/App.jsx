import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ToastProvider } from './context/ToastContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Services from './pages/Services'
import Tracking from './pages/Tracking'
import Ship from './pages/Ship'
import Quotes from './pages/Quotes'
import QuoteDetail from './pages/QuoteDetail'
import RoutesPage from './pages/Routes'
import Portal from './pages/Portal'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Agent from './pages/Agent'

import { useNavigate } from 'react-router-dom'
import { useApp } from './context/AppContext'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

function AdminRouteGuard({ children }) {
  const { loggedIn, user } = useApp()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // When logged in as Admin, keep navigation strictly on /admin
    if (loggedIn && user?.role === 'admin' && pathname !== '/admin') {
      navigate('/admin', { replace: true })
    }
  }, [loggedIn, user, pathname, navigate])

  return children
}

function LayoutChrome({ children }) {
  const { pathname } = useLocation()
  const { loggedIn, user } = useApp()
  const isAuthPage = pathname === '/login'
  const isAdmin = loggedIn && user?.role === 'admin'
  const isAdminPage = pathname.startsWith('/admin')

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isAuthPage)
    return () => document.body.classList.remove('overflow-hidden')
  }, [isAuthPage])

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? '' : 'pt-[72px]'}>
        <AdminRouteGuard>
          {children}
        </AdminRouteGuard>
      </main>
      {!isAuthPage && !isAdminPage && !isAdmin && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ToastProvider>
          <ScrollToTop />
          <LayoutChrome>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/ship" element={<Ship />} />
                <Route path="/quotes" element={<Quotes />} />
                <Route path="/quotes/:id" element={<QuoteDetail />} />
                <Route path="/routes" element={<RoutesPage />} />
                <Route path="/portal" element={<Portal />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/agent" element={<Agent />} />
              </Routes>
            </ErrorBoundary>
          </LayoutChrome>
        </ToastProvider>
      </AppProvider>
    </ErrorBoundary>
  )
}
