import { useState } from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { copyToClipboard, buildExportText } from '../../services/export/clipboardExporter'
import type { RewrittenBullet, CategoryScore, ExtractedKeyword } from '../../types'

interface ExportPanelProps {
  overallScore: number | null
  afterOverallScore: number | null
  categoryScores: CategoryScore[]
  rewrittenBullets: RewrittenBullet[]
  coverLetter: string | null
  missingKeywords: ExtractedKeyword[]
}

export function ExportPanel({
  overallScore,
  afterOverallScore,
  categoryScores,
  rewrittenBullets,
  coverLetter,
  missingKeywords,
}: ExportPanelProps) {
  const [copiedAll, setCopiedAll] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleCopyAll = async () => {
    const text = buildExportText({
      rewrittenBullets,
      coverLetter,
      overallScore,
      afterOverallScore,
      missingKeywords,
    })
    const success = await copyToClipboard(text)
    if (success) {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    }
  }

  const handlePdfExport = async () => {
    setExporting(true)
    try {
      const { exportToPdf } = await import('../../services/export/pdfExporter')
      await exportToPdf({
        overallScore,
        afterOverallScore,
        categoryScores,
        rewrittenBullets,
        coverLetter,
        missingKeywords,
      })
    } catch (err) {
      console.error('PDF export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  const hasContent = rewrittenBullets.length > 0 || coverLetter

  return (
    <Card glow glowColor="cyan">
      <h3 className="font-mono text-sm text-neon-cyan uppercase tracking-wider mb-4">
        Export Options
      </h3>

      <div className="grid sm:grid-cols-2 gap-3">
        <Button
          onClick={handleCopyAll}
          size="lg"
          variant="secondary"
          disabled={!hasContent}
          className="w-full"
        >
          {copiedAll ? '✓ Copied!' : 'Copy Full Report'}
        </Button>

        <Button
          onClick={handlePdfExport}
          size="lg"
          disabled={!hasContent || exporting}
          className="w-full"
        >
          {exporting ? 'Generating PDF...' : 'Download PDF Report'}
        </Button>
      </div>

      {!hasContent && (
        <p className="text-xs text-text-muted mt-3 text-center font-mono">
          Complete Step 4 (Optimize) first to generate exportable content.
        </p>
      )}
    </Card>
  )
}
