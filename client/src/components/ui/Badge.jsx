const colorMap = {
  default: 'bg-ink-100 text-ink-700 border border-ink-300',
  accent:  'bg-cobalt-600 text-white',
  green:   'bg-emerald-100 text-emerald-600 border border-emerald-600',
  red:     'bg-rose-100 text-rose-600 border border-rose-600',
  amber:   'bg-amber-100 text-amber-600 border border-amber-600',
}

export default function Badge({ children, color = 'default', className = '' }) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 text-xs font-medium tracking-wide uppercase',
        colorMap[color],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
