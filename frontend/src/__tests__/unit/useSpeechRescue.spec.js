import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// The composable reads VITE_API_URL at import time, so each test imports a fresh copy
async function load(apiUrl = 'http://api.test/chat') {
  vi.resetModules()
  vi.stubEnv('VITE_API_URL', apiUrl)
  vi.doMock('../../composables/useChatApi', () => ({
    getAuthToken: vi.fn(() => Promise.resolve('token')),
    requestAuthToken: vi.fn(() => Promise.resolve('token2')),
    clearAuthToken: vi.fn(),
  }))
  return import('../../composables/useSpeechRescue')
}

const messages = [
  { role: 'assistant', content: 'Should we skip the meeting tomorrow?' },
]
const context = { messages, task: null, patterns: [], level: 'intermediate', language: 'en', nativeLanguage: 'zh', sessionType: 'free' }

function mockFetch(body) {
  const fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve(body) }))
  vi.stubGlobal('fetch', fetch)
  return fetch
}

describe('useSpeechRescue: validation', () => {
  it('accepts short unfinished pieces and rejects full sentences', async () => {
    const { isValidPiece, isValidRescue } = await load()
    expect(isValidPiece('I think we should')).toBe(true)
    expect(isValidPiece("can't make the meeting")).toBe(true)
    expect(isValidPiece('I think we should go there')).toBe(false) // 6 words
    expect(isValidPiece('I agree.')).toBe(false)
    expect(isValidPiece('Why not?')).toBe(false)
    expect(isValidPiece('看醫生')).toBe(false)

    expect(isValidRescue({ mode: 'starter', pieces: ['The main reason is'], frame: '' }, 'starter')).toBe(true)
    expect(isValidRescue({ mode: 'starter', pieces: ['Honestly'], frame: '' }, 'starter')).toBe(false)
    expect(isValidRescue({ mode: 'starter', pieces: ['I think', 'so'], frame: '' }, 'starter')).toBe(false)
    expect(isValidRescue({ mode: 'intent', pieces: ['meeting'], frame: '' }, 'intent')).toBe(false)
    expect(isValidRescue({ mode: 'intent', pieces: ["can't make it", 'doctor', 'because'], frame: '' }, 'intent')).toBe(true)
    expect(isValidRescue({ mode: 'frame', pieces: [], frame: "I'd say [your choice], because [your reason]" }, 'frame')).toBe(true)
    expect(isValidRescue({ mode: 'frame', pieces: [], frame: "I'd say pizza, because it's cheap" }, 'frame')).toBe(false)
    expect(isValidRescue({ mode: 'frame', pieces: [], frame: 'I think [x].' }, 'frame')).toBe(false)
    // A rescue for another mode is never shown
    expect(isValidRescue({ mode: 'frame', pieces: [], frame: 'I think [x]' }, 'starter')).toBe(false)
  })
})

describe('useSpeechRescue: fallbacks', () => {
  it('builds a frame with a slot from the target pattern', async () => {
    const { buildFrameFromPattern, fallbackFrame } = await load()
    expect(buildFrameFromPattern('If you ask me, ...')).toBe('If you ask me, [your idea]')
    expect(buildFrameFromPattern("I'd rather ... than ...")).toBe("I'd rather [your idea] than [the rest]")
    expect(buildFrameFromPattern('The thing is')).toBe('The thing is [your idea]')
    expect(fallbackFrame([{ pattern: 'What I mean is ...' }])).toBe('What I mean is [your idea]')
    expect(fallbackFrame([])).toMatch(/\[.+\]/)
  })

  it('never gives a translation when the intent fails', async () => {
    const { buildFallback, FALLBACK_STARTERS } = await load()
    expect(buildFallback('intent')).toEqual({ mode: 'intent', pieces: [], frame: '' })
    expect(FALLBACK_STARTERS).toContain(buildFallback('starter').pieces[0])
  })
})

