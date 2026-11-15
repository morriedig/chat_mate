import { describe, it, expect, vi, beforeEach } from 'vitest'
import { normalizeSentence } from '../../composables/useMistakes'
import { diffWords } from '../../utils/wordDiff'

// Chinese edition: Chinese mistakes are kept and compared per character
vi.mock('../../edition', async () => (await import('../helpers/editions.js')).zhEdition)

describe('normalizeSentence (Chinese edition)', () => {
  it('keeps Chinese characters and drops Chinese punctuation and spaces between characters', () => {
    expect(normalizeSentence('我要一杯珍奶。')).toBe('我要一杯珍奶')
    expect(normalizeSentence('我 要，一杯「珍奶」！')).toBe('我要一杯珍奶')
    expect(normalizeSentence('我要一杯 latte。')).toBe('我要一杯 latte')
  })
})

describe('useMistakes (Chinese edition)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('saves a Chinese correction, with its own id per pair and a Chinese error type', async () => {
    const { useMistakes } = await import('../../composables/useMistakes')
    const { addMistake, getMistake } = useMistakes()
    const a = addMistake({ original: '我要一個咖啡。', corrected: '我要一杯咖啡。', type: 'measure-word' })
    const b = addMistake({ original: '我昨天去學校了了', corrected: '我昨天去了學校', type: 'aspect' })
    expect(a).toBeTruthy()
    expect(b).toBeTruthy()
    expect(a).not.toBe(b)
    expect(getMistake(a).type).toBe('measure-word')
    expect(getMistake(b).type).toBe('aspect')
  })

  it('ignores a Chinese pair that only differs in punctuation', async () => {
    const { useMistakes } = await import('../../composables/useMistakes')
    const { addMistake } = useMistakes()
    expect(addMistake({ original: '我要一杯咖啡', corrected: '我要一杯咖啡。' })).toBeNull()
  })

  it('accepts every Chinese error type', async () => {
    const { MISTAKE_TYPES } = await import('../../composables/useMistakes')
    expect(MISTAKE_TYPES).toEqual(expect.arrayContaining(['measure-word', 'aspect', 'word-order', 'de-particle']))
  })
})

describe('diffWords (Chinese edition)', () => {
  it('compares per character, so different sentences no longer match', () => {
    expect(diffWords('隨便打', '我要一杯珍奶').matches).toBe(false)
  })

  it('ignores punctuation and spaces', () => {
    expect(diffWords('我要 一杯珍奶', '我要一杯珍奶。').matches).toBe(true)
  })

  it('marks the characters that differ and shows punctuation with the character before it', () => {
    const { parts, matches } = diffWords('我要一個珍奶', '我要一杯珍奶。')
    expect(matches).toBe(false)
    expect(parts.filter(p => !p.same).map(p => p.text)).toEqual(['杯'])
    expect(parts.map(p => p.text).join('')).toBe('我要一杯珍奶。')
    expect(parts.every(p => p.space === false)).toBe(true)
  })

  it('keeps English words whole inside Chinese text', () => {
    const { parts, matches } = diffWords('我要一杯 Latte', '我要一杯latte。')
    expect(matches).toBe(true)
    expect(parts.map(p => p.text)).toEqual(['我', '要', '一', '杯', 'latte。'])
  })

})
