import { useState } from 'react'
import { Button } from '../ui/Button'
import { copyToClipboard } from '../../services/export/clipboardExporter'

interface CopyButtonProps {
  text: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function CopyButton({ text, label = 'Copy', size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button size={size} variant="secondary" onClick={handleCopy}>
      {copied ? '✓ Copied!' : label}
    </Button>
  )
}
