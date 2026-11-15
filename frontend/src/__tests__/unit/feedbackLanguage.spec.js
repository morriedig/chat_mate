import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// English edition: requests stay as they were, and no pinyin is loaded
vi.mock('../../edition', () => import('../helpers/englishEdition'))

async function load(path) {
  vi.resetModules()
  vi.stubEnv('VITE_API_URL', 'http://api.test/chat')
  vi.doMock('../../composables/useChatApi', () => ({
    getAuthToken: vi.fn(() => Promise.resolve('token')),
    requestAuthToken: vi.fn(() => Promise.resolve('token2')),
    clearAuthToken: vi.fn(),
  }))
  return import(path)
}

function mockFetch(body) {
  const fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve(body) }))
  vi.stubGlobal('fetch', fetch)
  return fetch
}

const sentBody = fetch => JSON.parse(fetch.mock.calls[0][1].body)

describe('English edition requests', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('sentence check sends no language field', async () => {
    const fetch = mockFetch({ success: true, check: {} })
    const { useSentenceCheck } = await load('../../composables/useSentenceCheck')
    await useSentenceCheck().checkSentence({ sentence: 'I would like tea.', pattern: "I'd like", meaning: '', task: '', level: 'beginner', nativeLanguage: 'zh' })
    expect(sentBody(fetch)).not.toHaveProperty('language')
    expect(sentBody(fetch).action).toBe('sentence-check')
  })

  it('chat summary sends no language field', async () => {
    const fetch = mockFetch({ success: true, summary: { points: [] } })
    const { useChatSummary } = await load('../../composables/useChatSummary')
    await useChatSummary().summarize({ messages: [{ role: 'user', content: 'hi' }], level: 'beginner', nativeLanguage: 'zh' })
    expect(sentBody(fetch)).not.toHaveProperty('language')
    expect(sentBody(fetch).action).toBe('chat-summary')
  })
})

describe('English edition pinyin', () => {
  it('loads nothing', async () => {
    vi.resetModules()
    const { loadPinyin } = await import('../../utils/pinyin')
    await expect(loadPinyin()).resolves.toBeNull()
  })
})
