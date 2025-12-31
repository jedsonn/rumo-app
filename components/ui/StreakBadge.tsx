'use client'

import { useMemo } from 'react'
import { Flame, Calendar, Trophy } from 'lucide-react'

interface StreakBadgeProps {
  lastCheckIn: string | null // ISO date string
  checkInDates: string[] // Array of ISO date strings for check-ins
  themeColor: 'blue' | 'rose'
  isDark: boolean
}

// Calculate streak based on weekly check-ins (for resolution tracking)
export function StreakBadge({ lastCheckIn, checkInDates, themeColor, isDark }: StreakBadgeProps) {
  const streakData = useMemo(() => {
    if (!checkInDates.length) {
      return { weekStreak: 0, monthStreak: 0, totalCheckIns: 0 }
    }

    // Sort dates descending
    const sortedDates = [...checkInDates]
      .map(d => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime())

    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000)
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    // Calculate week streak (consecutive weeks with at least 1 check-in)
    let weekStreak = 0
    let checkWeek = new Date(now)
    checkWeek.setHours(0, 0, 0, 0)

    // Get start of current week (Sunday)
    const dayOfWeek = checkWeek.getDay()
    checkWeek.setDate(checkWeek.getDate() - dayOfWeek)

    while (weekStreak < 52) { // Max 52 weeks (1 year)
      const weekStart = new Date(checkWeek)
      const weekEnd = new Date(checkWeek)
      weekEnd.setDate(weekEnd.getDate() + 7)

      const hasCheckIn = sortedDates.some(d => d >= weekStart && d < weekEnd)

      if (hasCheckIn) {
        weekStreak++
        checkWeek.setDate(checkWeek.getDate() - 7)
      } else if (weekStreak === 0 && new Date() < weekEnd) {
        // First week, not ended yet, still valid
        checkWeek.setDate(checkWeek.getDate() - 7)
      } else {
        break
      }
    }

    // Calculate month streak (consecutive months with check-ins)
    let monthStreak = 0
    let checkMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    while (monthStreak < 12) { // Max 12 months
      const monthStart = new Date(checkMonth)
      const monthEnd = new Date(checkMonth.getFullYear(), checkMonth.getMonth() + 1, 1)

      const hasCheckIn = sortedDates.some(d => d >= monthStart && d < monthEnd)

      if (hasCheckIn) {
        monthStreak++
        checkMonth.setMonth(checkMonth.getMonth() - 1)
      } else if (monthStreak === 0) {
        // Current month, might not have check-in yet
        checkMonth.setMonth(checkMonth.getMonth() - 1)
      } else {
        break
      }
    }

    return {
      weekStreak,
      monthStreak,
      totalCheckIns: checkInDates.length,
      recentCheckIn: sortedDates[0] ? sortedDates[0] >= oneWeekAgo : false,
    }
  }, [checkInDates])

  const getBadgeLevel = () => {
    if (streakData.weekStreak >= 12) return { emoji: '🏆', label: '3mo+', color: 'text-amber-500' }
    if (streakData.weekStreak >= 4) return { emoji: '🔥', label: `${streakData.weekStreak}wk`, color: 'text-orange-500' }
    if (streakData.weekStreak >= 1) return { emoji: '✨', label: `${streakData.weekStreak}wk`, color: 'text-blue-500' }
    return { emoji: '💪', label: 'Start!', color: 'text-slate-400' }
  }

  const badge = getBadgeLevel()

  if (streakData.weekStreak === 0) {
    return (
      <button
        className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold transition-all ${
          isDark
            ? 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
        }`}
        title="Check in weekly to build your streak!"
      >
        <Flame size={12} />
        <span>No streak</span>
      </button>
    )
  }

  return (
    <button
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
        streakData.weekStreak >= 12
          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
          : streakData.weekStreak >= 4
            ? (isDark ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-600')
            : (isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-600')
      }`}
      title={`${streakData.weekStreak} week streak! Keep it going!`}
    >
      <span>{badge.emoji}</span>
      <span>{badge.label} streak</span>
      {streakData.weekStreak >= 4 && (
        <Flame size={12} className={streakData.weekStreak >= 12 ? 'animate-pulse' : ''} />
      )}
    </button>
  )
}
