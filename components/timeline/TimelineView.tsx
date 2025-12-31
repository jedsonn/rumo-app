'use client'

import { useMemo } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { Goal, PERIOD_COLORS } from '@/lib/types'
import { Flag, Calendar, Check, Clock } from 'lucide-react'

interface TimelineViewProps {
  goals: Goal[]
}

export function TimelineView({ goals }: TimelineViewProps) {
  const { isBlue, year } = useDashboard()

  // Group goals by period
  const groupedGoals = useMemo(() => {
    const oneYear = goals.filter(g => g.period === 'One-year' && g.year === year)
    const threeYear = goals.filter(g => g.period === 'Three-years')
    const fiveYear = goals.filter(g => g.period === 'Five-years')

    return { oneYear, threeYear, fiveYear }
  }, [goals, year])

  // Calculate progress for each period
  const getProgress = (periodGoals: Goal[]) => {
    if (periodGoals.length === 0) return 0
    const done = periodGoals.filter(g => g.status === 'Done').length
    return Math.round((done / periodGoals.length) * 100)
  }

  const periods = [
    {
      label: `${year} Goals`,
      sublabel: '1 Year',
      goals: groupedGoals.oneYear,
      color: 'sky',
      targetYear: year,
    },
    {
      label: `${year + 2} Vision`,
      sublabel: '3 Years',
      goals: groupedGoals.threeYear,
      color: 'amber',
      targetYear: year + 2,
    },
    {
      label: `${year + 4} Vision`,
      sublabel: '5 Years',
      goals: groupedGoals.fiveYear,
      color: 'violet',
      targetYear: year + 4,
    },
  ]

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-700">
        <Clock size={20} className={isBlue ? 'text-blue-500' : 'text-rose-500'} />
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Timeline Roadmap</h2>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto p-4">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 via-amber-500 to-violet-500" />

          {periods.map((period, idx) => {
            const progress = getProgress(period.goals)
            const colorClasses = {
              sky: {
                bg: 'bg-sky-500',
                light: 'bg-sky-100 dark:bg-sky-900/40',
                text: 'text-sky-700 dark:text-sky-300',
                border: 'border-sky-200 dark:border-sky-800',
              },
              amber: {
                bg: 'bg-amber-500',
                light: 'bg-amber-100 dark:bg-amber-900/40',
                text: 'text-amber-700 dark:text-amber-300',
                border: 'border-amber-200 dark:border-amber-800',
              },
              violet: {
                bg: 'bg-violet-500',
                light: 'bg-violet-100 dark:bg-violet-900/40',
                text: 'text-violet-700 dark:text-violet-300',
                border: 'border-violet-200 dark:border-violet-800',
              },
            }[period.color]

            return (
              <div key={period.label} className="relative mb-8 last:mb-0">
                {/* Period marker */}
                <div className="flex items-start gap-4">
                  <div className={`relative z-10 w-12 h-12 rounded-full ${colorClasses.bg} flex items-center justify-center shadow-lg`}>
                    <Flag size={20} className="text-white" />
                  </div>

                  <div className="flex-1 pt-1">
                    {/* Period header */}
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className={`font-bold text-lg ${colorClasses.text}`}>
                        {period.label}
                      </h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClasses.light} ${colorClasses.text}`}>
                        {period.sublabel}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {period.goals.length} goals
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 dark:text-slate-400">Progress</span>
                        <span className={colorClasses.text}>{progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full ${colorClasses.bg} transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Goals list */}
                    {period.goals.length === 0 ? (
                      <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                        No goals for this period yet
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {period.goals.slice(0, 5).map(goal => (
                          <div
                            key={goal.id}
                            className={`flex items-center gap-2 p-2 rounded-lg border ${colorClasses.border} ${colorClasses.light}`}
                          >
                            {goal.status === 'Done' ? (
                              <Check size={14} className="text-green-500 shrink-0" />
                            ) : (
                              <div className={`w-2 h-2 rounded-full ${colorClasses.bg} shrink-0`} />
                            )}
                            <span className={`text-sm truncate ${
                              goal.status === 'Done' ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'
                            }`}>
                              {goal.goal}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-auto shrink-0">
                              {goal.category}
                            </span>
                          </div>
                        ))}
                        {period.goals.length > 5 && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 pl-4">
                            + {period.goals.length - 5} more goals
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* End marker */}
          <div className="relative">
            <div className="flex items-center gap-4">
              <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                  Your Future
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Keep pushing towards your dreams!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
