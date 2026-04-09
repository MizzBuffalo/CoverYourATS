import type { StateCreator } from 'zustand'
import type { RewrittenBullet } from '../../types'

export interface RewriteSlice {
  rewrittenBullets: RewrittenBullet[]
  isRewriting: boolean
  rewriteError: string | null
  setRewrittenBullets: (bullets: RewrittenBullet[]) => void
  setRewriting: (loading: boolean) => void
  setRewriteError: (error: string | null) => void
  clearRewrites: () => void
}

export const createRewriteSlice: StateCreator<RewriteSlice, [], [], RewriteSlice> = (set) => ({
  rewrittenBullets: [],
  isRewriting: false,
  rewriteError: null,
  setRewrittenBullets: (bullets) => set({ rewrittenBullets: bullets }),
  setRewriting: (loading) => set({ isRewriting: loading }),
  setRewriteError: (error) => set({ rewriteError: error }),
  clearRewrites: () =>
    set({ rewrittenBullets: [], isRewriting: false, rewriteError: null }),
})
