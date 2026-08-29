import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

import Card from '../ui/Card'
import useAppStore from '../../store/useAppStore'

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

function KpiCard({ label, value, accent = false }) {
  return (
    <div className={`border border-ink-200 p-5 ${accent ? 'bg-cobalt-600' : 'bg-white'}`}>
      <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${accent ? 'text-cobalt-100' : 'text-ink-400'}`}>
        {label}
      </p>
      <p className={`text-lg font-semibold tracking-tight ${accent ? 'text-white' : 'text-ink-900'}`}>{value}</p>
    </div>
  )
}

const COLS = ['Month', 'Principal', 'Interest', 'Installment', 'Balance']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-ink-950 text-white text-xs px-3 py-2 border border-ink-700 space-y-1">
        {payload.map((p) => (
          <div key={p.dataKey} className="flex justify-between gap-4">
            <span style={{ color: p.color }}>{p.name}</span>
            <span>{fmt(p.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function FinanceSchedule() {
  const { financeData } = useAppStore()

  const chartData = useMemo(() => {
    if (!financeData?.repayment_schedule) return []
    return financeData.repayment_schedule.map((row) => ({
      month: row.month,
      Principal: row.principal_payment,
      Interest: row.interest_payment,
    }))
  }, [financeData])

  if (!financeData) return null

  const moratoriumMonths = financeData.moratorium_months || 0
  const schedule = financeData.repayment_schedule || []

  const Row = ({ index, style }) => {
    const row = schedule[index]
    const isMoratorium = row.month <= moratoriumMonths
    return (
      <div
        style={style}
        className={`flex text-sm divide-x divide-ink-100 ${isMoratorium ? 'bg-amber-100' : index % 2 === 0 ? 'bg-white' : 'bg-ink-50'}`}
      >
        <div className="w-16 px-4 py-2 shrink-0 text-ink-500 tabular-nums">{row.month}</div>
        <div className="flex-1 px-4 py-2 tabular-nums text-right">{fmt(row.principal_payment)}</div>
        <div className="flex-1 px-4 py-2 tabular-nums text-right">{fmt(row.interest_payment)}</div>
        <div className="flex-1 px-4 py-2 tabular-nums text-right font-medium">{fmt(row.total_installment)}</div>
        <div className="flex-1 px-4 py-2 tabular-nums text-right text-ink-600">{fmt(row.remaining_balance)}</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-cobalt-600 mb-1">Finance</p>
        <h2 className="text-2xl font-semibold text-ink-900 tracking-tight">Repayment Schedule</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-ink-200">
        <KpiCard label="Project Cost" value={fmt(financeData.project_cost)} />
        <KpiCard label="Loan Amount" value={fmt(financeData.loan_amount)} />
        <KpiCard label="Monthly EMI" value={fmt(financeData.emi)} accent />
        <KpiCard label="Total Interest" value={fmt(financeData.total_interest_payable)} />
        <KpiCard label="Total Payment" value={fmt(financeData.total_payment)} />
      </div>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-4">Amortization Chart</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="principalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0a0a0a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A56DB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1A56DB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 0" stroke="#e5e5e5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#737373', fontFamily: 'Inter' }} axisLine={false} tickLine={false} label={{ value: 'Month', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#a3a3a3' }} />
              <YAxis tick={{ fontSize: 11, fill: '#737373', fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Inter', paddingTop: 12 }} />
              <Area type="monotone" dataKey="Principal" stroke="#0a0a0a" strokeWidth={2} fill="url(#principalGrad)" dot={false} />
              <Area type="monotone" dataKey="Interest" stroke="#1A56DB" strokeWidth={2} fill="url(#interestGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="border border-ink-200">
        <div className="flex text-xs font-semibold uppercase tracking-widest text-ink-500 bg-ink-50 divide-x divide-ink-200 border-b border-ink-200">
          <div className="w-16 px-4 py-3 shrink-0">Month</div>
          <div className="flex-1 px-4 py-3 text-right">Principal</div>
          <div className="flex-1 px-4 py-3 text-right">Interest</div>
          <div className="flex-1 px-4 py-3 text-right">Installment</div>
          <div className="flex-1 px-4 py-3 text-right">Balance</div>
        </div>
        {moratoriumMonths > 0 && (
          <div className="px-4 py-2 text-xs text-amber-600 bg-amber-100 border-b border-amber-400 flex items-center gap-2">
            <span className="font-bold">■</span>
            Amber rows indicate moratorium period (interest-only payments)
          </div>
        )}
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {schedule.map((_, index) => (
            <Row key={index} index={index} style={{}} />
          ))}
        </div>
      </div>
    </div>
  )
}
