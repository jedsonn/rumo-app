'use client'

import { useState } from 'react'
import { GoalProgressNote } from '@/lib/types'
import { MessageSquare, Plus, Trash2 } from 'lucide-react'
import { useDashboard } from '@/components/providers/DashboardProvider'

interface GoalProgressNotesProps {
  goalId: string
  notes: GoalProgressNote[]
  currentProgress: number
  onAddNote: (content: string, progressPercent?: number) => Promise<void>
  onDeleteNote: (id: string) => Promise<void>
}

export function GoalProgressNotes({
  goalId,
  notes,
  currentProgress,
  onAddNote,
  onDeleteNote,
}: GoalProgressNotesProps) {
  const { isBlue } = useDashboard()
  const [newNote, setNewNote] = useState('')
  const [progressValue, setProgressValue] = useState(currentProgress)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setLoading(true)
    await onAddNote(newNote.trim(), progressValue)
    setNewNote('')
    setLoading(false)
  }

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="space-y-4">
      {/* Add note form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Progress Update
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={progressValue}
              onChange={(e) => setProgressValue(parseInt(e.target.value))}
              className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${
                isBlue ? 'accent-blue-500' : 'accent-rose-500'
              }`}
            />
            <span className={`text-sm font-medium w-12 text-right ${
              isBlue ? 'text-blue-500' : 'text-rose-500'
            }`}>
              {progressValue}%
            </span>
          </div>
        </div>

        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="What progress did you make? Any reflections?"
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          rows={2}
        />

        <button
          type="submit"
          disabled={loading || !newNote.trim()}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white ${
            isBlue ? 'gradient-bg' : 'gradient-bg-pink'
          } hover:opacity-90 disabled:opacity-50 transition-all`}
        >
          <MessageSquare size={16} />
          Add Progress Note
        </button>
      </form>

      {/* Notes list */}
      {sortedNotes.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className="group p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-slate-700 dark:text-slate-200 flex-1">
                  {note.content}
                </p>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 dark:text-slate-500">
                <span>{new Date(note.created_at).toLocaleDateString()}</span>
                {note.progress_percent !== null && (
                  <span className={isBlue ? 'text-blue-500' : 'text-rose-500'}>
                    {note.progress_percent}% complete
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {sortedNotes.length === 0 && (
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-4">
          No progress notes yet. Start journaling your journey!
        </p>
      )}
    </div>
  )
}
