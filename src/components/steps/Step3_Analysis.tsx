import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { useAppStore } from '../../stores/useAppStore'
import { ScanningOverlay } from '../animations/ScanningOverlay'
import { ScoreDashboard } from '../analysis/ScoreDashboard'
import { KeywordGrid } from '../analysis/KeywordGrid'
import { GapAlert } from '../analysis/GapAlert'
import { extractKeywords } from '../../services/keywords/extractionPipeline'
import { matchKeywordsAgainstResume } from '../../services/scoring/matchEngine'
import { scoreByCategoryFromResults } from '../../services/scoring/categoryScorer'
import { calculateOverallScore } from '../../services/scoring/overallScorer'
import { CATEGORY_ORDER } from '../../config/constants'

export default function Step3_Analysis() {
  const nextStep = useAppStore((s) => s.nextStep)
  const jobRawText = useAppStore((s) => s.jobRawText)
  const resumeRawText = useAppStore((s) => s.resumeRawText)
  const setJobKeywords = useAppStore((s) => s.setJobKeywords)
  const setAnalysis = useAppStore((s) => s.setAnalysis)
  const overallScore = useAppStore((s) => s.overallScore)
  const categoryScores = useAppStore((s) => s.categoryScores)
  const matchResults = useAppStore((s) => s.matchResults)
  const missingKeywords = useAppStore((s) => s.missingKeywords)

  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(overallScore !== null)

  useEffect(() => {
    if (overallScore !== null) return // Already analyzed
    if (!jobRawText || !resumeRawText) return

    setIsScanning(true)
  }, [jobRawText, resumeRawText, overallScore])

  const runAnalysis = async () => {
    if (!jobRawText || !resumeRawText) return

    const keywords = await extractKeywords(jobRawText)
    setJobKeywords(keywords)

    const results = matchKeywordsAgainstResume(keywords, resumeRawText)
    const catScores = scoreByCategoryFromResults(results)
    const overall = calculateOverallScore(catScores)

    const matched = results.filter((r) => r.found).map((r) => r.keyword)
    const missing = results.filter((r) => !r.found).map((r) => r.keyword)

    setAnalysis({
      overallScore: overall,
      categoryScores: catScores,
      matchResults: results,
      matchedKeywords: matched,
      missingKeywords: missing,
    })

    setScanComplete(true)
  }

  const handleScanComplete = () => {
    setIsScanning(false)
    runAnalysis()
  }

  const scanMessages = [
    'SCANNING TARGET POSTING...',
    'EXTRACTING KEYWORDS...',
    'ANALYZING CANDIDATE PROFILE...',
    `GAPS DETECTED: ANALYZING ${resumeRawText?.split(/\s+/).length || 0} WORDS`,
    'COMPUTING MATCH SCORE...',
  ]

  return (
    <div className="space-y-6 animate-[fade-in-up_0.3s_ease-out] relative">
      <div>
        <h2 className="font-mono text-neon-cyan text-lg uppercase tracking-wider mb-1">
          Step 3: Gap Analysis
        </h2>
        <p className="text-text-secondary text-sm">
          {scanComplete
            ? 'Analysis complete. Review your keyword match scores below.'
            : 'Scanning your profile against target requirements...'}
        </p>
      </div>

      <ScanningOverlay
        active={isScanning}
        messages={scanMessages}
        onComplete={handleScanComplete}
      />

      {scanComplete && overallScore !== null && (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <Card glow>
              <ScoreDashboard
                overallScore={overallScore}
                categoryScores={categoryScores}
              />
            </Card>

            <div className="space-y-4">
              <GapAlert missingKeywords={missingKeywords} maxShow={8} />
            </div>
          </div>

          <Card>
            <h3 className="font-mono text-sm text-neon-cyan uppercase tracking-wider mb-4">
              Keyword Breakdown
            </h3>
            <div className="space-y-4">
              {CATEGORY_ORDER.map((cat) => (
                <KeywordGrid key={cat} matchResults={matchResults} category={cat} />
              ))}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button onClick={nextStep} size="lg">
              Optimize →
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
