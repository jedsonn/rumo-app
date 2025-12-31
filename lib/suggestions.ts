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
