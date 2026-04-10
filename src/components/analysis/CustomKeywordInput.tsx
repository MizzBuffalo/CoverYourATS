import { useState } from 'react'
import { useAppStore } from '../../stores/useAppStore'

export function CustomKeywordInput() {
  const [input, setInput] = useState('')
  const customKeywords = useAppStore((s) => s.customKeywords)
  const addCustomKeyword = useAppStore((s) => s.addCustomKeyword)
  const removeCustomKeyword = useAppStore((s) => s.removeCustomKeyword)

  const handleAdd = () => {
    if (!input.trim()) return
    addCustomKeyword(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-xs font-mono text-text-muted uppercase tracking-wider">
          Missing something?
        </p>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a keyword the scanner missed..."
          className="flex-1 bg-cyber-dark border border-cyber-border rounded-sm px-3 py-2 text-sm text-text-primary font-mono placeholder:text-text-muted/50 focus:outline-none focus:border-neon-cyan/50 transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="px-4 py-2 text-xs font-mono uppercase bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 rounded-sm hover:bg-neon-cyan/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Add
        </button>
      </div>
      {customKeywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customKeywords.map((kw) => (
            <span
              key={kw.keyword}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 rounded-sm"
            >
              {kw.keyword}
              <button
                onClick={() => removeCustomKeyword(kw.keyword)}
                className="text-text-muted hover:text-neon-red transition-colors cursor-pointer"
                aria-label={`Remove ${kw.keyword}`}
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
