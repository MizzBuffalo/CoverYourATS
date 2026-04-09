import type { AITask, AIResponse } from '../../types'
import { EDGE_FUNCTION_URL } from '../../config/supabase'

export async function callAI(task: AITask, prompt: string): Promise<AIResponse> {
  if (!EDGE_FUNCTION_URL) {
    return {
      success: false,
      data: null,
      error: 'AI service not configured. Use the "Copy AI Prompt" button instead.',
    }
  }

  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, prompt }),
    })

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
    return {
      success: false,
      data: null,
      error: err instanceof Error ? err.message : 'Network error. Try the "Copy AI Prompt" button.',
    }
  }
}
