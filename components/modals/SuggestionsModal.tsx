'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { SUGGESTIONS, BLESSING_SUGGESTIONS, REWARD_SUGGESTIONS, TEMPLATE_PACKS, GoalSuggestion, TemplatePack } from '@/lib/suggestions'
import { GoalCategory } from '@/lib/types'
import { Check, Plus, User, Briefcase, Sparkles, Package, ArrowLeft, ChevronRight } from 'lucide-react'

type SuggestionType = 'goal' | 'blessing' | 'reward'
type ViewMode = 'packs' | 'browse' | 'pack-detail'

interface SuggestionsModalProps {
  isOpen: boolean
  onClose: () => void
  type: SuggestionType
  category?: GoalCategory
  onAddGoal?: (suggestion: GoalSuggestion, category: GoalCategory) => void
  onAddBlessing?: (text: string, category: GoalCategory) => void
  onAddReward?: (text: string, cost: number) => void
  themeColor: 'blue' | 'rose'
  isDark: boolean
}

// SuggestionsModal - with template packs for goals
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
  const [viewMode, setViewMode] = useState<ViewMode>('packs')
  const [selectedPack, setSelectedPack] = useState<TemplatePack | null>(null)

  const getTitle = () => {
    if (type === 'goal') {
      if (viewMode === 'packs') return 'Goal Template Packs'
      if (viewMode === 'pack-detail' && selectedPack) return `${selectedPack.emoji} ${selectedPack.name}`
      return `Browse Goals - ${activeCategory}`
    }
    if (type === 'blessing') return 'Blessing Suggestions'
    return 'Reward Suggestions'
  }

  const getSuggestions = () => {
    switch (type) {
      case 'goal':
        if (viewMode === 'pack-detail' && selectedPack) return selectedPack.goals
        return SUGGESTIONS[activeCategory]
      case 'blessing': return BLESSING_SUGGESTIONS
      case 'reward': return REWARD_SUGGESTIONS
    }
  }

  const suggestions = getSuggestions()
  const categoryPacks = TEMPLATE_PACKS.filter(p => p.category === activeCategory)

  const toggleItem = (index: number) => {
    const next = new Set(selected)
    if (next.has(index)) next.delete(index)
    else next.add(index)
    setSelected(next)
  }

  const handleAddFromPack = () => {
    if (type === 'goal' && onAddGoal && selectedPack) {
      selected.forEach(index => {
        onAddGoal(selectedPack.goals[index], selectedPack.category)
      })
    }
    setSelected(new Set())
    setViewMode('packs')
    setSelectedPack(null)
    onClose()
  }

  const handleAdd = () => {
    if (viewMode === 'pack-detail') {
      handleAddFromPack()
      return
    }

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

  const openPack = (pack: TemplatePack) => {
    setSelectedPack(pack)
    setViewMode('pack-detail')
    setSelected(new Set())
  }

  const goBack = () => {
    if (viewMode === 'pack-detail') {
      setViewMode('packs')
      setSelectedPack(null)
      setSelected(new Set())
    } else if (viewMode === 'browse') {
      setViewMode('packs')
      setSelected(new Set())
    }
  }

  const themeHeaderClass = type === 'goal'
    ? (themeColor === 'blue' ? 'from-blue-500 to-indigo-500' : 'from-rose-500 to-pink-500')
    : type === 'blessing'
      ? 'from-amber-500 to-orange-500'
      : 'from-emerald-500 to-teal-500'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="lg">
      <div className="space-y-4">
        {/* Back Button (for nested views) */}
        {(viewMode === 'pack-detail' || viewMode === 'browse') && type === 'goal' && (
          <button
            onClick={goBack}
            className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-700'}`}
          >
            <ArrowLeft size={16} />
            Back to packs
          </button>
        )}

        {/* Category Toggle for goals and blessings */}
        {(type === 'goal' || type === 'blessing') && viewMode !== 'pack-detail' && (
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

        {/* PACKS VIEW - Show template packs for goals */}
        {type === 'goal' && viewMode === 'packs' && (
          <div className="space-y-4">
            {/* Template Packs Grid */}
            <div>
              <h3 className={`text-sm font-bold uppercase mb-3 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <Package size={14} />
                Template Packs
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {categoryPacks.map(pack => (
                  <button
                    key={pack.id}
                    onClick={() => openPack(pack)}
                    className={`text-left p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 hover:border-slate-500'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-3xl mb-2">{pack.emoji}</div>
                    <h4 className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {pack.name}
                    </h4>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {pack.description}
                    </p>
                    <div className={`flex items-center gap-1 mt-2 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span>{pack.goals.length} goals</span>
                      <ChevronRight size={12} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Browse All Link */}
            <button
              onClick={() => setViewMode('browse')}
              className={`w-full p-3 rounded-lg border border-dashed text-sm font-medium transition-all ${
                isDark
                  ? 'border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                  : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700'
              }`}
            >
              <Sparkles size={14} className="inline mr-2" />
              Or browse all {activeCategory.toLowerCase()} goal suggestions
            </button>
          </div>
        )}

        {/* BROWSE/DETAIL VIEW - Show individual suggestions */}
        {(viewMode === 'browse' || viewMode === 'pack-detail' || type !== 'goal') && (
          <>
            {/* Pack Info Banner */}
            {viewMode === 'pack-detail' && selectedPack && (
              <div className={`p-4 rounded-lg bg-gradient-to-r ${themeHeaderClass} text-white`}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedPack.emoji}</span>
                  <div>
                    <h3 className="font-bold">{selectedPack.name}</h3>
                    <p className="text-sm opacity-90">{selectedPack.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions List */}
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {type === 'goal' ? (
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
          </>
        )}

        {/* Footer - only show when items can be added */}
        {(viewMode !== 'packs' || type !== 'goal') && (
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
        )}
      </div>
    </Modal>
  )
}
