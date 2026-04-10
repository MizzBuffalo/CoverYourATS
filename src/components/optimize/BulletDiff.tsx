import type { RewrittenBullet } from '../../types'
import { cn } from '../../lib/cn'

interface BulletDiffProps {
  bullet: RewrittenBullet
}

export function BulletDiff({ bullet }: BulletDiffProps) {
  return (
    <div className="border border-cyber-border rounded-[var(--theme-radius)] overflow-hidden">
      <div className="grid md:grid-cols-2 divide-x divide-cyber-border">
        <div className="p-3">
          <span className="text-[10px] theme-label text-neon-red block mb-1">
            Original
          </span>
          <p className="text-sm text-text-secondary">{bullet.original}</p>
        </div>
        <div className="p-3 bg-neon-green/[0.02]">
          <span className="text-[10px] theme-label text-neon-green block mb-1">
            Optimized
          </span>
          <p className="text-sm text-text-primary">{bullet.rewritten}</p>
          {bullet.incorporatedKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {bullet.incorporatedKeywords.map((kw) => (
                <span
                  key={kw}
                  className={cn(
                    'px-1.5 py-0.5 text-[10px] font-mono',
                    'bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-[var(--theme-radius)]'
                  )}
                >
                  +{kw}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
