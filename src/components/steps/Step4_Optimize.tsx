import { useState, useCallback } from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { useAppStore } from '../../stores/useAppStore'
import { ScanningOverlay } from '../animations/ScanningOverlay'
import { AIStatusIndicator } from '../optimize/AIStatusIndicator'
import { BulletRewriter } from '../optimize/BulletRewriter'
import { CoverLetterPanel } from '../optimize/CoverLetterPanel'
import { ManualPromptFallback } from '../optimize/ManualPromptFallback'
import { ScoreComparison } from '../analysis/ScoreComparison'
import { callAI } from '../../services/ai/aiClient'
import { buildBulletRewritePrompt } from '../../services/ai/prompts/bulletRewrite'
import { buildCoverLetterPrompt } from '../../services/ai/prompts/coverLetter'
import {
  generateFallbackRewritePrompt,
  generateFallbackCoverLetterPrompt,
} from '../../services/ai/fallbackPromptGenerator'
import { extractBulletsFromText } from '../../lib/extractBullets'
import { matchKeywordsAgainstResume } from '../../services/scoring/matchEngine'
import { scoreByCategoryFromResults } from '../../services/scoring/categoryScorer'
import { calculateOverallScore } from '../../services/scoring/overallScorer'
import type { RewrittenBullet } from '../../types'

type AIStatus = 'idle' | 'loading' | 'success' | 'error' | 'rate_limited'

