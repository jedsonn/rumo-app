// ============ SUGGESTIONS DATA - MATCHING TEMPLATE EXACTLY ============

import { GoalPeriod, GoalCategory } from './types'

export interface GoalSuggestion {
  goal: string
  period: GoalPeriod
  action: string
}

export const SUGGESTIONS: Record<GoalCategory, GoalSuggestion[]> = {
  Personal: [
    // Health & Fitness
    { goal: "Lose 5 lbs", period: "One-year", action: "Track calories" },
    { goal: "Gain 5 lbs of muscle", period: "One-year", action: "Start lifting" },
    { goal: "Exercise 3x per week", period: "One-year", action: "Pick a routine" },
    { goal: "Run a 5K", period: "One-year", action: "Start training" },
    { goal: "Sleep 8 hours consistently", period: "One-year", action: "Set bedtime" },
    { goal: "Drink more water daily", period: "One-year", action: "Get water bottle" },
    { goal: "Quit a bad habit", period: "One-year", action: "Identify triggers" },
    // Travel & Experiences
    { goal: "Travel to a new country", period: "One-year", action: "Research destinations" },
    { goal: "Visit family abroad", period: "One-year", action: "Check flight prices" },
    { goal: "Take a road trip", period: "One-year", action: "Plan route" },
    { goal: "Plan a weekend getaway", period: "One-year", action: "Pick dates" },
    // Family & Relationships
    { goal: "Spend more quality time with family", period: "One-year", action: "Schedule weekly time" },
    { goal: "Call parents weekly", period: "One-year", action: "Set reminder" },
    { goal: "Plan monthly date nights", period: "One-year", action: "Book first one" },
    { goal: "Reconnect with old friends", period: "One-year", action: "Reach out to 3" },
    // Finance
    { goal: "Save for emergency fund", period: "One-year", action: "Set up auto-transfer" },
    { goal: "Start retirement contributions", period: "One-year", action: "Open account" },
    { goal: "Pay off credit card debt", period: "One-year", action: "List all debts" },
    { goal: "Create and stick to a budget", period: "One-year", action: "Track spending" },
    { goal: "Buy a house", period: "Three-years", action: "Save for down payment" },
    // Learning & Growth
    { goal: "Learn a new language", period: "One-year", action: "Download app" },
    { goal: "Read 12 books this year", period: "One-year", action: "Pick first book" },
    { goal: "Take an online course", period: "One-year", action: "Browse courses" },
    { goal: "Learn to cook new recipes", period: "One-year", action: "Find cookbook" },
    { goal: "Pick up a new hobby", period: "One-year", action: "Try 3 things" },
    // Wellness & Mindfulness
    { goal: "Meditate daily", period: "One-year", action: "Start with 5 min" },
    { goal: "Practice daily gratitude", period: "One-year", action: "Get journal" },
    { goal: "Reduce screen time", period: "One-year", action: "Set app limits" },
    { goal: "Journal weekly", period: "One-year", action: "Buy notebook" },
    // Home
    { goal: "Declutter the house", period: "One-year", action: "One room at a time" },
    { goal: "Start a garden", period: "One-year", action: "Plan what to grow" },
    { goal: "Complete home improvement project", period: "One-year", action: "Make list" },
    // Long-term
    { goal: "Start a family", period: "Three-years", action: "Discuss timeline" },
    { goal: "Get married", period: "Three-years", action: "Plan proposal" },
    { goal: "Achieve work-life balance", period: "One-year", action: "Set boundaries" },
  ],
  Professional: [
    // Career Growth
    { goal: "Get promoted", period: "One-year", action: "Talk to manager" },
    { goal: "Ask for a raise", period: "One-year", action: "Document wins" },
    { goal: "Update resume", period: "One-year", action: "List achievements" },
    { goal: "Network with 5 new people", period: "One-year", action: "Attend event" },
    { goal: "Find a mentor", period: "One-year", action: "Identify candidates" },
    { goal: "Switch to dream job", period: "Three-years", action: "Define dream job" },
    // Skills & Learning
    { goal: "Learn a new professional skill", period: "One-year", action: "Pick skill" },
    { goal: "Get a certification", period: "One-year", action: "Research options" },
    { goal: "Attend a conference", period: "One-year", action: "Find relevant ones" },
    { goal: "Give a presentation", period: "One-year", action: "Propose topic" },
    { goal: "Improve public speaking", period: "One-year", action: "Join Toastmasters" },
    // Research & Academic
    { goal: "Submit paper to top journal", period: "One-year", action: "Polish manuscript" },
    { goal: "Get R&R to accept", period: "One-year", action: "Address comments" },
    { goal: "Start new research project", period: "One-year", action: "Write proposal" },
    { goal: "Present at major conference", period: "One-year", action: "Submit abstract" },
    { goal: "Collaborate with new coauthor", period: "One-year", action: "Reach out" },
    { goal: "Write a book", period: "Three-years", action: "Create outline" },
    // Teaching & Mentoring
    { goal: "Improve teaching evaluations", period: "One-year", action: "Get feedback" },
    { goal: "Have fun teaching", period: "One-year", action: "Try new methods" },
    { goal: "Mentor a junior colleague", period: "One-year", action: "Offer help" },
    // Work-Life
    { goal: "Leave work on time", period: "One-year", action: "Set hard stop" },
    { goal: "Take all vacation days", period: "One-year", action: "Plan ahead" },
    { goal: "Set better work boundaries", period: "One-year", action: "Define hours" },
    { goal: "Reduce meetings by 25%", period: "One-year", action: "Audit calendar" },
    // Entrepreneurship
    { goal: "Start a side project", period: "One-year", action: "Brainstorm ideas" },
    { goal: "Launch a business", period: "Three-years", action: "Write plan" },
    { goal: "Build passive income stream", period: "Three-years", action: "Research options" },
    // Finance
    { goal: "Increase salary by 20%", period: "Three-years", action: "Plan path" },
    { goal: "Reach financial milestone", period: "Five-years", action: "Set target" },
  ]
}

