import type { AITask, AIResponse } from '../../types'
import { EDGE_FUNCTION_URL, SUPABASE_ANON_KEY } from '../../config/supabase'

export async function callAI(task: AITask, prompt: string): Promise<AIResponse> {
  if (!EDGE_FUNCTION_URL) {
    return {
      success: false,
      data: null,
      error: 'AI service not configured. Use the "Copy AI Prompt" button instead.',
    }
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ task, prompt }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    const result = await response.json()

    if (response.status === 429) {
      return {
        success: false,
        data: null,
        error: result.message || 'Rate limit exceeded.',
        rateLimited: true,
        remaining: result.remaining,
      }
    }

    if (!response.ok || !result.success) {
      return {
        success: false,
        data: null,
        error: result.error || 'AI request failed.',
      }
    }

    return {
      success: true,
      data: result.data,
      remaining: result.remaining,
    }
  } catch (err) {
    const isTimeout = err instanceof DOMException && err.name === 'AbortError'
    return {
      success: false,
      data: null,
      error: isTimeout
        ? 'Request timed out. Try the "Copy AI Prompt" button instead.'
        : err instanceof Error ? err.message : 'Network error. Try the "Copy AI Prompt" button.',
    }
  }
}