export default function Step4_Optimize() {
  const nextStep = useAppStore((s) => s.nextStep)
  const resumeRawText = useAppStore((s) => s.resumeRawText)
  const resumeBullets = useAppStore((s) => s.resumeBullets)
  const jobRawText = useAppStore((s) => s.jobRawText)
  const jobKeywords = useAppStore((s) => s.jobKeywords)
  const missingKeywords = useAppStore((s) => s.missingKeywords)
  const matchedKeywords = useAppStore((s) => s.matchedKeywords)
  const overallScore = useAppStore((s) => s.overallScore)
  const rewrittenBullets = useAppStore((s) => s.rewrittenBullets)
  const coverLetter = useAppStore((s) => s.coverLetter)
  const setRewrittenBullets = useAppStore((s) => s.setRewrittenBullets)
  const setCoverLetter = useAppStore((s) => s.setCoverLetter)
  const setResumeBullets = useAppStore((s) => s.setResumeBullets)
  const afterOverallScore = useAppStore((s) => s.afterOverallScore)
  const setAfterAnalysis = useAppStore((s) => s.setAfterAnalysis)

  const [aiStatus, setAIStatus] = useState<AIStatus>(
    rewrittenBullets.length > 0 || coverLetter ? 'success' : 'idle'
  )
  const [remaining, setRemaining] = useState<number | undefined>()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  // Extract bullets from raw text if not already done
  const getBullets = useCallback(() => {
    if (resumeBullets.length > 0) return resumeBullets
    if (!resumeRawText) return []
    const extracted = extractBulletsFromText(resumeRawText)
    setResumeBullets(extracted)
    return extracted
  }, [resumeBullets, resumeRawText, setResumeBullets])

  const hasResults = rewrittenBullets.length > 0 || coverLetter

  const runOptimization = async () => {
    if (!resumeRawText || !jobRawText || missingKeywords.length === 0) return

    const bullets = getBullets()
    if (bullets.length === 0) return

    setAIStatus('loading')
    setErrorMessage(null)
    setIsScanning(true)
  }

  const handleScanComplete = async () => {
    setIsScanning(false)
    await executeAICalls()
  }

  const executeAICalls = async () => {
    const bullets = getBullets()
    if (!resumeRawText || !jobRawText) return

    // Run bullet rewrite and cover letter in parallel
    const rewritePrompt = buildBulletRewritePrompt(bullets, missingKeywords)
    const coverLetterPrompt = buildCoverLetterPrompt(
      jobRawText,
      resumeRawText,
      matchedKeywords,
      missingKeywords
    )

    const [rewriteResult, coverLetterResult] = await Promise.all([
      callAI('bullet_rewrite', rewritePrompt),
      callAI('cover_letter', coverLetterPrompt),
    ])

    // Handle rate limiting
    if (rewriteResult.rateLimited || coverLetterResult.rateLimited) {
      setAIStatus('rate_limited')
      setRemaining(rewriteResult.remaining ?? coverLetterResult.remaining)
      setErrorMessage('Rate limit reached. Use the prompts below to get results from your own AI.')
      return
    }

    let gotResults = false

    // Process bullet rewrites
    if (rewriteResult.success && rewriteResult.data) {
      try {
        const parsed = parseBulletRewriteResponse(rewriteResult.data, bullets)
        if (parsed.length > 0) {
          setRewrittenBullets(parsed)
          gotResults = true
          reScoreWithRewrites(parsed)
        } else {
          setErrorMessage('AI returned empty bullet rewrites. Try again or use the prompt below.')
        }
      } catch {
        setErrorMessage('AI returned unexpected format for bullet rewrites. Try again or use the prompt below.')
      }
    } else if (rewriteResult.error) {
      const err = rewriteResult.error
      // Friendly messages for common errors
      if (err.includes('503') || err.includes('overloaded') || err.includes('UNAVAILABLE')) {
        setErrorMessage("Google's AI is busy right now. Try again in a minute or use the Copy Prompt button below.")
      } else if (err.includes('timed out') || err.includes('timeout')) {
        setErrorMessage('AI request timed out. Try again or use the Copy Prompt button below.')
      } else {
        setErrorMessage(err)
      }
    }

    // Process cover letter
    if (coverLetterResult.success && coverLetterResult.data) {
      const letterText =
        typeof coverLetterResult.data === 'string'
          ? coverLetterResult.data
          : String(coverLetterResult.data)
      setCoverLetter(letterText)
      gotResults = true
    } else if (coverLetterResult.error && !errorMessage) {
      const err = coverLetterResult.error
      if (err.includes('503') || err.includes('overloaded') || err.includes('UNAVAILABLE')) {
        setErrorMessage("Google's AI is busy right now. Try again in a minute or use the Copy Prompt button below.")
      }
    }

    if (gotResults) {
      setAIStatus('success')
      setRemaining(rewriteResult.remaining ?? coverLetterResult.remaining)
    } else {
      setAIStatus('error')
      if (!errorMessage) {
        setErrorMessage('AI optimization failed. Try again or use the prompts below.')
      }
    }
  }

  const parseBulletRewriteResponse = (
    data: unknown,
    bullets: { id: string; text: string; sectionName: string }[]
  ): RewrittenBullet[] => {
    let items: Array<Record<string, unknown>>

    if (typeof data === 'string') {
      // Extract JSON array from the string — Gemini often wraps in markdown or adds text
      let cleaned = data
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim()

      // If there's text before/after the JSON, extract just the array
      const arrayStart = cleaned.indexOf('[')
      const arrayEnd = cleaned.lastIndexOf(']')
      if (arrayStart !== -1 && arrayEnd > arrayStart) {
        cleaned = cleaned.slice(arrayStart, arrayEnd + 1)
      }

      const parsed = JSON.parse(cleaned)
      // Handle object wrapper: { bullets: [...] }, { rewrites: [...] }, { results: [...] }
      if (Array.isArray(parsed)) {
        items = parsed
      } else if (parsed && typeof parsed === 'object') {
        const arr = Object.values(parsed).find(Array.isArray)
        if (arr) {
          items = arr as Array<Record<string, unknown>>
        } else {
          throw new Error('No array found in response')
        }
      } else {
        throw new Error('Unexpected JSON format')
      }
    } else if (Array.isArray(data)) {
      items = data
    } else if (data && typeof data === 'object') {
      const arr = Object.values(data).find(Array.isArray)
      if (arr) {
        items = arr as Array<Record<string, unknown>>
      } else {
        throw new Error('Unexpected response format')
      }
    } else {
      throw new Error('Unexpected response format')
    }

    return items
      .filter((item) => item.rewritten || item.rewritten_text || item.new_text || item.revised)
      .map((item, idx) => {
        const bulletIdx = ((item.index as number) ?? idx + 1) - 1
        const originalBullet = bullets[bulletIdx]
        const rewrittenText = (item.rewritten ?? item.rewritten_text ?? item.new_text ?? item.revised) as string
        const keywords = (item.keywords_added ?? item.keywords ?? item.added_keywords ?? []) as string[]
        return {
          originalId: originalBullet?.id ?? `bullet-${idx}`,
          original: originalBullet?.text ?? (item.original as string) ?? '',
          rewritten: rewrittenText,
          incorporatedKeywords: keywords,
        }
      })
  }

  const reScoreWithRewrites = (rewrites: RewrittenBullet[]) => {
    if (!resumeRawText) return

    // Replace original bullet text with rewritten versions
    let augmentedText = resumeRawText
    for (const rw of rewrites) {
      if (rw.original && augmentedText.includes(rw.original)) {
        augmentedText = augmentedText.replace(rw.original, rw.rewritten)
      } else {
        augmentedText += '\n' + rw.rewritten
      }
    }

    const newResults = matchKeywordsAgainstResume(jobKeywords, augmentedText)
    const newCatScores = scoreByCategoryFromResults(newResults)
    const newOverall = calculateOverallScore(newCatScores)

    setAfterAnalysis({
      overallScore: newOverall,
      categoryScores: newCatScores,
    })
  }

  // Build fallback prompts
  const bullets = getBullets()
  const fallbackRewritePrompt =
    bullets.length > 0 && missingKeywords.length > 0
      ? generateFallbackRewritePrompt(bullets, missingKeywords)
      : null
  const fallbackCoverLetterPrompt =
    jobRawText && resumeRawText
      ? generateFallbackCoverLetterPrompt(
          jobRawText,
          resumeRawText,
          matchedKeywords,
          missingKeywords
        )
      : null

  const scanMessages = [
    'INITIALIZING AI OPTIMIZATION...',
    'ANALYZING KEYWORD GAPS...',
    'REWRITING RESUME BULLETS...',
    'GENERATING COVER LETTER...',
    'COMPUTING OPTIMIZED SCORE...',
  ]

  return (
    <div className="space-y-6 animate-[fade-in-up_0.3s_ease-out] relative">
      <div>
        <h2 className="theme-label text-white text-lg mb-1">
          <span className="text-white">Step 4:</span>{' '}
          <span className="text-neon-cyan">Rewrite & Optimize</span>
        </h2>
        <p className="text-text-secondary text-sm">
          We'll rewrite your bullets and draft a cover letter — or grab the prompts and do it yourself.
        </p>
      </div>

      <ScanningOverlay
        active={isScanning}
        messages={scanMessages}
        onComplete={handleScanComplete}
      />

      {/* AI Status */}
      <AIStatusIndicator status={aiStatus} remaining={remaining} />

      {/* Trigger Button */}
      {!hasResults && aiStatus !== 'loading' && (
        <Card glow glowColor="cyan">
          <div className="text-center py-8 space-y-4">
            <p className="text-text-secondary text-sm">
              {missingKeywords.length} missing keywords detected.
              {bullets.length > 0
                ? ` ${bullets.length} resume bullets ready to optimize.`
                : ' No bullet points detected in your resume.'}
            </p>
            <Button
              onClick={runOptimization}
              size="lg"
              disabled={missingKeywords.length === 0 || bullets.length === 0}
            >
              Optimize with AI
            </Button>
            <p className="text-[11px] text-text-muted font-[family-name:var(--theme-heading-font,var(--font-mono))]">
              Or scroll down to copy a prompt for your own AI tool
            </p>
          </div>
        </Card>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Card glow glowColor="red">
          <div className="flex items-start gap-3">
            <span className="text-neon-red text-lg">!</span>
            <div>
              <p className="text-sm text-text-primary">{errorMessage}</p>
              <p className="text-xs text-text-muted mt-1">
                Use the prompt buttons below to get results from ChatGPT, Claude, or any AI chat.
              </p>
              <Button
                size="sm"
                variant="secondary"
                onClick={runOptimization}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Before/After Score Comparison */}
      {overallScore !== null && afterOverallScore !== null && (
        <Card glow glowColor="green">
          <h3 className="theme-label text-sm text-neon-green mb-4 text-center">
            Score Improvement
          </h3>
          <ScoreComparison
            beforeScore={overallScore}
            afterScore={afterOverallScore}
          />
        </Card>
      )}

      {/* Rewritten Bullets */}
      {rewrittenBullets.length > 0 && (
        <BulletRewriter bullets={rewrittenBullets} />
      )}

      {/* Cover Letter */}
      {coverLetter && <CoverLetterPanel coverLetter={coverLetter} />}

      {/* Manual Prompt Fallbacks — always visible */}
      <div className="space-y-4">
        <h3 className="theme-label text-xs text-text-muted">
          {hasResults ? 'Use Your Own AI' : 'Manual AI Prompts'}
        </h3>

        {fallbackRewritePrompt && (
          <ManualPromptFallback
            prompt={fallbackRewritePrompt}
            title="Resume Bullet Rewrite Prompt"
          />
        )}
        {fallbackCoverLetterPrompt && (
          <ManualPromptFallback
            prompt={fallbackCoverLetterPrompt}
            title="Cover Letter Prompt"
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button onClick={nextStep} size="lg">
          Download →
        </Button>
      </div>
    </div>
  )
}
