import { ref, getCurrentInstance, onBeforeUnmount } from 'vue'
import { isSTTAvailable, listenOnce, stopListening as stopSTT } from '../utils/stt'

// One word or phrase: end the turn sooner than a full answer
const PAUSE_MS = 1500

function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

function normalizeText(text) {
  return text.toLowerCase().replace(/[^\w\s\u3000-\u9fff\u30a0-\u30ff\u3040-\u309f]/g, '').trim()
}

export function usePronunciationCheck() {
  const isListening = ref(false)
  const transcript = ref('')
  const score = ref(null)
  const isSupported = isSTTAvailable()

  let checkId = 0

  async function checkPronunciation(targetText, language) {
    if (!isSupported) {
      throw new Error('Speech recognition not supported')
    }

    // A new check replaces any running listen (this one's or another mic's); the old result is ignored
    stopSTT()
    const id = ++checkId
    const isCurrent = () => id === checkId

    isListening.value = true
    transcript.value = ''
    score.value = null

    let result
    try {
      result = await listenOnce({ language, pauseMs: PAUSE_MS })
    } catch (error) {
      // A stopped or replaced check ends quietly, like an aborted recognition
      if (!isCurrent()) return { transcript: '', score: 0 }
      throw error
    } finally {
      if (isCurrent()) isListening.value = false
    }
    if (!isCurrent()) return { transcript: '', score: 0 }
    // Nothing heard: report it as an error, like the browser's no-speech
    if (!result) throw new Error('no-speech')

    transcript.value = result
    const target = normalizeText(targetText)
    const spoken = normalizeText(result)
    const distance = levenshtein(target, spoken)
    const maxLen = Math.max(target.length, spoken.length, 1)
    const similarity = Math.round(((maxLen - distance) / maxLen) * 100)

    score.value = Math.max(0, Math.min(100, similarity))
    return { transcript: result, score: score.value }
  }

  function stopListening() {
    if (isListening.value) stopSTT()
    checkId++
    isListening.value = false
  }

  // Leaving the screen stops the mic
  if (getCurrentInstance()) onBeforeUnmount(stopListening)

  return {
    isSupported,
    isListening,
    transcript,
    score,
    checkPronunciation,
    stopListening,
  }
}
