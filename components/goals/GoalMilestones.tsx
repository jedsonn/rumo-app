'use client'

import { useState } from 'react'
import { GoalMilestone } from '@/lib/types'
import { Plus, Check, Trash2, GripVertical } from 'lucide-react'
import { useDashboard } from '@/components/providers/DashboardProvider'

interface GoalMilestonesProps {
  goalId: string
  milestones: GoalMilestone[]
  onAddMilestone: (title: string) => Promise<void>
  onUpdateMilestone: (id: string, updates: Partial<GoalMilestone>) => Promise<void>
  onDeleteMilestone: (id: string) => Promise<void>
}

export function GoalMilestones({
  goalId,
  milestones,
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone,
}: GoalMilestonesProps) {
  const { isBlue } = useDashboard()
  const [newMilestone, setNewMilestone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMilestone.trim()) return

    setLoading(true)
    await onAddMilestone(newMilestone.trim())
    setNewMilestone('')
    setLoading(false)
  }

  const handleToggle = async (milestone: GoalMilestone) => {
    await onUpdateMilestone(milestone.id, {
      completed: !milestone.completed,
      completed_at: milestone.completed ? null : new Date().toISOString(),
    })
  }

  const sortedMilestones = [...milestones].sort((a, b) => {
    // Uncompleted first, then by sort_order
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    return a.sort_order - b.sort_order
  })

  const completedCount = milestones.filter(m => m.completed).length
  const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0

  const themeColor = isBlue ? 'blue' : 'rose'

  return (
    <div className="space-y-3">
      {/* Progress */}
      {milestones.length > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 dark:text-slate-400">
              {completedCount}/{milestones.length} milestones
            </span>
            <span className={`font-medium text-${themeColor}-500`}>{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className={`h-full bg-${themeColor}-500 transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Milestones list */}
      <div className="space-y-1">
        {sortedMilestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`group flex items-center gap-2 p-2 rounded-lg border transition-all ${
              milestone.completed
                ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                : `border-${themeColor}-100 dark:border-${themeColor}-900/50 hover:bg-${themeColor}-50/50 dark:hover:bg-${themeColor}-900/20`
            }`}
          >
            <button
              onClick={() => handleToggle(milestone)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                milestone.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : `border-slate-300 dark:border-slate-600 hover:border-${themeColor}-500`
              }`}
            >
              {milestone.completed && <Check size={12} />}
            </button>

            <span
              className={`flex-1 text-sm ${
                milestone.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              {milestone.title}
            </span>

            <button
              onClick={() => onDeleteMilestone(milestone.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Add milestone form */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newMilestone}
          onChange={(e) => setNewMilestone(e.target.value)}
          placeholder="Add a milestone..."
          className={`flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 outline-none`}
        />
        <button
          type="submit"
          disabled={loading || !newMilestone.trim()}
          className={`px-3 py-2 rounded-lg text-white ${
            isBlue ? 'gradient-bg' : 'gradient-bg-pink'
          } hover:opacity-90 disabled:opacity-50 transition-all`}
        >
          <Plus size={18} />
        </button>
      </form>
    </div>
  )
}
