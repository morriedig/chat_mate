import { ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || ''

// Auth token storage (in-memory, refreshed on page load)
let authToken = null
let tokenPromise = null

// Generate a unique client ID for rate limiting
function getClientId() {
  let clientId = localStorage.getItem('chatmate_clientId')
  if (!clientId) {
    clientId = 'client_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('chatmate_clientId', clientId)
  }
  return clientId
}

// Build token URL based on backend type
function getTokenUrl() {
  const origin = encodeURIComponent(window.location.origin)

  // Check if API_URL is a Google Apps Script (contains 'script.google.com')
  if (API_URL.includes('script.google.com')) {
    return `${API_URL}?action=token&origin=${origin}`
  }

  // For local/Node.js server, construct token endpoint
  // API_URL might be 'http://localhost:3000/chat' or 'http://localhost:3000'
  const baseUrl = API_URL.replace(/\/chat$/, '')
  return `${baseUrl}/token?origin=${origin}`
}

// Request auth token from server
async function requestAuthToken() {
  if (!API_URL) return null

  // Reuse existing promise if already requesting
  if (tokenPromise) return tokenPromise

  tokenPromise = (async () => {
    try {
      const tokenUrl = getTokenUrl()

      const response = await fetch(tokenUrl, {
        method: 'GET',
        redirect: 'follow',
      })

      const data = await response.json()

      if (data.success && data.token) {
        authToken = data.token
        return authToken
      } else {
        console.error('Failed to get auth token:', data.error)
        return null
      }
    } catch (err) {
      console.error('Error requesting auth token:', err)
      return null
    } finally {
      tokenPromise = null
    }
  })()

  return tokenPromise
}

// Get current token or request new one
async function getAuthToken() {
  if (authToken) return authToken
  return await requestAuthToken()
}

// Clear token (for when token expires)
function clearAuthToken() {
  authToken = null
}

export function useChatApi() {
  const isLoading = ref(false)
  const error = ref(null)

  async function sendMessage(config) {
    const { messages, characterId, levelId, language, isGreeting, article } = config

    isLoading.value = true
    error.value = null

    try {
      if (!API_URL) {
        // Demo mode
        await new Promise((r) => setTimeout(r, 1000))
        const reply = getDemoResponse({
          characterId,
          levelId,
          isGreeting,
          articleTitle: article?.title
        })
        return { reply, hints: [] }
      }

      // Get auth token (request if needed)
      const token = await getAuthToken()

      const requestBody = {
        messages,
        character: characterId,
        level: levelId,
        language,
        isGreeting,
        clientId: getClientId(),
        origin: window.location.origin,
        authToken: token,
      }

      if (article) {
        requestBody.article = {
          title: article.title,
          content: article.content,
          vocabulary: article.vocabulary,
          discussionPoints: article.discussionPoints
        }
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(requestBody),
        redirect: 'follow',
      })

      const data = await response.json()

      if (!data.success) {
        // If token error, clear token and retry once
        if (data.isTokenError) {
          clearAuthToken()
          const newToken = await requestAuthToken()
          if (newToken) {
            requestBody.authToken = newToken
            const retryResponse = await fetch(API_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'text/plain;charset=utf-8',
              },
              body: JSON.stringify(requestBody),
              redirect: 'follow',
            })
            const retryData = await retryResponse.json()
            if (retryData.success) {
              return {
                reply: retryData.reply,
                hints: retryData.hints || []
              }
            }
          }
        }
        throw { isRateLimit: data.isRateLimit, isTokenError: data.isTokenError, message: data.error }
      }

      return {
        reply: data.reply,
        hints: data.hints || []
      }
    } catch (err) {
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Initialize token on first use
  async function init() {
    if (API_URL && !authToken) {
      await requestAuthToken()
    }
  }

  return {
    isLoading,
    error,
    sendMessage,
    init
  }
}

function getDemoResponse({ characterId, levelId, isGreeting, articleTitle }) {
  if (articleTitle && isGreeting) {
    return `Hey! I just read this article about "${articleTitle}" - it's pretty interesting! What did you think about it?`
  }

  const greetings = {
    emma: {
      beginner: "Hey! I'm Emma. How are you today?",
      intermediate: "Hey there! Just grabbed my coffee. I'm Emma by the way - how's your day going?",
      advanced: "Hey! Ugh, Mochi knocked over my coffee this morning - still recovering honestly. Anyway, I'm Emma! What's up with you?",
    },
    marcus: {
      beginner: "Hey! I'm Marcus. Nice to meet you. How are you?",
      intermediate: "Yo! Taking a break from staring at code. I'm Marcus - what's going on?",
      advanced: "Hey there. Tokyo's being Tokyo - chaotic but fun. I'm Marcus by the way. Just procrastinating a bit, you know how it is. What about you?",
    },
  }

  const responses = {
    emma: {
      beginner: 'That is nice! I like that. Today I went to a cafe. The coffee was good.',
      intermediate: "Oh nice! That reminds me - I've been meaning to try this new place near my office. Have you been anywhere good lately?",
      advanced: "Ha, I feel that. Speaking of which, I finally dragged myself to that cafe everyone's been hyping up. Gotta say, it lowkey lived up to the hype.",
    },
    marcus: {
      beginner: 'That is interesting. Today I ate ramen. It was delicious.',
      intermediate: 'Oh yeah, I get that. Stumbled upon this hole-in-the-wall ramen place today actually. Honestly blew my mind.',
      advanced: "Right, so funny story - I was properly lost in Shibuya earlier, classic me, and somehow ended up at this dodgy-looking ramen spot. Absolute scenes. Best accidental discovery in ages.",
    },
  }

  if (isGreeting) {
    return greetings[characterId]?.[levelId] || greetings.emma.intermediate
  }
  return responses[characterId]?.[levelId] || responses.emma.intermediate
}
