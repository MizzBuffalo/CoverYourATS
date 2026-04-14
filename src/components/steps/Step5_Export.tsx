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
        <h2 className="theme-label text-white text-lg mb-1">
          <span className="text-white">Step 5:</span>{' '}
          <span className="text-neon-cyan">Export Results</span>
        </h2>
        <p className="text-text-secondary text-sm">
          Your optimized resume and cover letter are ready. Copy or download below.
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
          ← Go Back
        </Button>
        <Button onClick={handleStartOver} variant="secondary" size="lg">
          Scan Another Job
        </Button>
      </div>
    </div>
  )
}
