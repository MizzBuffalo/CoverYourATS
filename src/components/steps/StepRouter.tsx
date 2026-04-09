import { lazy, Suspense } from 'react'
import { useAppStore } from '../../stores/useAppStore'

const Step1_JobInput = lazy(() => import('./Step1_JobInput'))
const Step2_ResumeInput = lazy(() => import('./Step2_ResumeInput'))
const Step3_Analysis = lazy(() => import('./Step3_Analysis'))
const Step4_Optimize = lazy(() => import('./Step4_Optimize'))
const Step5_Export = lazy(() => import('./Step5_Export'))

function StepFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-neon-cyan border-t-transparent rounded-full animate-[spin_1s_linear_infinite]" />
    </div>
  )
}

export function StepRouter() {
  const currentStep = useAppStore((s) => s.currentStep)

  return (
    <Suspense fallback={<StepFallback />}>
      {currentStep === 1 && <Step1_JobInput />}
      {currentStep === 2 && <Step2_ResumeInput />}
      {currentStep === 3 && <Step3_Analysis />}
      {currentStep === 4 && <Step4_Optimize />}
      {currentStep === 5 && <Step5_Export />}
    </Suspense>
  )
}
