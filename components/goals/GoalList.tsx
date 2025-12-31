'use client'

import { useState, useMemo } from 'react'
import { Goal, GoalCategory, Reward } from '@/lib/types'
import { GoalCard } from './GoalCard'
import { User, Briefcase, ArrowUpDown, Sparkles, Plus, Target } from 'lucide-react'

interface GoalListProps {
  category: GoalCategory
  goals: Goal[]
  rewards: Reward[]
  onAddGoal: (text: string) => void
  onUpdateGoal: (goal: Goal) => void
  onDeleteGoal: (id: string) => void
  onLinkReward: (goal: Goal) => void
  onEditGoal: (goal: Goal) => void
  onOpenSuggestions: () => void
  recentlyDone: Set<string>
  themeColor: 'blue' | 'rose'
  isDark: boolean
}

// GoalList - column with stats header, add form, goals (matches template EXACTLY)
export function GoalList({
  category,
  goals,
  rewards,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  onLinkReward,
  onEditGoal,
  onOpenSuggestions,
  recentlyDone,
  themeColor,
  isDark
}: GoalListProps) {
  const [sortBy, setSortBy] = useState<'number' | 'smart'>('number')
  const [newGoal, setNewGoal] = useState('')

  // Filter goals by category
  const categoryGoals = useMemo(() => goals.filter(g => g.category === category), [goals, category])

  // Sort goals
  const sortedGoals = useMemo(() => {
    const sorted = [...categoryGoals]
    if (sortBy === 'number') {
      sorted.sort((a, b) => a.number - b.number)
    } else {
      // Smart sort: pinned first, then by status priority, then by number
      const statusOrder = { 'Doing': 0, 'On Track': 1, 'For Later': 2, 'Done': 3, 'Dropped': 4 }
      sorted.sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        if (a.status !== b.status) return statusOrder[a.status] - statusOrder[b.status]
        return a.number - b.number
      })
    }
    return sorted
  }, [categoryGoals, sortBy])

  // Calculate stats
  const stats = useMemo(() => ({
    total: categoryGoals.length,
    pinned: categoryGoals.filter(g => g.pinned).length,
    active: categoryGoals.filter(g => ['Doing', 'On Track'].includes(g.status)).length,
    done: categoryGoals.filter(g => g.status === 'Done').length,
    oneYear: categoryGoals.filter(g => g.period === 'One-year').length,
    threeYear: categoryGoals.filter(g => g.period === 'Three-years').length,
    fiveYear: categoryGoals.filter(g => g.period === 'Five-years').length,
    progress: categoryGoals.length ? Math.round((categoryGoals.filter(g => g.status === 'Done').length / categoryGoals.length) * 100) : 0,
  }), [categoryGoals])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.trim()) return
    onAddGoal(newGoal.trim())
    setNewGoal('')
  }

  const Icon = category === 'Personal' ? User : Briefcase
  const gradientClass = themeColor === 'blue' ? 'gradient-text' : 'gradient-text-pink'

  return (
    <div
      className={`flex flex-col h-full rounded-2xl border overflow-hidden ${
        isDark
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
      }`}
    >
      {/* Stats Header */}
      <div
        className={`p-3 border-b flex-shrink-0 ${
          isDark
            ? `border-slate-700 ${themeColor === 'blue' ? 'bg-blue-900/20' : 'bg-rose-900/20'}`
            : `border-slate-200 ${themeColor === 'blue' ? 'bg-blue-50/50' : 'bg-rose-50/50'}`
        }`}
      >
        {/* Title row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
            <h2 className={`font-serif font-bold text-base ${gradientClass}`}>{category}</h2>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                themeColor === 'blue'
                  ? (isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600')
                  : (isDark ? 'bg-rose-900/50 text-rose-400' : 'bg-rose-100 text-rose-600')
              }`}
            >
              {stats.total}
            </span>
            {stats.pinned > 0 && <span className="text-xs">🔥 {stats.pinned}</span>}
          </div>
          <button
            onClick={() => setSortBy(prev => prev === 'number' ? 'smart' : 'number')}
            className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 ${
              isDark
                ? 'text-slate-400 hover:bg-slate-700'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <ArrowUpDown size={10} />
            {sortBy === 'number' ? 'By #' : 'Smart'}
          </button>
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-1 rounded-full overflow-hidden mb-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
          <div
            className={`h-full transition-all duration-500 ${themeColor === 'blue' ? 'bg-blue-500' : 'bg-rose-500'}`}
            style={{ width: `${stats.progress}%` }}
          />
        </div>

        {/* Mini Stats */}
        <div className="flex gap-2 text-[9px] uppercase font-bold flex-wrap">
          <span className={themeColor === 'blue' ? 'text-blue-500' : 'text-rose-500'}>
            Active: {stats.active}
          </span>
          <span className="text-emerald-500">Done: {stats.done}</span>
          <span className="text-sky-500">1yr: {stats.oneYear}</span>
          <span className="text-amber-500">3yr: {stats.threeYear}</span>
          <span className="text-violet-500">5yr: {stats.fiveYear}</span>
        </div>
      </div>

      {/* Add Goal Form */}
      <form
        onSubmit={handleSubmit}
        className={`p-2 border-b flex gap-2 flex-shrink-0 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
      >
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder={`Add ${category.toLowerCase()} goal...`}
          className={`flex-1 px-3 py-1.5 rounded-lg text-sm border ${
            isDark
              ? `bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-${themeColor}-500`
              : `bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-${themeColor}-400`
          } outline-none`}
        />
        <button
          type="submit"
          className={`p-2 rounded-lg text-white ${
            themeColor === 'blue'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700'
          }`}
          title="Add goal"
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          onClick={onOpenSuggestions}
          className="p-2 rounded-lg text-white bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
          title="Goal suggestions"
        >
          <Sparkles size={16} />
        </button>
      </form>

      {/* Goals List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sortedGoals.length === 0 ? (
          <div className={`text-center py-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <Target size={28} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No goals yet</p>
            <p className="text-xs mt-1">Add your first goal above</p>
          </div>
        ) : (
          sortedGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdate={onUpdateGoal}
              onDelete={onDeleteGoal}
              onLinkReward={onLinkReward}
              onEdit={onEditGoal}
              isRecentlyDone={recentlyDone.has(goal.id)}
              themeColor={themeColor}
              isDark={isDark}
              linkedReward={rewards.find(r => r.id === goal.linked_reward_id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
