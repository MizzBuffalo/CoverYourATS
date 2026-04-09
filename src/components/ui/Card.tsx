import { cn } from '../../lib/cn'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  glowColor?: 'cyan' | 'green' | 'red'
}

export function Card({ glow = false, glowColor = 'cyan', className, children, ...props }: CardProps) {
  const glowColors = {
    cyan: 'shadow-[0_0_15px_rgba(0,255,204,0.15)] border-neon-cyan/30',
    green: 'shadow-[0_0_15px_rgba(57,255,20,0.15)] border-neon-green/30',
    red: 'shadow-[0_0_15px_rgba(255,0,64,0.15)] border-neon-red/30',
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
