import { cn } from '../../lib/cn'

interface ProgressBarProps {
  value: number // 0-100
  label?: string
  showPercent?: boolean
  color?: 'cyan' | 'green' | 'red' | 'yellow'
  animate?: boolean
  className?: string
}

export function ProgressBar({
  value,
  label,
  showPercent = true,
  color = 'cyan',
  animate = true,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  const barColors = {
    cyan: 'bg-neon-cyan shadow-[0_0_10px_rgba(0,255,204,0.5)]',
    green: 'bg-neon-green shadow-[0_0_10px_rgba(57,255,20,0.5)]',
    red: 'bg-neon-red shadow-[0_0_10px_rgba(255,0,64,0.5)]',
    yellow: 'bg-neon-yellow shadow-[0_0_10px_rgba(255,204,0,0.5)]',
  }

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-text-secondary font-mono">{label}</span>}
          {showPercent && (
            <span className="text-sm font-mono text-neon-cyan">{Math.round(clamped)}%</span>
          )}
        </div>
      )}
      <div className="h-2 bg-cyber-dark rounded-sm overflow-hidden border border-cyber-border">
        <div
          className={cn(
            'h-full rounded-sm transition-all duration-700 ease-out',
            barColors[color],
            animate && 'animate-[bar-fill_1s_ease-out]'
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
