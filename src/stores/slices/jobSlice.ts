import type { StateCreator } from 'zustand'
import type { ExtractedKeyword, KeywordCategory } from '../../types'

export interface JobSlice {
  jobRawText: string | null
  jobKeywords: ExtractedKeyword[]
  jobCategoryMap: Record<KeywordCategory, ExtractedKeyword[]>
  customKeywords: ExtractedKeyword[]
  isExtractingKeywords: boolean
  extractionError: string | null
  setJobText: (text: string) => void
  setJobKeywords: (keywords: ExtractedKeyword[]) => void
  addCustomKeyword: (keyword: string) => void
  removeCustomKeyword: (keyword: string) => void
  setExtractingKeywords: (loading: boolean) => void
  setExtractionError: (error: string | null) => void
  clearJob: () => void
}

function buildCategoryMap(keywords: ExtractedKeyword[]): Record<KeywordCategory, ExtractedKeyword[]> {
  return {
    hard_skill: keywords.filter((k) => k.category === 'hard_skill'),
    soft_skill: keywords.filter((k) => k.category === 'soft_skill'),
    certification: keywords.filter((k) => k.category === 'certification'),
    tool: keywords.filter((k) => k.category === 'tool'),
    industry_term: keywords.filter((k) => k.category === 'industry_term'),
  }
}

export const createJobSlice: StateCreator<JobSlice, [], [], JobSlice> = (set, get) => ({
  jobRawText: null,
  jobKeywords: [],
  jobCategoryMap: { hard_skill: [], soft_skill: [], certification: [], tool: [], industry_term: [] },
  customKeywords: [],
  isExtractingKeywords: false,
  extractionError: null,
  setJobText: (text) => set({ jobRawText: text }),
  setJobKeywords: (keywords) =>
    set({ jobKeywords: keywords, jobCategoryMap: buildCategoryMap(keywords) }),
  addCustomKeyword: (keyword) => {
    const trimmed = keyword.trim()
    if (!trimmed) return
    const existing = get().customKeywords
    if (existing.some((k) => k.keyword.toLowerCase() === trimmed.toLowerCase())) return
    const newKw: ExtractedKeyword = {
      keyword: trimmed,
      category: 'hard_skill',
      importance: 0.8,
      frequency: 1,
      source: 'rule_based',
    }
    set({ customKeywords: [...existing, newKw] })
  },
  removeCustomKeyword: (keyword) => {
    set({ customKeywords: get().customKeywords.filter((k) => k.keyword !== keyword) })
  },
  setExtractingKeywords: (loading) => set({ isExtractingKeywords: loading }),
  setExtractionError: (error) => set({ extractionError: error }),
  clearJob: () =>
    set({
      jobRawText: null,
      jobKeywords: [],
      jobCategoryMap: { hard_skill: [], soft_skill: [], certification: [], tool: [], industry_term: [] },
      customKeywords: [],
      isExtractingKeywords: false,
      extractionError: null,
    }),
})
