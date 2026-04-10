import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { TextPasteArea } from '../input/TextPasteArea'
import { FileDropZone } from '../input/FileDropZone'
import { InputMethodToggle } from '../input/InputMethodToggle'
import { useAppStore } from '../../stores/useAppStore'
import { normalizeText } from '../../services/parsers/textParser'

export default function Step2_ResumeInput() {
  const [method, setMethod] = useState<'paste' | 'upload'>('paste')
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
        <h2 className="theme-label text-neon-cyan text-lg mb-1">
          Step 2: Load Your Profile
        </h2>
        <p className="text-text-secondary text-sm">
          Paste your resume below or upload a PDF/DOCX file.
        </p>
      </div>

      <InputMethodToggle method={method} onChange={setMethod} />

      <Card>
        {method === 'paste' ? (
          <TextPasteArea
            value={resumeRawText || ''}
            onChange={setResumeText}
            placeholder="Paste your full resume here — include all sections: summary, experience, education, skills..."
          />
        ) : (
          <FileDropZone onFileLoaded={handleFileLoaded} />
        )}
      </Card>

      <div className="flex justify-end">
        <Button onClick={nextStep} disabled={!resumeRawText?.trim()} size="lg">
          Analyze Profile →
        </Button>
      </div>
    </div>
  )
}
