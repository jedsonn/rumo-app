'use client'

import { useState, useMemo } from 'react'
import { Plus, Flame, Check, Calendar, MoreVertical, Trash2, Edit2 } from 'lucide-react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { Habit, HabitCompletion, HABIT_COLORS } from '@/lib/types'
import { Modal } from '@/components/ui/Modal'

interface HabitsPanelProps {
  habits: Habit[]
  completions: HabitCompletion[]
  onAddHabit: (habit: Partial<Habit>) => Promise<void>
  onUpdateHabit: (id: string, updates: Partial<Habit>) => Promise<void>
  onDeleteHabit: (id: string) => Promise<void>
  onToggleCompletion: (habitId: string, date: string) => Promise<void>
}

export function HabitsPanel({
  habits,
  completions,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
  onToggleCompletion,
}: HabitsPanelProps) {
  const { isBlue, goals } = useDashboard()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)

  const today = new Date().toISOString().split('T')[0]

  // Get last 7 days
  const last7Days = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en', { weekday: 'short' }),
        dayNum: date.getDate(),
        isToday: i === 0,
      })
    }
    return days
  }, [])

  // Calculate streaks
  const getStreak = (habitId: string): number => {
    const habitCompletions = completions
      .filter(c => c.habit_id === habitId)
      .map(c => c.completed_date)
      .sort()
      .reverse()

    let streak = 0
    let checkDate = new Date()

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0]
      if (habitCompletions.includes(dateStr)) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  const isCompleted = (habitId: string, date: string): boolean => {
    return completions.some(c => c.habit_id === habitId && c.completed_date === date)
  }

  const gradientClass = isBlue ? 'gradient-bg' : 'gradient-bg-pink'
  const activeHabits = habits.filter(h => h.active)

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Calendar size={20} className={isBlue ? 'text-blue-500' : 'text-rose-500'} />
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">Daily Habits</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {activeHabits.length} active
          </span>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-sm ${gradientClass} hover:opacity-90`}
        >
          <Plus size={16} />
          Add Habit
        </button>
      </div>

      {/* Days header */}
      <div className="grid grid-cols-8 gap-1 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Habit</div>
        {last7Days.map(day => (
          <div
            key={day.date}
            className={`text-center text-xs ${
              day.isToday
                ? isBlue ? 'text-blue-500 font-bold' : 'text-rose-500 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div>{day.dayName}</div>
            <div className={day.isToday ? 'text-sm' : ''}>{day.dayNum}</div>
          </div>
        ))}
      </div>

      {/* Habits list */}
      <div className="flex-1 overflow-y-auto">
        {activeHabits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 py-12">
            <Calendar size={40} className="mb-3 opacity-50" />
            <p className="text-sm">No habits yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              Create your first habit
            </button>
          </div>
        ) : (
          activeHabits.map(habit => {
            const streak = getStreak(habit.id)
            return (
              <div
                key={habit.id}
                className="grid grid-cols-8 gap-1 px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30"
              >
                {/* Habit info */}
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: habit.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                      {habit.title}
                    </div>
                    {streak > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-orange-500">
                        <Flame size={10} />
                        {streak} day{streak > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setEditingHabit(habit)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>

                {/* Completion checkboxes */}
                {last7Days.map(day => {
                  const completed = isCompleted(habit.id, day.date)
                  return (
                    <button
                      key={day.date}
                      onClick={() => onToggleCompletion(habit.id, day.date)}
                      className={`flex items-center justify-center h-8 rounded-lg transition-all ${
                        completed
                          ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'
                          : day.isToday
                          ? 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                          : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {completed && <Check size={16} />}
                    </button>
                  )
                })}
              </div>
            )
          })
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddHabitModal
          goals={goals}
          onAdd={async (data) => {
            await onAddHabit(data)
            setShowAddModal(false)
          }}
          onClose={() => setShowAddModal(false)}
          isBlue={isBlue}
        />
      )}

      {/* Edit Modal */}
      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          goals={goals}
          onUpdate={onUpdateHabit}
          onDelete={onDeleteHabit}
          onClose={() => setEditingHabit(null)}
          isBlue={isBlue}
        />
      )}
    </div>
  )
}

interface AddHabitModalProps {
  goals: { id: string; goal: string }[]
  onAdd: (data: Partial<Habit>) => Promise<void>
  onClose: () => void
  isBlue: boolean
}

function AddHabitModal({ goals, onAdd, onClose, isBlue }: AddHabitModalProps) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Personal' as 'Personal' | 'Professional',
    recurrence: 'daily' as 'daily' | 'weekly' | 'monthly',
    target_days_per_week: 7,
    color: HABIT_COLORS[0],
    linked_goal_id: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return

    setLoading(true)
    await onAdd({
      title: form.title.trim(),
      description: form.description || null,
      category: form.category,
      recurrence: form.recurrence,
      target_days_per_week: form.target_days_per_week,
      color: form.color,
      linked_goal_id: form.linked_goal_id || null,
      active: true,
    })
    setLoading(false)
  }

  const gradientClass = isBlue ? 'gradient-bg' : 'gradient-bg-pink'

  return (
    <Modal isOpen={true} onClose={onClose} title="Create New Habit">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Habit Name *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-field"
            placeholder="e.g., Morning meditation"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field"
            placeholder="Optional details"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Color
          </label>
          <div className="flex gap-2">
            {HABIT_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setForm({ ...form, color })}
                className={`w-8 h-8 rounded-full border-2 ${
                  form.color === color ? 'border-slate-800 dark:border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as 'Personal' | 'Professional' })}
              className="input-field"
            >
              <option value="Personal">Personal</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Link to Goal
            </label>
            <select
              value={form.linked_goal_id}
              onChange={(e) => setForm({ ...form, linked_goal_id: e.target.value })}
              className="input-field"
            >
              <option value="">None</option>
              {goals.map(g => (
                <option key={g.id} value={g.id}>{g.goal}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !form.title.trim()}
            className={`px-4 py-2 rounded-lg text-white ${gradientClass} hover:opacity-90 disabled:opacity-50`}
          >
            {loading ? 'Creating...' : 'Create Habit'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

interface EditHabitModalProps {
  habit: Habit
  goals: { id: string; goal: string }[]
  onUpdate: (id: string, updates: Partial<Habit>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onClose: () => void
  isBlue: boolean
}

function EditHabitModal({ habit, goals, onUpdate, onDelete, onClose, isBlue }: EditHabitModalProps) {
  const [form, setForm] = useState({
    title: habit.title,
    description: habit.description || '',
    color: habit.color,
    active: habit.active,
    linked_goal_id: habit.linked_goal_id || '',
  })
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onUpdate(habit.id, {
      title: form.title,
      description: form.description || null,
      color: form.color,
      active: form.active,
      linked_goal_id: form.linked_goal_id || null,
    })
    setLoading(false)
    onClose()
  }

  const handleDelete = async () => {
    setLoading(true)
    await onDelete(habit.id)
    setLoading(false)
    onClose()
  }

  const gradientClass = isBlue ? 'gradient-bg' : 'gradient-bg-pink'

  if (showDeleteConfirm) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Delete Habit?">
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Are you sure you want to delete "{habit.title}"? This will also delete all completion history.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Habit">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Habit Name
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Color
          </label>
          <div className="flex gap-2">
            {HABIT_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setForm({ ...form, color })}
                className={`w-8 h-8 rounded-full border-2 ${
                  form.color === color ? 'border-slate-800 dark:border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Active</span>
          </label>
        </div>

        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
          >
            <Trash2 size={16} />
            Delete
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white ${gradientClass} hover:opacity-90 disabled:opacity-50`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
