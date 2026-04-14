import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { TextPasteArea } from '../input/TextPasteArea'
import { FileDropZone } from '../input/FileDropZone'
import { InputMethodToggle } from '../input/InputMethodToggle'
import { useAppStore } from '../../stores/useAppStore'
import { normalizeText } from '../../services/parsers/textParser'

export default function Step1_JobInput() {
  const [method, setMethod] = useState<'paste' | 'upload'>('paste')
  const nextStep = useAppStore((s) => s.nextStep)
  const jobRawText = useAppStore((s) => s.jobRawText)
  const setJobText = useAppStore((s) => s.setJobText)

  const handleFileLoaded = (text: string) => {
    setJobText(normalizeText(text))
    setMethod('paste') // Switch to paste view to show extracted text
  }

  return (
    <div className="space-y-6 animate-[fade-in-up_0.3s_ease-out]">
      <div>
        <h2 className="theme-label text-neon-cyan text-lg mb-1">
          Step 1: Job Intel
        </h2>
        <p className="text-text-secondary text-sm">
          Paste the full job posting below or upload a PDF/DOCX file.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-text-primary text-sm font-medium">
          We scan for every keyword that matters — the ones listed AND the ones they expect but didn't write down.
        </p>
        <div className="space-y-0.5 text-sm text-text-secondary font-[family-name:var(--theme-heading-font,var(--font-mono))]">
          <p>1. Drop the job posting</p>
          <p>2. Upload your resume</p>
          <p>3. See what's missing</p>
        </div>
      </div>

      <InputMethodToggle method={method} onChange={setMethod} />

      <Card>
        {method === 'paste' ? (
          <TextPasteArea
            value={jobRawText || ''}
            onChange={setJobText}
            placeholder={'Paste the full job posting here — include the job title, requirements, qualifications, and description.\n\nExample:\nSenior Data Analyst - Nike, Inc.\nRequired: 5+ years experience, SQL, Python, Tableau...'}
          />
        ) : (
          <FileDropZone onFileLoaded={handleFileLoaded} />
        )}
      </Card>

      <div className="flex justify-end">
        <Button onClick={nextStep} disabled={!jobRawText?.trim()} size="lg">
          Analyze →
        </Button>
      </div>
    </div>
  )
}
