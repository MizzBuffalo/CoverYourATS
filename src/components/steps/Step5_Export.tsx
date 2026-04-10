import { useAppStore } from '../../stores/useAppStore'
import { Button } from '../ui/Button'
import { ExportPanel } from '../export/ExportPanel'
import { DocumentPreview } from '../export/DocumentPreview'

export default function Step5_Export() {
  const setStep = useAppStore((s) => s.setStep)
  const fullReset = useAppStore((s) => s.fullReset)
  const overallScore = useAppStore((s) => s.overallScore)
  const afterOverallScore = useAppStore((s) => s.afterOverallScore)
  const categoryScores = useAppStore((s) => s.categoryScores)
  const afterCategoryScores = useAppStore((s) => s.afterCategoryScores)
  const rewrittenBullets = useAppStore((s) => s.rewrittenBullets)
  const coverLetter = useAppStore((s) => s.coverLetter)
  const missingKeywords = useAppStore((s) => s.missingKeywords)

  const handleStartOver = () => {
    fullReset()
  }

  return (
    <div className="space-y-6 animate-[fade-in-up_0.3s_ease-out]">
      <div>
        <h2 className="theme-label text-neon-cyan text-lg mb-1">
          Step 5: Export Results
        </h2>
        <p className="text-text-secondary text-sm">
          Copy your optimized content or download a PDF report.
        </p>
      </div>

      {/* Export Actions */}
      <ExportPanel
        overallScore={overallScore}
        afterOverallScore={afterOverallScore}
        categoryScores={afterCategoryScores.length > 0 ? afterCategoryScores : categoryScores}
        rewrittenBullets={rewrittenBullets}
        coverLetter={coverLetter}
        missingKeywords={missingKeywords}
      />

      {/* Document Preview */}
      <DocumentPreview
        overallScore={overallScore}
        afterOverallScore={afterOverallScore}
        categoryScores={afterCategoryScores.length > 0 ? afterCategoryScores : categoryScores}
        rewrittenBullets={rewrittenBullets}
        coverLetter={coverLetter}
      />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button onClick={() => setStep(4)} variant="ghost" size="lg">
          ← Back to Optimize
        </Button>
        <Button onClick={handleStartOver} variant="secondary" size="lg">
          Start New Scan
        </Button>
      </div>
    </div>
  )
}
