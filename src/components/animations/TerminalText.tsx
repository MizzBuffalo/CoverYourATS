import { useState, useEffect } from 'react'
import { cn } from '../../lib/cn'

interface TerminalTextProps {
  lines: string[]
  speed?: number
  className?: string
  onComplete?: () => void
}

export function TerminalText({ lines, speed = 30, className, onComplete }: TerminalTextProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (currentLine >= lines.length) {
      setDone(true) // eslint-disable-line react-hooks/set-state-in-effect -- terminal animation state machine
      onComplete?.()
      return
    }

    const line = lines[currentLine]
    if (currentChar >= line.length) {
      setDisplayedLines((prev) => [...prev, line])
      setCurrentLine((prev) => prev + 1)
      setCurrentChar(0)
      return
    }

    const timeout = setTimeout(() => {
      setCurrentChar((prev) => prev + 1)
    }, speed)

    return () => clearTimeout(timeout)
  }, [currentLine, currentChar, lines, speed, onComplete])

  const partialLine = currentLine < lines.length ? lines[currentLine].slice(0, currentChar) : ''

  return (
    <div className={cn('font-mono text-sm space-y-1', className)}>
      {displayedLines.map((line, i) => (
        <div key={i} className="text-neon-green">
          <span className="text-text-muted mr-2">&gt;</span>
          {line}
        </div>
      ))}
      {!done && (
        <div className="text-neon-green">
          <span className="text-text-muted mr-2">&gt;</span>
          {partialLine}
          <span className="animate-[cursor-blink_0.8s_step-end_infinite] text-neon-cyan">_</span>
        </div>
      )}
    </div>
  )
}
