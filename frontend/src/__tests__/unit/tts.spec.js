import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => false } }))
vi.mock('@capacitor-community/text-to-speech', () => ({ TextToSpeech: {} }))

describe('playTTS language', () => {
  afterEach(() => vi.unstubAllGlobals())

  function stubSpeech() {
    const spoken = []
    vi.stubGlobal('SpeechSynthesisUtterance', function (text) { this.text = text })
    vi.stubGlobal('speechSynthesis', { cancel: vi.fn(), getVoices: () => [], speak: u => spoken.push(u) })
    window.speechSynthesis = globalThis.speechSynthesis
    return spoken
  }

  it('reads Chinese with a Taiwan voice and English with a US voice', async () => {
    const spoken = stubSpeech()
    const { playTTS } = await import('../../utils/tts')
    playTTS('你好', 'zh')
    playTTS('Hello', 'en')
    expect(spoken.map(u => u.lang)).toEqual(['zh-TW', 'en-US'])
  })
})
