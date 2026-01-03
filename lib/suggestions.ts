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

// Life stage based template packs
export interface LifeStageTemplatePack extends TemplatePack {
  lifeStage: string
}

export const LIFE_STAGE_TEMPLATES: LifeStageTemplatePack[] = [
  {
    id: 'student-success',
    name: 'Student Success',
    emoji: '🎓',
    description: 'Excel academically while building life skills',
    category: 'Personal',
    lifeStage: 'Student',
    goals: [
      { goal: "Maintain GPA above 3.5", period: "One-year", action: "Create study schedule" },
      { goal: "Build professional network (10 contacts)", period: "One-year", action: "Attend campus events" },
      { goal: "Complete internship or research position", period: "One-year", action: "Apply to 10 opportunities" },
      { goal: "Learn time management system", period: "One-year", action: "Try pomodoro technique" },
      { goal: "Build emergency savings ($1000)", period: "One-year", action: "Get part-time job" },
      { goal: "Join student organization leadership", period: "One-year", action: "Run for position" },
      { goal: "Develop healthy sleep schedule", period: "One-year", action: "Set consistent bedtime" },
      { goal: "Learn to cook 10 basic meals", period: "One-year", action: "Start with pasta dishes" },
      { goal: "Exercise 3x per week", period: "One-year", action: "Use campus gym" },
      { goal: "Read 12 non-academic books", period: "One-year", action: "Join book club" },
      { goal: "Build professional online presence", period: "One-year", action: "Create LinkedIn profile" },
      { goal: "Develop public speaking skills", period: "One-year", action: "Present in class" },
      { goal: "Learn basic budgeting", period: "One-year", action: "Track expenses for a month" },
      { goal: "Make 3 close friendships", period: "One-year", action: "Join study groups" },
      { goal: "Explore career interests", period: "One-year", action: "Do 3 informational interviews" },
      { goal: "Build portfolio or resume", period: "One-year", action: "Document all projects" },
      { goal: "Learn a practical skill (Excel, coding, etc)", period: "One-year", action: "Take free online course" },
      { goal: "Reduce social media to 1 hr/day", period: "One-year", action: "Set app limits" },
      { goal: "Volunteer for a cause", period: "One-year", action: "Find local opportunity" },
      { goal: "Plan post-graduation path", period: "One-year", action: "Research options" },
    ]
  },
  {
    id: 'young-parent',
    name: 'Young Parent Balance',
    emoji: '👶',
    description: 'Thrive as a parent while maintaining yourself',
    category: 'Personal',
    lifeStage: 'Parent with Young Kids',
    goals: [
      { goal: "Establish consistent bedtime routine for kids", period: "One-year", action: "Create routine chart" },
      { goal: "Weekly date night with partner", period: "One-year", action: "Arrange regular babysitter" },
      { goal: "30 min daily self-care time", period: "One-year", action: "Wake up 30 min earlier" },
      { goal: "Build emergency fund (3 months)", period: "One-year", action: "Automate savings" },
      { goal: "Start kids' education savings", period: "One-year", action: "Open 529 account" },
      { goal: "Create will and life insurance", period: "One-year", action: "Research options" },
      { goal: "Maintain friendships (monthly hangout)", period: "One-year", action: "Schedule recurring plans" },
      { goal: "Exercise 3x per week (even 20 min)", period: "One-year", action: "Try home workouts" },
      { goal: "Read 6 parenting books", period: "One-year", action: "Pick first book" },
      { goal: "Meal prep Sundays", period: "One-year", action: "Plan weekly menu" },
      { goal: "Quality 1-on-1 time with each kid weekly", period: "One-year", action: "Schedule it" },
      { goal: "Document family memories monthly", period: "One-year", action: "Create photo album" },
      { goal: "Reduce screen time for whole family", period: "One-year", action: "Create family media rules" },
      { goal: "Plan quarterly family adventures", period: "One-year", action: "Book first trip" },
      { goal: "Establish chore system for kids", period: "One-year", action: "Create reward chart" },
      { goal: "Sleep 7+ hours consistently", period: "One-year", action: "Set non-negotiable bedtime" },
      { goal: "Maintain career growth", period: "One-year", action: "Discuss with manager" },
      { goal: "Connect with other parents", period: "One-year", action: "Join parent group" },
      { goal: "Regular health checkups for family", period: "One-year", action: "Schedule all appointments" },
      { goal: "Create family traditions", period: "One-year", action: "Pick 3 to start" },
    ]
  },
  {
    id: 'career-changer',
    name: 'Career Transition',
    emoji: '🔄',
    description: 'Successfully pivot to a new career path',
    category: 'Professional',
    lifeStage: 'Career Changer',
    goals: [
      { goal: "Identify target industry and role", period: "One-year", action: "Research 5 options" },
      { goal: "Complete relevant certification", period: "One-year", action: "Research requirements" },
      { goal: "Build portfolio showcasing transferable skills", period: "One-year", action: "Start documenting work" },
      { goal: "Network with 20 people in target field", period: "One-year", action: "Reach out to 2/month" },
      { goal: "Take 3 courses in new field", period: "One-year", action: "Enroll in first one" },
      { goal: "Get freelance/contract experience", period: "One-year", action: "Find first project" },
      { goal: "Update LinkedIn for new career", period: "One-year", action: "Rewrite headline and summary" },
      { goal: "Save 6 months expenses for transition", period: "One-year", action: "Calculate target amount" },
      { goal: "Find mentor in target industry", period: "One-year", action: "Identify potential mentors" },
      { goal: "Attend 4 industry events/conferences", period: "One-year", action: "Find relevant events" },
      { goal: "Build new professional network", period: "One-year", action: "Join industry groups" },
      { goal: "Create transition timeline", period: "One-year", action: "Set target switch date" },
      { goal: "Practice interviewing for new role", period: "One-year", action: "Do mock interviews" },
      { goal: "Develop missing technical skills", period: "One-year", action: "List skill gaps" },
      { goal: "Get informational interviews (10+)", period: "One-year", action: "Reach out this week" },
      { goal: "Build personal brand in new field", period: "One-year", action: "Start sharing content" },
      { goal: "Apply to 50+ relevant positions", period: "One-year", action: "Set weekly application goal" },
      { goal: "Negotiate competitive salary in new role", period: "One-year", action: "Research market rates" },
      { goal: "Create compelling career change story", period: "One-year", action: "Write your narrative" },
      { goal: "Land new role in target field", period: "One-year", action: "Start applying!" },
    ]
  },
  {
    id: 'entrepreneur-starter',
    name: 'Entrepreneur Launch',
    emoji: '🚀',
    description: 'Build and launch your own business',
    category: 'Professional',
    lifeStage: 'Entrepreneur',
    goals: [
      { goal: "Validate business idea with 50 potential customers", period: "One-year", action: "Create survey/interviews" },
      { goal: "Build MVP or first product version", period: "One-year", action: "Define minimum features" },
      { goal: "Get first 10 paying customers", period: "One-year", action: "Launch soft beta" },
      { goal: "Generate $10K in revenue", period: "One-year", action: "Set pricing strategy" },
      { goal: "Build founding team or key hire", period: "One-year", action: "Define roles needed" },
      { goal: "Create legal structure (LLC, etc)", period: "One-year", action: "Consult lawyer" },
      { goal: "Build 6 months personal runway", period: "One-year", action: "Calculate burn rate" },
      { goal: "Develop marketing strategy", period: "One-year", action: "Pick 2 channels to test" },
      { goal: "Build audience (1000 followers)", period: "One-year", action: "Pick platform and post daily" },
      { goal: "Create brand and website", period: "One-year", action: "Design logo and site" },
      { goal: "Set up business finances", period: "One-year", action: "Open business bank account" },
      { goal: "Find mentor or join accelerator", period: "One-year", action: "Research programs" },
      { goal: "Pitch to 10 potential investors (if needed)", period: "One-year", action: "Create pitch deck" },
      { goal: "Build customer feedback loop", period: "One-year", action: "Set up feedback system" },
      { goal: "Achieve product-market fit signals", period: "One-year", action: "Define success metrics" },
      { goal: "Network with 30 entrepreneurs", period: "One-year", action: "Join founder communities" },
      { goal: "Create scalable processes", period: "One-year", action: "Document all workflows" },
      { goal: "Balance business with personal life", period: "One-year", action: "Set work boundaries" },
      { goal: "Learn from 3 failed experiments", period: "One-year", action: "Document learnings" },
      { goal: "Plan 3-year business roadmap", period: "One-year", action: "Create strategic plan" },
    ]
  },
  {
    id: 'empty-nester',
    name: 'Empty Nest Reinvention',
    emoji: '🦋',
    description: 'Rediscover yourself after kids leave home',
    category: 'Personal',
    lifeStage: 'Empty Nester',
    goals: [
      { goal: "Pursue hobby you put aside for years", period: "One-year", action: "Pick one and start" },
      { goal: "Plan dream vacation with partner", period: "One-year", action: "Research destinations" },
      { goal: "Reconnect with old friends", period: "One-year", action: "Reach out to 5 people" },
      { goal: "Downsize and declutter home", period: "One-year", action: "One room per month" },
      { goal: "Review and optimize retirement plan", period: "One-year", action: "Meet financial advisor" },
      { goal: "Take up new fitness activity", period: "One-year", action: "Try golf, tennis, yoga" },
      { goal: "Learn something completely new", period: "One-year", action: "Take a class" },
      { goal: "Volunteer for meaningful cause", period: "One-year", action: "Find organization" },
      { goal: "Strengthen relationship with adult kids", period: "One-year", action: "Schedule regular calls" },
      { goal: "Join new social groups", period: "One-year", action: "Find local clubs" },
      { goal: "Travel to 3 new places", period: "One-year", action: "Make bucket list" },
      { goal: "Improve health with regular checkups", period: "One-year", action: "Schedule screenings" },
      { goal: "Explore part-time or consulting work", period: "One-year", action: "Update skills" },
      { goal: "Write memoir or family history", period: "One-year", action: "Start with outline" },
      { goal: "Develop daily wellness routine", period: "One-year", action: "Morning ritual" },
      { goal: "Host gatherings at home", period: "One-year", action: "Plan monthly dinners" },
      { goal: "Learn new technology skills", period: "One-year", action: "Take tech class" },
      { goal: "Create budget for new lifestyle", period: "One-year", action: "Review expenses" },
      { goal: "Mentor young professionals", period: "One-year", action: "Offer to help" },
      { goal: "Plan for legacy and estate", period: "One-year", action: "Update will" },
    ]
  },
]

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
      { goal: "Improve flexibility with daily stretching", period: "One-year", action: "10 min stretching daily" },
      { goal: "Drink 8 glasses of water daily", period: "One-year", action: "Get large water bottle" },
      { goal: "Get 7-8 hours of sleep consistently", period: "One-year", action: "Set bedtime alarm" },
      { goal: "Meal prep healthy lunches", period: "One-year", action: "Plan Sunday prep" },
      { goal: "Reduce sugar intake significantly", period: "One-year", action: "Track sugar consumption" },
      { goal: "Do 50 pushups in one set", period: "One-year", action: "Start pushup progression" },
      { goal: "Walk 10,000 steps daily", period: "One-year", action: "Get step tracker" },
      { goal: "Complete a fitness challenge", period: "One-year", action: "Pick 30-day challenge" },
      { goal: "Try 5 new workout classes", period: "One-year", action: "Research local options" },
      { goal: "Run a 10K race", period: "One-year", action: "Find local race" },
      { goal: "Learn proper form for all exercises", period: "One-year", action: "Hire trainer for session" },
      { goal: "Build morning exercise habit", period: "One-year", action: "Lay out clothes night before" },
      { goal: "Track workouts consistently", period: "One-year", action: "Use fitness app" },
      { goal: "Achieve target body measurements", period: "One-year", action: "Take baseline measurements" },
      { goal: "Do yoga weekly", period: "One-year", action: "Find yoga class or videos" },
      { goal: "Run a half marathon", period: "Three-years", action: "Find training plan" },
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
