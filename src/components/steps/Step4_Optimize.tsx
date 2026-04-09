import { Button } from '../ui/Button'
import { useAppStore } from '../../stores/useAppStore'

export default function Step4_Optimize() {
  const nextStep = useAppStore((s) => s.nextStep)

  return (
    <div className="space-y-6 animate-[fade-in-up_0.3s_ease-out]">
      <div>
        <h2 className="font-mono text-neon-cyan text-lg uppercase tracking-wider mb-1">
          Step 4: Rewrite & Optimize
        </h2>
        <p className="text-text-secondary text-sm">
          AI-powered resume bullet rewrites and cover letter generation.
        </p>
      </div>

      <div className="text-center py-20 text-text-muted font-mono">
        [ AI optimization panel coming next ]
      </div>

      <div className="flex justify-end">
        <Button onClick={nextStep} size="lg">
          Export →
        </Button>
      </div>
    </div>
  )
}
