import type { TextItem } from 'pdfjs-dist/types/src/display/api'
import { sanitizeText } from './sanitize'

let pdfjsLib: typeof import('pdfjs-dist') | null = null

async function getPdfjs() {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString()
  }
  return pdfjsLib
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_PAGES = 50

export async function parsePdf(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 10MB.`)
  }

  const pdfjs = await getPdfjs()
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise

  const pageCount = Math.min(pdf.numPages, MAX_PAGES)
  const pages: string[] = []
  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .filter((item): item is TextItem => 'str' in item)
      .map((item) => item.str)
      .join(' ')
    pages.push(pageText)
  }

  let result = pages.join('\n\n')
  if (pdf.numPages > MAX_PAGES) {
    result += `\n\n[Note: Only first ${MAX_PAGES} of ${pdf.numPages} pages were processed]`
  }

  return sanitizeText(result)
}

