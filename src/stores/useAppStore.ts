import { create } from 'zustand'
import { createUISlice, type UISlice } from './slices/uiSlice'
import { createJobSlice, type JobSlice } from './slices/jobSlice'
import { createResumeSlice, type ResumeSlice } from './slices/resumeSlice'
import { createAnalysisSlice, type AnalysisSlice } from './slices/analysisSlice'
import { createRewriteSlice, type RewriteSlice } from './slices/rewriteSlice'
import { createCoverLetterSlice, type CoverLetterSlice } from './slices/coverLetterSlice'

export type AppState = UISlice &
  JobSlice &
  ResumeSlice &
  AnalysisSlice &
  RewriteSlice &
  CoverLetterSlice

export const useAppStore = create<AppState>()((...args) => ({
  ...createUISlice(...args),
  ...createJobSlice(...args),
  ...createResumeSlice(...args),
  ...createAnalysisSlice(...args),
  ...createRewriteSlice(...args),
  ...createCoverLetterSlice(...args),
}))
