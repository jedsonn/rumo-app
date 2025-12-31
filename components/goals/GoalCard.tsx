'use client'

import { useState } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { Goal, STATUSES, PERIODS, STATUS_COLORS, PERIOD_COLORS, GoalStatus, GoalPeriod } from '@/lib/types'
import { Flame, Pencil, Trash2, ArrowRight, Check, Gift, ChevronUp, ChevronDown } from 'lucide-react'
import { EditGoalModal } from './EditGoalModal'

interface GoalCardProps {
  goal: Goal
}

export function GoalCard({ goal }: GoalCardProps) {
  const { updateGoal, deleteGoal, rewards, isBlue } = useDashboard()
  const [isEditing, setIsEditing] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [editingNumber, setEditingNumber] = useState(false)
  const [tempNumber, setTempNumber] = useState(goal.number)

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

  const updateNumber = (newNum: number) => {
    updateGoal(goal.id, { number: Math.max(1, newNum) })
  }

  const handleNumberSubmit = () => {
    updateNumber(tempNumber)
    setEditingNumber(false)
  }

  const statusColors = STATUS_COLORS[goal.status]
  const periodColors = PERIOD_COLORS[goal.period]

  const cardBg = goal.pinned
    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
    : goal.status === 'Done'
    ? 'bg-slate-50/60 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-70'
    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'

  const themeColor = isBlue ? 'blue' : 'rose'

  return (
    <>
      <div
        className={`goal-card group relative rounded-lg border ${cardBg} shadow-sm hover:shadow-md px-3 py-2`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {goal.pinned && (
          <span className="absolute -top-1.5 -left-1.5 text-sm">🔥</span>
        )}

        {/* Row 1: Number | Goal Title | Cost | Period | Status */}
        <div className="flex items-center gap-2">
          {/* Editable Number */}
          <div className="flex items-center gap-0.5 group/num shrink-0">
            <button
              onClick={() => updateNumber(goal.number - 1)}
              className="opacity-0 group-hover/num:opacity-100 p-0.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <ChevronDown size={10} />
            </button>
            {editingNumber ? (
              <input
                type="number"
                value={tempNumber}
                onChange={(e) => setTempNumber(parseInt(e.target.value) || 1)}
                onBlur={handleNumberSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNumberSubmit()
                  if (e.key === 'Escape') setEditingNumber(false)
                }}
                className={`w-10 text-center text-[10px] font-mono border-2 rounded px-1 py-0.5 focus:outline-none bg-white dark:bg-slate-700 border-${themeColor}-400 dark:border-${themeColor}-500 text-slate-700 dark:text-white`}
                autoFocus
              />
            ) : (
              <span
                onClick={() => {
                  setTempNumber(goal.number)
                  setEditingNumber(true)
                }}
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded cursor-pointer min-w-[24px] text-center ${
                  isBlue
                    ? 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900'
                    : 'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900'
                }`}
                title="Click to edit, arrows to adjust"
              >
                #{goal.number}
              </span>
            )}
            <button
              onClick={() => updateNumber(goal.number + 1)}
              className="opacity-0 group-hover/num:opacity-100 p-0.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <ChevronUp size={10} />
            </button>
          </div>

          {/* Goal Title */}
          <h3 className={`flex-1 text-sm font-medium truncate ${
            goal.status === 'Done'
              ? 'line-through text-slate-400 dark:text-slate-500'
              : 'text-slate-700 dark:text-slate-200'
          }`}>
            {goal.goal}
          </h3>

          {/* Cost Badge */}
          {goal.cost > 0 && (
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/50 px-1 py-0.5 rounded shrink-0">
              ${Number(goal.cost).toLocaleString()}
            </span>
          )}

          {/* Period Badge - cycles on click */}
          <button
            onClick={cyclePeriod}
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-all shrink-0 ${periodColors.bg} ${periodColors.text} hover:opacity-80`}
            title="Click to cycle: 1yr → 3yr → 5yr"
          >
            {periodColors.label}
          </button>

          {/* Status Badge - cycles on click */}
          <button
            onClick={cycleStatus}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all shrink-0 ${statusColors.bg} ${statusColors.text} border ${statusColors.border} hover:opacity-80 flex items-center gap-1`}
            title="Click to cycle status"
          >
            {goal.status === 'Done' && <Check size={10} />}
            {goal.status}
          </button>
        </div>

        {/* Row 2: Next step + Linked Reward | Actions */}
        <div className="flex items-center justify-between mt-1 min-h-[20px]">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Next Step */}
            {goal.action && (
              <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 truncate">
                <ArrowRight size={10} className="shrink-0" />
                <span className="truncate">{goal.action}</span>
              </div>
            )}

            {/* Linked Reward */}
            {linkedReward && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0 ${
                linkedReward.earned
                  ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                <Gift size={10} />
                {linkedReward.text.substring(0, 15)}{linkedReward.text.length > 15 ? '...' : ''}
                {linkedReward.earned && ' ✓'}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`flex gap-0.5 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={togglePin}
              className={`p-0.5 rounded ${goal.pinned ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600 hover:text-amber-500 dark:hover:text-amber-400'}`}
              title={goal.pinned ? 'Unpin' : 'Pin'}
            >
              <Flame size={12} />
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="p-0.5 rounded text-slate-300 dark:text-slate-600 hover:text-blue-500 dark:hover:text-blue-400"
              title="Edit"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={() => deleteGoal(goal.id)}
              className="p-0.5 rounded text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
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
