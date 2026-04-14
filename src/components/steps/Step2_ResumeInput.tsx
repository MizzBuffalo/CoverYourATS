import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { TextPasteArea } from '../input/TextPasteArea'
import { FileDropZone } from '../input/FileDropZone'
import { InputMethodToggle } from '../input/InputMethodToggle'
import { useAppStore } from '../../stores/useAppStore'
import { normalizeText } from '../../services/parsers/textParser'

export default function Step2_ResumeInput() {
  const [method, setMethod] = useState<'paste' | 'upload'>('upload')
  const nextStep = useAppStore((s) => s.nextStep)
  const resumeRawText = useAppStore((s) => s.resumeRawText)
  const setResumeText = useAppStore((s) => s.setResumeText)

  const handleFileLoaded = (text: string) => {
    setResumeText(normalizeText(text))
    setMethod('paste')
  }

  return (
    <div className="space-y-6 animate-[fade-in-up_0.3s_ease-out]">
      <div>
        <h2 className="theme-label text-white text-lg mb-1">
          <span className="text-white">Step 2:</span>{' '}
          <span className="text-neon-cyan">Upload Your Resume</span>
        </h2>
        <p className="text-text-secondary text-sm">
          Upload or paste your resume. We'll find what's missing.
        </p>
      </div>

      <InputMethodToggle method={method} onChange={setMethod} />

      <Card>
        {method === 'paste' ? (
          <TextPasteArea
            value={resumeRawText || ''}
            onChange={setResumeText}
            placeholder="Paste your full resume — work experience, education, skills, certifications..."
          />
        ) : (
          <FileDropZone onFileLoaded={handleFileLoaded} />
        )}
      </Card>

      <div className="flex justify-end">
        <Button onClick={nextStep} disabled={!resumeRawText?.trim()} size="lg">
          Compare →
        </Button>
      </div>
    </div>
  )
}
