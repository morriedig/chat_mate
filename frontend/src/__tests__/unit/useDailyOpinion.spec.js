import { describe, it, expect } from 'vitest'
import {
  getDayNumber,
  getQuestionForDate,
  getConnectorIdsForDate,
  getConnectorInfo,
} from '../../composables/useDailyOpinion'
import { OPINION_QUESTIONS, ROTATING_CONNECTOR_IDS } from '../../data/dailyOpinion'

function day(y, m, d, h = 12) {
  return new Date(y, m - 1, d, h)
}

describe('daily opinion rotation', () => {
  it('has about 20 questions with en/ja/zh and unique ids', () => {
    expect(OPINION_QUESTIONS.length).toBeGreaterThanOrEqual(20)
    const ids = new Set(OPINION_QUESTIONS.map(q => q.id))
    expect(ids.size).toBe(OPINION_QUESTIONS.length)
    for (const q of OPINION_QUESTIONS) {
      expect(q.en && q.ja && q.zh).toBeTruthy()
    }
  })

  it('uses the local calendar date, not the time of day', () => {
    expect(getDayNumber(day(2026, 10, 10, 0))).toBe(getDayNumber(day(2026, 10, 10, 23)))
    expect(getQuestionForDate(day(2026, 10, 10, 1))).toBe(getQuestionForDate(day(2026, 10, 10, 22)))
  })

  it('is deterministic for the same date', () => {
    expect(getQuestionForDate(day(2026, 3, 1))).toBe(getQuestionForDate(day(2026, 3, 1)))
    expect(getConnectorIdsForDate(day(2026, 3, 1))).toEqual(getConnectorIdsForDate(day(2026, 3, 1)))
  })

  it('changes question on consecutive days and keeps cycling across New Year', () => {
    expect(getQuestionForDate(day(2026, 10, 10))).not.toBe(getQuestionForDate(day(2026, 10, 11)))
    expect(getQuestionForDate(day(2026, 12, 31))).not.toBe(getQuestionForDate(day(2027, 1, 1)))
    expect(getDayNumber(day(2027, 1, 1)) - getDayNumber(day(2026, 12, 31))).toBe(1)
  })

  it('visits every question once per full cycle', () => {
    const seen = new Set()
    const start = day(2026, 1, 1)
    for (let i = 0; i < OPINION_QUESTIONS.length; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      seen.add(getQuestionForDate(d).id)
    }
    expect(seen.size).toBe(OPINION_QUESTIONS.length)
  })

  it('always picks two distinct connectors from the rotating pool', () => {
    const start = day(2026, 1, 1)
    const pairs = new Set()
    for (let i = 0; i < 400; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      const [a, b] = getConnectorIdsForDate(d)
      expect(a).not.toBe(b)
      expect(ROTATING_CONNECTOR_IDS).toContain(a)
      expect(ROTATING_CONNECTOR_IDS).toContain(b)
      pairs.add(`${a}|${b}`)
    }
    // Pairs shouldn't just repeat in lockstep with the first connector
    expect(pairs.size).toBeGreaterThan(ROTATING_CONNECTOR_IDS.length)
  })

  it('never rotates in the undetectable to-purpose connector', () => {
    expect(ROTATING_CONNECTOR_IDS).not.toContain('to-purpose')
  })
})

describe('getConnectorInfo', () => {
  it('reads word + mother-tongue meaning from the chapter', () => {
    const info = getConnectorInfo('due-to', 'zh')
    expect(info.word).toBe('due to')
    expect(info.nativeWord).toBe('由於（較正式）')
    expect(info.meaning).toContain('名詞')
    expect(info.example).toMatch(/due to/)
  })

  it('omits nativeWord for English speakers', () => {
    expect(getConnectorInfo('because', 'en').nativeWord).toBe('')
  })

  it('every rotating connector exists in the chapter', () => {
    for (const id of ROTATING_CONNECTOR_IDS) {
      expect(getConnectorInfo(id, 'en').example).not.toBe('')
    }
  })
})
