import { useEffect, useState } from 'react'

export default function Toast({ message, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setVisible(true)
      const t = setTimeout(() => {
        setVisible(false)
        setTimeout(onClose, 300)
      }, 4000)
      return () => clearTimeout(t)
    }
  }, [message, onClose])

  if (!message) return null

  return (
    <div
      className={[
        'fixed top-5 right-5 z-50 flex items-start gap-3 bg-ink-950 text-white',
        'px-4 py-3 max-w-sm text-sm border-l-4 border-rose-600',
        'transition-all duration-300',
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4',
      ].join(' ')}
    >
      <span className="flex-1">{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300) }} className="text-ink-400 hover:text-white mt-0.5">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </button>
    </div>
  )
}
