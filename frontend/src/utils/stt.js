/**
 * Speech-to-Text: native iOS recognition inside the app, Web Speech API in browsers
 */
import { Capacitor } from '@capacitor/core'
import { SpeechRecognition as NativeRecognition } from '@capgo/capacitor-speech-recognition'
import { getPauseMs } from '../composables/useVoiceSettings'

const LANG_MAP = {
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-TW',
}

const SpeechRecognition = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null

const isNative = Capacitor.isNativePlatform()

// Recognition doesn't end on its own reliably; stop after this much quiet
const SILENCE_BEFORE_SPEECH_MS = 8000
const MAX_LISTEN_MS = 30000
// Extra quiet allowed after "I'm still thinking"
export const THINKING_GRACE_MS = 8000

export function isSTTAvailable() {
  return isNative || !!SpeechRecognition
}

// The listen in progress: { finish, extend } for whichever path is running
let current = null

/**
 * Silence/max timers shared by both paths.
 * waitForSilence(ms) restarts the quiet countdown; extend() gives one longer countdown.
 */
function createTimers({ pauseMs, maxMs, onDone }) {
  let silenceTimer = null
  let heardSpeech = false
  const maxTimer = setTimeout(onDone, maxMs)
  const waitForSilence = ms => {
    clearTimeout(silenceTimer)
    silenceTimer = setTimeout(onDone, ms)
  }
  return {
    start: () => waitForSilence(SILENCE_BEFORE_SPEECH_MS),
    heard: () => { heardSpeech = true; waitForSilence(pauseMs) },
    extend: () => waitForSilence((heardSpeech ? pauseMs : 0) + THINKING_GRACE_MS),
    clear: () => { clearTimeout(silenceTimer); clearTimeout(maxTimer) },
  }
}

async function listenNative({ language, onInterim, pauseMs, maxMs }) {
  // Claim the mic right away so a stop during the permission check (or a newer listen) reaches this one
  let cancelled = false
  const pending = { finish: () => { cancelled = true }, extend: () => {} }
  const previous = current
  current = pending
  const release = () => { if (current === pending) current = null }

  // The plugin refuses a second start: let the running listen finish first
  if (previous) await previous.finish()

  let permission
  try {
    permission = await NativeRecognition.checkPermissions()
    if (permission.speechRecognition !== 'granted') {
      permission = await NativeRecognition.requestPermissions()
    }
  } catch (error) {
    release()
    throw error
  }
  if (cancelled) {
    release()
    return ''
  }
  if (permission.speechRecognition !== 'granted') {
    release()
    throw new Error('not-allowed')
  }

  return new Promise((resolve, reject) => {
    let text = ''
    let done = false
    let startCalled = false
    let sessionId = null
    const handles = []

    const cleanup = () => {
      done = true
      timers.clear()
      if (current === entry) current = null
      handles.forEach(handle => handle.remove())
    }
    const finish = async () => {
      if (done) return
      cleanup()
      try { await NativeRecognition.stop() } catch { /* already stopped */ }
      resolve(text.trim())
    }
    const timers = createTimers({ pauseMs, maxMs, onDone: finish })
    const entry = { finish, extend: () => { if (!done) timers.extend() } }
    current = entry

    Promise.all([
      NativeRecognition.addListener('partialResults', event => {
        const heard = event.matches?.[0] || event.accumulatedText || ''
        if (!heard) return
        text = heard
        onInterim?.(heard.trim())
        timers.heard()
      }),
      // The plugin resolves stop() before it sends that session's "stopped", so a previous
      // listen's "stopped" can reach this one: only our own session (from our "started") ends it
      NativeRecognition.addListener('listeningState', event => {
        const state = event.state || event.status
        if (state === 'started' && startCalled && sessionId === null) sessionId = event.sessionId ?? null
        else if (state === 'stopped' && sessionId !== null && event.sessionId === sessionId) finish()
      }),
    ]).then(listeners => {
      handles.push(...listeners)
      // Finished while the listeners were being added: never start the recognizer
      if (done) {
        listeners.forEach(handle => handle.remove())
        return
      }
      timers.start()
      startCalled = true
      return NativeRecognition.start({
        language: LANG_MAP[language] || 'en-US',
        partialResults: true,
        popup: false,
        addPunctuation: true,
      })
    }).catch(error => {
      if (done) return
      cleanup()
      reject(error)
    })
  })
}

function listenWeb({ language, onInterim, pauseMs, maxMs }) {
  return new Promise((resolve, reject) => {
    if (!SpeechRecognition) {
      reject(new Error('unsupported'))
      return
    }
    stopListening()

    const recognition = new SpeechRecognition()
    recognition.lang = LANG_MAP[language] || 'en-US'
    recognition.interimResults = true
    // Keep listening through short pauses; our own timer decides when the turn ends
    recognition.continuous = true

    let finalText = ''
    let failed = false
    let ended = false
    const finish = () => {
      if (ended) return
      try { recognition.stop() } catch { /* already stopping */ }
    }
    const timers = createTimers({ pauseMs, maxMs, onDone: finish })

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
      timers.heard()
    }

    recognition.onerror = (event) => {
      // 'no-speech' and 'aborted' just mean nothing usable was heard
      if (event.error === 'no-speech' || event.error === 'aborted') return
      failed = true
      reject(new Error(event.error))
    }

    // Browsers may still end recognition on their own; "still thinking" can't revive it
    recognition.onend = () => {
      ended = true
      timers.clear()
      if (current?.recognition === recognition) current = null
      if (!failed) resolve(finalText.trim())
    }

    current = { recognition, finish, extend: () => { if (!ended) timers.extend() } }
    try {
      recognition.start()
      timers.start()
    } catch (e) {
      timers.clear()
      current = null
      reject(e)
    }
  })
}

/**
 * Listen for one utterance and resolve with the final transcript ('' when nothing was heard).
 * Rejects with the recognition error code (e.g. 'not-allowed') when listening can't start.
 * @param {Object} options
 * @param {string} [options.language='en']
 * @param {Function} [options.onInterim] - called with the transcript so far while the user speaks
 * @param {number} [options.pauseMs] - quiet after speech that ends the turn (default: the user's setting)
 * @param {number} [options.maxMs=30000] - hard stop
 * @returns {Promise<string>}
 */
export function listenOnce({ language = 'en', onInterim, pauseMs = getPauseMs(), maxMs = MAX_LISTEN_MS } = {}) {
  const options = { language, onInterim, pauseMs, maxMs }
  return isNative ? listenNative(options) : listenWeb(options)
}

/**
 * "I'm still thinking": keep the current listen open a little longer (THINKING_GRACE_MS)
 * @returns {boolean} whether a listen was running
 */
export function extendListening() {
  if (!current) return false
  current.extend()
  return true
}

/**
 * Stop listening; a pending listenOnce resolves with what was heard so far
 */
export function stopListening() {
  current?.finish()
}
