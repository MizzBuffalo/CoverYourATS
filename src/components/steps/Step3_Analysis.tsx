import { useEffect, useState, useCallback, useRef } from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { useAppStore } from '../../stores/useAppStore'
import { ScanningOverlay } from '../animations/ScanningOverlay'
import { ScoreDashboard } from '../analysis/ScoreDashboard'
import { KeywordGrid } from '../analysis/KeywordGrid'
import { GapAlert } from '../analysis/GapAlert'
import { CustomKeywordInput } from '../analysis/CustomKeywordInput'
import { extractKeywords } from '../../services/keywords/extractionPipeline'
import { matchKeywordsAgainstResume } from '../../services/scoring/matchEngine'
import { scoreByCategoryFromResults } from '../../services/scoring/categoryScorer'
import { calculateOverallScore } from '../../services/scoring/overallScorer'
import { CATEGORY_ORDER } from '../../config/constants'

export default function Step3_Analysis() {
  const nextStep = useAppStore((s) => s.nextStep)
  const jobRawText = useAppStore((s) => s.jobRawText)
  const resumeRawText = useAppStore((s) => s.resumeRawText)
  const jobKeywords = useAppStore((s) => s.jobKeywords)
  const customKeywords = useAppStore((s) => s.customKeywords)
  const setJobKeywords = useAppStore((s) => s.setJobKeywords)
  const setAnalysis = useAppStore((s) => s.setAnalysis)
  const overallScore = useAppStore((s) => s.overallScore)
  const categoryScores = useAppStore((s) => s.categoryScores)
  const matchResults = useAppStore((s) => s.matchResults)
  const missingKeywords = useAppStore((s) => s.missingKeywords)

  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(overallScore !== null)
  const prevCustomCountRef = useRef(customKeywords.length)

  useEffect(() => {
    if (overallScore !== null) return // Already analyzed
    if (!jobRawText || !resumeRawText) return

    setIsScanning(true) // eslint-disable-line react-hooks/set-state-in-effect -- triggers scan animation on mount
  }, [jobRawText, resumeRawText, overallScore])

  // Re-score when custom keywords change (after initial analysis)
  useEffect(() => {
    if (!scanComplete || !resumeRawText) return
    if (customKeywords.length === prevCustomCountRef.current) return
    prevCustomCountRef.current = customKeywords.length

    // Merge extracted + custom, then re-match
    const allKeywords = [...jobKeywords, ...customKeywords]
    const results = matchKeywordsAgainstResume(allKeywords, resumeRawText)
    const catScores = scoreByCategoryFromResults(results)
    const overall = calculateOverallScore(catScores)

    setAnalysis({
      overallScore: overall,
      categoryScores: catScores,
      matchResults: results,
      matchedKeywords: results.filter((r) => r.found).map((r) => r.keyword),
      missingKeywords: results.filter((r) => !r.found).map((r) => r.keyword),
    })
  }, [customKeywords, scanComplete, jobKeywords, resumeRawText, setAnalysis])

  const runAnalysis = useCallback(async () => {
    if (!jobRawText || !resumeRawText) return

    const keywords = await extractKeywords(jobRawText)
    setJobKeywords(keywords)

    // Include any pre-existing custom keywords
    const allKeywords = [...keywords, ...customKeywords]
    const results = matchKeywordsAgainstResume(allKeywords, resumeRawText)
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
  }, [jobRawText, resumeRawText, customKeywords, setJobKeywords, setAnalysis])

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
        <h2 className="theme-label text-neon-cyan text-lg mb-1">
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
            <CustomKeywordInput />
          </Card>

          <Card>
            <h3 className="theme-label text-sm text-neon-cyan mb-4">
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
