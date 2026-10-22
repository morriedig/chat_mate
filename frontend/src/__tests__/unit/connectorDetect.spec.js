import { describe, it, expect } from 'vitest'
import { detectConnectors, normalizePhrase } from '../../utils/connectorDetect'

// Mirrors the giving-reasons chapter connectors
const targets = [
  { id: 'because', phrase: 'because' },
  { id: 'since', phrase: 'since' },
  { id: 'due-to', phrase: 'due to' },
  { id: 'because-of', phrase: 'because of' },
  { id: 'so', phrase: 'so' },
  { id: 'which-is-why', phrase: 'which is why' },
  { id: 'so-that', phrase: 'so that' },
  { id: 'plus', phrase: 'plus' },
  { id: 'also', phrase: 'also' },
  { id: 'on-top-of-that', phrase: 'on top of that' },
  { id: 'whats-your-take', phrase: "What's your take" }
]

describe('detectConnectors', () => {
  it('returns [] for empty input', () => {
    expect(detectConnectors('', targets)).toEqual([])
    expect(detectConnectors('because', [])).toEqual([])
    expect(detectConnectors(null, targets)).toEqual([])
  })

  it('matches case-insensitively', () => {
    expect(detectConnectors('SINCE it rained, we stayed in.', targets)).toEqual(['since'])
  })

  it('respects word boundaries', () => {
    // "so" must not match inside "also", "some" or "sofa"; "plus" not inside "surplus"
    expect(detectConnectors('Some people sit on the sofa.', targets)).toEqual([])
    expect(detectConnectors('I also think so.', targets)).toEqual(['so', 'also'])
    expect(detectConnectors('The surplus was huge.', targets)).toEqual([])
  })

  it('does not count "so" inside "so that"', () => {
    expect(detectConnectors('I left early so that I could rest.', targets)).toEqual(['so-that'])
  })

  it('counts both when "so" and "so that" appear separately', () => {
    const text = 'It rained, so we stayed in. I cooked so that we could eat early.'
    expect(detectConnectors(text, targets)).toEqual(['so', 'so-that'])
  })

  it('does not count "because" inside "because of"', () => {
    expect(detectConnectors('We stayed in because of the typhoon.', targets)).toEqual(['because-of'])
  })

  it('matches multi-word phrases across extra whitespace and line breaks', () => {
    expect(detectConnectors('On top\nof  that, it is cheap.', targets)).toEqual(['on-top-of-that'])
  })

  it('handles apostrophes, curly quotes and trailing punctuation', () => {
    expect(detectConnectors('I like it. What’s your take?', targets)).toEqual(['whats-your-take'])
  })

  it('finds several connectors in one message, in target order', () => {
    const text = 'Plus, the rent is low, which is why I moved. Due to the noise I left.'
    expect(detectConnectors(text, targets)).toEqual(['due-to', 'which-is-why', 'plus'])
  })

  it('accepts a phrases array per target', () => {
    const custom = [{ id: 'in-order-to', phrases: ['in order to', 'in order not to'] }]
    expect(detectConnectors('I left in order not to be late.', custom)).toEqual(['in-order-to'])
  })
})

describe('normalizePhrase', () => {
  it('lowercases, normalizes quotes and strips punctuation', () => {
    expect(normalizePhrase('  What’s your TAKE? ')).toBe("what's your take")
  })
})
