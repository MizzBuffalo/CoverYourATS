import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

interface CoverLetterPanelProps {
  coverLetter: string
}

export function CoverLetterPanel({ coverLetter }: CoverLetterPanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="theme-label text-sm text-neon-cyan">
          Generated Cover Letter
        </h3>
        <Button size="sm" variant="secondary" onClick={handleCopy}>
          {copied ? '✓ Copied!' : 'Copy'}
        </Button>
      </div>
      <div className="bg-cyber-dark border border-cyber-border rounded-[var(--theme-radius)] p-4 whitespace-pre-wrap text-sm text-text-primary leading-relaxed">
        {coverLetter}
      </div>
    </Card>
  )
}
