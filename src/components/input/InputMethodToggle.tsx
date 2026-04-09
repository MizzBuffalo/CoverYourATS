import { cn } from '../../lib/cn'

interface InputMethodToggleProps {
  method: 'paste' | 'upload'
  onChange: (method: 'paste' | 'upload') => void
  className?: string
}

export function InputMethodToggle({ method, onChange, className }: InputMethodToggleProps) {
  return (
    <div className={cn('flex border border-cyber-border rounded-sm overflow-hidden', className)}>
      <button
        onClick={() => onChange('paste')}
        className={cn(
          'flex-1 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors',
          method === 'paste'
            ? 'bg-neon-cyan/10 text-neon-cyan border-r border-cyber-border'
            : 'text-text-muted hover:text-text-secondary border-r border-cyber-border'
        )}
      >
        Paste Text
      </button>
      <button
        onClick={() => onChange('upload')}
        className={cn(
          'flex-1 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors',
          method === 'upload'
            ? 'bg-neon-cyan/10 text-neon-cyan'
            : 'text-text-muted hover:text-text-secondary'
        )}
      >
        Upload File
      </button>
    </div>
  )
}
