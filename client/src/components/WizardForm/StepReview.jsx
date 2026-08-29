import useAppStore from '../../store/useAppStore'

function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-3 border-b border-ink-100 last:border-0">
      <span className="text-xs font-medium text-ink-500 uppercase tracking-wide w-40 shrink-0">{label}</span>
      <span className="text-sm text-ink-900 text-right font-medium">{value || '—'}</span>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="border border-ink-200 p-4 mb-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-cobalt-600 mb-3">{title}</p>
      {children}
    </div>
  )
}

export default function StepReview() {
  const { businessForm, financeForm, profileForm } = useAppStore()

  const fmt = (v) => v ? `₹${Number(v).toLocaleString('en-IN')}` : '—'

  return (
    <div className="animate-slide-up">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tight">Review & Confirm</h2>
        <p className="text-sm text-ink-500 mt-1">Verify your inputs before we generate the analysis.</p>
      </div>

      <Section title="Business">
        <ReviewRow label="Type" value={businessForm.business_type} />
        <ReviewRow label="Location" value={businessForm.location} />
        <ReviewRow label="Target Audience" value={businessForm.target_audience} />
        <ReviewRow label="USP" value={businessForm.unique_selling_proposition} />
      </Section>

      <Section title="Financials">
        <ReviewRow label="Project Cost" value={fmt(financeForm.project_cost)} />
        <ReviewRow label="Margin Money" value={`${financeForm.margin_money_percentage}%`} />
        <ReviewRow label="Interest Rate" value={`${financeForm.interest_rate_annual}% p.a.`} />
        <ReviewRow label="Tenure" value={`${financeForm.tenure_months} months`} />
        <ReviewRow label="Moratorium" value={`${financeForm.moratorium_months} months`} />
      </Section>

      <Section title="Profile">
        <ReviewRow label="Business Name" value={profileForm.business_name} />
        <ReviewRow label="Owner Name" value={profileForm.owner_name} />
        <ReviewRow label="Category" value={profileForm.category} />
        <ReviewRow label="Gender" value={profileForm.gender} />
      </Section>

      <p className="text-xs text-ink-400 mt-2">
        Click <strong>Generate Analysis</strong> to submit to the advisory engine.
      </p>
    </div>
  )
}
