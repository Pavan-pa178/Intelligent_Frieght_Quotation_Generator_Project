const STYLES = {
  'In Transit': 'bg-brand-warningBg text-brand-warning',
  'Out for Delivery': 'bg-brand-warningBg text-brand-warning',
  Customs: 'bg-brand-orangePale text-brand-orange',
  Delivered: 'bg-brand-successBg text-brand-success',
  Booked: 'bg-brand-marinePale text-brand-marine',
  Cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
  Draft: 'bg-slate-100 text-slate-700',
}

const PULSE = new Set(['In Transit', 'Out for Delivery', 'Customs'])

export default function StatusBadge({ status }) {
  const style = STYLES[status] || STYLES.Booked
  const dotColor = style.includes('warning')
    ? 'bg-brand-warning'
    : style.includes('rose')
    ? 'bg-rose-600'
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
