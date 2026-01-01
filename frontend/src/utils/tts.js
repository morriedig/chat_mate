/**
 * Text-to-Speech utility using Web Speech API
 *
 * Uses browser's built-in speech synthesis for pronunciation
 */

/**
 * Language codes for Web Speech API
 */
const LANGUAGE_CODES = {
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-CN',
  ko: 'ko-KR',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE'
}

/**
 * Check if Web Speech API is available
 * @returns {boolean}
 */
export function isTTSAvailable() {
  return 'speechSynthesis' in window
}

/**
 * Stop any ongoing speech
 */
export function stopTTS() {
  if (isTTSAvailable()) {
    window.speechSynthesis.cancel()
  }
}

/**
 * Speed modes for TTS
 * - normal: Regular speed (0.9x)
 * - slow: Very slow speed (0.3x) for careful listening
 * - word: Word by word with pauses
 */
export const TTS_SPEEDS = {
  normal: { rate: 0.9, label: 'Normal' },
  slow: { rate: 0.3, label: 'Slow' },
  word: { rate: 0.5, label: 'Word by Word' }
}

/**
 * Play audio for a word using Web Speech API
 * @param {string} text - The text to speak
 * @param {string} language - Language code ('en', 'ja', etc.)
 * @param {string} speedMode - Speed mode: 'normal', 'slow', or 'word' (default: 'normal')
 * @param {Function} onWordChange - Callback for word-by-word mode: (wordIndex, word, allWords) => void
 * @returns {Promise<void>}
 */
export function playTTS(text, language = 'en', speedMode = 'normal', onWordChange = null) {
  return new Promise((resolve, reject) => {
    if (!isTTSAvailable()) {
      reject(new Error('Speech synthesis not supported'))
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    // Word-by-word mode: split and play each word with pause
    if (speedMode === 'word') {
      playWordByWord(text, language, onWordChange).then(resolve).catch(reject)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = LANGUAGE_CODES[language] || language
    utterance.rate = TTS_SPEEDS[speedMode]?.rate || 0.9
    utterance.pitch = 1

    utterance.onend = () => resolve()
    utterance.onerror = (e) => reject(new Error('Speech synthesis failed'))

    window.speechSynthesis.speak(utterance)
  })
}

/**
 * Play text word by word with pauses between
 * @param {string} text - The text to speak
 * @param {string} language - Language code
 * @param {Function} onWordChange - Callback called with (wordIndex, word, allWords) when each word starts
 * @returns {Promise<void>}
 */
async function playWordByWord(text, language, onWordChange = null) {
  // Split by spaces for Western languages, or by character for CJK
  const isCJK = ['ja', 'zh', 'ko'].includes(language)
  const words = isCJK
    ? text.replace(/[。、！？，]/g, ' ').split('').filter(w => w.trim())
    : text.split(/\s+/).filter(w => w.trim())

  for (let i = 0; i < words.length; i++) {
    const word = words[i]

    // Notify which word is being played
    if (onWordChange) {
      onWordChange(i, word, words)
    }

    await new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = LANGUAGE_CODES[language] || language
      utterance.rate = 0.6
      utterance.pitch = 1
      utterance.onend = () => resolve()
      utterance.onerror = () => reject(new Error('Speech synthesis failed'))
      window.speechSynthesis.speak(utterance)
    })
    // Pause between words
    await new Promise(r => setTimeout(r, 400))
  }

  // Clear highlight when done
  if (onWordChange) {
    onWordChange(-1, null, words)
  }
}

/**
 * Split text into words for display (matches word-by-word playback splitting)
 * @param {string} text - The text to split
 * @param {string} language - Language code
 * @returns {string[]} Array of words/characters
 */
export function splitTextForHighlight(text, language = 'en') {
  const isCJK = ['ja', 'zh', 'ko'].includes(language)
  if (isCJK) {
    // For CJK, split by character but keep punctuation with preceding char
    return text.split('').filter(w => w.trim() && !/[。、！？，]/.test(w))
  }
  return text.split(/\s+/).filter(w => w.trim())
}

export default {
  playTTS,
  stopTTS,
  isTTSAvailable,
  splitTextForHighlight
}
