import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../store/useAppStore'
import AIAdvisory from './AIAdvisory'
import SchemeExplorer from './SchemeExplorer'
import ProfileSettings from './ProfileSettings'

/* ── Sidebar nav items ───────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'dashboard',       label: 'Dashboard',           icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: 'ai-analytics',    label: 'AI Analytics',         icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 1 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', badge: 'AI' },
  { id: 'schemes',         label: 'Scheme Explorer',      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z' },
  { id: 'finance',         label: 'Finance Planner',      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
  { id: 'insights',        label: 'Business Insights',    icon: 'M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 0-2 2h-2a2 2 0 0 0-2-2z' },
  { id: 'documents',       label: 'Documents',            icon: 'M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z' },
  { id: 'reports',         label: 'Reports',              icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z' },
  { id: 'settings',        label: 'Settings',             icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' },
]

/* ── Stat Card ─────────────────────────────────────────────── */
function StatCard({ icon, value, label, sub, color, bg }) {
  return (
    <div className="dash-stat-card">
      <div className="dash-stat-icon" style={{ background: bg, color }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={icon} />
        </svg>
      </div>
      <div>
        <div className="dash-stat-value">{value}</div>
        <div className="dash-stat-label">{label}</div>
        {sub && <div className="dash-stat-sub">{sub}</div>}
      </div>
    </div>
  )
}

/* ── Recommendation Card ──────────────────────────────────── */
function RecommendationCard({ onNavigate }) {
  return (
    <div className="dash-rec-card">
      <div className="dash-rec-header">
        <div className="dash-rec-title">
          <span className="dash-rec-star">✦</span>
          <span>AI Scheme Recommendation</span>
        </div>
        <button className="dash-rec-link" onClick={() => onNavigate('ai-analytics')}>Why this scheme? →</button>
      </div>
      <div className="dash-rec-body">
        <div className="dash-rec-score-wrap">
          <div className="dash-rec-score-ring">
            <svg viewBox="0 0 80 80" width="80" height="80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="8"/>
              <circle cx="40" cy="40" r="34" fill="none" stroke="#22c55e" strokeWidth="8"
                strokeDasharray="213.6" strokeDashoffset="32"
                strokeLinecap="round"
                transform="rotate(-90 40 40)"/>
            </svg>
            <div className="dash-rec-score-text">
              <div className="dash-rec-score-num">96%</div>
              <div className="dash-rec-score-label">Match</div>
            </div>
          </div>
        </div>
        <div className="dash-rec-content">
          <p className="dash-rec-desc">
            Based on your profile, <strong>PMMY – Kishore</strong> is the best match for your business.
          </p>
          <div className="dash-rec-checks">
            <div className="dash-rec-check">✓ Suitable for first-time entrepreneurs</div>
            <div className="dash-rec-check">✓ Matches your investment range</div>
            <div className="dash-rec-check">✓ High success rate in your district</div>
          </div>
          <div className="dash-rec-actions">
            <button className="dash-btn-primary" onClick={() => onNavigate('ai-analytics')}>View Full Details →</button>
            <button className="dash-btn-ghost">Compare with Others</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Business Snapshot ─────────────────────────────────────── */
function BusinessSnapshot({ businessForm }) {
  const items = [
    { icon: '📍', label: 'Location', value: businessForm.location || 'Not set' },
    { icon: '🏪', label: 'Business Type', value: businessForm.business_type || 'Not set' },
    { icon: '👥', label: 'Target Audience', value: businessForm.target_audience || 'Not set' },
    { icon: '💡', label: 'USP', value: businessForm.unique_selling_proposition || 'Not set' },
  ]
  return (
    <div className="dash-snapshot-card">
      <div className="dash-card-header">
        <span>Your Business at a Glance</span>
        <button className="dash-card-link">View All ›</button>
      </div>
      <div className="dash-snapshot-list">
        {items.map(it => (
          <div key={it.label} className="dash-snapshot-item">
            <span className="dash-snapshot-emoji">{it.icon}</span>
            <div>
              <div className="dash-snapshot-label">{it.label}</div>
              <div className="dash-snapshot-value">{it.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Quick Actions ─────────────────────────────────────────── */
function QuickActions({ onNavigate }) {
  const actions = [
    { label: 'AI Advisory', icon: '🤖', sub: 'Full SWOT & Report', page: 'ai-analytics' },
    { label: 'Finance Plan', icon: '📊', sub: 'EMI Calculator', page: 'finance' },
    { label: 'Schemes', icon: '📋', sub: 'Matched Schemes', page: 'schemes' },
    { label: 'Export PDF', icon: '⬇️', sub: 'Bank-ready Report', page: 'reports' },
  ]
  return (
    <div className="dash-actions-grid">
      {actions.map(a => (
        <button key={a.label} className="dash-action-tile" onClick={() => onNavigate(a.page)}>
          <span className="dash-action-icon">{a.icon}</span>
          <div className="dash-action-label">{a.label}</div>
          <div className="dash-action-sub">{a.sub}</div>
        </button>
      ))}
    </div>
  )
}

/* ── Dashboard Home Page ───────────────────────────────────── */
function DashboardHome({ businessForm, advisoryData, onNavigate }) {
  return (
    <div className="dash-home">
      {/* Welcome Banner */}
      <div className="dash-banner">
        <div className="dash-banner-content">
          <div className="dash-banner-text">
            <h1 className="dash-banner-title">Welcome to GRAMAI 👋</h1>
            <p className="dash-banner-sub">AI-Powered Guidance for Your Business Success</p>
            <p className="dash-banner-tagline">"Sahi Yojana, Sahi Margdarshan" · "Saphal Vyapar"</p>
          </div>
          <div className="dash-banner-badge">
            <span className="dash-banner-badge-icon">🌱</span>
            <div>
              <div style={{fontWeight:600,fontSize:'0.75rem',color:'#fff'}}>Empowering</div>
              <div style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.85)'}}>Rural Entrepreneurs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="dash-stats-row">
        <StatCard icon="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" value="43" label="Eligible Schemes" sub="Across 6 Ministries" color="#3B82F6" bg="#EFF6FF" />
        <StatCard icon="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69l1.519-4.674z" value="PMMY" label="Top Recommendation" sub="96% Match" color="#F59E0B" bg="#FFFBEB" />
        <StatCard icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" value="₹90L" label="Max Loan Eligible" sub="From multiple schemes" color="#10B981" bg="#ECFDF5" />
        <StatCard icon="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 0-2 2h-2a2 2 0 0 0-2-2z" value="₹10L" label="Est. Project Cost" sub="Based on your inputs" color="#8B5CF6" bg="#F5F3FF" />
        <StatCard icon="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" value="₹12,350" label="Monthly EMI (Est.)" sub="5 years tenure" color="#EC4899" bg="#FDF2F8" />
        <StatCard icon="M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" value="4/6" label="Documents Ready" sub="" color="#0891B2" bg="#ECFEFF" />
      </div>

      {/* Main 2-col grid */}
      <div className="dash-main-grid">
        <div className="dash-grid-left">
          <RecommendationCard onNavigate={onNavigate} />
          <div className="dash-card" style={{marginTop:'1rem'}}>
            <div className="dash-card-header"><span>Quick Actions</span></div>
            <QuickActions onNavigate={onNavigate} />
          </div>
        </div>
        <div className="dash-grid-right">
          <BusinessSnapshot businessForm={businessForm} />
          <div className="dash-card" style={{marginTop:'1rem'}}>
            <div className="dash-card-header"><span>Recent Activity</span></div>
            <div className="dash-activity-list">
              {[
                { label: 'Advisory Analysis Completed', time: 'Just now', color: '#22c55e' },
                { label: 'Finance Schedule Generated', time: '2 min ago', color: '#3b82f6' },
                { label: 'Scheme Match Found', time: '2 min ago', color: '#f59e0b' },
                { label: 'Report Ready for Download', time: '5 min ago', color: '#8b5cf6' },
              ].map(a => (
                <div key={a.label} className="dash-activity-item">
                  <div className="dash-activity-dot" style={{ background: a.color }} />
                  <div>
                    <div className="dash-activity-label">{a.label}</div>
                    <div className="dash-activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Placeholder ───────────────────────────────────────────── */
function PlaceholderPage({ title, icon }) {
  return (
    <div className="dash-placeholder">
      <div className="dash-placeholder-icon">{icon}</div>
      <h2 className="dash-placeholder-title">{title}</h2>
      <p className="dash-placeholder-sub">This section is coming soon.</p>
    </div>
  )
}

/* ── Root Layout ───────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate()
  const { advisoryData, businessForm, profileForm } = useAppStore()
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleNav = (page) => setActivePage(page)

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      setActivePage('schemes')
    }
    setSearchQuery(e.target.value)
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':   return <DashboardHome businessForm={businessForm} advisoryData={advisoryData} onNavigate={handleNav} />
      case 'ai-analytics':
        return advisoryData ? <AIAdvisory /> : (
          <div className="dash-placeholder">
            <div className="dash-placeholder-icon">🤖</div>
            <h2 className="dash-placeholder-title">No Analysis Yet</h2>
            <p className="dash-placeholder-sub">Run a wizard analysis first to see AI insights.</p>
            <button className="dash-btn-primary" style={{marginTop:'1.25rem'}} onClick={() => navigate('/wizard')}>Start Analysis →</button>
          </div>
        )
      case 'schemes':   return <SchemeExplorer />
      case 'finance':   return <PlaceholderPage title="Finance Planner" icon="📊" />
      case 'insights':  return <PlaceholderPage title="Business Insights" icon="📈" />
      case 'documents': return <PlaceholderPage title="Documents" icon="📁" />
      case 'reports':   return <PlaceholderPage title="Reports" icon="📑" />
      case 'settings':  return <ProfileSettings />
      default:          return <DashboardHome businessForm={businessForm} advisoryData={advisoryData} onNavigate={handleNav} />
    }
  }

  return (
    <div className="dash-root">
      {/* ── Top Navbar ── */}
      <header className="dash-topbar">
        <div className="dash-topbar-left">
          <button className="dash-menu-btn" onClick={() => setSidebarOpen(v => !v)} id="dash-menu-toggle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="dash-logo">
            <div className="dash-logo-icon">🌱</div>
            <div>
              <div className="dash-logo-name">GRAMAI</div>
              <div className="dash-logo-sub">Hyper-Local Business Advisor</div>
            </div>
          </div>
        </div>

        <div className="dash-topbar-search" onClick={() => { setActivePage('schemes'); }} style={{ cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            id="dash-search-input"
            placeholder="Search schemes, business ideas, or ask GRAMAI..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            onClick={e => e.stopPropagation()}
          />
        </div>

        <div className="dash-topbar-right">
          <button className="dash-topbar-btn" onClick={() => navigate('/wizard')} id="dash-new-analysis">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Analysis
          </button>
          <div className="dash-notif" id="dash-notif-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <div className="dash-notif-dot" />
          </div>
          {/* ── Profile Dropdown ── */}
          <div className="dash-profile-wrap" ref={profileRef}>
            <div
              className={`dash-avatar ${profileOpen ? 'dash-avatar--active' : ''}`}
              onClick={() => setProfileOpen(v => !v)}
              id="dash-profile-trigger"
              style={{ cursor: 'pointer' }}
            >
              <div className="dash-avatar-img">
                {profileForm.owner_name
                  ? profileForm.owner_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                  : 'RE'}
              </div>
              <div className="dash-avatar-info">
                <div className="dash-avatar-name">{profileForm.owner_name || businessForm.business_type || 'Rural Entrepreneur'}</div>
                <div className="dash-avatar-loc">{profileForm.email || businessForm.location || 'Vaddeswaram, AP'}</div>
              </div>
              <svg className="dash-avatar-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {profileOpen && (
              <div className="dash-profile-dropdown" id="dash-profile-dropdown">
                {/* Card top */}
                <div className="dash-pd-header">
                  <div className="dash-pd-avatar">
                    {profileForm.owner_name
                      ? profileForm.owner_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                      : 'RE'}
                  </div>
                  <div className="dash-pd-info">
                    <div className="dash-pd-name">{profileForm.owner_name || 'Rural Entrepreneur'}</div>
                    {profileForm.email && <div className="dash-pd-email">{profileForm.email}</div>}
                    {profileForm.phone && <div className="dash-pd-phone">📞 {profileForm.phone}</div>}
                  </div>
                </div>

                {/* Detail rows */}
                <div className="dash-pd-rows">
                  {businessForm.business_type && (
                    <div className="dash-pd-row">
                      <span className="dash-pd-row-icon">🏪</span>
                      <span className="dash-pd-row-text">{businessForm.business_type}</span>
                    </div>
                  )}
                  {(businessForm.location || profileForm.district || profileForm.state) && (
                    <div className="dash-pd-row">
                      <span className="dash-pd-row-icon">📍</span>
                      <span className="dash-pd-row-text">
                        {[businessForm.location, profileForm.district, profileForm.state].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                  {profileForm.social_category && (
                    <div className="dash-pd-row">
                      <span className="dash-pd-row-icon">🏷️</span>
                      <span className="dash-pd-row-text">{profileForm.social_category} category</span>
                    </div>
                  )}
                  {profileForm.udyam_registered && (
                    <div className="dash-pd-row">
                      <span className="dash-pd-row-icon">✅</span>
                      <span className="dash-pd-row-text">Udyam Registered</span>
                    </div>
                  )}
                  {profileForm.dpiit_recognised && (
                    <div className="dash-pd-row">
                      <span className="dash-pd-row-icon">🚀</span>
                      <span className="dash-pd-row-text">DPIIT Recognised Startup</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="dash-pd-actions">
                  <button
                    className="dash-pd-action-btn"
                    id="dash-pd-settings"
                    onClick={() => { setActivePage('settings'); setProfileOpen(false) }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    </svg>
                    Profile &amp; Settings
                  </button>
                  <button
                    className="dash-pd-action-btn dash-pd-action-btn--danger"
                    id="dash-pd-logout"
                    onClick={() => {
                      setProfileOpen(false)
                      navigate('/')
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="dash-body">
        {/* ── Sidebar ── */}
        <aside className={`dash-sidebar ${sidebarOpen ? 'dash-sidebar--open' : 'dash-sidebar--closed'}`}>
          <nav className="dash-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`dash-nav-item ${activePage === item.id ? 'dash-nav-item--active' : ''}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                  <path d={item.icon} />
                </svg>
                {sidebarOpen && (
                  <span className="dash-nav-label-wrap">
                    {item.label}
                    {item.badge && <span className="dash-nav-badge">{item.badge}</span>}
                  </span>
                )}
              </button>
            ))}
          </nav>


        </aside>

        {/* ── Content ── */}
        <main className="dash-content">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
