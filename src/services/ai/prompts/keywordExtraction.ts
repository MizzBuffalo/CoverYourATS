export function buildKeywordExtractionPrompt(jobText: string): string {
  return `Analyze this job posting and extract the most important keywords. Categorize each keyword.

Categories:
- hard_skill: Technical abilities, methodologies, processes
- soft_skill: Interpersonal abilities, work style traits
- certification: Certifications, licenses, credentials
- tool: Software, platforms, frameworks, languages
- industry_term: Domain-specific terminology

For each keyword, rate its importance from 0.0 to 1.0 based on:
- How prominently it appears (required vs preferred)
- How frequently it's mentioned
- How specific it is to this role

JOB POSTING:
${jobText.slice(0, 5000)}

Respond in this exact JSON format (no markdown, no code blocks):
[
  { "keyword": "python", "category": "tool", "importance": 0.9 },
  { "keyword": "machine learning", "category": "hard_skill", "importance": 0.85 }
]

Extract 15-30 keywords. Only return the JSON array.`
}
