import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { chat, parseJsonResponse } from '@/lib/ai/deepseek'
import { getActionBreakerPrompt } from '@/lib/ai/prompts'
import { formatSingleGoalContext } from '@/lib/ai/context'
import { Goal, Subtask } from '@/lib/types'

interface SubtaskResponse {
  subtasks: {
    text: string
    estimated_time: string
  }[]
}

export async function POST(request: NextRequest) {
  try {
    console.log('[break-action] Starting request')

    // Check API key first
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('[break-action] DEEPSEEK_API_KEY is not configured')
      return NextResponse.json(
        { error: 'AI service not configured. Please add DEEPSEEK_API_KEY to your environment.' },
        { status: 503 }
      )
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('[break-action] No user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { goalId } = body
    console.log('[break-action] Goal ID:', goalId)

    if (!goalId) {
      return NextResponse.json(
        { error: 'Missing goalId' },
        { status: 400 }
      )
    }

    // Fetch the goal
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('*')
      .eq('id', goalId)
      .eq('user_id', user.id)
      .single()

    if (goalError || !goal) {
      console.error('[break-action] Goal not found:', goalError)
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    console.log('[break-action] Found goal:', goal.goal)

    // Fetch all goals for context
    const { data: allGoals } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)

    const context = formatSingleGoalContext(goal as Goal, (allGoals || []) as Goal[])

    // Generate subtasks using AI
    const prompt = getActionBreakerPrompt(goal.goal, goal.action, context)
    console.log('[break-action] Sending to AI...')

    const response = await chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.7 })

    console.log('[break-action] AI response received:', response.substring(0, 200))

    const parsed = parseJsonResponse<SubtaskResponse>(response)

    if (!parsed || !parsed.subtasks) {
      console.error('[break-action] Failed to parse response:', response)
      return NextResponse.json(
        { error: 'Failed to parse AI response. The AI returned invalid data.' },
        { status: 500 }
      )
    }

    // Format subtasks
    const subtasks: Subtask[] = parsed.subtasks.slice(0, 5).map(s => ({
      text: s.text,
      completed: false,
      estimated_time: s.estimated_time || '1 hour',
    }))

    console.log('[break-action] Generated subtasks:', subtasks)

    // Update the goal with new subtasks
    const { data: updatedGoal, error: updateError } = await supabase
      .from('goals')
      .update({ subtasks })
      .eq('id', goalId)
      .select()
      .single()

    if (updateError) {
      console.error('[break-action] Error updating goal:', updateError)
      return NextResponse.json(
        { error: 'Failed to save subtasks to database' },
        { status: 500 }
      )
    }

    console.log('[break-action] Success! Updated goal with subtasks')

    return NextResponse.json({
      success: true,
      subtasks,
      goal: updatedGoal,
    })

  } catch (error) {
    console.error('[break-action] Unexpected error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
