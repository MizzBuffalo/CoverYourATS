export type AITask = 'keyword_extraction' | 'bullet_rewrite' | 'cover_letter'

export interface AIRequest {
  task: AITask
  payload: Record<string, unknown>
}

export interface AIResponse {
  success: boolean
  data: unknown
  error?: string
  rateLimited?: boolean
  remaining?: number
}

export interface RewrittenBullet {
  originalId: string
  original: string
  rewritten: string
  incorporatedKeywords: string[]
}
