'use client'

import { useState, useEffect } from 'react'
import { StreakData, getStreakEmoji, getStreakMessage, getConsistencyScore } from '@/lib/streaks'
import { Flame, TrendingUp, Calendar, Award } from 'lucide-react'

interface StreaksDisplayProps {
  streakData: StreakData
  isBlue: boolean
  compact?: boolean
}

export function StreaksDisplay({ streakData, isBlue, compact = false }: StreaksDisplayProps) {
  const consistencyScore = getConsistencyScore(streakData)
  const emoji = getStreakEmoji(streakData.currentStreak)
  const message = getStreakMessage(streakData.currentStreak)
  const gradientClass = isBlue ? 'gradient-bg' : 'gradient-bg-pink'
  const gradientText = isBlue ? 'gradient-text' : 'gradient-text-pink'

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <span className="text-lg">{emoji}</span>
        <span className="font-semibold text-amber-700 dark:text-amber-400">
          {streakData.currentStreak}
        </span>
        <span className="text-xs text-amber-600 dark:text-amber-500">day streak</span>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-4">
      {/* Streak Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-300">
              {streakData.currentStreak} Day Streak
            </h3>
            <p className="text-xs text-amber-600 dark:text-amber-500">{message}</p>
          </div>
        </div>
        <Flame size={24} className="text-amber-500" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp size={14} className="text-amber-600" />
          </div>
          <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
            {consistencyScore}%
          </p>
          <p className="text-[10px] text-amber-600 dark:text-amber-500">30-day score</p>
        </div>

        <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Award size={14} className="text-amber-600" />
          </div>
          <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
            {streakData.longestStreak}
          </p>
          <p className="text-[10px] text-amber-600 dark:text-amber-500">best streak</p>
        </div>

        <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Calendar size={14} className="text-amber-600" />
          </div>
          <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
            {streakData.totalCheckIns}
          </p>
          <p className="text-[10px] text-amber-600 dark:text-amber-500">total days</p>
        </div>
      </div>

      {/* Mini Calendar (last 7 days) */}
      <div className="mt-4">
        <p className="text-xs text-amber-600 dark:text-amber-500 mb-2">Last 7 days</p>
        <div className="flex justify-between">
          {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))
            const dateStr = date.toISOString().split('T')[0]
            const hasCheckIn = streakData.checkInHistory.includes(dateStr)
            const isToday = i === 6
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)

            return (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[10px] text-amber-600 dark:text-amber-500 mb-1">
                  {dayName}
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    hasCheckIn
                      ? 'bg-green-500 text-white'
                      : isToday
                      ? 'border-2 border-amber-400 text-amber-600'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}
                >
                  {hasCheckIn ? '✓' : date.getDate()}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Compact inline version for header
export function StreaksBadge({ streakData, onClick }: { streakData: StreakData; onClick?: () => void }) {
  const emoji = getStreakEmoji(streakData.currentStreak)

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
    >
      <span className="text-sm">{emoji}</span>
      <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
        {streakData.currentStreak}
      </span>
    </button>
  )
}
