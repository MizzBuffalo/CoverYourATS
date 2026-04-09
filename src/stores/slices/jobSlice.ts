import type { StateCreator } from 'zustand'
import type { ExtractedKeyword, KeywordCategory } from '../../types'

export interface JobSlice {
  jobRawText: string | null
  jobKeywords: ExtractedKeyword[]
  jobCategoryMap: Record<KeywordCategory, ExtractedKeyword[]>
  isExtractingKeywords: boolean
  extractionError: string | null
  setJobText: (text: string) => void
  setJobKeywords: (keywords: ExtractedKeyword[]) => void
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

export const createJobSlice: StateCreator<JobSlice, [], [], JobSlice> = (set) => ({
  jobRawText: null,
  jobKeywords: [],
  jobCategoryMap: { hard_skill: [], soft_skill: [], certification: [], tool: [], industry_term: [] },
  isExtractingKeywords: false,
  extractionError: null,
  setJobText: (text) => set({ jobRawText: text }),
  setJobKeywords: (keywords) =>
    set({ jobKeywords: keywords, jobCategoryMap: buildCategoryMap(keywords) }),
  setExtractingKeywords: (loading) => set({ isExtractingKeywords: loading }),
  setExtractionError: (error) => set({ extractionError: error }),
  clearJob: () =>
    set({
      jobRawText: null,
      jobKeywords: [],
      jobCategoryMap: { hard_skill: [], soft_skill: [], certification: [], tool: [], industry_term: [] },
      isExtractingKeywords: false,
      extractionError: null,
    }),
})
