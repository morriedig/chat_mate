import { describe, it, expect } from 'vitest'
import { analyzeStructure, splitSentences, pickBestSentence } from '../../utils/opinionStructure'

describe('splitSentences', () => {
  it('splits on sentence punctuation and line breaks', () => {
    expect(splitSentences('I think so. Why?\nBecause it is fun!')).toEqual([
      'I think so.', 'Why?', 'Because it is fun!',
    ])
  })

  it('returns [] for empty text', () => {
    expect(splitSentences('')).toEqual([])
    expect(splitSentences('  ...  ')).toEqual([])
  })
})

describe('analyzeStructure (3-part heuristic)', () => {
  it('detects all three parts in a full answer', () => {
    const text = 'I think working from home is better because I can focus. On top of that, I save an hour a day. What\'s your take?'
    expect(analyzeStructure(text)).toMatchObject({ opinion: true, reason: true, wrapUp: true, sentenceCount: 3 })
  })

  it('detects opinion + reason without wrap-up', () => {
    const text = 'In my opinion, cash is still useful since some shops do not take cards.'
    expect(analyzeStructure(text)).toMatchObject({ opinion: true, reason: true, wrapUp: false })
  })

  it('does not count wrap-up in a single-sentence answer', () => {
    expect(analyzeStructure('Do you think so?').wrapUp).toBe(false)
  })

  it('counts a closing question or closing marker as wrap-up', () => {
    expect(analyzeStructure('I prefer tea. How about you?').wrapUp).toBe(true)
    expect(analyzeStructure('I prefer tea because it is calm. Overall, tea wins.').wrapUp).toBe(true)
  })

  it('flags a bare reason with no opinion', () => {
    const r = analyzeStructure('Because the train was late.')
    expect(r.opinion).toBe(false)
    expect(r.reason).toBe(true)
  })

  it('accepts curly apostrophes in opinion markers', () => {
    expect(analyzeStructure('I’d say no, because it costs too much.').opinion).toBe(true)
  })

  it('accepts "the reason is" / "for example" as reasons', () => {
    expect(analyzeStructure('I like it. The reason is the price.').reason).toBe(true)
    expect(analyzeStructure('I like it. For example, the coffee.').reason).toBe(true)
  })

  it('returns all false for empty input', () => {
    expect(analyzeStructure('')).toEqual({ opinion: false, reason: false, wrapUp: false, sentenceCount: 0 })
  })
})

describe('pickBestSentence', () => {
  it('prefers the sentence with the most connectors, weighting targets', () => {
    const text = 'I think yes. It is cheaper, so people like it. Plus, it is faster because of the new line.'
    expect(pickBestSentence(text, ['plus'])).toBe('Plus, it is faster because of the new line.')
  })

  it('falls back to the longest sentence when none has connectors', () => {
    expect(pickBestSentence('Yes. I really like this idea.')).toBe('I really like this idea.')
  })

  it('returns null for empty text', () => {
    expect(pickBestSentence('')).toBeNull()
  })
})
