export default function Card({ children, className = '', accent = false }) {
  return (
    <div
      className={[
        'bg-white border border-ink-200',
        accent ? 'border-l-4 border-l-cobalt-600' : '',
        'p-6',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
