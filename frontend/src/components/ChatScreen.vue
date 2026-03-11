<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useChatStorage } from '../composables/useChatStorage'
import { useChatApi } from '../composables/useChatApi'
import { useUserProgress } from '../composables/useUserProgress'
import { useNavState } from '../composables/useNavState'
import ChatHeader from './chat/ChatHeader.vue'
import ChatMessage from './chat/ChatMessage.vue'
import ChatInput from './chat/ChatInput.vue'
import VocabularyHints from './chat/VocabularyHints.vue'
import ArticlePanel from './chat/ArticlePanel.vue'
import TypingIndicator from './chat/TypingIndicator.vue'
import WordSavePopup from './chat/WordSavePopup.vue'
import VocabularyBankPanel from './chat/VocabularyBankPanel.vue'
import LevelUpModal from './chat/LevelUpModal.vue'
import StreakMilestoneModal from './chat/StreakMilestoneModal.vue'
import AchievementUnlockModal from './chat/AchievementUnlockModal.vue'
import MicroReward from './MicroReward.vue'

const { t } = useI18n()
const router = useRouter()
const {
  selectedCharacter: character,
  selectedLevel: level,
  selectedLanguage: language,
  selectedArticle: article,
  chatMode: mode,
  activeScenario: scenario,
  clearArticle,
} = useNavState()

// Guard: redirect if missing required state
if (!character.value || !level.value) {
  router.replace('/')
}

// Computed
const isArticleMode = computed(() => mode.value === 'article' && article.value)

// Storage config
const storageConfig = computed(() => ({
  language: language.value,
  characterId: character.value?.id,
  levelId: level.value?.id,
  isArticleMode: isArticleMode.value,
  articleId: article.value?.id
}))

// Composables
const storage = useChatStorage(storageConfig)
const { isLoading, error, sendMessage: apiSendMessage, sendFeedback } = useChatApi()
const {
  onMessageSent,
  onMessageReceived,
  onArticleStarted,
  trackCharacterInteraction
} = useUserProgress()

// Daily goal timer
import { useDailyGoal } from '../composables/useDailyGoal'
const { startTimer, stopTimer } = useDailyGoal()

// Daily challenge
import { useDailyChallenge } from '../composables/useDailyChallenge'
const { trackChallengeMessage, getChallengeContext, isChallengeCompleted } = useDailyChallenge()

// Weekly quests
import { useWeeklyQuests } from '../composables/useWeeklyQuests'
const { onChatMessage: onQuestChatMessage } = useWeeklyQuests()

// Micro-reward
const showMicroReward = ref(null) // null | 'sparkle' | 'confetti' | 'check'

// State
const messages = ref([])
const inputText = ref('')
const currentHints = ref([])
const errorMessage = ref('')
const showArticle = ref(true)
const wordPopup = ref(null)
const showVocabBank = ref(false)

// Refs
const messagesContainer = ref(null)
const chatInputRef = ref(null)

// Lifecycle
onMounted(() => {
  const saved = storage.load()
  if (saved.messages.length > 0) {
    // Clear stale loading states from previous sessions
    saved.messages.forEach(m => {
      if (m.feedbackLoading) m.feedbackLoading = false
    })
    messages.value = saved.messages
    currentHints.value = saved.hints
    scrollToBottom()
  } else {
    getAIResponse(true)
  }

  // Track article started if in article mode
  if (isArticleMode.value && article.value) {
    onArticleStarted(article.value.id)
  }

  // Auto-save on changes
  storage.autoSave(messages, currentHints)

  // Start daily goal timer
  startTimer()
})

onBeforeUnmount(() => {
  stopTimer()
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
  trackCharacterInteraction(character.value?.id)

  // Track weekly quest progress
  onQuestChatMessage()

  // Track daily challenge progress
  const challengeJustCompleted = trackChallengeMessage()
  if (challengeJustCompleted) {
    showMicroReward.value = 'confetti'
  }

  await getAIResponse()
}

async function getAIResponse(isGreeting = false) {
  errorMessage.value = ''

  try {
    // Inject daily challenge or scenario context
    let challengeNote = null
    const challengeTopic = getChallengeContext()
    if (scenario.value) {
      challengeNote = `[System: You are now in a role-play scenario. Title: "${scenario.value.title}". The user's goal: "${scenario.value.goal}". Stay in character and play out the scenario naturally. Guide the conversation toward the goal. When the user achieves the goal, acknowledge it naturally.]`
    } else if (challengeTopic && !isChallengeCompleted.value) {
      challengeNote = `[Today's conversation topic: "${challengeTopic}". Naturally guide the conversation toward this topic.]`
    }

    const result = await apiSendMessage({
      messages: messages.value,
      characterId: character.value.id,
      levelId: level.value.id,
      language: language.value,
      isGreeting,
      article: isArticleMode.value ? article.value : null,
      challengeContext: challengeNote
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


async function handleExplain(message) {
  if (message.feedback || message.feedbackLoading) return

  message.feedbackLoading = true
  message.feedbackError = false
  try {
    // Find message index using content match (handles deserialized objects)
    const msgIndex = messages.value.findIndex(m => m === message || (m.role === message.role && m.content === message.content))
    const contextStart = Math.max(0, msgIndex - 4)
    const contextEnd = msgIndex > 0 ? msgIndex : 0
    const context = messages.value.slice(contextStart, contextEnd).map(m => ({
      role: m.role,
      content: m.content
    }))

    const feedback = await sendFeedback({
      userMessage: message.content,
      context,
      level: level.value.id,
      language: language.value,
    })

    message.feedback = feedback
  } catch (err) {
    console.error('Feedback error:', err)
    message.feedback = null
    message.feedbackError = true
  } finally {
    message.feedbackLoading = false
  }
}

function handleRenewChat() {
  messages.value = []
  currentHints.value = []
  storage.clear()
  getAIResponse(true)
}

function handleWordTap(data) {
  // Clamp position to viewport
  const x = Math.max(8, Math.min(data.position.x, window.innerWidth - 270))
  const y = Math.max(8, Math.min(data.position.y, window.innerHeight - 200))
  wordPopup.value = { ...data, position: { x, y } }
}

function handleToggleArticle() {
  showArticle.value = !showArticle.value
}

function handleBack() {
  if (mode.value === 'article') {
    clearArticle()
    router.push('/articles')
  } else {
    router.push('/')
  }
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
        @back="handleBack()"
        @toggle-article="handleToggleArticle"
        @renew-chat="handleRenewChat"
        @toggle-vocab-bank="showVocabBank = !showVocabBank"
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
              <span class="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{{ new Date().toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'zh' ? 'zh-TW' : 'en-US', { month: 'short', day: 'numeric' }) }}</span>
            </div>

            <!-- Messages -->
            <ChatMessage
              v-for="(msg, i) in messages"
              :key="i"
              :message="msg"
              :character="character"
              @explain="handleExplain"
              @word-tap="handleWordTap"
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
            :language="language"
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

    <!-- Word Save Popup -->
    <WordSavePopup
      v-if="wordPopup"
      :word="wordPopup.word"
      :context="wordPopup.context"
      :position="wordPopup.position"
      @close="wordPopup = null"
    />

    <!-- Vocabulary Bank Panel -->
    <VocabularyBankPanel
      v-if="showVocabBank"
      @close="showVocabBank = false"
    />

    <!-- Micro Reward Animation -->
    <MicroReward
      v-if="showMicroReward"
      :type="showMicroReward"
      @done="showMicroReward = null"
    />
  </div>
</template>
