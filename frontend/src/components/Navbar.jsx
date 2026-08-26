import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Container, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'

const CUSTOMER_NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/quotes', label: 'Quotations' },
  { to: '/routes', label: 'Routes' },
  { to: '/tracking', label: 'Tracking' },
  { to: '/portal', label: 'Portal' },
  { to: '/contact', label: 'Contact' },
]

const AGENT_NAV_ITEMS = [
  { to: '/agent', label: 'Review Queue' },
  { to: '/quotes', label: 'Quotations' },
  { to: '/routes', label: 'Routes' },
  { to: '/tracking', label: 'Tracking' },
  { to: '/services', label: 'Services' },
]

const CUSTOMS_NAV_ITEMS = [
  { to: '/customs', label: 'Customs Workspace' },
  { to: '/quotes', label: 'Quotations' },
  { to: '/routes', label: 'Routes' },
]

const AGENT_OP_NAV_ITEMS = [
  { to: '/agents', label: 'AI Agent Operations' },
  { to: '/quotes', label: 'Quotations' },
  { to: '/routes', label: 'Routes' },
]

const MANAGER_NAV_ITEMS = [
  { to: '/analytics', label: 'Executive Analytics' },
  { to: '/quotes', label: 'Quotations' },
  { to: '/routes', label: 'Routes' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { loggedIn, user, logout } = useApp()
  const navigate = useNavigate()
  const toast = useToast()

  const isAdmin = loggedIn && user?.role === 'admin'
  const isCustoms = loggedIn && user?.role === 'customs_officer'
  const isAgentOp = loggedIn && user?.role === 'agent_operator'
  const isManager = loggedIn && user?.role === 'manager'
  const isAgent = loggedIn && (user?.role === 'agent' || user?.role === 'broker')
  
  const navItems = isCustoms ? CUSTOMS_NAV_ITEMS : (isAgentOp ? AGENT_OP_NAV_ITEMS : (isManager ? MANAGER_NAV_ITEMS : (isAgent ? AGENT_NAV_ITEMS : CUSTOMER_NAV_ITEMS)))

  const handleLogout = () => {
    logout()
    toast('Logged out successfully')
    navigate('/login')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', mobileOpen)
  }, [mobileOpen])

  const linkClass = ({ isActive }) =>
    `relative rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
      isActive ? 'text-white after:absolute after:bottom-0.5 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-brand-orangeLight' : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[900] h-[72px] border-b border-white/5 bg-brand-navy/95 backdrop-blur-md transition-shadow ${
          scrolled ? 'shadow-[0_12px_30px_-14px_rgba(0,0,0,.5)]' : ''
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1220px] items-center justify-between gap-6 px-8 sm:px-5">
          <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-2.5 font-display text-[19px] font-bold tracking-wide text-white">
            <Container className="h-[34px] w-[34px] text-brand-orangeLight" strokeWidth={1.6} />
            <span>
              PORTLINE
              <small className="mt-0.5 block font-mono text-[9px] font-normal tracking-[.18em] text-slate-400">
                {isAdmin ? 'ADMIN CONSOLE' : isAgent ? 'BROKER PORTAL' : 'GLOBAL FREIGHT FORWARDING'}
              </small>
            </span>
          </Link>

          {/* Center Links — Hidden for Admin to avoid duplicating Admin Panel tabs */}
          {!isAdmin && (
            <ul className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={linkClass} end={item.to === '/'}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <>
                <button
                  onClick={() => navigate('/admin')}
                  className="hidden sm:flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 py-1.5 pl-1.5 pr-3.5 text-white hover:bg-amber-500/20 transition-colors"
                  title="Admin Operations Console"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white font-display text-xs font-bold shadow-xs">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                  <span className="text-[13px] font-semibold text-amber-200">
                    {user?.name?.split(' ')[0] || 'Admin'} <span className="text-[10px] text-amber-400 font-mono">(Admin)</span>
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-[10px] border border-red-500/40 bg-red-500/15 px-3.5 py-2 text-[13px] font-semibold text-red-300 hover:bg-red-500/25 hover:text-red-200 transition-colors shadow-xs"
                  title="Log out of Admin Console"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : isAgent ? (
              <>
                <Link
                  to="/agent"
                  className="hidden md:inline-flex items-center gap-1.5 rounded-[10px] border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-[13px] font-semibold text-purple-300 hover:bg-purple-500/20 transition-colors"
                >
                  Agent Panel
                </Link>

                <button
                  onClick={() => navigate('/agent')}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3.5 text-white transition-colors hover:bg-white/10"
                  title="Broker Review Queue"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white font-display text-xs font-bold">
                    {user?.name?.charAt(0) || 'P'}
                  </span>
                  <span className="text-[13px] font-semibold">{user?.name?.split(' ')[0] || 'Agent'}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-[10px] border border-white/20 bg-white/5 px-3 py-2 text-[13px] font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  title="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/ship"
                  className="inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-br from-brand-orange to-brand-orangeLight px-4 py-2 text-[13.5px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(217,80,10,.55)] transition-transform hover:-translate-y-0.5"
                >
                  New Enquiry
                </Link>

                {loggedIn ? (
                  <button
                    onClick={() => navigate('/portal')}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3.5 text-white transition-colors hover:bg-white/10"
                    title="View Customer Portal"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange to-brand-orangeLight font-display text-xs font-bold">
                      {user?.name?.charAt(0) || 'P'}
                    </span>
                    <span className="text-[13.5px] font-semibold">{user?.name?.split(' ')[0] || 'Profile'}</span>
                  </button>
                ) : (
                  <Link to="/login" className="rounded-lg px-3.5 py-2 text-[13.5px] font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
                    Log in
                  </Link>
                )}
              </>
            )}

            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[950] flex flex-col bg-brand-navy p-8 transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mb-10 flex items-center justify-between">
          <span className="font-display text-[17px] font-bold text-white">
            {isAdmin ? 'PORTLINE Admin' : 'Freight Quote Generator'}
          </span>
          <button onClick={() => setMobileOpen(false)} className="flex h-10 w-10 items-center justify-center text-white" aria-label="Close menu">
            <X className="h-6 w-6" />
          </button>
        </div>

        {isAdmin ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-white">
              <div className="text-xs text-amber-400 font-mono">Logged in as</div>
              <div className="font-bold text-sm mt-1">{user?.name || 'Administrator'}</div>
              <div className="text-xs text-slate-400">{user?.email}</div>
            </div>
            <button
              onClick={() => { handleLogout(); setMobileOpen(false) }}
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-center font-semibold text-white shadow-xs"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="border-b border-white/10 py-3.5 font-display text-2xl text-white"
              >
                {item.label}
              </Link>
            ))}
            {loggedIn ? (
              <button
                onClick={() => { handleLogout(); setMobileOpen(false) }}
                className="mt-6 rounded-[10px] border border-white/30 py-3.5 text-center font-semibold text-white"
              >
                Log out
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="mt-6 rounded-[10px] border border-white/30 py-3.5 text-center font-semibold text-white">
                  Log in
                </Link>
                <Link to="/ship" onClick={() => setMobileOpen(false)} className="mt-3 rounded-[10px] bg-gradient-to-br from-brand-orange to-brand-orangeLight py-3.5 text-center font-semibold text-white">
                  Get a Quote
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}
