'use client'

import { useState } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { Goal, Reward, STATUSES, PERIODS, STATUS_COLORS, PERIOD_COLORS, GoalStatus, GoalPeriod } from '@/lib/types'
import { Flame, Pencil, Trash2, ArrowRight, Check, Gift } from 'lucide-react'
import { EditGoalModal } from './EditGoalModal'

interface GoalCardProps {
  goal: Goal
}

export function GoalCard({ goal }: GoalCardProps) {
  const { updateGoal, deleteGoal, rewards, isBlue } = useDashboard()
  const [isEditing, setIsEditing] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const linkedReward = rewards.find(r => r.id === goal.linked_reward_id)

  const cycleStatus = () => {
    const currentIndex = STATUSES.indexOf(goal.status)
    const nextStatus = STATUSES[(currentIndex + 1) % STATUSES.length] as GoalStatus
    updateGoal(goal.id, { status: nextStatus })
  }

  const cyclePeriod = () => {
    const currentIndex = PERIODS.indexOf(goal.period)
    const nextPeriod = PERIODS[(currentIndex + 1) % PERIODS.length] as GoalPeriod
    updateGoal(goal.id, { period: nextPeriod })
  }

  const togglePin = () => {
    updateGoal(goal.id, { pinned: !goal.pinned })
  }

  const statusColors = STATUS_COLORS[goal.status]
  const periodColors = PERIOD_COLORS[goal.period]

  const cardBg = goal.pinned
    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'

  return (
    <>
      <div
        className={`goal-card relative rounded-lg border ${cardBg} shadow-sm hover:shadow-md p-3`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {goal.pinned && (
          <span className="absolute -top-1 -right-1 text-lg">🔥</span>
        )}

        {/* Row 1: Number, Goal, Status, Period */}
        <div className="flex items-start gap-2">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 shrink-0">
            #{goal.number}
          </span>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 line-clamp-2">
              {goal.goal}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Status Badge */}
            <button
              onClick={cycleStatus}
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text} border ${statusColors.border} hover:opacity-80 transition-opacity flex items-center gap-1`}
            >
              {goal.status === 'Done' && <Check size={12} />}
              {goal.status}
            </button>

            {/* Period Badge */}
            <button
              onClick={cyclePeriod}
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${periodColors.bg} ${periodColors.text} hover:opacity-80 transition-opacity`}
            >
              {periodColors.label}
            </button>
          </div>
        </div>

        {/* Row 2: Action */}
        {goal.action && (
          <div className="mt-2 flex items-center gap-1.5">
            <ArrowRight size={12} className="text-slate-400 shrink-0" />
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {goal.action}
            </p>
          </div>
        )}

        {/* Linked Reward */}
        {linkedReward && (
          <div className="mt-1 flex items-center gap-1.5">
            <Gift size={12} className="text-purple-500" />
            <p className="text-xs text-purple-600 dark:text-purple-400 truncate">
              {linkedReward.text}
            </p>
          </div>
        )}

        {/* Cost */}
        {goal.cost > 0 && (
          <div className="mt-1">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              ${Number(goal.cost).toLocaleString()}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`absolute bottom-1 right-1 flex items-center gap-0.5 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={togglePin}
            className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 ${goal.pinned ? 'text-amber-500' : 'text-slate-400'}`}
            title={goal.pinned ? 'Unpin' : 'Pin'}
          >
            <Flame size={14} />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => deleteGoal(goal.id)}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <EditGoalModal
          goal={goal}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  )
}
