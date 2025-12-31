'use client'

import { useState } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { Goal, STATUSES, PERIODS, GoalStatus, GoalPeriod } from '@/lib/types'
import { Modal } from '@/components/ui/Modal'

interface EditGoalModalProps {
  goal: Goal
  onClose: () => void
}

export function EditGoalModal({ goal, onClose }: EditGoalModalProps) {
  const { updateGoal, rewards, isBlue } = useDashboard()
  const [form, setForm] = useState({
    goal: goal.goal,
    status: goal.status,
    period: goal.period,
    action: goal.action || '',
    cost: goal.cost || 0,
    notes: goal.notes || '',
    linked_reward_id: goal.linked_reward_id || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateGoal(goal.id, {
      goal: form.goal,
      status: form.status as GoalStatus,
      period: form.period as GoalPeriod,
      action: form.action || null,
      cost: Number(form.cost) || 0,
      notes: form.notes || null,
      linked_reward_id: form.linked_reward_id || null,
    })
    onClose()
  }

  const gradientClass = isBlue ? 'gradient-bg' : 'gradient-bg-pink'

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Goal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Goal
          </label>
          <input
            type="text"
            value={form.goal}
            onChange={(e) => setForm({ ...form, goal: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as GoalStatus })}
              className="input-field"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Period
            </label>
            <select
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value as GoalPeriod })}
              className="input-field"
            >
              {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Next Action
          </label>
          <input
            type="text"
            value={form.action}
            onChange={(e) => setForm({ ...form, action: e.target.value })}
            className="input-field"
            placeholder="What's the next step?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Cost ($)
            </label>
            <input
              type="number"
              value={form.cost || ''}
              onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })}
              className="input-field"
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Link Reward
            </label>
            <select
              value={form.linked_reward_id}
              onChange={(e) => setForm({ ...form, linked_reward_id: e.target.value })}
              className="input-field"
            >
              <option value="">None</option>
              {rewards.map(r => (
                <option key={r.id} value={r.id}>🎁 {r.text}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Notes
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="input-field"
            rows={3}
            placeholder="Additional notes..."
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg text-white ${gradientClass} hover:opacity-90`}
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  )
}
