import { useState } from 'react'
import { useAppStore } from '../../stores/useAppStore'

export function Footer() {
  const fullReset = useAppStore((s) => s.fullReset)
  const jobRawText = useAppStore((s) => s.jobRawText)
  const resumeRawText = useAppStore((s) => s.resumeRawText)
  const [confirming, setConfirming] = useState(false)

  const hasData = !!(jobRawText || resumeRawText)

  const handleReset = () => {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
      return
    }
    fullReset()
    setConfirming(false)
  }

  return (
    <footer className="border-t border-cyber-border py-4 mt-auto">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between text-xs text-text-muted font-[family-name:var(--theme-heading-font,var(--font-mono))]">
        <span>CoverYourATS v1.0</span>
        {hasData && (
          <button
            onClick={handleReset}
            className={`transition-colors cursor-pointer ${
              confirming
                ? 'text-neon-red hover:text-neon-red/80'
                : 'text-text-muted hover:text-neon-cyan'
            }`}
          >
            {confirming ? 'Sure? This clears everything.' : 'Start Over'}
          </button>
        )}
        <span>Beat the bots.</span>
      </div>
    </footer>
  )
}
