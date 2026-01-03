import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { chat, parseJsonResponse } from '@/lib/ai/deepseek'
import { getGoalRefinementPrompt } from '@/lib/ai/prompts'

interface RefinementResponse {
  is_vague: boolean
  reason: string
  smart_suggestion: string | null
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
    const { goalId, goalText, category } = body

    if (!goalText || !category) {
      return NextResponse.json(
        { error: 'Missing goalText or category' },
        { status: 400 }
      )
    }

    // Generate refinement suggestion using AI
    const prompt = getGoalRefinementPrompt(goalText, category)
    const response = await chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.3 }) // Lower temperature for more consistent evaluation

    const parsed = parseJsonResponse<RefinementResponse>(response)

    if (!parsed) {
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      )
    }

    // If goalId provided, update the goal in database
    if (goalId) {
      const { error: updateError } = await supabase
        .from('goals')
        .update({
          is_vague: parsed.is_vague,
          ai_refinement_suggestion: parsed.smart_suggestion,
        })
        .eq('id', goalId)
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Error updating goal:', updateError)
      }
    }

    return NextResponse.json({
      success: true,
      is_vague: parsed.is_vague,
      reason: parsed.reason,
      suggestion: parsed.smart_suggestion,
    })

  } catch (error) {
    console.error('Refine goal error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Batch refinement check for multiple goals
export async function PUT(request: NextRequest) {
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

    // Fetch all goals that haven't been checked yet
    const { data: goals } = await supabase
      .from('goals')
      .select('id, goal, category')
      .eq('user_id', user.id)
      .is('ai_refinement_suggestion', null)
      .neq('status', 'Done')
      .neq('status', 'Dropped')
      .limit(5) // Process 5 at a time to avoid timeout

    if (!goals || goals.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No goals to check',
        checked: 0,
      })
    }

    const results: { id: string; is_vague: boolean }[] = []

    for (const goal of goals) {
      try {
        const prompt = getGoalRefinementPrompt(goal.goal, goal.category)
        const response = await chat([
          { role: 'user', content: prompt }
        ], { temperature: 0.3 })

        const parsed = parseJsonResponse<RefinementResponse>(response)

        if (parsed) {
          await supabase
            .from('goals')
            .update({
              is_vague: parsed.is_vague,
              ai_refinement_suggestion: parsed.smart_suggestion,
            })
            .eq('id', goal.id)

          results.push({ id: goal.id, is_vague: parsed.is_vague })
        }
      } catch (err) {
        console.error(`Error checking goal ${goal.id}:`, err)
      }
    }

    return NextResponse.json({
      success: true,
      checked: results.length,
      results,
    })

  } catch (error) {
    console.error('Batch refine error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
