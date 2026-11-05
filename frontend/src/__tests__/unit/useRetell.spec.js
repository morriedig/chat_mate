import { describe, it, expect, vi, beforeEach } from 'vitest'

const addXP = vi.fn()
vi.mock('../../composables/useUserProgress', () => ({ useUserProgress: () => ({ addXP }) }))

import { countWords, wordsPerMinute, getRetellTopic, useRetell, RETELL_XP, RETELL_STORAGE_KEY } from '../../composables/useRetell'
import { useVoiceSettings, getPauseMs, setPauseMs, DEFAULT_PAUSE_MS } from '../../composables/useVoiceSettings'

describe('retell helpers', () => {
  it('counts words, ignoring stray punctuation', () => {
    expect(countWords("I think it's better , because - it saves time.")).toBe(8)
    expect(countWords('   ')).toBe(0)
  })

  it('computes words per minute', () => {
    expect(wordsPerMinute(60, 45)).toBe(80)
    expect(wordsPerMinute(0, 30)).toBe(0)
    expect(wordsPerMinute(10, 0)).toBe(0)
  })

  it('gives a different topic when asked for another', () => {
    const date = new Date(2026, 10, 5)
    expect(getRetellTopic(0, date).id).not.toBe(getRetellTopic(1, date).id)
  })
})

describe('useRetell', () => {
  beforeEach(() => {
    localStorage.clear()
    addXP.mockClear()
  })

  it('saves results and awards XP once per day', () => {
    const { saveResult, doneToday, lastResult } = useRetell()
    expect(doneToday.value).toBe(false)

    expect(saveResult('wfh', [{ words: 90, seconds: 90 }, { words: 70, seconds: 60 }, { words: 60, seconds: 45 }]).xpEarned).toBe(RETELL_XP)
    expect(addXP).toHaveBeenCalledWith(RETELL_XP, 'retell')
    expect(doneToday.value).toBe(true)
    expect(lastResult.value.rounds.map(r => r.wpm)).toEqual([60, 70, 80])

    expect(saveResult('wfh', [{ words: 10, seconds: 60 }]).xpEarned).toBe(0)
    expect(addXP).toHaveBeenCalledTimes(1)
    expect(JSON.parse(localStorage.getItem(RETELL_STORAGE_KEY)).history).toHaveLength(2)
  })
})

describe('useVoiceSettings', () => {
  beforeEach(() => localStorage.clear())

  it('keeps only the offered pause lengths', () => {
    const { pauseMs } = useVoiceSettings()
    setPauseMs(DEFAULT_PAUSE_MS)
    setPauseMs(4000)
    expect(pauseMs.value).toBe(4000)
    expect(getPauseMs()).toBe(4000)
    expect(localStorage.getItem('chatmate_voice_pause_ms')).toBe('4000')

    setPauseMs(1234)
    expect(getPauseMs()).toBe(4000)
  })
})
