/**
 * Speech-to-Text: native iOS recognition inside the app, Web Speech API in browsers
 */
import { Capacitor } from '@capacitor/core'
import { SpeechRecognition as NativeRecognition } from '@capgo/capacitor-speech-recognition'

const LANG_MAP = {
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-TW',
}

const SpeechRecognition = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null

const isNative = Capacitor.isNativePlatform()

// Native recognition doesn't end on its own; stop after this much quiet
const SILENCE_AFTER_SPEECH_MS = 1500
const SILENCE_BEFORE_SPEECH_MS = 8000
const MAX_LISTEN_MS = 30000

export function isSTTAvailable() {
  return isNative || !!SpeechRecognition
}

let active = null
let finishNative = null

async function listenNative({ language, onInterim }) {
  let permission = await NativeRecognition.checkPermissions()
  if (permission.speechRecognition !== 'granted') {
    permission = await NativeRecognition.requestPermissions()
  }
  if (permission.speechRecognition !== 'granted') throw new Error('not-allowed')

  return new Promise((resolve, reject) => {
    let text = ''
    let done = false
    let silenceTimer = null
    const handles = []

    const finish = async () => {
      if (done) return
      done = true
      clearTimeout(silenceTimer)
      clearTimeout(maxTimer)
      finishNative = null
      try { await NativeRecognition.stop() } catch { /* already stopped */ }
      handles.forEach(handle => handle.remove())
      resolve(text.trim())
    }
    const waitForSilence = ms => {
      clearTimeout(silenceTimer)
      silenceTimer = setTimeout(finish, ms)
    }
    const maxTimer = setTimeout(finish, MAX_LISTEN_MS)
    finishNative = finish

    Promise.all([
      NativeRecognition.addListener('partialResults', event => {
        const heard = event.matches?.[0] || event.accumulatedText || ''
        if (!heard) return
        text = heard
        onInterim?.(heard.trim())
        waitForSilence(SILENCE_AFTER_SPEECH_MS)
      }),
      NativeRecognition.addListener('listeningState', event => {
        if ((event.state || event.status) === 'stopped') finish()
      }),
    ]).then(listeners => {
      handles.push(...listeners)
      if (done) listeners.forEach(handle => handle.remove())
      waitForSilence(SILENCE_BEFORE_SPEECH_MS)
      return NativeRecognition.start({
        language: LANG_MAP[language] || 'en-US',
        partialResults: true,
        popup: false,
        addPunctuation: true,
      })
    }).catch(error => {
      if (done) return
      done = true
      clearTimeout(silenceTimer)
      clearTimeout(maxTimer)
      finishNative = null
      handles.forEach(handle => handle.remove())
      reject(error)
    })
  })
}

/**
 * Listen for one utterance and resolve with the final transcript ('' when nothing was heard).
 * Rejects with the recognition error code (e.g. 'not-allowed') when listening can't start.
 * @param {Object} options
 * @param {string} [options.language='en']
 * @param {Function} [options.onInterim] - called with the transcript so far while the user speaks
 * @returns {Promise<string>}
 */
export function listenOnce({ language = 'en', onInterim } = {}) {
  if (isNative) return listenNative({ language, onInterim })
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
  if (finishNative) {
    finishNative()
    return
  }
  if (active) {
    active.stop()
    active = null
  }
}
