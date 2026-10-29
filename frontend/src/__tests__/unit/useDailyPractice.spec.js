import { describe, it, expect, vi, beforeEach } from 'vitest'
import { pickItems } from '../../composables/useDailyPractice'
import { usesPattern } from '../../composables/useSentenceCheck'

function fakeSrs({ reviewed = {}, due = [] } = {}) {
  return {
    getWordSRS: id => reviewed[id] || null,
    // `due` is listed most overdue first, like the real getDueWords
    getDueWords: items => due.map(id => items.find(item => item.id === id)).filter(Boolean),
  }
}

const items = ['a', 'b', 'c', 'd', 'e'].map(id => ({ id }))

describe('pickItems', () => {
  it('takes only new items in file order on the first day', () => {
    expect(pickItems(items, 3, 1, fakeSrs())).toEqual(['a', 'b', 'c'])
  })

  it('puts due reviews first and keeps a slot for something new', () => {
    const srs = fakeSrs({ reviewed: { a: {}, b: {}, c: {} }, due: ['a', 'b', 'c'] })
    expect(pickItems(items, 3, 1, srs)).toEqual(['a', 'b', 'd'])
  })

  it('fills with new items when few reviews are due', () => {
    const srs = fakeSrs({ reviewed: { a: {}, b: {} }, due: ['b'] })
    expect(pickItems(items, 3, 1, srs)).toEqual(['b', 'c', 'd'])
  })

  it('uses all review slots when nothing new is left', () => {
    const reviewed = Object.fromEntries(items.map(i => [i.id, {}]))
    const srs = fakeSrs({ reviewed, due: ['e', 'a', 'c', 'd'] })
    expect(pickItems(items, 3, 1, srs)).toEqual(['e', 'a', 'c'])
  })
})

describe('useDailyPractice', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  async function load() {
    const { useDailyPractice } = await import('../../composables/useDailyPractice')
    return useDailyPractice()
  }

  it('plans 3 patterns and 5 words from the bundled content', async () => {
    const practice = await load()

    expect(practice.level.value).toBe('intermediate')
    expect(practice.todayPatterns.value).toHaveLength(3)
    expect(practice.todayWords.value).toHaveLength(5)
    expect(practice.doneCount.value).toBe(0)
  })

  it('keeps the same plan for the day and tracks completion', async () => {
    const practice = await load()
    const first = practice.todayPatterns.value[0].id

    practice.completeItem(first, { correct: true, confidence: 4 })

    const again = await load()
    expect(again.todayPatterns.value[0].id).toBe(first)
    expect(again.isDone(first)).toBe(true)
    expect(again.doneCount.value).toBe(1)
  })

  it('switches content when the level changes', async () => {
    const practice = await load()

    practice.setLevel('beginner')

    expect(practice.level.value).toBe('beginner')
    expect(practice.todayPatterns.value.every(p => p.level === 'beginner')).toBe(true)
  })
})

describe('usesPattern', () => {
  it('needs every match part', () => {
    expect(usesPattern("I'd say it's better, because it's quiet.", ["i'd say", 'because'])).toBe(true)
    expect(usesPattern("I'd say it's better.", ["i'd say", 'because'])).toBe(false)
  })

  it('accepts curly apostrophes and uncontracted forms', () => {
    expect(usesPattern('I’d like a latte.', ["i'd like"])).toBe(true)
    expect(usesPattern('I would like a latte.', ["i'd like"])).toBe(true)
    expect(usesPattern('I do not think so.', ["i don't think"])).toBe(true)
  })

  it('never matches an empty match list', () => {
    expect(usesPattern('anything', [])).toBe(false)
  })
})
