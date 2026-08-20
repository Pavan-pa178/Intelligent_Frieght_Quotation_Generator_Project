import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext(null)

function isWarningOrError(msg, explicitType) {
  if (explicitType === 'error' || explicitType === 'warning') return true
  if (explicitType === 'success' || explicitType === 'info') return false
  if (!msg || typeof msg !== 'string') return false
  const lower = msg.toLowerCase()
  return (
    lower.includes('please select') ||
    lower.includes('please fill') ||
    lower.includes('please enter') ||
    lower.includes('please add') ||
    lower.includes('required') ||
    lower.includes('failed') ||
    lower.includes('error') ||
    lower.includes('invalid') ||
    lower.includes('cannot') ||
    lower.includes('could not') ||
    lower.includes('at least') ||
    lower.includes('missing') ||
    lower.includes('denied')
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const toast = useCallback((message, type = 'auto') => {
    const id = ++idRef.current
    const isError = isWarningOrError(message, type)
    setToasts((prev) => [...prev, { id, message, isError, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3800)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastStack toasts={toasts} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast() must be used inside <ToastProvider>')
  return ctx
}

function ToastStack({ toasts }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed top-5 right-5 left-5 sm:left-auto z-[2000] flex flex-col gap-2.5">
      {toasts.map((t) => {
        if (t.isError) {
          return (
            <div
              key={t.id}
              className="animate-slideIn flex max-w-none sm:max-w-[340px] items-center gap-3 rounded-[10px] bg-[#160808] border border-rose-600/70 px-[18px] py-3.5 text-[13.5px] font-medium text-white shadow-xl shadow-rose-950/50 backdrop-blur-sm"
            >
              <XCircleGlyph />
              <span className="text-rose-50">{t.message}</span>
            </div>
          )
        }
        return (
          <div
            key={t.id}
            className="animate-slideIn flex max-w-none sm:max-w-[340px] items-center gap-3 rounded-[10px] bg-brand-navy border border-white/10 px-[18px] py-3.5 text-[13.5px] font-medium text-white shadow-lg2"
          >
            <CheckCircleGlyph />
            <span>{t.message}</span>
          </div>
        )
      })}
    </div>
  )
}

function CheckCircleGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[20px] w-[20px] flex-shrink-0 text-brand-success">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.4 2.4L16 10" />
    </svg>
  )
}

function XCircleGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[20px] w-[20px] flex-shrink-0 text-rose-500">
      <circle cx="12" cy="12" r="9" className="stroke-rose-500 fill-rose-500/15" />
      <path d="M15 9l-6 6" />
      <path d="M9 9l6 6" />
    </svg>
  )
}
