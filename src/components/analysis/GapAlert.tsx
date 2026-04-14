import type { ExtractedKeyword } from '../../types'
import { Card } from '../ui/Card'

interface GapAlertProps {
  missingKeywords: ExtractedKeyword[]
  maxShow?: number
}

export function GapAlert({ missingKeywords, maxShow = 5 }: GapAlertProps) {
  if (missingKeywords.length === 0) return null

  const critical = missingKeywords
    .sort((a, b) => b.importance - a.importance)
    .slice(0, maxShow)

  return (
    <Card glow glowColor="red" className="border-neon-red/40">
      <div className="flex items-start gap-3">
        <span className="text-neon-red text-lg animate-[threat-flash_1.5s_ease-in-out_infinite]">
          ⚠
        </span>
        <div className="space-y-2 flex-1">
          <h4 className="theme-label text-sm text-neon-red">
            High-Priority Gaps
          </h4>
          <p className="text-xs text-text-secondary">
            These high-priority keywords are missing from your resume:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {critical.map((kw) => (
              <span
                key={kw.keyword}
                className="px-2 py-0.5 text-xs font-mono bg-neon-red/10 text-neon-red border border-neon-red/30 rounded-[var(--theme-radius)] animate-[threat-flash_1.5s_ease-in-out_infinite]"
              >
                {kw.keyword}
              </span>
            ))}
          </div>
          {missingKeywords.length > maxShow && (
            <p className="text-xs text-text-muted font-[family-name:var(--theme-heading-font,var(--font-mono))]">
              + {missingKeywords.length - maxShow} more missing keywords
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
