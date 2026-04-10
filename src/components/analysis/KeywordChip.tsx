import { cn } from '../../lib/cn'

interface KeywordChipProps {
  keyword: string
  matched: boolean
  matchType?: string
  className?: string
}

export function KeywordChip({ keyword, matched, matchType, className }: KeywordChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono border rounded-[var(--theme-radius)] transition-all',
        matched
          ? 'bg-neon-green/10 text-neon-green border-neon-green/30'
          : 'bg-neon-red/10 text-neon-red border-neon-red/30 animate-[neon-pulse_2s_ease-in-out_infinite]',
        className
      )}
      title={matchType ? `Match type: ${matchType}` : undefined}
    >
      <span className="text-[10px]">{matched ? '●' : '○'}</span>
      {keyword}
    </span>
  )
}
