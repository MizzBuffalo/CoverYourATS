import { cn } from '../../lib/cn'

interface BadgeProps {
  variant?: 'cyan' | 'green' | 'red' | 'yellow' | 'muted'
  children: React.ReactNode
  className?: string
  pulse?: boolean
}

export function Badge({ variant = 'cyan', children, className, pulse = false }: BadgeProps) {
  const variants = {
    cyan: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
    green: 'bg-neon-green/10 text-neon-green border-neon-green/30',
    red: 'bg-neon-red/10 text-neon-red border-neon-red/30',
    yellow: 'bg-neon-yellow/10 text-neon-yellow border-neon-yellow/30',
    muted: 'bg-cyber-dark text-text-muted border-cyber-border',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-mono border rounded-sm',
        variants[variant],
        pulse && 'animate-[neon-pulse_2s_ease-in-out_infinite]',
        className
      )}
    >
      {children}
    </span>
  )
}
