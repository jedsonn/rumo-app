import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { chat, ChatMessage } from '@/lib/ai/deepseek'
import { getChatCoachSystemPrompt } from '@/lib/ai/prompts'
import { formatGoalsForChatCoach } from '@/lib/ai/context'
import { Goal } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
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

    // Fetch recent chat history (last 10 messages)
    const { data: chatHistory } = await supabase
      .from('ai_chat_history')
      .select('role, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(10)

    // Build messages array
    const systemPrompt = getChatCoachSystemPrompt(goalsContext, userName)
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
    ]

    // Add chat history
    if (chatHistory) {
      chatHistory.forEach(msg => {
        messages.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })
      })
    }

    // Add current message
    messages.push({ role: 'user', content: message })

    // Save user message to history
    await supabase.from('ai_chat_history').insert({
      user_id: user.id,
      role: 'user',
      content: message,
    })

    // Generate response
    const response = await chat(messages, {
      temperature: 0.7,
      max_tokens: 1024,
    })

    // Save assistant response to history
    await supabase.from('ai_chat_history').insert({
      user_id: user.id,
      role: 'assistant',
      content: response,
    })

    return NextResponse.json({
      success: true,
      message: response,
    })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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
