'use client'

import { useState } from 'react'
import { AlertCircle, Sparkles, X, Check, Loader2 } from 'lucide-react'

interface GoalRefinementBadgeProps {
  goalId: string
  goalText: string
  isVague: boolean
  suggestion: string | null
  onAcceptSuggestion: (newGoalText: string) => void
  onDismiss: () => void
  isDark: boolean
  themeColor: 'blue' | 'rose'
}

export function GoalRefinementBadge({
  goalId,
  goalText,
  isVague,
  suggestion,
  onAcceptSuggestion,
  onDismiss,
  isDark,
  themeColor,
}: GoalRefinementBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  if (!isVague || !suggestion) return null

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className={`p-0.5 rounded-full animate-pulse ${
          isDark ? 'text-amber-400 bg-amber-900/30' : 'text-amber-500 bg-amber-100'
        }`}
        title="This goal could be more specific"
      >
        <AlertCircle size={12} />
      </button>

      {showTooltip && (
        <div className={`absolute z-50 top-full left-0 mt-2 w-72 p-3 rounded-lg shadow-xl ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
        }`}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Sparkles size={14} className={themeColor === 'blue' ? 'text-blue-500' : 'text-rose-500'} />
              <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                AI Suggestion
              </span>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className={isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}
            >
              <X size={14} />
            </button>
          </div>

          <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            This goal could be more specific. Try:
          </p>

          <div className={`p-2 rounded text-xs mb-3 ${
            isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'
          }`}>
            "{suggestion}"
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onAcceptSuggestion(suggestion)
                setShowTooltip(false)
              }}
              className={`flex-1 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1 ${
                themeColor === 'blue'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-rose-500 hover:bg-rose-600 text-white'
              }`}
            >
              <Check size={12} /> Use This
            </button>
            <button
              onClick={() => {
                onDismiss()
                setShowTooltip(false)
              }}
              className={`flex-1 py-1.5 rounded text-xs font-medium ${
                isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              Keep Original
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Check button to manually trigger refinement check
interface RefineCheckButtonProps {
  goalId: string
  goalText: string
  category: string
  onResult: (isVague: boolean, suggestion: string | null) => void
  isDark: boolean
}

export function RefineCheckButton({
  goalId,
  goalText,
  category,
  onResult,
  isDark,
}: RefineCheckButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    if (loading) return
    setLoading(true)

    try {
      const response = await fetch('/api/ai/refine-goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId, goalText, category }),
      })

      const data = await response.json()

      if (response.ok) {
        onResult(data.is_vague, data.suggestion)
      }
    } catch (err) {
      console.error('Refine check error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheck}
      disabled={loading}
      title="Check if goal is SMART"
      className={`p-0.5 transition-colors ${
        loading
          ? (isDark ? 'text-blue-400' : 'text-blue-500')
          : (isDark ? 'text-slate-600 hover:text-blue-400' : 'text-slate-300 hover:text-blue-500')
      }`}
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <Sparkles size={12} />
      )}
    </button>
  )
}
