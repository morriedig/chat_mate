import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const GAS_URL = 'https://script.google.com/macros/s/test/exec'

function jsonResponse(data) {
  return Promise.resolve({ json: () => Promise.resolve(data) })
}

async function loadComposable() {
  vi.resetModules()
  vi.stubEnv('VITE_API_URL', GAS_URL)
  const { useDiaryFeedback } = await import('../../composables/useDiaryFeedback')
  return useDiaryFeedback()
}

const params = {
  diaryText: 'I think working from home is better because I save time.',
  language: 'en',
  level: 'intermediate',
  characterId: 'emma',
  nativeLanguage: 'zh',
  streakDays: 1,
}

describe('useDiaryFeedback', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('sends an auth token with the feedback request', async () => {
    const fetchMock = vi.fn((url) => url.includes('action=token')
      ? jsonResponse({ success: true, token: 'token-1' })
      : jsonResponse({ success: true, feedback: { score: 8 } }))
    vi.stubGlobal('fetch', fetchMock)

    const { fetchFeedback } = await loadComposable()
    const feedback = await fetchFeedback(params)

    expect(feedback).toEqual({ score: 8 })
    const body = JSON.parse(fetchMock.mock.calls.at(-1)[1].body)
    expect(body.action).toBe('diary-feedback')
    expect(body.authToken).toBe('token-1')
  })

  it('refreshes the token and retries once on a token error', async () => {
    let tokenCount = 0
    let postCount = 0
    const fetchMock = vi.fn((url) => {
      if (url.includes('action=token')) {
        tokenCount++
        return jsonResponse({ success: true, token: `token-${tokenCount}` })
      }
      postCount++
      return postCount === 1
        ? jsonResponse({ success: false, isTokenError: true, error: 'Invalid or expired token.' })
        : jsonResponse({ success: true, feedback: { score: 7 } })
    })
    vi.stubGlobal('fetch', fetchMock)

    const { fetchFeedback, error } = await loadComposable()
    const feedback = await fetchFeedback(params)

    expect(feedback).toEqual({ score: 7 })
    expect(error.value).toBeNull()
    expect(postCount).toBe(2)
    expect(JSON.parse(fetchMock.mock.calls.at(-1)[1].body).authToken).toBe('token-2')
  })
})
