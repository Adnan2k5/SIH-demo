import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import useAppStore from '../../store/useAppStore'

const SWOT_CONFIG = [
  { key: 'Strengths',     color: 'green', bg: 'bg-emerald-100', border: 'border-emerald-600', text: 'text-emerald-600', icon: '↑' },
  { key: 'Weaknesses',   color: 'red',   bg: 'bg-rose-100',    border: 'border-rose-600',    text: 'text-rose-600',    icon: '↓' },
  { key: 'Opportunities',color: 'accent',bg: 'bg-cobalt-100',  border: 'border-cobalt-600',  text: 'text-cobalt-600',  icon: '◆' },
  { key: 'Threats',      color: 'amber', bg: 'bg-amber-100',   border: 'border-amber-600',   text: 'text-amber-600',   icon: '!' },
]

function SwotCell({ config, items, delay }) {
  return (
    <div
      className={`border ${config.border} p-5 opacity-0 animate-slide-up`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-base font-bold ${config.text}`}>{config.icon}</span>
        <span className="text-xs font-semibold uppercase tracking-widest text-ink-600">{config.key}</span>
      </div>
      <ul className="space-y-1.5">
        {(items || []).map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-ink-800">
            <span className={`mt-1.5 w-1.5 h-1.5 shrink-0 ${config.bg} border ${config.border} inline-block`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-ink-950 text-white text-xs px-3 py-2 border border-ink-700">
        {payload[0].name}: {payload[0].value}
      </div>
    )
  }
  return null
}

export default function AdvisoryDashboard() {
  const { advisoryData } = useAppStore()

  const competitorChartData = useMemo(() => {
    if (!advisoryData) return []
    return [
      { name: 'Market Presence', value: 65 },
      { name: 'Pricing Power', value: 48 },
      { name: 'Digital Reach', value: 72 },
      { name: 'Brand Equity', value: 55 },
      { name: 'Innovation', value: 80 },
    ]
  }, [advisoryData])

  if (!advisoryData) return null

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-cobalt-600 mb-1">AI Analysis</p>
        <h2 className="text-2xl font-semibold text-ink-900 tracking-tight">Business Advisory</h2>
      </div>

      <div className="grid grid-cols-2 gap-px bg-ink-200">
        {SWOT_CONFIG.map((cfg, i) => (
          <SwotCell
            key={cfg.key}
            config={cfg}
            items={advisoryData.swot_analysis?.[cfg.key]}
            delay={i * 60}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card accent className="col-span-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-2">Market Reach</p>
          <p className="text-sm text-ink-800 leading-relaxed">{advisoryData.market_reach}</p>
        </Card>

        <Card className="col-span-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-2">Pricing Strategy</p>
          <p className="text-sm text-ink-800 leading-relaxed">{advisoryData.pricing_strategy}</p>
        </Card>

        <Card className="col-span-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-2">Opportunities</p>
          <ul className="space-y-2 mt-1">
            {(advisoryData.opportunities || []).map((opp, i) => (
              <li
                key={i}
                className="opacity-0 animate-slide-up flex items-center gap-2 text-sm text-ink-800"
                style={{ animationDelay: `${i * 80 + 200}ms`, animationFillMode: 'forwards' }}
              >
                <Badge color="accent" className="shrink-0">0{i + 1}</Badge>
                {opp}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-1">Competitor Analysis</p>
          <p className="text-sm text-ink-800 leading-relaxed mb-6">{advisoryData.competitor_analysis}</p>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-4">Market Position Indicators</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competitorChartData} barSize={28} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 0" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#737373', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#737373', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f2f2f2' }} />
                <Bar dataKey="value" fill="#1A56DB" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
