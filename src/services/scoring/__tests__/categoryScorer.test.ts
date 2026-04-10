import { describe, it, expect } from 'vitest'
import { scoreByCategoryFromResults } from '../categoryScorer'
import type { MatchResult, ExtractedKeyword } from '../../../types'

function makeKeyword(overrides: Partial<ExtractedKeyword> = {}): ExtractedKeyword {
  return {
    keyword: 'test',
    category: 'hard_skill',
    importance: 0.5,
    frequency: 1,
    source: 'rule_based',
    ...overrides,
  }
}

function makeMatch(keyword: ExtractedKeyword, found: boolean): MatchResult {
  return {
    keyword,
    found,
    matchType: found ? 'exact' : undefined,
    matchedText: found ? keyword.keyword : undefined,
  }
}

describe('scoreByCategoryFromResults', () => {
  it('returns scores for all 5 categories', () => {
    const results = scoreByCategoryFromResults([])
    expect(results).toHaveLength(5)
    const categories = results.map((r) => r.category)
    expect(categories).toContain('hard_skill')
    expect(categories).toContain('soft_skill')
    expect(categories).toContain('certification')
    expect(categories).toContain('tool')
    expect(categories).toContain('industry_term')
  })

  it('returns 0 score for empty categories', () => {
    const results = scoreByCategoryFromResults([])
    for (const r of results) {
      expect(r.score).toBe(0)
      expect(r.total).toBe(0)
    }
  })

  it('returns 100 when all keywords matched', () => {
    const kw1 = makeKeyword({ keyword: 'python', importance: 0.8 })
    const kw2 = makeKeyword({ keyword: 'react', importance: 0.6 })

    const results = scoreByCategoryFromResults([
      makeMatch(kw1, true),
      makeMatch(kw2, true),
    ])

    const hardSkill = results.find((r) => r.category === 'hard_skill')!
    expect(hardSkill.score).toBe(100)
    expect(hardSkill.matched).toHaveLength(2)
    expect(hardSkill.missing).toHaveLength(0)
  })

  it('returns 0 when no keywords matched', () => {
    const kw1 = makeKeyword({ keyword: 'python', importance: 0.8 })
    const kw2 = makeKeyword({ keyword: 'react', importance: 0.6 })

    const results = scoreByCategoryFromResults([
      makeMatch(kw1, false),
      makeMatch(kw2, false),
    ])

    const hardSkill = results.find((r) => r.category === 'hard_skill')!
    expect(hardSkill.score).toBe(0)
    expect(hardSkill.matched).toHaveLength(0)
    expect(hardSkill.missing).toHaveLength(2)
  })

  it('uses importance weighting (not just count)', () => {
    // High-importance keyword matched, low-importance missed
    const highImportance = makeKeyword({ keyword: 'python', importance: 0.9 })
    const lowImportance = makeKeyword({ keyword: 'git', importance: 0.1 })

    const results = scoreByCategoryFromResults([
      makeMatch(highImportance, true),
      makeMatch(lowImportance, false),
    ])

    const hardSkill = results.find((r) => r.category === 'hard_skill')!
    // 0.9 / (0.9 + 0.1) = 90%
    expect(hardSkill.score).toBe(90)
  })

  it('groups keywords by category correctly', () => {
    const hardSkill = makeKeyword({ keyword: 'python', category: 'hard_skill' })
    const tool = makeKeyword({ keyword: 'docker', category: 'tool' })
    const cert = makeKeyword({ keyword: 'aws certified', category: 'certification' })

    const results = scoreByCategoryFromResults([
      makeMatch(hardSkill, true),
      makeMatch(tool, false),
      makeMatch(cert, true),
    ])

    expect(results.find((r) => r.category === 'hard_skill')!.total).toBe(1)
    expect(results.find((r) => r.category === 'tool')!.total).toBe(1)
    expect(results.find((r) => r.category === 'certification')!.total).toBe(1)
    expect(results.find((r) => r.category === 'soft_skill')!.total).toBe(0)
  })
})
