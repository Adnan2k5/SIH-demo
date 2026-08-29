import Input from '../ui/Input'
import useAppStore from '../../store/useAppStore'

export default function StepBusiness() {
  const { businessForm, setBusinessField } = useAppStore()

  return (
    <div className="animate-slide-up grid grid-cols-1 gap-4">
      <div>
        <h2 className="text-xl font-semibold text-ink-900 tracking-tight">Business Details</h2>
        <p className="text-sm text-ink-500 mt-1">Describe your business so our AI can generate accurate insights.</p>
      </div>
      <Input
        id="business_type"
        label="Business Type"
        value={businessForm.business_type}
        onChange={(e) => setBusinessField('business_type', e.target.value)}
        placeholder=" "
        required
      />
      <Input
        id="location"
        label="Location / City"
        value={businessForm.location}
        onChange={(e) => setBusinessField('location', e.target.value)}
        placeholder=" "
        required
      />
      <Input
        id="target_audience"
        label="Target Audience"
        value={businessForm.target_audience}
        onChange={(e) => setBusinessField('target_audience', e.target.value)}
        placeholder=" "
        required
      />
      <Input
        id="unique_selling_proposition"
        label="Unique Selling Proposition (USP)"
        value={businessForm.unique_selling_proposition}
        onChange={(e) => setBusinessField('unique_selling_proposition', e.target.value)}
        placeholder=" "
        required
      />
    </div>
  )
}
