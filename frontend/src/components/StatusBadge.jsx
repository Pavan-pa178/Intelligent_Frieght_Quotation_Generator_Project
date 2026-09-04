const STYLES = {
  'In Transit': 'bg-brand-warningBg text-brand-warning',
  'Out for Delivery': 'bg-brand-warningBg text-brand-warning',
  Customs: 'bg-brand-orangePale text-brand-orange',
  Delivered: 'bg-brand-successBg text-brand-success',
  Booked: 'bg-brand-marinePale text-brand-marine',
  Accepted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
  'Rejected by Customs': 'bg-rose-50 text-rose-700 border border-rose-200',
  Cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
  'Documents Requested': 'bg-amber-50 text-amber-800 border border-amber-300',
  'Documents Submitted (Pending Customs Sign-off)': 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  'Pending Review': 'bg-amber-50 text-amber-800 border border-amber-200',
  Draft: 'bg-slate-100 text-slate-700',
}

const PULSE = new Set(['In Transit', 'Out for Delivery', 'Customs', 'Documents Requested'])

export default function StatusBadge({ status }) {
  const style = STYLES[status] || STYLES.Booked
  const dotColor = style.includes('warning')
    ? 'bg-brand-warning'
    : style.includes('rose')
    ? 'bg-rose-600'
    : style.includes('emerald')
    ? 'bg-emerald-600'
    : style.includes('indigo')
    ? 'bg-indigo-600'
    : style.includes('orange')
    ? 'bg-brand-orange'
    : style.includes('success')
    ? 'bg-brand-success'
    : 'bg-brand-marine'

  const pulseClass = PULSE.has(status) ? 'animate-shimmerDot' : ''

  return (
    <span className={'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold ' + style}>
      <span className={'h-1.5 w-1.5 rounded-full ' + dotColor + ' ' + pulseClass} />
      {status}
    </span>
  )
}
