import { Button } from '../ui/Button'
import { useAppStore } from '../../stores/useAppStore'

export default function Step3_Analysis() {
  const nextStep = useAppStore((s) => s.nextStep)

  return (
    <div className="space-y-6 animate-[fade-in-up_0.3s_ease-out]">
      <div>
        <h2 className="font-mono text-neon-cyan text-lg uppercase tracking-wider mb-1">
          Step 3: Gap Analysis
        </h2>
        <p className="text-text-secondary text-sm">
          Scanning your profile against target requirements...
        </p>
      </div>

      <div className="text-center py-20 text-text-muted font-mono">
        [ Analysis dashboard coming next ]
      </div>

      <div className="flex justify-end">
        <Button onClick={nextStep} size="lg">
          Optimize →
        </Button>
      </div>
    </div>
  )
}
