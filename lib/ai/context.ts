// Build context strings from user's goals for AI prompts

import { Goal, Blessing, Reward } from '@/lib/types'

export interface GoalSummary {
  personal: Goal[]
  professional: Goal[]
  byStatus: Record<string, Goal[]>
  completed: Goal[]
  inProgress: Goal[]
  pinned: Goal[]
}

export function summarizeGoals(goals: Goal[]): GoalSummary {
  const personal = goals.filter(g => g.category === 'Personal')
  const professional = goals.filter(g => g.category === 'Professional')

  const byStatus: Record<string, Goal[]> = {
    'Doing': [],
    'On Track': [],
    'For Later': [],
    'Done': [],
    'Dropped': [],
  }

  goals.forEach(g => {
    if (byStatus[g.status]) {
      byStatus[g.status].push(g)
    }
  })

  return {
    personal,
    professional,
    byStatus,
    completed: byStatus['Done'],
    inProgress: [...byStatus['Doing'], ...byStatus['On Track']],
    pinned: goals.filter(g => g.pinned),
  }
}

export function formatGoalsForContext(goals: Goal[], includeDetails = false): string {
  if (goals.length === 0) return 'No goals yet.'

  const summary = summarizeGoals(goals)

  const lines: string[] = []

  // Personal goals
  if (summary.personal.length > 0) {
    lines.push('PERSONAL GOALS:')
    summary.personal.forEach(g => {
      const pin = g.pinned ? '🔥 ' : ''
      const status = `[${g.status}]`
      const period = `(${g.period})`
      lines.push(`  ${pin}#${g.number} ${g.goal} ${status} ${period}`)
      if (includeDetails && g.action) {
        lines.push(`      → Next: ${g.action}`)
      }
    })
    lines.push('')
  }

  // Professional goals
  if (summary.professional.length > 0) {
    lines.push('PROFESSIONAL GOALS:')
    summary.professional.forEach(g => {
      const pin = g.pinned ? '🔥 ' : ''
      const status = `[${g.status}]`
      const period = `(${g.period})`
      lines.push(`  ${pin}#${g.number} ${g.goal} ${status} ${period}`)
      if (includeDetails && g.action) {
        lines.push(`      → Next: ${g.action}`)
      }
    })
  }

  return lines.join('\n')
}

export function formatGoalsForChatCoach(goals: Goal[]): string {
  const summary = summarizeGoals(goals)

  const lines: string[] = []

  // Stats overview
  lines.push(`OVERVIEW:`)
  lines.push(`- Total goals: ${goals.length}`)
  lines.push(`- In progress: ${summary.inProgress.length}`)
  lines.push(`- Completed: ${summary.completed.length}`)
  lines.push(`- Pinned (high priority): ${summary.pinned.length}`)
  lines.push('')

  // Detailed list
  lines.push(formatGoalsForContext(goals, true))

  return lines.join('\n')
}

export function formatWeeklyStats(
  goals: Goal[],
  blessings: Blessing[],
  rewards: Reward[],
  weekAgo: Date
): {
  completed: number
  inProgress: number
  newGoals: number
  totalGoals: number
  completedGoals: string[]
  stuckGoals: string[]
} {
  const activeGoals = goals.filter(g => g.status !== 'Dropped')

  // Goals completed this week (updated_at is after weekAgo and status is Done)
  const completedThisWeek = goals.filter(g =>
    g.status === 'Done' &&
    new Date(g.updated_at) >= weekAgo
  )

  // Goals that haven't been updated in over 2 weeks (potentially stuck)
  const twoWeeksAgo = new Date(weekAgo)
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7) // 3 weeks total

  const stuckGoals = goals.filter(g =>
    ['Doing', 'On Track'].includes(g.status) &&
    new Date(g.updated_at) < twoWeeksAgo
  )

  // New goals added this week
  const newGoals = goals.filter(g =>
    new Date(g.created_at) >= weekAgo
  )

  return {
    completed: completedThisWeek.length,
    inProgress: goals.filter(g => ['Doing', 'On Track'].includes(g.status)).length,
    newGoals: newGoals.length,
    totalGoals: activeGoals.length,
    completedGoals: completedThisWeek.map(g => g.goal),
    stuckGoals: stuckGoals.slice(0, 3).map(g => g.goal), // Max 3
  }
}

// Format a single goal for the action breaker context
export function formatSingleGoalContext(goal: Goal, allGoals: Goal[]): string {
  const relatedGoals = allGoals
    .filter(g => g.id !== goal.id && g.category === goal.category)
    .slice(0, 5) // Max 5 related goals for context
    .map(g => `- ${g.goal} [${g.status}]`)
    .join('\n')

  return relatedGoals || 'No other goals in this category.'
}
