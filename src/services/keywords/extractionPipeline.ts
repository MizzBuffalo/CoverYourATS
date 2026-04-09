import type { ExtractedKeyword } from '../../types'
import { extractKeywordsRuleBased } from './ruleBasedExtractor'
import { deduplicateAndRank } from './ranker'

export async function extractKeywords(jobText: string): Promise<ExtractedKeyword[]> {
  // Track A: Rule-based extraction (always runs)
  const ruleBasedKeywords = extractKeywordsRuleBased(jobText)

  // Track B: AI-enhanced extraction will be added later
  // For now, just use rule-based results

  return deduplicateAndRank(ruleBasedKeywords)
}
