<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { playTTS, stopTTS, splitTextForHighlight } from '../../utils/tts'
import { useLearningProgress } from '../../composables/useLearningProgress'

const { t } = useI18n()
const { markConversationCompleted } = useLearningProgress()

const props = defineProps({
  conversations: {
    type: Array,
    required: true
  },
  language: {
    type: String,
    default: 'en'
  },
  bilingual: {
    type: Boolean,
    default: true
  },
  voiceSpeed: {
    type: String,
    default: 'normal' // 'normal', 'slow', 'word'
  },
  chapterId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['back'])

// State
const selectedConversationId = ref(null)
const playingMessageIndex = ref(null)
const isPlayingAll = ref(false)
const shouldStopPlayAll = ref(false)

// Word-by-word highlight state
const highlightWordIndex = ref(-1)
const highlightMessageIndex = ref(-1)

// Computed
const selectedConversation = computed(() => {
  if (!selectedConversationId.value) return null
  return props.conversations.find(c => c.id === selectedConversationId.value)
})

// Methods
function selectConversation(conversation) {
  selectedConversationId.value = conversation.id
}

function goBackToList() {
  stopPlayAll()
  stopTTS()
  playingMessageIndex.value = null
  selectedConversationId.value = null
}

// Play all messages sequentially
async function playAllMessages() {
  if (!selectedConversation.value?.messages) return

  // If already playing, stop
  if (isPlayingAll.value) {
    stopPlayAll()
    return
  }

  isPlayingAll.value = true
  shouldStopPlayAll.value = false

  const messages = selectedConversation.value.messages

  for (let i = 0; i < messages.length; i++) {
    // Check if we should stop
    if (shouldStopPlayAll.value) break

    playingMessageIndex.value = i
    highlightMessageIndex.value = i
    highlightWordIndex.value = -1

    try {
      await playTTS(messages[i].text, props.language, props.voiceSpeed, (wordIndex) => {
        highlightWordIndex.value = wordIndex
      })
    } catch (err) {
      console.error('TTS error:', err)
    }

    // Small pause between messages
    if (!shouldStopPlayAll.value && i < messages.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  // Mark conversation as completed if finished without stopping
  if (!shouldStopPlayAll.value && props.chapterId) {
    markConversationCompleted(props.chapterId)
  }

  playingMessageIndex.value = null
  highlightMessageIndex.value = -1
  highlightWordIndex.value = -1
  isPlayingAll.value = false
  shouldStopPlayAll.value = false
}

function stopPlayAll() {
  shouldStopPlayAll.value = true
  isPlayingAll.value = false
  stopTTS()
  playingMessageIndex.value = null
  highlightMessageIndex.value = -1
  highlightWordIndex.value = -1
}

async function playMessage(message, index) {
  // Stop play all if running
  if (isPlayingAll.value) {
    stopPlayAll()
  }

  // Stop any currently playing audio
  stopTTS()

  // If clicking the same message that's playing, just stop
  if (playingMessageIndex.value === index) {
    playingMessageIndex.value = null
    highlightMessageIndex.value = -1
    highlightWordIndex.value = -1
    return
  }

  playingMessageIndex.value = index
  highlightMessageIndex.value = index
  highlightWordIndex.value = -1

  try {
    await playTTS(message.text, props.language, props.voiceSpeed, (wordIndex) => {
      highlightWordIndex.value = wordIndex
    })
  } catch (err) {
    console.error('TTS error:', err)
  } finally {
    playingMessageIndex.value = null
    highlightMessageIndex.value = -1
    highlightWordIndex.value = -1
  }
}

// Helper to get words for a message
function getMessageWords(text) {
  return splitTextForHighlight(text, props.language)
}

function getRoleLabel(role) {
  return role === 'partner' ? t('learning.conversation.partner') : t('learning.conversation.you')
}

function getRoleColor(role) {
  return role === 'partner'
    ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light'
    : 'bg-accent/10 dark:bg-accent/20 text-accent dark:text-accent-light'
}
</script>

<template>
  <div class="flex flex-col h-[600px] max-h-[80vh] bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 border-b border-slate-200 dark:border-slate-700">
      <div class="flex items-center gap-3">
        <button
          @click="selectedConversation ? goBackToList() : emit('back')"
          class="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <span class="material-symbols-outlined text-text-muted dark:text-slate-400">arrow_back</span>
        </button>
        <div>
          <h3 class="font-semibold text-text-main dark:text-white text-sm">
            {{ selectedConversation ? selectedConversation.title : t('learning.conversation.title') }}
          </h3>
          <p class="text-xs text-text-muted dark:text-slate-400">
            {{ selectedConversation ? t('learning.conversation.practiceDialogue') : t('learning.conversation.selectDialogue') }}
          </p>
        </div>
      </div>

      <!-- Play All Button -->
      <button
        v-if="selectedConversation"
        @click="playAllMessages"
        class="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
        :class="isPlayingAll
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-primary text-white hover:bg-primary/90'"
      >
        <span class="material-symbols-outlined text-lg">
          {{ isPlayingAll ? 'stop' : 'play_arrow' }}
        </span>
        <span class="text-sm">{{ isPlayingAll ? t('learning.conversation.stop') : t('learning.conversation.playAll') }}</span>
      </button>
    </div>

    <!-- Conversation List -->
    <div v-if="!selectedConversation" class="flex-1 overflow-y-auto p-4">
      <div v-if="conversations.length === 0" class="flex flex-col items-center justify-center h-full text-center">
        <span class="text-4xl mb-3">💬</span>
        <p class="text-text-muted dark:text-slate-400">{{ t('learning.conversation.noConversations') }}</p>
      </div>

      <div v-else class="space-y-3">
        <button
          v-for="conv in conversations"
          :key="conv.id"
          @click="selectConversation(conv)"
          class="w-full p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-colors text-left group"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">💬</span>
              <div>
                <h4 class="font-medium text-text-main dark:text-white group-hover:text-primary transition-colors">
                  {{ conv.title }}
                </h4>
                <p class="text-xs text-text-muted dark:text-slate-400">
                  {{ conv.messages.length }} {{ t('learning.conversation.messages') }}
                </p>
              </div>
            </div>
            <span class="material-symbols-outlined text-text-muted dark:text-slate-400 group-hover:text-primary transition-colors">
              chevron_right
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- Conversation Dialogue -->
    <div v-else class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
        v-for="(message, index) in selectedConversation.messages"
        :key="index"
        class="flex gap-3"
        :class="message.role === 'user' ? 'flex-row-reverse' : ''"
      >
        <!-- Voice Button -->
        <button
          @click="playMessage(message, index)"
          class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
          :class="[
            playingMessageIndex === index
              ? 'bg-primary text-white animate-pulse'
              : 'bg-slate-100 dark:bg-slate-700 text-text-muted dark:text-slate-400 hover:bg-primary/20 hover:text-primary'
          ]"
          :title="t('learning.conversation.playAudio')"
        >
          <span class="material-symbols-outlined text-xl">
            {{ playingMessageIndex === index ? 'stop' : 'volume_up' }}
          </span>
        </button>

        <!-- Message Bubble -->
        <div
          class="flex-1 max-w-[80%] rounded-2xl p-4"
          :class="message.role === 'partner'
            ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            : 'bg-primary/10 dark:bg-primary/20'"
        >
          <!-- Role Label -->
          <span
            class="inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2"
            :class="getRoleColor(message.role)"
          >
            {{ getRoleLabel(message.role) }}
          </span>

          <!-- Message Text -->
          <p v-if="voiceSpeed === 'word' && highlightMessageIndex === index && highlightWordIndex >= 0"
             class="text-text-main dark:text-white text-base leading-relaxed">
            <span
              v-for="(w, wi) in getMessageWords(message.text)"
              :key="wi"
              :class="wi === highlightWordIndex ? 'bg-primary/40 text-primary font-bold px-0.5 rounded' : ''"
            >{{ w }}{{ wi < getMessageWords(message.text).length - 1 ? ' ' : '' }}</span>
          </p>
          <p v-else class="text-text-main dark:text-white text-base leading-relaxed">
            {{ message.text }}
          </p>

          <!-- Native Translation (bilingual mode) -->
          <p
            v-if="bilingual && message.nativeText && message.nativeText !== message.text"
            class="mt-2 text-sm text-text-muted dark:text-slate-400 italic border-t border-slate-200 dark:border-slate-600 pt-2"
          >
            {{ message.nativeText }}
          </p>
        </div>
      </div>

      <!-- Practice Tip -->
      <div class="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
        <div class="flex items-start gap-3">
          <span class="text-xl">💡</span>
          <div>
            <h4 class="font-medium text-amber-800 dark:text-amber-200 text-sm mb-1">
              {{ t('learning.conversation.practiceTip') }}
            </h4>
            <p class="text-xs text-amber-700 dark:text-amber-300">
              {{ t('learning.conversation.practiceTipText') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
