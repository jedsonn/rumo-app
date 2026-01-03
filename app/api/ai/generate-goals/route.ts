import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { chat, parseJsonResponse } from '@/lib/ai/deepseek'
import { getOnboardingPrompt } from '@/lib/ai/prompts'
import { GoalPeriod } from '@/lib/types'

interface GeneratedGoal {
  goal: string
  period: GoalPeriod
  action: string
}

interface GeneratedGoalsResponse {
  personal: GeneratedGoal[]
  professional: GeneratedGoal[]
}

export async function POST(request: NextRequest) {
  try {
    // Check API key first
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('DEEPSEEK_API_KEY is not configured')
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      )
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { lifeStage, priorities } = body

    if (!lifeStage || !priorities || !Array.isArray(priorities)) {
      return NextResponse.json(
        { error: 'Missing lifeStage or priorities' },
        { status: 400 }
      )
    }

    // Generate goals using AI
    const prompt = getOnboardingPrompt(lifeStage, priorities)
    const response = await chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.8 })

    const parsed = parseJsonResponse<GeneratedGoalsResponse>(response)

    if (!parsed || !parsed.personal || !parsed.professional) {
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      )
    }

    // Validate periods
    const validPeriods: GoalPeriod[] = ['One-year', 'Three-years', 'Five-years']
    const validatePeriod = (p: string): GoalPeriod => {
      if (validPeriods.includes(p as GoalPeriod)) return p as GoalPeriod
      return 'One-year'
    }

    // Format goals for insertion
    const currentYear = new Date().getFullYear()

    const personalGoals = parsed.personal.slice(0, 6).map((g, i) => ({
      user_id: user.id,
      number: i + 1,
      year: currentYear,
      goal: g.goal,
      period: validatePeriod(g.period),
      category: 'Personal' as const,
      status: 'Doing' as const,
      action: g.action || null,
      cost: 0,
      pinned: false,
      is_ai_generated: true,
    }))

    const professionalGoals = parsed.professional.slice(0, 6).map((g, i) => ({
      user_id: user.id,
      number: i + 1,
      year: currentYear,
      goal: g.goal,
      period: validatePeriod(g.period),
      category: 'Professional' as const,
      status: 'Doing' as const,
      action: g.action || null,
      cost: 0,
      pinned: false,
      is_ai_generated: true,
    }))

    // Insert goals
    const { data: insertedGoals, error: insertError } = await supabase
      .from('goals')
      .insert([...personalGoals, ...professionalGoals])
      .select()

    if (insertError) {
      console.error('Error inserting goals:', insertError)
      return NextResponse.json(
        { error: 'Failed to save goals' },
        { status: 500 }
      )
    }

    // Update profile to mark onboarding complete
    await supabase
      .from('profiles')
      .update({
        ai_onboarding_completed: true,
        life_stage: lifeStage,
        priorities: priorities,
      })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      goals: insertedGoals,
      count: insertedGoals?.length || 0,
    })

  } catch (error) {
    console.error('Generate goals error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