export const BLESSING_SUGGESTIONS = [
  "Good health this year 💪",
  "Loving family and friends 💕",
  "A roof over my head 🏠",
  "Steady income and job security 💼",
  "Achieved a personal goal 🎯",
  "Made a new friend 🤝",
  "Learned something new 📚",
  "Overcame a challenge 💪",
  "Had a great vacation ✈️",
  "Received unexpected good news 🎉",
  "Someone showed me kindness 🙏",
  "Enjoyed quality time with loved ones",
  "Found peace in a difficult situation",
  "Celebrated a milestone 🎊",
  "Grateful for second chances",
  "Good food on the table 🍽️",
  "Access to clean water and shelter",
  "Supportive colleagues at work",
  "Personal growth and self-improvement",
  "A moment of pure joy today ☀️",
]

export const REWARD_SUGGESTIONS = [
  "Nice dinner out 🍽️",
  "Spa day 💆",
  "New outfit 👔",
  "Concert tickets 🎵",
  "Weekend getaway 🏖️",
  "New gadget 📱",
  "Fancy coffee treat ☕",
  "Movie night 🎬",
  "New book 📚",
  "Video game 🎮",
  "Massage 💆‍♂️",
  "Day off (guilt-free!) 😴",
  "Nice bottle of wine 🍷",
  "Online course I want 🎓",
  "New shoes 👟",
  "Treat myself to dessert 🍰",
  "Buy that thing I've been eyeing 🛒",
  "Subscription I've wanted 📺",
  "Art supplies 🎨",
  "Plants for the home 🌱",
]

// ============ TEMPLATE PACKS - CURATED GOAL COLLECTIONS ============

export interface TemplatePack {
  id: string
  name: string
  emoji: string
  description: string
  category: GoalCategory
  goals: GoalSuggestion[]
}

