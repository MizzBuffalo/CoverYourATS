import type { ResumeBullet } from '../types'

/**
 * Extracts bullet-point-like lines from raw resume text.
 * Identifies lines starting with bullet markers (-, *, +, >, numbers)
 * and short declarative lines that look like accomplishment statements.
 */
export function extractBulletsFromText(rawText: string): ResumeBullet[] {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean)
  const bullets: ResumeBullet[] = []
  let currentSection = 'General'

  for (const line of lines) {
    // Detect section headers: all caps, short, or ends with colon
    if (
      (line.length < 50 && /^[A-Z][A-Z\s&/,]+$/.test(line)) ||
      (line.length < 60 && line.endsWith(':'))
    ) {
      currentSection = line.replace(/:$/, '').trim()
      continue
    }

    // Match bullet-style lines
    const bulletMatch = line.match(
      /^(?:[-•*+>]|\d+[.)]\s?|[a-z][.)]\s?)\s*(.+)/
    )
    if (bulletMatch && bulletMatch[1].length >= 15) {
      bullets.push({
        id: `bullet-${bullets.length}`,
        text: bulletMatch[1],
        sectionName: currentSection,
      })
      continue
    }

    // Match accomplishment-style lines (start with action verb, 20+ chars, not a header)
    if (
      line.length >= 20 &&
      line.length <= 300 &&
      /^[A-Z][a-z]+(ed|ing|d)\s/.test(line) &&
      !line.includes(':')
    ) {
      bullets.push({
        id: `bullet-${bullets.length}`,
        text: line,
        sectionName: currentSection,
      })
    }
  }

  // If we found too few, fall back to any substantive lines
  if (bullets.length < 3) {
    const fallback: ResumeBullet[] = []
    for (const line of lines) {
      if (
        line.length >= 30 &&
        line.length <= 300 &&
        !(/^[A-Z][A-Z\s&/,]+$/.test(line)) &&
        !line.endsWith(':')
      ) {
        fallback.push({
          id: `bullet-${fallback.length}`,
          text: line,
          sectionName: 'General',
        })
      }
    }
    return fallback.slice(0, 20)
  }

  return bullets.slice(0, 20)
}
