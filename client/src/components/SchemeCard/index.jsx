import { useState } from 'react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import useAppStore from '../../store/useAppStore'

const fmtAmount = (n) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

function SchemeRow({ scheme, recommended = false }) {
  return (
    <div className={`p-5 border ${recommended ? 'border-cobalt-600 bg-cobalt-50' : 'border-ink-200 bg-white'} flex flex-col gap-3`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-sm font-semibold ${recommended ? 'text-cobalt-700' : 'text-ink-900'} leading-snug`}>
            {scheme.name}
          </p>
          <p className="text-xs text-ink-500 mt-0.5">{scheme.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <Badge color={recommended ? 'accent' : 'default'}>{scheme.type}</Badge>
          {recommended && <Badge color="green">Recommended</Badge>}
        </div>
      </div>
      <div className="flex items-center gap-6 text-xs text-ink-500">
        <span>
          <span className="font-semibold text-ink-800">Max Loan:</span>{' '}
          {scheme.max_loan_amount === Infinity || scheme.max_loan_amount >= 1e15
            ? 'No limit'
            : fmtAmount(scheme.max_loan_amount)}
        </span>
        {scheme.subsidy_percentage > 0 && (
          <span>
            <span className="font-semibold text-emerald-600">{scheme.subsidy_percentage}% Subsidy</span>
          </span>
        )}
      </div>
    </div>
  )
}

export default function SchemeCard() {
  const { schemeData } = useAppStore()
  const [showAll, setShowAll] = useState(false)

  if (!schemeData) return null

  const others = (schemeData.eligible_schemes || []).filter(
    (s) => s.name !== schemeData.recommended_scheme.name
  )

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-cobalt-600 mb-1">Scheme Routing</p>
        <h2 className="text-2xl font-semibold text-ink-900 tracking-tight">Government Schemes</h2>
      </div>

      <SchemeRow scheme={schemeData.recommended_scheme} recommended />

      {others.length > 0 && (
        <div>
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-xs font-medium text-cobalt-600 hover:text-cobalt-700 flex items-center gap-1.5 mb-3"
          >
            <span>{showAll ? '▲' : '▼'}</span>
            {showAll ? 'Hide' : 'Show'} {others.length} other eligible scheme{others.length > 1 ? 's' : ''}
          </button>
          {showAll && (
            <div className="grid grid-cols-1 gap-3 animate-fade-in">
              {others.map((s) => (
                <SchemeRow key={s.name} scheme={s} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
