import { useState } from 'react'
import Button from '../ui/Button'
import { generateReport } from '../../api/report'
import useAppStore from '../../store/useAppStore'

export default function ReportDownload() {
  const { advisoryData, financeData, schemeData, profileForm } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        business_name: profileForm.business_name,
        owner_name: profileForm.owner_name,
        advisory_data: advisoryData,
        finance_data: financeData,
        scheme_data: schemeData,
      }
      const blob = await generateReport(payload)
      const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `${profileForm.business_name.replace(/\s+/g, '_')}_report.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setDownloaded(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-ink-200 bg-white p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-fade-in">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-1">Export</p>
        <h3 className="text-base font-semibold text-ink-900 tracking-tight">Download Full Report</h3>
        <p className="text-sm text-ink-500 mt-0.5">
          Get a consolidated PDF with advisory, finance schedule, and scheme details.
        </p>
        {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}
        {downloaded && !error && (
          <p className="text-xs text-emerald-600 mt-2">✓ Report downloaded successfully.</p>
        )}
      </div>
      <Button
        variant="accent"
        size="lg"
        onClick={handleDownload}
        loading={loading}
        disabled={!advisoryData || !financeData || !schemeData}
        id="download-report-btn"
      >
        {downloaded ? '↓ Download Again' : '↓ Download PDF'}
      </Button>
    </div>
  )
}
