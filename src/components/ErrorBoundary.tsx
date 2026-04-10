import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-surface border border-border-dim rounded-lg p-6 space-y-4">
            <h2 className="theme-label text-neon-red text-lg">
              System Error
            </h2>
            <p className="text-text-secondary text-sm">
              Something went wrong. Your data has been saved and will be restored on reload.
            </p>
            {this.state.error && (
              <pre className="text-xs text-text-muted font-[family-name:var(--theme-heading-font,var(--font-mono))] bg-bg-deep p-3 rounded-[var(--theme-radius)] overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 text-sm font-[family-name:var(--theme-heading-font,var(--font-mono))] bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 rounded-[var(--theme-radius)] hover:bg-neon-cyan/20 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm font-mono bg-surface text-text-secondary border border-border-dim rounded hover:bg-border-dim/30 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
