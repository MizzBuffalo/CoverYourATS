import { cn } from '../../lib/cn'
import { TerminalText } from './TerminalText'

interface ScanningOverlayProps {
  active: boolean
  messages: string[]
  onComplete?: () => void
  className?: string
}

export function ScanningOverlay({ active, messages, onComplete, className }: ScanningOverlayProps) {
  if (!active) return null

  return (
    <div
      className={cn(
        'absolute inset-0 z-40 flex flex-col items-center justify-center',
        'bg-cyber-black/90 backdrop-blur-sm',
        className
      )}
    >
      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-60"
          style={{ animation: 'scan-line 2s linear infinite' }}
        />
      </div>

      <div className="w-full max-w-md px-6">
        <TerminalText lines={messages} speed={25} onComplete={onComplete} />
      </div>
    </div>
  )
}
