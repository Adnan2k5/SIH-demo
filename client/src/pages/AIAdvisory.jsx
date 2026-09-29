import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdvisoryDashboard from '../components/AdvisoryDashboard'
import FinanceSchedule from '../components/FinanceSchedule'
import SchemeCard from '../components/SchemeCard'
import ReportDownload from '../components/ReportDownload'
import useAppStore from '../store/useAppStore'

const TABS = ['Advisory', 'Finance', 'Scheme']

export default function AIAdvisory() {
  const navigate = useNavigate()
  const { advisoryData, businessForm } = useAppStore()
  const [activeTab, setActiveTab] = useState(0)

  if (!advisoryData) {
    navigate('/wizard')
    return null
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Sub-header with tabs */}
      <div className="border-b border-slate-200 px-8 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-slate-800">AI Advisory</span>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Powered by LangChain + Groq</span>
        </div>
        <div className="flex items-center gap-1 border border-slate-200 rounded-lg overflow-hidden">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              id={`tab-${tab.toLowerCase()}`}
              onClick={() => setActiveTab(i)}
              className={[
                'px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all duration-150',
                activeTab === i
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50',
              ].join(' ')}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:block font-medium">
            {businessForm.business_type} · {businessForm.location}
          </span>
          <button
            onClick={() => navigate('/wizard')}
            className="text-xs font-medium text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-wide"
          >
            ← New Analysis
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
        {activeTab === 0 && <AdvisoryDashboard />}
        {activeTab === 1 && <FinanceSchedule />}
        {activeTab === 2 && <SchemeCard />}

        <div className="mt-10">
          <ReportDownload />
        </div>
      </main>
    </div>
  )
}
