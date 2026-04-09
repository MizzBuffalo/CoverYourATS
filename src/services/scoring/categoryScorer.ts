import type { ExtractedKeyword, MatchResult, CategoryScore, KeywordCategory } from '../../types'
import { CATEGORY_ORDER } from '../../config/constants'

export function scoreByCategoryFromResults(
  matchResults: MatchResult[]
): CategoryScore[] {
  // Group results by category
  const grouped = new Map<KeywordCategory, { matched: ExtractedKeyword[]; missing: ExtractedKeyword[] }>()

  for (const cat of CATEGORY_ORDER) {
    grouped.set(cat, { matched: [], missing: [] })
  }

  for (const result of matchResults) {
    const cat = result.keyword.category
    const group = grouped.get(cat)!
    if (result.found) {
      group.matched.push(result.keyword)
    } else {
      group.missing.push(result.keyword)
    }
  }

  return CATEGORY_ORDER.map((cat) => {
    const { matched, missing } = grouped.get(cat)!
    const total = matched.length + missing.length
    const score = total > 0 ? Math.round((matched.length / total) * 100) : 0

    return { category: cat, matched, missing, total, score }
  })
}
