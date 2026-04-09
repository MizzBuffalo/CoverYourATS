import type { ProviderRequest, ProviderResponse } from './types.ts'

const GEMINI_MODEL = 'gemini-2.5-flash-preview-05-20'

export async function callGemini(request: ProviderRequest): Promise<ProviderResponse> {
  const apiKey = Deno.env.get('GEMINI_API_KEY')
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured')
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: request.prompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: request.maxTokens || 2048,
        temperature: request.temperature ?? 0.7,
      },
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    if (response.status === 429) {
      throw new Error('RATE_LIMITED: Gemini API rate limit exceeded')
    }
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`)
  }

  const data = await response.json()

  const content = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!content) {
    throw new Error('No content in Gemini response')
  }

  return {
    content,
    model: GEMINI_MODEL,
    tokensUsed: {
      prompt: data.usageMetadata?.promptTokenCount || 0,
      completion: data.usageMetadata?.candidatesTokenCount || 0,
    },
  }
}
