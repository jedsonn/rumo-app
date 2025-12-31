import { GoalPeriod, GoalCategory } from './types'

export interface GoalTemplate {
  goal: string
  action: string
  period: GoalPeriod
  category: GoalCategory
}

export interface TemplatePack {
  id: string
  name: string
  emoji: string
  description: string
  color: string
  goals: GoalTemplate[]
}

export const TEMPLATE_PACKS: TemplatePack[] = [
  {
    id: 'fitness',
    name: 'Get Fit',
    emoji: '💪',
    description: 'Build healthy habits and transform your body',
    color: 'emerald',
    goals: [
      { goal: 'Exercise 3x per week consistently', action: 'Schedule workouts in calendar', period: 'One-year', category: 'Personal' },
      { goal: 'Run a 5K race', action: 'Download Couch to 5K app', period: 'One-year', category: 'Personal' },
      { goal: 'Lose 10 pounds healthily', action: 'Track calories for 1 week', period: 'One-year', category: 'Personal' },
      { goal: 'Sleep 7-8 hours every night', action: 'Set bedtime alarm for 10pm', period: 'One-year', category: 'Personal' },
      { goal: 'Drink 8 glasses of water daily', action: 'Get a marked water bottle', period: 'One-year', category: 'Personal' },
    ]
  },
  {
    id: 'finance',
    name: 'Financial Freedom',
    emoji: '💰',
    description: 'Take control of your money and build wealth',
    color: 'amber',
    goals: [
      { goal: 'Build $10K emergency fund', action: 'Automate $500/month to savings', period: 'One-year', category: 'Personal' },
      { goal: 'Pay off all credit card debt', action: 'List all debts by interest rate', period: 'One-year', category: 'Personal' },
      { goal: 'Max out retirement contributions', action: 'Increase 401k by 2%', period: 'One-year', category: 'Personal' },
      { goal: 'Create a monthly budget and stick to it', action: 'Try YNAB or Mint app', period: 'One-year', category: 'Personal' },
      { goal: 'Build a passive income stream', action: 'Research dividend investing', period: 'Three-years', category: 'Personal' },
    ]
  },
  {
    id: 'career',
    name: 'Career Growth',
    emoji: '🚀',
    description: 'Level up your professional life',
    color: 'blue',
    goals: [
      { goal: 'Get promoted to next level', action: 'Schedule career chat with manager', period: 'One-year', category: 'Professional' },
      { goal: 'Negotiate a 15% raise', action: 'Document all accomplishments', period: 'One-year', category: 'Professional' },
      { goal: 'Build professional network (+50 connections)', action: 'Attend 1 event per month', period: 'One-year', category: 'Professional' },
      { goal: 'Find a mentor in my field', action: 'List 5 potential mentors', period: 'One-year', category: 'Professional' },
      { goal: 'Develop leadership skills', action: 'Volunteer to lead a project', period: 'One-year', category: 'Professional' },
    ]
  },
  {
    id: 'learning',
    name: 'Learn & Grow',
    emoji: '📚',
    description: 'Expand your knowledge and skills',
    color: 'violet',
    goals: [
      { goal: 'Read 24 books this year', action: 'Read 20 pages every morning', period: 'One-year', category: 'Personal' },
      { goal: 'Learn a new language (conversational)', action: 'Do Duolingo 10 min/day', period: 'Three-years', category: 'Personal' },
      { goal: 'Complete an online certification', action: 'Research courses on Coursera', period: 'One-year', category: 'Professional' },
      { goal: 'Learn a new technical skill', action: 'Pick one skill and find tutorial', period: 'One-year', category: 'Professional' },
      { goal: 'Start a creative hobby', action: 'Try 3 different hobbies this month', period: 'One-year', category: 'Personal' },
    ]
  },
  {
    id: 'wellness',
    name: 'Mental Wellness',
    emoji: '🧘',
    description: 'Prioritize your mental health and peace',
    color: 'rose',
    goals: [
      { goal: 'Meditate 10 minutes daily', action: 'Download Headspace or Calm', period: 'One-year', category: 'Personal' },
      { goal: 'Journal 3x per week', action: 'Buy a nice journal', period: 'One-year', category: 'Personal' },
      { goal: 'Reduce screen time by 2 hours/day', action: 'Enable Screen Time limits', period: 'One-year', category: 'Personal' },
      { goal: 'Practice gratitude daily', action: 'Write 3 things each morning', period: 'One-year', category: 'Personal' },
      { goal: 'Take a digital detox weekend monthly', action: 'Block first weekend of month', period: 'One-year', category: 'Personal' },
    ]
  },
  {
    id: 'relationships',
    name: 'Relationships',
    emoji: '❤️',
    description: 'Nurture meaningful connections',
    color: 'pink',
    goals: [
      { goal: 'Have weekly date nights', action: 'Block Friday evenings', period: 'One-year', category: 'Personal' },
      { goal: 'Call parents/family weekly', action: 'Set Sunday reminder', period: 'One-year', category: 'Personal' },
      { goal: 'Make 3 new close friends', action: 'Join a club or group', period: 'One-year', category: 'Personal' },
      { goal: 'Be more present (less phone)', action: 'No phones at dinner', period: 'One-year', category: 'Personal' },
      { goal: 'Plan a meaningful trip with loved ones', action: 'Research destinations', period: 'One-year', category: 'Personal' },
    ]
  },
  {
    id: 'productivity',
    name: 'Productivity',
    emoji: '⚡',
    description: 'Work smarter, not harder',
    color: 'orange',
    goals: [
      { goal: 'Wake up at 6am consistently', action: 'Move alarm across room', period: 'One-year', category: 'Personal' },
      { goal: 'Implement weekly planning ritual', action: 'Block Sunday 30min for planning', period: 'One-year', category: 'Personal' },
      { goal: 'Reduce meetings by 25%', action: 'Audit calendar and decline 3', period: 'One-year', category: 'Professional' },
      { goal: 'Master a productivity system', action: 'Try GTD or Pomodoro for 30 days', period: 'One-year', category: 'Personal' },
      { goal: 'Achieve inbox zero daily', action: 'Process email 2x per day only', period: 'One-year', category: 'Professional' },
    ]
  },
  {
    id: 'side-hustle',
    name: 'Side Hustle',
    emoji: '💡',
    description: 'Build something on the side',
    color: 'cyan',
    goals: [
      { goal: 'Launch a side project', action: 'Brainstorm 10 ideas this week', period: 'One-year', category: 'Professional' },
      { goal: 'Make first $1,000 from side income', action: 'Validate idea with 5 customers', period: 'One-year', category: 'Professional' },
      { goal: 'Build an audience (1,000 followers)', action: 'Post valuable content 3x/week', period: 'One-year', category: 'Professional' },
      { goal: 'Create a digital product', action: 'Outline ebook or course idea', period: 'One-year', category: 'Professional' },
      { goal: 'Work on side project 5hrs/week', action: 'Block Saturday mornings', period: 'One-year', category: 'Professional' },
    ]
  },
]

export const PACK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-700 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-700 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
  cyan: { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800' },
}
