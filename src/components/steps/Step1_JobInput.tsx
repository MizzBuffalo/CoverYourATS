import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useAppStore } from '../../stores/useAppStore'

export default function Step1_JobInput() {
  const nextStep = useAppStore((s) => s.nextStep)
  const jobRawText = useAppStore((s) => s.jobRawText)
  const setJobText = useAppStore((s) => s.setJobText)

  return (
    <div className="space-y-6 animate-[fade-in-up_0.3s_ease-out]">
      <div>
        <h2 className="font-mono text-neon-cyan text-lg uppercase tracking-wider mb-1">
          Step 1: Target Acquisition
        </h2>
        <p className="text-text-secondary text-sm">
          Paste the job posting below or upload a PDF/DOCX file.
        </p>
      </div>

      <Card>
        <textarea
          value={jobRawText || ''}
          onChange={(e) => setJobText(e.target.value)}
          placeholder="Paste the full job posting here..."
          className="w-full h-64 bg-cyber-dark border border-cyber-border rounded-sm p-4 font-mono text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-neon-cyan/50 transition-colors"
        />
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={nextStep}
          disabled={!jobRawText?.trim()}
          size="lg"
        >
          Scan Target →
        </Button>
      </div>
    </div>
  )
}
