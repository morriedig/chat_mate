import { describe, it, expect, vi, beforeEach } from 'vitest'

let available = true
let pending = null
const listenOnce = vi.fn(() => new Promise((resolve, reject) => { pending = { resolve, reject } }))
const stopListening = vi.fn()
vi.mock('../../utils/stt', () => ({
  isSTTAvailable: () => available,
  listenOnce: (...args) => listenOnce(...args),
  stopListening: (...args) => stopListening(...args),
}))

import { usePronunciationCheck } from '../../composables/usePronunciationCheck'

describe('usePronunciationCheck', () => {
  beforeEach(() => {
    available = true
    pending = null
    listenOnce.mockClear()
    stopListening.mockClear()
  })

  it('isSupported reflects isSTTAvailable', () => {
    expect(usePronunciationCheck().isSupported).toBe(true)
    available = false
    expect(usePronunciationCheck().isSupported).toBe(false)
  })

  it('rejects without listening when recognition is unavailable', async () => {
    available = false
    const { checkPronunciation } = usePronunciationCheck()
    await expect(checkPronunciation('apple', 'en')).rejects.toThrow('Speech recognition not supported')
    expect(listenOnce).not.toHaveBeenCalled()
  })

  it('listens in the given language with a short pause and scores the transcript', async () => {
    const { checkPronunciation, isListening, transcript, score } = usePronunciationCheck()
    const result = checkPronunciation('Apple!', 'ja')
    expect(isListening.value).toBe(true)
    expect(listenOnce).toHaveBeenCalledWith({ language: 'ja', pauseMs: 1500 })

    pending.resolve('apples')
    // "apple" vs "apples": distance 1 over 6 characters
    expect(await result).toEqual({ transcript: 'apples', score: 83 })
    expect(transcript.value).toBe('apples')
    expect(score.value).toBe(83)
    expect(isListening.value).toBe(false)
  })

  it('resolves an empty result with score 0 when nothing was heard', async () => {
    const { checkPronunciation, score } = usePronunciationCheck()
    const result = checkPronunciation('apple', 'en')
    pending.resolve('')
    expect(await result).toEqual({ transcript: '', score: 0 })
    expect(score.value).toBeNull()
  })

  it('propagates recognition errors and resets listening', async () => {
    const { checkPronunciation, isListening } = usePronunciationCheck()
    const result = checkPronunciation('apple', 'en')
    pending.reject(new Error('not-allowed'))
    await expect(result).rejects.toThrow('not-allowed')
    expect(isListening.value).toBe(false)
  })

  it('stopListening stops recognition and ignores the late result', async () => {
    const { checkPronunciation, stopListening: stop, isListening, score } = usePronunciationCheck()
    const result = checkPronunciation('apple', 'en')
    stop()
    expect(stopListening).toHaveBeenCalledTimes(1)
    expect(isListening.value).toBe(false)

    pending.resolve('apple')
    expect(await result).toEqual({ transcript: '', score: 0 })
    expect(score.value).toBeNull()
  })
})
