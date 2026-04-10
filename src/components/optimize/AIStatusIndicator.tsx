import { Badge } from '../ui/Badge'

interface AIStatusIndicatorProps {
  status: 'idle' | 'loading' | 'success' | 'error' | 'rate_limited'
  remaining?: number
}

export function AIStatusIndicator({ status, remaining }: AIStatusIndicatorProps) {
  if (status === 'idle') return null

  const config = {
    loading: { variant: 'cyan' as const, text: 'AI Processing...', pulse: true },
    success: { variant: 'green' as const, text: 'AI Complete', pulse: false },
    error: { variant: 'red' as const, text: 'AI Unavailable', pulse: false },
    rate_limited: { variant: 'yellow' as const, text: 'Rate Limited', pulse: true },
  }

  const { variant, text, pulse } = config[status]

  return (
    <div className="flex items-center gap-2">
      <Badge variant={variant} pulse={pulse}>
        {text}
      </Badge>
      {remaining !== undefined && status === 'success' && (
        <span className="text-xs font-[family-name:var(--theme-heading-font,var(--font-mono))] text-text-muted">
          {remaining} requests remaining today
        </span>
      )}
    </div>
  )
}
