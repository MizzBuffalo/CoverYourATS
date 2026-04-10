import { cn } from '../../lib/cn'
import type { CategoryScore } from '../../types'
import { CategoryScoreBar } from './CategoryScoreBar'

interface ScoreDashboardProps {
  overallScore: number
  categoryScores: CategoryScore[]
}

export function ScoreDashboard({ overallScore, categoryScores }: ScoreDashboardProps) {
  const scoreColor =
    overallScore >= 80
      ? 'text-neon-green'
      : overallScore >= 50
        ? 'text-neon-yellow'
        : 'text-neon-red'

  const glowColor =
    overallScore >= 80
      ? 'shadow-[0_0_30px_rgba(var(--glow-green),0.3)]'
      : overallScore >= 50
        ? 'shadow-[0_0_30px_rgba(var(--glow-yellow),0.3)]'
        : 'shadow-[0_0_30px_rgba(var(--glow-red),0.3)]'

  const threatLevel =
    overallScore >= 80
      ? 'LOW'
      : overallScore >= 60
        ? 'MODERATE'
        : overallScore >= 40
          ? 'HIGH'
          : 'CRITICAL'

  return (
    <div className="space-y-6">
      {/* Overall score circle */}
      <div className="flex flex-col items-center gap-2">
        <div
          className={cn(
            'w-32 h-32 rounded-full border-2 flex flex-col items-center justify-center',
            scoreColor,
            glowColor
          )}
          style={{ borderColor: 'currentColor' }}
        >
          <span className={cn('text-4xl font-[family-name:var(--theme-heading-font,var(--font-mono))] font-bold', scoreColor)}>
            {overallScore}
          </span>
          <span className="text-xs font-[family-name:var(--theme-heading-font,var(--font-mono))] text-text-muted">/ 100</span>
        </div>
        <div className="text-center">
          <p className="theme-label text-xs text-text-muted">
            ATS Match Score
          </p>
          <p className={cn('text-sm font-[family-name:var(--theme-heading-font,var(--font-mono))] font-bold', scoreColor)}>
            THREAT LEVEL: {threatLevel}
          </p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="space-y-4">
        {categoryScores.map((cs) => (
          <CategoryScoreBar key={cs.category} categoryScore={cs} />
        ))}
      </div>
    </div>
  )
}
