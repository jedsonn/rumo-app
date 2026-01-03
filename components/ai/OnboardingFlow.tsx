'use client'

import { useState } from 'react'
import { Sparkles, ChevronRight, ChevronLeft, Loader2, Check } from 'lucide-react'
import { LIFE_STAGES, PRIORITIES } from '@/lib/ai/prompts'

interface OnboardingFlowProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  themeColor: 'blue' | 'rose'
  isDark: boolean
}

type Step = 'welcome' | 'life-stage' | 'priorities' | 'generating' | 'complete'

export function OnboardingFlow({
  isOpen,
  onClose,
  onComplete,
  themeColor,
  isDark,
}: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>('welcome')
  const [lifeStage, setLifeStage] = useState<string>('')
  const [priorities, setPriorities] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [generatedCount, setGeneratedCount] = useState(0)

  if (!isOpen) return null

  const togglePriority = (priority: string) => {
    setPriorities(prev => {
      if (prev.includes(priority)) {
        return prev.filter(p => p !== priority)
      }
      if (prev.length >= 5) return prev // Max 5 priorities
      return [...prev, priority]
    })
  }

  const handleGenerate = async () => {
    setStep('generating')
    setError(null)

    try {
      const response = await fetch('/api/ai/generate-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lifeStage, priorities }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate goals')
      }

      setGeneratedCount(data.count)
      setStep('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('priorities') // Go back to allow retry
    }
  }

  const buttonClass = themeColor === 'blue'
    ? 'bg-blue-500 hover:bg-blue-600 text-white'
    : 'bg-rose-500 hover:bg-rose-600 text-white'

  const selectedClass = themeColor === 'blue'
    ? (isDark ? 'bg-blue-900/50 border-blue-500 text-blue-300' : 'bg-blue-100 border-blue-500 text-blue-700')
    : (isDark ? 'bg-rose-900/50 border-rose-500 text-rose-300' : 'bg-rose-100 border-rose-500 text-rose-700')

  const unselectedClass = isDark
    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 flex items-center gap-3 ${
          themeColor === 'blue' ? 'gradient-bg' : 'gradient-bg-pink'
        }`}>
          <Sparkles className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white">AI Goal Generator</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step: Welcome */}
          {step === 'welcome' && (
            <div className="text-center space-y-4">
              <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
                themeColor === 'blue' ? 'bg-blue-100' : 'bg-rose-100'
              }`}>
                <Sparkles className={`w-10 h-10 ${
                  themeColor === 'blue' ? 'text-blue-500' : 'text-rose-500'
                }`} />
              </div>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Let's create your goals!
              </h3>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Answer a few quick questions and our AI will generate personalized goals for your Personal and Professional life.
              </p>
              <button
                onClick={() => setStep('life-stage')}
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${buttonClass}`}
              >
                Get Started <ChevronRight size={20} />
              </button>
              <button
                onClick={onClose}
                className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
              >
                I'll add goals manually
              </button>
            </div>
          )}

          {/* Step: Life Stage */}
          {step === 'life-stage' && (
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                What stage of life are you in?
              </h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                This helps us suggest relevant goals for your situation.
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {LIFE_STAGES.map(stage => (
                  <button
                    key={stage}
                    onClick={() => setLifeStage(stage)}
                    className={`p-3 rounded-lg border text-sm text-left transition-all ${
                      lifeStage === stage ? selectedClass : unselectedClass
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep('welcome')}
                  className={`flex-1 py-2 rounded-lg border ${
                    isDark ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <ChevronLeft size={18} className="inline mr-1" /> Back
                </button>
                <button
                  onClick={() => setStep('priorities')}
                  disabled={!lifeStage}
                  className={`flex-1 py-2 rounded-lg font-semibold ${buttonClass} disabled:opacity-50`}
                >
                  Next <ChevronRight size={18} className="inline ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* Step: Priorities */}
          {step === 'priorities' && (
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                What are your top priorities?
              </h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Select up to 5 areas you want to focus on this year.
              </p>
              {error && (
                <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {PRIORITIES.map(priority => (
                  <button
                    key={priority}
                    onClick={() => togglePriority(priority)}
                    className={`p-3 rounded-lg border text-sm text-left transition-all flex items-center gap-2 ${
                      priorities.includes(priority) ? selectedClass : unselectedClass
                    }`}
                  >
                    {priorities.includes(priority) && <Check size={14} />}
                    {priority}
                  </button>
                ))}
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Selected: {priorities.length}/5
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep('life-stage')}
                  className={`flex-1 py-2 rounded-lg border ${
                    isDark ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <ChevronLeft size={18} className="inline mr-1" /> Back
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={priorities.length === 0}
                  className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 ${buttonClass} disabled:opacity-50`}
                >
                  <Sparkles size={18} /> Generate Goals
                </button>
              </div>
            </div>
          )}

          {/* Step: Generating */}
          {step === 'generating' && (
            <div className="text-center space-y-4 py-8">
              <Loader2 className={`w-12 h-12 mx-auto animate-spin ${
                themeColor === 'blue' ? 'text-blue-500' : 'text-rose-500'
              }`} />
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Creating your personalized goals...
              </h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Our AI is crafting goals based on your life stage and priorities.
              </p>
            </div>
          )}

          {/* Step: Complete */}
          {step === 'complete' && (
            <div className="text-center space-y-4">
              <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
                themeColor === 'blue' ? 'bg-green-100' : 'bg-green-100'
              }`}>
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {generatedCount} Goals Created!
              </h3>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                We've added personalized goals to both your Personal and Professional lists. Feel free to edit, remove, or add more!
              </p>
              <button
                onClick={() => {
                  onComplete()
                  onClose()
                }}
                className={`w-full py-3 rounded-lg font-semibold ${buttonClass}`}
              >
                View My Goals
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
