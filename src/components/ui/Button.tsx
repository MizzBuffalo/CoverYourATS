import { cn } from '../../lib/cn'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'relative font-mono font-semibold uppercase tracking-wider transition-all duration-200',
        'border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
        {
          'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/50 hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,255,204,0.3)]':
            variant === 'primary',
          'bg-cyber-panel text-text-primary border-cyber-border hover:border-neon-cyan/50 hover:text-neon-cyan':
            variant === 'secondary',
          'bg-transparent text-text-secondary border-transparent hover:text-neon-cyan hover:border-neon-cyan/30':
            variant === 'ghost',
          'bg-neon-red/10 text-neon-red border-neon-red/50 hover:bg-neon-red/20 hover:shadow-[0_0_20px_rgba(255,0,64,0.3)]':
            variant === 'danger',
        },
        {
          'px-3 py-1.5 text-xs': size === 'sm',
          'px-5 py-2.5 text-sm': size === 'md',
          'px-8 py-3.5 text-base': size === 'lg',
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
