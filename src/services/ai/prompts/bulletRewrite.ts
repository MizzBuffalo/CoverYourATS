import type { ExtractedKeyword, ResumeBullet } from '../../../types'

export function buildBulletRewritePrompt(
  bullets: ResumeBullet[],
  missingKeywords: ExtractedKeyword[],
  jobTitle?: string
): string {
  // Cap at 20 bullets and 30 keywords to keep prompt small and response fast
  const cappedBullets = bullets.slice(0, 20)
  const cappedKeywords = missingKeywords.slice(0, 30)
  const keywordsStr = cappedKeywords.map((k) => k.keyword).join(', ')
  const bulletsStr = cappedBullets
    .map((b, i) => `${i + 1}. [${b.sectionName}] ${b.text}`)
    .join('\n')

  return `You are an expert resume writer. Your task is to rewrite resume bullet points to naturally incorporate missing keywords from a job posting.

RULES:
- Keep the content HONEST to the person's real experience
- DO NOT add skills or experiences they don't have
- Naturally rephrase bullets using the employer's vocabulary
- Maintain professional tone — sound human, not AI-generated
- Keep bullets concise (1-2 lines each)
- Use strong action verbs
- Include measurable results where possible
- Each rewritten bullet MUST incorporate at least one missing keyword naturally

${jobTitle ? `TARGET ROLE: ${jobTitle}\n` : ''}
MISSING KEYWORDS TO INCORPORATE: ${keywordsStr}

ORIGINAL RESUME BULLETS:
${bulletsStr}

Respond in this exact JSON format (no markdown, no code blocks):
[
  {
    "index": 1,
    "original": "original bullet text",
    "rewritten": "rewritten bullet text incorporating keywords",
    "keywords_added": ["keyword1", "keyword2"]
  }
]

Rewrite ALL bullets listed above. Only return the JSON array.`
}
