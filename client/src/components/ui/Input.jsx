export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = ' ',
  required = false,
  className = '',
  min,
  max,
  step,
  ...rest
}) {
  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        className={[
          'peer w-full bg-white border border-ink-300 px-3 pt-6 pb-2 text-sm text-ink-900',
          'placeholder-transparent focus:outline-none focus:border-cobalt-600',
          'transition-colors duration-150',
        ].join(' ')}
        {...rest}
      />
      <label
        htmlFor={id}
        className={[
          'absolute left-3 top-2 text-xs font-medium text-ink-500',
          'transition-all duration-150',
          'peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-ink-400',
          'peer-focus:top-2 peer-focus:text-xs peer-focus:text-cobalt-600',
        ].join(' ')}
      >
        {label}
        {required && <span className="text-rose-600 ml-0.5">*</span>}
      </label>
    </div>
  )
}
