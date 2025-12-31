'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { SUGGESTIONS, BLESSING_SUGGESTIONS, REWARD_SUGGESTIONS, GoalSuggestion } from '@/lib/suggestions'
import { GoalCategory } from '@/lib/types'
import { Check, Plus, User, Briefcase, Sparkles } from 'lucide-react'

type SuggestionType = 'goal' | 'blessing' | 'reward'

interface SuggestionsModalProps {
  isOpen: boolean
  onClose: () => void
  type: SuggestionType
  category?: GoalCategory  // Only used for goals
  onAddGoal?: (suggestion: GoalSuggestion, category: GoalCategory) => void
  onAddBlessing?: (text: string, category: GoalCategory) => void
  onAddReward?: (text: string, cost: number) => void
  themeColor: 'blue' | 'rose'
  isDark: boolean
}

// SuggestionsModal - unified suggestions picker (matches template EXACTLY)
export function SuggestionsModal({
  isOpen,
  onClose,
  type,
  category = 'Personal',
  onAddGoal,
  onAddBlessing,
  onAddReward,
  themeColor,
  isDark
}: SuggestionsModalProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [activeCategory, setActiveCategory] = useState<GoalCategory>(category)

  const getTitle = () => {
    switch (type) {
      case 'goal': return `Goal Suggestions - ${activeCategory}`
      case 'blessing': return 'Blessing Suggestions'
      case 'reward': return 'Reward Suggestions'
    }
  }

  const getSuggestions = () => {
    switch (type) {
      case 'goal': return SUGGESTIONS[activeCategory]
      case 'blessing': return BLESSING_SUGGESTIONS
      case 'reward': return REWARD_SUGGESTIONS
    }
  }

  const suggestions = getSuggestions()

  const toggleItem = (index: number) => {
    const next = new Set(selected)
    if (next.has(index)) next.delete(index)
    else next.add(index)
    setSelected(next)
  }

  const handleAdd = () => {
    if (type === 'goal' && onAddGoal) {
      const goalSuggestions = suggestions as GoalSuggestion[]
      selected.forEach(index => {
        onAddGoal(goalSuggestions[index], activeCategory)
      })
    } else if (type === 'blessing' && onAddBlessing) {
      const blessingSuggestions = suggestions as string[]
      selected.forEach(index => {
        onAddBlessing(blessingSuggestions[index], activeCategory)
      })
    } else if (type === 'reward' && onAddReward) {
      const rewardSuggestions = suggestions as string[]
      selected.forEach(index => {
        onAddReward(rewardSuggestions[index], 0)
      })
    }
    setSelected(new Set())
    onClose()
  }

  const gradientClass = themeColor === 'blue' ? 'gradient-bg' : 'gradient-bg-pink'
  const themeHeaderClass = type === 'goal'
    ? (themeColor === 'blue' ? 'from-blue-500 to-indigo-500' : 'from-rose-500 to-pink-500')
    : type === 'blessing'
      ? 'from-amber-500 to-orange-500'
      : 'from-emerald-500 to-teal-500'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="lg">
      <div className="space-y-4">
        {/* Category Toggle for goals and blessings */}
        {(type === 'goal' || type === 'blessing') && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { setActiveCategory('Personal'); setSelected(new Set()) }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeCategory === 'Personal'
                  ? (isDark ? 'bg-slate-600 text-white' : 'bg-slate-800 text-white')
                  : (isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
              }`}
            >
              <User size={14} />
              Personal
            </button>
            <button
              onClick={() => { setActiveCategory('Professional'); setSelected(new Set()) }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeCategory === 'Professional'
                  ? (isDark ? 'bg-slate-600 text-white' : 'bg-slate-800 text-white')
                  : (isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
              }`}
            >
              <Briefcase size={14} />
              Professional
            </button>
          </div>
        )}

        {/* Suggestions Grid */}
        <div className="max-h-[400px] overflow-y-auto space-y-2">
          {type === 'goal' ? (
            // Goal suggestions with action
            (suggestions as GoalSuggestion[]).map((s, i) => (
              <button
                key={i}
                onClick={() => toggleItem(i)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selected.has(i)
                    ? (isDark
                        ? `border-${themeColor}-500 bg-${themeColor}-900/30`
                        : `border-${themeColor}-300 bg-${themeColor}-50`)
                    : (isDark
                        ? 'border-slate-700 hover:border-slate-600 bg-slate-800'
                        : 'border-slate-200 hover:border-slate-300 bg-white')
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      selected.has(i)
                        ? `bg-${themeColor}-500 border-${themeColor}-500 text-white`
                        : (isDark ? 'border-slate-600' : 'border-slate-300')
                    }`}
                  >
                    {selected.has(i) && <Check size={12} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {s.goal}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      → {s.action}
                    </p>
                    <span
                      className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${
                        isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {s.period.replace('-years', 'yr').replace('-year', 'yr')}
                    </span>
                  </div>
                </div>
              </button>
            ))
          ) : (
            // Simple string suggestions for blessings/rewards
            (suggestions as string[]).map((s, i) => (
              <button
                key={i}
                onClick={() => toggleItem(i)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selected.has(i)
                    ? (type === 'blessing'
                        ? (isDark ? 'border-amber-500 bg-amber-900/30' : 'border-amber-300 bg-amber-50')
                        : (isDark ? 'border-emerald-500 bg-emerald-900/30' : 'border-emerald-300 bg-emerald-50'))
                    : (isDark
                        ? 'border-slate-700 hover:border-slate-600 bg-slate-800'
                        : 'border-slate-200 hover:border-slate-300 bg-white')
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                      selected.has(i)
                        ? (type === 'blessing'
                            ? 'bg-amber-500 border-amber-500 text-white'
                            : 'bg-emerald-500 border-emerald-500 text-white')
                        : (isDark ? 'border-slate-600' : 'border-slate-300')
                    }`}
                  >
                    {selected.has(i) && <Check size={12} />}
                  </div>
                  <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{s}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {selected.size} selected
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border ${
                isDark
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={selected.size === 0}
              className={`px-4 py-2 rounded-lg text-white disabled:opacity-50 flex items-center gap-2 bg-gradient-to-r ${themeHeaderClass}`}
            >
              <Plus size={16} />
              Add {selected.size}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
