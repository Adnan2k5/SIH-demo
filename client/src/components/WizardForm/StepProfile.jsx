import Input from '../ui/Input'
import Select from '../ui/Select'
import useAppStore from '../../store/useAppStore'

const CATEGORY_OPTIONS = [
  { value: 'General', label: 'General' },
  { value: 'OBC', label: 'OBC' },
  { value: 'SC', label: 'SC' },
  { value: 'ST', label: 'ST' },
]

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
]

export default function StepProfile() {
  const { profileForm, setProfileField } = useAppStore()

  return (
    <div className="animate-slide-up grid grid-cols-1 gap-4">
      <div>
        <h2 className="text-xl font-semibold text-ink-900 tracking-tight">Business Profile</h2>
        <p className="text-sm text-ink-500 mt-1">Used to personalise your scheme recommendations and PDF report.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="business_name"
          label="Business Name"
          value={profileForm.business_name}
          onChange={(e) => setProfileField('business_name', e.target.value)}
          placeholder=" "
          required
        />
        <Input
          id="owner_name"
          label="Owner Name"
          value={profileForm.owner_name}
          onChange={(e) => setProfileField('owner_name', e.target.value)}
          placeholder=" "
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          id="category"
          label="Category"
          value={profileForm.category}
          onChange={(e) => setProfileField('category', e.target.value)}
          options={CATEGORY_OPTIONS}
        />
        <Select
          id="gender"
          label="Gender"
          value={profileForm.gender}
          onChange={(e) => setProfileField('gender', e.target.value)}
          options={GENDER_OPTIONS}
        />
      </div>
      <Input
        id="social_category"
        label="Social Category (Optional)"
        value={profileForm.social_category}
        onChange={(e) => setProfileField('social_category', e.target.value)}
        placeholder=" "
      />
    </div>
  )
}
