import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

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

  it('rejects with no-speech when nothing was heard', async () => {
    const { checkPronunciation, score, isListening } = usePronunciationCheck()
    const result = checkPronunciation('apple', 'en')
    pending.resolve('')
    await expect(result).rejects.toThrow('no-speech')
    expect(score.value).toBeNull()
    expect(isListening.value).toBe(false)
  })

  it('stops any running listen before starting, even one it did not start', () => {
    const { checkPronunciation } = usePronunciationCheck()
    checkPronunciation('apple', 'en')
    expect(stopListening).toHaveBeenCalledTimes(1)
    expect(stopListening.mock.invocationCallOrder[0]).toBeLessThan(listenOnce.mock.invocationCallOrder[0])
  })

  it('stops listening when the component using it unmounts', async () => {
    let check
    const wrapper = mount(defineComponent({
      setup() { check = usePronunciationCheck(); return () => h('div') },
    }))
    const result = check.checkPronunciation('apple', 'en')
    stopListening.mockClear()
    wrapper.unmount()
    expect(stopListening).toHaveBeenCalledTimes(1)
    expect(check.isListening.value).toBe(false)

    pending.resolve('apple')
    expect(await result).toEqual({ transcript: '', score: 0 })
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
    stopListening.mockClear()
    stop()
    expect(stopListening).toHaveBeenCalledTimes(1)
    expect(isListening.value).toBe(false)

    pending.resolve('apple')
    expect(await result).toEqual({ transcript: '', score: 0 })
    expect(score.value).toBeNull()
  })

  it("a check started by another instance makes the older one ignore its result", async () => {
    const a = usePronunciationCheck()
    const b = usePronunciationCheck()
    const resultA = a.checkPronunciation('apple', 'en')
    const pendingA = pending
    const resultB = b.checkPronunciation('banana', 'en')
    const pendingB = pending

    // B's start stopped the mic; A's listen ends with the speech it cut off
    pendingA.resolve('apple')
    expect(await resultA).toEqual({ transcript: '', score: 0 })
    expect(a.transcript.value).toBe('')
    expect(a.score.value).toBeNull()
    expect(a.isListening.value).toBe(false)
    expect(b.isListening.value).toBe(true)

    // A stopping now must not cut off B
    stopListening.mockClear()
    a.stopListening()
    expect(stopListening).not.toHaveBeenCalled()

    pendingB.resolve('banana')
    expect(await resultB).toEqual({ transcript: 'banana', score: 100 })
    expect(b.score.value).toBe(100)
  })
})
