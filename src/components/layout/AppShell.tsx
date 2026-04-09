import { Header } from './Header'
import { Footer } from './Footer'
import { StepIndicator } from './StepIndicator'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <StepIndicator />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 relative">
        {children}
      </main>
      <Footer />
    </div>
  )
}
