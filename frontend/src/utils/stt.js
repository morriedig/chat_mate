/**
 * Speech-to-Text utility using the Web Speech API
 */

const LANG_MAP = {
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-TW',
}

const SpeechRecognition = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null

export function isSTTAvailable() {
  return !!SpeechRecognition
}

let active = null

/**
 * Listen for one utterance and resolve with the final transcript ('' when nothing was heard).
 * Rejects with the recognition error code (e.g. 'not-allowed') when listening can't start.
 * @param {Object} options
 * @param {string} [options.language='en']
 * @param {Function} [options.onInterim] - called with the transcript so far while the user speaks
 * @returns {Promise<string>}
 */
export function listenOnce({ language = 'en', onInterim } = {}) {
  return new Promise((resolve, reject) => {
    if (!SpeechRecognition) {
      reject(new Error('unsupported'))
      return
    }
    stopListening()

    const recognition = new SpeechRecognition()
    recognition.lang = LANG_MAP[language] || 'en-US'
    recognition.interimResults = true
    recognition.continuous = false

    let finalText = ''
    let failed = false

    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript
        } else {
          interim += event.results[i][0].transcript
        }
      }
      onInterim?.((finalText + interim).trim())
    }

    recognition.onerror = (event) => {
      // 'no-speech' and 'aborted' just mean nothing usable was heard
      if (event.error === 'no-speech' || event.error === 'aborted') return
      failed = true
      reject(new Error(event.error))
    }

    recognition.onend = () => {
      if (active === recognition) active = null
      if (!failed) resolve(finalText.trim())
    }

    active = recognition
    try {
      recognition.start()
    } catch (e) {
      active = null
      reject(e)
    }
  })
}

/**
 * Stop listening; a pending listenOnce resolves with what was heard so far
 */
export function stopListening() {
  if (active) {
    active.stop()
    active = null
  }
}
