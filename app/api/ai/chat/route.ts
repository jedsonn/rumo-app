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

    // Generate response with more tokens for bulk operations
    let response = await chat(messages, {
      temperature: 0.5, // Lower for more consistent formatting
      max_tokens: 4096, // More tokens for bulk operations
    })

    // Log raw response for debugging
    console.log('[Chat] Raw AI response:', response.substring(0, 500))

    // Track actions performed
    const actions: { type: string; success: boolean; data?: unknown }[] = []

    // 1. ADD GOALS (supports multiple)
    const addGoalMatches = [...response.matchAll(/\[ADD_GOAL\]([\s\S]*?)\[\/ADD_GOAL\]/g)]
    for (const match of addGoalMatches) {
      try {
        const goalData = JSON.parse(match[1].trim())
        const { data: existingGoals } = await supabase
          .from('goals')
          .select('number')
          .eq('user_id', user.id)
          .eq('category', goalData.category)
          .eq('year', new Date().getFullYear())
          .order('number', { ascending: false })
          .limit(1)

        const nextNumber = (existingGoals?.[0]?.number || 0) + 1 + actions.filter(a => a.type === 'add_goal' && a.success).length
        const { data: newGoal, error } = await supabase
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

        actions.push({ type: 'add_goal', success: !error, data: newGoal })
      } catch (err) {
        console.warn('Failed to add goal:', err)
      }
    }
    if (addGoalMatches.length > 0) {
      response = response.replace(/\[ADD_GOAL\][\s\S]*?\[\/ADD_GOAL\]\s*/g, '').trim()
    }

    // 2. DELETE GOALS (supports multiple)
    const deleteGoalMatches = [...response.matchAll(/\[DELETE_GOAL\]([\s\S]*?)\[\/DELETE_GOAL\]/g)]
    for (const match of deleteGoalMatches) {
      try {
        const { number, category } = JSON.parse(match[1].trim())
        const { error } = await supabase
          .from('goals')
          .delete()
          .eq('user_id', user.id)
          .eq('number', number)
          .eq('category', category)
          .eq('year', new Date().getFullYear())

        actions.push({ type: 'delete_goal', success: !error })
      } catch (err) {
        console.warn('Failed to delete goal:', err)
      }
    }
    if (deleteGoalMatches.length > 0) {
      response = response.replace(/\[DELETE_GOAL\][\s\S]*?\[\/DELETE_GOAL\]\s*/g, '').trim()
    }

    // 3. ADD BLESSINGS (supports multiple)
    const addBlessingMatches = [...response.matchAll(/\[ADD_BLESSING\]([\s\S]*?)\[\/ADD_BLESSING\]/g)]
    for (const match of addBlessingMatches) {
      try {
        const blessingData = JSON.parse(match[1].trim())
        const { data: newBlessing, error } = await supabase
          .from('blessings')
          .insert({
            user_id: user.id,
            text: blessingData.text,
            category: blessingData.category || 'Personal',
          })
          .select()
          .single()

        actions.push({ type: 'add_blessing', success: !error, data: newBlessing })
      } catch (err) {
        console.warn('Failed to add blessing:', err)
      }
    }
    if (addBlessingMatches.length > 0) {
      response = response.replace(/\[ADD_BLESSING\][\s\S]*?\[\/ADD_BLESSING\]\s*/g, '').trim()
    }

    // 4. DELETE BLESSINGS (supports multiple)
    const deleteBlessingMatches = [...response.matchAll(/\[DELETE_BLESSING\]([\s\S]*?)\[\/DELETE_BLESSING\]/g)]
    for (const match of deleteBlessingMatches) {
      try {
        const { text } = JSON.parse(match[1].trim())
        if (text === '*') {
          // Delete all blessings
          const { error } = await supabase
            .from('blessings')
            .delete()
            .eq('user_id', user.id)
          actions.push({ type: 'delete_all_blessings', success: !error })
        } else {
          // Delete by partial text match
          const { error } = await supabase
            .from('blessings')
            .delete()
            .eq('user_id', user.id)
            .ilike('text', `%${text}%`)
          actions.push({ type: 'delete_blessing', success: !error })
        }
      } catch (err) {
        console.warn('Failed to delete blessing:', err)
      }
    }
    if (deleteBlessingMatches.length > 0) {
      response = response.replace(/\[DELETE_BLESSING\][\s\S]*?\[\/DELETE_BLESSING\]\s*/g, '').trim()
    }

    // 5. ADD REWARDS (supports multiple)
    const addRewardMatches = [...response.matchAll(/\[ADD_REWARD\]([\s\S]*?)\[\/ADD_REWARD\]/g)]
    for (const match of addRewardMatches) {
      try {
        const rewardData = JSON.parse(match[1].trim())
        const { data: newReward, error } = await supabase
          .from('rewards')
          .insert({
            user_id: user.id,
            text: rewardData.text,
            cost: rewardData.cost || 0,
            earned: false,
          })
          .select()
          .single()

        actions.push({ type: 'add_reward', success: !error, data: newReward })
      } catch (err) {
        console.warn('Failed to add reward:', err)
      }
    }
    if (addRewardMatches.length > 0) {
      response = response.replace(/\[ADD_REWARD\][\s\S]*?\[\/ADD_REWARD\]\s*/g, '').trim()
    }

    // 6. DELETE REWARDS (supports multiple)
    const deleteRewardMatches = [...response.matchAll(/\[DELETE_REWARD\]([\s\S]*?)\[\/DELETE_REWARD\]/g)]
    for (const match of deleteRewardMatches) {
      try {
        const { text } = JSON.parse(match[1].trim())
        if (text === '*') {
          // Delete all rewards
          const { error } = await supabase
            .from('rewards')
            .delete()
            .eq('user_id', user.id)
          actions.push({ type: 'delete_all_rewards', success: !error })
        } else {
          // Delete by partial text match
          const { error } = await supabase
            .from('rewards')
            .delete()
            .eq('user_id', user.id)
            .ilike('text', `%${text}%`)
          actions.push({ type: 'delete_reward', success: !error })
        }
      } catch (err) {
        console.warn('Failed to delete reward:', err)
      }
    }
    if (deleteRewardMatches.length > 0) {
      response = response.replace(/\[DELETE_REWARD\][\s\S]*?\[\/DELETE_REWARD\]\s*/g, '').trim()
    }

    // Detect if AI claimed to add things but didn't actually output blocks
    const claimsAdded = /added|created|done|here.*(blessing|reward|goal)/i.test(response)
    const actuallyAdded = actions.filter(a => a.success).length

    // If AI claimed to add but didn't, append warning
    if (claimsAdded && actuallyAdded === 0) {
      console.warn('[Chat] AI claimed to add items but no action blocks found!')
      response = `⚠️ I tried but my response didn't include the proper action blocks. Let me try again properly:\n\nPlease repeat your request and I'll make sure to output the correct format.`
    } else if (actuallyAdded > 0) {
      // Add count of what was actually added
      const addedCount = actions.filter(a => a.type.startsWith('add_') && a.success).length
      if (addedCount > 0 && !response.includes('✅')) {
        response = `✅ Successfully added ${addedCount} item(s)!\n\n${response}`
      }
    }

    // Save assistant response to history (non-blocking)
    saveToChatHistory(supabase, user.id, 'assistant', response)

    // Check if any data-modifying action was performed
    const dataChanged = actions.length > 0

    console.log('[Chat] Actions performed:', actions.length, 'dataChanged:', dataChanged)

    return NextResponse.json({
      success: true,
      message: response,
      actions,
      dataChanged,
      debug: {
        rawResponseLength: response.length,
        actionBlocksFound: {
          goals: addGoalMatches.length,
          blessings: addBlessingMatches.length,
          rewards: addRewardMatches.length,
        }
      }
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
