<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  character: Object,
  level: Object,
  language: {
    type: String,
    default: 'en'
  }
})

// Compression utilities using LZW-like encoding
function compress(str) {
  if (!str) return ''
  return btoa(encodeURIComponent(str))
}

function decompress(str) {
  if (!str) return ''
  try {
    return decodeURIComponent(atob(str))
  } catch {
    return ''
  }
}

function getStorageKey() {
  return `chatmate_${props.language}_${props.character.id}_${props.level.id}`
}

function saveChat() {
  const key = getStorageKey()
  const data = JSON.stringify({
    messages: messages.value,
    hints: currentHints.value
  })
  localStorage.setItem(key, compress(data))
}

function loadChat() {
  const key = getStorageKey()
  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      const data = decompress(stored)
      const parsed = JSON.parse(data)
      // Handle old format (just messages array) and new format (object with messages and hints)
      if (Array.isArray(parsed)) {
        return { messages: parsed, hints: [] }
      }
      return { messages: parsed.messages || [], hints: parsed.hints || [] }
    } catch {
      return { messages: [], hints: [] }
    }
  }
  return { messages: [], hints: [] }
}

const emit = defineEmits(['back'])

const messages = ref([])
const inputText = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)
const currentHints = ref([])
const errorMessage = ref('')

// Backend URL - will be set after deploying Google Apps Script
const API_URL = import.meta.env.VITE_API_URL || ''

onMounted(() => {
  // Load saved chat data
  const saved = loadChat()
  if (saved.messages.length > 0) {
    messages.value = saved.messages
    currentHints.value = saved.hints
    scrollToBottom()
  } else {
    // Send initial greeting from AI only if no saved messages
    getAIResponse(true)
  }
})

// Save chat whenever messages or hints change
watch([messages, currentHints], () => {
  saveChat()
}, { deep: true })

async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  // Add user message
  messages.value.push({
    role: 'user',
    content: text,
  })
  inputText.value = ''
  currentHints.value = [] // Clear hints when user sends
  scrollToBottom()

  // Get AI response
  await getAIResponse()
}

async function getAIResponse(isGreeting = false) {
  isLoading.value = true
  errorMessage.value = ''

  try {
    if (!API_URL) {
      // Demo mode - simulate response
      await new Promise((r) => setTimeout(r, 1000))
      const demoResponses = getDemoResponse(isGreeting)
      messages.value.push({
        role: 'assistant',
        content: demoResponses,
      })
    } else {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          messages: messages.value,
          character: props.character.id,
          level: props.level.id,
          language: props.language,
          isGreeting,
        }),
        redirect: 'follow',
      })
      const data = await response.json()

      if (!data.success) {
        throw { isRateLimit: data.isRateLimit, message: data.error }
      }

      messages.value.push({
        role: 'assistant',
        content: data.reply,
      })
      // Store hints for display
      if (data.hints && data.hints.length > 0) {
        currentHints.value = data.hints
      }
    }
  } catch (error) {
    console.error('Error:', error)
    errorMessage.value = error.isRateLimit
      ? t('chat.rateLimitError')
      : t('chat.genericError')
  }

  isLoading.value = false
  scrollToBottom()
}

