'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import {
  GraduationCap, Briefcase, Users, Building2, Rocket, Heart,
  Target, Dumbbell, Wallet, BookOpen, Scale, Home,
  ChevronRight, ChevronLeft, Sparkles, Check, X, ArrowRight
} from 'lucide-react'
import { LifeStage, Priority, GoalPeriod, GoalCategory } from '@/lib/types'

interface GeneratedGoal {
  goal: string
  action: string
  period: GoalPeriod
  category: GoalCategory
  selected?: boolean
}

interface AIOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (goals: GeneratedGoal[], lifeStage: LifeStage, priorities: Priority[]) => Promise<void>
  isDark?: boolean
  isBlue?: boolean
  year: number
}

const LIFE_STAGES: { value: LifeStage; label: string; description: string; icon: typeof GraduationCap }[] = [
  { value: 'student', label: 'Student', description: 'Focused on education and skill-building', icon: GraduationCap },
  { value: 'early_career', label: 'Early Career', description: 'Building career and financial stability', icon: Briefcase },
  { value: 'mid_career', label: 'Mid Career', description: 'Balancing growth with family', icon: Users },
  { value: 'senior', label: 'Senior Professional', description: 'Mentoring and planning retirement', icon: Building2 },
  { value: 'entrepreneur', label: 'Entrepreneur', description: 'Building and growing ventures', icon: Rocket },
  { value: 'retired', label: 'Retired', description: 'Focused on fulfillment and legacy', icon: Heart },
]

const PRIORITIES: { value: Priority; label: string; icon: typeof Target }[] = [
  { value: 'career', label: 'Career Growth', icon: Target },
  { value: 'health', label: 'Health & Fitness', icon: Dumbbell },
  { value: 'family', label: 'Family & Relationships', icon: Home },
  { value: 'finance', label: 'Financial Security', icon: Wallet },
  { value: 'learning', label: 'Learning & Growth', icon: BookOpen },
  { value: 'balance', label: 'Work-Life Balance', icon: Scale },
]

