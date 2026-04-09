// Synonym and abbreviation maps for fuzzy matching
const ABBREVIATIONS: Record<string, string[]> = {
  'javascript': ['js', 'javascript'],
  'typescript': ['ts', 'typescript'],
  'python': ['py', 'python'],
  'kubernetes': ['k8s', 'kubernetes'],
  'amazon web services': ['aws', 'amazon web services'],
  'google cloud platform': ['gcp', 'google cloud platform', 'google cloud'],
  'microsoft azure': ['azure', 'microsoft azure'],
  'continuous integration': ['ci', 'continuous integration'],
  'continuous deployment': ['cd', 'continuous deployment'],
  'ci/cd': ['ci/cd', 'cicd', 'ci cd'],
  'user interface': ['ui', 'user interface'],
  'user experience': ['ux', 'user experience'],
  'ui/ux': ['ui/ux', 'uiux', 'ui ux'],
  'project management': ['pm', 'project management'],
  'quality assurance': ['qa', 'quality assurance'],
  'machine learning': ['ml', 'machine learning'],
  'artificial intelligence': ['ai', 'artificial intelligence'],
  'natural language processing': ['nlp', 'natural language processing'],
  'database': ['db', 'database'],
  'postgresql': ['postgres', 'postgresql'],
  'node.js': ['node', 'nodejs', 'node.js'],
  'next.js': ['next', 'nextjs', 'next.js'],
  'react.js': ['react', 'reactjs', 'react.js'],
  'vue.js': ['vue', 'vuejs', 'vue.js'],
}

// Build reverse lookup: abbreviation → full set of aliases
const ALIAS_MAP = new Map<string, Set<string>>()
for (const aliases of Object.values(ABBREVIATIONS)) {
  const aliasSet = new Set(aliases.map((a) => a.toLowerCase()))
  for (const alias of aliasSet) {
    ALIAS_MAP.set(alias, aliasSet)
  }
}

// Simple stemming — strips common suffixes
function stem(word: string): string {
  return word
    .replace(/(ing|tion|ment|ness|able|ible|ity|ous|ive|ful|less|er|ed|ly|al|ment|ance|ence)$/i, '')
    .replace(/ies$/i, 'y')
    .replace(/es$/i, '')
    .replace(/s$/i, '')
}

export type MatchType = 'exact' | 'stem' | 'abbreviation' | 'synonym'

export interface FuzzyMatchResult {
  found: boolean
  matchType?: MatchType
  matchedText?: string
}

export function fuzzyMatchKeyword(keyword: string, resumeText: string): FuzzyMatchResult {
  const lower = keyword.toLowerCase()
  const resumeLower = resumeText.toLowerCase()

  // 1. Exact match (case-insensitive, word boundary)
  const exactRegex = new RegExp(`\\b${escapeRegex(lower)}\\b`, 'i')
  if (exactRegex.test(resumeLower)) {
    return { found: true, matchType: 'exact', matchedText: keyword }
  }

  // 2. Abbreviation / alias match
  const aliases = ALIAS_MAP.get(lower)
  if (aliases) {
    for (const alias of aliases) {
      if (alias === lower) continue
      const aliasRegex = new RegExp(`\\b${escapeRegex(alias)}\\b`, 'i')
      if (aliasRegex.test(resumeLower)) {
        return { found: true, matchType: 'abbreviation', matchedText: alias }
      }
    }
  }

  // 3. Stem match
  const keywordStem = stem(lower)
  if (keywordStem.length >= 3) {
    const words = resumeLower.split(/\s+/)
    for (const word of words) {
      if (stem(word) === keywordStem && word !== lower) {
        return { found: true, matchType: 'stem', matchedText: word }
      }
    }
  }

  return { found: false }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
