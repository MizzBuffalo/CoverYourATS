import type { ExtractedKeyword } from '../../types'
import { POSITION_WEIGHTS } from '../../config/constants'

interface RawCandidate {
  keyword: string
  frequency: number
  positions: ('required' | 'preferred' | 'body')[]
}

export function rankKeywords(candidates: RawCandidate[], totalWords: number): number {
  // TF-IDF inspired scoring
  // TF = frequency / totalWords
  // Position boost = max position weight among all positions found
  if (totalWords === 0) return 0

  const tf = candidates[0]?.frequency / totalWords || 0
  const positionBoost = Math.max(
    ...candidates.flatMap((c) => c.positions.map((p) => POSITION_WEIGHTS[p]))
  )

  return Math.min(1, tf * 100 * positionBoost)
}

export function deduplicateAndRank(
  keywords: ExtractedKeyword[]
): ExtractedKeyword[] {
  const map = new Map<string, ExtractedKeyword>()

  for (const kw of keywords) {
    const key = kw.keyword.toLowerCase()
    const existing = map.get(key)
    if (!existing || kw.importance > existing.importance) {
      map.set(key, kw)
    }
  }

  return Array.from(map.values()).sort((a, b) => b.importance - a.importance)
}
