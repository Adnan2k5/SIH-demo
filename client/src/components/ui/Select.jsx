export default function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  required = false,
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={[
          'peer w-full bg-white border border-ink-300 px-3 pt-6 pb-2 text-sm text-ink-900',
          'appearance-none focus:outline-none focus:border-cobalt-600',
          'transition-colors duration-150',
        ].join(' ')}
      >
        <option value="" />
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className="absolute left-3 top-2 text-xs font-medium text-ink-500"
      >
        {label}
        {required && <span className="text-rose-600 ml-0.5">*</span>}
      </label>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1l5 5 5-5" stroke="#737373" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </div>
    </div>
  )
}
