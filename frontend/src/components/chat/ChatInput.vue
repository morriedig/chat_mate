<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import SpeechRescue from './SpeechRescue.vue'
import { isSTTAvailable, listenOnce, stopListening } from '../../utils/stt'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'en'
  },
  // { messages, task, patterns, level, language, nativeLanguage, sessionType }; null hides "I'm stuck"
  rescueContext: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'send'])

const inputRef = ref(null)
const rescueRef = ref(null)
const localValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  localValue.value = val
  nextTick(autoGrow)
})

// Grows with the text from 48 px up to 120 px, then scrolls
function autoGrow() {
  const el = inputRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 120)}px`
}

function handleInput(e) {
  localValue.value = e.target.value
  emit('update:modelValue', e.target.value)
  autoGrow()
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    emit('send')
  }
}

function focus() {
  inputRef.value?.focus()
}

// Speech-to-Text (native recognition in the iOS app, Web Speech API in browsers)
const speechSupported = isSTTAvailable()
const isListening = ref(false)
let listenId = 0
let unmounted = false

function toggleSpeech() {
  if (isListening.value) {
    stopSpeech()
  } else {
    startSpeech()
  }
}

async function startSpeech() {
  if (!speechSupported || isListening.value) return

  const id = ++listenId
  const isCurrent = () => id === listenId && !unmounted
  const base = localValue.value
  const write = (text) => {
    const combined = base + text
    localValue.value = combined
    emit('update:modelValue', combined)
  }

  isListening.value = true
  try {
    const heard = await listenOnce({
      language: props.language,
      onInterim: (text) => { if (isCurrent()) write(text) },
    })
    if (isCurrent()) write(heard)
  } catch (error) {
    if (isCurrent()) console.error('Speech recognition error:', error?.message)
  } finally {
    if (isCurrent()) isListening.value = false
  }
}

function stopSpeech() {
  if (isListening.value) stopListening()
}

onBeforeUnmount(() => {
  stopSpeech()
  unmounted = true
})

defineExpose({ focus })
</script>

<template>
  <div class="chat-composer z-10 shrink-0 border-t border-hairline bg-surface px-3 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-6">
    <div class="mx-auto max-w-4xl">
      <template v-if="rescueContext">
        <SpeechRescue ref="rescueRef" :context="rescueContext" />
        <!-- "I'm stuck" on the left; the parent's top row (voice entry) keeps the right -->
        <div class="-mt-2 mb-1 flex min-w-0 items-center justify-between gap-2 *:my-0">
          <button
            type="button"
            @click="rescueRef?.open()"
            :disabled="disabled"
            class="rescue-trigger -ml-2 inline-flex min-h-11 min-w-0 items-center gap-1.5 rounded-[10px] px-2 text-caption font-medium text-ink-secondary active:bg-surface-raised disabled:opacity-55"
          >
            <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">support</span>
            <span class="truncate">{{ t('rescue.button') }}</span>
          </button>
          <slot name="top" />
        </div>
      </template>
      <slot v-else name="top" />
      <div class="flex items-end gap-2">
        <textarea
          ref="inputRef"
          :value="localValue"
          @input="handleInput"
          @keydown="handleKeydown"
          :disabled="disabled"
          :aria-label="t('chat.typeMessage')"
          class="block min-h-12 min-w-0 flex-1 resize-none rounded-[10px] border border-hairline bg-surface-sunken px-3.5 py-[11px] text-[16px] leading-6 text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none disabled:opacity-55"
          :placeholder="t('chat.typeMessage')"
          rows="1"
          style="max-height: 120px;"
        ></textarea>
        <!-- Mic: static listening state, no pulse -->
        <button
          v-if="speechSupported"
          type="button"
          @click="toggleSpeech"
          :disabled="disabled"
          :aria-label="isListening ? t('common.stopVoiceInput') : t('common.startVoiceInput')"
          :aria-pressed="isListening"
          class="chat-mic flex size-12 shrink-0 items-center justify-center rounded-[10px] border disabled:opacity-55"
          :class="isListening
            ? 'is-listening border-error/30 bg-error-soft text-error'
            : 'border-hairline bg-surface-raised text-ink-secondary active:bg-surface-sunken'"
        >
          <span class="material-symbols-outlined" aria-hidden="true">{{ isListening ? 'stop' : 'mic' }}</span>
        </button>

        <!-- Send -->
        <button
          type="button"
          @click="emit('send')"
          :disabled="!localValue.trim() || disabled"
          :aria-label="t('chat.sendMessage')"
          class="chat-send flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-accent text-on-accent active:bg-accent-pressed disabled:bg-accent-disabled disabled:opacity-55"
        >
          <span class="material-symbols-outlined" aria-hidden="true">send</span>
        </button>
      </div>
      <p v-if="isListening" class="mt-2 flex items-center gap-2 text-meta text-error" role="status">
        <span class="size-2 rounded-full bg-error" aria-hidden="true"></span>{{ t('voiceChat.listening') }}
      </p>
      <p class="mt-2 hidden text-center text-meta text-ink-muted sm:block">{{ t('chat.enterHint') }}</p>
    </div>
  </div>
</template>
