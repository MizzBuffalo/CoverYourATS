import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { checkRateLimit, getClientIp } from '../_shared/rateLimiter.ts'
import { callGemini } from '../_shared/providers/gemini.ts'
import type { AITask } from '../_shared/providers/types.ts'

const VALID_TASKS: AITask[] = ['keyword_extraction', 'bullet_rewrite', 'cover_letter']

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  // Health-check endpoint (GET)
  if (req.method === 'GET') {
    const hasApiKey = !!Deno.env.get('GEMINI_API_KEY')
    return new Response(
      JSON.stringify({
        status: 'ok',
        model: 'gemini-2.5-flash',
        hasApiKey,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    // Rate limit check
    const clientIp = getClientIp(req)
    const rateLimit = checkRateLimit(clientIp)

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: "You've reached the daily limit. Try the 'Copy AI Prompt' button to use your own AI, or try again tomorrow.",
          rateLimited: true,
          remaining: 0,
          resetAt: rateLimit.resetAt,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse request
    const body = await req.json()
    const { task, prompt } = body as { task: AITask; prompt: string }

    if (!task || !VALID_TASKS.includes(task)) {
      return new Response(
        JSON.stringify({ error: `Invalid task. Must be one of: ${VALID_TASKS.join(', ')}` }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!prompt || typeof prompt !== 'string' || prompt.length < 10) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required and must be at least 10 characters' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Truncate very long prompts to protect token budget
    const truncatedPrompt = prompt.length > 15000 ? prompt.slice(0, 15000) + '\n\n[Content truncated for token limits]' : prompt

    // Call Gemini
    const result = await callGemini({
      task,
      prompt: truncatedPrompt,
      maxTokens: task === 'cover_letter' ? 2048 : 4096,
      temperature: task === 'keyword_extraction' ? 0.3 : 0.7,
    })

    return new Response(
      JSON.stringify({
        success: true,
        data: result.content,
        model: result.model,
        remaining: rateLimit.remaining,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const isRateLimit = message.includes('RATE_LIMITED')

    return new Response(
      JSON.stringify({
        success: false,
        error: isRateLimit
          ? 'AI service is temporarily rate limited. Try the "Copy AI Prompt" button instead.'
          : `AI request failed: ${message}`,
        rateLimited: isRateLimit,
      }),
      {
        status: isRateLimit ? 429 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
