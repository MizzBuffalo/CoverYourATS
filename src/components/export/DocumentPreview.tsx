import type { RewrittenBullet, CategoryScore } from '../../types'
import { Card } from '../ui/Card'
import { CopyButton } from './CopyButton'
import { cn } from '../../lib/cn'

interface DocumentPreviewProps {
  overallScore: number | null
  afterOverallScore: number | null
  categoryScores: CategoryScore[]
  rewrittenBullets: RewrittenBullet[]
  coverLetter: string | null
}

export function DocumentPreview({
  overallScore,
  afterOverallScore,
  categoryScores,
  rewrittenBullets,
  coverLetter,
}: DocumentPreviewProps) {
  return (
    <div className="space-y-4">
      {/* Score Summary */}
      {overallScore !== null && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-mono text-xs text-neon-cyan uppercase tracking-wider">
              Score Summary
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-muted font-mono text-xs">BEFORE</span>
              <p className="text-xl font-mono font-bold text-neon-red">{overallScore}%</p>
            </div>
            {afterOverallScore !== null && (
              <div>
                <span className="text-text-muted font-mono text-xs">AFTER</span>
                <p className={cn(
                  'text-xl font-mono font-bold',
                  afterOverallScore >= 80 ? 'text-neon-green' : 'text-neon-yellow'
                )}>
                  {afterOverallScore}%
                </p>
              </div>
            )}
          </div>
          {categoryScores.length > 0 && (
            <div className="mt-3 space-y-1">
              {categoryScores.filter((cs) => cs.total > 0).map((cs) => (
                <div key={cs.category} className="flex justify-between text-xs font-mono">
                  <span className="text-text-muted">{cs.category.replace('_', ' ').toUpperCase()}</span>
                  <span className="text-text-secondary">{cs.matched.length}/{cs.total}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Rewritten Bullets */}
      {rewrittenBullets.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-mono text-xs text-neon-cyan uppercase tracking-wider">
              Optimized Bullets
            </h4>
            <CopyButton
              text={rewrittenBullets.map((b) => `• ${b.rewritten}`).join('\n')}
              label="Copy All"
            />
          </div>
          <div className="space-y-2">
            {rewrittenBullets.map((bullet) => (
              <div
                key={bullet.originalId}
                className="flex items-start gap-2 group"
              >
                <span className="text-neon-green text-xs mt-1 shrink-0">•</span>
                <p className="text-sm text-text-primary flex-1">{bullet.rewritten}</p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <CopyButton text={bullet.rewritten} label="Copy" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Cover Letter */}
      {coverLetter && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-mono text-xs text-neon-cyan uppercase tracking-wider">
              Cover Letter
            </h4>
            <CopyButton text={coverLetter} label="Copy Letter" />
          </div>
          <div className="bg-cyber-dark border border-cyber-border rounded-sm p-4 whitespace-pre-wrap text-sm text-text-primary leading-relaxed max-h-64 overflow-y-auto">
            {coverLetter}
          </div>
        </Card>
      )}
    </div>
  )
}
