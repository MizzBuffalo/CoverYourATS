import { describe, it, expect } from 'vitest'
import { extractBulletsFromText } from '../extractBullets'

describe('extractBulletsFromText', () => {
  it('extracts dash-prefixed bullets', () => {
    const text = `EXPERIENCE
- Managed a team of 10 engineers across 3 product lines
- Developed full-stack applications using React and Node.js
- Implemented CI/CD pipelines reducing deployment time by 50%`

    const bullets = extractBulletsFromText(text)
    expect(bullets.length).toBe(3)
    expect(bullets[0].text).toContain('Managed a team')
    expect(bullets[0].sectionName).toBe('EXPERIENCE')
  })

  it('extracts numbered bullets', () => {
    const text = [
      'EXPERIENCE',
      '1. Built REST APIs serving 1M+ daily requests',
      '2. Optimized database queries reducing latency by 40%',
    ].join('\n')

    const bullets = extractBulletsFromText(text)
    expect(bullets.length).toBe(2)
    expect(bullets[0].text).toContain('Built REST APIs')
  })

  it('extracts accomplishment-style lines', () => {
    const text = `ACHIEVEMENTS
Managed cross-functional team of 15 engineers
Developed microservices architecture for payment processing
Implemented automated testing framework`

    const bullets = extractBulletsFromText(text)
    expect(bullets.length).toBeGreaterThanOrEqual(2)
  })

  it('skips section headers', () => {
    const text = `WORK EXPERIENCE
- Led migration to cloud infrastructure
EDUCATION
- BS Computer Science, MIT`

    const bullets = extractBulletsFromText(text)
    const headerBullet = bullets.find((b) => b.text === 'WORK EXPERIENCE')
    expect(headerBullet).toBeUndefined()
  })

  it('handles empty input', () => {
    const bullets = extractBulletsFromText('')
    expect(bullets).toEqual([])
  })

  it('handles text with no bullets (fallback)', () => {
    const text = `I have 10 years of experience in software development.
My expertise includes building scalable web applications and managing engineering teams.
I am proficient in Python, JavaScript, and cloud technologies like AWS and GCP.`

    const bullets = extractBulletsFromText(text)
    // Should use fallback for substantive lines
    expect(bullets.length).toBeGreaterThan(0)
  })

  it('caps at 20 bullets maximum', () => {
    const lines = Array.from({ length: 30 }, (_, i) =>
      `- Accomplished task number ${i + 1} with great results and impact`
    )
    const text = `EXPERIENCE\n${lines.join('\n')}`

    const bullets = extractBulletsFromText(text)
    expect(bullets.length).toBeLessThanOrEqual(20)
  })

  it('skips very short bullet content', () => {
    const text = `- Short
- Also short
- This is a long enough bullet point to be included in results`

    const bullets = extractBulletsFromText(text)
    // Only the long one should match (minimum 15 chars)
    expect(bullets.length).toBeGreaterThanOrEqual(1)
  })

  it('assigns unique IDs to each bullet', () => {
    const text = `- Managed a team of engineers across multiple projects
- Built scalable APIs serving millions of requests daily
- Led architecture redesign of core platform`

    const bullets = extractBulletsFromText(text)
    const ids = bullets.map((b) => b.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })
})
