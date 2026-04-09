import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useAppStore } from '../../stores/useAppStore'

export default function Step2_ResumeInput() {
  const nextStep = useAppStore((s) => s.nextStep)
  const resumeRawText = useAppStore((s) => s.resumeRawText)
  const setResumeText = useAppStore((s) => s.setResumeText)

  return (
    <div className="space-y-6 animate-[fade-in-up_0.3s_ease-out]">
      <div>
        <h2 className="font-mono text-neon-cyan text-lg uppercase tracking-wider mb-1">
          Step 2: Load Your Profile
        </h2>
        <p className="text-text-secondary text-sm">
          Paste your resume below or upload a PDF/DOCX file.
        </p>
      </div>

      <Card>
        <textarea
          value={resumeRawText || ''}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume content here..."
          className="w-full h-64 bg-cyber-dark border border-cyber-border rounded-sm p-4 font-mono text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-neon-cyan/50 transition-colors"
        />
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={nextStep}
          disabled={!resumeRawText?.trim()}
          size="lg"
        >
          Analyze Profile →
        </Button>
      </div>
    </div>
  )
}
