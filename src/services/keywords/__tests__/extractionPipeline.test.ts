import { describe, it, expect, vi } from 'vitest'

// Mock the AI client before importing the module
vi.mock('../../ai/aiClient', () => ({
  callAI: vi.fn(),
}))

import { extractKeywords } from '../extractionPipeline'
import { callAI } from '../../ai/aiClient'

const mockCallAI = vi.mocked(callAI)

describe('extractKeywords', () => {
  it('returns rule-based keywords when AI fails', async () => {
    mockCallAI.mockRejectedValue(new Error('Network error'))

    const result = await extractKeywords(
      'We need a software engineer with Python and JavaScript experience. Must have React skills.'
    )

    expect(result.length).toBeGreaterThan(0)
    // Should still find rule-based keywords
    const keywords = result.map((k) => k.keyword)
    expect(keywords.some((k) => k.includes('python') || k.includes('javascript') || k.includes('react'))).toBe(true)
  })

  it('returns rule-based keywords when AI returns empty', async () => {
    mockCallAI.mockResolvedValue({
      success: true,
      data: '[]',
    })

    const result = await extractKeywords(
      'Looking for Python developer with Docker and Kubernetes experience'
    )

    expect(result.length).toBeGreaterThan(0)
  })

  it('handles malformed JSON from AI gracefully', async () => {
    mockCallAI.mockResolvedValue({
      success: true,
      data: 'this is not valid json at all {{{',
    })

    // Should not throw — falls back to rule-based
    const result = await extractKeywords(
      'Senior React developer needed with TypeScript skills'
    )

    expect(result.length).toBeGreaterThan(0)
  })

  it('handles AI returning markdown-wrapped JSON', async () => {
    mockCallAI.mockResolvedValue({
      success: true,
      data: '```json\n[{"keyword":"Docker","category":"tool","importance":0.9}]\n```',
    })

    const result = await extractKeywords(
      'DevOps engineer with Docker and Kubernetes'
    )

    expect(result.some((k) => k.keyword.toLowerCase() === 'docker')).toBe(true)
  })

  it('handles AI returning { keywords: [...] } wrapper', async () => {
    mockCallAI.mockResolvedValue({
      success: true,
      data: JSON.stringify({
        keywords: [
          { keyword: 'Python', category: 'hard_skill', importance: 0.8 },
          { keyword: 'Docker', category: 'tool', importance: 0.7 },
        ],
      }),
    })

    const result = await extractKeywords(
      'Python developer with Docker skills needed'
    )

    expect(result.some((k) => k.keyword.toLowerCase() === 'python')).toBe(true)
    expect(result.some((k) => k.keyword.toLowerCase() === 'docker')).toBe(true)
  })

  it('validates and clamps importance values', async () => {
    mockCallAI.mockResolvedValue({
      success: true,
      data: JSON.stringify([
        { keyword: 'Python', category: 'hard_skill', importance: 5.0 }, // over 1
        { keyword: 'React', category: 'hard_skill' }, // missing importance
      ]),
    })

    const result = await extractKeywords('Python and React developer')

    // All importance values should be between 0 and 1
    for (const kw of result) {
      expect(kw.importance).toBeGreaterThanOrEqual(0)
      expect(kw.importance).toBeLessThanOrEqual(1)
    }
  })

  it('rejects items without keyword string', async () => {
    mockCallAI.mockResolvedValue({
      success: true,
      data: JSON.stringify([
        { keyword: '', category: 'hard_skill' }, // empty keyword
        { category: 'tool', importance: 0.5 }, // missing keyword
        { keyword: 'Python', category: 'hard_skill', importance: 0.8 }, // valid
      ]),
    })

    const result = await extractKeywords('Python developer needed')

    // Only valid entries should pass Zod validation
    const aiKeywords = result.filter((k) => k.source === 'ai')
    expect(aiKeywords.every((k) => k.keyword.length > 0)).toBe(true)
  })

  it('handles empty job text', async () => {
    mockCallAI.mockResolvedValue({ success: false, data: null, error: 'Empty prompt' })

    const result = await extractKeywords('')
    expect(Array.isArray(result)).toBe(true)
  })
})
