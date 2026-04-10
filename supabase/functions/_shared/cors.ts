const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || '*'

export function getCorsHeaders(req?: Request): Record<string, string> {
  // If ALLOWED_ORIGIN is '*', echo the requesting origin for maximum compatibility
  let origin = ALLOWED_ORIGIN
  if (origin === '*' && req) {
    const requestOrigin = req.headers.get('Origin')
    if (requestOrigin) origin = requestOrigin
  }

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
    'Access-Control-Max-Age': '86400',
  }
}

// Keep backward-compatible export (uses default '*' when no request available)
export const corsHeaders = getCorsHeaders()

export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: getCorsHeaders(req) })
  }
  return null
}
