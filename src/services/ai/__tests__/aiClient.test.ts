import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock supabase config
vi.mock('../../../config/supabase', () => ({
  EDGE_FUNCTION_URL: 'https://test.supabase.co/functions/v1/gemini-proxy',
  SUPABASE_ANON_KEY: 'test-anon-key',
}))

import { callAI, checkAIHealth } from '../aiClient'

describe('callAI', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns success on 200 response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: 'test data', remaining: 14 }),
    })

    const result = await callAI('keyword_extraction', 'test prompt here for testing')
    expect(result.success).toBe(true)
    expect(result.data).toBe('test data')
    expect(result.remaining).toBe(14)
  })

  it('handles rate limit (429) response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: () => Promise.resolve({ message: 'Rate limited', remaining: 0 }),
    })

    const result = await callAI('keyword_extraction', 'test prompt here for testing')
    expect(result.success).toBe(false)
    expect(result.rateLimited).toBe(true)
  })

  it('handles server error (500) with retries', async () => {
    let callCount = 0
    globalThis.fetch = vi.fn().mockImplementation(() => {
      callCount++
      if (callCount < 3) {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Internal error' }),
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true, data: 'recovered', remaining: 10 }),
      })
    })

    const result = await callAI('keyword_extraction', 'test prompt here for testing')
    expect(result.success).toBe(true)
    expect(result.data).toBe('recovered')
    expect(callCount).toBe(3) // 2 retries + 1 success
  })

  it('handles network error with retries then fails', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await callAI('keyword_extraction', 'test prompt here for testing')
    expect(result.success).toBe(false)
    expect(result.error).toContain('Failed to fetch')
  })

  it('does not retry on 400 errors', async () => {
    let callCount = 0
    globalThis.fetch = vi.fn().mockImplementation(() => {
      callCount++
      return Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ success: false, error: 'Bad request' }),
      })
    })

    const result = await callAI('keyword_extraction', 'test prompt here for testing')
    expect(result.success).toBe(false)
    expect(callCount).toBe(1) // No retry on 4xx
  })

  it('sends correct headers', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: 'ok', remaining: 10 }),
    })

    await callAI('keyword_extraction', 'test prompt here for testing')

    const fetchCall = vi.mocked(fetch).mock.calls[0]
    const options = fetchCall[1] as RequestInit
    const headers = options.headers as Record<string, string>
    expect(headers['Content-Type']).toBe('application/json')
    expect(headers['Authorization']).toBe('Bearer test-anon-key')
  })
})

describe('checkAIHealth', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns ok when health check passes', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          status: 'ok',
          model: 'gemini-2.5-flash',
          hasApiKey: true,
        }),
    })

    const result = await checkAIHealth()
    expect(result.ok).toBe(true)
    expect(result.model).toBe('gemini-2.5-flash')
    expect(result.hasApiKey).toBe(true)
  })

  it('returns not ok when API key is missing', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          status: 'ok',
          model: 'gemini-2.5-flash',
          hasApiKey: false,
        }),
    })

    const result = await checkAIHealth()
    expect(result.ok).toBe(false)
    expect(result.error).toContain('GEMINI_API_KEY')
  })

  it('returns error on network failure', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const result = await checkAIHealth()
    expect(result.ok).toBe(false)
    expect(result.error).toBe('Cannot reach Edge Function')
  })
})
