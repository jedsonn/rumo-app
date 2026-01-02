// Streaks and consistency tracking utilities

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastCheckIn: string | null // ISO date string
  checkInHistory: string[] // Array of ISO date strings
  totalCheckIns: number
}

const STREAK_STORAGE_KEY = 'myresolve_streak_data'

export function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return getDefaultStreakData()
  }

  const stored = localStorage.getItem(STREAK_STORAGE_KEY)
  if (!stored) {
    return getDefaultStreakData()
  }

  try {
    return JSON.parse(stored)
  } catch {
    return getDefaultStreakData()
  }
}

export function getDefaultStreakData(): StreakData {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastCheckIn: null,
    checkInHistory: [],
    totalCheckIns: 0,
  }
}

export function saveStreakData(data: StreakData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data))
  }
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

export function getYesterdayDateString(): string {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

export function recordCheckIn(): StreakData {
  const data = getStreakData()
  const today = getTodayDateString()
  const yesterday = getYesterdayDateString()

  // Already checked in today
  if (data.lastCheckIn === today) {
    return data
  }

  // Update streak
  if (data.lastCheckIn === yesterday) {
    // Continuing streak
    data.currentStreak += 1
  } else if (data.lastCheckIn === null || data.lastCheckIn < yesterday) {
    // Starting new streak
    data.currentStreak = 1
  }

  // Update longest streak
  if (data.currentStreak > data.longestStreak) {
    data.longestStreak = data.currentStreak
  }

  // Record check-in
  data.lastCheckIn = today
  if (!data.checkInHistory.includes(today)) {
    data.checkInHistory.push(today)
  }
  data.totalCheckIns = data.checkInHistory.length

  // Keep only last 365 days of history
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const cutoffDate = oneYearAgo.toISOString().split('T')[0]
  data.checkInHistory = data.checkInHistory.filter(date => date >= cutoffDate)

  saveStreakData(data)
  return data
}

export function getConsistencyScore(data: StreakData): number {
  if (data.checkInHistory.length === 0) return 0

  // Calculate consistency based on last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0]

  const recentCheckIns = data.checkInHistory.filter(date => date >= cutoffDate)
  return Math.round((recentCheckIns.length / 30) * 100)
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '🔥'
  if (streak >= 14) return '⚡'
  if (streak >= 7) return '✨'
  if (streak >= 3) return '💪'
  if (streak >= 1) return '🌱'
  return '💤'
}

export function getStreakMessage(streak: number): string {
  if (streak >= 30) return "You're on fire!"
  if (streak >= 14) return "Incredible momentum!"
  if (streak >= 7) return "One week strong!"
  if (streak >= 3) return "Building habits!"
  if (streak >= 1) return "You're back!"
  return "Start your streak!"
}

// Generate sample streak data for demo
export function generateSampleStreakData(): StreakData {
  const today = new Date()
  const checkInHistory: string[] = []

  // Generate some check-ins over the last 2 weeks
  for (let i = 0; i < 14; i++) {
    // Skip some days randomly for realism (skip ~30% of days)
    if (i > 3 && Math.random() < 0.3) continue

    const date = new Date(today)
    date.setDate(date.getDate() - i)
    checkInHistory.push(date.toISOString().split('T')[0])
  }

  // Sort chronologically
  checkInHistory.sort()

  // Calculate current streak (consecutive days ending today or yesterday)
  let currentStreak = 0
  const todayStr = getTodayDateString()
  const yesterdayStr = getYesterdayDateString()

  if (checkInHistory.includes(todayStr) || checkInHistory.includes(yesterdayStr)) {
    currentStreak = 1
    let checkDate = checkInHistory.includes(todayStr) ? today : new Date(today)
    if (!checkInHistory.includes(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1)
    }

    for (let i = 1; i < 30; i++) {
      const prevDate = new Date(checkDate)
      prevDate.setDate(prevDate.getDate() - i)
      const prevDateStr = prevDate.toISOString().split('T')[0]
      if (checkInHistory.includes(prevDateStr)) {
        currentStreak++
      } else {
        break
      }
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, 7),
    lastCheckIn: checkInHistory[checkInHistory.length - 1] || null,
    checkInHistory,
    totalCheckIns: checkInHistory.length,
  }
}
