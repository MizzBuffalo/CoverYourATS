import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createUISlice, type UISlice } from './slices/uiSlice'
import { createJobSlice, type JobSlice } from './slices/jobSlice'
import { createResumeSlice, type ResumeSlice } from './slices/resumeSlice'
import { createAnalysisSlice, type AnalysisSlice } from './slices/analysisSlice'
import { createRewriteSlice, type RewriteSlice } from './slices/rewriteSlice'
import { createCoverLetterSlice, type CoverLetterSlice } from './slices/coverLetterSlice'
import { createThemeSlice, hydrateTheme, type ThemeSlice } from './slices/themeSlice'

export type AppState = UISlice &
  JobSlice &
  ResumeSlice &
  AnalysisSlice &
  RewriteSlice &
  CoverLetterSlice &
  ThemeSlice & {
    fullReset: () => void
  }

// Fields that should NOT be persisted (transient loading/error states)
const TRANSIENT_KEYS: (keyof AppState)[] = [
  'isProcessing',
  'processingMessage',
  'isExtractingKeywords',
  'extractionError',
  'isParsingResume',
  'isAnalyzing',
  'isRewriting',
  'rewriteError',
  'isGeneratingCoverLetter',
  'coverLetterError',
]

export const useAppStore = create<AppState>()(
  persist(
    (...args) => ({
      ...createUISlice(...args),
      ...createJobSlice(...args),
      ...createResumeSlice(...args),
      ...createAnalysisSlice(...args),
      ...createRewriteSlice(...args),
      ...createCoverLetterSlice(...args),
      ...createThemeSlice(...args),
      fullReset: () => {
        const [set] = args
        const state = useAppStore.getState()
        state.reset()
        state.clearJob()
        state.clearResume()
        state.clearAnalysis()
        state.clearRewrites()
        state.clearCoverLetter()
        set({ currentStep: 1 })
      },
    }),
    {
      name: 'coveryourats-store',
      partialize: (state) => {
        const persisted: Record<string, unknown> = {}
        for (const key in state) {
          if (
            typeof state[key as keyof AppState] !== 'function' &&
            !TRANSIENT_KEYS.includes(key as keyof AppState)
          ) {
            persisted[key] = state[key as keyof AppState]
          }
        }
        return persisted
      },
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          hydrateTheme(state.theme)
        }
      },
    }
  )
)
