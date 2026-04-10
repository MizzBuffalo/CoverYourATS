import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

interface ManualPromptFallbackProps {
  prompt: string
  title?: string
}

export function ManualPromptFallback({ prompt, title = 'Copy AI Prompt' }: ManualPromptFallbackProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = prompt
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card glow glowColor="cyan">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="theme-label text-sm text-neon-cyan">
            {title}
          </h4>
          <Button size="sm" onClick={handleCopy}>
            {copied ? '✓ Copied!' : 'Copy Prompt'}
          </Button>
        </div>
        <p className="text-xs text-text-secondary">
          Paste this prompt into Claude, ChatGPT, or any AI chat for personalized results.
        </p>
        <pre className="bg-cyber-dark border border-cyber-border rounded-[var(--theme-radius)] p-3 text-xs font-mono text-text-secondary max-h-48 overflow-y-auto whitespace-pre-wrap">
          {prompt}
        </pre>
      </div>
    </Card>
  )
}
