import { cn } from '../../lib/cn'
import { useAppStore } from '../../stores/useAppStore'
import type { ThemeName } from '../../stores/slices/themeSlice'

const THEMES: { name: ThemeName; label: string; color: string }[] = [
  { name: 'neon-cyan', label: 'Neon Cyan', color: '#00ffcc' },
  { name: 'hacker-blue', label: 'Hacker Blue', color: '#4da6ff' },
  { name: 'matrix-green', label: 'Matrix Green', color: '#00ff41' },
  { name: 'synthwave', label: 'Synthwave', color: '#ff6ec7' },
  { name: 'stealth', label: 'Stealth', color: '#a0a0a0' },
]

export function ThemePicker() {
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)

  return (
    <div className="flex items-center gap-1.5">
      {THEMES.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          aria-label={`Switch to ${t.label} theme`}
          className={cn(
            'w-5 h-5 rounded-full border-2 transition-all duration-200 cursor-pointer',
            theme === t.name
              ? 'border-white scale-110'
              : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
          )}
          style={{ backgroundColor: t.color }}
        />
      ))}
    </div>
  )
}
