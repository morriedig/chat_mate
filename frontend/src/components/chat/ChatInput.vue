<script setup>
import { ref, watch, computed, nextTick, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

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
  }
})

const emit = defineEmits(['update:modelValue', 'send'])

const inputRef = ref(null)
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

// Speech-to-Text
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const speechSupported = computed(() => !!SpeechRecognition)
const isListening = ref(false)
let recognition = null

const LANG_MAP = {
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-TW',
}

function toggleSpeech() {
  if (isListening.value) {
    stopSpeech()
  } else {
    startSpeech()
  }
}

function startSpeech() {
  if (!SpeechRecognition || isListening.value) return

  recognition = new SpeechRecognition()
  recognition.lang = LANG_MAP[props.language] || 'en-US'
  recognition.interimResults = true
  recognition.continuous = false

  let finalTranscript = localValue.value

  recognition.onresult = (event) => {
    let interim = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript
      } else {
        interim += event.results[i][0].transcript
      }
    }
    const combined = finalTranscript + interim
    localValue.value = combined
    emit('update:modelValue', combined)
  }

  recognition.onend = () => {
    isListening.value = false
    recognition = null
  }

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error)
    isListening.value = false
    recognition = null
  }

  recognition.start()
  isListening.value = true
}

function stopSpeech() {
  if (recognition) {
    recognition.stop()
  }
  isListening.value = false
}

onBeforeUnmount(() => {
  stopSpeech()
})

defineExpose({ focus })
</script>

<template>
  <div class="chat-composer z-10 shrink-0 border-t border-hairline bg-surface px-3 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-6">
    <div class="mx-auto max-w-4xl">
      <slot name="top" />
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
