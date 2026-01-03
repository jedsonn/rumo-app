'use client'

import { useState } from 'react'
import { Goal, Reward, Subtask } from '@/lib/types'
import { EditableNumber } from '@/components/ui/EditableNumber'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PeriodBadge } from '@/components/ui/PeriodBadge'
import { ActionBreakerButton, SubtasksList } from '@/components/ai/ActionBreakerButton'
import { GoalRefinementBadge } from '@/components/ai/GoalRefinementBadge'
import { Flame, Gift, Pencil, Trash2, Share2 } from 'lucide-react'

interface GoalCardProps {
  goal: Goal
  onUpdate: (goal: Goal) => void
  onDelete: (id: string) => void
  onLinkReward: (goal: Goal) => void
  onEdit: (goal: Goal) => void
  onShare?: (goal: Goal) => void
  isRecentlyChanged: boolean
  themeColor: 'blue' | 'rose'
  isDark: boolean
  linkedReward?: Reward
}

// GoalCard - compact two-line layout (matches template EXACTLY)
export function GoalCard({
  goal,
  onUpdate,
  onDelete,
  onLinkReward,
  onEdit,
  onShare,
  isRecentlyChanged,
  themeColor,
  isDark,
  linkedReward
}: GoalCardProps) {
  const [showSubtasks, setShowSubtasks] = useState(false)

  const togglePin = () => onUpdate({ ...goal, pinned: !goal.pinned })

  const handleSubtasksGenerated = (subtasks: Subtask[]) => {
    onUpdate({ ...goal, subtasks })
    setShowSubtasks(true)
  }

  const handleToggleSubtask = (index: number) => {
    const newSubtasks = [...(goal.subtasks || [])]
    newSubtasks[index] = { ...newSubtasks[index], completed: !newSubtasks[index].completed }
    onUpdate({ ...goal, subtasks: newSubtasks })
  }

  const handleRemoveSubtask = (index: number) => {
    const newSubtasks = (goal.subtasks || []).filter((_, i) => i !== index)
    onUpdate({ ...goal, subtasks: newSubtasks })
  }

  const handleAcceptRefinement = (newGoalText: string) => {
    onUpdate({ ...goal, goal: newGoalText, is_vague: false, ai_refinement_suggestion: null })
  }

  const handleDismissRefinement = () => {
    onUpdate({ ...goal, is_vague: false })
  }

  return (
    <div
      className={`group relative px-3 py-2 rounded-lg border transition-all hover:shadow-sm ${
        goal.pinned
          ? (isDark ? 'bg-amber-900/30 border-amber-500/50' : 'bg-amber-50 border-amber-200')
          : goal.status === 'Done' && !isRecentlyChanged
            ? (isDark ? 'bg-slate-800/50 opacity-60' : 'bg-slate-50 opacity-60')
            : (isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200')
      }`}
    >
      {goal.pinned && <div className="absolute -top-1.5 -left-1.5 text-xs">🔥</div>}

      {/* Row 1: # | Title | $Cost | Status | Period */}
      <div className="flex items-center gap-2">
        <EditableNumber
          value={goal.number}
          onChange={(n) => onUpdate({ ...goal, number: n })}
          themeColor={themeColor}
          isDark={isDark}
        />
        <h3
          className={`flex-1 text-sm font-medium truncate ${
            goal.status === 'Done' ? 'line-through' : ''
          } ${
            isDark
              ? (goal.status === 'Done' ? 'text-slate-500' : 'text-slate-200')
              : (goal.status === 'Done' ? 'text-slate-400' : 'text-slate-700')
          }`}
        >
          {goal.goal}
        </h3>
        {goal.is_vague && goal.ai_refinement_suggestion && (
          <GoalRefinementBadge
            goalId={goal.id}
            goalText={goal.goal}
            isVague={goal.is_vague}
            suggestion={goal.ai_refinement_suggestion}
            onAcceptSuggestion={handleAcceptRefinement}
            onDismiss={handleDismissRefinement}
            isDark={isDark}
            themeColor={themeColor}
          />
        )}
        {goal.cost > 0 && (
          <span
            className={`text-[9px] font-bold ${
              isDark ? 'text-emerald-400 bg-emerald-900/50' : 'text-emerald-600 bg-emerald-50'
            } px-1 py-0.5 rounded`}
          >
            ${goal.cost.toLocaleString()}
          </span>
        )}
        <StatusBadge
          status={goal.status}
          onChange={(s) => onUpdate({ ...goal, status: s })}
          isRecentlyChanged={isRecentlyChanged}
          isDark={isDark}
        />
        <PeriodBadge
          period={goal.period}
          onChange={(p) => onUpdate({ ...goal, period: p })}
          isDark={isDark}
        />
      </div>

      {/* Row 2: Next step + Linked Reward | Actions */}
      <div className="flex items-center justify-between mt-1 min-h-[20px]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {goal.action && `→ ${goal.action}`}
          </div>
          {linkedReward && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 ${
                linkedReward.earned
                  ? (isDark ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-600')
                  : (isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500')
              }`}
            >
              🎁 {linkedReward.text.substring(0, 20)}{linkedReward.text.length > 20 ? '...' : ''}
              {linkedReward.earned && ' ✓'}
            </span>
          )}
        </div>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {goal.status === 'Done' && onShare && (
            <button
              onClick={() => onShare(goal)}
              className={`p-0.5 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}`}
              title="Share achievement"
            >
              <Share2 size={12} />
            </button>
          )}
          <ActionBreakerButton
            goalId={goal.id}
            existingSubtasks={goal.subtasks || []}
            onSubtasksGenerated={handleSubtasksGenerated}
            isDark={isDark}
          />
          <button
            onClick={togglePin}
            className={`p-0.5 ${
              goal.pinned
                ? 'text-amber-500'
                : (isDark ? 'text-slate-600 hover:text-amber-400' : 'text-slate-300 hover:text-amber-500')
            }`}
            title={goal.pinned ? 'Unpin' : 'Pin'}
          >
            <Flame size={12} />
          </button>
          <button
            onClick={() => onLinkReward(goal)}
            className={`p-0.5 ${
              goal.linked_reward_id
                ? 'text-emerald-500'
                : (isDark ? 'text-slate-600 hover:text-emerald-400' : 'text-slate-300 hover:text-emerald-500')
            }`}
            title="Link reward"
          >
            <Gift size={12} />
          </button>
          <button
            onClick={() => onEdit(goal)}
            className={`p-0.5 ${isDark ? 'text-slate-600 hover:text-blue-400' : 'text-slate-300 hover:text-blue-500'}`}
            title="Edit"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className={`p-0.5 ${isDark ? 'text-slate-600 hover:text-red-400' : 'text-slate-300 hover:text-red-500'}`}
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Subtasks */}
      {goal.subtasks && goal.subtasks.length > 0 && (
        <SubtasksList
          subtasks={goal.subtasks}
          onToggle={handleToggleSubtask}
          onRemove={handleRemoveSubtask}
          isDark={isDark}
        />
      )}
    </div>
  )
}
