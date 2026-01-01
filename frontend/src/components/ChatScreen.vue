<script setup>
import { ref, nextTick, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChatStorage } from '../composables/useChatStorage'
import { useChatApi } from '../composables/useChatApi'
import { useUserProgress } from '../composables/useUserProgress'
import ChatHeader from './chat/ChatHeader.vue'
import ChatMessage from './chat/ChatMessage.vue'
import ChatInput from './chat/ChatInput.vue'
import VocabularyHints from './chat/VocabularyHints.vue'
import ArticlePanel from './chat/ArticlePanel.vue'
import TypingIndicator from './chat/TypingIndicator.vue'
import LevelUpModal from './chat/LevelUpModal.vue'
import StreakMilestoneModal from './chat/StreakMilestoneModal.vue'
import AchievementUnlockModal from './chat/AchievementUnlockModal.vue'

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

const emit = defineEmits(['back'])

// Computed
const isArticleMode = computed(() => props.mode === 'article' && props.article)

// Storage config
const storageConfig = computed(() => ({
  language: props.language,
  characterId: props.character.id,
  levelId: props.level.id,
  isArticleMode: isArticleMode.value,
  articleId: props.article?.id
}))

// Composables
const storage = useChatStorage(storageConfig)
const { isLoading, error, sendMessage: apiSendMessage } = useChatApi()
const {
  onMessageSent,
  onMessageReceived,
  onArticleStarted,
  trackCharacterInteraction
} = useUserProgress()

// State
const messages = ref([])
const inputText = ref('')
const currentHints = ref([])
const errorMessage = ref('')
const showArticle = ref(true)

// Refs
const messagesContainer = ref(null)
const chatInputRef = ref(null)

// Lifecycle
onMounted(() => {
  const saved = storage.load()
  if (saved.messages.length > 0) {
    messages.value = saved.messages
    currentHints.value = saved.hints
    scrollToBottom()
  } else {
    getAIResponse(true)
  }

  // Track article started if in article mode
  if (isArticleMode.value && props.article) {
    onArticleStarted(props.article.id)
  }

  // Auto-save on changes
  storage.autoSave(messages, currentHints)
})

// Methods
async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function focusInput() {
  nextTick(() => {
    chatInputRef.value?.focus()
  })
}

async function handleSendMessage() {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  messages.value.push({
    role: 'user',
    content: text,
  })
  inputText.value = ''
  currentHints.value = []
  scrollToBottom()

  // Track XP for sending message
  onMessageSent()
  trackCharacterInteraction(props.character.id)

  await getAIResponse()
}

async function getAIResponse(isGreeting = false) {
  errorMessage.value = ''

  try {
    const result = await apiSendMessage({
      messages: messages.value,
      characterId: props.character.id,
      levelId: props.level.id,
      language: props.language,
      isGreeting,
      article: isArticleMode.value ? props.article : null
    })

    messages.value.push({
      role: 'assistant',
      content: result.reply,
    })

    // Track XP for receiving response
    onMessageReceived()

    if (result.hints.length > 0) {
      currentHints.value = result.hints
    }
  } catch (err) {
    console.error('Chat error:', err)
    errorMessage.value = err.isRateLimit
      ? t('chat.rateLimitError')
      : t('chat.genericError')
  }

  scrollToBottom()
  focusInput()
}


function handleRenewChat() {
  messages.value = []
  currentHints.value = []
  storage.clear()
  getAIResponse(true)
}

function handleToggleArticle() {
  showArticle.value = !showArticle.value
}
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden">
    <div class="flex flex-1 flex-col h-full relative bg-background-light dark:bg-background-dark">
      <!-- Header -->
      <ChatHeader
        :character="character"
        :level="level"
        :is-article-mode="isArticleMode"
        :show-article="showArticle"
        :is-loading="isLoading"
        @back="emit('back')"
        @toggle-article="handleToggleArticle"
        @renew-chat="handleRenewChat"
      />

      <!-- Content Area -->
      <div class="flex flex-1 overflow-hidden" :class="isArticleMode && showArticle ? 'flex-col lg:flex-row' : 'flex-col'">
        <!-- Article Panel -->
        <ArticlePanel
          v-if="isArticleMode && showArticle"
          :article="article"
        />

        <!-- Chat Area -->
        <div class="flex flex-col flex-1 overflow-hidden">
          <div ref="messagesContainer" class="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-6 scroll-smooth">
            <!-- Date Separator -->
            <div class="flex justify-center">
              <span class="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Today</span>
            </div>

            <!-- Messages -->
            <ChatMessage
              v-for="(msg, i) in messages"
              :key="i"
              :message="msg"
              :character="character"
            />

            <!-- Typing Indicator -->
            <TypingIndicator
              v-if="isLoading"
              :character="character"
            />

            <!-- Error Banner -->
            <div v-if="errorMessage" class="flex items-center justify-between p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl">
              <span>{{ errorMessage }}</span>
              <button @click="errorMessage = ''" class="material-symbols-outlined text-lg">close</button>
            </div>

            <!-- Vocabulary Hints -->
            <VocabularyHints
              v-if="!isArticleMode"
              :hints="currentHints"
            />

            <!-- Spacer -->
            <div class="h-4"></div>
          </div>

          <!-- Input Area -->
          <ChatInput
            ref="chatInputRef"
            v-model="inputText"
            :disabled="isLoading"
            @send="handleSendMessage"
          />
        </div>
      </div>
    </div>

    <!-- Level Up Modal -->
    <LevelUpModal />

    <!-- Streak Milestone Modal -->
    <StreakMilestoneModal />

    <!-- Achievement Unlock Modal -->
    <AchievementUnlockModal />
  </div>
</template>
