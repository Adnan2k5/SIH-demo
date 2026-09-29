import { useState, useMemo, useRef, useEffect } from 'react'
import { SCHEMES, FILTER_OPTIONS, DISCLAIMER, RESEARCH_CUTOFF, routeSchemes } from '../data/schemeData'

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
function formatINR(n) {
  if (!n) return '—'
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} lakh`
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n}`
}

function verificationBadge(status) {
  if (status === 'CURRENT') return { text: 'Verified Current', color: '#10B981', bg: '#ECFDF5' }
  if (status === 'VERIFY_BEFORE_APPLICATION') return { text: 'Verify Before Applying', color: '#F59E0B', bg: '#FFFBEB' }
  return { text: 'Outdated — Re-verify', color: '#EF4444', bg: '#FEF2F2' }
}

function TypeBadge({ typeLabel, typeColor }) {
  const bg = typeColor + '18'
  return (
    <span style={{ background: bg, color: typeColor, border: `1px solid ${typeColor}33`, borderRadius: 6, padding: '2px 9px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
      {typeLabel}
    </span>
  )
}

// ─────────────────────────────────────────────────────────
// SCHEME CARD (list view)
// ─────────────────────────────────────────────────────────
function SchemeCard({ scheme, onSelect, matchData }) {
  const vb = verificationBadge(scheme.verificationStatus)
  const keyFig = scheme.keyFigures?.[0]
  return (
    <div className="se-scheme-card" onClick={() => onSelect(scheme)}>
      {matchData && (
        <div className="se-match-banner">
          <span className="se-match-icon">✦</span>
          Potentially relevant based on your profile
        </div>
      )}
      <div className="se-card-top">
        <div className="se-card-info">
          <div className="se-card-ministry">{scheme.ministry.split('(')[0].trim()}</div>
          <h3 className="se-card-title">{scheme.schemeName}</h3>
          <p className="se-card-desc">{scheme.description.length > 130 ? scheme.description.slice(0, 130) + '…' : scheme.description}</p>
        </div>
        <div className="se-card-badges">
          <TypeBadge typeLabel={scheme.typeLabel} typeColor={scheme.typeColor} />
          {scheme.isInfrastructure && (
            <span className="se-infra-badge">Enabler</span>
          )}
        </div>
      </div>

      {keyFig && (
        <div className="se-card-keystat">
          <span className="se-keystat-label">{keyFig.label}</span>
          <span className="se-keystat-value">{keyFig.value}</span>
        </div>
      )}

      <div className="se-card-who">
        <span className="se-who-label">Who can apply: </span>
        <span className="se-who-value">{scheme.whoCanApply}</span>
      </div>

      <div className="se-card-footer">
        <div className="se-card-vbadge" style={{ background: vb.bg, color: vb.color }}>
          {vb.text}
        </div>
        <button className="se-card-viewbtn" onClick={e => { e.stopPropagation(); onSelect(scheme) }}>
          View Details →
        </button>
      </div>

      {matchData && (
        <div className="se-match-reasons">
          <div className="se-match-reasons-title">Why this appeared:</div>
          {matchData.matchReasons.slice(0, 2).map((r, i) => (
            <div key={i} className="se-match-reason-item">✓ {r}</div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SCHEME DETAIL VIEW
// ─────────────────────────────────────────────────────────
function SchemeDetail({ scheme, onBack, allSchemes }) {
  const [expandEligibility, setExpandEligibility] = useState(false)
  const vb = verificationBadge(scheme.verificationStatus)
  const related = allSchemes.filter(s => scheme.relatedSchemes?.includes(s.id))

  return (
    <div className="se-detail">
      <button className="se-back-btn" onClick={onBack}>← Back to Schemes</button>

      {/* Hero */}
      <div className="se-detail-hero" style={{ borderTop: `4px solid ${scheme.typeColor}` }}>
        <div className="se-detail-hero-top">
          <div>
            <div className="se-detail-ministry">{scheme.ministry}</div>
            <h1 className="se-detail-title">{scheme.schemeName}</h1>
            {scheme.shortName !== scheme.schemeName && (
              <div className="se-detail-shortname">Also known as: {scheme.shortName}</div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <TypeBadge typeLabel={scheme.typeLabel} typeColor={scheme.typeColor} />
            <div className="se-detail-vbadge" style={{ background: vb.bg, color: vb.color }}>
              {vb.text}
            </div>
          </div>
        </div>
        <p className="se-detail-desc">{scheme.description}</p>
        {scheme.isInfrastructure && (
          <div className="se-infra-notice">
            ℹ️ This is an enabling infrastructure or registration resource — not a loan, grant or subsidy scheme.
          </div>
        )}
      </div>

      {/* Global disclaimer */}
      <div className="se-detail-disclaimer">
        <span className="se-disclaimer-icon">⚠️</span>
        <div>
          <strong>Important:</strong> {DISCLAIMER}
        </div>
      </div>

      {/* Key Figures */}
      {scheme.keyFigures && scheme.keyFigures.length > 0 && (
        <div className="se-detail-section">
          <h2 className="se-section-title">What You Can Get</h2>
          <div className="se-keyfigures-grid">
            {scheme.keyFigures.map((kf, i) => (
              <div key={i} className="se-keyfig-card">
                <div className="se-keyfig-label">{kf.label}</div>
                <div className="se-keyfig-value" style={{ color: scheme.typeColor }}>{kf.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      <div className="se-detail-section">
        <h2 className="se-section-title">Benefits in Plain Language</h2>
        <ul className="se-benefits-list">
          {scheme.benefits.map((b, i) => (
            <li key={i} className="se-benefit-item">
              <span className="se-benefit-check" style={{ color: scheme.typeColor }}>✓</span>
              {b}
            </li>
          ))}
        </ul>
        {scheme.specialCategoryBenefits && (
          <div className="se-special-category-box">
            <span className="se-special-icon">★</span>
            <span>{scheme.specialCategoryBenefits}</span>
          </div>
        )}
      </div>

      {/* Who Can Apply */}
      <div className="se-detail-section">
        <h2 className="se-section-title">Who Can Apply?</h2>
        <div className="se-who-box">
          <p className="se-who-text">{scheme.whoCanApply}</p>
        </div>
      </div>

      {/* Eligibility */}
      <div className="se-detail-section">
        <h2 className="se-section-title">Eligibility Conditions</h2>
        <ul className="se-eligibility-list">
          {(expandEligibility ? scheme.eligibility : scheme.eligibility.slice(0, 3)).map((e, i) => (
            <li key={i} className="se-eligibility-item">
              <span className="se-eli-dot" />
              {e}
            </li>
          ))}
        </ul>
        {scheme.eligibility.length > 3 && (
          <button className="se-expand-btn" onClick={() => setExpandEligibility(v => !v)}>
            {expandEligibility ? '▲ Show less' : `▼ Show all ${scheme.eligibility.length} conditions`}
          </button>
        )}
        <div className="se-eligibility-note">
          <strong>Remember:</strong> Meeting these published criteria means you <em>may</em> be eligible — not that you are guaranteed approval. Banks, lenders and implementing agencies apply their own appraisal.
        </div>
      </div>

      {/* Financial Details */}
      {(scheme.interestRate || scheme.repaymentPeriod || scheme.moratorium || scheme.subsidyDetails || scheme.financialLimit) && (
        <div className="se-detail-section">
          <h2 className="se-section-title">Financial Details</h2>
          <div className="se-finance-grid">
            {scheme.interestRate && <div className="se-finance-item"><div className="se-finance-label">Interest Rate</div><div className="se-finance-val">{scheme.interestRate}</div></div>}
            {scheme.repaymentPeriod && <div className="se-finance-item"><div className="se-finance-label">Repayment Period</div><div className="se-finance-val">{scheme.repaymentPeriod}</div></div>}
            {scheme.moratorium && <div className="se-finance-item"><div className="se-finance-label">Moratorium</div><div className="se-finance-val">{scheme.moratorium}</div></div>}
            {scheme.subsidyDetails?.rate && <div className="se-finance-item"><div className="se-finance-label">Subsidy/Grant Rate</div><div className="se-finance-val">{scheme.subsidyDetails.rate}</div></div>}
            {scheme.subsidyDetails?.cap && <div className="se-finance-item"><div className="se-finance-label">Subsidy Cap</div><div className="se-finance-val">{scheme.subsidyDetails.cap}</div></div>}
            {scheme.subsidyDetails?.beneficiaryContribution && <div className="se-finance-item"><div className="se-finance-label">Your Contribution</div><div className="se-finance-val">{scheme.subsidyDetails.beneficiaryContribution}</div></div>}
          </div>
          {scheme.loanDetails && (
            <div className="se-loandetails-box">
              <strong>How the financing works:</strong> {scheme.loanDetails}
            </div>
          )}
        </div>
      )}

      {/* Requirements */}
      <div className="se-detail-section">
        <h2 className="se-section-title">Important Requirements</h2>
        <ul className="se-requirements-list">
          {scheme.requirements.map((r, i) => (
            <li key={i} className="se-requirement-item">
              <span className="se-req-icon">→</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Documents */}
      <div className="se-detail-section">
        <h2 className="se-section-title">Documents Generally Required</h2>
        <p className="se-docs-note">These are the commonly required documents. The exact checklist depends on the implementing agency/lender and may vary.</p>
        <div className="se-docs-grid">
          {scheme.documents.map((d, i) => (
            <div key={i} className="se-doc-item">
              <span className="se-doc-icon">📄</span>
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* Application Route */}
      <div className="se-detail-section">
        <h2 className="se-section-title">How to Apply / Application Route</h2>
        <div className="se-apply-box">
          <span className="se-apply-icon">🗺️</span>
          <p className="se-apply-text">{scheme.applicationRoute}</p>
        </div>
      </div>

      {/* Restrictions / Exclusions */}
      {(scheme.restrictions?.length > 0 || scheme.exclusions?.length > 0) && (
        <div className="se-detail-section">
          <h2 className="se-section-title">Important Conditions & Exclusions</h2>
          {scheme.restrictions?.length > 0 && (
            <>
              <div className="se-sub-title">Conditions to be aware of:</div>
              <ul className="se-restrictions-list">
                {scheme.restrictions.map((r, i) => (
                  <li key={i} className="se-restriction-item">
                    <span className="se-restrict-icon">!</span>
                    {r}
                  </li>
                ))}
              </ul>
            </>
          )}
          {scheme.exclusions?.length > 0 && (
            <>
              <div className="se-sub-title" style={{ marginTop: 12 }}>Excluded from this scheme:</div>
              <ul className="se-exclusions-list">
                {scheme.exclusions.map((e, i) => (
                  <li key={i} className="se-exclusion-item">✕ {e}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* Related Schemes */}
      {related.length > 0 && (
        <div className="se-detail-section">
          <h2 className="se-section-title">Related Schemes</h2>
          <div className="se-related-list">
            {related.map(r => (
              <div key={r.id} className="se-related-item">
                <TypeBadge typeLabel={r.typeLabel} typeColor={r.typeColor} />
                <span className="se-related-name">{r.schemeName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Source */}
      <div className="se-detail-section">
        <h2 className="se-section-title">Official Source</h2>
        <div className="se-source-box">
          <div className="se-source-item"><strong>Source:</strong> {scheme.source}</div>
          <div className="se-source-item">
            <strong>URL:</strong>{' '}
            <a href={scheme.sourceUrl} target="_blank" rel="noopener noreferrer" className="se-source-link">
              {scheme.sourceUrl} ↗
            </a>
          </div>
          <div className="se-source-item"><strong>Last Verified:</strong> {scheme.lastVerifiedDate}</div>
          <div className="se-source-item"><strong>Research Cut-off:</strong> {RESEARCH_CUTOFF}</div>
          <div className="se-source-item"><strong>Version:</strong> {scheme.version}</div>
        </div>
        <div className="se-verify-warning">
          ⚠️ Scheme rules, limits, application windows and implementing agencies can change. Always verify with the official source before applying.
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// PROFILE ROUTER PANEL
// ─────────────────────────────────────────────────────────
function ProfileRouter({ onResults }) {
  const [profile, setProfile] = useState({
    age: '', socialCategory: '', familyIncome: '', projectCost: '',
    businessStage: '', sector: '', artisanTrade: '', groupType: '',
    udyamRegistered: false, dpiitRecognised: false, foodProcessing: false, delayedPayment: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field, value) => setProfile(p => ({ ...p, [field]: value }))

  const handleSubmit = () => {
    const results = routeSchemes(profile)
    onResults(results, profile)
    setSubmitted(true)
  }

  const handleReset = () => {
    setProfile({ age: '', socialCategory: '', familyIncome: '', projectCost: '', businessStage: '', sector: '', artisanTrade: '', groupType: '', udyamRegistered: false, dpiitRecognised: false, foodProcessing: false, delayedPayment: false })
    onResults(null, null)
    setSubmitted(false)
  }

  return (
    <div className="se-router-panel">
      <div className="se-router-header">
        <span className="se-router-icon">🎯</span>
        <div>
          <div className="se-router-title">Find Schemes for Your Profile</div>
          <div className="se-router-sub">Tell GRAMAI about yourself to see potentially relevant schemes</div>
        </div>
      </div>

      <div className="se-router-fields">
        <div className="se-field-group">
          <label className="se-field-label">Age</label>
          <input className="se-field-input" type="number" min="0" max="100" placeholder="e.g. 28" value={profile.age} onChange={e => handleChange('age', e.target.value)} />
        </div>
        <div className="se-field-group">
          <label className="se-field-label">Social Category</label>
          <select className="se-field-select" value={profile.socialCategory} onChange={e => handleChange('socialCategory', e.target.value)}>
            <option value="">Select category</option>
            <option value="SC">Scheduled Caste (SC)</option>
            <option value="ST">Scheduled Tribe (ST)</option>
            <option value="OBC">OBC</option>
            <option value="general">General</option>
            <option value="minority">Minority</option>
          </select>
        </div>
        <div className="se-field-group">
          <label className="se-field-label">Annual Family Income (₹)</label>
          <input className="se-field-input" type="number" min="0" placeholder="e.g. 350000" value={profile.familyIncome} onChange={e => handleChange('familyIncome', e.target.value)} />
        </div>
        <div className="se-field-group">
          <label className="se-field-label">Project / Business Cost (₹)</label>
          <input className="se-field-input" type="number" min="0" placeholder="e.g. 500000" value={profile.projectCost} onChange={e => handleChange('projectCost', e.target.value)} />
        </div>
        <div className="se-field-group">
          <label className="se-field-label">Business Stage</label>
          <select className="se-field-select" value={profile.businessStage} onChange={e => handleChange('businessStage', e.target.value)}>
            <option value="">Select stage</option>
            <option value="planning">Planning a business</option>
            <option value="new">Starting a new business</option>
            <option value="existing">Existing business</option>
            <option value="expansion">Expansion / upgrade</option>
            <option value="modernisation">Modernisation</option>
          </select>
        </div>
        <div className="se-field-group">
          <label className="se-field-label">Sector</label>
          <select className="se-field-select" value={profile.sector} onChange={e => handleChange('sector', e.target.value)}>
            <option value="">Select sector</option>
            <option value="food-processing">Food Processing</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="services">Services</option>
            <option value="traditional">Traditional Trades</option>
            <option value="green">Green / Circular Economy</option>
            <option value="digital">Digital / E-commerce</option>
            <option value="startup">Startup / Technology</option>
          </select>
        </div>
        <div className="se-field-group">
          <label className="se-field-label">Artisan Trade (if any)</label>
          <input className="se-field-input" placeholder="e.g. Carpenter, Potter, Tailor..." value={profile.artisanTrade} onChange={e => handleChange('artisanTrade', e.target.value)} />
        </div>
        <div className="se-field-group">
          <label className="se-field-label">Group Type (if applicable)</label>
          <select className="se-field-select" value={profile.groupType} onChange={e => handleChange('groupType', e.target.value)}>
            <option value="">None / Individual</option>
            <option value="SHG">Self-Help Group (SHG)</option>
            <option value="FPO">Farmer Producer Organisation (FPO)</option>
            <option value="cooperative">Cooperative</option>
          </select>
        </div>

        <div className="se-checkboxes">
          {[
            { field: 'udyamRegistered', label: 'I have Udyam Registration (MSE)' },
            { field: 'dpiitRecognised', label: 'My startup has DPIIT Recognition' },
            { field: 'foodProcessing', label: 'My business involves food processing' },
            { field: 'delayedPayment', label: 'I have a delayed payment dispute' },
          ].map(({ field, label }) => (
            <label key={field} className="se-checkbox-label">
              <input type="checkbox" className="se-checkbox" checked={profile[field]} onChange={e => handleChange(field, e.target.checked)} />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="se-router-actions">
        <button className="se-router-submit" onClick={handleSubmit}>
          Find Potentially Relevant Schemes →
        </button>
        {submitted && (
          <button className="se-router-reset" onClick={handleReset}>
            Clear Profile
          </button>
        )}
      </div>

      <div className="se-router-disclaimer">
        This routing is a product guide only, not a government eligibility decision. Final eligibility depends on the implementing agency/lender.
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// CHATBOT WIDGET
// ─────────────────────────────────────────────────────────
function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I\'m GRAMAI. Ask me about any government scheme — eligibility, documents, how to apply, or what support is available for your business.' }
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getBotReply = (q) => {
    const lower = q.toLowerCase()
    if (lower.includes('nsfdc') || lower.includes('scheduled caste') || lower.includes(' sc ')) return 'NSFDC provides loans for SC beneficiaries with family income up to ₹5 lakh. Schemes include Micro Finance Scheme (up to ₹1.25 lakh at 6.5%), Term Loan (up to ₹45 lakh at 8%), and Udyam Nidhi Yojana (up to ₹4.50 lakh). Applications must be routed through State Channelising Agencies — not directly to NSFDC.'
    if (lower.includes('pmegp') || lower.includes('kvic')) return 'PMEGP is a credit-linked subsidy for new non-farm enterprises. Manufacturing projects can be up to ₹50 lakh; services up to ₹20 lakh. Subsidy is 15–35% depending on category and location. You contribute 5–10%. The rest is a bank loan. Apply at kviconline.gov.in/pmegp.'
    if (lower.includes('vishwakarma') || lower.includes('artisan') || lower.includes('craftsman')) return 'PM Vishwakarma is for 18 traditional artisan trades. Benefits include: PM Vishwakarma certificate, toolkit up to ₹15,000, collateral-free loan up to ₹3 lakh at just 5% interest. Register via Common Service Centres or at pmvishwakarma.gov.in.'
    if (lower.includes('pmfme') || lower.includes('food processing') || lower.includes('food')) return 'PMFME supports micro food processors. Individual units get 35% capital subsidy up to ₹10 lakh. SHG members get ₹40,000 seed capital. FPOs/Cooperatives get 35% credit-linked grant. ODOP alignment is important — check your district\'s product. Apply at pmfme.mofpi.gov.in.'
    if (lower.includes('cgtmse') || lower.includes('credit guarantee') || lower.includes('collateral')) return 'CGTMSE provides a government guarantee to your lender — not a direct cash payment to you. It helps MSEs get bank loans with less collateral. You need Udyam registration and must approach a CGTMSE member lender who will do their own appraisal.'
    if (lower.includes('startup') || lower.includes('dpiit') || lower.includes('sisfs')) return 'Startup India offers DPIIT recognition (gateway to benefits), SISFS seed fund (up to ₹20 lakh grant, ₹50 lakh for scaling via incubators), CGSS credit guarantee (up to ₹20 crore), SIPP for IP protection, and GeM Startup Runway for government market access.'
    if (lower.includes('udyam')) return 'Udyam Registration is FREE, paperless and based on self-declaration. Register at udyamregistration.gov.in using your Aadhaar. It is the gateway to CGTMSE, LEAN, MSE-GIFT, SPICE and many other MSME schemes. Micro: investment ≤₹2.5Cr/turnover ≤₹10Cr. Small: investment ≤₹25Cr/turnover ≤₹100Cr.'
    if (lower.includes('lean')) return 'LEAN scheme subsidises lean manufacturing implementation for Udyam-registered manufacturing MSMEs. The Ministry covers 90% of the cost, with an extra 5% for women/SC/ST entrepreneurs. Register at lean.msme.gov.in.'
    if (lower.includes('shg') || lower.includes('self help')) return 'SHGs engaged in food processing can access PMFME SHG support — ₹40,000 seed capital per member for working capital/tools, plus individual credit-linked 35% subsidy up to ₹10 lakh where eligible. Apply through SHG federation → State Nodal Agency.'
    if (lower.includes('document') || lower.includes('papers')) return 'Common documents include: Aadhaar, caste certificate (SC/ST if applicable), income proof, business/project report, bank account details, Udyam registration (for MSME schemes), DPIIT recognition (for Startup schemes). Always confirm the exact checklist with the implementing agency.'
    if (lower.includes('eligible') || lower.includes('qualify')) return 'Eligibility shown in GRAMAI is based on broad published scheme rules. Final approval depends on the bank, lender, implementing agency, SCA or incubator. Additional appraisal, documentation and viability conditions may apply. This is guidance only — not a government approval.'
    if (lower.includes('nssh') || lower.includes('sc st hub')) return 'National SC-ST Hub provides SC/ST entrepreneurs a 25% capital subsidy on plant and machinery up to ₹25 lakh, plus marketing support, mentoring and procurement facilitation. Udyam/enterprise records required. Apply at scsthub.in.'
    return 'I can help with questions about PMEGP, NSFDC loans, PM Vishwakarma, PMFME food processing, CGTMSE, Startup India schemes, Udyam registration, LEAN, and more. What would you like to know?'
  }

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    const botMsg = { role: 'bot', text: getBotReply(input) }
    setMessages(prev => [...prev, userMsg, botMsg])
    setInput('')
  }

  return (
    <>
      <button className="se-chatbot-fab" onClick={() => setOpen(o => !o)} title="Ask GRAMAI">
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div className="se-chatbot-panel">
          <div className="se-chatbot-header">
            <span className="se-chatbot-icon">🤖</span>
            <div>
              <div className="se-chatbot-name">GRAMAI Assistant</div>
              <div className="se-chatbot-status">Ask about schemes, eligibility, documents</div>
            </div>
          </div>

          <div className="se-chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`se-chatbot-msg se-chatbot-msg--${m.role}`}>
                {m.role === 'bot' && <span className="se-chatbot-bot-icon">🤖</span>}
                <div className="se-chatbot-bubble">{m.text}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="se-chatbot-input-row">
            <input
              className="se-chatbot-input"
              placeholder="Ask about a scheme..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button className="se-chatbot-send" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────
// MAIN SCHEME EXPLORER
// ─────────────────────────────────────────────────────────
export default function SchemeExplorer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState({ beneficiary: '', supportType: '', sector: '', ministry: '' })
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [routeResults, setRouteResults] = useState(null)
  const [showRouter, setShowRouter] = useState(false)
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'matched'
  const searchRef = useRef(null)

  const handleRouteResults = (results, profile) => {
    setRouteResults(results ? { results, profile } : null)
    if (results && results.length > 0) setActiveTab('matched')
  }

  const matchMap = useMemo(() => {
    if (!routeResults) return {}
    const m = {}
    routeResults.results.forEach(r => { m[r.schemeId] = r })
    return m
  }, [routeResults])

  const filteredSchemes = useMemo(() => {
    let schemes = SCHEMES

    // Tab filter
    if (activeTab === 'matched' && routeResults) {
      const matchedIds = new Set(routeResults.results.map(r => r.schemeId))
      schemes = schemes.filter(s => matchedIds.has(s.id))
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      schemes = schemes.filter(s =>
        s.schemeName.toLowerCase().includes(q) ||
        s.shortName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q)) ||
        s.ministry.toLowerCase().includes(q) ||
        s.whoCanApply.toLowerCase().includes(q) ||
        (s.relevantUserProfiles || []).some(p => p.toLowerCase().includes(q))
      )
    }

    // Beneficiary filter
    if (activeFilters.beneficiary) {
      const f = activeFilters.beneficiary.toLowerCase()
      schemes = schemes.filter(s =>
        s.tags.some(t => t.toLowerCase().includes(f)) ||
        s.whoCanApply.toLowerCase().includes(f) ||
        (s.relevantUserProfiles || []).some(p => p.toLowerCase().includes(f))
      )
    }

    // Support type filter
    if (activeFilters.supportType) {
      schemes = schemes.filter(s => s.type === activeFilters.supportType)
    }

    // Sector filter
    if (activeFilters.sector) {
      const f = activeFilters.sector.toLowerCase()
      schemes = schemes.filter(s =>
        s.tags.some(t => t.toLowerCase().includes(f)) ||
        s.category.toLowerCase().includes(f) ||
        (s.relevantUserProfiles || []).some(p => p.toLowerCase().includes(f))
      )
    }

    // Ministry filter
    if (activeFilters.ministry) {
      const f = activeFilters.ministry.toLowerCase()
      schemes = schemes.filter(s => s.ministry.toLowerCase().includes(f))
    }

    return schemes
  }, [searchQuery, activeFilters, activeTab, routeResults])

  const clearFilters = () => {
    setActiveFilters({ beneficiary: '', supportType: '', sector: '', ministry: '' })
    setSearchQuery('')
  }

  const hasFilters = searchQuery || Object.values(activeFilters).some(v => v)

  if (selectedScheme) {
    return (
      <div className="se-root">
        <SchemeDetail scheme={selectedScheme} onBack={() => setSelectedScheme(null)} allSchemes={SCHEMES} />
        <ChatbotWidget />
      </div>
    )
  }

  return (
    <div className="se-root">
      {/* ── Header ── */}
      <div className="se-header">
        <div className="se-header-content">
          <div>
            <h1 className="se-header-title">Government Scheme Explorer</h1>
            <p className="se-header-sub">Find government schemes and support relevant to your business, livelihood or project.</p>
            <p className="se-header-cutoff">Information based on research cut-off: <strong>{RESEARCH_CUTOFF}</strong> · Always verify before applying.</p>
          </div>
          <button className="se-profile-btn" onClick={() => setShowRouter(v => !v)}>
            {showRouter ? '▲ Hide Profile Finder' : '🎯 Find Schemes for My Profile'}
          </button>
        </div>
      </div>

      {/* ── Global Disclaimer ── */}
      <div className="se-global-disclaimer">
        <span>⚠️</span>
        <span><strong>Eligibility shown here is based on broad published scheme rules.</strong> Final approval depends on the bank, lender, implementing agency, SCA, incubator or nodal authority. Additional KYC, documentation, viability and credit-history conditions may apply.</span>
      </div>

      {/* ── Profile Router ── */}
      {showRouter && (
        <div className="se-router-wrapper">
          <ProfileRouter onResults={handleRouteResults} />
          {routeResults && routeResults.results.length > 0 && (
            <div className="se-route-results-summary">
              <span className="se-route-success-icon">✦</span>
              <strong>{routeResults.results.length}</strong> potentially relevant scheme{routeResults.results.length !== 1 ? 's' : ''} found based on your profile.
              <span className="se-route-note">Switch to "Matched Schemes" tab to see them.</span>
            </div>
          )}
          {routeResults && routeResults.results.length === 0 && (
            <div className="se-route-empty">No strong matches found for your profile. Browse all schemes below or adjust your inputs.</div>
          )}
        </div>
      )}

      {/* ── Search ── */}
      <div className="se-search-row">
        <div className="se-search-wrap">
          <svg className="se-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={searchRef}
            className="se-search-input"
            id="scheme-search-input"
            placeholder="Search schemes, business support, loans, subsidies, PMEGP, NSFDC, food processing..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="se-search-clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="se-filters-row">
        <div className="se-filters-group">
          {Object.entries(FILTER_OPTIONS).map(([key, opts]) => (
            <select
              key={key}
              className="se-filter-select"
              value={activeFilters[key]}
              onChange={e => setActiveFilters(prev => ({ ...prev, [key]: e.target.value }))}
            >
              <option value="">
                {key === 'beneficiary' ? 'Who are you?' :
                 key === 'supportType' ? 'Support type' :
                 key === 'sector' ? 'Sector' : 'Ministry'}
              </option>
              {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ))}
          {hasFilters && (
            <button className="se-filter-clear" onClick={clearFilters}>Clear filters</button>
          )}
        </div>
        <div className="se-count-badge">{filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? 's' : ''}</div>
      </div>

      {/* ── Tabs ── */}
      {routeResults && (
        <div className="se-tabs">
          <button className={`se-tab ${activeTab === 'all' ? 'se-tab--active' : ''}`} onClick={() => setActiveTab('all')}>
            All Schemes ({SCHEMES.length})
          </button>
          <button className={`se-tab ${activeTab === 'matched' ? 'se-tab--active' : ''}`} onClick={() => setActiveTab('matched')}>
            ✦ Matched for My Profile ({routeResults.results.length})
          </button>
        </div>
      )}

      {/* ── Scheme Grid ── */}
      <div className="se-grid">
        {filteredSchemes.length === 0 ? (
          <div className="se-no-results">
            <div className="se-no-results-icon">🔍</div>
            <div className="se-no-results-title">No schemes found</div>
            <div className="se-no-results-sub">Try a different search term or clear the filters.</div>
            <button className="se-filter-clear" style={{ marginTop: 12 }} onClick={clearFilters}>Clear all filters</button>
          </div>
        ) : (
          filteredSchemes.map(scheme => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              onSelect={setSelectedScheme}
              matchData={matchMap[scheme.id] || null}
            />
          ))
        )}
      </div>

      {/* ── Chatbot ── */}
      <ChatbotWidget />
    </div>
  )
}
