import { useState } from 'react'
import { GlitchText } from '../animations/GlitchText'
import { ThemePicker } from '../ui/ThemePicker'
import { useAppStore } from '../../stores/useAppStore'

export function Header() {
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
    <header className="border-b border-cyber-border bg-cyber-black/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-neon-cyan/50 rounded-[var(--theme-radius)] flex items-center justify-center">
            <span className="text-neon-cyan text-xs font-[family-name:var(--theme-heading-font,var(--font-mono))] font-bold">ATS</span>
          </div>
          <GlitchText
            text="CoverYourATS"
            as="h1"
            className="text-lg text-neon-cyan tracking-wider"
            active={false}
          />
        </div>
        <div className="flex items-center gap-4">
          {hasData && (
            <button
              onClick={handleReset}
              className={`text-xs font-[family-name:var(--theme-heading-font,var(--font-mono))] px-3 py-1.5 border rounded-[var(--theme-radius)] transition-all cursor-pointer ${
                confirming
                  ? 'text-neon-red border-neon-red/50 bg-neon-red/10 hover:bg-neon-red/20'
                  : 'text-text-muted border-cyber-border hover:text-neon-cyan hover:border-neon-cyan/50'
              }`}
            >
              {confirming ? 'Sure? This clears everything.' : 'Start Over'}
            </button>
          )}
          <ThemePicker />
        </div>
      </div>
    </header>
  )
}
