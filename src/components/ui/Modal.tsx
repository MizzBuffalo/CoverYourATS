import { useEffect, useRef } from 'react'
import { cn } from '../../lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className={cn(
          'bg-cyber-panel border border-cyber-border rounded-sm shadow-[0_0_30px_rgba(var(--glow-cyan),0.1)]',
          'w-full max-w-lg mx-4 animate-[fade-in-up_0.2s_ease-out]',
          className
        )}
      >
        {title && (
          <div className="px-5 py-3 border-b border-cyber-border">
            <h2 className="font-mono text-neon-cyan text-sm uppercase tracking-wider">{title}</h2>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
