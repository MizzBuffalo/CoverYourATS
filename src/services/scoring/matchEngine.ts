import type { ExtractedKeyword, MatchResult } from '../../types'
import { fuzzyMatchKeyword } from './fuzzyMatch'

export function matchKeywordsAgainstResume(
  keywords: ExtractedKeyword[],
  resumeText: string
): MatchResult[] {
  return keywords.map((keyword) => {
    const result = fuzzyMatchKeyword(keyword.keyword, resumeText)
    return {
      keyword,
      found: result.found,
      matchType: result.matchType,
      matchedText: result.matchedText,
    }
  })
}