function getDemoResponse(isGreeting) {
  const greetings = {
    emma: {
      beginner: "Hey! I'm Emma. How are you today?",
      intermediate:
        "Hey there! Just grabbed my coffee. I'm Emma by the way - how's your day going?",
      advanced:
        "Hey! Ugh, Mochi knocked over my coffee this morning - still recovering honestly. Anyway, I'm Emma! What's up with you?",
    },
    marcus: {
      beginner: "Hey! I'm Marcus. Nice to meet you. How are you?",
      intermediate:
        "Yo! Taking a break from staring at code. I'm Marcus - what's going on?",
      advanced:
        "Hey there. Tokyo's being Tokyo - chaotic but fun. I'm Marcus by the way. Just procrastinating a bit, you know how it is. What about you?",
    },
  }

  const responses = {
    emma: {
      beginner: 'That is nice! I like that. Today I went to a cafe. The coffee was good.',
      intermediate:
        "Oh nice! That reminds me - I've been meaning to try this new place near my office. Have you been anywhere good lately?",
      advanced:
        "Ha, I feel that. Speaking of which, I finally dragged myself to that cafe everyone's been hyping up. Gotta say, it lowkey lived up to the hype.",
    },
    marcus: {
      beginner: 'That is interesting. Today I ate ramen. It was delicious.',
      intermediate:
        'Oh yeah, I get that. Stumbled upon this hole-in-the-wall ramen place today actually. Honestly blew my mind.',
      advanced:
        "Right, so funny story - I was properly lost in Shibuya earlier, classic me, and somehow ended up at this dodgy-looking ramen spot. Absolute scenes. Best accidental discovery in ages.",
    },
  }

  const charId = props.character.id
  const levelId = props.level.id

  if (isGreeting) {
    return greetings[charId]?.[levelId] || greetings.emma.intermediate
  }
  return responses[charId]?.[levelId] || responses.emma.intermediate
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

function useHint(word) {
  if (inputText.value) {
    inputText.value += ' ' + word
  } else {
    inputText.value = word
  }
}

function renewChat() {
  messages.value = []
  currentHints.value = []
  localStorage.removeItem(getStorageKey())
  getAIResponse(true)
}
</script>

<template>
  <div class="chat-screen">
    <header class="chat-header">
      <button class="back-btn" @click="emit('back')">←</button>
      <div class="header-info">
        <span class="avatar">{{ character.avatar }}</span>
        <span class="name">{{ character.name }}</span>
        <span class="level-badge">{{ t(`levels.${level.id}.name`) }}</span>
      </div>
      <button class="renew-btn" @click="renewChat" :disabled="isLoading">↻</button>
    </header>

    <div class="messages" ref="messagesContainer">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="message"
        :class="msg.role"
      >
        <div class="bubble">{{ msg.content }}</div>
      </div>
      <div v-if="isLoading" class="message assistant">
        <div class="bubble typing">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div v-if="errorMessage" class="error-banner">
        {{ errorMessage }}
        <button @click="errorMessage = ''" class="error-close">x</button>
      </div>
    </div>

    <!-- Word hints -->
    <div v-if="currentHints.length > 0" class="hints-area">
      <span class="hints-label">{{ t('chat.tryUsing') }}</span>
      <div class="hints-list">
        <button
          v-for="hint in currentHints"
          :key="hint.word"
          class="hint-chip"
          @click="useHint(hint.word)"
        >
          <span class="hint-word">{{ hint.word }}</span>
          <span class="hint-desc">{{ hint.description }}</span>
          <span class="hint-example">"{{ hint.example }}"</span>
        </button>
      </div>
    </div>

    <div class="input-area">
      <textarea
        v-model="inputText"
        :placeholder="t('chat.typeMessage')"
        @keydown="handleKeydown"
        :disabled="isLoading"
      ></textarea>
      <button @click="sendMessage" :disabled="!inputText.trim() || isLoading">
        {{ t('chat.send') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-screen {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 600px;
  margin: 0 auto;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  background: white;
}

.back-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.renew-btn {
  background: none;
  border: 1px solid #ddd;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  color: #666;
  transition: all 0.2s;
}

.renew-btn:hover:not(:disabled) {
  background: #f0f0f0;
  color: #333;
}

.renew-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.avatar {
  font-size: 1.5rem;
}

.name {
  font-weight: 600;
}

.level-badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: #e8f4e8;
  border-radius: 1rem;
  color: #2d5a2d;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.message {
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.bubble {
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  line-height: 1.4;
}

.user .bubble {
  background: #4a90d9;
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.assistant .bubble {
  background: #f0f0f0;
  color: #333;
  border-bottom-left-radius: 0.25rem;
}

.typing {
  display: flex;
  gap: 0.3rem;
  padding: 1rem;
}

.typing span {
  width: 8px;
  height: 8px;
  background: #999;
  border-radius: 50%;
  animation: bounce 1.4s infinite;
}

.typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

.error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  margin: 0.5rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

.error-close {
  background: none;
  border: none;
  color: #991b1b;
  font-size: 1rem;
  cursor: pointer;
  padding: 0 0.25rem;
}

.error-close:hover {
  color: #7f1d1d;
}

.input-area {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  background: white;
}

.input-area textarea {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 1rem;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  min-height: 44px;
  max-height: 120px;
}

.input-area textarea:focus {
  outline: none;
  border-color: #4a90d9;
}

.input-area button {
  padding: 0.75rem 1.5rem;
  background: #4a90d9;
  color: white;
  border: none;
  border-radius: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.input-area button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.input-area button:hover:not(:disabled) {
  background: #3a7bc8;
}

/* Hints area */
.hints-area {
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
}

.hints-label {
  font-size: 0.75rem;
  color: #666;
  display: block;
  margin-bottom: 0.5rem;
}

.hints-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.hint-chip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.hint-chip:hover {
  border-color: #4a90d9;
  background: #f0f7ff;
}

.hint-word {
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
}

.hint-desc {
  font-size: 0.7rem;
  color: #888;
  margin-top: 0.15rem;
}

.hint-example {
  font-size: 0.7rem;
  color: #666;
  font-style: italic;
  margin-top: 0.25rem;
  line-height: 1.3;
}
</style>
