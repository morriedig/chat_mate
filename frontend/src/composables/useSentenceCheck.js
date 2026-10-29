import { ref } from 'vue'
import { getAuthToken, requestAuthToken, clearAuthToken } from './useChatApi'

const API_URL = import.meta.env.VITE_API_URL || ''

function getClientId() {
  let clientId = localStorage.getItem('chatmate_clientId')
  if (!clientId) {
    clientId = 'client_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('chatmate_clientId', clientId)
  }
  return clientId
}

function getCheckUrl() {
  if (API_URL.includes('script.google.com')) return API_URL
  return API_URL.replace(/\/chat$/, '') + '/sentence-check'
}

const CONTRACTIONS = [
  [/\bi would\b/g, "i'd"],
  [/\bi am\b/g, "i'm"],
  [/\bi have\b/g, "i've"],
  [/\bdo not\b/g, "don't"],
  [/\bdoes not\b/g, "doesn't"],
  [/\blet us\b/g, "let's"],
  [/\bthank you\b/g, 'thanks'],
]

// Lowercase, straighten curly apostrophes (iOS keyboards) and contract common forms
function normalize(text) {
  let out = text.toLowerCase().replace(/[’‘]/g, "'")
  for (const [pattern, contracted] of CONTRACTIONS) out = out.replace(pattern, contracted)
  return out
}

/**
 * Whether a sentence contains every `match` substring of a pattern.
 * Used offline and as a fallback when the AI check is unavailable.
 */
export function usesPattern(sentence, match = []) {
  const text = normalize(sentence)
  return match.length > 0 && match.every(part => text.includes(normalize(part)))
}

export function useSentenceCheck() {
  const isChecking = ref(false)

  /**
   * Ask the AI friend to check one practice sentence.
   * Returns { usedPattern, isNatural, corrected, comment, better } or null when unavailable.
   */
  async function checkSentence({ sentence, pattern, meaning, task, level, nativeLanguage }) {
    if (!API_URL) return null
    isChecking.value = true
    try {
      const requestBody = {
        action: 'sentence-check',
        sentence,
        pattern,
        meaning,
        task,
        level,
        nativeLanguage,
        clientId: getClientId(),
        origin: window.location.origin,
        authToken: await getAuthToken(),
      }
      const post = () => fetch(getCheckUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(requestBody),
        redirect: 'follow',
      }).then(r => r.json())

      let data = await post()
      if (!data.success && data.isTokenError) {
        clearAuthToken()
        const newToken = await requestAuthToken()
        if (newToken) {
          requestBody.authToken = newToken
          data = await post()
        }
      }
      return data.success ? data.check : null
    } catch {
      return null
    } finally {
      isChecking.value = false
    }
  }

  return { isChecking, checkSentence }
}
