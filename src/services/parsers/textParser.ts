import { sanitizeText } from './sanitize'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function normalizeText(text: string): string {
  return sanitizeText(text)
}

export async function parseTextFile(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 10MB.`)
  }

  const text = await file.text()
  return sanitizeText(text)
}
