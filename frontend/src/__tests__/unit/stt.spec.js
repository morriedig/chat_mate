import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => false } }))
vi.mock('@capgo/capacitor-speech-recognition', () => ({ SpeechRecognition: {} }))

// Minimal Web Speech API stand-in: tests drive results and the end event by hand
class FakeRecognition {
  constructor() {
    FakeRecognition.last = this
    this.stopped = false
  }
  start() {}
  stop() {
    if (this.stopped) return
    this.stopped = true
    this.onend?.()
  }
  say(text) {
    this.onresult?.({ resultIndex: 0, results: [Object.assign([{ transcript: text }], { isFinal: true })] })
  }
}

async function loadStt() {
  vi.resetModules()
  window.webkitSpeechRecognition = FakeRecognition
  return import('../../utils/stt')
}

describe('stt (web)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })
  afterEach(() => {
    vi.useRealTimers()
    delete window.webkitSpeechRecognition
  })

  it('ends the turn after the chosen pause following speech', async () => {
    const { listenOnce } = await loadStt()
    const result = listenOnce({ pauseMs: 2500 })
    FakeRecognition.last.say('I think so')

    vi.advanceTimersByTime(2400)
    expect(FakeRecognition.last.stopped).toBe(false)
    vi.advanceTimersByTime(200)
    expect(await result).toBe('I think so')
  })

  it('uses the saved pause setting by default', async () => {
    localStorage.setItem('chatmate_voice_pause_ms', '4000')
    const { listenOnce } = await loadStt()
    const result = listenOnce()
    FakeRecognition.last.say('Well')

    vi.advanceTimersByTime(3900)
    expect(FakeRecognition.last.stopped).toBe(false)
    vi.advanceTimersByTime(200)
    expect(await result).toBe('Well')
  })

  it('"still thinking" keeps the turn open longer', async () => {
    const { listenOnce, extendListening, THINKING_GRACE_MS } = await loadStt()
    const result = listenOnce({ pauseMs: 1500 })
    FakeRecognition.last.say('Hmm')

    vi.advanceTimersByTime(1000)
    expect(extendListening()).toBe(true)
    vi.advanceTimersByTime(1500 + THINKING_GRACE_MS - 100)
    expect(FakeRecognition.last.stopped).toBe(false)
    vi.advanceTimersByTime(200)
    expect(await result).toBe('Hmm')
  })

  it('reports nothing to extend when not listening', async () => {
    const { extendListening } = await loadStt()
    expect(extendListening()).toBe(false)
  })

  it('stops at the max listen time even while speaking', async () => {
    const { listenOnce } = await loadStt()
    const result = listenOnce({ pauseMs: 4000, maxMs: 5000 })
    for (let i = 0; i < 4; i++) {
      FakeRecognition.last.say('word ')
      vi.advanceTimersByTime(1000)
    }
    vi.advanceTimersByTime(1100)
    expect(FakeRecognition.last.stopped).toBe(true)
    await result
  })
})
