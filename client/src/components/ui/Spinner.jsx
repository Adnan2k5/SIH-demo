export default function Spinner({ size = 20, className = '' }) {
  return (
    <span
      role="status"
      className={`inline-block border-2 border-ink-300 border-t-ink-900 rounded-full animate-spin ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