export const TEMPLATE_PACKS: TemplatePack[] = [
  // Personal Packs
  {
    id: 'fitness-starter',
    name: 'Fitness Starter',
    emoji: '💪',
    description: 'Get in shape with foundational fitness goals',
    category: 'Personal',
    goals: [
      { goal: "Exercise 3x per week consistently", period: "One-year", action: "Pick a workout routine" },
      { goal: "Run a 5K without stopping", period: "One-year", action: "Start couch-to-5k program" },
      { goal: "Lose 10-15 lbs of body fat", period: "One-year", action: "Track calories daily" },
      { goal: "Build strength routine habit", period: "One-year", action: "Join gym or get equipment" },
      { goal: "Improve flexibility", period: "One-year", action: "10 min stretching daily" },
    ]
  },
  {
    id: 'wealth-builder',
    name: 'Wealth Builder',
    emoji: '💰',
    description: 'Build your financial foundation',
    category: 'Personal',
    goals: [
      { goal: "Build 3-month emergency fund", period: "One-year", action: "Set up auto-transfer $X/week" },
      { goal: "Max out retirement contributions", period: "One-year", action: "Increase 401k percentage" },
      { goal: "Pay off high-interest debt", period: "One-year", action: "List debts by interest rate" },
      { goal: "Create monthly budget and stick to it", period: "One-year", action: "Use budgeting app" },
      { goal: "Start investing regularly", period: "One-year", action: "Open brokerage account" },
      { goal: "Buy a house", period: "Three-years", action: "Save for down payment" },
    ]
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness & Wellness',
    emoji: '🧘',
    description: 'Prioritize mental health and inner peace',
    category: 'Personal',
    goals: [
      { goal: "Meditate 10 minutes daily", period: "One-year", action: "Download meditation app" },
      { goal: "Journal weekly reflections", period: "One-year", action: "Get a nice journal" },
      { goal: "Sleep 7-8 hours consistently", period: "One-year", action: "Set bedtime alarm" },
      { goal: "Reduce social media to 30 min/day", period: "One-year", action: "Set app limits" },
      { goal: "Practice daily gratitude", period: "One-year", action: "Write 3 things each morning" },
    ]
  },
  {
    id: 'relationships',
    name: 'Relationship Goals',
    emoji: '❤️',
    description: 'Strengthen connections with loved ones',
    category: 'Personal',
    goals: [
      { goal: "Weekly date night with partner", period: "One-year", action: "Schedule recurring date" },
      { goal: "Call parents/family weekly", period: "One-year", action: "Set Sunday reminder" },
      { goal: "Reconnect with 5 old friends", period: "One-year", action: "Reach out to 1 this week" },
      { goal: "Plan monthly quality time with kids", period: "One-year", action: "Book first activity" },
      { goal: "Host dinner party quarterly", period: "One-year", action: "Pick first date" },
    ]
  },
  {
    id: 'adventure',
    name: 'Adventure Seeker',
    emoji: '🌍',
    description: 'Experience new places and things',
    category: 'Personal',
    goals: [
      { goal: "Travel to 2 new countries", period: "One-year", action: "Research destinations" },
      { goal: "Take a solo trip", period: "One-year", action: "Pick dates and destination" },
      { goal: "Try 12 new restaurants", period: "One-year", action: "Make list of spots" },
      { goal: "Learn a new skill (surfing, skiing, etc)", period: "One-year", action: "Book first lesson" },
      { goal: "Complete a bucket list item", period: "One-year", action: "Write the list first!" },
    ]
  },
  // Professional Packs
  {
    id: 'career-growth',
    name: 'Career Growth',
    emoji: '📈',
    description: 'Level up in your career',
    category: 'Professional',
    goals: [
      { goal: "Get promoted to next level", period: "One-year", action: "Schedule chat with manager" },
      { goal: "Negotiate 10-15% raise", period: "One-year", action: "Document achievements" },
      { goal: "Build relationship with skip-level", period: "One-year", action: "Ask for coffee chat" },
      { goal: "Lead a high-visibility project", period: "One-year", action: "Volunteer for one" },
      { goal: "Get featured in company newsletter", period: "One-year", action: "Share a win story" },
    ]
  },
  {
    id: 'side-hustle',
    name: 'Side Hustle Starter',
    emoji: '🚀',
    description: 'Build income outside your 9-5',
    category: 'Professional',
    goals: [
      { goal: "Launch a side project", period: "One-year", action: "Brainstorm 10 ideas" },
      { goal: "Make first $1000 from side hustle", period: "One-year", action: "Pick one idea to pursue" },
      { goal: "Build audience (1000 followers)", period: "One-year", action: "Pick platform and start" },
      { goal: "Create a digital product", period: "One-year", action: "Outline what you'll make" },
      { goal: "Turn passion into income stream", period: "Three-years", action: "Define the passion" },
    ]
  },
  {
    id: 'learning',
    name: 'Continuous Learning',
    emoji: '📚',
    description: 'Never stop growing your skills',
    category: 'Professional',
    goals: [
      { goal: "Complete an industry certification", period: "One-year", action: "Research which one" },
      { goal: "Read 12 professional books", period: "One-year", action: "Pick first book" },
      { goal: "Take 3 online courses", period: "One-year", action: "Browse Coursera/Udemy" },
      { goal: "Learn new programming language/tool", period: "One-year", action: "Pick which one" },
      { goal: "Attend 2 industry conferences", period: "One-year", action: "Find relevant ones" },
    ]
  },
  {
    id: 'leadership',
    name: 'Leadership Track',
    emoji: '👔',
    description: 'Develop leadership capabilities',
    category: 'Professional',
    goals: [
      { goal: "Mentor 2 junior colleagues", period: "One-year", action: "Offer to help someone" },
      { goal: "Improve public speaking skills", period: "One-year", action: "Join Toastmasters" },
      { goal: "Give 3 presentations at work", period: "One-year", action: "Propose first topic" },
      { goal: "Build cross-functional relationships", period: "One-year", action: "Meet 5 new people" },
      { goal: "Lead a team project", period: "One-year", action: "Volunteer to lead" },
    ]
  },
  {
    id: 'work-life',
    name: 'Work-Life Balance',
    emoji: '⚖️',
    description: 'Reclaim your time and energy',
    category: 'Professional',
    goals: [
      { goal: "Leave work by 6pm every day", period: "One-year", action: "Set calendar block" },
      { goal: "Take all vacation days", period: "One-year", action: "Plan trips in advance" },
      { goal: "No work emails after 7pm", period: "One-year", action: "Remove email from phone" },
      { goal: "Reduce meetings by 25%", period: "One-year", action: "Audit calendar weekly" },
      { goal: "Take 1 mental health day/quarter", period: "One-year", action: "Schedule first one" },
    ]
  },
]
