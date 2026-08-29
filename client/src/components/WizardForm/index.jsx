import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import StepBusiness from './StepBusiness'
import StepFinance from './StepFinance'
import StepProfile from './StepProfile'
import StepReview from './StepReview'
import StepIndicator from '../ui/StepIndicator'
import Button from '../ui/Button'
import Toast from '../ui/Toast'
import useAppStore from '../../store/useAppStore'

const STEPS = [StepBusiness, StepFinance, StepProfile, StepReview]
const TOTAL = 5

function validate(step, state) {
  const { businessForm, financeForm, profileForm } = state
  if (step === 0) {
    return (
      businessForm.business_type.trim() &&
      businessForm.location.trim() &&
      businessForm.target_audience.trim() &&
      businessForm.unique_selling_proposition.trim()
    )
  }
  if (step === 1) {
    return (
      financeForm.project_cost &&
      financeForm.interest_rate_annual &&
      financeForm.tenure_months
    )
  }
  if (step === 2) {
    return profileForm.business_name.trim() && profileForm.owner_name.trim()
  }
  return true
}

export default function WizardForm() {
  const navigate = useNavigate()
  const { step, setStep, fetchAll, loading, error, clearError } = useAppStore()
  const state = useAppStore()
  const [localError, setLocalError] = useState(null)

  const ActiveStep = STEPS[step] || null

  const handleNext = async () => {
    if (!validate(step, state)) {
      setLocalError('Please fill in all required fields before continuing.')
      return
    }
    setLocalError(null)

    if (step === 3) {
      const ok = await fetchAll()
      if (ok) {
        setStep(4)
        navigate('/dashboard')
      }
      return
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const errorMsg = localError || error

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Toast message={errorMsg} onClose={() => { setLocalError(null); clearError() }} />

      <header className="border-b border-ink-200 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-cobalt-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 5v4L7 13 1 9V5L7 1z" fill="white" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-ink-900 tracking-tight">Advisory Engine</span>
        </div>
        <span className="text-xs text-ink-400 font-medium">
          Step {Math.min(step + 1, TOTAL)} of {TOTAL}
        </span>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <StepIndicator current={step} />

          <div className="min-h-[360px]">
            {ActiveStep && <ActiveStep />}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-ink-200">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 0 || loading}
              size="md"
            >
              ← Back
            </Button>
            <Button
              variant={step === 3 ? 'accent' : 'primary'}
              onClick={handleNext}
              loading={loading}
              size="md"
            >
              {step === 3 ? 'Generate Analysis' : 'Continue →'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