export function AIOnboardingModal({
  isOpen,
  onClose,
  onComplete,
  isDark = false,
  isBlue = true,
  year
}: AIOnboardingModalProps) {
  const [step, setStep] = useState(1)
  const [lifeStage, setLifeStage] = useState<LifeStage | null>(null)
  const [priorities, setPriorities] = useState<Priority[]>([])
  const [generatedGoals, setGeneratedGoals] = useState<GeneratedGoal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const themeColor = isBlue ? 'blue' : 'rose'
  const totalSteps = 4

  const handlePriorityToggle = (priority: Priority) => {
    if (priorities.includes(priority)) {
      setPriorities(priorities.filter(p => p !== priority))
    } else if (priorities.length < 5) {
      setPriorities([...priorities, priority])
    }
  }

  const handleGenerateGoals = async () => {
    if (!lifeStage || priorities.length === 0) return

    setLoading(true)
    setError(null)
    setStep(3)

    try {
      const response = await fetch('/api/generate-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lifeStage, priorities, year }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate goals')
      }

      const data = await response.json()
      const goalsWithSelection = data.goals.map((g: GeneratedGoal) => ({ ...g, selected: true }))
      setGeneratedGoals(goalsWithSelection)
      setStep(4)
    } catch (err) {
      setError('Failed to generate goals. Please try again.')
      setStep(2) // Go back to priorities step
    } finally {
      setLoading(false)
    }
  }

  const handleGoalToggle = (index: number) => {
    setGeneratedGoals(goals =>
      goals.map((g, i) => i === index ? { ...g, selected: !g.selected } : g)
    )
  }

  const handleSelectAll = () => {
    setGeneratedGoals(goals => goals.map(g => ({ ...g, selected: true })))
  }

  const handleDeselectAll = () => {
    setGeneratedGoals(goals => goals.map(g => ({ ...g, selected: false })))
  }

  const handleComplete = async () => {
    if (!lifeStage) return

    setSaving(true)
    try {
      const selectedGoals = generatedGoals.filter(g => g.selected)
      await onComplete(selectedGoals, lifeStage, priorities)
      onClose()
    } catch (err) {
      setError('Failed to save goals. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSkip = () => {
    onComplete([], lifeStage || 'early_career', priorities.length > 0 ? priorities : ['career'])
    onClose()
  }

  const canProceed = () => {
    if (step === 1) return !!lifeStage
    if (step === 2) return priorities.length >= 1
    return true
  }

  const selectedCount = generatedGoals.filter(g => g.selected).length

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="lg">
      <div className="py-2">
        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                s === step
                  ? `bg-${themeColor}-500 text-white`
                  : s < step
                    ? `bg-${themeColor}-100 text-${themeColor}-600 dark:bg-${themeColor}-900/50 dark:text-${themeColor}-400`
                    : isDark ? 'bg-slate-700 text-slate-500' : 'bg-slate-100 text-slate-400'
              }`}>
                {s < step ? <Check size={16} /> : s}
              </div>
              {s < 4 && (
                <div className={`w-8 h-0.5 ${s < step ? `bg-${themeColor}-500` : isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Life Stage */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${themeColor}-400 to-${themeColor}-600 flex items-center justify-center mx-auto mb-4`}>
                <Sparkles size={32} className="text-white" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Let&apos;s personalize your goals
              </h2>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                AI will generate tailored resolutions based on your life stage and priorities
              </p>
            </div>

            <h3 className={`font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              What best describes your current life stage?
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {LIFE_STAGES.map(({ value, label, description, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setLifeStage(value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    lifeStage === value
                      ? `border-${themeColor}-500 ${isDark ? `bg-${themeColor}-900/30` : `bg-${themeColor}-50`}`
                      : isDark
                        ? 'border-slate-700 hover:border-slate-600 bg-slate-800'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      lifeStage === value
                        ? `bg-${themeColor}-500 text-white`
                        : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{label}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Priorities */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                What matters most to you?
              </h2>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Select 1-5 priorities for {year}
              </p>
            </div>

            {error && (
              <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'} text-sm`}>
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {PRIORITIES.map(({ value, label, icon: Icon }) => {
                const isSelected = priorities.includes(value)
                return (
                  <button
                    key={value}
                    onClick={() => handlePriorityToggle(value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? `border-${themeColor}-500 ${isDark ? `bg-${themeColor}-900/30` : `bg-${themeColor}-50`}`
                        : isDark
                          ? 'border-slate-700 hover:border-slate-600 bg-slate-800'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? `bg-${themeColor}-500 text-white`
                          : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{label}</p>
                      {isSelected && (
                        <Check size={18} className={`ml-auto text-${themeColor}-500`} />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <p className={`text-center mt-4 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {priorities.length}/5 selected
            </p>
          </div>
        )}

        {/* Step 3: Loading */}
        {step === 3 && loading && (
          <div className="animate-fade-in text-center py-12">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-${themeColor}-400 to-${themeColor}-600 flex items-center justify-center mx-auto mb-6`}>
              <Spinner size="lg" className="text-white" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Creating your personalized goals...
            </h2>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              AI is crafting resolutions tailored to your life stage and priorities
            </p>
          </div>
        )}

        {/* Step 4: Goal Selection */}
        {step === 4 && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Your AI-Generated Goals
                </h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Select which goals to add ({selectedCount} selected)
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Select All
                </button>
                <button
                  onClick={handleDeselectAll}
                  className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Deselect All
                </button>
              </div>
            </div>

            {error && (
              <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'} text-sm`}>
                {error}
              </div>
            )}

            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
              {generatedGoals.map((goal, index) => (
                <div
                  key={index}
                  onClick={() => handleGoalToggle(index)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    goal.selected
                      ? `border-${themeColor}-500 ${isDark ? `bg-${themeColor}-900/20` : `bg-${themeColor}-50`}`
                      : isDark
                        ? 'border-slate-700 bg-slate-800/50 opacity-60'
                        : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      goal.selected
                        ? `bg-${themeColor}-500 border-${themeColor}-500`
                        : isDark ? 'border-slate-600' : 'border-slate-300'
                    }`}>
                      {goal.selected && <Check size={12} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {goal.goal}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {goal.action}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          goal.category === 'Personal'
                            ? (isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700')
                            : (isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700')
                        }`}>
                          {goal.category}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          goal.period === 'One-year'
                            ? (isDark ? 'bg-sky-900/50 text-sky-300' : 'bg-sky-100 text-sky-700')
                            : goal.period === 'Three-years'
                            ? (isDark ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-700')
                            : (isDark ? 'bg-violet-900/50 text-violet-300' : 'bg-violet-100 text-violet-700')
                        }`}>
                          {goal.period}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className={`flex items-center justify-between mt-6 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div>
            {step > 1 && step < 3 && (
              <button
                onClick={() => setStep(step - 1)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <ChevronLeft size={18} /> Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSkip}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-slate-300'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Skip for now
            </button>

            {step < 3 && (
              <button
                onClick={() => {
                  if (step === 2) {
                    handleGenerateGoals()
                  } else {
                    setStep(step + 1)
                  }
                }}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-${themeColor}-500 hover:bg-${themeColor}-600`}
              >
                {step === 2 ? (
                  <>
                    <Sparkles size={18} /> Generate Goals
                  </>
                ) : (
                  <>
                    Continue <ChevronRight size={18} />
                  </>
                )}
              </button>
            )}

            {step === 4 && (
              <button
                onClick={handleComplete}
                disabled={saving}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white transition-colors disabled:opacity-50 bg-${themeColor}-500 hover:bg-${themeColor}-600`}
              >
                {saving ? (
                  <>
                    <Spinner size="sm" /> Saving...
                  </>
                ) : (
                  <>
                    Add {selectedCount} Goals <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
