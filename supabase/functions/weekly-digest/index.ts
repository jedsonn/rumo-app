// Weekly Digest Edge Function
// Deploy with: supabase functions deploy weekly-digest
// Schedule with: supabase cron or external scheduler (Sunday at 9am)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

interface WeekSummary {
  completed: number
  inProgress: number
  newGoals: number
  totalGoals: number
  completedGoals: string[]
  stuckGoals: string[]
}

async function generateDigestContent(
  userName: string,
  weekSummary: WeekSummary,
  apiKey: string
): Promise<string> {
  const prompt = `You are writing a brief, encouraging weekly progress email for ${userName}.

THIS WEEK'S STATS:
- Goals completed this week: ${weekSummary.completed}
- Goals in progress: ${weekSummary.inProgress}
- New goals added: ${weekSummary.newGoals}
- Total active goals: ${weekSummary.totalGoals}

COMPLETED THIS WEEK:
${weekSummary.completedGoals.length > 0 ? weekSummary.completedGoals.map(g => `- ${g}`).join('\n') : '- None yet'}

GOALS THAT MIGHT NEED ATTENTION:
${weekSummary.stuckGoals.length > 0 ? weekSummary.stuckGoals.map(g => `- ${g}`).join('\n') : '- All goals on track!'}

Write a brief, personalized weekly digest (3-4 short paragraphs) that:
1. Celebrates any wins (even small ones)
2. Gently highlights goals that might need attention
3. Offers one specific tip or encouragement
4. Ends with a motivating note for the week ahead

Keep it warm, personal, and actionable. Use the person's name.`

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  })

  if (!response.ok) {
    throw new Error(`Deepseek API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content ?? ''
}

Deno.serve(async (req) => {
  try {
    // Only allow POST requests (from cron) or manual trigger with auth
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY')!

    if (!deepseekApiKey) {
      return new Response('DEEPSEEK_API_KEY not configured', { status: 500 })
    }

    // Create admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get users who have email digest enabled
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, display_name, last_digest_sent_at')
      .eq('email_digest_enabled', true)

    if (usersError) {
      throw usersError
    }

    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ message: 'No users with digest enabled' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const results: { userId: string; success: boolean; error?: string }[] = []
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    for (const user of users) {
      try {
        // Check if digest was already sent this week
        if (user.last_digest_sent_at) {
          const lastSent = new Date(user.last_digest_sent_at)
          if (lastSent >= oneWeekAgo) {
            results.push({ userId: user.id, success: true, error: 'Already sent this week' })
            continue
          }
        }

        // Get user's goals
        const { data: goals } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)

        if (!goals || goals.length === 0) {
          results.push({ userId: user.id, success: true, error: 'No goals' })
          continue
        }

        // Calculate week summary
        const activeGoals = goals.filter(g => g.status !== 'Dropped')
        const completedThisWeek = goals.filter(g =>
          g.status === 'Done' &&
          new Date(g.updated_at) >= oneWeekAgo
        )
        const threeWeeksAgo = new Date()
        threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21)
        const stuckGoals = goals.filter(g =>
          ['Doing', 'On Track'].includes(g.status) &&
          new Date(g.updated_at) < threeWeeksAgo
        )
        const newGoals = goals.filter(g =>
          new Date(g.created_at) >= oneWeekAgo
        )

        const weekSummary: WeekSummary = {
          completed: completedThisWeek.length,
          inProgress: goals.filter(g => ['Doing', 'On Track'].includes(g.status)).length,
          newGoals: newGoals.length,
          totalGoals: activeGoals.length,
          completedGoals: completedThisWeek.map(g => g.goal),
          stuckGoals: stuckGoals.slice(0, 3).map(g => g.goal),
        }

        // Generate personalized digest content
        const userName = user.display_name || user.email.split('@')[0]
        const digestContent = await generateDigestContent(userName, weekSummary, deepseekApiKey)

        // Send email using Supabase Auth email (or your preferred method)
        // For now, we'll use Supabase's built-in email via auth.admin
        const { error: emailError } = await supabase.auth.admin.sendRawEmail({
          email: user.email,
          subject: `🎯 Your Weekly Goals Digest - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          body: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 12px; margin-bottom: 20px; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .stats { display: flex; justify-content: space-around; margin: 20px 0; padding: 15px; background: #f1f5f9; border-radius: 8px; }
    .stat { text-align: center; }
    .stat-value { font-size: 28px; font-weight: bold; color: #3b82f6; }
    .stat-label { font-size: 12px; color: #64748b; }
    .content { padding: 20px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; }
    .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎯 Weekly Goals Digest</h1>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="stat-value">${weekSummary.completed}</div>
      <div class="stat-label">Completed</div>
    </div>
    <div class="stat">
      <div class="stat-value">${weekSummary.inProgress}</div>
      <div class="stat-label">In Progress</div>
    </div>
    <div class="stat">
      <div class="stat-value">${weekSummary.totalGoals}</div>
      <div class="stat-label">Total Goals</div>
    </div>
  </div>

  <div class="content">
    ${digestContent.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('')}
  </div>

  <div class="footer">
    <p>Keep crushing your goals! 💪</p>
    <p><a href="${Deno.env.get('APP_URL') || 'https://myresolve.app'}" style="color: #3b82f6;">Open MyResolve</a></p>
  </div>
</body>
</html>
          `,
        })

        if (emailError) {
          // Fallback: Try using Supabase's auth email template
          console.error('Email error:', emailError)
          results.push({ userId: user.id, success: false, error: emailError.message })
          continue
        }

        // Update last digest sent timestamp
        await supabase
          .from('profiles')
          .update({ last_digest_sent_at: new Date().toISOString() })
          .eq('id', user.id)

        results.push({ userId: user.id, success: true })
      } catch (err) {
        results.push({
          userId: user.id,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        })
      }
    }

    return new Response(JSON.stringify({
      message: 'Weekly digest processed',
      results,
      totalUsers: users.length,
      successful: results.filter(r => r.success).length,
    }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Weekly digest error:', error)
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
