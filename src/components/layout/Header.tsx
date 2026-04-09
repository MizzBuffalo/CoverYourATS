import { GlitchText } from '../animations/GlitchText'

export function Header() {
  return (
    <header className="border-b border-cyber-border bg-cyber-black/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-neon-cyan/50 rounded-sm flex items-center justify-center">
            <span className="text-neon-cyan font-mono text-xs font-bold">ATS</span>
          </div>
          <GlitchText
            text="CoverYourATS"
            as="h1"
            className="text-lg text-neon-cyan tracking-wider"
            active={false}
          />
        </div>
        <span className="text-xs font-mono text-text-muted hidden sm:block">
          RESUME KEYWORD OPTIMIZER
        </span>
      </div>
    </header>
  )
}
