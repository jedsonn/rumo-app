import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { chat, ChatMessage } from '@/lib/ai/deepseek'
import { getChatCoachSystemPrompt } from '@/lib/ai/prompts'
import { formatGoalsForChatCoach } from '@/lib/ai/context'
import { Goal } from '@/lib/types'

// Helper to safely save to chat history (table may not exist)
async function saveToChatHistory(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  role: 'user' | 'assistant',
  content: string
) {
  try {
    await supabase.from('ai_chat_history').insert({
      user_id: userId,
      role,
      content,
    })
  } catch (err) {
    // Table might not exist - log but don't fail
    console.warn('Could not save to chat history:', err)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check API key first
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('DEEPSEEK_API_KEY is not configured')
      return NextResponse.json(
        { error: 'AI service not configured. Please add DEEPSEEK_API_KEY to environment.' },
        { status: 503 }
      )
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Missing message' },
        { status: 400 }
      )
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()

    const userName = profile?.display_name || 'there'

    // Fetch all goals for context
    const { data: goals } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const goalsContext = formatGoalsForChatCoach((goals || []) as Goal[])

    // Try to fetch recent chat history (table may not exist)
    let chatHistory: { role: string; content: string }[] = []
    try {
      const { data } = await supabase
        .from('ai_chat_history')
        .select('role, content')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(10)
      chatHistory = data || []
    } catch (err) {
      console.warn('Could not fetch chat history:', err)
    }

    // Build messages array
    const systemPrompt = getChatCoachSystemPrompt(goalsContext, userName)
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
    ]

    // Add chat history
    chatHistory.forEach(msg => {
      messages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })
    })

    // Add current message
    messages.push({ role: 'user', content: message })

    // Save user message to history (non-blocking)
    saveToChatHistory(supabase, user.id, 'user', message)

    // Generate response
    let response = await chat(messages, {
      temperature: 0.7,
      max_tokens: 1024,
    })

    // Check if AI wants to add a goal
    let addedGoal = null
    const addGoalMatch = response.match(/\[ADD_GOAL\]([\s\S]*?)\[\/ADD_GOAL\]/)
    if (addGoalMatch) {
      try {
        const goalData = JSON.parse(addGoalMatch[1].trim())

        // Get next goal number for this category
        const { data: existingGoals } = await supabase
          .from('goals')
          .select('number')
          .eq('user_id', user.id)
          .eq('category', goalData.category)
          .eq('year', new Date().getFullYear())
          .order('number', { ascending: false })
          .limit(1)

        const nextNumber = (existingGoals?.[0]?.number || 0) + 1

        // Create the goal
        const { data: newGoal, error: goalError } = await supabase
          .from('goals')
          .insert({
            user_id: user.id,
            goal: goalData.goal,
            category: goalData.category || 'Personal',
            period: goalData.period || 'One-year',
            status: 'Doing',
            number: nextNumber,
            year: new Date().getFullYear(),
            is_ai_generated: true,
          })
          .select()
          .single()

        if (!goalError && newGoal) {
          addedGoal = newGoal
        }

        // Remove the [ADD_GOAL] block from response shown to user
        response = response.replace(/\[ADD_GOAL\][\s\S]*?\[\/ADD_GOAL\]\s*/g, '').trim()
      } catch (err) {
        console.warn('Failed to parse/create goal from AI response:', err)
      }
    }

    // Save assistant response to history (non-blocking)
    saveToChatHistory(supabase, user.id, 'assistant', response)

    return NextResponse.json({
      success: true,
      message: response,
      addedGoal,
    })

  } catch (error) {
    console.error('Chat error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Return specific error message for debugging
    return NextResponse.json(
      { error: `Chat failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}

// Clear chat history
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await supabase
      .from('ai_chat_history')
      .delete()
      .eq('user_id', user.id)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Clear chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get chat history
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: chatHistory } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    return NextResponse.json({
      success: true,
      messages: chatHistory || [],
    })

  } catch (error) {
    console.error('Get chat history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
