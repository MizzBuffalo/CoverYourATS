import { cn } from '../../lib/cn'

interface TextPasteAreaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function TextPasteArea({ value, onChange, placeholder, className }: TextPasteAreaProps) {
  const charCount = value.length

  return (
    <div className={cn('relative', className)}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full h-64 bg-cyber-dark border border-cyber-border rounded-[var(--theme-radius)] p-4',
          'font-[family-name:var(--theme-heading-font,var(--font-mono))] text-sm text-text-primary placeholder:text-text-muted',
          'resize-none focus:outline-none focus:border-neon-cyan/50 transition-colors'
        )}
      />
      {charCount > 0 && (
        <span className="absolute bottom-3 right-3 text-xs font-[family-name:var(--theme-heading-font,var(--font-mono))] text-text-muted">
          {charCount.toLocaleString()} chars
        </span>
      )}
    </div>
  )
}
