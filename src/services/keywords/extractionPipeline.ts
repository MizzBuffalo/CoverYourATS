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

function parseAIKeywords(data: unknown): ExtractedKeyword[] {
  let items: Array<{ keyword?: string; category?: string; importance?: number }>

  if (typeof data === 'string') {
    const cleaned = data.replace(/```json\s?/g, '').replace(/```/g, '').trim()
    items = JSON.parse(cleaned)
  } else if (Array.isArray(data)) {
    items = data
  } else {
    return []
  }

  return items
    .filter((item) => item.keyword && typeof item.keyword === 'string')
    .map((item) => ({
      keyword: item.keyword!.trim(),
      category: (VALID_CATEGORIES.has(item.category ?? '') ? item.category : 'hard_skill') as KeywordCategory,
      importance: typeof item.importance === 'number' ? Math.min(1, Math.max(0, item.importance)) : 0.5,
      frequency: 1,
      source: 'ai' as const,
    }))
}
