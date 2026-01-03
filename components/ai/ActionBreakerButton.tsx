'use client'

import { useState } from 'react'
import { Zap, Loader2, Check, X, Clock } from 'lucide-react'
import { Subtask } from '@/lib/types'

interface ActionBreakerButtonProps {
  goalId: string
  existingSubtasks?: Subtask[]
  onSubtasksGenerated: (subtasks: Subtask[]) => void
  isDark: boolean
  size?: 'sm' | 'md'
}

export function ActionBreakerButton({
  goalId,
  existingSubtasks = [],
  onSubtasksGenerated,
  isDark,
  size = 'sm',
}: ActionBreakerButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleBreakAction = async () => {
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/break-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate subtasks')
      }

      onSubtasksGenerated(data.subtasks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setTimeout(() => setError(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const iconSize = size === 'sm' ? 12 : 16

  if (existingSubtasks.length > 0) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${
          isDark ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-700'
        }`}
        title={`${existingSubtasks.length} subtasks`}
      >
        <Check size={10} />
        {existingSubtasks.filter(s => s.completed).length}/{existingSubtasks.length}
      </span>
    )
  }

  return (
    <button
      onClick={handleBreakAction}
      disabled={loading}
      title={error || 'AI: Break into subtasks'}
      className={`p-0.5 transition-colors ${
        error
          ? 'text-red-500'
          : loading
            ? (isDark ? 'text-amber-400' : 'text-amber-500')
            : (isDark ? 'text-slate-600 hover:text-amber-400' : 'text-slate-300 hover:text-amber-500')
      }`}
    >
      {loading ? (
        <Loader2 size={iconSize} className="animate-spin" />
      ) : error ? (
        <X size={iconSize} />
      ) : (
        <Zap size={iconSize} />
      )}
    </button>
  )
}

// Subtasks display component
interface SubtasksListProps {
  subtasks: Subtask[]
  onToggle: (index: number) => void
  onRemove: (index: number) => void
  isDark: boolean
}

export function SubtasksList({ subtasks, onToggle, onRemove, isDark }: SubtasksListProps) {
  if (subtasks.length === 0) return null

  return (
    <div className={`mt-2 pl-4 border-l-2 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
      {subtasks.map((subtask, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 py-1 group ${
            subtask.completed ? 'opacity-50' : ''
          }`}
        >
          <button
            onClick={() => onToggle(index)}
            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
              subtask.completed
                ? 'bg-green-500 border-green-500 text-white'
                : (isDark ? 'border-slate-600' : 'border-slate-300')
            }`}
          >
            {subtask.completed && <Check size={10} />}
          </button>
          <span
            className={`flex-1 text-xs ${
              subtask.completed ? 'line-through' : ''
            } ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {subtask.text}
          </span>
          {subtask.estimated_time && (
            <span
              className={`text-[10px] flex items-center gap-0.5 ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              <Clock size={10} />
              {subtask.estimated_time}
            </span>
          )}
          <button
            onClick={() => onRemove(index)}
            className={`opacity-0 group-hover:opacity-100 p-0.5 ${
              isDark ? 'text-slate-600 hover:text-red-400' : 'text-slate-300 hover:text-red-500'
            }`}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}
