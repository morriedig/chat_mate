import { describe, it, expect } from 'vitest'
import { detectConnectors, findConnectorSpans, splitByConnectors } from '../../utils/connectorDetect'
import { CONNECTOR_TARGETS } from '../../data/opinionChat'

const detect = (text) => detectConnectors(text, CONNECTOR_TARGETS)

describe('detectConnectors', () => {
  describe('basic matching', () => {
    it('finds a single connector', () => {
      expect(detect('I like it because it is quiet.')).toEqual(['because'])
    })

    it('is case-insensitive', () => {
      expect(detect('BECAUSE I said so')).toEqual(['because'])
      expect(detect('Since everyone is here, let\'s start.')).toEqual(['since'])
    })

    it('returns ids in order of first appearance, without duplicates', () => {
      expect(detect('Plus, it is cheap. Also, because it is close, and because I like it.'))
        .toEqual(['plus', 'also', 'because'])
    })

    it('returns an empty list for empty input or no targets', () => {
      expect(detect('')).toEqual([])
      expect(detect(null)).toEqual([])
      expect(detectConnectors('because', [])).toEqual([])
    })

    it('respects word boundaries', () => {
      expect(detect('My friend Alsop ate a surplus of plums.')).toEqual([])
      expect(detect('Becauseofthat')).toEqual([])
    })

    it('handles curly apostrophes', () => {
      expect(detect('I’d keep it. What’s your take?')).toEqual(['whats-your-take'])
    })

    it('tolerates extra whitespace inside multi-word phrases', () => {
      expect(detect('On top  of\nthat, it is free.')).toEqual(['on-top-of-that'])
    })
  })

  describe('multi-word phrases win over shorter ones', () => {
    it('"so that" does not also count as "so"', () => {
      expect(detect('I left early so that I could catch the bus.')).toEqual(['so-that'])
    })

    it('"because of" does not also count as "because"', () => {
      expect(detect('We stayed inside because of the typhoon.')).toEqual(['because-of'])
    })

    it('"so that\'s why" counts as "so", not "so that"', () => {
      expect(detect('It rained, so that\'s why I stayed home.')).toEqual(['so'])
    })

    it('keeps both when they appear separately', () => {
      expect(detect('I was tired, so I left. I left early so that I could rest. Because of that, I slept well.'))
        .toEqual(['so', 'so-that', 'because-of'])
    })

    it('detects longer connectors', () => {
      expect(detect('Users are on phones, which is why we started there.')).toEqual(['which-is-why'])
      expect(detect('We cut it short in order to save time.')).toEqual(['in-order-to'])
      expect(detect('Another reason is that the rent is low.')).toEqual(['another-reason-is'])
      expect(detect('The flight was late due to the weather.')).toEqual(['due-to'])
    })
  })

  describe('ambiguous words', () => {
    it('ignores "so" used as an intensifier or filler', () => {
      expect(detect('The movie was so good.')).toEqual([])
      expect(detect('I think so.')).toEqual([])
      expect(detect('So far it is fine.')).toEqual([])
      expect(detect('Thanks so much!')).toEqual([])
    })

    it('counts "so" that introduces a result', () => {
      expect(detect('It was raining so we stayed home.')).toEqual(['so'])
      expect(detect('The demo went well. So the client signed.')).toEqual(['so'])
    })

    it('ignores "since" about time', () => {
      expect(detect('I have lived here since 2019.')).toEqual([])
      expect(detect('Ever since I was a kid, I loved it.')).toEqual([])
      expect(detect('Things changed since last year.')).toEqual([])
    })

    it('counts "since" that gives a reason', () => {
      expect(detect('Since it is late, let\'s go home.')).toEqual(['since'])
    })

    it('only counts "as" at the start of a reason clause', () => {
      expect(detect('As the office is closed, we will meet online.')).toEqual(['as'])
      expect(detect('It is as big as a house.')).toEqual([])
      expect(detect('As a teacher, I disagree.')).toEqual([])
      expect(detect('I like tea as well.')).toEqual([])
    })
  })
})

describe('findConnectorSpans', () => {
  it('returns positions that slice back to the original text', () => {
    const text = 'I agree, because it saves time. On top of that, it is fun.'
    const spans = findConnectorSpans(text, CONNECTOR_TARGETS)
    expect(spans.map(s => text.slice(s.start, s.end))).toEqual(['because', 'On top of that'])
  })
})

describe('splitByConnectors', () => {
  it('splits text into plain and connector segments', () => {
    expect(splitByConnectors('Yes, because it is fun', CONNECTOR_TARGETS)).toEqual([
      { text: 'Yes, ', id: null },
      { text: 'because', id: 'because' },
      { text: ' it is fun', id: null },
    ])
  })

  it('returns a single plain segment when nothing matches', () => {
    expect(splitByConnectors('Hello there', CONNECTOR_TARGETS)).toEqual([{ text: 'Hello there', id: null }])
  })
})
