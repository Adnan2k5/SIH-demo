import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import useAppStore from '../store/useAppStore'

const FEATURES = [
  {
    icon: '◈',
    title: 'AI-Powered SWOT',
    desc: 'LangChain RAG engine generates a context-aware SWOT analysis tailored to your market.',
  },
  {
    icon: '▦',
    title: 'EMI Calculator',
    desc: 'Precise amortization with moratorium handling, visualised as an interactive chart.',
  },
  {
    icon: '◉',
    title: 'Scheme Routing',
    desc: 'Automatically matches your profile to MUDRA, PMEGP, or Stand-Up India schemes.',
  },
  {
    icon: '↓',
    title: 'PDF Export',
    desc: 'Download a bank-ready business advisory and financial report in one click.',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const setStep = useAppStore((s) => s.setStep)

  const handleStart = () => {
    setStep(0)
    navigate('/wizard')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-ink-200 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-cobalt-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 5v4L7 13 1 9V5L7 1z" fill="white" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-ink-900 tracking-tight">Advisory Engine</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#features" className="text-xs font-medium text-ink-500 hover:text-ink-900 transition-colors uppercase tracking-wide">Features</a>
          <Button variant="ghost" size="sm" onClick={handleStart} id="nav-start-btn">
            Start →
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="px-8 py-24 lg:py-36 max-w-4xl mx-auto animate-fade-in">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-8 bg-cobalt-600" />
            <span className="text-xs font-semibold uppercase tracking-widest text-cobalt-600">
              SIH Business Advisory Engine
            </span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-semibold text-ink-950 tracking-tight leading-none text-balance mb-8">
            AI-Driven<br />
            Business<br />
            Intelligence.
          </h1>
          <p className="text-base text-ink-500 max-w-lg leading-relaxed mb-12">
            Enter your business details, receive a comprehensive SWOT analysis, 
            government scheme recommendations, and a complete financial repayment 
            schedule — powered by LangChain RAG.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="primary" size="lg" onClick={handleStart} id="hero-start-btn">
              Start Analysis →
            </Button>
            <a href="#features" className="text-sm font-medium text-ink-500 hover:text-ink-800 transition-colors">
              See how it works
            </a>
          </div>
        </section>

        <section id="features" className="border-t border-ink-200 px-8 py-20 max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-10">What you get</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink-200">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="bg-white p-8 opacity-0 animate-slide-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
              >
                <div className="text-2xl text-cobalt-600 mb-4 font-mono">{f.icon}</div>
                <h3 className="text-sm font-semibold text-ink-900 mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-ink-200 px-8 py-16 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-ink-900 tracking-tight">Ready to build your advisory report?</h2>
            <p className="text-sm text-ink-500 mt-1">Takes under 5 minutes. No account required.</p>
          </div>
          <Button variant="accent" size="lg" onClick={handleStart} id="cta-start-btn">
            Begin Now →
          </Button>
        </section>
      </main>

      <footer className="border-t border-ink-200 px-8 py-5 flex items-center justify-between">
        <span className="text-xs text-ink-400">© 2026 Advisory Engine · SIH</span>
        <span className="text-xs text-ink-300">Powered by LangChain + Groq</span>
      </footer>
    </div>
  )
}
