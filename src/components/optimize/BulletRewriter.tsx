import type { RewrittenBullet } from '../../types'
import { Card } from '../ui/Card'
import { BulletDiff } from './BulletDiff'

interface BulletRewriterProps {
  bullets: RewrittenBullet[]
}

export function BulletRewriter({ bullets }: BulletRewriterProps) {
  if (bullets.length === 0) return null

  return (
    <Card>
      <h3 className="font-mono text-sm text-neon-cyan uppercase tracking-wider mb-4">
        Rewritten Bullets
      </h3>
      <div className="space-y-3">
        {bullets.map((b) => (
          <BulletDiff key={b.originalId} bullet={b} />
        ))}
      </div>
    </Card>
  )
}
