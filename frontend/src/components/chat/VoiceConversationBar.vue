<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { playTTS, stopTTS, isTTSAvailable } from '../../utils/tts'
import { listenOnce, stopListening, isSTTAvailable } from '../../utils/stt'

const { t } = useI18n()

const props = defineProps({
  // Latest assistant reply; a change means the friend just answered
  lastReply: {
    type: String,
    default: ''
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'en'
  },
  showText: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send', 'exit', 'update:showText'])

// 'ready' (waiting for the first tap) → 'speaking' → 'listening' → 'thinking' → 'speaking' …
const status = ref('ready')
const heard = ref('')
const notice = ref('')
const relaxed = ref(false)
const canListen = isSTTAvailable()
const canSpeak = isTTSAvailable()
let stopped = false

async function speak(text) {
  if (!text || !canSpeak) return
  status.value = 'speaking'
  try {
    await playTTS(text, props.language, relaxed.value ? 'relaxed' : 'normal')
  } catch {
    // Speech failed or was interrupted; carry on to listening
  }
}

async function listen() {
  if (stopped) return
  if (!canListen) {
    status.value = 'idle'
    notice.value = t('voiceChat.noMic')
    return
  }
  notice.value = ''
  heard.value = ''
  status.value = 'listening'
  try {
    const text = await listenOnce({ language: props.language, onInterim: s => { heard.value = s } })
    if (stopped) return
    if (text) {
      heard.value = text
      status.value = 'thinking'
      emit('send', text)
    } else {
      status.value = 'idle'
      notice.value = t('voiceChat.didntHear')
    }
  } catch (e) {
    status.value = 'idle'
    notice.value = e.message === 'not-allowed' ? t('voiceChat.micBlocked') : t('voiceChat.tapToTalk')
  }
}

// One turn: the friend speaks, then it's the user's turn to answer
async function friendTurn() {
  await speak(props.lastReply)
  if (!stopped) await listen()
}

// First tap also unlocks audio playback on iOS
function start() {
  stopped = false
  friendTurn()
}

function handleMic() {
  if (status.value === 'listening') {
    stopListening()
  } else if (status.value === 'speaking') {
    stopTTS()
  } else if (status.value !== 'thinking') {
    listen()
  }
}

function replay() {
  stopListening()
  friendTurn()
}

function exit() {
  stopped = true
  stopTTS()
  stopListening()
  emit('exit')
}

watch(() => props.lastReply, (reply, previous) => {
  if (reply && reply !== previous && status.value !== 'ready' && !stopped) friendTurn()
})

watch(() => props.isLoading, (loading) => {
  if (loading && status.value !== 'ready') status.value = 'thinking'
})

onBeforeUnmount(() => {
  stopped = true
  stopTTS()
  stopListening()
})
</script>

<template>
  <div class="p-4 sm:p-6 bg-surface-light dark:bg-surface-dark border-t border-[#e7eff3] dark:border-slate-800 z-10 safe-area-bottom">
    <div class="max-w-4xl mx-auto flex flex-col items-center gap-3">
      <!-- Status / live transcript -->
      <p class="min-h-[1.5rem] text-sm text-center break-words max-w-full"
        :class="heard && status !== 'speaking' ? 'text-text-main dark:text-slate-200' : 'text-text-muted dark:text-slate-400'">
        <template v-if="status === 'ready'">{{ t('voiceChat.readyHint') }}</template>
        <template v-else-if="status === 'speaking'">{{ t('voiceChat.speaking') }}</template>
        <template v-else-if="status === 'listening'">{{ heard || t('voiceChat.listening') }}</template>
        <template v-else-if="status === 'thinking'">{{ heard || t('voiceChat.thinking') }}</template>
        <template v-else>{{ notice || t('voiceChat.tapToTalk') }}</template>
      </p>

      <div class="flex items-center justify-center gap-4 w-full">
        <button @click="replay" :disabled="status === 'ready' || isLoading" class="flex flex-col items-center gap-0.5 text-xs text-text-muted dark:text-slate-400 disabled:opacity-40 w-14">
          <span class="material-symbols-outlined">replay</span>
          {{ t('voiceChat.replay') }}
        </button>

        <button
          v-if="status === 'ready'"
          @click="start"
          class="h-16 px-6 rounded-full bg-primary text-white font-semibold shadow-md flex items-center gap-2"
        >
          <span class="material-symbols-outlined">headphones</span>
          {{ t('voiceChat.start') }}
        </button>
        <button
          v-else
          @click="handleMic"
          :disabled="status === 'thinking'"
          class="size-16 rounded-full flex items-center justify-center shadow-md transition-colors disabled:opacity-50"
          :class="status === 'listening' ? 'bg-red-500 text-white animate-pulse' : 'bg-primary text-white'"
          :aria-label="t('voiceChat.mic')"
        >
          <span class="material-symbols-outlined text-[30px]">{{ status === 'speaking' ? 'volume_up' : status === 'listening' ? 'stop' : 'mic' }}</span>
        </button>

        <button @click="emit('update:showText', !showText)" class="flex flex-col items-center gap-0.5 text-xs w-14"
          :class="showText ? 'text-primary' : 'text-text-muted dark:text-slate-400'">
          <span class="material-symbols-outlined">{{ showText ? 'visibility' : 'visibility_off' }}</span>
          {{ t('voiceChat.text') }}
        </button>
      </div>

      <div class="flex items-center gap-4 text-xs">
        <button @click="relaxed = !relaxed" :class="relaxed ? 'text-primary font-semibold' : 'text-text-muted dark:text-slate-400'">
          {{ t('voiceChat.slower') }}
        </button>
        <button @click="exit" class="text-text-muted dark:text-slate-400">{{ t('voiceChat.exit') }}</button>
      </div>
    </div>
  </div>
</template>
