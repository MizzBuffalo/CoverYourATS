import { cn } from '../../lib/cn'

interface NeonBorderProps {
  color?: 'cyan' | 'green' | 'red'
  animate?: boolean
  children: React.ReactNode
  className?: string
}

export function NeonBorder({ color = 'cyan', animate = true, children, className }: NeonBorderProps) {
  const borderColors = {
    cyan: 'border-neon-cyan/40',
    green: 'border-neon-green/40',
    red: 'border-neon-red/40',
  }

  return (
    <div
      className={cn(
        'border rounded-[var(--theme-radius)]',
        borderColors[color],
        animate && 'animate-[border-glow_3s_ease-in-out_infinite]',
        className
      )}
    >
      {children}
    </div>
  )
}
