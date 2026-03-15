import { ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || ''
const PENDING_KEY = 'chatmate_diary_pending_feedback'

function loadPendingQueue() {
  try {
    const raw = localStorage.getItem(PENDING_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function savePendingQueue(queue) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(queue))
  } catch {
    // Storage unavailable
  }
}

function getClientId() {
  let clientId = localStorage.getItem('chatmate_clientId')
  if (!clientId) {
    clientId = 'client_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('chatmate_clientId', clientId)
  }
  return clientId
}

function getFeedbackUrl() {
  if (API_URL.includes('script.google.com')) {
    return API_URL
  }
  const baseUrl = API_URL.replace(/\/chat$/, '')
  return `${baseUrl}/diary-feedback`
}

// Listen for reconnection to process pending queue
let reconnectListenerAdded = false

export function useDiaryFeedback() {
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchFeedback({ diaryText, language, level, characterId, nativeLanguage, streakDays }) {
    isLoading.value = true
    error.value = null

    try {
      if (!API_URL) {
        // Demo mode
        await new Promise((r) => setTimeout(r, 1000))
        return getDemoFeedback()
      }

      const requestBody = {
        diaryText,
        language,
        level,
        characterId,
        nativeLanguage,
        streakDays,
        clientId: getClientId(),
        origin: window.location.origin,
      }

      // For GAS, add action parameter
      if (API_URL.includes('script.google.com')) {
        requestBody.action = 'diary-feedback'
      }

      const response = await fetch(getFeedbackUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(requestBody),
        redirect: 'follow',
      })

      const data = await response.json()

      if (!data.success) {
        throw { isRateLimit: data.isRateLimit, message: data.error }
      }

      return data.feedback
    } catch (err) {
      error.value = err
      return null
    } finally {
      isLoading.value = false
    }
  }

  function addToPendingQueue(entryId) {
    const queue = loadPendingQueue()
    if (!queue.includes(entryId)) {
      queue.push(entryId)
      savePendingQueue(queue)
    }
  }

  function removeFromPendingQueue(entryId) {
    const queue = loadPendingQueue().filter(id => id !== entryId)
    savePendingQueue(queue)
  }

  function getPendingQueue() {
    return loadPendingQueue()
  }

  // Set up online listener for processing pending queue
  function setupReconnectListener(processCallback) {
    if (reconnectListenerAdded) return
    reconnectListenerAdded = true

    window.addEventListener('online', () => {
      const queue = loadPendingQueue()
      if (queue.length > 0 && processCallback) {
        processCallback(queue)
      }
    })
  }

  return {
    isLoading,
    error,
    fetchFeedback,
    addToPendingQueue,
    removeFromPendingQueue,
    getPendingQueue,
    setupReconnectListener,
  }
}

function getDemoFeedback() {
  return {
    corrections: [
      { original: 'I go to store', corrected: 'I went to the store', explanation: 'Past tense and article needed' },
    ],
    grammar: { score: 75, notes: 'Good effort! Watch your tenses.' },
    vocabulary: { score: 70, suggestions: ['Try using more descriptive adjectives'] },
    naturalness: { score: 65, tips: ['Native speakers would say "headed to the store"'] },
    encouragement: 'Great job writing today! Keep it up!',
  }
}
