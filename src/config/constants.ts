import type { KeywordCategory } from '../types'

export const CATEGORY_LABELS: Record<KeywordCategory, string> = {
  hard_skill: 'Hard Skills',
  soft_skill: 'Soft Skills',
  certification: 'Certifications',
  tool: 'Tools & Software',
  industry_term: 'Industry Terms',
}

export const CATEGORY_WEIGHTS: Record<KeywordCategory, number> = {
  hard_skill: 0.30,
  tool: 0.25,
  certification: 0.15,
  industry_term: 0.15,
  soft_skill: 0.15,
}

export const CATEGORY_ORDER: KeywordCategory[] = [
  'hard_skill',
  'tool',
  'certification',
  'industry_term',
  'soft_skill',
]

export const STEPS = [
  { id: 1, label: 'Job Posting', shortLabel: 'JOB' },
  { id: 2, label: 'Resume', shortLabel: 'RESUME' },
  { id: 3, label: 'Analysis', shortLabel: 'SCAN' },
  { id: 4, label: 'Optimize', shortLabel: 'REWRITE' },
  { id: 5, label: 'Export', shortLabel: 'EXPORT' },
] as const

export const POSITION_WEIGHTS = {
  required: 2.0,
  preferred: 1.5,
  body: 1.0,
} as const

export const RATE_LIMIT_PER_DAY = 15
