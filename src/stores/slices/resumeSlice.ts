import type { StateCreator } from 'zustand'
import type { ResumeBullet, ResumeSection } from '../../types'

export interface ResumeSlice {
  resumeRawText: string | null
  resumeSections: ResumeSection[]
  resumeBullets: ResumeBullet[]
  isParsingResume: boolean
  setResumeText: (text: string) => void
  setResumeSections: (sections: ResumeSection[]) => void
  setResumeBullets: (bullets: ResumeBullet[]) => void
  setParsingResume: (loading: boolean) => void
  clearResume: () => void
}

export const createResumeSlice: StateCreator<ResumeSlice, [], [], ResumeSlice> = (set) => ({
  resumeRawText: null,
  resumeSections: [],
  resumeBullets: [],
  isParsingResume: false,
  setResumeText: (text) => set({ resumeRawText: text }),
  setResumeSections: (sections) => set({ resumeSections: sections }),
  setResumeBullets: (bullets) => set({ resumeBullets: bullets }),
  setParsingResume: (loading) => set({ isParsingResume: loading }),
  clearResume: () =>
    set({
      resumeRawText: null,
      resumeSections: [],
      resumeBullets: [],
      isParsingResume: false,
    }),
})
