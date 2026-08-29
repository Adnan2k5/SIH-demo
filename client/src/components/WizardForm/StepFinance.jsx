import Input from '../ui/Input'
import useAppStore from '../../store/useAppStore'

export default function StepFinance() {
  const { financeForm, setFinanceField } = useAppStore()

  return (
    <div className="animate-slide-up grid grid-cols-1 gap-4">
      <div>
        <h2 className="text-xl font-semibold text-ink-900 tracking-tight">Financial Setup</h2>
        <p className="text-sm text-ink-500 mt-1">Configure your project cost, interest rate, and loan tenure.</p>
      </div>
      <Input
        id="project_cost"
        label="Project Cost (₹)"
        type="number"
        min="0"
        step="1000"
        value={financeForm.project_cost}
        onChange={(e) => setFinanceField('project_cost', e.target.value)}
        placeholder=" "
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="margin_money_percentage"
          label="Margin Money (%)"
          type="number"
          min="0"
          max="100"
          step="0.5"
          value={financeForm.margin_money_percentage}
          onChange={(e) => setFinanceField('margin_money_percentage', e.target.value)}
          placeholder=" "
          required
        />
        <Input
          id="interest_rate_annual"
          label="Annual Interest Rate (%)"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={financeForm.interest_rate_annual}
          onChange={(e) => setFinanceField('interest_rate_annual', e.target.value)}
          placeholder=" "
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="tenure_months"
          label="Tenure (months)"
          type="number"
          min="1"
          max="360"
          step="1"
          value={financeForm.tenure_months}
          onChange={(e) => setFinanceField('tenure_months', e.target.value)}
          placeholder=" "
          required
        />
        <Input
          id="moratorium_months"
          label="Moratorium (months)"
          type="number"
          min="0"
          max="60"
          step="1"
          value={financeForm.moratorium_months}
          onChange={(e) => setFinanceField('moratorium_months', e.target.value)}
          placeholder=" "
        />
      </div>
    </div>
  )
}
