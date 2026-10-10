import { describe, it, expect } from 'vitest'
import yaml from 'js-yaml'
import fs from 'node:fs'
import path from 'node:path'
import {
  detectConnectors,
  findConnectorSpans,
  segmentByConnectors,
  CONNECTOR_PATTERNS,
} from '../../utils/connectorDetect'

const ALL = Object.keys(CONNECTOR_PATTERNS)

describe('detectConnectors', () => {
  it('returns matched target ids in target order', () => {
    const text = 'I prefer the office because I focus better. Plus, lunch is free.'
    expect(detectConnectors(text, ['plus', 'because', 'since'])).toEqual(['plus', 'because'])
  })

  it('is case-insensitive', () => {
    expect(detectConnectors('BECAUSE it is cheaper', ['because'])).toEqual(['because'])
    expect(detectConnectors('On Top Of That, it is quiet.', ['on-top-of-that'])).toEqual(['on-top-of-that'])
  })

  it('respects word boundaries', () => {
    // "also" inside "falsehood", "plus" inside "surplus", "so" inside "also"/"some"
    expect(detectConnectors('a surplus of falsehood and some reasons', ALL)).toEqual([])
    expect(detectConnectors('I am also tired', ['so'])).toEqual([])
  })

  it('does not count "so that" as "so"', () => {
    const text = 'I left early so that I could catch the bus.'
    expect(detectConnectors(text, ['so', 'so-that'])).toEqual(['so-that'])
    expect(detectConnectors(text, ['so'])).toEqual([])
  })

  it('does not count "because of" as "because"', () => {
    const text = 'We stayed inside because of the typhoon.'
    expect(detectConnectors(text, ['because', 'because-of'])).toEqual(['because-of'])
  })

  it('does not count "on top of that" as anything shorter', () => {
    const text = 'On top of that, the rent is cheap.'
    expect(detectConnectors(text)).toEqual(['on-top-of-that'])
  })

  it('counts both when "so" and "so that" each appear separately', () => {
    const text = 'It rained, so we stayed home. I cooked early so that we could eat together.'
    expect(detectConnectors(text, ['so', 'so-that'])).toEqual(['so', 'so-that'])
  })

  it('handles "due to" without leaking "to" and "in order to"', () => {
    expect(detectConnectors('Delayed due to the rain.', ['due-to'])).toEqual(['due-to'])
    expect(detectConnectors('We met in order to plan.', ['in-order-to', 'due-to'])).toEqual(['in-order-to'])
  })

  it('only counts "as" at the start of a sentence', () => {
    expect(detectConnectors('As the office is closed, we meet online.', ['as'])).toEqual(['as'])
    expect(detectConnectors('It is cold. As a result we stayed in.', ['as'])).toEqual(['as'])
    expect(detectConnectors('I like tea as well as coffee.', ['as'])).toEqual([])
    expect(detectConnectors('Work as a team.', ['as'])).toEqual([])
  })

  it('ignores intensifier / time uses that are blocked', () => {
    expect(detectConnectors('I love it so much.', ['so'])).toEqual([])
    expect(detectConnectors('So far it works.', ['so'])).toEqual([])
    expect(detectConnectors('I have lived here ever since.', ['since'])).toEqual([])
  })

  it('accepts curly apostrophes in "What’s your take?"', () => {
    expect(detectConnectors('What’s your take?', ['whats-your-take'])).toEqual(['whats-your-take'])
    expect(detectConnectors("what's your take", ['whats-your-take'])).toEqual(['whats-your-take'])
  })

  it('matches across line breaks / extra spaces inside a phrase', () => {
    expect(detectConnectors('which  is\nwhy', ['which-is-why'])).toEqual(['which-is-why'])
  })

  it('accepts target objects with an id and de-duplicates', () => {
    expect(detectConnectors('because', [{ id: 'because' }, 'because'])).toEqual(['because'])
  })

  it('returns [] for empty or non-string input', () => {
    expect(detectConnectors('', ['because'])).toEqual([])
    expect(detectConnectors(null, ['because'])).toEqual([])
    expect(detectConnectors(undefined)).toEqual([])
  })

  it('never detects to-purpose (ambiguous by design)', () => {
    expect(detectConnectors('I went to the gym to relax.', ['to-purpose'])).toEqual([])
  })

  it('every pattern id exists in the Giving Reasons chapter', () => {
    const file = path.resolve(__dirname, '../../data/chapters/en/intermediate/09-giving-reasons.yml')
    const chapter = yaml.load(fs.readFileSync(file, 'utf8'))
    const chapterIds = chapter.words.map(w => w.id)
    for (const id of ALL) expect(chapterIds).toContain(id)
  })
})

describe('findConnectorSpans / segmentByConnectors', () => {
  it('returns spans with positions sorted by start', () => {
    const text = 'Since it rains, so we stay.'
    const spans = findConnectorSpans(text)
    expect(spans.map(s => s.id)).toEqual(['since', 'so'])
    expect(text.slice(spans[0].start, spans[0].end)).toBe('Since')
  })

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
})
