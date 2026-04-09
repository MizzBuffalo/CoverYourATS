import { cn } from '../../lib/cn'

interface ScoreComparisonProps {
  beforeScore: number
  afterScore: number
}

export function ScoreComparison({ beforeScore, afterScore }: ScoreComparisonProps) {
  const improvement = afterScore - beforeScore

  return (
    <div className="flex items-center justify-center gap-6">
      <div className="text-center">
        <p className="text-xs font-mono text-text-muted uppercase mb-1">Before</p>
        <div className="w-20 h-20 rounded-full border-2 border-neon-red/50 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,64,0.2)]">
          <span className="text-2xl font-mono font-bold text-neon-red">{beforeScore}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-neon-cyan font-mono text-lg">→</span>
        {improvement > 0 && (
          <span className="text-xs font-mono text-neon-green">+{improvement}</span>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs font-mono text-text-muted uppercase mb-1">After</p>
        <div className={cn(
          'w-20 h-20 rounded-full border-2 flex items-center justify-center',
          afterScore >= 80
            ? 'border-neon-green/50 shadow-[0_0_15px_rgba(57,255,20,0.2)]'
            : 'border-neon-yellow/50 shadow-[0_0_15px_rgba(255,204,0,0.2)]'
        )}>
          <span className={cn(
            'text-2xl font-mono font-bold',
            afterScore >= 80 ? 'text-neon-green' : 'text-neon-yellow'
          )}>
            {afterScore}
          </span>
        </div>
      </div>
    </div>
  )
}
