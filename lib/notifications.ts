// Notification preferences types and utilities

export interface NotificationPreferences {
  weeklyDigest: boolean
  weeklyDigestDay: 'sunday' | 'monday'
  reminderEnabled: boolean
  reminderFrequency: 'daily' | 'every3days' | 'weekly'
  inactivityNudge: boolean
  inactivityDays: number
  celebrateWins: boolean
  email: string
}

const NOTIFICATION_STORAGE_KEY = 'rumo_notification_prefs'

export function getDefaultNotificationPreferences(): NotificationPreferences {
  return {
    weeklyDigest: true,
    weeklyDigestDay: 'sunday',
    reminderEnabled: true,
    reminderFrequency: 'every3days',
    inactivityNudge: true,
    inactivityDays: 7,
    celebrateWins: true,
    email: '',
  }
}

export function getNotificationPreferences(): NotificationPreferences {
  if (typeof window === 'undefined') {
    return getDefaultNotificationPreferences()
  }

  const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY)
  if (!stored) {
    return getDefaultNotificationPreferences()
  }

  try {
    return { ...getDefaultNotificationPreferences(), ...JSON.parse(stored) }
  } catch {
    return getDefaultNotificationPreferences()
  }
}

export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(prefs))
  }
}

// Email content generators (for backend use)
export function generateWeeklyDigestContent(data: {
  userName: string
  goalsActive: number
  goalsCompleted: number
  streakDays: number
  topGoals: string[]
}): { subject: string; html: string } {
  return {
    subject: `Your Weekly Goals Digest - ${data.goalsCompleted} wins this week!`,
    html: `
      <h1>Hi ${data.userName}!</h1>
      <p>Here's your weekly progress summary:</p>
      <ul>
        <li><strong>${data.goalsActive}</strong> active goals</li>
        <li><strong>${data.goalsCompleted}</strong> goals completed this week</li>
        <li><strong>${data.streakDays}</strong> day streak</li>
      </ul>
      <h2>Your Top Goals:</h2>
      <ul>
        ${data.topGoals.map(g => `<li>${g}</li>`).join('')}
      </ul>
      <p>Keep up the great work!</p>
    `
  }
}

export function generateReminderContent(data: {
  userName: string
  daysSinceLastVisit: number
  activeGoalsCount: number
}): { subject: string; html: string } {
  return {
    subject: `We miss you, ${data.userName}! Your goals are waiting`,
    html: `
      <h1>Hi ${data.userName}!</h1>
      <p>It's been ${data.daysSinceLastVisit} days since you last checked on your goals.</p>
      <p>You have <strong>${data.activeGoalsCount}</strong> active goals waiting for your attention.</p>
      <p>Even a small check-in helps maintain momentum!</p>
      <a href="#">Check your goals now</a>
    `
  }
}
