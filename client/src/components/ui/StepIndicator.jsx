const STEPS = [
  'Business',
  'Financials',
  'Profile',
  'Review',
  'Results',
]

export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, idx) => {
        const done = idx < current
        const active = idx === current
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  'w-8 h-8 flex items-center justify-center text-xs font-semibold border transition-all duration-300',
                  done
                    ? 'bg-ink-900 text-white border-ink-900'
                    : active
                    ? 'bg-cobalt-600 text-white border-cobalt-600'
                    : 'bg-white text-ink-400 border-ink-300',
                ].join(' ')}
              >
                {done ? (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={[
                  'text-xs font-medium whitespace-nowrap transition-colors duration-300',
                  active ? 'text-cobalt-600' : done ? 'text-ink-700' : 'text-ink-400',
                ].join(' ')}
              >
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={[
                  'h-px flex-1 mx-2 mb-5 transition-all duration-300',
                  done ? 'bg-ink-900' : 'bg-ink-200',
                ].join(' ')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
