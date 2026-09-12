const STYLES = {
  'In Transit': 'bg-brand-warningBg text-brand-warning',
  'Out for Delivery': 'bg-brand-warningBg text-brand-warning',
  Customs: 'bg-brand-orangePale text-brand-orange',
  Delivered: 'bg-brand-successBg text-brand-success',
  // 12-Stage Quotation Lifecycle Statuses
  'Quotation Pending': 'bg-amber-50 text-amber-800 border border-amber-300 font-semibold',
  'Agent Approval Pending': 'bg-amber-100 text-amber-900 border border-amber-400 font-semibold',
  'Price Revised (Awaiting Customer Decision)': 'bg-orange-100 text-orange-950 border border-orange-300 font-bold',
  'Revised Priced Accepted (Agent Approval Pending)': 'bg-teal-50 text-teal-900 border border-teal-300 font-bold',
  'Revised Price Declined': 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold',
  'Approved by Agent and Awaiting Customs Clearance': 'bg-blue-50 text-blue-900 border border-blue-300 font-semibold',
  'Rejected by Agent': 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold',
  'Documents Requested by Customs': 'bg-amber-50 text-amber-900 border border-amber-300 font-semibold',
  'Documents Submitted (Pending Customs Sign-off)': 'bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold',
  'Approved by Customs and Awaiting for Customer confirmation': 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold',
  Booked: 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold',
  'Booking decline by Customer': 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold',
  
  // Backwards compatibility aliases
  Accepted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Approved: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
  'Approved by Agent': 'bg-blue-50 text-blue-800 border border-blue-200 font-semibold',
  'Agent Approved': 'bg-blue-50 text-blue-800 border border-blue-200 font-semibold',
  'Approved by Customs': 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold',
  'Ready for Booking': 'bg-teal-50 text-teal-800 border border-teal-300 font-bold',
  Rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
  'Rejected by Customs': 'bg-rose-50 text-rose-700 border border-rose-200',
  'Declined by Customer': 'bg-rose-50 text-rose-700 border border-rose-200',
  Cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
  'Documents Requested': 'bg-amber-50 text-amber-800 border border-amber-300',
  'Pending Review': 'bg-amber-50 text-amber-800 border border-amber-200',
  'Price Revised': 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
  'Price Accepted (Pending Agent Sign-off)': 'bg-teal-50 text-teal-800 border border-teal-300 font-bold',
  Draft: 'bg-slate-100 text-slate-700',
}

const PULSE = new Set([
  'In Transit',
  'Out for Delivery',
  'Customs',
  'Documents Requested',
  'Documents Requested by Customs',
  'Agent Approval Pending',
  'Customs Approval Pending',
  'Price Revised (Awaiting Customer Decision)',
  'Revised Priced Accepted (Agent Approval Pending)',
  'Price Accepted (Pending Agent Sign-off)',
  'Approved by Customs and Awaiting for Customer confirmation'
])

export default function StatusBadge({ status }) {
  let matchedStyle = STYLES[status]
  if (!matchedStyle && status && status.startsWith('Booking decline by Customer')) {
    matchedStyle = STYLES['Booking decline by Customer']
  }
  const style = matchedStyle || STYLES.Draft
  const dotColor = style.includes('warning')
    ? 'bg-brand-warning'
    : style.includes('rose')
    ? 'bg-rose-600'
    : style.includes('emerald')
    ? 'bg-emerald-600'
    : style.includes('teal')
    ? 'bg-teal-600'
    : style.includes('blue')
    ? 'bg-blue-600'
    : style.includes('indigo')
    ? 'bg-indigo-600'
    : style.includes('orange')
    ? 'bg-brand-orange'
    : style.includes('amber')
    ? 'bg-amber-600'
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
