import { describe, it, expect } from 'vitest'
import yaml from 'js-yaml'
import fs from 'node:fs'
import path from 'node:path'
import {
  detectConnectors,
  detectConnectorsInOrder,
  findConnectorSpans,
  segmentByConnectors,
  splitByConnectors,
  normalizePhrase,
  CONNECTOR_PATTERNS,
  GIVING_REASONS_TARGETS,
} from '../../utils/connectorDetect'
import { CONNECTOR_TARGETS } from '../../data/opinionChat'

const ALL = Object.keys(CONNECTOR_PATTERNS)

// Shape used by the lesson-first mission: chapter-derived { id, phrase } targets
const phraseTargets = [
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

// Shape used by the opinion chat: { id, phrases } objects
const detect = (text) => detectConnectors(text, CONNECTOR_TARGETS)

describe('target formats', () => {
  it('opinion-chat targets are the built-in connectors', () => {
    expect(CONNECTOR_TARGETS).toBe(GIVING_REASONS_TARGETS)
    expect(CONNECTOR_TARGETS.map(t => t.id)).not.toContain('to-purpose')
  })

  it('accepts ids, { id } objects and { id, phrase } objects, de-duplicated', () => {
    expect(detectConnectors('because', ['because'])).toEqual(['because'])
    expect(detectConnectors('because', [{ id: 'because' }, 'because'])).toEqual(['because'])
    expect(detectConnectors('because', [{ id: 'x_because', phrase: 'because' }])).toEqual(['x_because'])
  })

  it('accepts a phrases array per target', () => {
    const custom = [{ id: 'in-order-to', phrases: ['in order to', 'in order not to'] }]
    expect(detectConnectors('I left in order not to be late.', custom)).toEqual(['in-order-to'])
  })

  it('applies built-in rules to chapter-prefixed targets by phrase', () => {
    const t = [{ id: 'giving-reasons_so', phrase: 'so' }, { id: 'giving-reasons_since', phrase: 'since' }]
    expect(detectConnectors('The movie was so good.', t)).toEqual([])
    expect(detectConnectors('I have lived here since 2019.', t)).toEqual([])
    expect(detectConnectors('It rained, so we stayed in.', t)).toEqual(['giving-reasons_so'])
  })

  it('lets a custom accept() override the built-in rule', () => {
    const t = [{ id: 'so', phrase: 'so', accept: () => true }]
    expect(detectConnectors('I think so.', t)).toEqual(['so'])
  })

  it('returns [] for empty / non-string input or empty targets', () => {
    expect(detectConnectors('', ['because'])).toEqual([])
    expect(detectConnectors(null, ['because'])).toEqual([])
    expect(detectConnectors(undefined)).toEqual([])
    expect(detectConnectors('because', [])).toEqual([])
    expect(detect('')).toEqual([])
    expect(detect(null)).toEqual([])
  })
})

describe('ordering', () => {
  it('detectConnectors returns ids in target order', () => {
    const text = 'I prefer the office because I focus better. Plus, lunch is free.'
    expect(detectConnectors(text, ['plus', 'because', 'since'])).toEqual(['plus', 'because'])
    const text2 = 'Plus, the rent is low, which is why I moved. Due to the noise I left.'
    expect(detectConnectors(text2, phraseTargets)).toEqual(['due-to', 'which-is-why', 'plus'])
  })

  it('detectConnectorsInOrder returns ids in order of first appearance, without duplicates', () => {
    expect(detectConnectorsInOrder('Plus, it is cheap. Also, because it is close, and because I like it.', CONNECTOR_TARGETS))
      .toEqual(['plus', 'also', 'because'])
  })
})

describe('basic matching', () => {
  it('is case-insensitive', () => {
    expect(detectConnectors('BECAUSE it is cheaper', ['because'])).toEqual(['because'])
    expect(detectConnectors('On Top Of That, it is quiet.', ['on-top-of-that'])).toEqual(['on-top-of-that'])
    expect(detect('BECAUSE I said so')).toEqual(['because'])
    expect(detectConnectors('SINCE it rained, we stayed in.', phraseTargets)).toEqual(['since'])
    expect(detect("Since everyone is here, let's start.")).toEqual(['since'])
  })

  it('respects word boundaries', () => {
    expect(detectConnectors('a surplus of falsehood and some reasons', ALL)).toEqual([])
    expect(detectConnectors('I am also tired', ['so'])).toEqual([])
    expect(detectConnectors('Some people sit on the sofa.', phraseTargets)).toEqual([])
    expect(detect('My friend Alsop ate a surplus of plums.')).toEqual([])
    expect(detect('Becauseofthat')).toEqual([])
  })

  it('handles straight and curly apostrophes', () => {
    expect(detectConnectors('What’s your take?', ['whats-your-take'])).toEqual(['whats-your-take'])
    expect(detectConnectors("what's your take", ['whats-your-take'])).toEqual(['whats-your-take'])
    expect(detectConnectors('I like it. What’s your take?', phraseTargets)).toEqual(['whats-your-take'])
    expect(detect('I’d keep it. What’s your take?')).toEqual(['whats-your-take'])
  })

  it('matches multi-word phrases across extra whitespace and line breaks', () => {
    expect(detectConnectors('which  is\nwhy', ['which-is-why'])).toEqual(['which-is-why'])
    expect(detectConnectors('On top\nof  that, it is cheap.', phraseTargets)).toEqual(['on-top-of-that'])
  })

  it('detects longer connectors', () => {
    expect(detect('Users are on phones, which is why we started there.')).toEqual(['which-is-why'])
    expect(detect('We cut it short in order to save time.')).toEqual(['in-order-to'])
    expect(detect('Another reason is that the rent is low.')).toEqual(['another-reason-is'])
    expect(detect('The flight was late due to the weather.')).toEqual(['due-to'])
  })

  it('counts "that\'s why" / "that is why" as which-is-why', () => {
    expect(detectConnectors("That's why I moved.", ['which-is-why'])).toEqual(['which-is-why'])
    expect(detectConnectors('That is why I moved.', ['which-is-why'])).toEqual(['which-is-why'])
  })

  it('never detects to-purpose (ambiguous by design)', () => {
    expect(detectConnectors('I went to the gym to relax.', ['to-purpose'])).toEqual([])
  })
})

describe('longer phrases win', () => {
  it('"so that" does not also count as "so"', () => {
    const text = 'I left early so that I could catch the bus.'
    expect(detectConnectors(text, ['so', 'so-that'])).toEqual(['so-that'])
    expect(detectConnectors(text, ['so'])).toEqual([])
    expect(detectConnectors(text, [{ id: 'so', phrase: 'so' }])).toEqual([])
    expect(detect(text)).toEqual(['so-that'])
  })

  it('"because of" does not also count as "because"', () => {
    const text = 'We stayed inside because of the typhoon.'
    expect(detectConnectors(text, ['because', 'because-of'])).toEqual(['because-of'])
    expect(detectConnectors(text, phraseTargets)).toEqual(['because-of'])
  })

  it('"on top of that" does not count as anything shorter', () => {
    expect(detectConnectors('On top of that, the rent is cheap.')).toEqual(['on-top-of-that'])
  })

  it('"due to" / "in order to" do not leak into each other', () => {
    expect(detectConnectors('Delayed due to the rain.', ['due-to'])).toEqual(['due-to'])
    expect(detectConnectors('We met in order to plan.', ['in-order-to', 'due-to'])).toEqual(['in-order-to'])
  })

  it('"so that\'s why" is "so" + "that\'s why", not "so that"', () => {
    expect(detect("It rained, so that's why I stayed home.")).toEqual(['so', 'which-is-why'])
  })

  it('counts both when "so" and "so that" appear separately', () => {
    const text = 'It rained, so we stayed home. I cooked early so that we could eat together.'
    expect(detectConnectors(text, ['so', 'so-that'])).toEqual(['so', 'so-that'])
    expect(detectConnectors(text, phraseTargets)).toEqual(['so', 'so-that'])
    expect(detectConnectorsInOrder('I was tired, so I left. I left early so that I could rest. Because of that, I slept well.', CONNECTOR_TARGETS))
      .toEqual(['so', 'so-that', 'because-of'])
  })
})

describe('ambiguous words', () => {
  it('ignores "so" used as an intensifier or filler', () => {
    expect(detect('The movie was so good.')).toEqual([])
    expect(detect('I think so.')).toEqual([])
    expect(detectConnectors('I also think so.', phraseTargets)).toEqual(['also'])
    expect(detect('So far it is fine.')).toEqual([])
    expect(detect('Thanks so much!')).toEqual([])
    expect(detectConnectors('I love it so much.', ['so'])).toEqual([])
  })

  it('counts "so" that introduces a result', () => {
    expect(detect('It was raining so we stayed home.')).toEqual(['so'])
    expect(detect('The demo went well. So the client signed.')).toEqual(['so'])
  })

  it('ignores "since" about time', () => {
    expect(detect('I have lived here since 2019.')).toEqual([])
    expect(detect('Ever since I was a kid, I loved it.')).toEqual([])
    expect(detect('Things changed since last year.')).toEqual([])
    expect(detectConnectors('I have lived here ever since.', ['since'])).toEqual([])
  })

  it('counts "since" that gives a reason', () => {
    expect(detect("Since it is late, let's go home.")).toEqual(['since'])
  })

  it('only counts "as" at the start of a reason clause', () => {
    expect(detect('As the office is closed, we will meet online.')).toEqual(['as'])
    expect(detectConnectors('It is late, as the bus stopped running.', ['as'])).toEqual(['as'])
    expect(detect('It is as big as a house.')).toEqual([])
    expect(detect('As a teacher, I disagree.')).toEqual([])
    // "As a result" is a result phrase, not reason-"as"
    expect(detectConnectors('It is cold. As a result we stayed in.', ['as'])).toEqual([])
    expect(detect('I like tea as well.')).toEqual([])
    expect(detectConnectors('I like tea as well as coffee.', ['as'])).toEqual([])
    expect(detectConnectors('Work as a team.', ['as'])).toEqual([])
  })
})

describe('findConnectorSpans', () => {
  it('returns positions that slice back to the original text', () => {
    const text = 'I agree, because it saves time. On top of that, it is fun.'
    const spans = findConnectorSpans(text, CONNECTOR_TARGETS)
    expect(spans.map(s => text.slice(s.start, s.end))).toEqual(['because', 'On top of that'])
    expect(spans.map(s => s.text)).toEqual(['because', 'On top of that'])
  })

  it('finds every built-in connector when targets are omitted, sorted by start', () => {
    const text = 'Since it rains, so we stay.'
    const spans = findConnectorSpans(text)
    expect(spans.map(s => s.id)).toEqual(['since', 'so'])
    expect(text.slice(spans[0].start, spans[0].end)).toBe('Since')
  })
})

describe('segmentByConnectors / splitByConnectors', () => {
  it('segments text so joined segments equal the original', () => {
    const text = 'I agree because it saves time. Plus, it is fun!'
    const segs = segmentByConnectors(text)
    expect(segs.map(s => s.text).join('')).toBe(text)
    expect(segs.filter(s => s.id).map(s => s.id)).toEqual(['because', 'plus'])
  })

  it('can limit highlighting to given ids', () => {
    const segs = segmentByConnectors('because plus', ['plus'])
    expect(segs.filter(s => s.id).map(s => s.id)).toEqual(['plus'])
  })

  it('splits text into plain and connector segments for target objects', () => {
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

describe('normalizePhrase', () => {
  it('lowercases, normalizes quotes and strips punctuation', () => {
    expect(normalizePhrase('  What’s your TAKE? ')).toBe("what's your take")
  })
})

describe('chapter data', () => {
  it('every pattern id exists in the Giving Reasons chapter', () => {
    const file = path.resolve(__dirname, '../../data/chapters/en/intermediate/09-giving-reasons.yml')
    const chapter = yaml.load(fs.readFileSync(file, 'utf8'))
    const chapterIds = chapter.words.map(w => w.id)
    for (const id of ALL) expect(chapterIds).toContain(id)
  })
})
