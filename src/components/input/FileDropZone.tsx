import { useState, useRef, useCallback } from 'react'
import { cn } from '../../lib/cn'

interface FileDropZoneProps {
  onFileLoaded: (text: string, fileName: string) => void
  accept?: string
  className?: string
}

const ACCEPTED_TYPES: Record<string, () => Promise<(file: File) => Promise<string>>> = {
  'application/pdf': () =>
    import('../../services/parsers/pdfParser').then((m) => m.parsePdf),
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': () =>
    import('../../services/parsers/docxParser').then((m) => m.parseDocx),
  'text/plain': () =>
    import('../../services/parsers/textParser').then((m) => m.parseTextFile),
}

export function FileDropZone({ onFileLoaded, className }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    async (file: File) => {
      setError(null)
      setIsLoading(true)
      setFileName(file.name)

      try {
        const parserLoader = ACCEPTED_TYPES[file.type]
        if (!parserLoader) {
          // Try extension-based fallback
          const ext = file.name.split('.').pop()?.toLowerCase()
          if (ext === 'pdf') {
            const parser = await import('../../services/parsers/pdfParser')
            const text = await parser.parsePdf(file)
            onFileLoaded(text, file.name)
          } else if (ext === 'docx') {
            const parser = await import('../../services/parsers/docxParser')
            const text = await parser.parseDocx(file)
            onFileLoaded(text, file.name)
          } else if (ext === 'txt') {
            const parser = await import('../../services/parsers/textParser')
            const text = await parser.parseTextFile(file)
            onFileLoaded(text, file.name)
          } else {
            throw new Error('Unsupported file type. Please use PDF, DOCX, or TXT.')
          }
          return
        }

        const parser = await parserLoader()
        const text = await parser(file)
        onFileLoaded(text, file.name)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse file')
        setFileName(null)
      } finally {
        setIsLoading(false)
      }
    },
    [onFileLoaded]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'border-2 border-dashed rounded-[var(--theme-radius)] p-8 text-center cursor-pointer transition-all',
        isDragging
          ? 'border-neon-cyan bg-neon-cyan/5'
          : 'border-cyber-border hover:border-neon-cyan/30',
        isLoading && 'pointer-events-none opacity-60',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileInput}
        className="hidden"
      />

      {isLoading ? (
        <div className="space-y-2">
          <div className="w-6 h-6 mx-auto border-2 border-neon-cyan border-t-transparent rounded-full animate-[spin_1s_linear_infinite]" />
          <p className="text-sm font-[family-name:var(--theme-heading-font,var(--font-mono))] text-neon-cyan">Parsing {fileName}...</p>
        </div>
      ) : fileName && !error ? (
        <div className="space-y-1">
          <p className="text-sm font-[family-name:var(--theme-heading-font,var(--font-mono))] text-neon-green">Loaded: {fileName}</p>
          <p className="text-xs text-text-muted">Click or drop to replace</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-2xl text-text-muted">
            {isDragging ? '[ DROP FILE ]' : '[ UPLOAD ]'}
          </div>
          <p className="text-sm text-text-secondary">
            Drop a file or click to browse
          </p>
          <p className="text-xs text-text-muted font-[family-name:var(--theme-heading-font,var(--font-mono))]">PDF, DOCX, or TXT</p>
        </div>
      )}

      {error && <p className="text-sm text-neon-red mt-2 font-[family-name:var(--theme-heading-font,var(--font-mono))]">{error}</p>}
    </div>
  )
}
