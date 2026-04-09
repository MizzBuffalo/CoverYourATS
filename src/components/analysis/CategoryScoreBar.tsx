import type { CategoryScore } from '../../types'
import { ProgressBar } from '../ui/ProgressBar'
import { CATEGORY_LABELS } from '../../config/constants'

interface CategoryScoreBarProps {
  categoryScore: CategoryScore
}

export function CategoryScoreBar({ categoryScore }: CategoryScoreBarProps) {
  const { category, matched, total, score } = categoryScore
  if (total === 0) return null

  const color = score >= 80 ? 'green' : score >= 50 ? 'yellow' : 'red'

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-mono text-text-primary">
          {CATEGORY_LABELS[category]}
        </span>
        <span className="text-xs font-mono text-text-muted">
          {matched.length}/{total} matched
        </span>
      </div>
      <ProgressBar value={score} showPercent={true} color={color} />
    </div>
  )
}
