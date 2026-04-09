import type { ExtractedKeyword, ResumeBullet } from '../../types'

export function generateFallbackRewritePrompt(
  bullets: ResumeBullet[],
  missingKeywords: ExtractedKeyword[],
  jobTitle?: string
): string {
  const keywordsStr = missingKeywords
    .slice(0, 15)
    .map((k) => `- ${k.keyword} (${k.category.replace('_', ' ')})`)
    .join('\n')

  const bulletsStr = bullets
    .map((b) => `- ${b.text}`)
    .join('\n')

  return `I need help rewriting my resume bullets to better match a job posting. Here are the details:

${jobTitle ? `TARGET ROLE: ${jobTitle}\n\n` : ''}MISSING KEYWORDS I NEED TO INCORPORATE:
${keywordsStr}

MY CURRENT RESUME BULLETS:
${bulletsStr}

INSTRUCTIONS:
1. Rewrite each bullet to naturally incorporate 1-2 of the missing keywords
2. Keep content honest to my real experience — don't add skills I don't have
3. Use strong action verbs and include measurable results where possible
4. Make it sound natural and human, not like AI wrote it
5. Keep bullets concise (1-2 lines each)

Please rewrite each bullet and tell me which keywords you incorporated.`
}

export function generateFallbackCoverLetterPrompt(
  jobText: string,
  resumeText: string,
  matchedKeywords: ExtractedKeyword[],
  missingKeywords: ExtractedKeyword[]
): string {
  const matchedStr = matchedKeywords
    .slice(0, 10)
    .map((k) => k.keyword)
    .join(', ')

  const missingStr = missingKeywords
    .slice(0, 10)
    .map((k) => k.keyword)
    .join(', ')

  return `Write me a cover letter for this job. Here are the details:

JOB POSTING (key sections):
${jobText.slice(0, 2000)}

MY RESUME (key sections):
${resumeText.slice(0, 2000)}

KEYWORDS I ALREADY MATCH: ${matchedStr}
KEYWORDS I'M MISSING: ${missingStr}

INSTRUCTIONS:
1. 3-4 paragraphs, under 350 words
2. Sound natural and human — not AI-generated
3. Reference specific details from the job posting
4. Highlight my matching skills naturally
5. Address skill gaps diplomatically (show willingness to learn)
6. Skip generic openings like "I am writing to express my interest"
7. Use professional but conversational tone`
}
