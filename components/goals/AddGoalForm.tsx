'use client'

import { useState, useRef } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { GoalCategory } from '@/lib/types'
import { Plus } from 'lucide-react'

interface AddGoalFormProps {
  category: GoalCategory
}

export function AddGoalForm({ category }: AddGoalFormProps) {
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
      number: 1, // Will be auto-incremented by the backend
    })

    setValue('')
    inputRef.current?.focus()
  }

  const focusColor = isBlue
    ? 'focus:ring-blue-500 focus:border-blue-500'
    : 'focus:ring-pink-500 focus:border-pink-500'

  const gradientClass = isBlue ? 'gradient-bg' : 'gradient-bg-pink'

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Add ${category.toLowerCase()} goal...`}
        className={`flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm ${focusColor} focus:ring-2 outline-none`}
      />
      <button
        type="submit"
        className={`p-2 rounded-lg text-white ${gradientClass} hover:opacity-90`}
      >
        <Plus size={20} />
      </button>
    </form>
  )
}
