import { cn } from '../../lib/cn'
import { STEPS } from '../../config/constants'
import { useAppStore } from '../../stores/useAppStore'

export function StepIndicator() {
  const currentStep = useAppStore((s) => s.currentStep)
  const setStep = useAppStore((s) => s.setStep)

  return (
    <div className="border-b border-cyber-border bg-cyber-black/50">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center gap-1 sm:gap-2">
          {STEPS.map((step, i) => {
            const isActive = step.id === currentStep
            const isComplete = step.id < currentStep
            const canClick = step.id < currentStep

            return (
              <div key={step.id} className="flex items-center gap-1 sm:gap-2 flex-1">
                <button
                  onClick={() => canClick && setStep(step.id)}
                  disabled={!canClick}
                  className={cn(
                    'flex items-center gap-1.5 sm:gap-2 font-mono text-xs transition-colors',
                    isActive && 'text-neon-cyan',
                    isComplete && 'text-neon-green cursor-pointer hover:text-neon-cyan',
                    !isActive && !isComplete && 'text-text-muted',
                    !canClick && 'cursor-default'
                  )}
                >
                  <span
                    className={cn(
                      'w-6 h-6 flex items-center justify-center border rounded-sm text-[10px] flex-shrink-0',
                      isActive && 'border-neon-cyan bg-neon-cyan/10',
                      isComplete && 'border-neon-green bg-neon-green/10',
                      !isActive && !isComplete && 'border-cyber-border'
                    )}
                  >
                    {isComplete ? '✓' : step.id}
                  </span>
                  <span className="hidden sm:inline truncate">{step.label}</span>
                  <span className="sm:hidden truncate">{step.shortLabel}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'h-px flex-1 min-w-2',
                      isComplete ? 'bg-neon-green/50' : 'bg-cyber-border'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
