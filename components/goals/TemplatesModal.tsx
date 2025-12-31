'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { TEMPLATE_PACKS, PACK_COLORS, GoalTemplate, TemplatePack } from '@/lib/templates'
import { Check, ChevronRight, ArrowLeft, Plus } from 'lucide-react'

interface TemplatesModalProps {
  isOpen: boolean
  onClose: () => void
  onAddGoals: (goals: GoalTemplate[]) => void
  isBlue: boolean
}

export function TemplatesModal({ isOpen, onClose, onAddGoals, isBlue }: TemplatesModalProps) {
  const [selectedPack, setSelectedPack] = useState<TemplatePack | null>(null)
  const [selectedGoals, setSelectedGoals] = useState<Set<number>>(new Set())

  const handleSelectPack = (pack: TemplatePack) => {
    setSelectedPack(pack)
    setSelectedGoals(new Set(pack.goals.map((_, i) => i))) // Select all by default
  }

  const handleBack = () => {
    setSelectedPack(null)
    setSelectedGoals(new Set())
  }

  const toggleGoal = (index: number) => {
    const newSelected = new Set(selectedGoals)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedGoals(newSelected)
  }

  const handleAddSelected = () => {
    if (!selectedPack) return
    const goalsToAdd = selectedPack.goals.filter((_, i) => selectedGoals.has(i))
    onAddGoals(goalsToAdd)
    onClose()
    setSelectedPack(null)
    setSelectedGoals(new Set())
  }

  const gradientClass = isBlue ? 'gradient-bg' : 'gradient-bg-pink'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={selectedPack ? selectedPack.name : 'Goal Templates'} size="lg">
      {!selectedPack ? (
        // Pack Selection View
        <div className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Choose a template pack to quickly add pre-built goals
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEMPLATE_PACKS.map((pack) => {
              const colors = PACK_COLORS[pack.color]
              return (
                <button
                  key={pack.id}
                  onClick={() => handleSelectPack(pack)}
                  className={`text-left p-4 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-md transition-all group`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{pack.emoji}</span>
                        <h3 className={`font-semibold ${colors.text}`}>{pack.name}</h3>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {pack.description}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        {pack.goals.length} goals
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        // Goal Selection View
        <div>
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-4"
          >
            <ArrowLeft size={16} />
            Back to templates
          </button>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{selectedPack.emoji}</span>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">{selectedPack.name}</h3>
              <p className="text-sm text-slate-500">{selectedPack.description}</p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {selectedPack.goals.map((goal, index) => {
              const isSelected = selectedGoals.has(index)
              return (
                <button
                  key={index}
                  onClick={() => toggleGoal(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {isSelected && <Check size={12} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 dark:text-slate-100">{goal.goal}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        → {goal.action}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {goal.period === 'One-year' ? '1yr' : goal.period === 'Three-years' ? '3yr' : '5yr'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {goal.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500">
              {selectedGoals.size} of {selectedPack.goals.length} selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleBack}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSelected}
                disabled={selectedGoals.size === 0}
                className={`px-4 py-2 rounded-lg text-white ${gradientClass} hover:opacity-90 disabled:opacity-50 flex items-center gap-2`}
              >
                <Plus size={18} />
                Add {selectedGoals.size} Goals
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
