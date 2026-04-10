import type { StateCreator } from 'zustand'

export type ThemeName = 'neon-cyan' | 'hacker-blue' | 'matrix-green' | 'synthwave' | 'stealth'

export interface ThemeSlice {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
}

function applyTheme(theme: ThemeName) {
  if (theme === 'neon-cyan') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

export const createThemeSlice: StateCreator<ThemeSlice, [], [], ThemeSlice> = (set) => ({
  theme: 'neon-cyan',
  setTheme: (theme) => {
    applyTheme(theme)
    set({ theme })
  },
})

// Apply theme on hydration from localStorage
export function hydrateTheme(theme: ThemeName) {
  applyTheme(theme)
}
