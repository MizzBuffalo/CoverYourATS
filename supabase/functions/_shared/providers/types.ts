export type AITask = 'keyword_extraction' | 'bullet_rewrite' | 'cover_letter'

export interface ProviderRequest {
  task: AITask
  prompt: string
  maxTokens?: number
  temperature?: number
}

export interface ProviderResponse {
  content: string
  model: string
  tokensUsed?: { prompt: number; completion: number }
}
