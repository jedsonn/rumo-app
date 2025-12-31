'use client'

import { useMemo } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { Goal, GoalCategory } from '@/lib/types'
import { GoalCard } from './GoalCard'
import { AddGoalForm } from './AddGoalForm'
import { User, Briefcase, Target, BookOpen } from 'lucide-react'

interface GoalsColumnProps {
  category: GoalCategory
  filteredGoals: Goal[]
  onOpenTemplates?: () => void
}

export function GoalsColumn({ category, filteredGoals, onOpenTemplates }: GoalsColumnProps) {
  const { isBlue } = useDashboard()

  const categoryGoals = useMemo(() => {
    return filteredGoals.filter(g => g.category === category)
  }, [filteredGoals, category])

  const pinnedCount = categoryGoals.filter(g => g.pinned).length

  const gradientClass = isBlue ? 'gradient-text' : 'gradient-text-pink'
  const Icon = category === 'Personal' ? User : Briefcase

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Icon size={20} className="text-slate-500" />
          <h2 className={`font-serif font-semibold text-lg ${gradientClass}`}>
            {category}
          </h2>
          <span className="text-xs text-slate-400">
            {categoryGoals.length} goals
          </span>
          {pinnedCount > 0 && (
            <span className="text-xs">🔥 {pinnedCount}</span>
          )}
        </div>
        {onOpenTemplates && (
          <button
            onClick={onOpenTemplates}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">Templates</span>
          </button>
        )}
      </div>

      {/* Add Goal Form */}
      <AddGoalForm category={category} />

      {/* Goals List */}
      <div className="flex-1 overflow-y-auto mt-3 space-y-2 pr-1">
        {categoryGoals.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500">
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
