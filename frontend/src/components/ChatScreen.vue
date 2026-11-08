<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useChatStorage } from '../composables/useChatStorage'
import { useChatApi } from '../composables/useChatApi'
import { useUserProgress } from '../composables/useUserProgress'
import { useNavState } from '../composables/useNavState'
import { useCharacterMemory } from '../composables/useCharacterMemory'
import ChatHeader from './chat/ChatHeader.vue'
import ChatMessage from './chat/ChatMessage.vue'
import ChatInput from './chat/ChatInput.vue'
import VoiceConversationBar from './chat/VoiceConversationBar.vue'
import VocabularyHints from './chat/VocabularyHints.vue'
import ArticlePanel from './chat/ArticlePanel.vue'
import TypingIndicator from './chat/TypingIndicator.vue'
import WordSavePopup from './chat/WordSavePopup.vue'
import VocabularyBankPanel from './chat/VocabularyBankPanel.vue'
import DailyPromptCard from './chat/DailyPromptCard.vue'
import CharacterMemoryPanel from './chat/CharacterMemoryPanel.vue'
import ConnectorHintStrip from './chat/ConnectorHintStrip.vue'
import OpinionSummaryPanel from './chat/OpinionSummaryPanel.vue'
import { useOpinionChat, getHintBatch, buildOpinionSummary } from '../composables/useOpinionChat'
import { useMotherTongue } from '../composables/useMotherTongue'
import { detectConnectors } from '../utils/connectorDetect'
import ConnectorMissionBar from './chat/ConnectorMissionBar.vue'
import ProgressPanel from './ProgressPanel.vue'
import CmAvatar from './ui/CmAvatar.vue'
import CmBottomSheet from './ui/CmBottomSheet.vue'
import { MISSION_TYPE, getUsedTargetIds } from '../composables/useConnectorMission'
import { PATTERN_TASK_TYPE, getUsedPatternIds, taskText } from '../composables/usePatternTask'
import ChatSummaryPanel from './chat/ChatSummaryPanel.vue'

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
// Opinion chat (chat-first entry from the home card)
const isOpinionMode = computed(() => mode.value === 'opinion')
// Connector mission ("use it in chat" bridge from a chapter quiz).
// The two modes are exclusive: setChatState() clears the scenario for opinion chats.
const mission = computed(() => !isOpinionMode.value && [MISSION_TYPE, PATTERN_TASK_TYPE].includes(scenario.value?.type) ? scenario.value : null)
// Task chat: today's patterns, a goal, and an AI summary at the end
const isTaskMode = computed(() => mission.value?.type === PATTERN_TASK_TYPE)
const showTaskSummary = ref(false)

