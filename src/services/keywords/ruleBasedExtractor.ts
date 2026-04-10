import nlp from 'compromise'
import type { ExtractedKeyword } from '../../types'
import { STOPWORDS } from './dictionaries/stopwords'
import { HARD_SKILLS } from './dictionaries/hardSkills'
import { SOFT_SKILLS } from './dictionaries/softSkills'
import { CERTIFICATIONS } from './dictionaries/certifications'
import { TOOLS_SOFTWARE } from './dictionaries/tools'
import { categorizeKeyword } from './categorizer'

// All known terms merged for quick lookup
const ALL_KNOWN_TERMS = new Set([
  ...HARD_SKILLS,
  ...SOFT_SKILLS,
  ...CERTIFICATIONS,
  ...TOOLS_SOFTWARE,
])

interface Section {
  label: 'required' | 'preferred' | 'body'
  text: string
}

function detectSections(text: string): Section[] {
  const sections: Section[] = []
  const lines = text.split('\n')
  let currentLabel: Section['label'] = 'body'
  let currentLines: string[] = []

  for (const line of lines) {
    const lower = line.toLowerCase().trim()

    let newLabel: Section['label'] | null = null
    if (/^(required|minimum|must have|requirements|qualifications)/i.test(lower)) {
      newLabel = 'required'
    } else if (/^(preferred|nice to have|bonus|desired|optional|plus)/i.test(lower)) {
      newLabel = 'preferred'
    }

    if (newLabel && newLabel !== currentLabel) {
      if (currentLines.length > 0) {
        sections.push({ label: currentLabel, text: currentLines.join('\n') })
      }
      currentLabel = newLabel
      currentLines = [line]
    } else {
      currentLines.push(line)
    }
  }

  if (currentLines.length > 0) {
    sections.push({ label: currentLabel, text: currentLines.join('\n') })
  }

  return sections.length > 0 ? sections : [{ label: 'body', text }]
}

function extractNGrams(text: string): Map<string, number> {
  const counts = new Map<string, number>()
  const words = text.toLowerCase().split(/[\s,;:.()/]+/).filter(Boolean)

  // Unigrams
  for (const word of words) {
    if (word.length < 2 || STOPWORDS.has(word)) continue
    counts.set(word, (counts.get(word) || 0) + 1)
  }

  // Bigrams
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`
    if (STOPWORDS.has(words[i]) || STOPWORDS.has(words[i + 1])) continue
    counts.set(bigram, (counts.get(bigram) || 0) + 1)
  }

  // Trigrams
  for (let i = 0; i < words.length - 2; i++) {
    const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`
    counts.set(trigram, (counts.get(trigram) || 0) + 1)
  }

  return counts
}

export function extractKeywordsRuleBased(text: string): ExtractedKeyword[] {
  const sections = detectSections(text)
  const totalWords = text.split(/\s+/).length

  // Track keyword → positions and frequency
  const keywordData = new Map<
    string,
    { frequency: number; positions: Set<Section['label']> }
  >()

  for (const section of sections) {
    const ngrams = extractNGrams(section.text)

    for (const [term, count] of ngrams) {
      // Only keep terms that are in our dictionaries or extracted by NLP
      if (ALL_KNOWN_TERMS.has(term)) {
        const existing = keywordData.get(term) || {
          frequency: 0,
          positions: new Set<Section['label']>(),
        }
        existing.frequency += count
        existing.positions.add(section.label)
        keywordData.set(term, existing)
      }
    }
  }

  // Also use compromise for noun phrase extraction
  const doc = nlp(text)
  const nouns = doc.nouns().out('array') as string[]
  for (const noun of nouns) {
    const lower = noun.toLowerCase().trim()
    if (lower.length < 3 || STOPWORDS.has(lower)) continue
    if (ALL_KNOWN_TERMS.has(lower) && !keywordData.has(lower)) {
      keywordData.set(lower, { frequency: 1, positions: new Set(['body']) })
    }
  }

  // Convert to ExtractedKeyword[]
  const keywords: ExtractedKeyword[] = []
  for (const [keyword, data] of keywordData) {
    const positionBoost = data.positions.has('required')
      ? 2.0
      : data.positions.has('preferred')
        ? 1.5
        : 1.0

    const tf = data.frequency / totalWords
    const importance = Math.min(1, tf * 100 * positionBoost)

    keywords.push({
      keyword,
      category: categorizeKeyword(keyword),
      importance,
      frequency: data.frequency,
      source: 'rule_based',
    })
  }

  return keywords.sort((a, b) => b.importance - a.importance)
}
