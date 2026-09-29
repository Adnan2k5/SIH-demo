import { useState } from 'react'
import useAppStore from '../store/useAppStore'

function Field({ label, id, hint, children }) {
  return (
    <div className="ps-field">
      <label className="ps-label" htmlFor={id}>{label}</label>
      {children}
      {hint && <p className="ps-hint">{hint}</p>}
    </div>
  )
}

function Section({ icon, title, subtitle, children }) {
  return (
    <div className="ps-section">
      <div className="ps-section-header">
        <span className="ps-section-icon">{icon}</span>
        <div>
          <div className="ps-section-title">{title}</div>
          {subtitle && <div className="ps-section-sub">{subtitle}</div>}
        </div>
      </div>
      <div className="ps-section-body">{children}</div>
    </div>
  )
}

function AvatarCircle({ name, size = 72 }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'RE'
  return (
    <div className="ps-avatar-circle" style={{ width: size, height: size, fontSize: size * 0.33 }}>
      {initials}
    </div>
  )
}

function Toast({ msg, visible }) {
  return (
    <div className={`ps-toast ${visible ? 'ps-toast--visible' : ''}`}>
      <span className="ps-toast-icon">✓</span> {msg}
    </div>
  )
}

export default function ProfileSettings() {
  const { businessForm, profileForm, financeForm, setBusinessField, setProfileField, setFinanceField } = useAppStore()

  const [personal, setPersonal] = useState({
    owner_name: profileForm.owner_name || '',
    business_name: profileForm.business_name || '',
    phone: profileForm.phone || '',
    email: profileForm.email || '',
    aadhaar_last4: profileForm.aadhaar_last4 || '',
    dob: profileForm.dob || '',
  })

  const [business, setBusiness] = useState({
    business_type: businessForm.business_type || '',
    location: businessForm.location || '',
    target_audience: businessForm.target_audience || '',
    unique_selling_proposition: businessForm.unique_selling_proposition || '',
    district: profileForm.district || '',
    state: profileForm.state || '',
    pin_code: profileForm.pin_code || '',
    years_in_business: profileForm.years_in_business || '',
  })

  const [scheme, setScheme] = useState({
    social_category: profileForm.social_category || '',
    gender: profileForm.gender || '',
    category: profileForm.category || '',
    udyam_registered: profileForm.udyam_registered || false,
    dpiit_recognised: profileForm.dpiit_recognised || false,
    artisan_trade: profileForm.artisan_trade || '',
    group_type: profileForm.group_type || '',
    annual_family_income: profileForm.annual_family_income || '',
    age: profileForm.age || '',
  })

  const [finance, setFinance] = useState({
    project_cost: financeForm.project_cost || '',
    interest_rate_annual: financeForm.interest_rate_annual || '',
    tenure_months: financeForm.tenure_months || '',
    moratorium_months: financeForm.moratorium_months || 0,
    margin_money_percentage: financeForm.margin_money_percentage || 20,
  })

  const [prefs, setPrefs] = useState({
    language: profileForm.language || 'en',
    notifications: profileForm.notifications !== false,
    sms_alerts: profileForm.sms_alerts || false,
  })

  const [activeTab, setActiveTab] = useState('personal')
  const [toast, setToast] = useState({ visible: false, msg: '' })
  const [errors, setErrors] = useState({})

  const showToast = (msg) => {
    setToast({ visible: true, msg })
    setTimeout(() => setToast({ visible: false, msg: '' }), 2800)
  }

  const validate = () => {
    const e = {}
    if (!personal.owner_name.trim()) e.owner_name = 'Owner name is required'
    if (personal.phone && !/^\d{10}$/.test(personal.phone)) e.phone = 'Enter valid 10-digit mobile number'
    if (personal.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) e.email = 'Enter a valid email address'
    if (personal.aadhaar_last4 && !/^\d{4}$/.test(personal.aadhaar_last4)) e.aadhaar_last4 = 'Enter last 4 digits only'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    Object.entries(personal).forEach(([k, v]) => setProfileField(k, v))
    Object.entries(scheme).forEach(([k, v]) => setProfileField(k, v))
    Object.entries(prefs).forEach(([k, v]) => setProfileField(k, v))
    setProfileField('district', business.district)
    setProfileField('state', business.state)
    setProfileField('pin_code', business.pin_code)
    setProfileField('years_in_business', business.years_in_business)
    setBusinessField('business_type', business.business_type)
    setBusinessField('location', business.location)
    setBusinessField('target_audience', business.target_audience)
    setBusinessField('unique_selling_proposition', business.unique_selling_proposition)
    setFinanceField('project_cost', finance.project_cost)
    setFinanceField('interest_rate_annual', finance.interest_rate_annual)
    setFinanceField('tenure_months', finance.tenure_months)
    setFinanceField('moratorium_months', finance.moratorium_months)
    setFinanceField('margin_money_percentage', finance.margin_money_percentage)
    showToast('Profile saved successfully')
  }

  const TABS = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'business', label: 'Business', icon: '🏪' },
    { id: 'scheme', label: 'Scheme Profile', icon: '📋' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  ]

  const completionFields = [
    personal.owner_name, personal.phone, business.business_type,
    business.location, scheme.social_category, scheme.gender, finance.project_cost,
  ]
  const completionPct = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100)

  const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','J&K','Ladakh','Puducherry','Chandigarh']

  return (
    <div className="ps-root">
      <Toast msg={toast.msg} visible={toast.visible} />

      {/* Hero */}
      <div className="ps-hero">
        <div className="ps-hero-left">
          <AvatarCircle name={personal.owner_name || personal.business_name} size={72} />
          <div className="ps-hero-info">
            <h1 className="ps-hero-name">{personal.owner_name || 'Your Name'}</h1>
            <div className="ps-hero-business">{business.business_type || 'Business type not set'}</div>
            <div className="ps-hero-location">
              {[business.location, business.district, business.state].filter(Boolean).length > 0
                ? `📍 ${[business.location, business.district, business.state].filter(Boolean).join(', ')}`
                : '📍 Location not set'}
            </div>
          </div>
        </div>
        <div className="ps-hero-right">
          <div className="ps-completion-wrap">
            <div className="ps-completion-label">Profile Completion</div>
            <div className="ps-completion-bar-wrap">
              <div className="ps-completion-bar" style={{ width: `${completionPct}%` }} />
            </div>
            <div className="ps-completion-pct">{completionPct}%</div>
          </div>
          <div className="ps-hero-tags">
            {scheme.social_category && <span className="ps-tag ps-tag--blue">{scheme.social_category}</span>}
            {scheme.gender && <span className="ps-tag ps-tag--purple">{scheme.gender}</span>}
            {scheme.udyam_registered && <span className="ps-tag ps-tag--green">Udyam Registered</span>}
            {scheme.dpiit_recognised && <span className="ps-tag ps-tag--indigo">DPIIT Startup</span>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="ps-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`ps-tab ${activeTab === t.id ? 'ps-tab--active' : ''}`} onClick={() => setActiveTab(t.id)}>
            <span className="ps-tab-icon">{t.icon}</span>
            <span className="ps-tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="ps-content">

        {/* ── Personal ── */}
        {activeTab === 'personal' && (
          <Section icon="👤" title="Personal Information" subtitle="Your identity and contact details">
            <div className="ps-grid">
              <Field label="Full Name *" id="owner_name">
                <input id="owner_name" className={`ps-input ${errors.owner_name ? 'ps-input--error' : ''}`} placeholder="e.g. Ramesh Kumar" value={personal.owner_name} onChange={e => setPersonal(p => ({ ...p, owner_name: e.target.value }))} />
                {errors.owner_name && <span className="ps-error">{errors.owner_name}</span>}
              </Field>
              <Field label="Business / Entity Name" id="business_name">
                <input id="business_name" className="ps-input" placeholder="e.g. Ramesh Dairy Farm" value={personal.business_name} onChange={e => setPersonal(p => ({ ...p, business_name: e.target.value }))} />
              </Field>
              <Field label="Mobile Number" id="phone" hint="10-digit Indian mobile number">
                <input id="phone" className={`ps-input ${errors.phone ? 'ps-input--error' : ''}`} placeholder="9876543210" maxLength={10} value={personal.phone} onChange={e => setPersonal(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))} />
                {errors.phone && <span className="ps-error">{errors.phone}</span>}
              </Field>
              <Field label="Email Address" id="email">
                <input id="email" className={`ps-input ${errors.email ? 'ps-input--error' : ''}`} placeholder="you@example.com" value={personal.email} onChange={e => setPersonal(p => ({ ...p, email: e.target.value }))} />
                {errors.email && <span className="ps-error">{errors.email}</span>}
              </Field>
              <Field label="Date of Birth" id="dob">
                <input id="dob" type="date" className="ps-input" value={personal.dob} onChange={e => setPersonal(p => ({ ...p, dob: e.target.value }))} />
              </Field>
              <Field label="Aadhaar (Last 4 digits)" id="aadhaar_last4" hint="Only the last 4 digits for reference — never the full number">
                <input id="aadhaar_last4" className={`ps-input ${errors.aadhaar_last4 ? 'ps-input--error' : ''}`} placeholder="XXXX" maxLength={4} value={personal.aadhaar_last4} onChange={e => setPersonal(p => ({ ...p, aadhaar_last4: e.target.value.replace(/\D/g, '') }))} />
                {errors.aadhaar_last4 && <span className="ps-error">{errors.aadhaar_last4}</span>}
              </Field>
            </div>
            <div className="ps-privacy-note">🔒 Your data is stored locally in this session only and never shared with third parties.</div>
          </Section>
        )}

        {/* ── Business ── */}
        {activeTab === 'business' && (
          <Section icon="🏪" title="Business Details" subtitle="What your business does and where it operates">
            <div className="ps-grid">
              <Field label="Business / Activity Type" id="business_type">
                <input id="business_type" className="ps-input" placeholder="e.g. Dairy farming, Tailoring, Food processing" value={business.business_type} onChange={e => setBusiness(b => ({ ...b, business_type: e.target.value }))} />
              </Field>
              <Field label="Years in Business" id="years_in_business">
                <select id="years_in_business" className="ps-select" value={business.years_in_business} onChange={e => setBusiness(b => ({ ...b, years_in_business: e.target.value }))}>
                  <option value="">Select</option>
                  <option value="planning">Planning to start</option>
                  <option value="0-1">Less than 1 year</option>
                  <option value="1-3">1–3 years</option>
                  <option value="3-5">3–5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </Field>
              <Field label="City / Town / Village" id="location">
                <input id="location" className="ps-input" placeholder="e.g. Vaddeswaram" value={business.location} onChange={e => setBusiness(b => ({ ...b, location: e.target.value }))} />
              </Field>
              <Field label="District" id="district">
                <input id="district" className="ps-input" placeholder="e.g. Krishna" value={business.district} onChange={e => setBusiness(b => ({ ...b, district: e.target.value }))} />
              </Field>
              <Field label="State" id="state">
                <select id="state" className="ps-select" value={business.state} onChange={e => setBusiness(b => ({ ...b, state: e.target.value }))}>
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="PIN Code" id="pin_code">
                <input id="pin_code" className="ps-input" placeholder="e.g. 521001" maxLength={6} value={business.pin_code} onChange={e => setBusiness(b => ({ ...b, pin_code: e.target.value.replace(/\D/g, '') }))} />
              </Field>
              <Field label="Target Audience / Customers" id="target_audience">
                <input id="target_audience" className="ps-input" placeholder="e.g. Local households, Restaurants, Wholesale buyers" value={business.target_audience} onChange={e => setBusiness(b => ({ ...b, target_audience: e.target.value }))} />
              </Field>
              <Field label="Unique Selling Point (USP)" id="usp">
                <input id="usp" className="ps-input" placeholder="e.g. Organic produce, Home delivery, Lowest price" value={business.unique_selling_proposition} onChange={e => setBusiness(b => ({ ...b, unique_selling_proposition: e.target.value }))} />
              </Field>
            </div>
          </Section>
        )}

        {/* ── Scheme Profile ── */}
        {activeTab === 'scheme' && (
          <Section icon="📋" title="Scheme Eligibility Profile" subtitle="Used to match you to government schemes accurately">
            <div className="ps-info-note">ℹ️ Used only for scheme matching. Eligibility shown is based on broad published rules — not a guarantee of approval.</div>
            <div className="ps-grid">
              <Field label="Age" id="age">
                <input id="age" type="number" min="0" max="100" className="ps-input" placeholder="e.g. 32" value={scheme.age} onChange={e => setScheme(s => ({ ...s, age: e.target.value }))} />
              </Field>
              <Field label="Gender" id="gender">
                <select id="gender" className="ps-select" value={scheme.gender} onChange={e => setScheme(s => ({ ...s, gender: e.target.value }))}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Other">Other / Prefer not to say</option>
                </select>
              </Field>
              <Field label="Social Category" id="social_category">
                <select id="social_category" className="ps-select" value={scheme.social_category} onChange={e => setScheme(s => ({ ...s, social_category: e.target.value }))}>
                  <option value="">Select</option>
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="OBC">OBC</option>
                  <option value="general">General</option>
                  <option value="minority">Minority</option>
                </select>
              </Field>
              <Field label="MSME Category" id="category">
                <select id="category" className="ps-select" value={scheme.category} onChange={e => setScheme(s => ({ ...s, category: e.target.value }))}>
                  <option value="">Select</option>
                  <option value="micro">Micro</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="not_msme">Not an MSME</option>
                </select>
              </Field>
              <Field label="Annual Family Income (₹)" id="annual_family_income" hint="Used for NSFDC and other income-ceiling schemes">
                <input id="annual_family_income" type="number" className="ps-input" placeholder="e.g. 350000" value={scheme.annual_family_income} onChange={e => setScheme(s => ({ ...s, annual_family_income: e.target.value }))} />
              </Field>
              <Field label="Artisan Trade (if applicable)" id="artisan_trade" hint="For PM Vishwakarma — specify your trade">
                <input id="artisan_trade" className="ps-input" placeholder="e.g. Carpenter, Potter, Tailor" value={scheme.artisan_trade} onChange={e => setScheme(s => ({ ...s, artisan_trade: e.target.value }))} />
              </Field>
              <Field label="Group Type (if any)" id="group_type">
                <select id="group_type" className="ps-select" value={scheme.group_type} onChange={e => setScheme(s => ({ ...s, group_type: e.target.value }))}>
                  <option value="">None / Individual</option>
                  <option value="SHG">Self-Help Group (SHG)</option>
                  <option value="FPO">Farmer Producer Organisation (FPO)</option>
                  <option value="cooperative">Cooperative</option>
                </select>
              </Field>
            </div>
            <div className="ps-checks-group">
              {[
                { field: 'udyam_registered', label: 'I have Udyam Registration (MSE/MSME)', desc: 'Required for CGTMSE, LEAN, MSE-GIFT and many other schemes' },
                { field: 'dpiit_recognised', label: 'My startup has DPIIT Recognition', desc: 'Required for SISFS, CGSS, SIPP and GeM Startup Runway' },
              ].map(({ field, label, desc }) => (
                <label key={field} className="ps-check-card">
                  <div className="ps-check-card-top">
                    <input type="checkbox" className="ps-checkbox" checked={scheme[field]} onChange={e => setScheme(s => ({ ...s, [field]: e.target.checked }))} />
                    <span className="ps-check-label">{label}</span>
                  </div>
                  <div className="ps-check-desc">{desc}</div>
                </label>
              ))}
            </div>
          </Section>
        )}

        {/* ── Finance ── */}
        {activeTab === 'finance' && (
          <Section icon="💰" title="Financial Profile" subtitle="Your project and loan parameters">
            <div className="ps-grid">
              <Field label="Project / Investment Cost (₹)" id="project_cost">
                <input id="project_cost" type="number" className="ps-input" placeholder="e.g. 500000" value={finance.project_cost} onChange={e => setFinance(f => ({ ...f, project_cost: e.target.value }))} />
              </Field>
              <Field label="Expected Interest Rate (% p.a.)" id="interest_rate">
                <input id="interest_rate" type="number" step="0.1" className="ps-input" placeholder="e.g. 8.5" value={finance.interest_rate_annual} onChange={e => setFinance(f => ({ ...f, interest_rate_annual: e.target.value }))} />
              </Field>
              <Field label="Loan Tenure (months)" id="tenure">
                <input id="tenure" type="number" className="ps-input" placeholder="e.g. 60" value={finance.tenure_months} onChange={e => setFinance(f => ({ ...f, tenure_months: e.target.value }))} />
              </Field>
              <Field label="Moratorium Period (months)" id="moratorium" hint="Initial period with no EMI">
                <input id="moratorium" type="number" className="ps-input" placeholder="e.g. 3" value={finance.moratorium_months} onChange={e => setFinance(f => ({ ...f, moratorium_months: e.target.value }))} />
              </Field>
              <Field label="Own Contribution / Margin Money (%)" id="margin" hint="Your own investment as % of project cost">
                <input id="margin" type="number" className="ps-input" placeholder="e.g. 10" value={finance.margin_money_percentage} onChange={e => setFinance(f => ({ ...f, margin_money_percentage: e.target.value }))} />
              </Field>
            </div>
            {finance.project_cost && finance.interest_rate_annual && finance.tenure_months && (() => {
              const P = parseFloat(finance.project_cost) * (1 - parseFloat(finance.margin_money_percentage || 0) / 100)
              const r = parseFloat(finance.interest_rate_annual) / 100 / 12
              const n = parseInt(finance.tenure_months)
              const emi = P && r && n ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0
              return (
                <div className="ps-finance-preview">
                  <div className="ps-finance-preview-title">Quick EMI Estimate</div>
                  <div className="ps-finance-preview-grid">
                    {[
                      { label: 'Loan Amount', value: `₹${Math.round(P).toLocaleString('en-IN')}` },
                      { label: 'Monthly EMI', value: `₹${Math.round(emi).toLocaleString('en-IN')}` },
                      { label: 'Total Interest', value: `₹${Math.round(emi * n - P).toLocaleString('en-IN')}` },
                      { label: 'Total Repayment', value: `₹${Math.round(emi * n).toLocaleString('en-IN')}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="ps-finance-stat">
                        <div className="ps-finance-stat-label">{label}</div>
                        <div className="ps-finance-stat-value">{value}</div>
                      </div>
                    ))}
                  </div>
                  <p className="ps-finance-disclaimer">Estimate only. Actual EMI depends on lender's terms.</p>
                </div>
              )
            })()}
          </Section>
        )}

        {/* ── Preferences ── */}
        {activeTab === 'preferences' && (
          <Section icon="⚙️" title="Preferences" subtitle="Language, notifications and data settings">
            <div className="ps-grid ps-grid--single">
              <Field label="Language" id="language">
                <select id="language" className="ps-select" value={prefs.language} onChange={e => setPrefs(p => ({ ...p, language: e.target.value }))}>
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                  <option value="or">ଓଡ଼ିଆ (Odia)</option>
                </select>
              </Field>
            </div>
            <div className="ps-pref-checks">
              {[
                { field: 'notifications', label: 'In-app notifications', desc: 'Receive updates about scheme changes and recommendations inside GRAMAI' },
                { field: 'sms_alerts', label: 'SMS alerts (if available)', desc: 'Receive important scheme deadline alerts via SMS' },
              ].map(({ field, label, desc }) => (
                <label key={field} className="ps-pref-check-card">
                  <div className="ps-pref-check-top">
                    <div>
                      <div className="ps-pref-check-label">{label}</div>
                      <div className="ps-pref-check-desc">{desc}</div>
                    </div>
                    <div className={`ps-toggle ${prefs[field] ? 'ps-toggle--on' : ''}`} onClick={() => setPrefs(p => ({ ...p, [field]: !p[field] }))}>
                      <div className="ps-toggle-thumb" />
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="ps-danger-zone">
              <div className="ps-danger-title">⚠️ Data Management</div>
              <p className="ps-danger-desc">Your profile data is stored in this browser session. Clearing it will reset all your inputs.</p>
              <button className="ps-danger-btn" onClick={() => {
                if (window.confirm('Clear all profile data? This cannot be undone.')) {
                  setPersonal({ owner_name: '', business_name: '', phone: '', email: '', aadhaar_last4: '', dob: '' })
                  setBusiness({ business_type: '', location: '', target_audience: '', unique_selling_proposition: '', district: '', state: '', pin_code: '', years_in_business: '' })
                  setScheme({ social_category: '', gender: '', category: '', udyam_registered: false, dpiit_recognised: false, artisan_trade: '', group_type: '', annual_family_income: '', age: '' })
                  setFinance({ project_cost: '', interest_rate_annual: '', tenure_months: '', moratorium_months: 0, margin_money_percentage: 20 })
                  showToast('Profile data cleared')
                }
              }}>
                Clear All Profile Data
              </button>
            </div>
          </Section>
        )}

        {/* Save */}
        <div className="ps-footer">
          <button className="ps-save-btn" onClick={handleSave}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Save Profile
          </button>
          <p className="ps-footer-note">Changes apply immediately to scheme matching and finance calculations.</p>
        </div>
      </div>
    </div>
  )
}
