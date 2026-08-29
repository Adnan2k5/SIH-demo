import { create } from 'zustand'
import { analyzeAdvisory } from '../api/advisory'
import { calculateFinance } from '../api/finance'
import { recommendScheme } from '../api/scheme'

const useAppStore = create((set, get) => ({
  step: 0,

  businessForm: {
    business_type: '',
    location: '',
    target_audience: '',
    unique_selling_proposition: '',
  },

  financeForm: {
    project_cost: '',
    margin_money_percentage: 20,
    interest_rate_annual: '',
    tenure_months: '',
    moratorium_months: 0,
  },

  profileForm: {
    business_name: '',
    owner_name: '',
    category: '',
    social_category: '',
    gender: '',
  },

  advisoryData: null,
  financeData: null,
  schemeData: null,

  loading: false,
  error: null,

  setStep: (step) => set({ step }),

  setBusinessField: (field, value) =>
    set((s) => ({ businessForm: { ...s.businessForm, [field]: value } })),

  setFinanceField: (field, value) =>
    set((s) => ({ financeForm: { ...s.financeForm, [field]: value } })),

  setProfileField: (field, value) =>
    set((s) => ({ profileForm: { ...s.profileForm, [field]: value } })),

  clearError: () => set({ error: null }),

  fetchAll: async () => {
    const { businessForm, financeForm, profileForm } = get()
    set({ loading: true, error: null })

    try {
      const [advisory, finance, scheme] = await Promise.all([
        analyzeAdvisory({
          business_type: businessForm.business_type,
          location: businessForm.location,
          target_audience: businessForm.target_audience,
          unique_selling_proposition: businessForm.unique_selling_proposition,
        }),
        calculateFinance({
          project_cost: parseFloat(financeForm.project_cost),
          margin_money_percentage: parseFloat(financeForm.margin_money_percentage),
          interest_rate_annual: parseFloat(financeForm.interest_rate_annual),
          tenure_months: parseInt(financeForm.tenure_months),
          moratorium_months: parseInt(financeForm.moratorium_months),
        }),
        recommendScheme({
          project_cost: parseFloat(financeForm.project_cost),
          category: profileForm.category || null,
          social_category: profileForm.social_category || null,
          gender: profileForm.gender || null,
        }),
      ])

      set({ advisoryData: advisory, financeData: finance, schemeData: scheme, loading: false })
      return true
    } catch (err) {
      set({ error: err.message, loading: false })
      return false
    }
  },
}))

export default useAppStore
