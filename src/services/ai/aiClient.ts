import type { AITask, AIResponse } from '../../types'
import { EDGE_FUNCTION_URL, SUPABASE_ANON_KEY } from '../../config/supabase'

const MAX_RETRIES = 3
const RETRY_DELAYS = [1000, 2000, 4000] // exponential backoff

function isRetryable(status: number): boolean {
  return status >= 500 || status === 0 // 5xx or network failure
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  signal: AbortSignal
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, { ...options, signal })
      // Don't retry on 4xx (client errors) — only retry 5xx
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response
      }
      // 5xx — retry
      if (attempt < MAX_RETRIES - 1 && isRetryable(response.status)) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt]))
        continue
      }
      return response // final attempt, return whatever we got
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      // AbortError (timeout) — don't retry
      if (lastError instanceof DOMException && lastError.name === 'AbortError') {
        throw lastError
      }
      // Network error — retry
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt]))
        continue
      }
    }
  }

  throw lastError ?? new Error('Request failed after retries')
}

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
    const timeout = setTimeout(() => controller.abort(), 45000) // 45s for retries

    const response = await fetchWithRetry(
      EDGE_FUNCTION_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ task, prompt }),
      },
      controller.signal
    )

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

/** Health-check: verify Edge Function is deployed and has API key configured */
export async function checkAIHealth(): Promise<{
  ok: boolean
  model?: string
  hasApiKey?: boolean
  error?: string
}> {
  if (!EDGE_FUNCTION_URL) {
    return { ok: false, error: 'EDGE_FUNCTION_URL not configured in build' }
  }

  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    })

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` }
    }

    const data = await response.json()
    return {
      ok: data.status === 'ok' && data.hasApiKey === true,
      model: data.model,
      hasApiKey: data.hasApiKey,
      error: data.hasApiKey ? undefined : 'GEMINI_API_KEY not set in Supabase secrets',
    }
  } catch {
    return { ok: false, error: 'Cannot reach Edge Function' }
  }
}
