import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getDailyPatterns, getDailyVocab } from '../../data/dailyLoader'
import { countEnglishWords, isValidCoreAnswer, migrateState } from '../../composables/useDailyPractice'

const TODAY = '2026-11-06'
const TOMORROW = '2026-11-07'

async function load() {
  const { useDailyPractice } = await import('../../composables/useDailyPractice')
  return useDailyPractice()
}
const stored = () => JSON.parse(localStorage.getItem('chatmate_daily_practice'))

describe('core answer rules', () => {
  it('needs 2 English words typed, or any spoken transcript', () => {
    expect(countEnglishWords("I'd say so")).toBe(3)
    expect(isValidCoreAnswer('text', 'hello')).toBe(false)
    expect(isValidCoreAnswer('text', '你好 hello')).toBe(false)
    expect(isValidCoreAnswer('text', 'hello there')).toBe(true)
    expect(isValidCoreAnswer('voice', 'hello')).toBe(true)
    expect(isValidCoreAnswer('voice', '  ')).toBe(false)
  })

  it('migrates version 1 state as it is', () => {
    const v1 = { level: 'beginner', plans: { [TODAY]: { patternIds: ['x'], wordIds: [], done: { x: true } } } }
    expect(migrateState(v1)).toEqual({ ...v1, version: 2 })
    expect(migrateState({ plans: {} })).toBeNull()
  })
})

