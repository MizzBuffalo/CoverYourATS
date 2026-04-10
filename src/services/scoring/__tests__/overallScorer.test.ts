import { describe, it, expect } from 'vitest'
import { calculateOverallScore } from '../overallScorer'
import type { CategoryScore } from '../../../types'

function makeCategory(category: string, score: number, total: number): CategoryScore {
  return {
    category: category as CategoryScore['category'],
    score,
    total,
    matched: [],
    missing: [],
  }
}

describe('calculateOverallScore', () => {
  it('returns 0 for empty categories', () => {
    expect(calculateOverallScore([])).toBe(0)
  })

  it('returns 0 when all categories have 0 total', () => {
    const scores = [
      makeCategory('hard_skill', 0, 0),
      makeCategory('tool', 0, 0),
    ]
    expect(calculateOverallScore(scores)).toBe(0)
  })

  it('returns 100 when all categories score 100', () => {
    const scores = [
      makeCategory('hard_skill', 100, 5),
      makeCategory('tool', 100, 3),
      makeCategory('certification', 100, 2),
      makeCategory('industry_term', 100, 4),
      makeCategory('soft_skill', 100, 3),
    ]
    expect(calculateOverallScore(scores)).toBe(100)
  })

  it('returns 0 when all categories score 0', () => {
    const scores = [
      makeCategory('hard_skill', 0, 5),
      makeCategory('tool', 0, 3),
    ]
    expect(calculateOverallScore(scores)).toBe(0)
  })

  it('applies category weights correctly', () => {
    // Only hard_skill (weight 0.30) and tool (weight 0.25)
    // hard_skill: 100, tool: 0
    // Weighted: (100*0.30 + 0*0.25) / (0.30 + 0.25) = 30/0.55 ≈ 55
    const scores = [
      makeCategory('hard_skill', 100, 5),
      makeCategory('tool', 0, 3),
    ]
    expect(calculateOverallScore(scores)).toBe(55)
  })

  it('skips categories with 0 total keywords', () => {
    // Only hard_skill has keywords, should get 100% not diluted by empties
    const scores = [
      makeCategory('hard_skill', 100, 5),
      makeCategory('tool', 0, 0),
      makeCategory('certification', 0, 0),
    ]
    expect(calculateOverallScore(scores)).toBe(100)
  })

  it('returns a rounded integer', () => {
    const scores = [
      makeCategory('hard_skill', 73, 5),
      makeCategory('tool', 81, 3),
    ]
    const result = calculateOverallScore(scores)
    expect(Number.isInteger(result)).toBe(true)
  })
})
