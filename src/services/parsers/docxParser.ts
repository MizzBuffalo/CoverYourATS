import mammoth from 'mammoth'
import { sanitizeText } from './sanitize'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function parseDocx(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 10MB.`)
  }

  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return sanitizeText(result.value)
}