describe('useDailyPractice core', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 10, 6, 10, 0))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('gives a brand-new learner a complete core: common mistake, pattern, pattern prompt', async () => {
    const p = await load()
    const core = p.core.value

    expect(stored().version).toBe(2)
    expect(core.errorSource).toBe('builtin')
    expect(core.errorKey).toMatch(/^builtin:/)
    expect(p.coreError.value.original).toBeTruthy()
    expect(core.patternId).toBe(p.todayPatterns.value[0].id)
    expect(core.speakingSource).toBe('pattern')
    expect(p.coreSpeaking.value.cue).toBe(p.todayPatterns.value[0].task)
    expect(p.coreStep.value).toBe('error')
    expect(p.isDoneToday.value).toBe(false)
  })

  it('uses a personal mistake first and keeps core items out of the extras', async () => {
    const { useMistakes } = await import('../../composables/useMistakes')
    const id = useMistakes().addMistake({ original: 'She like it', corrected: 'She likes it', type: 'third-person-s' })
    const p = await load()

    expect(p.core.value).toMatchObject({ errorSource: 'personal', errorKey: `mistake:${id}` })
    const extraCount = p.totalCount.value
    p.completeCoreError({ correct: true, confidence: 4 })
    p.completeCorePattern(true)

    // Finishing core cards neither counts toward nor removes anything from the extras
    expect(p.totalCount.value).toBe(extraCount)
    expect(p.doneCount.value).toBe(0)
    expect(p.isDone(`mistake:${id}`)).toBe(true)
    expect(p.isDone(p.core.value.patternId)).toBe(true)
  })

  it('finishes after three steps, marks the day once and books a hard prompt for tomorrow', async () => {
    const p = await load()
    const { useSRS } = await import('../../composables/useSRS')
    const { useUserProgress } = await import('../../composables/useUserProgress')
    const { useSpeakingQueue } = await import('../../composables/useSpeakingQueue')
    const patternId = p.core.value.patternId

    p.completeCoreError({ correct: false, confidence: 2 })
    expect(p.coreStep.value).toBe('pattern')
    p.completeCorePattern(true)
    expect(useSRS().getWordSRS(patternId)).toMatchObject({ repetitions: 1 })
    expect(p.coreStep.value).toBe('speaking')

    expect(p.submitCoreSpeaking({ mode: 'text', text: 'Hello' })).toBe(false)
    expect(p.submitCoreSpeaking({ mode: 'text', text: 'If you ask me, it is fine.' })).toBe(true)
    expect(p.isDoneToday.value).toBe(false)
    p.rateCoreSpeaking('again')

    expect(p.isDoneToday.value).toBe(true)
    expect(p.coreDoneCount.value).toBe(3)
    const progress = useUserProgress()
    expect(progress.progress.value.activityLog[TODAY]).toMatchObject({ corePractice: 1, coreMode: 'text' })
    expect(progress.progress.value.currentStreak).toBe(1)

    // Same day again (a chat message, or another call): still one day
    progress.markPracticeDay('core-practice', { mode: 'text' })
    progress.onMessageSent()
    expect(progress.progress.value.currentStreak).toBe(1)

    const booked = useSpeakingQueue().itemFor(TOMORROW)
    expect(booked).toMatchObject({ source: 'pattern-fallback', patternId })
  })

  it('records a spoken finish as voice', async () => {
    const p = await load()
    const { useUserProgress } = await import('../../composables/useUserProgress')
    p.completeCoreError()
    p.completeCorePattern(false)
    p.submitCoreSpeaking({ mode: 'voice', text: 'yes' })
    p.rateCoreSpeaking('got-it')
    expect(useUserProgress().progress.value.activityLog[TODAY].coreMode).toBe('voice')
  })

  it('resumes at the exact unfinished step after leaving', async () => {
    let p = await load()
    p.completeCoreError()
    vi.resetModules()
    p = await load()
    expect(p.coreStep.value).toBe('pattern')

    p.completeCorePattern(true)
    p.submitCoreSpeaking({ mode: 'text', text: 'I would say yes' })
    vi.resetModules()
    p = await load()
    expect(p.coreStep.value).toBe('speaking')
    expect(p.core.value.speakingAttempt).toMatchObject({ mode: 'text', text: 'I would say yes' })
  })

  it('puts a chat sentence booked today into tomorrow’s step 3', async () => {
    const { useSpeakingQueue } = await import('../../composables/useSpeakingQueue')
    useSpeakingQueue().queueRepeatTomorrow(
      { enabled: true, original: 'Yesterday I go', target: 'Yesterday I went', cue: '說昨天去了哪', hint: '過去式', patternId: '' },
      { sourceId: 'task_1' },
    )
    let p = await load()
    expect(p.core.value.speakingSource).toBe('pattern')

    vi.setSystemTime(new Date(2026, 10, 7, 8, 0))
    vi.resetModules()
    p = await load()
    expect(p.core.value.speakingSource).toBe('queue')
    expect(p.coreSpeaking.value).toMatchObject({ source: 'chat-summary', cue: '說昨天去了哪', target: 'Yesterday I went' })

    p.completeCoreError()
    p.completeCorePattern(true)
    p.submitCoreSpeaking({ mode: 'voice', text: 'Yesterday I went' })
    p.rateCoreSpeaking('got-it')
    const { useSpeakingQueue: q2 } = await import('../../composables/useSpeakingQueue')
    expect(q2().getItem(p.core.value.speakingItemId).completedAt).toBeTruthy()
  })

  it('adds a core to an unfinished version 1 plan and keeps its progress', async () => {
    const patterns = getDailyPatterns('intermediate').slice(0, 3).map(x => x.id)
    const words = getDailyVocab('intermediate').slice(0, 5).map(x => x.id)
    localStorage.setItem('chatmate_daily_practice', JSON.stringify({
      level: 'intermediate',
      plans: { [TODAY]: { level: 'intermediate', patternIds: patterns, wordIds: words, mistakeIds: [], bankIds: [], listening: [], done: { [patterns[0]]: true } } },
    }))
    const p = await load()

    expect(stored().version).toBe(2)
    expect(p.todayPatterns.value.map(x => x.id)).toEqual(patterns)
    // The finished pattern isn't asked again: the core takes the next one
    expect(p.core.value.patternId).toBe(patterns[1])
    expect(p.isDone(patterns[0])).toBe(true)
    expect(p.isDoneToday.value).toBe(false)
  })

  it('treats a version 1 plan finished before the update as done today', async () => {
    const patterns = getDailyPatterns('intermediate').slice(0, 3).map(x => x.id)
    const words = getDailyVocab('intermediate').slice(0, 5).map(x => x.id)
    const done = Object.fromEntries([...patterns, ...words].map(id => [id, true]))
    localStorage.setItem('chatmate_daily_practice', JSON.stringify({
      level: 'intermediate',
      plans: { [TODAY]: { level: 'intermediate', patternIds: patterns, wordIds: words, mistakeIds: [], bankIds: [], listening: [], done } },
    }))
    const p = await load()
    expect(p.isDoneToday.value).toBe(true)
  })
})
