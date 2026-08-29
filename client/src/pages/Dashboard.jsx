import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdvisoryDashboard from '../components/AdvisoryDashboard'
import FinanceSchedule from '../components/FinanceSchedule'
import SchemeCard from '../components/SchemeCard'
import ReportDownload from '../components/ReportDownload'
import useAppStore from '../store/useAppStore'

const TABS = ['Advisory', 'Finance', 'Scheme']

export default function Dashboard() {
  const navigate = useNavigate()
  const { advisoryData, businessForm } = useAppStore()
  const [activeTab, setActiveTab] = useState(0)

  if (!advisoryData) {
    navigate('/wizard')
    return null
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-ink-200 px-8 py-5 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-cobalt-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 5v4L7 13 1 9V5L7 1z" fill="white" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-ink-900 tracking-tight">Advisory Engine</span>
        </div>
        <div className="flex items-center gap-1 border border-ink-200">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              id={`tab-${tab.toLowerCase()}`}
              onClick={() => setActiveTab(i)}
              className={[
                'px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all duration-150',
                activeTab === i
                  ? 'bg-ink-900 text-white'
                  : 'bg-white text-ink-500 hover:text-ink-900 hover:bg-ink-50',
              ].join(' ')}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-400 hidden sm:block font-medium">
            {businessForm.business_type} · {businessForm.location}
          </span>
          <button
            onClick={() => navigate('/wizard')}
            className="text-xs font-medium text-ink-400 hover:text-ink-900 transition-colors uppercase tracking-wide"
          >
            ← New Analysis
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 lg:px-12 py-10 max-w-5xl mx-auto w-full">
        {activeTab === 0 && <AdvisoryDashboard />}
        {activeTab === 1 && <FinanceSchedule />}
        {activeTab === 2 && <SchemeCard />}

        <div className="mt-12">
          <ReportDownload />
        </div>
      </main>

      <footer className="border-t border-ink-200 px-8 py-4 flex items-center justify-between">
        <span className="text-xs text-ink-400">© 2026 Advisory Engine · SIH</span>
        <span className="text-xs text-ink-300">Powered by LangChain + Groq</span>
      </footer>
    </div>
  )
}
