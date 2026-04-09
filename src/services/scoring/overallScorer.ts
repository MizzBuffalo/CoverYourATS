import type { CategoryScore } from '../../types'
import { CATEGORY_WEIGHTS } from '../../config/constants'

export function calculateOverallScore(categoryScores: CategoryScore[]): number {
  let weightedSum = 0
  let totalWeight = 0

  for (const cs of categoryScores) {
    if (cs.total === 0) continue // Skip empty categories
    const weight = CATEGORY_WEIGHTS[cs.category]
    weightedSum += cs.score * weight
    totalWeight += weight
  }

  if (totalWeight === 0) return 0

  return Math.round(weightedSum / totalWeight)
}
