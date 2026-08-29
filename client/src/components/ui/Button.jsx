const variants = {
  primary:
    'bg-ink-900 text-white border border-ink-900 hover:bg-ink-700 active:bg-ink-950',
  ghost:
    'bg-transparent text-ink-800 border border-ink-300 hover:border-ink-600 hover:text-ink-900',
  accent:
    'bg-cobalt-600 text-white border border-cobalt-600 hover:bg-cobalt-700 active:bg-cobalt-800',
  danger:
    'bg-transparent text-rose-600 border border-rose-600 hover:bg-rose-600 hover:text-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-sm',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium tracking-tight',
        'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-cobalt-600 focus-visible:ring-offset-2',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...rest}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
