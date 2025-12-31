'use client'

import { GoalStatus, STATUSES, STATUS_COLORS_LIGHT, STATUS_COLORS_DARK } from '@/lib/types'
import { CountdownRing } from './CountdownRing'

interface StatusBadgeProps {
  status: GoalStatus
  onChange: (status: GoalStatus) => void
  isRecentlyChanged?: boolean
  isDark: boolean
}

// StatusBadge - tap-to-cycle status
export function StatusBadge({ status, onChange, isRecentlyChanged, isDark }: StatusBadgeProps) {
  const cycle = () => {
    const idx = STATUSES.indexOf(status)
    onChange(STATUSES[(idx + 1) % STATUSES.length])
  }

  const colors = isDark ? STATUS_COLORS_DARK : STATUS_COLORS_LIGHT

  return (
    <div className="relative">
      <button
        onClick={cycle}
        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all ${colors[status]}`}
        title="Click to cycle status"
      >
        {status}
      </button>
      {isRecentlyChanged && <CountdownRing />}
    </div>
  )
}
