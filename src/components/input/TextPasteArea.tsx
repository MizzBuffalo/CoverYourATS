import { cn } from '../../lib/cn'

const MAX_CHARS = 50_000

interface TextPasteAreaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function TextPasteArea({ value, onChange, placeholder, className }: TextPasteAreaProps) {
  const charCount = value.length
  const isOverLimit = charCount > MAX_CHARS

  const handleChange = (text: string) => {
    if (text.length > MAX_CHARS) {
      onChange(text.slice(0, MAX_CHARS))
    } else {
      onChange(text)
    }
  }

  return (
    <div className={cn('relative', className)}>
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        maxLength={MAX_CHARS}
        className={cn(
          'w-full h-64 bg-cyber-dark border border-cyber-border rounded-[var(--theme-radius)] p-4',
          'font-[family-name:var(--theme-heading-font,var(--font-mono))] text-sm text-text-primary placeholder:text-text-muted',
          'resize-none focus:outline-none focus:border-neon-cyan/50 transition-colors',
          isOverLimit && 'border-neon-red/50'
        )}
      />
      {charCount > 0 && (
        <span
          className={cn(
            'absolute bottom-3 right-3 text-xs font-[family-name:var(--theme-heading-font,var(--font-mono))]',
            isOverLimit ? 'text-neon-red' : 'text-text-muted'
          )}
        >
          {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </span>
      )}
    </div>
  )
}
