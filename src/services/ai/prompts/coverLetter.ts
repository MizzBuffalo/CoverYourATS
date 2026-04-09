import type { ExtractedKeyword } from '../../../types'

export function buildCoverLetterPrompt(
  jobText: string,
  resumeText: string,
  matchedKeywords: ExtractedKeyword[],
  missingKeywords: ExtractedKeyword[]
): string {
  const matched = matchedKeywords.map((k) => k.keyword).join(', ')
  const missing = missingKeywords.map((k) => k.keyword).join(', ')

  return `You are an expert cover letter writer. Write a professional, tailored cover letter based on the job posting and resume provided.

RULES:
- Sound natural and human — NOT like AI wrote it
- Reference specific details from the job posting
- Highlight the candidate's relevant experience
- Naturally weave in keywords that match between the resume and job posting
- Address any skill gaps diplomatically (show willingness to learn)
- Keep it to 3-4 paragraphs, under 350 words
- Use professional but conversational tone
- Do NOT use generic phrases like "I am writing to express my interest"
- Do NOT use buzzwords without substance
- Start with a compelling opening that shows genuine interest

KEYWORDS ALREADY IN RESUME: ${matched}
KEYWORDS MISSING FROM RESUME: ${missing}

JOB POSTING:
${jobText.slice(0, 3000)}

RESUME:
${resumeText.slice(0, 3000)}

Write the cover letter now. Output ONLY the cover letter text, no JSON, no markdown formatting.`
}
