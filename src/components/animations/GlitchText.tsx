import { cn } from '../../lib/cn'

interface GlitchTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p'
  active?: boolean
}

export function GlitchText({ text, className, as: Tag = 'span', active = true }: GlitchTextProps) {
  return (
    <Tag
      className={cn(
        'relative inline-block font-mono font-bold',
        active && 'animate-[glitch_0.3s_ease-in-out_infinite_alternate]',
        className
      )}
      data-text={text}
    >
      {text}
      {active && (
        <>
          <span
            className="absolute top-0 left-0 w-full h-full text-neon-cyan opacity-70"
            style={{
              clipPath: 'inset(0 0 65% 0)',
              transform: 'translate(-2px, -1px)',
            }}
            aria-hidden
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 w-full h-full text-neon-red opacity-70"
            style={{
              clipPath: 'inset(60% 0 0 0)',
              transform: 'translate(2px, 1px)',
            }}
            aria-hidden
          >
            {text}
          </span>
        </>
      )}
    </Tag>
  )
}
