import { ref } from 'vue'
import { getAuthToken, requestAuthToken, clearAuthToken } from './useChatApi'

const API_URL = import.meta.env.VITE_API_URL || ''
const MAX_MESSAGES = 40

function getClientId() {
  let clientId = localStorage.getItem('chatmate_clientId')
  if (!clientId) {
    clientId = 'client_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('chatmate_clientId', clientId)
  }
  return clientId
}

function getSummaryUrl() {
  if (API_URL.includes('script.google.com')) return API_URL
  return API_URL.replace(/\/chat$/, '') + '/chat-summary'
}

export function useChatSummary() {
  const isLoading = ref(false)
  // 'daily-limit' when today's AI quota is used up, otherwise 'unavailable'
  const failure = ref(null)

  /**
   * Ask for 1-3 things worth fixing from the user's lines in a chat.
   * Returns { points: [{ original, hint, corrected, explanation, type }], usedPatternIds, encouragement,
   *   repeatTomorrow: { enabled, original, target, cue, hint, patternId } }
   * or null when the summary isn't available.
   */
  async function summarize({ messages, level, nativeLanguage, patterns = [] }) {
    failure.value = null
    if (!API_URL) {
      failure.value = 'unavailable'
      return null
    }
    isLoading.value = true
    try {
      const requestBody = {
        action: 'chat-summary',
        messages: messages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .slice(-MAX_MESSAGES)
          .map(m => ({ role: m.role, content: m.content })),
        level,
        nativeLanguage,
        patterns: patterns.map(p => ({ id: p.id, pattern: p.phrase || p.pattern, match: p.match || [] })),
        clientId: getClientId(),
        origin: window.location.origin,
        authToken: await getAuthToken(),
      }
      const post = () => fetch(getSummaryUrl(), {
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
      if (data.success) return data.summary
      failure.value = data.isDailyLimit ? 'daily-limit' : 'unavailable'
      return null
    } catch {
      failure.value = 'unavailable'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, failure, summarize }
}
