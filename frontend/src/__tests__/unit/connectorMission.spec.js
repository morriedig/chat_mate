import { describe, it, expect } from 'vitest'
import { getChapterCloze, getChapterConnectors } from '../../data/chapterLoader'
import { pickMissionTargets, createMission, getUsedTargetIds, MISSION_TYPE } from '../../composables/useConnectorMission'

// Uses the real giving-reasons chapter YAML
const CHAPTER = 'giving-reasons'

describe('getChapterCloze (giving-reasons)', () => {
  it('loads cloze questions with mother-tongue explanations', () => {
    const zh = getChapterCloze(CHAPTER, 'en', 'zh')
    expect(zh.length).toBeGreaterThan(0)
    expect(zh[0]).toMatchObject({ type: 'cloze', answer: 'due to' })
    expect(zh[0].explain).toContain('名詞')
    expect(zh[0].options).toHaveLength(4)
  })

  it('falls back to English explanations for unknown languages', () => {
    const fallback = getChapterCloze(CHAPTER, 'en', 'ko')
    expect(fallback[0].explain).toMatch(/noun/)
  })

  it('links answers to chapter word ids, ignoring case and qualifiers', () => {
    const byAnswer = Object.fromEntries(getChapterCloze(CHAPTER, 'en', 'en').map(q => [q.answer, q.targetId]))
    expect(byAnswer['Since']).toBe('giving-reasons_since')
    expect(byAnswer['to']).toBe('giving-reasons_to-purpose')
    expect(byAnswer['On top of that']).toBe('giving-reasons_on-top-of-that')
  })

  it('returns [] for chapters without cloze', () => {
    expect(getChapterCloze('no-such-chapter', 'en', 'en')).toEqual([])
  })
})

describe('getChapterConnectors (giving-reasons)', () => {
  it('skips structure cards and meaning-qualified words', () => {
    const ids = getChapterConnectors(CHAPTER, 'en').map(c => c.id)
    expect(ids).toContain('giving-reasons_so-that')
    expect(ids).not.toContain('giving-reasons_opinion-reason-wrap-up')
    expect(ids).not.toContain('giving-reasons_to-purpose')
  })
})

describe('connector mission', () => {
  const connectors = getChapterConnectors(CHAPTER, 'en')

  it('prefers missed connectors, then practiced ones', () => {
    const ids = pickMissionTargets(connectors, {
      missedTargetIds: ['giving-reasons_so-that', 'giving-reasons_to-purpose', 'giving-reasons_so-that'],
      practicedTargetIds: ['giving-reasons_since']
    })
    // to-purpose isn't detectable, duplicates collapse
    expect(ids).toEqual(['giving-reasons_so-that', 'giving-reasons_since', expect.any(String)])
    expect(new Set(ids).size).toBe(3)
  })

  it('still picks 3 targets with no quiz data', () => {
    expect(pickMissionTargets(connectors, {})).toHaveLength(3)
  })

  it('builds a scenario with a no-lecture prompt and tracks used targets', () => {
    const mission = createMission({
      chapterId: CHAPTER,
      title: 'Giving Reasons',
      connectors,
      targetIds: ['giving-reasons_so', 'giving-reasons_so-that', 'giving-reasons_since']
    })
    expect(mission.type).toBe(MISSION_TYPE)
    expect(mission.prompt).toMatch(/why/i)
    expect(mission.prompt).toMatch(/never lecture/i)
    expect(mission.targets.map(t => t.phrase)).toEqual(['so', 'so that', 'since'])

    const messages = [
      { role: 'assistant', content: 'So, since you asked...' }, // AI turns don't count
      { role: 'user', content: 'I left early so that I could rest.' }
    ]
    expect(getUsedTargetIds(mission, messages)).toEqual(['giving-reasons_so-that'])

    messages.push({ role: 'user', content: 'Since it was late, so I went home.' })
    expect(getUsedTargetIds(mission, messages)).toEqual([
      'giving-reasons_so', 'giving-reasons_so-that', 'giving-reasons_since'
    ])
  })
})
