<script setup>
import { ref, watch, computed, onBeforeUnmount } from 'vue'
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
})

function handleInput(e) {
  localValue.value = e.target.value
  emit('update:modelValue', e.target.value)
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
  <div class="p-4 sm:p-6 bg-surface-light dark:bg-surface-dark border-t border-[#e7eff3] dark:border-slate-800 z-10 safe-area-bottom">
    <div class="flex items-center gap-3 max-w-4xl mx-auto">
      <div class="flex-1 relative">
        <textarea
          ref="inputRef"
          :value="localValue"
          @input="handleInput"
          @keydown="handleKeydown"
          :disabled="disabled"
          class="w-full resize-none rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1e2930] text-text-main dark:text-white px-4 py-3 pr-12 text-base focus:border-primary focus:ring-1 focus:ring-primary dark:focus:ring-primary placeholder-slate-400 disabled:opacity-50"
          :placeholder="t('chat.typeMessage')"
          rows="1"
          style="min-height: 50px; max-height: 150px;"
        ></textarea>
      </div>
      <!-- Mic Button -->
      <button
        v-if="speechSupported"
        @click="toggleSpeech"
        :disabled="disabled"
        :aria-label="isListening ? 'Stop voice input' : 'Start voice input'"
        class="shrink-0 flex items-center justify-center size-12 rounded-full transition-all disabled:opacity-50"
        :class="isListening
          ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
          : 'bg-slate-100 dark:bg-slate-800 text-text-muted dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'"
      >
        <span class="material-symbols-outlined text-[22px]">{{ isListening ? 'mic_off' : 'mic' }}</span>
      </button>

      <!-- Send Button -->
      <button
        @click="emit('send')"
        :disabled="!localValue.trim() || disabled"
        aria-label="Send message"
        class="shrink-0 flex items-center justify-center size-12 rounded-full bg-primary text-[#0d171b] shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
      >
        <span class="material-symbols-outlined icon-filled text-[24px]">send</span>
      </button>
    </div>
    <div class="hidden sm:block text-center mt-2">
      <p class="text-[11px] text-slate-400 dark:text-slate-500">Press Enter to send, Shift+Enter for new line</p>
    </div>
  </div>
</template>
