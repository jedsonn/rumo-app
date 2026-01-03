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
    const { goalId } = body

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
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    // Fetch all goals for context
    const { data: allGoals } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)

    const context = formatSingleGoalContext(goal as Goal, (allGoals || []) as Goal[])

    // Generate subtasks using AI
    const prompt = getActionBreakerPrompt(goal.goal, goal.action, context)
    const response = await chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.7 })

    const parsed = parseJsonResponse<SubtaskResponse>(response)

    if (!parsed || !parsed.subtasks) {
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      )
    }

    // Format subtasks
    const subtasks: Subtask[] = parsed.subtasks.slice(0, 5).map(s => ({
      text: s.text,
      completed: false,
      estimated_time: s.estimated_time || '1 hour',
    }))

    // Update the goal with new subtasks
    const { data: updatedGoal, error: updateError } = await supabase
      .from('goals')
      .update({ subtasks })
      .eq('id', goalId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating goal:', updateError)
      return NextResponse.json(
        { error: 'Failed to save subtasks' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subtasks,
      goal: updatedGoal,
    })

  } catch (error) {
    console.error('Break action error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
