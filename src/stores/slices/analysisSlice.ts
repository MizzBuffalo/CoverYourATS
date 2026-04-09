import type { StateCreator } from 'zustand'
import type { CategoryScore, ExtractedKeyword, MatchResult } from '../../types'

export interface AnalysisSlice {
  overallScore: number | null
  categoryScores: CategoryScore[]
  matchResults: MatchResult[]
  matchedKeywords: ExtractedKeyword[]
  missingKeywords: ExtractedKeyword[]
  afterOverallScore: number | null
  afterCategoryScores: CategoryScore[]
  isAnalyzing: boolean
  setAnalysis: (data: {
    overallScore: number
    categoryScores: CategoryScore[]
    matchResults: MatchResult[]
    matchedKeywords: ExtractedKeyword[]
    missingKeywords: ExtractedKeyword[]
  }) => void
  setAfterAnalysis: (data: {
    overallScore: number
    categoryScores: CategoryScore[]
  }) => void
  setAnalyzing: (loading: boolean) => void
  clearAnalysis: () => void
}

export const createAnalysisSlice: StateCreator<AnalysisSlice, [], [], AnalysisSlice> = (set) => ({
  overallScore: null,
  categoryScores: [],
  matchResults: [],
  matchedKeywords: [],
  missingKeywords: [],
  afterOverallScore: null,
  afterCategoryScores: [],
  isAnalyzing: false,
  setAnalysis: (data) => set(data),
  setAfterAnalysis: (data) =>
    set({ afterOverallScore: data.overallScore, afterCategoryScores: data.categoryScores }),
  setAnalyzing: (loading) => set({ isAnalyzing: loading }),
  clearAnalysis: () =>
    set({
      overallScore: null,
      categoryScores: [],
      matchResults: [],
      matchedKeywords: [],
      missingKeywords: [],
      afterOverallScore: null,
      afterCategoryScores: [],
      isAnalyzing: false,
    }),
})
