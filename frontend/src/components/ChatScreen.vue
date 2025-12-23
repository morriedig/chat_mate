<script setup>
import { ref, nextTick, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  character: Object,
  level: Object,
  language: {
    type: String,
    default: 'en'
  },
  article: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'free'
  }
})

const isArticleMode = computed(() => props.mode === 'article' && props.article)
const showArticle = ref(true)

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
  const base = `chatmate_${props.language}_${props.character.id}_${props.level.id}`
  if (isArticleMode.value) {
    return `${base}_article_${props.article.id}`
  }
  return base
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
const inputRef = ref(null)
const currentHints = ref([])
const errorMessage = ref('')

const API_URL = import.meta.env.VITE_API_URL || ''

onMounted(() => {
  const saved = loadChat()
  if (saved.messages.length > 0) {
    messages.value = saved.messages
    currentHints.value = saved.hints
    scrollToBottom()
  } else {
    getAIResponse(true)
  }
})

watch([messages, currentHints], () => {
  saveChat()
}, { deep: true })

async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function focusInput() {
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  messages.value.push({
    role: 'user',
    content: text,
  })
  inputText.value = ''
  currentHints.value = []
  scrollToBottom()

  await getAIResponse()
}

async function getAIResponse(isGreeting = false) {
  isLoading.value = true
  errorMessage.value = ''

  try {
    if (!API_URL) {
      await new Promise((r) => setTimeout(r, 1000))
      const demoResponses = getDemoResponse(isGreeting)
      messages.value.push({
        role: 'assistant',
        content: demoResponses,
      })
    } else {
      const requestBody = {
        messages: messages.value,
        character: props.character.id,
        level: props.level.id,
        language: props.language,
        isGreeting,
      }

      if (isArticleMode.value) {
        requestBody.article = {
          title: props.article.title,
          content: props.article.content,
          vocabulary: props.article.vocabulary,
          discussionPoints: props.article.discussionPoints
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
        throw { isRateLimit: data.isRateLimit, message: data.error }
      }

      messages.value.push({
        role: 'assistant',
        content: data.reply,
      })
      if (data.hints && data.hints.length > 0) {
        currentHints.value = data.hints
      }
    }
  } catch (error) {
    console.error('Chat error:', error)
    errorMessage.value = error.isRateLimit
      ? t('chat.rateLimitError')
      : t('chat.genericError')
  }

  isLoading.value = false
  scrollToBottom()
  focusInput()
}

function getDemoResponse(isGreeting) {
  if (isArticleMode.value && isGreeting) {
    return `Hey! I just read this article about "${props.article.title}" - it's pretty interesting! What did you think about it?`
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

function toggleArticle() {
  showArticle.value = !showArticle.value
}
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden">
    <!-- Main Content Area -->
    <div class="flex flex-1 flex-col h-full relative bg-background-light dark:bg-background-dark">
      <!-- TopNavBar -->
      <header class="flex items-center justify-between border-b border-[#e7eff3] dark:border-slate-800 px-4 sm:px-6 py-4 bg-surface-light dark:bg-surface-dark z-10 shadow-sm">
        <div class="flex items-center gap-3 text-text-main dark:text-white">
          <button @click="emit('back')" class="flex items-center justify-center">
            <span class="material-symbols-outlined cursor-pointer">arrow_back</span>
          </button>
          <div class="flex items-center justify-center rounded-full size-10 shrink-0 shadow-sm border-2 border-white dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-2xl">
            {{ character.avatar }}
          </div>
          <div class="flex flex-col">
            <h2 class="text-base font-bold leading-tight tracking-[-0.015em]">{{ character.name }}</h2>
            <span class="text-xs text-text-muted dark:text-slate-400">{{ t(`levels.${level.id}.name`) }}</span>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold">Online</span>
          <span v-if="isArticleMode" class="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold">{{ t('chat.articleMode') }}</span>
        </div>
        <div class="flex items-center gap-2">
          <!-- Article toggle button -->
          <button
            v-if="isArticleMode"
            @click="toggleArticle"
            class="hidden sm:flex h-9 px-3 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 text-sm font-medium transition-colors"
          >
            <span class="mr-1 material-symbols-outlined text-[18px]">article</span>
            {{ showArticle ? 'Hide' : 'Show' }}
          </button>
          <button
            @click="renewChat"
            :disabled="isLoading"
            class="flex h-9 px-3 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 text-sm font-medium transition-colors disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-[18px]">refresh</span>
            <span class="hidden sm:inline ml-1">New Chat</span>
          </button>
        </div>
      </header>

      <!-- Content Area (Article + Chat side by side in article mode) -->
      <div class="flex flex-1 overflow-hidden" :class="isArticleMode && showArticle ? 'flex-col lg:flex-row' : 'flex-col'">
        <!-- Article Panel (side panel in article mode) -->
        <div v-if="isArticleMode && showArticle" class="w-full lg:w-[500px] shrink-0 max-h-64 lg:max-h-none border-b lg:border-b-0 lg:border-r border-[#e7eff3] dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 overflow-y-auto">
          <h3 class="font-bold text-lg mb-2 text-text-main dark:text-white">{{ article.title }}</h3>
          <p class="text-sm text-text-main dark:text-slate-300 whitespace-pre-line mb-3">{{ article.content }}</p>
          <div class="mb-3">
            <span class="text-xs font-bold text-primary uppercase tracking-wider">{{ t('articles.keyWords') }}</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <div v-for="item in article.vocabulary" :key="item.word" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
              <span class="font-semibold text-primary text-sm">{{ item.word }}</span>
              <span class="text-xs text-text-muted dark:text-slate-400 block">{{ item.definition }}</span>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="flex flex-col flex-1 overflow-hidden">
          <div ref="messagesContainer" class="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-6 scroll-smooth">
        <!-- Date Separator -->
        <div class="flex justify-center">
          <span class="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Today</span>
        </div>

        <!-- Messages -->
        <template v-for="(msg, i) in messages" :key="i">
          <!-- Bot Message -->
          <div v-if="msg.role === 'assistant'" class="flex items-end gap-2 sm:gap-3 max-w-[calc(100%-2.5rem)] sm:max-w-3xl">
            <div class="flex items-center justify-center rounded-full size-8 sm:size-10 shrink-0 shadow-sm bg-slate-100 dark:bg-slate-800 text-xl sm:text-2xl">
              {{ character.avatar }}
            </div>
            <div class="flex flex-col gap-1 items-start min-w-0 overflow-hidden">
              <span class="text-text-muted dark:text-slate-400 text-[13px] font-medium ml-1">{{ character.name }}</span>
              <div class="p-3 sm:p-4 rounded-2xl rounded-bl-none bg-surface-light dark:bg-surface-dark text-text-main dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700">
                <p class="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">{{ msg.content }}</p>
              </div>
            </div>
          </div>

          <!-- User Message -->
          <div v-else class="flex items-end gap-2 sm:gap-3 justify-end">
            <div class="flex flex-col gap-1 items-end min-w-0 max-w-[80%] sm:max-w-xl">
              <span class="text-text-muted dark:text-slate-400 text-[13px] font-medium mr-1">You</span>
              <div class="p-3 sm:p-4 rounded-2xl rounded-br-none bg-primary text-[#0d171b] shadow-md">
                <p class="text-sm sm:text-base leading-relaxed font-medium whitespace-pre-wrap break-words">{{ msg.content }}</p>
              </div>
            </div>
            <div class="flex items-center justify-center rounded-full size-8 sm:size-10 shrink-0 shadow-sm bg-primary/20 text-xl sm:text-2xl">
              👤
            </div>
          </div>
        </template>

        <!-- Typing Indicator -->
        <div v-if="isLoading" class="flex items-end gap-2 sm:gap-3 max-w-full sm:max-w-3xl">
          <div class="flex items-center justify-center rounded-full size-8 sm:size-10 shrink-0 shadow-sm bg-slate-100 dark:bg-slate-800 text-xl sm:text-2xl">
            {{ character.avatar }}
          </div>
          <div class="flex flex-col gap-1 items-start">
            <span class="text-text-muted dark:text-slate-400 text-[13px] font-medium ml-1">{{ character.name }}</span>
            <div class="p-3 sm:p-4 rounded-2xl rounded-bl-none bg-surface-light dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700">
              <div class="flex gap-1">
                <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Banner -->
        <div v-if="errorMessage" class="flex items-center justify-between p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl">
          <span>{{ errorMessage }}</span>
          <button @click="errorMessage = ''" class="material-symbols-outlined text-lg">close</button>
        </div>

        <!-- Vocabulary Suggestions (hidden in article mode) -->
        <div v-if="currentHints.length > 0 && !isArticleMode" class="sm:max-w-3xl" style="max-width: calc(100vw - 2rem);">
          <div class="flex items-center gap-2 mb-3 px-1">
            <span class="material-symbols-outlined text-primary text-sm">auto_awesome</span>
            <span class="text-xs font-bold text-primary uppercase tracking-wider">{{ t('chat.tryUsing') }}</span>
          </div>
          <div class="flex gap-3 pb-2 overflow-x-auto sm:grid sm:grid-cols-3 sm:overflow-visible">
            <div
              v-for="hint in currentHints"
              :key="hint.word"
              @click="useHint(hint.word)"
              class="group flex flex-col p-3 sm:p-4 bg-white dark:bg-[#1e2930] rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md shrink-0 w-48 sm:w-auto sm:shrink"
            >
              <div class="flex justify-between items-start mb-2">
                <span class="font-bold text-primary text-lg">{{ hint.word }}</span>
                <span class="material-symbols-outlined text-slate-300 group-hover:text-primary text-[20px]">add_circle</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">{{ hint.description }}</p>
              <div class="mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                <p class="text-xs italic text-text-main dark:text-slate-300">"{{ hint.example }}"</p>
              </div>
            </div>
          </div>
        </div>

          <!-- Spacer for scrolling -->
          <div class="h-4"></div>
          </div>

          <!-- Input Area -->
          <div class="p-4 sm:p-6 bg-surface-light dark:bg-surface-dark border-t border-[#e7eff3] dark:border-slate-800 z-10">
            <div class="flex items-center gap-3 max-w-4xl mx-auto">
              <!-- Text Input Field -->
              <div class="flex-1 relative">
                <textarea
                  ref="inputRef"
                  v-model="inputText"
                  @keydown="handleKeydown"
                  :disabled="isLoading"
                  class="w-full resize-none rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1e2930] text-text-main dark:text-white px-4 py-3 pr-12 text-base focus:border-primary focus:ring-1 focus:ring-primary dark:focus:ring-primary placeholder-slate-400 disabled:opacity-50"
                  :placeholder="t('chat.typeMessage')"
                  rows="1"
                  style="min-height: 50px; max-height: 150px;"
                ></textarea>
              </div>
              <!-- Send Button -->
              <button
                @click="sendMessage"
                :disabled="!inputText.trim() || isLoading"
                class="shrink-0 flex items-center justify-center size-12 rounded-full bg-primary text-[#0d171b] shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                <span class="material-symbols-outlined icon-filled text-[24px]">send</span>
              </button>
            </div>
            <div class="text-center mt-2">
              <p class="text-[11px] text-slate-400 dark:text-slate-500">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
