export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string || ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string || ''
export const EDGE_FUNCTION_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/gemini-proxy` : ''
