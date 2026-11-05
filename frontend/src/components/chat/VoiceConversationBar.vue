<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { playTTS, stopTTS, isTTSAvailable } from '../../utils/tts'
import { listenOnce, stopListening, extendListening, isSTTAvailable } from '../../utils/stt'
import { useVoiceSettings } from '../../composables/useVoiceSettings'

const { t } = useI18n()
const { pauseMs, setPauseMs, PAUSE_CHOICES } = useVoiceSettings()

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
  },
  // Friend's name for "Emma is speaking / replying"
  friendName: {
    type: String,
    default: ''
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
const extended = ref(false)

// "I'm still thinking": hold the turn open a little longer
function stillThinking() {
  if (status.value === 'listening' && extendListening()) extended.value = true
}

// Cycle through the pause lengths that end your turn
function cyclePause() {
  const next = PAUSE_CHOICES[(PAUSE_CHOICES.indexOf(pauseMs.value) + 1) % PAUSE_CHOICES.length]
  setPauseMs(next)
}

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
  extended.value = false
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
  <div class="voice-bar z-10 shrink-0 border-t border-hairline bg-surface px-4 pt-4 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-6">
    <div class="mx-auto flex max-w-md flex-col items-center gap-3">
      <!-- Status sentence is the hero; the live transcript replaces it while you talk -->
      <p
        class="voice-status flex min-h-7 max-w-full items-center justify-center gap-2 break-words text-center"
        :class="heard && status !== 'speaking' ? 'text-body text-ink' : 'text-title font-medium text-ink'"
        role="status"
        aria-live="polite"
      >
        <span v-if="status === 'listening'" class="size-2 shrink-0 rounded-full bg-error" aria-hidden="true"></span>
        <span v-if="status === 'ready'" class="text-body font-normal text-ink-secondary">{{ t('voiceChat.readyHint') }}</span>
        <template v-else-if="status === 'speaking'">{{ t('voiceChat.speaking', { name: friendName }) }}</template>
        <template v-else-if="status === 'listening'">{{ heard || t('voiceChat.listening') }}</template>
        <template v-else-if="status === 'thinking'">{{ heard || t('voiceChat.thinking', { name: friendName }) }}</template>
        <span v-else class="text-body font-normal text-ink-secondary">{{ notice || t('voiceChat.tapToTalk') }}</span>
      </p>

      <div class="flex w-full items-center justify-center gap-6">
        <button
          type="button"
          @click="replay"
          :disabled="status === 'ready' || isLoading"
          class="voice-replay flex min-h-11 min-w-11 flex-col items-center justify-center rounded-[10px] px-1 text-meta text-ink-secondary disabled:opacity-40"
        >
          <span class="material-symbols-outlined" aria-hidden="true">replay</span>
          {{ t('voiceChat.replay') }}
        </button>

        <button
          v-if="status === 'ready'"
          type="button"
          @click="start"
          class="voice-start flex h-16 items-center gap-2 rounded-[14px] bg-accent px-5 text-body font-semibold text-on-accent active:bg-accent-pressed"
        >
          <span class="material-symbols-outlined" aria-hidden="true">headphones</span>
          {{ t('voiceChat.start') }}
        </button>
        <button
          v-else
          type="button"
          @click="handleMic"
          :disabled="status === 'thinking'"
          class="voice-mic flex size-16 items-center justify-center rounded-[14px] disabled:opacity-55"
          :class="status === 'listening' ? 'is-listening border border-error/30 bg-error-soft text-error' : 'bg-accent text-on-accent active:bg-accent-pressed'"
          :aria-label="t('voiceChat.mic')"
        >
          <span class="material-symbols-outlined !text-[28px]" aria-hidden="true">{{ status === 'speaking' ? 'volume_up' : status === 'listening' ? 'stop' : 'mic' }}</span>
        </button>

        <button
          type="button"
          @click="emit('update:showText', !showText)"
          :aria-pressed="showText"
          class="voice-text flex min-h-11 min-w-11 flex-col items-center justify-center rounded-[10px] px-1 text-meta"
          :class="showText ? 'text-accent' : 'text-ink-secondary'"
        >
          <span class="material-symbols-outlined" aria-hidden="true">{{ showText ? 'visibility' : 'visibility_off' }}</span>
          {{ t('voiceChat.text') }}
        </button>
      </div>

      <button
        v-if="status === 'listening'"
        type="button"
        @click="stillThinking"
        class="still-thinking min-h-11 rounded-[10px] border px-4 text-body font-medium"
        :class="extended ? 'border-accent/30 bg-accent-soft text-accent' : 'border-hairline bg-surface-raised text-ink'"
      >{{ extended ? t('voiceChat.takeYourTime') : t('voiceChat.stillThinking') }}</button>

      <!-- One metadata row: pause length · slower · back to typing -->
      <div class="flex w-full flex-wrap items-center justify-center text-meta text-ink-muted">
        <button type="button" @click="cyclePause" class="pause-length min-h-11 rounded-[10px] px-2 tabular-nums" :aria-label="t('voiceChat.pauseHint')">
          {{ t('voiceChat.pauseLength', { sec: pauseMs / 1000 }) }}
        </button>
        <span aria-hidden="true">·</span>
        <button type="button" @click="relaxed = !relaxed" :aria-pressed="relaxed" class="voice-slower min-h-11 rounded-[10px] px-2" :class="relaxed ? 'font-medium text-accent' : ''">
          {{ t('voiceChat.slower') }}
        </button>
        <span aria-hidden="true">·</span>
        <button type="button" @click="exit" class="voice-exit min-h-11 rounded-[10px] px-2">{{ t('voiceChat.exit') }}</button>
      </div>
    </div>
  </div>
</template>
