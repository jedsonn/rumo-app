'use client'

import { GoalPeriod, PERIODS, PERIOD_COLORS_LIGHT, PERIOD_COLORS_DARK } from '@/lib/types'

interface PeriodBadgeProps {
  period: GoalPeriod
  onChange: (period: GoalPeriod) => void
  isDark: boolean
}

// PeriodBadge - tap-to-cycle period with colors (matches template EXACTLY)
export function PeriodBadge({ period, onChange, isDark }: PeriodBadgeProps) {
  const cycle = () => {
    const idx = PERIODS.indexOf(period)
    onChange(PERIODS[(idx + 1) % PERIODS.length])
  }

  const colors = isDark ? PERIOD_COLORS_DARK : PERIOD_COLORS_LIGHT
  const label = period.replace('-years', 'yr').replace('-year', 'yr')

  return (
    <button
      onClick={cycle}
      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border cursor-pointer transition-all ${colors[period] || colors['One-year']}`}
      title="Click to cycle: 1yr → 3yr → 5yr"
    >
      {label}
    </button>
  )
}
