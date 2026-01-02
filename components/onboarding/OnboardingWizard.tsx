'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { ArrowRight, Target, Sparkles, BookOpen, Check } from 'lucide-react'

interface OnboardingWizardProps {
  isOpen: boolean
  onClose: () => void
  onOpenTemplates: () => void
  isBlue: boolean
}

const STEPS = [
  {
    title: 'Welcome to MyResolve!',
    subtitle: 'Your personal goal-tracking companion',
    content: 'MyResolve helps you set meaningful goals, track progress, and stay motivated. Let\'s get you started in just a few steps.',
    icon: Sparkles,
  },
  {
    title: 'Two Types of Goals',
    subtitle: 'Personal & Professional',
    content: 'Organize your goals into two categories. Personal goals for health, relationships, and hobbies. Professional goals for career, skills, and income.',
    icon: Target,
  },
  {
    title: 'Track Your Journey',
    subtitle: 'Status & Time Horizons',
    content: 'Click status badges to cycle through: Doing → On Track → For Later → Done → Dropped. Set 1-year, 3-year, or 5-year horizons for each goal.',
    icon: Check,
  },
  {
    title: 'Start with Templates',
    subtitle: 'Or create your own',
    content: 'Browse our curated goal packs for inspiration, or start fresh with your own goals. You can always add more later!',
    icon: BookOpen,
  },
]

export function OnboardingWizard({ isOpen, onClose, onOpenTemplates, isBlue }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handleSkip = () => {
    onClose()
  }

  const handleUseTemplates = () => {
    onClose()
    onOpenTemplates()
  }

  const gradientClass = isBlue ? 'gradient-bg' : 'gradient-bg-pink'
  const gradientText = isBlue ? 'gradient-text' : 'gradient-text-pink'
  const step = STEPS[currentStep]
  const Icon = step.icon
  const isLastStep = currentStep === STEPS.length - 1

  return (
    <Modal isOpen={isOpen} onClose={handleSkip} title="" size="md">
      <div className="text-center py-4">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? `${gradientClass} w-6`
                  : index < currentStep
                  ? 'bg-green-400'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl ${gradientClass} flex items-center justify-center mx-auto mb-6`}>
          <Icon size={32} className="text-white" />
        </div>

        {/* Content */}
        <h2 className={`text-2xl font-serif font-bold mb-2 ${gradientText}`}>
          {step.title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {step.subtitle}
        </p>
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-sm mx-auto">
          {step.content}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {isLastStep ? (
            <>
              <button
                onClick={handleUseTemplates}
                className={`w-full py-3 rounded-xl text-white ${gradientClass} hover:opacity-90 flex items-center justify-center gap-2 font-medium`}
              >
                <BookOpen size={20} />
                Browse Templates
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
              >
                Start from Scratch
              </button>
            </>
          ) : (
            <button
              onClick={handleNext}
              className={`w-full py-3 rounded-xl text-white ${gradientClass} hover:opacity-90 flex items-center justify-center gap-2 font-medium`}
            >
              Continue
              <ArrowRight size={20} />
            </button>
          )}

          {!isLastStep && (
            <button
              onClick={handleSkip}
              className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              Skip intro
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
