import type { KeywordCategory } from '../../types'
import { HARD_SKILLS } from './dictionaries/hardSkills'
import { SOFT_SKILLS } from './dictionaries/softSkills'
import { CERTIFICATIONS } from './dictionaries/certifications'
import { TOOLS_SOFTWARE } from './dictionaries/tools'

export function categorizeKeyword(keyword: string): KeywordCategory {
  const lower = keyword.toLowerCase()

  // Check dictionaries in priority order
  if (CERTIFICATIONS.has(lower)) return 'certification'
  if (TOOLS_SOFTWARE.has(lower)) return 'tool'
  if (HARD_SKILLS.has(lower)) return 'hard_skill'
  if (SOFT_SKILLS.has(lower)) return 'soft_skill'

  // Heuristics for uncategorized terms
  if (/certif|licens|accredit|credential/i.test(lower)) return 'certification'
  if (/\b(software|tool|platform|app|system|framework|library)\b/i.test(lower)) return 'tool'

  // Default: industry term
  return 'industry_term'
}
