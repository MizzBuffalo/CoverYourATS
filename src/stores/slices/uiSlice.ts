import type { StateCreator } from 'zustand'

export interface UISlice {
  currentStep: number
  isProcessing: boolean
  processingMessage: string
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setProcessing: (isProcessing: boolean, message?: string) => void
  reset: () => void
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  currentStep: 1,
  isProcessing: false,
  processingMessage: '',
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 5) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
  setProcessing: (isProcessing, message = '') =>
    set({ isProcessing, processingMessage: message }),
  reset: () => set({ currentStep: 1, isProcessing: false, processingMessage: '' }),
})
