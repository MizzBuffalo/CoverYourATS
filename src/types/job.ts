export type KeywordCategory =
  | 'hard_skill'
  | 'soft_skill'
  | 'certification'
  | 'tool'
  | 'industry_term'

export interface ExtractedKeyword {
  keyword: string
  category: KeywordCategory
  importance: number // 0-1, higher = more important
  frequency: number
  source: 'rule_based' | 'ai' | 'both'
}

export interface JobPosting {
  rawText: string
  keywords: ExtractedKeyword[]
  categoryMap: Record<KeywordCategory, ExtractedKeyword[]>
}
