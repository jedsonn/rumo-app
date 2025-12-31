'use client'

import { useMemo } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { Goal, GoalCategory } from '@/lib/types'
import { GoalCard } from './GoalCard'
import { AddGoalForm } from './AddGoalForm'
import { User, Briefcase, Target, ArrowUpDown } from 'lucide-react'

interface GoalsColumnProps {
  category: GoalCategory
  filteredGoals: Goal[]
  onOpenTemplates?: () => void
  sortBy?: 'number' | 'smart'
  onToggleSort?: () => void
}

export function GoalsColumn({ category, filteredGoals, onOpenTemplates, sortBy = 'number', onToggleSort }: GoalsColumnProps) {
  const { isBlue } = useDashboard()

  const categoryGoals = useMemo(() => {
    return filteredGoals.filter(g => g.category === category)
  }, [filteredGoals, category])

  // Calculate stats
  const stats = useMemo(() => ({
    total: categoryGoals.length,
    done: categoryGoals.filter(g => g.status === 'Done').length,
    active: categoryGoals.filter(g => ['Doing', 'On Track'].includes(g.status)).length,
    progress: categoryGoals.length ? Math.round((categoryGoals.filter(g => g.status === 'Done').length / categoryGoals.length) * 100) : 0,
    oneYear: categoryGoals.filter(g => g.period === 'One-year').length,
    threeYear: categoryGoals.filter(g => g.period === 'Three-years').length,
    fiveYear: categoryGoals.filter(g => g.period === 'Five-years').length,
    pinned: categoryGoals.filter(g => g.pinned).length,
  }), [categoryGoals])

  const themeColor = isBlue ? 'blue' : 'rose'
  const gradientClass = isBlue ? 'gradient-text' : 'gradient-text-pink'
  const Icon = category === 'Personal' ? User : Briefcase

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Column Header with Stats */}
      <div className={`p-4 border-b border-slate-200 dark:border-slate-700 flex-none ${
        isBlue ? 'bg-blue-50/30 dark:bg-blue-900/10' : 'bg-rose-50/30 dark:bg-rose-900/10'
      }`}>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Icon size={18} className="text-slate-500 dark:text-slate-400" />
            <h2 className={`font-serif font-bold text-lg ${gradientClass}`}>
              {category}
            </h2>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
              isBlue
                ? 'bg-white dark:bg-slate-700 text-blue-500 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                : 'bg-white dark:bg-slate-700 text-rose-500 dark:text-rose-400 border-rose-200 dark:border-rose-800'
            }`}>
              {stats.total}
            </span>
            {stats.pinned > 0 && (
              <span className="text-xs">🔥 {stats.pinned}</span>
            )}
          </div>
          {onToggleSort && (
            <button
              onClick={onToggleSort}
              className="text-xs font-bold px-2 py-1 rounded flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
            >
              <ArrowUpDown size={12} />
              {sortBy === 'number' ? 'By #' : 'Smart'}
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full overflow-hidden mb-2 bg-slate-200 dark:bg-slate-700">
          <div
            className={`h-full transition-all duration-500 ${isBlue ? 'bg-blue-500' : 'bg-rose-500'}`}
            style={{ width: `${stats.progress}%` }}
          />
        </div>

        {/* Stats Row */}
        <div className="flex gap-3 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 flex-wrap">
          <span className={isBlue ? 'text-blue-500 dark:text-blue-400' : 'text-rose-500 dark:text-rose-400'}>
            Active: {stats.active}
          </span>
          <span className="text-emerald-500">Done: {stats.done}</span>
          <span className="text-sky-500">1yr: {stats.oneYear}</span>
          <span className="text-amber-500">3yr: {stats.threeYear}</span>
          <span className="text-violet-500">5yr: {stats.fiveYear}</span>
        </div>
      </div>

      {/* Add Goal Form */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex-none">
        <AddGoalForm category={category} onOpenTemplates={onOpenTemplates} />
      </div>

      {/* Goals List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {categoryGoals.length === 0 ? (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500">
            <Target size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No goals yet</p>
            <p className="text-xs mt-1">Add your first goal above</p>
          </div>
        ) : (
          categoryGoals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))
        )}
      </div>
    </div>
  )
}
