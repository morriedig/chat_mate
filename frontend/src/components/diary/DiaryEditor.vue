<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import DiaryPromptBanner from './DiaryPromptBanner.vue'

const { t } = useI18n()

const props = defineProps({
  language: {
    type: String,
    default: 'en'
  },
  level: {
    type: String,
    default: 'intermediate'
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

const DRAFT_KEY = 'chatmate_diary_draft'

// State
const body = ref('')
const promptDismissed = ref(false)
const textareaRef = ref(null)

// Speech-to-text
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const speechSupported = computed(() => !!SpeechRecognition)
const isListening = ref(false)
let recognition = null

const LANG_MAP = {
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-TW',
}

// Word/character count
const isCJK = computed(() => ['ja', 'zh'].includes(props.language))

const textCount = computed(() => {
  const text = body.value.trim()
  if (!text) return 0
  if (isCJK.value) {
    return text.length
  }
  return text.split(/\s+/).filter(Boolean).length
})

const countLabel = computed(() => {
  if (isCJK.value) {
    return t('diary.charCount', { count: textCount.value })
  }
  return t('diary.wordCount', { count: textCount.value })
})

// Soft target: beginner 3 sentences (~30 words), intermediate (~60), advanced (~100)
const softTarget = computed(() => {
  if (isCJK.value) {
    const targets = { beginner: 30, intermediate: 80, advanced: 150 }
    return targets[props.level] || 80
  }
  const targets = { beginner: 30, intermediate: 60, advanced: 100 }
  return targets[props.level] || 60
})

const targetProgress = computed(() => {
  return Math.min(100, Math.round((textCount.value / softTarget.value) * 100))
})

// Placeholder by level
const placeholder = computed(() => {
  return t(`diary.placeholder.${props.level}`) || t('diary.placeholder.intermediate')
})

// Can submit
const canSubmit = computed(() => {
  return body.value.trim().length > 0 && !props.isLoading
})

// Auto-save draft (debounced)
let saveTimeout = null

function debouncedSaveDraft() {
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(DRAFT_KEY, body.value)
    } catch { /* ignore */ }
  }, 500)
}

watch(body, () => {
  debouncedSaveDraft()
  autoGrowTextarea()
})

// Auto-grow textarea
function autoGrowTextarea() {
  nextTick(() => {
    const el = textareaRef.value
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, window.innerHeight * 0.6) + 'px'
  })
}

// Restore draft on mount
onMounted(() => {
  try {
    const draft = localStorage.getItem(DRAFT_KEY)
    if (draft) {
      body.value = draft
    }
  } catch { /* ignore */ }
  nextTick(() => autoGrowTextarea())
})

onBeforeUnmount(() => {
  clearTimeout(saveTimeout)
  stopSpeech()
})

// Speech-to-text methods
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

  let finalTranscript = body.value

  recognition.onresult = (event) => {
    let interim = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript
      } else {
        interim += event.results[i][0].transcript
      }
    }
    body.value = finalTranscript + interim
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

// Handle prompt usage
function handleUsePrompt(text) {
  body.value = text + '\n\n'
  promptDismissed.value = true
  nextTick(() => {
    textareaRef.value?.focus()
    // Move cursor to end
    const el = textareaRef.value
    if (el) {
      el.selectionStart = el.selectionEnd = el.value.length
    }
  })
}

function handleSubmit() {
  if (!canSubmit.value) return
  emit('submit', body.value)
}
</script>

<template>
  <div class="flex flex-col flex-1 overflow-hidden">
    <!-- Scrollable content area -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-2xl mx-auto px-4 py-4 sm:py-6">
        <!-- Prompt Banner -->
        <DiaryPromptBanner
          v-if="!promptDismissed"
          :level="level"
          :language="language"
          class="mb-4"
          @use-prompt="handleUsePrompt"
          @dismiss="promptDismissed = true"
        />

        <!-- Textarea -->
        <div class="relative">
          <textarea
            ref="textareaRef"
            v-model="body"
            :placeholder="placeholder"
            :disabled="isLoading"
            class="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark text-text-main dark:text-white px-4 py-4 text-base leading-relaxed focus:border-primary focus:ring-1 focus:ring-primary dark:focus:ring-primary placeholder-slate-400 disabled:opacity-50 transition-colors"
            style="min-height: 200px; max-height: 60vh;"
          ></textarea>
        </div>

        <!-- Count + progress bar -->
        <div class="mt-3 flex items-center gap-3">
          <span class="text-xs text-text-muted dark:text-slate-400 shrink-0">{{ countLabel }}</span>
          <div class="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-300"
              :class="targetProgress >= 100 ? 'bg-green-400 dark:bg-green-500' : 'bg-primary/60'"
              :style="{ width: targetProgress + '%' }"
            ></div>
          </div>
          <span v-if="targetProgress >= 100" class="material-symbols-outlined text-green-500 text-[16px]">check_circle</span>
        </div>
      </div>
    </div>

    <!-- Footer with submit -->
    <div class="p-4 sm:p-6 bg-surface-light dark:bg-surface-dark border-t border-[#e7eff3] dark:border-slate-800 z-10 safe-area-bottom">
      <div class="flex items-center gap-3 max-w-2xl mx-auto">
        <!-- Mic Button -->
        <button
          v-if="speechSupported"
          @click="toggleSpeech"
          :disabled="isLoading"
          :aria-label="isListening ? 'Stop voice input' : 'Start voice input'"
          class="shrink-0 flex items-center justify-center size-12 rounded-full transition-all disabled:opacity-50"
          :class="isListening
            ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
            : 'bg-slate-100 dark:bg-slate-800 text-text-muted dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'"
        >
          <span class="material-symbols-outlined text-[22px]">{{ isListening ? 'mic_off' : 'mic' }}</span>
        </button>

        <!-- Submit Button -->
        <button
          @click="handleSubmit"
          :disabled="!canSubmit"
          class="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-[#0d171b] font-semibold shadow-lg hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          <span v-if="isLoading" class="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
          <span v-else class="material-symbols-outlined text-[20px]">rate_review</span>
          {{ isLoading ? t('diary.submitting') : t('diary.getFeedback') }}
        </button>
      </div>
    </div>
  </div>
</template>
