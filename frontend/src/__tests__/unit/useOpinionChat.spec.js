import { describe, it, expect, beforeEach } from 'vitest'
import {
  buildOpinionSummary,
  getHintBatch,
  splitSentences,
  useOpinionChat,
} from '../../composables/useOpinionChat'
import { HINT_POOL, OPINION_TOPICS } from '../../data/opinionChat'

const user = (content) => ({ role: 'user', content })
const bot = (content) => ({ role: 'assistant', content })

describe('splitSentences', () => {
  it('splits on end punctuation and newlines', () => {
    expect(splitSentences('I agree. It is cheap!\nWhy not?')).toEqual(['I agree.', 'It is cheap!', 'Why not?'])
  })

  it('handles empty input', () => {
    expect(splitSentences('')).toEqual([])
    expect(splitSentences(undefined)).toEqual([])
  })
})

describe('buildOpinionSummary', () => {
  it('lists connectors used with the sentence they appeared in', () => {
    const summary = buildOpinionSummary([
      bot('Office or home?'),
      user('Home, I think. Because I can focus better.'),
      bot('Why is that?'),
      user('It is quiet. On top of that, I save two hours a day.'),
    ])

    expect(summary.userTurns).toBe(2)
    expect(summary.used).toEqual([
      { id: 'because', sentence: 'Because I can focus better.' },
      { id: 'on-top-of-that', sentence: 'On top of that, I save two hours a day.' },
    ])
  })

  it('ignores connectors in the AI friend\'s messages', () => {
    const summary = buildOpinionSummary([
      bot('I love it because it is fun, plus it is cheap.'),
      user('Me too.'),
    ])
    expect(summary.used).toEqual([])
  })

  it('quotes the first sentence for a repeated connector', () => {
    const summary = buildOpinionSummary([
      user('I like it because it is fun.'),
      user('I also like it because it is cheap.'),
    ])
    expect(summary.used.find(u => u.id === 'because').sentence).toBe('I like it because it is fun.')
  })

  it('suggests up to two unused connectors to try next', () => {
    const summary = buildOpinionSummary([user('I prefer cats because they are calm.')])
    expect(summary.tryNext).toEqual(['since', 'so-that'])
  })

  it('suggests from the custom order and skips what was used', () => {
    const summary = buildOpinionSummary(
      [user('Since it is late, let\'s go.')],
      undefined,
      ['since', 'plus', 'also'],
    )
    expect(summary.tryNext).toEqual(['plus', 'also'])
  })

  it('picks the sentence with the most connectors as the best sentence', () => {
    const summary = buildOpinionSummary([
      user('I like it because it is fun.'),
      user('Since it is close, I go often, plus it is cheap.'),
      user('It is a really really really long sentence without any connectors at all in it.'),
    ])
    expect(summary.bestSentence).toBe('Since it is close, I go often, plus it is cheap.')
  })

  it('falls back to the longest sentence when no connector was used', () => {
    const summary = buildOpinionSummary([
      user('Yes.'),
      user('I think working from home is better for me.'),
      user('Dogs are fun.'),
    ])
    expect(summary.used).toEqual([])
    expect(summary.bestSentence).toBe('I think working from home is better for me.')
    expect(summary.tryNext).toEqual(['because', 'since'])
  })

  it('returns an empty summary for no user messages', () => {
    expect(buildOpinionSummary([bot('Hi!')])).toEqual({
      userTurns: 0,
      used: [],
      tryNext: ['because', 'since'],
      bestSentence: null,
    })
  })
})

describe('getHintBatch', () => {
  it('returns the requested number of hints', () => {
    expect(getHintBatch(0)).toHaveLength(4)
    expect(getHintBatch(0)).toEqual(HINT_POOL.slice(0, 4))
  })

  it('rotates to different hints on the next round', () => {
    const first = getHintBatch(0)
    const second = getHintBatch(1)
    expect(second.some(id => !first.includes(id))).toBe(true)
  })

  it('leaves out connectors the user already used', () => {
    const batch = getHintBatch(0, ['because', 'since'])
    expect(batch).not.toContain('because')
    expect(batch).not.toContain('since')
    expect(batch).toHaveLength(4)
  })

  it('falls back to the full pool when almost everything is used', () => {
    const batch = getHintBatch(2, HINT_POOL.slice(0, HINT_POOL.length - 2))
    expect(batch).toHaveLength(4)
    batch.forEach(id => expect(HINT_POOL).toContain(id))
  })

  it('has no duplicates within a batch', () => {
    for (let round = 0; round < 10; round++) {
      const batch = getHintBatch(round)
      expect(new Set(batch).size).toBe(batch.length)
    }
  })
})

describe('useOpinionChat', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('rotates topics and wraps around', () => {
    const { topic, nextTopic } = useOpinionChat()
    const startId = topic.value.id
    const seen = new Set([startId])
    for (let i = 0; i < OPINION_TOPICS.length - 1; i++) seen.add(nextTopic().id)
    expect(seen.size).toBe(OPINION_TOPICS.length)
    expect(nextTopic().id).toBe(startId)
  })

  it('remembers which topic a character\'s chat is on', () => {
    const { markChatTopic, isChatOnCurrentTopic, nextTopic } = useOpinionChat()
    markChatTopic('emma')
    expect(isChatOnCurrentTopic('emma')).toBe(true)
    expect(isChatOnCurrentTopic('marcus')).toBe(false)
    nextTopic()
    expect(isChatOnCurrentTopic('emma')).toBe(false)
  })

  it('reads connector info from the giving-reasons chapter in the mother tongue', () => {
    const { getConnectorInfo } = useOpinionChat()
    expect(getConnectorInfo('so-that', 'zh')).toMatchObject({ label: 'so that', insert: 'so that', meaning: '為了能夠・以便' })
    expect(getConnectorInfo('because', 'en').meaning).toBe('')
    expect(getConnectorInfo('whats-your-take', 'ja').insert).toBe("What's your take?")
  })
})
