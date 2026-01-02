// ============ EXPORT UTILITIES ============

import { Goal, Blessing, Reward } from './types'

// Convert goals to CSV format
export function goalsToCSV(goals: Goal[]): string {
  const headers = [
    'Number',
    'Goal',
    'Category',
    'Period',
    'Status',
    'Action',
    'Cost',
    'Notes',
    'Pinned',
    'Year',
    'Created At'
  ]

  const rows = goals.map(goal => [
    goal.number,
    `"${goal.goal.replace(/"/g, '""')}"`, // Escape quotes
    goal.category,
    goal.period,
    goal.status,
    `"${(goal.action || '').replace(/"/g, '""')}"`,
    goal.cost,
    `"${(goal.notes || '').replace(/"/g, '""')}"`,
    goal.pinned ? 'Yes' : 'No',
    goal.year,
    new Date(goal.created_at).toLocaleDateString()
  ])

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

// Convert blessings to CSV format
export function blessingsToCSV(blessings: Blessing[]): string {
  const headers = ['Text', 'Category', 'Created At']

  const rows = blessings.map(blessing => [
    `"${blessing.text.replace(/"/g, '""')}"`,
    blessing.category,
    new Date(blessing.created_at).toLocaleDateString()
  ])

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

// Convert rewards to CSV format
export function rewardsToCSV(rewards: Reward[]): string {
  const headers = ['Text', 'Cost', 'Earned', 'Created At']

  const rows = rewards.map(reward => [
    `"${reward.text.replace(/"/g, '""')}"`,
    reward.cost,
    reward.earned ? 'Yes' : 'No',
    new Date(reward.created_at).toLocaleDateString()
  ])

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

// Download CSV file
export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Export all data as JSON
export function exportAllData(goals: Goal[], blessings: Blessing[], rewards: Reward[]) {
  const data = {
    exportedAt: new Date().toISOString(),
    goals,
    blessings,
    rewards
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `rumo-backup-${new Date().toISOString().split('T')[0]}.json`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
