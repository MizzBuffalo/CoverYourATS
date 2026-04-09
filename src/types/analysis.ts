import type { KeywordCategory, ExtractedKeyword } from './job'

export interface CategoryScore {
  category: KeywordCategory
  matched: ExtractedKeyword[]
  missing: ExtractedKeyword[]
  total: number
  score: number // 0-100
}

export interface MatchResult {
  keyword: ExtractedKeyword
  found: boolean
  matchType?: 'exact' | 'stem' | 'abbreviation' | 'synonym'
  matchedText?: string
}

export interface GapAnalysis {
  overallScore: number
  categoryScores: CategoryScore[]
  matchResults: MatchResult[]
  matchedKeywords: ExtractedKeyword[]
  missingKeywords: ExtractedKeyword[]
}
