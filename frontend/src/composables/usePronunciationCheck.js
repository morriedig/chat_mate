import { ref } from 'vue'

const SpeechRecognition = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null

const LANGUAGE_MAP = {
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-TW',
}

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
  const isSupported = !!SpeechRecognition

  let recognition = null

  function checkPronunciation(targetText, language) {
    return new Promise((resolve, reject) => {
      if (!SpeechRecognition) {
        reject(new Error('Speech recognition not supported'))
        return
      }

      // Abort any existing recognition first
      if (recognition) {
        recognition.abort()
      }

      recognition = new SpeechRecognition()
      recognition.lang = LANGUAGE_MAP[language] || 'en-US'
      recognition.interimResults = false
      recognition.maxAlternatives = 1
      recognition.continuous = false

      isListening.value = true
      transcript.value = ''
      score.value = null

      let resolved = false

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript
        transcript.value = result

        const target = normalizeText(targetText)
        const spoken = normalizeText(result)
        const distance = levenshtein(target, spoken)
        const maxLen = Math.max(target.length, spoken.length, 1)
        const similarity = Math.round(((maxLen - distance) / maxLen) * 100)

        score.value = Math.max(0, Math.min(100, similarity))
        isListening.value = false
        resolved = true
        resolve({ transcript: result, score: score.value })
      }

      recognition.onerror = (event) => {
        isListening.value = false
        if (!resolved && event.error !== 'aborted') {
          resolved = true
          reject(new Error(event.error))
        }
      }

      recognition.onend = () => {
        isListening.value = false
        if (!resolved) {
          resolved = true
          resolve({ transcript: '', score: 0 })
        }
      }

      recognition.start()
    })
  }

  function stopListening() {
    if (recognition) {
      recognition.abort()
      recognition = null
    }
    isListening.value = false
  }

  return {
    isSupported,
    isListening,
    transcript,
    score,
    checkPronunciation,
    stopListening,
  }
}
