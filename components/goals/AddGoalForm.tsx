'use client'

import { useState, useRef } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { GoalCategory } from '@/lib/types'
import { Plus, Sparkles } from 'lucide-react'

interface AddGoalFormProps {
  category: GoalCategory
  onOpenTemplates?: () => void
  onGoalAdded?: () => void
}

export function AddGoalForm({ category, onOpenTemplates, onGoalAdded }: AddGoalFormProps) {
  const { addGoal, isBlue } = useDashboard()
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return

    await addGoal({
      goal: value.trim(),
      category,
      period: 'One-year',
      status: 'Doing',
      number: 1,
      action: null,
      cost: 0,
      notes: null,
      pinned: false,
      linked_reward_id: null,
      progress: 0,
      due_date: null,
    })

    setValue('')
    inputRef.current?.focus()
    onGoalAdded?.()
  }

  const focusColor = isBlue
    ? 'focus:ring-blue-500 focus:border-blue-500'
    : 'focus:ring-pink-500 focus:border-pink-500'

  const gradientClass = isBlue ? 'gradient-bg' : 'gradient-bg-pink'
  const bgColor = isBlue
    ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'
    : 'bg-rose-50/50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800'

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Add ${category.toLowerCase()} goal...`}
        className={`flex-1 px-3 py-2 rounded-xl border text-sm ${bgColor} text-slate-800 dark:text-slate-100 ${focusColor} focus:ring-2 outline-none`}
      />
      <button
        type="submit"
        className={`p-2 rounded-xl text-white ${gradientClass} hover:opacity-90`}
        title="Add goal"
      >
        <Plus size={20} />
      </button>
      {onOpenTemplates && (
        <button
          type="button"
          onClick={onOpenTemplates}
          className="p-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90"
          title="Goal suggestions"
        >
          <Sparkles size={20} />
        </button>
      )}
    </form>
  )
}
