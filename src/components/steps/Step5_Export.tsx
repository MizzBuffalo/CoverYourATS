import { useAppStore } from '../../stores/useAppStore'
import { Button } from '../ui/Button'

export default function Step5_Export() {
  const reset = useAppStore((s) => s.reset)

  return (
    <div className="space-y-6 animate-[fade-in-up_0.3s_ease-out]">
      <div>
        <h2 className="font-mono text-neon-cyan text-lg uppercase tracking-wider mb-1">
          Step 5: Export Results
        </h2>
        <p className="text-text-secondary text-sm">
          Copy your optimized content or download a PDF report.
        </p>
      </div>

      <div className="text-center py-20 text-text-muted font-mono">
        [ Export panel coming next ]
      </div>

      <div className="flex justify-end">
        <Button onClick={reset} variant="secondary" size="lg">
          Start New Scan
        </Button>
      </div>
    </div>
  )
}