describe('useSpeechRescue: request', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('sends the last 8 messages under 4000 characters, the task and up to 3 patterns', async () => {
    const { buildRescueRequest } = await load()
    const long = Array.from({ length: 12 }, (_, i) => ({ role: i % 2 ? 'user' : 'assistant', content: `${i} `.padEnd(900, 'x') }))
    const body = buildRescueRequest({
      mode: 'frame',
      messages: long,
      task: { title: 'Plan the weekend', goal: '' },
      patterns: [1, 2, 3, 4].map(i => ({ id: `p${i}`, pattern: `pattern ${i} ...` })),
    })
    expect(body.action).toBe('speech-rescue')
    // 8 × 900 characters is too long: the oldest are cut (or dropped) first
    expect(body.messages.length).toBeLessThanOrEqual(8)
    expect(body.messages.length).toBeGreaterThanOrEqual(4)
    expect(body.messages.reduce((n, m) => n + m.content.length, 0)).toBeLessThanOrEqual(4000)
    expect(body.messages.at(-1).content).toBe(long.at(-1).content) // newest kept whole
    expect(body.targetPatterns).toHaveLength(3)
    expect(body.taskContext).toEqual({ title: 'Plan the weekend', goal: '' })
    expect(body.intent).toBe('')
  })

  it('shows a valid AI hint and reuses it for the same turn and mode', async () => {
    const { useSpeechRescue, clearRescueCache } = await load()
    clearRescueCache()
    const fetch = mockFetch({ success: true, rescue: { mode: 'starter', pieces: ['I think we should'], frame: '' } })
    const rescue = useSpeechRescue()

    await rescue.request({ mode: 'starter', context })
    expect(rescue.result.value).toMatchObject({ mode: 'starter', pieces: ['I think we should'], source: 'ai' })
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toBe('http://api.test/speech-rescue')

    // Reopened in the same turn: no second AI call
    await useSpeechRescue().request({ mode: 'starter', context })
    expect(fetch).toHaveBeenCalledTimes(1)

    // A new turn asks again
    await rescue.request({ mode: 'starter', context: { ...context, messages: [...messages, { role: 'user', content: 'Hmm' }, { role: 'assistant', content: 'Why?' }] } })
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('drops an answer that breaks the rules and shows the local starter instead', async () => {
    const { useSpeechRescue, clearRescueCache, FALLBACK_STARTERS } = await load()
    clearRescueCache()
    mockFetch({ success: true, rescue: { mode: 'starter', pieces: ['I think we should skip it.'], frame: '' } })
    const rescue = useSpeechRescue()
    await rescue.request({ mode: 'starter', context })
    expect(rescue.result.value.source).toBe('fallback')
    expect(FALLBACK_STARTERS).toContain(rescue.result.value.pieces[0])
  })

  it('on the daily limit, frame falls back to the current target pattern', async () => {
    const { useSpeechRescue, clearRescueCache } = await load()
    clearRescueCache()
    mockFetch({ success: false, isDailyLimit: true })
    const rescue = useSpeechRescue()
    await rescue.request({ mode: 'frame', context: { ...context, patterns: [{ id: 'a', pattern: 'If you ask me, ...' }] } })
    expect(rescue.result.value).toMatchObject({ mode: 'frame', frame: 'If you ask me, [your idea]', source: 'fallback', reason: 'limit' })
  })

  it('offline: no request, intent comes back empty so the UI asks to try again', async () => {
    const { useSpeechRescue, clearRescueCache } = await load()
    clearRescueCache()
    const fetch = mockFetch({})
    const onLine = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    const rescue = useSpeechRescue()
    await rescue.request({ mode: 'intent', intent: '我明天不能開會', context })
    expect(fetch).not.toHaveBeenCalled()
    expect(rescue.result.value).toMatchObject({ mode: 'intent', pieces: [], source: 'fallback', reason: 'offline' })
    onLine.mockRestore()
  })

  it('network errors fall back instead of throwing', async () => {
    const { useSpeechRescue, clearRescueCache } = await load()
    clearRescueCache()
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Failed to fetch'))))
    const rescue = useSpeechRescue()
    await expect(rescue.request({ mode: 'starter', context })).resolves.toMatchObject({ source: 'fallback' })
    expect(rescue.isLoading.value).toBe(false)
  })
})

describe('useSpeechRescue: stats', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('counts uses per mode and keeps the last 30 events, without any content', async () => {
    const { recordRescueUse, loadRescueStats, RESCUE_STATS_KEY } = await load()
    for (let i = 0; i < 32; i++) recordRescueUse('starter', 'pattern-task')
    recordRescueUse('intent', 'free')
    const stats = loadRescueStats()
    expect(stats.counts).toEqual({ starter: 32, intent: 1, frame: 0 })
    expect(stats.events).toHaveLength(30)
    expect(stats.events.at(-1)).toEqual({ at: expect.any(String), mode: 'intent', sessionType: 'free' })
    expect(Object.keys(JSON.parse(localStorage.getItem(RESCUE_STATS_KEY)))).toEqual(['version', 'counts', 'events'])
  })

  it('records a request but not a cached reopen, and stores no intent text', async () => {
    const { useSpeechRescue, clearRescueCache, loadRescueStats, RESCUE_STATS_KEY } = await load()
    clearRescueCache()
    mockFetch({ success: true, rescue: { mode: 'intent', pieces: ["can't make the meeting", 'because'], frame: '' } })
    const rescue = useSpeechRescue()
    await rescue.request({ mode: 'intent', intent: '我明天不能開會', context })
    await rescue.request({ mode: 'intent', intent: '我明天不能開會', context })
    expect(loadRescueStats().counts.intent).toBe(1)
    expect(localStorage.getItem(RESCUE_STATS_KEY)).not.toMatch(/開會|meeting/)
  })
})
