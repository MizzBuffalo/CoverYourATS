import type { StateCreator } from 'zustand'

export interface CoverLetterSlice {
  coverLetter: string | null
  isGeneratingCoverLetter: boolean
  coverLetterError: string | null
  setCoverLetter: (letter: string) => void
  setGeneratingCoverLetter: (loading: boolean) => void
  setCoverLetterError: (error: string | null) => void
  clearCoverLetter: () => void
}

export const createCoverLetterSlice: StateCreator<CoverLetterSlice, [], [], CoverLetterSlice> = (
  set
) => ({
  coverLetter: null,
  isGeneratingCoverLetter: false,
  coverLetterError: null,
  setCoverLetter: (letter) => set({ coverLetter: letter }),
  setGeneratingCoverLetter: (loading) => set({ isGeneratingCoverLetter: loading }),
  setCoverLetterError: (error) => set({ coverLetterError: error }),
  clearCoverLetter: () =>
    set({ coverLetter: null, isGeneratingCoverLetter: false, coverLetterError: null }),
})
