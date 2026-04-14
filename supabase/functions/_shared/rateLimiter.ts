// Simple in-memory rate limiter for MVP
// Note: Resets on cold start. Gemini's own daily limit acts as backstop.
// TODO: Upgrade to Supabase PostgreSQL-backed rate limiting for production

const WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours
const MAX_REQUESTS = 100

interface RateLimitEntry {
  count: number
  windowStart: number
}

const store = new Map<string, RateLimitEntry>()

export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous'
  )
}

export function checkRateLimit(clientIp: string): {
  allowed: boolean
  remaining: number
  resetAt: number
} {
  const now = Date.now()
  const entry = store.get(clientIp)

  // Clean expired entries periodically
  if (store.size > 10000) {
    for (const [key, val] of store) {
      if (now - val.windowStart > WINDOW_MS) store.delete(key)
    }
  }

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // New window
    store.set(clientIp, { count: 1, windowStart: now })
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: now + WINDOW_MS }
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.windowStart + WINDOW_MS,
    }
  }

  entry.count++
  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetAt: entry.windowStart + WINDOW_MS,
  }
}