// Storage config
const storageConfig = computed(() => ({
  language: language.value,
  characterId: character.value?.id,
  levelId: level.value?.id,
  isArticleMode: isArticleMode.value,
  articleId: article.value?.id,
  sessionTag: isOpinionMode.value ? 'opinion' : (mission.value?.id || null),
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

// Scenario roleplay
import { useScenarioRoleplay } from '../composables/useScenarioRoleplay'
import { useMistakes, parseCorrectionText } from '../composables/useMistakes'
const { buildScenarioPrompt, buildOpinionPrompt } = useScenarioRoleplay()

// Opinion chat (chat-first prototype): connector hints, highlights and summary
const {
  topic: opinionTopic,
  topicText: opinionTopicText,
  nextTopic: nextOpinionTopic,
  markChatTopic,
  isChatOnCurrentTopic,
  getConnectorInfo,
  targets: connectorTargets,
} = useOpinionChat()
const { motherTongue } = useMotherTongue()
const { addMistake } = useMistakes()

// Chat corrections like `"I am agree" → "I agree" — …` come back as review cards
function saveFeedbackMistakes(feedback) {
  const corrections = feedback?.grammar?.corrections || []
  const types = feedback?.grammar?.correctionTypes || []
  corrections.forEach((text, i) => {
    const parsed = parseCorrectionText(text)
    if (parsed) addMistake({ ...parsed, type: types[i], source: 'chat' })
  })
}
const SUMMARY_OFFER_TURNS = 6
const hintsDismissed = ref(false)
const showOpinionSummary = ref(false)
const summaryOfferDismissed = ref(false)

// Character memory (moat: AI remembers you across sessions)
const { getMemories, getMeta, addMemory, markSessionStart, buildContextString } = useCharacterMemory()
const characterMemories = ref([])
const characterMeta = ref({ firstMet: null, conversationCount: 0 })
const showMemoryToast = ref(null) // { fact: string } when a new memory is saved

function refreshMemoryState() {
  if (!character.value?.id) return
  characterMemories.value = [...getMemories(character.value.id)]
  characterMeta.value = { ...getMeta(character.value.id) }
}

// State
const messages = ref([])
const inputText = ref('')
const currentHints = ref([])
const errorMessage = ref('')
const showArticle = ref(true)
const wordPopup = ref(null)
const showVocabBank = ref(false)
const showMemoryPanel = ref(false)
const showAchievements = ref(false)
const promptDismissed = ref(false)
const missionJustUsed = ref(null) // phrase of the connector just used
// Task/opinion strip: folds to one row after the first turn on short screens (tap to expand)
const stripCollapsed = ref(false)

// Mission targets used so far, derived from the user's messages
const missionUsedIds = computed(() => isTaskMode.value
  ? getUsedPatternIds(mission.value, messages.value)
  : getUsedTargetIds(mission.value, messages.value))

// Show daily prompt only for fresh chat conversations (not article/scenario mode)
const showDailyPrompt = computed(() =>
  !promptDismissed.value
  && !isArticleMode.value
  && !scenario.value
  && !isOpinionMode.value
  && messages.value.filter(m => m.role === 'user').length === 0
)

// Refs
const userTurnCount = computed(() => messages.value.filter(m => m.role === 'user').length)

const usedConnectorIds = computed(() => {
  if (!isOpinionMode.value) return []
  const ids = new Set()
  messages.value
    .filter(m => m.role === 'user')
    .forEach(m => detectConnectors(m.content, connectorTargets).forEach(id => ids.add(id)))
  return [...ids]
})

// Rotates after every user turn, favouring connectors not used yet
const connectorHints = computed(() =>
  getHintBatch(userTurnCount.value, usedConnectorIds.value)
    .map(id => getConnectorInfo(id, motherTongue.value))
)

const opinionSummary = computed(() =>
  showOpinionSummary.value ? buildOpinionSummary(messages.value, connectorTargets) : null
)

const showSummaryOffer = computed(() =>
  isOpinionMode.value
  && !summaryOfferDismissed.value
  && !showOpinionSummary.value
  && !isLoading.value
  && userTurnCount.value >= SUMMARY_OFFER_TURNS
)

const messagesContainer = ref(null)
const chatInputRef = ref(null)

// Lifecycle
onMounted(() => {
  // Load character memory state before first AI call
  refreshMemoryState()
  if (character.value?.id) {
    markSessionStart(character.value.id)
    refreshMemoryState()
  }

  // Each mission launch starts a fresh conversation (new targets, new topic)
  if (mission.value?.freshStart) {
    storage.clear()
    mission.value.freshStart = false
  }

  // An opinion chat saved under an older topic starts over on the current one
  if (isOpinionMode.value && !isChatOnCurrentTopic(character.value?.id)) {
    storage.clear()
  }

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

function handleInsertConnector(hint) {
  const current = inputText.value
  // Capitalize when starting a new sentence
  const startsSentence = !current.trim() || /[.!?]\s*$/.test(current)
  const text = startsSentence
    ? hint.insert.charAt(0).toUpperCase() + hint.insert.slice(1)
    : hint.insert
  const spacer = current && !/\s$/.test(current) ? ' ' : ''
  inputText.value = `${current}${spacer}${text}${text.endsWith('?') ? '' : ' '}`
  focusInput()
}

function handleEndOpinionChat() {
  summaryOfferDismissed.value = true
  showOpinionSummary.value = true
}

function handleOpinionNewTopic() {
  showOpinionSummary.value = false
  summaryOfferDismissed.value = false
  nextOpinionTopic()
  messages.value = []
  currentHints.value = []
  storage.clear()
  getAIResponse(true)
}

function handleOpinionHome() {
  showOpinionSummary.value = false
  router.push('/')
}

function handleUsePrompt(promptText) {
  inputText.value = promptText
  promptDismissed.value = true
  focusInput()
}

async function handleSendMessage() {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  promptDismissed.value = true
  const usedBefore = missionUsedIds.value
  if (userTurnCount.value === 0 && window.innerHeight < 700) stripCollapsed.value = true

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
  trackChallengeMessage()

  // Connector mission: tick newly used targets; the strip shows a short note (no confetti)
  if (mission.value) {
    const newlyUsed = missionUsedIds.value.filter(id => !usedBefore.includes(id))
    if (newlyUsed.length > 0) {
      missionJustUsed.value = mission.value.targets.find(tg => tg.id === newlyUsed[0])?.phrase || null
    }
  }

  await getAIResponse()
}

async function getAIResponse(isGreeting = false) {
  errorMessage.value = ''

  try {
    // Inject daily challenge or scenario context
    let challengeNote = null
    const challengeTopic = getChallengeContext()
    if (isOpinionMode.value) {
      challengeNote = buildOpinionPrompt(opinionTopicText('en'))
    } else if (mission.value?.prompt) {
      // Prebuilt scenario prompt (connector mission)
      challengeNote = mission.value.prompt
    } else if (scenario.value) {
      challengeNote = buildScenarioPrompt(scenario.value.id, level.value.id, language.value)
        || `[System: You are now in a role-play scenario. Title: "${scenario.value.title}". The user's goal: "${scenario.value.goal}". Stay in character and play out the scenario naturally.]`
    } else if (challengeTopic && !isChallengeCompleted.value) {
      challengeNote = `[Today's conversation topic: "${challengeTopic}". Naturally guide the conversation toward this topic.]`
    }

    // Inject character memory context (moat: AI remembers user across sessions)
    const memoryContext = character.value?.id ? buildContextString(character.value.id, character.value.name) : null

    const result = await apiSendMessage({
      messages: messages.value,
      characterId: character.value.id,
      levelId: level.value.id,
      language: language.value,
      isGreeting,
      article: isArticleMode.value ? article.value : null,
      challengeContext: challengeNote,
      memoryContext,
    })

    if (isOpinionMode.value && isGreeting) {
      markChatTopic(character.value?.id)
    }

    messages.value.push({
      role: 'assistant',
      content: result.reply,
    })

    // Track XP for receiving response
    onMessageReceived()

    if (result.hints.length > 0) {
      currentHints.value = result.hints
    }

    // Save any new memory the AI extracted about the user
    if (result.newMemory && character.value?.id) {
      const saved = addMemory(character.value.id, result.newMemory)
      if (saved) {
        refreshMemoryState()
        showMemoryToast.value = { fact: result.newMemory }
        setTimeout(() => { showMemoryToast.value = null }, 3500)
      }
    }
  } catch (err) {
    console.error('Chat error:', err)
    errorMessage.value = err.isDailyLimit
      ? t('common.dailyLimit')
      : err.isRateLimit
        ? t('chat.rateLimitError')
        : t('chat.sendFailed')
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
      nativeLanguage: motherTongue.value,
    })

    message.feedback = feedback
    saveFeedbackMistakes(feedback)
  } catch (err) {
    console.error('Feedback error:', err)
    message.feedback = null
    message.feedbackError = true
  } finally {
    message.feedbackLoading = false
  }
}

function handleRenewChat() {
  if (isOpinionMode.value) {
    handleOpinionNewTopic()
    return
  }
  missionJustUsed.value = null
  messages.value = []
  currentHints.value = []
  storage.clear()
  getAIResponse(true)
}

// ---------- Voice conversation (listen, then answer by voice) ----------
const voiceMode = ref(false)
const voiceShowText = ref(false)
// Replies from this index on are hidden until tapped; earlier ones stay readable
const voiceStartIndex = ref(0)
const revealedReplies = ref([])

const lastReply = computed(() => {
  for (let i = messages.value.length - 1; i >= 0; i--) {
    if (messages.value[i].role === 'assistant') return messages.value[i].content
  }
  return ''
})

function isReplyHidden(msg, index) {
  return voiceMode.value && !voiceShowText.value && msg.role === 'assistant'
    && index >= voiceStartIndex.value && !revealedReplies.value.includes(index)
}

function startVoiceMode() {
  const lastIndex = messages.value.map(m => m.role).lastIndexOf('assistant')
  voiceStartIndex.value = lastIndex === -1 ? messages.value.length : lastIndex
  revealedReplies.value = []
  voiceMode.value = true
}

function handleVoiceSend(text) {
  inputText.value = text
  handleSendMessage()
}

function handleRetry() {
  errorMessage.value = ''
  const lastMsg = messages.value[messages.value.length - 1]
  const isAfterUser = lastMsg && lastMsg.role === 'user'
  getAIResponse(!isAfterUser && messages.value.length === 0)
}

// When the vocabulary-hint row is visible, the voice-mode entry sits at its end
const hintsRowShown = computed(() => !isArticleMode.value && currentHints.value.length > 0)

// The word opens a bottom sheet, so the tap position is no longer needed
function handleWordTap(data) {
  wordPopup.value = data
}

// Opinion chat strip: connectors used so far, shown as done chips
const usedConnectorChips = computed(() =>
  usedConnectorIds.value.map(id => ({ id, phrase: getConnectorInfo(id, motherTongue.value).label }))
)

const dateLabel = computed(() => new Date().toLocaleDateString(
  language.value === 'ja' ? 'ja-JP' : language.value === 'zh' ? 'zh-TW' : 'en-US',
  { month: 'short', day: 'numeric' }
))

// Article: split view on wide screens, a full-height sheet on phones
const wideQuery = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(min-width: 1024px)') : null
const isWide = ref(!!wideQuery?.matches)
function onWideChange(e) { isWide.value = e.matches }
wideQuery?.addEventListener?.('change', onWideChange)
onBeforeUnmount(() => wideQuery?.removeEventListener?.('change', onWideChange))

function handleToggleArticle() {
  showArticle.value = !showArticle.value
}

function handleBack() {
  if (mission.value) {
    router.push('/learning')
  } else if (mode.value === 'article') {
    clearArticle()
    router.push('/articles')
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="flex h-screen w-full max-w-[100vw] overflow-hidden bg-page">
    <div class="relative flex h-full min-w-0 flex-1 flex-col">
      <!-- Header: back, friend, overflow -->
      <ChatHeader
        :character="character"
        :level="level"
        :is-article-mode="isArticleMode"
        :show-article="showArticle"
        :is-loading="isLoading"
        :memory-count="characterMemories.length"
        :conversation-count="characterMeta.conversationCount"
        @back="handleBack()"
        @toggle-article="handleToggleArticle"
        @renew-chat="handleRenewChat"
        @toggle-vocab-bank="showVocabBank = !showVocabBank"
        @show-memories="showMemoryPanel = true"
        @show-achievements="showAchievements = true"
      />

      <!-- Task / lesson mission strip -->
      <ConnectorMissionBar
        v-if="mission"
        :targets="mission.targets"
        :used-ids="missionUsedIds"
        :just-used="missionJustUsed"
        :task="isTaskMode ? taskText(mission.task, motherTongue) : ''"
        :can-end="userTurnCount > 0 && !isLoading"
        v-model:collapsed="stripCollapsed"
        @back="handleBack"
        @end="showTaskSummary = true"
      />

      <!-- Opinion chat: the same strip with today's topic and the connectors used -->
      <ConnectorMissionBar
        v-else-if="isOpinionMode"
        class="opinion-topic-bar"
        :label="t('opinionChat.topicLabel')"
        :task="opinionTopic.en"
        :gloss="motherTongue !== 'en' ? opinionTopicText(motherTongue) : ''"
        :targets="usedConnectorChips"
        :used-ids="usedConnectorIds"
        :show-count="false"
        :end-label="t('opinionChat.endChat')"
        :can-end="userTurnCount > 0"
        v-model:collapsed="stripCollapsed"
        @end="handleEndOpinionChat"
      />

      <!-- Content Area -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Article: split view on wide screens -->
        <ArticlePanel
          v-if="isArticleMode && showArticle && isWide"
          :article="article"
        />

        <!-- Chat Area -->
        <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div ref="messagesContainer" class="flex-1 space-y-5 overflow-y-auto overflow-x-hidden px-4 py-4 min-[375px]:px-5 sm:px-6">
            <!-- Date -->
            <p class="chat-date text-center text-meta text-ink-muted tabular-nums">{{ dateLabel }}</p>

            <!-- Messages -->
            <ChatMessage
              v-for="(msg, i) in messages"
              :key="i"
              :message="msg"
              :character="character"
              :highlight-targets="isOpinionMode ? connectorTargets : null"
              :hide-text="isReplyHidden(msg, i)"
              @explain="handleExplain"
              @word-tap="handleWordTap"
              @reveal="revealedReplies.push(i)"
            />

            <!-- Replying: static -->
            <TypingIndicator
              v-if="isLoading"
              :character="character"
            />

            <!-- Error: beside the failed message, with Retry -->
            <div v-if="errorMessage" class="chat-error flex items-start gap-3 rounded-[14px] bg-error-soft p-3" role="alert">
              <span class="material-symbols-outlined mt-0.5 shrink-0 text-error" aria-hidden="true">error</span>
              <div class="min-w-0 flex-1">
                <p class="text-body text-ink">{{ errorMessage }}</p>
                <div class="-mx-2 mt-1 flex flex-wrap gap-1">
                  <button
                    type="button"
                    @click="handleRetry"
                    :disabled="isLoading"
                    class="inline-flex min-h-11 items-center gap-1 rounded-[10px] px-2 text-caption font-medium text-ink disabled:opacity-55"
                  >
                    <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">refresh</span>
                    {{ t('common.retry') }}
                  </button>
                  <button
                    type="button"
                    @click="errorMessage = ''"
                    class="inline-flex min-h-11 items-center rounded-[10px] px-2 text-caption text-ink-secondary"
                  >
                    {{ t('common.dismiss') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Daily prompt: once, inside the stream -->
            <DailyPromptCard
              v-if="showDailyPrompt"
              :level="level?.id"
              :language="language"
              @use-prompt="handleUsePrompt"
              @dismiss="promptDismissed = true"
            />

            <!-- Opinion chat: soft summary offer -->
            <div
              v-if="showSummaryOffer"
              class="summary-offer flex items-start gap-3 rounded-[14px] border border-hairline bg-surface p-3"
            >
              <CmAvatar :name="character.name" :size="32" />
              <div class="min-w-0 flex-1">
                <p class="text-body text-ink">{{ t('opinionChat.offerText', { count: userTurnCount }) }}</p>
                <div class="-mx-2 mt-1 flex flex-wrap gap-1">
                  <button
                    type="button"
                    @click="handleEndOpinionChat"
                    class="inline-flex min-h-11 items-center rounded-[10px] px-2 text-caption font-medium text-accent"
                  >{{ t('opinionChat.offerButton') }}</button>
                  <button
                    type="button"
                    @click="summaryOfferDismissed = true"
                    class="inline-flex min-h-11 items-center rounded-[10px] px-2 text-caption text-ink-secondary"
                  >{{ t('opinionChat.offerLater') }}</button>
                </div>
              </div>
            </div>

            <div class="h-1" aria-hidden="true"></div>
          </div>

          <!-- Opinion chat: connector hints, a quiet row above the input -->
          <ConnectorHintStrip
            v-if="isOpinionMode && !hintsDismissed"
            :hints="connectorHints"
            @insert="handleInsertConnector"
            @dismiss="hintsDismissed = true"
          />
          <div v-else-if="isOpinionMode" class="shrink-0 border-t border-hairline bg-surface px-2 sm:px-4">
            <button
              type="button"
              @click="hintsDismissed = false"
              class="show-connector-hints inline-flex min-h-11 items-center gap-1 rounded-[10px] px-2 text-meta text-ink-muted"
            >
              <span class="material-symbols-outlined !text-[16px]" aria-hidden="true">expand_less</span>
              {{ t('opinionChat.showHints') }}
            </button>
          </div>

          <!-- Vocabulary hints: a quiet row immediately above the input -->
          <VocabularyHints
            v-if="!isArticleMode && !voiceMode"
            :hints="currentHints"
          >
            <!-- Shares the row with the hints so short screens keep room for the conversation -->
            <template v-if="!voiceMode" #trailing>
              <button
                type="button"
                @click="startVoiceMode"
                :aria-label="t('voiceChat.enter')"
                :title="t('voiceChat.enter')"
                class="voice-mode-entry inline-flex size-11 items-center justify-center rounded-[10px] text-accent"
              >
                <span class="material-symbols-outlined" aria-hidden="true">headphones</span>
              </button>
            </template>
          </VocabularyHints>

          <!-- Input: voice conversation replaces the composer -->
          <VoiceConversationBar
            v-if="voiceMode"
            v-model:show-text="voiceShowText"
            :last-reply="lastReply"
            :is-loading="isLoading"
            :language="language"
            :friend-name="character?.name || ''"
            @send="handleVoiceSend"
            @exit="voiceMode = false"
          />
          <ChatInput
            v-else
            ref="chatInputRef"
            v-model="inputText"
            :disabled="isLoading"
            :language="language"
            @send="handleSendMessage"
          >
            <template v-if="!hintsRowShown" #top>
              <div class="-mt-2 mb-1 flex justify-end">
                <button
                  type="button"
                  @click="startVoiceMode"
                  class="voice-mode-entry inline-flex min-h-11 items-center gap-1.5 rounded-[10px] px-2 text-caption font-medium text-accent"
                >
                  <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">headphones</span>
                  {{ t('voiceChat.enter') }}
                </button>
              </div>
            </template>
          </ChatInput>
        </div>
      </div>
    </div>

    <!-- Article on phones: full-height sheet; "Article" in the overflow menu reopens it -->
    <Teleport to="body">
      <div
        v-if="isArticleMode && showArticle && !isWide"
        class="article-sheet fixed inset-x-0 bottom-0 top-0 z-40 flex flex-col pt-[max(12px,env(safe-area-inset-top))]"
        role="dialog"
        aria-modal="true"
        :aria-label="article.title"
      >
        <div class="absolute inset-0 bg-[var(--cm-scrim)]" @click="handleToggleArticle" aria-hidden="true"></div>
        <div class="article-sheet-panel relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[24px] bg-surface shadow-[var(--cm-shadow-float)]">
          <div class="flex shrink-0 items-center gap-2 border-b border-hairline py-1 pl-5 pr-2">
            <p class="min-w-0 flex-1 truncate text-caption text-ink-secondary">{{ t('chat.articleSheet', { name: character?.name }) }}</p>
            <button
              type="button"
              @click="handleToggleArticle"
              :aria-label="t('chat.hideArticle')"
              class="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-ink-secondary active:bg-surface-raised"
            >
              <span class="material-symbols-outlined" aria-hidden="true">close</span>
            </button>
          </div>
          <ArticlePanel class="min-h-0 flex-1" :article="article" in-sheet />
        </div>
      </div>
    </Teleport>

    <!-- Level-up, streak-milestone and achievement modals no longer open on their own:
         progress keeps counting and shows up quietly in 進度與成就 -->

    <!-- Word save: bottom sheet -->
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

    <!-- Progress and achievements, opened from the overflow menu only -->
    <ProgressPanel v-if="showAchievements" @close="showAchievements = false" />

    <!-- Opinion Chat Summary -->
    <OpinionSummaryPanel
      v-if="showOpinionSummary && opinionSummary && character"
      :summary="opinionSummary"
      :character="character"
      :topic="opinionTopic.en"
      :mother-tongue="motherTongue"
      @close="showOpinionSummary = false"
      @new-topic="handleOpinionNewTopic"
      @home="handleOpinionHome"
    />

    <!-- Task Chat Summary -->
    <ChatSummaryPanel
      v-if="showTaskSummary && isTaskMode && character"
      :mission="mission"
      :messages="messages"
      :used-ids="missionUsedIds"
      :character="character"
      :level="level.id"
      :mother-tongue="motherTongue"
      @close="showTaskSummary = false"
      @home="showTaskSummary = false; router.push('/')"
    />

    <!-- Character Memory Panel -->
    <CharacterMemoryPanel
      v-if="showMemoryPanel && character"
      :character="character"
      @close="showMemoryPanel = false"
    />

    <!-- New memory note -->
    <Transition name="memory-toast">
      <div
        v-if="showMemoryToast"
        class="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+64px)] z-[110] flex justify-center px-4"
        role="status"
      >
        <div class="memory-toast-inner pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[14px] border border-hairline bg-surface p-3 shadow-[var(--cm-shadow-float)]">
          <span class="material-symbols-outlined mt-0.5 shrink-0 text-accent" aria-hidden="true">psychology</span>
          <div class="min-w-0 flex-1">
            <p class="text-meta font-medium text-ink-secondary">
              {{ t('chat.willRemember', { name: character?.name }) }}
            </p>
            <p class="truncate text-caption text-ink">{{ showMemoryToast.fact }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Fade + 8 px slide, no overshoot */
.memory-toast-enter-active .memory-toast-inner,
.memory-toast-leave-active .memory-toast-inner {
  transition: opacity var(--motion-sheet) var(--ease-cm), transform var(--motion-sheet) var(--ease-cm);
}
.memory-toast-enter-from .memory-toast-inner,
.memory-toast-leave-to .memory-toast-inner {
  opacity: 0;
  transform: translateY(-8px);
}
.memory-toast-enter-active,
.memory-toast-leave-active {
  transition: opacity var(--motion-sheet) var(--ease-cm);
}
.memory-toast-enter-from,
.memory-toast-leave-to {
  opacity: 0;
}
</style>
