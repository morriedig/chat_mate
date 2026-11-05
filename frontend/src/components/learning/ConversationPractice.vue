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

</script>

<template>
  <div class="flex h-[600px] max-h-[80vh] flex-col overflow-hidden rounded-[14px] border border-hairline bg-surface">
    <!-- Header -->
    <div class="flex items-center gap-2 border-b border-hairline py-1 pl-1 pr-3">
      <button
        type="button"
        @click="selectedConversation ? goBackToList() : emit('back')"
        :aria-label="t('learning.backToSetup')"
        class="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-ink-secondary active:bg-surface-raised"
      >
        <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
      </button>
      <div class="min-w-0 flex-1">
        <h3 class="truncate text-body font-medium text-ink">
          {{ selectedConversation ? selectedConversation.title : t('learning.conversation.title') }}
        </h3>
        <p class="truncate text-meta text-ink-muted">
          {{ selectedConversation ? t('learning.conversation.practiceDialogue') : t('learning.conversation.selectDialogue') }}
        </p>
      </div>

      <!-- Play All -->
      <button
        v-if="selectedConversation"
        type="button"
        data-testid="play-all"
        @click="playAllMessages"
        :aria-pressed="isPlayingAll"
        class="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-[10px] px-3 text-caption font-medium"
        :class="isPlayingAll
          ? 'border border-hairline bg-surface-raised text-ink active:bg-surface-sunken'
          : 'bg-accent text-on-accent active:bg-accent-pressed'"
      >
        <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">
          {{ isPlayingAll ? 'stop' : 'play_arrow' }}
        </span>
        {{ isPlayingAll ? t('learning.conversation.stop') : t('learning.conversation.playAll') }}
      </button>
    </div>

    <!-- Conversation List -->
    <div v-if="!selectedConversation" class="flex-1 overflow-y-auto p-4">
      <div v-if="conversations.length === 0" class="flex h-full flex-col items-center justify-center gap-3 text-center">
        <span class="flex size-16 items-center justify-center rounded-[14px] bg-accent-soft text-accent">
          <span class="material-symbols-outlined !text-[32px]" aria-hidden="true">forum</span>
        </span>
        <p class="text-caption text-ink-secondary">{{ t('learning.conversation.noConversations') }}</p>
      </div>

      <ul v-else class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline">
        <li v-for="conv in conversations" :key="conv.id">
          <button
            type="button"
            data-testid="conversation-item"
            @click="selectConversation(conv)"
            class="flex min-h-14 w-full items-center gap-3 px-4 py-2 text-left active:bg-surface-raised"
          >
            <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">forum</span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-body font-medium text-ink">{{ conv.title }}</span>
              <span class="block text-meta tabular-nums text-ink-muted">{{ conv.messages.length }} {{ t('learning.conversation.messages') }}</span>
            </span>
            <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">chevron_right</span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Dialogue rows: only the line being played gets the accent rule -->
    <div v-else class="flex-1 overflow-y-auto p-4">
      <ol class="space-y-2">
        <li
          v-for="(message, index) in selectedConversation.messages"
          :key="index"
          class="relative flex items-start gap-2 rounded-[10px] py-2 pl-3 pr-2"
          :class="playingMessageIndex === index ? 'bg-accent-soft' : ''"
          :aria-current="playingMessageIndex === index ? 'true' : undefined"
        >
          <span
            v-if="playingMessageIndex === index"
            class="absolute left-0 top-3 h-9 w-[3px] rounded-r-[3px] bg-accent"
            aria-hidden="true"
          ></span>
          <div class="min-w-0 flex-1">
            <span
              class="text-meta"
              :class="message.role === 'partner' ? 'text-ink-muted' : 'font-medium text-accent'"
            >{{ getRoleLabel(message.role) }}</span>

            <p
              v-if="voiceSpeed === 'word' && highlightMessageIndex === index && highlightWordIndex >= 0"
              class="break-words text-body text-ink"
            >
              <span
                v-for="(w, wi) in getMessageWords(message.text)"
                :key="wi"
                :class="wi === highlightWordIndex ? 'rounded-[4px] bg-surface px-0.5 text-accent' : ''"
              >{{ w }}{{ wi < getMessageWords(message.text).length - 1 ? ' ' : '' }}</span>
            </p>
            <p v-else class="break-words text-body text-ink">
              {{ message.text }}
            </p>

            <!-- Native translation (bilingual mode) -->
            <p
              v-if="bilingual && message.nativeText && message.nativeText !== message.text"
              class="mt-1 border-t border-hairline pt-1 text-caption text-ink-muted"
            >
              {{ message.nativeText }}
            </p>
          </div>

          <button
            type="button"
            @click="playMessage(message, index)"
            :aria-label="t('learning.conversation.playAudio')"
            :aria-pressed="playingMessageIndex === index"
            class="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] active:bg-surface-raised"
            :class="playingMessageIndex === index ? 'text-accent' : 'text-ink-muted'"
          >
            <span class="material-symbols-outlined" aria-hidden="true">
              {{ playingMessageIndex === index ? 'stop' : 'volume_up' }}
            </span>
          </button>
        </li>
      </ol>

      <!-- Practice tip -->
      <div class="mt-6 flex items-start gap-3 rounded-[14px] bg-surface-sunken p-4">
        <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">record_voice_over</span>
        <div>
          <h4 class="text-caption font-medium text-ink">
            {{ t('learning.conversation.practiceTip') }}
          </h4>
          <p class="text-caption text-ink-secondary">
            {{ t('learning.conversation.practiceTipText') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
