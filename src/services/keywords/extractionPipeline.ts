import { z } from 'zod'
import type { ExtractedKeyword, KeywordCategory } from '../../types'
import { extractKeywordsRuleBased } from './ruleBasedExtractor'
import { deduplicateAndRank } from './ranker'
import { callAI } from '../ai/aiClient'
import { buildKeywordExtractionPrompt } from '../ai/prompts/keywordExtraction'

export async function extractKeywords(jobText: string): Promise<ExtractedKeyword[]> {
  // Track A: Rule-based extraction (always runs, synchronous)
  const ruleBasedKeywords = extractKeywordsRuleBased(jobText)

  // Track B: AI-enhanced extraction (runs in parallel, best-effort)
  let aiKeywords: ExtractedKeyword[] = []
  try {
    const prompt = buildKeywordExtractionPrompt(jobText)
    const result = await callAI('keyword_extraction', prompt)
    if (result.success && result.data) {
      aiKeywords = parseAIKeywords(result.data)
    }
  } catch {
    // AI extraction failed — fall back to rule-based only
  }

  // Merge: AI results take precedence on duplicates (better importance scores)
  return deduplicateAndRank([...ruleBasedKeywords, ...aiKeywords])
}

const VALID_CATEGORIES: Set<string> = new Set([
  'hard_skill', 'soft_skill', 'certification', 'tool', 'industry_term',
])

// Zod schema for validating AI keyword extraction responses
const aiKeywordSchema = z.object({
  keyword: z.string().min(1),
  category: z.string().optional(),
  importance: z.number().min(0).max(1).optional(),
})

const aiKeywordsArraySchema = z.array(aiKeywordSchema)

function parseAIKeywords(data: unknown): ExtractedKeyword[] {
  try {
    let raw: unknown

    if (typeof data === 'string') {
      const cleaned = data.replace(/```json\s?/g, '').replace(/```/g, '').trim()
      raw = JSON.parse(cleaned)
    } else if (Array.isArray(data)) {
      raw = data
    } else {
      return []
    }

    // Handle both { keywords: [...] } wrapper and bare array
    if (raw && typeof raw === 'object' && !Array.isArray(raw) && 'keywords' in raw) {
      raw = (raw as Record<string, unknown>).keywords
    }

    const parsed = aiKeywordsArraySchema.safeParse(raw)
    if (!parsed.success) {
      console.warn('AI keyword response failed validation:', parsed.error.message)
      return []
    }

    return parsed.data.map((item) => ({
      keyword: item.keyword.trim(),
      category: (VALID_CATEGORIES.has(item.category ?? '') ? item.category : 'hard_skill') as KeywordCategory,
      importance: item.importance ?? 0.5,
      frequency: 1,
      source: 'ai' as const,
    }))
  } catch (err) {
    console.warn('Failed to parse AI keywords:', err instanceof Error ? err.message : err)
    return []
  }
}
