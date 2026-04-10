import { cn } from '../../lib/cn'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  glowColor?: 'cyan' | 'green' | 'red'
}

export function Card({ glow = false, glowColor = 'cyan', className, children, ...props }: CardProps) {
  const glowColors = {
    cyan: 'shadow-[0_0_15px_rgba(var(--glow-cyan),0.15)] border-neon-cyan/30',
    green: 'shadow-[0_0_15px_rgba(var(--glow-green),0.15)] border-neon-green/30',
    red: 'shadow-[0_0_15px_rgba(var(--glow-red),0.15)] border-neon-red/30',
  }

  return (
    <div
      className={cn(
        'bg-cyber-panel border border-cyber-border rounded-sm p-4',
        glow && glowColors[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
