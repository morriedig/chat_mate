import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseCorrectionText, pickMistakeIds } from '../../composables/useMistakes'
import { diffWords } from '../../utils/wordDiff'
import { buildListening } from '../../composables/useDailyPractice'

describe('parseCorrectionText', () => {
  it('reads a quoted original → corrected pair with an explanation', () => {
    expect(parseCorrectionText('"I am agree" → "I agree" — agree is already a verb'))
      .toEqual({ original: 'I am agree', corrected: 'I agree', explanation: 'agree is already a verb' })
  })

  it('accepts curly quotes and an ASCII arrow without explanation', () => {
    expect(parseCorrectionText('“He go” -> “He goes”'))
      .toEqual({ original: 'He go', corrected: 'He goes', explanation: '' })
  })

  it('returns null for free-text tips', () => {
    expect(parseCorrectionText('Try using more casual expressions')).toBeNull()
  })
})

describe('useMistakes', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('saves a mistake once and ignores unchanged pairs', async () => {
    const { useMistakes } = await import('../../composables/useMistakes')
    const { addMistake, mistakes } = useMistakes()
    const id = addMistake({ original: 'I goed home', corrected: 'I went home', type: 'tense' })
    expect(id).toBeTruthy()
    expect(addMistake({ original: 'I goed home.', corrected: 'I went home.' })).toBe(id)
    expect(addMistake({ original: 'Fine.', corrected: 'fine' })).toBeNull()
    expect(mistakes.value).toHaveLength(1)
    expect(JSON.parse(localStorage.getItem('chatmate_mistakes'))[id].type).toBe('tense')
  })

  it('stores unknown types as other', async () => {
    const { useMistakes } = await import('../../composables/useMistakes')
    const { addMistake, getMistake } = useMistakes()
    const id = addMistake({ original: 'a', corrected: 'b', type: 'spelling' })
    expect(getMistake(id).type).toBe('other')
  })
})

describe('pickMistakeIds', () => {
  const srs = (reviewed = {}, due = []) => ({
    getWordSRS: id => reviewed[id] || null,
    getDueWords: cards => due.map(id => cards.find(c => c.id === id)).filter(Boolean),
  })
  const m = (id, type, createdAt) => ({ id, type, createdAt })

  it('puts Mandarin-speaker error types first among new mistakes', () => {
    const list = [m('a', 'word-choice', '2026-11-03'), m('b', 'article', '2026-11-01'), m('c', 'other', '2026-11-04')]
    expect(pickMistakeIds(list, srs(), 2, 2)).toEqual(['b', 'c'])
  })

  it('reviews due mistakes before new ones and keeps slots for new', () => {
    const list = [m('a', 'other', '2026-11-01'), m('b', 'other', '2026-11-02'), m('c', 'tense', '2026-11-03'), m('d', 'other', '2026-11-04')]
    const s = srs({ 'mistake:a': {}, 'mistake:b': {} }, ['mistake:a', 'mistake:b'])
    expect(pickMistakeIds(list, s, 3, 2)).toEqual(['a', 'c', 'd'])
  })
})

describe('diffWords', () => {
  it('matches ignoring case and punctuation', () => {
    expect(diffWords('i went home', 'I went home.').matches).toBe(true)
  })

  it('marks words that differ from the target', () => {
    const { parts, matches } = diffWords('He go to school', 'He goes to school.')
    expect(matches).toBe(false)
    expect(parts.filter(p => !p.same).map(p => p.text)).toEqual(['goes'])
  })
})

describe('buildListening', () => {
  const pattern = (id, examples) => ({ id, examples })
  const p1 = pattern('p1', [{ en: 'If you ask me, it is too loud.', zh: '要我說的話，太吵了。' }, { en: 'If you ask me, no.', zh: '' }])
  const p2 = pattern('p2', [{ en: 'I would say it is fine.', zh: '' }, { en: 'I would say it is a bit too long.', zh: '' }])

  it('builds a choose item with the heard sentence among the options, and a dictation', () => {
    const items = buildListening([p1], [], [p1, p2])
    expect(items.map(i => i.mode)).toEqual(['choose', 'dictation'])
    expect(items[0].options).toContain(items[0].en)
    expect(items[0].options).toHaveLength(3)
    expect(items[1].en).toBe('If you ask me, no.')
  })

  it('returns nothing without example sentences', () => {
    expect(buildListening([], [], [])).toEqual([])
  })
})
