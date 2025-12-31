'use client'

import { useMemo, useState } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { Goal } from '@/lib/types'
import { Modal } from '@/components/ui/Modal'
import { Trophy, Target, TrendingUp, Award, Sparkles, ChevronRight, ChevronLeft, Check, Flame, Star } from 'lucide-react'
import confetti from 'canvas-confetti'

interface YearEndReviewProps {
  isOpen: boolean
  onClose: () => void
  year: number
}

export function YearEndReview({ isOpen, onClose, year }: YearEndReviewProps) {
  const { goals, blessings, rewards, isBlue } = useDashboard()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Calculate stats for the year
  const stats = useMemo(() => {
    const yearGoals = goals.filter(g => g.year === year)
    const completed = yearGoals.filter(g => g.status === 'Done')
    const personalGoals = yearGoals.filter(g => g.category === 'Personal')
    const professionalGoals = yearGoals.filter(g => g.category === 'Professional')
    const pinnedCompleted = completed.filter(g => g.pinned)
    const totalCostSaved = completed.reduce((sum, g) => sum + (g.cost || 0), 0)
    const earnedRewards = rewards.filter(r => r.earned)

    // Most productive category
    const personalDone = personalGoals.filter(g => g.status === 'Done').length
    const professionalDone = professionalGoals.filter(g => g.status === 'Done').length
    const topCategory = personalDone >= professionalDone ? 'Personal' : 'Professional'

    return {
      total: yearGoals.length,
      completed: completed.length,
      completionRate: yearGoals.length > 0 ? Math.round((completed.length / yearGoals.length) * 100) : 0,
      personalGoals: personalGoals.length,
      professionalGoals: professionalGoals.length,
      personalDone,
      professionalDone,
      pinnedCompleted: pinnedCompleted.length,
      topCategory,
      totalCostSaved,
      earnedRewards: earnedRewards.length,
      blessingsCount: blessings.length,
      completedGoals: completed,
    }
  }, [goals, blessings, rewards, year])

  const slides = [
    {
      id: 'intro',
      title: `Your ${year} in Review`,
      icon: <Sparkles size={48} />,
      content: (
        <div className="text-center py-8">
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            Let's celebrate your journey this year!
          </p>
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-slate-500 dark:text-slate-400">
            You set {stats.total} goals and worked hard towards achieving them.
          </p>
        </div>
      ),
    },
    {
      id: 'completion',
      title: 'Goals Completed',
      icon: <Trophy size={48} />,
      content: (
        <div className="text-center py-8">
          <div className="text-8xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-4">
            {stats.completed}
          </div>
          <p className="text-2xl text-slate-600 dark:text-slate-300 mb-2">
            goals achieved!
          </p>
          <div className="mt-6 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-500">{stats.personalDone}</div>
              <div className="text-sm text-slate-500">Personal</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500">{stats.professionalDone}</div>
              <div className="text-sm text-slate-500">Professional</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'rate',
      title: 'Completion Rate',
      icon: <Target size={48} />,
      content: (
        <div className="text-center py-8">
          <div className="relative inline-block mb-6">
            <svg className="w-48 h-48" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-200 dark:text-slate-700"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${stats.completionRate * 2.83} 283`}
                transform="rotate(-90 50 50)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={isBlue ? '#3b82f6' : '#ec4899'} />
                  <stop offset="100%" stopColor={isBlue ? '#8b5cf6' : '#f43f5e'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-slate-700 dark:text-slate-200">
                {stats.completionRate}%
              </span>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            {stats.completionRate >= 75
              ? 'Outstanding! You crushed it this year!'
              : stats.completionRate >= 50
              ? 'Great progress! Keep pushing forward!'
              : stats.completionRate >= 25
              ? 'Good start! Next year will be even better!'
              : 'Every step counts. You have got this!'}
          </p>
        </div>
      ),
    },
    {
      id: 'highlights',
      title: 'Top Achievements',
      icon: <Award size={48} />,
      content: (
        <div className="py-4">
          {stats.completedGoals.slice(0, 5).length > 0 ? (
            <div className="space-y-3">
              {stats.completedGoals.slice(0, 5).map((goal, idx) => (
                <div
                  key={goal.id}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    isBlue ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-rose-50 dark:bg-rose-900/20'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-orange-400' : 'bg-slate-300'
                  }`}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : <Check size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-700 dark:text-slate-200 truncate">
                      {goal.goal}
                    </p>
                    <p className="text-xs text-slate-500">{goal.category}</p>
                  </div>
                  {goal.pinned && <Flame size={16} className="text-orange-500" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>No completed goals yet - but next year is your year!</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'extras',
      title: 'The Extras',
      icon: <Star size={48} />,
      content: (
        <div className="py-8 grid grid-cols-2 gap-6">
          <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
            <div className="text-3xl mb-2">💵</div>
            <div className="text-2xl font-bold text-emerald-600">${stats.totalCostSaved.toLocaleString()}</div>
            <div className="text-sm text-slate-500">Saved by completing goals</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
            <div className="text-3xl mb-2">🎁</div>
            <div className="text-2xl font-bold text-purple-600">{stats.earnedRewards}</div>
            <div className="text-sm text-slate-500">Rewards earned</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-amber-600">{stats.pinnedCompleted}</div>
            <div className="text-sm text-slate-500">Priority goals done</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-sky-50 dark:bg-sky-900/20">
            <div className="text-3xl mb-2">✨</div>
            <div className="text-2xl font-bold text-sky-600">{stats.blessingsCount}</div>
            <div className="text-sm text-slate-500">Blessings counted</div>
          </div>
        </div>
      ),
    },
    {
      id: 'outro',
      title: `Here's to ${year + 1}!`,
      icon: <TrendingUp size={48} />,
      content: (
        <div className="text-center py-8">
          <div className="text-6xl mb-6">🚀</div>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-4">
            You have done amazing things this year.
          </p>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">
            Keep dreaming big and setting bold goals. The best is yet to come!
          </p>
          <button
            onClick={() => {
              confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: isBlue ? ['#3b82f6', '#8b5cf6', '#22c55e', '#fbbf24'] : ['#ec4899', '#f43f5e', '#22c55e', '#fbbf24'],
              })
            }}
            className={`px-6 py-3 rounded-xl text-white ${isBlue ? 'gradient-bg' : 'gradient-bg-pink'} hover:opacity-90`}
          >
            Celebrate! 🎉
          </button>
        </div>
      ),
    },
  ]

  const currentSlideData = slides[currentSlide]
  const isFirst = currentSlide === 0
  const isLast = currentSlide === slides.length - 1

  const gradientClass = isBlue ? 'text-blue-500' : 'text-rose-500'

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="lg">
      <div className="min-h-[400px] flex flex-col">
        {/* Icon and title */}
        <div className="text-center mb-6">
          <div className={`inline-flex p-4 rounded-2xl ${
            isBlue ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-500'
          } mb-4`}>
            {currentSlideData.icon}
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {currentSlideData.title}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1">
          {currentSlideData.content}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setCurrentSlide(prev => prev - 1)}
            disabled={isFirst}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
              isFirst
                ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <ChevronLeft size={18} />
            Back
          </button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentSlide
                    ? isBlue ? 'bg-blue-500 w-6' : 'bg-rose-500 w-6'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (isLast) {
                onClose()
              } else {
                setCurrentSlide(prev => prev + 1)
              }
            }}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
              isBlue ? 'gradient-bg' : 'gradient-bg-pink'
            } text-white hover:opacity-90`}
          >
            {isLast ? 'Close' : 'Next'}
            {!isLast && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </Modal>
  )
}
