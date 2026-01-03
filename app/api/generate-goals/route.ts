import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { LifeStage, Priority, GoalPeriod, GoalCategory } from '@/lib/types'

interface GeneratedGoal {
  goal: string
  action: string
  period: GoalPeriod
  category: GoalCategory
}

interface RequestBody {
  lifeStage: LifeStage
  priorities: Priority[]
  year: number
}

const LIFE_STAGE_CONTEXT: Record<LifeStage, string> = {
  student: 'a student focused on education, skill-building, and preparing for their career',
  early_career: 'an early-career professional in their 20s-30s building their career and establishing financial stability',
  mid_career: 'a mid-career professional balancing career growth with family responsibilities',
  senior: 'a senior professional with significant experience, possibly mentoring others and planning for retirement',
  entrepreneur: 'an entrepreneur or business owner focused on building and growing their venture',
  retired: 'a retiree focused on health, fulfillment, legacy, and enjoying life',
}

const PRIORITY_CONTEXT: Record<Priority, string> = {
  career: 'career advancement, skills development, and professional growth',
  health: 'physical fitness, mental wellness, and healthy habits',
  family: 'relationships, family time, parenting, and social connections',
  finance: 'financial security, investing, saving, and wealth building',
  learning: 'education, reading, courses, and acquiring new knowledge',
  balance: 'work-life balance, stress management, and personal fulfillment',
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()
    const { lifeStage, priorities, year } = body

    if (!lifeStage || !priorities || priorities.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicKey) {
      // Return fallback goals if no API key
      return NextResponse.json({
        goals: generateFallbackGoals(lifeStage, priorities, year)
      })
    }

    const client = new Anthropic({ apiKey: anthropicKey })

    const lifeStageDesc = LIFE_STAGE_CONTEXT[lifeStage]
    const priorityDescs = priorities.map(p => PRIORITY_CONTEXT[p]).join(', ')

    const prompt = `Generate 12 personalized New Year's resolutions/goals for ${year} for someone who is ${lifeStageDesc}.

Their top priorities are: ${priorityDescs}

Requirements:
- Generate exactly 12 goals total
- Split evenly: 6 Personal goals and 6 Professional goals
- Mix of time horizons: some One-year (achievable this year), some Three-years (medium-term), some Five-years (long-term aspirations)
- Each goal should be specific, measurable, and actionable
- Include a brief key action step for each goal
- Make goals realistic but aspirational

Respond with ONLY a valid JSON array, no other text. Each object must have:
- goal: string (the goal statement, 10-15 words max)
- action: string (one key action to start, 5-10 words)
- period: "One-year" | "Three-years" | "Five-years"
- category: "Personal" | "Professional"

Example format:
[{"goal": "Run a half marathon", "action": "Start with a 5K training plan", "period": "One-year", "category": "Personal"}]`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    // Extract text content
    const textContent = message.content.find(c => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response')
    }

    // Parse JSON from response
    const jsonMatch = textContent.text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('No JSON array found in response')
    }

    const goals: GeneratedGoal[] = JSON.parse(jsonMatch[0])

    // Validate goals
    const validGoals = goals.filter(g =>
      g.goal &&
      g.action &&
      ['One-year', 'Three-years', 'Five-years'].includes(g.period) &&
      ['Personal', 'Professional'].includes(g.category)
    )

    return NextResponse.json({ goals: validGoals })
  } catch (error) {
    console.error('Error generating goals:', error)
    // Return fallback goals on error
    return NextResponse.json({
      goals: generateFallbackGoals('early_career', ['career', 'health'], new Date().getFullYear())
    })
  }
}

// Fallback goals when API is unavailable
function generateFallbackGoals(lifeStage: LifeStage, priorities: Priority[], year: number): GeneratedGoal[] {
  const allGoals: GeneratedGoal[] = [
    // Health goals
    { goal: 'Exercise regularly 3-4 times per week', action: 'Join a gym or start home workouts', period: 'One-year', category: 'Personal' },
    { goal: 'Improve sleep quality to 7-8 hours nightly', action: 'Establish a consistent bedtime routine', period: 'One-year', category: 'Personal' },
    { goal: 'Complete a fitness challenge or race', action: 'Sign up for a local 5K event', period: 'One-year', category: 'Personal' },

    // Career goals
    { goal: 'Get promoted or advance to next level', action: 'Schedule a career chat with manager', period: 'One-year', category: 'Professional' },
    { goal: 'Learn a new valuable skill or certification', action: 'Research top skills in your field', period: 'One-year', category: 'Professional' },
    { goal: 'Build a stronger professional network', action: 'Attend one industry event monthly', period: 'One-year', category: 'Professional' },

    // Finance goals
    { goal: 'Build 6-month emergency fund', action: 'Set up automatic savings transfers', period: 'One-year', category: 'Personal' },
    { goal: 'Increase income by 20%', action: 'Identify side income opportunities', period: 'Three-years', category: 'Professional' },

    // Learning goals
    { goal: 'Read 24 books this year', action: 'Start with 30 minutes daily reading', period: 'One-year', category: 'Personal' },
    { goal: 'Master a new language to conversational level', action: 'Download a language learning app', period: 'Three-years', category: 'Personal' },

    // Balance goals
    { goal: 'Take meaningful vacations and time off', action: 'Plan and book first trip', period: 'One-year', category: 'Personal' },
    { goal: 'Develop a consistent morning routine', action: 'Wake up 30 minutes earlier', period: 'One-year', category: 'Personal' },

    // Family goals
    { goal: 'Strengthen key relationships in my life', action: 'Schedule weekly quality time', period: 'One-year', category: 'Personal' },
    { goal: 'Be more present with family and friends', action: 'Create phone-free dinner rule', period: 'One-year', category: 'Personal' },

    // Long-term aspirational
    { goal: 'Achieve financial independence', action: 'Calculate your FI number', period: 'Five-years', category: 'Personal' },
    { goal: 'Build a legacy project or business', action: 'Write down your vision', period: 'Five-years', category: 'Professional' },
  ]

  // Filter and prioritize based on user preferences
  const priorityKeywords: Record<Priority, string[]> = {
    career: ['promoted', 'skill', 'network', 'income', 'professional'],
    health: ['exercise', 'sleep', 'fitness', 'wellness'],
    family: ['relationships', 'family', 'friends', 'present'],
    finance: ['emergency', 'income', 'financial', 'savings'],
    learning: ['read', 'language', 'learn', 'skill'],
    balance: ['vacation', 'routine', 'present', 'time off'],
  }

  // Score goals based on priority match
  const scoredGoals = allGoals.map(goal => {
    let score = 0
    priorities.forEach(priority => {
      const keywords = priorityKeywords[priority]
      if (keywords.some(kw => goal.goal.toLowerCase().includes(kw) || goal.action.toLowerCase().includes(kw))) {
        score += 2
      }
    })
    return { ...goal, score }
  })

  // Sort by score and take top 12
  scoredGoals.sort((a, b) => b.score - a.score)
  return scoredGoals.slice(0, 12).map(({ score, ...goal }) => goal)
}
