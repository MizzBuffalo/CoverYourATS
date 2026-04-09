import type { MatchResult } from '../../types'
import { KeywordChip } from './KeywordChip'
import { CATEGORY_LABELS } from '../../config/constants'
import type { KeywordCategory } from '../../types'

interface KeywordGridProps {
  matchResults: MatchResult[]
  category: KeywordCategory
}

export function KeywordGrid({ matchResults, category }: KeywordGridProps) {
  const filtered = matchResults.filter((r) => r.keyword.category === category)
  if (filtered.length === 0) return null

  const matched = filtered.filter((r) => r.found)
  const missing = filtered.filter((r) => !r.found)

  return (
    <div className="space-y-2">
      <h4 className="font-mono text-xs text-text-muted uppercase tracking-wider">
        {CATEGORY_LABELS[category]}
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {matched.map((r) => (
          <KeywordChip
            key={r.keyword.keyword}
            keyword={r.keyword.keyword}
            matched={true}
            matchType={r.matchType}
          />
        ))}
        {missing.map((r) => (
          <KeywordChip
            key={r.keyword.keyword}
            keyword={r.keyword.keyword}
            matched={false}
          />
        ))}
      </div>
    </div>
  )
}
