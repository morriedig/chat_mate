<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import DiaryPromptBanner from './DiaryPromptBanner.vue'
import CmButton from '../ui/CmButton.vue'
import CmProgress from '../ui/CmProgress.vue'

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
  },
  initialPrompt: {
    type: String,
    default: ''
  },
  // Friend who reads the entry (feedback CTA copy)
  characterName: {
    type: String,
    default: 'Emma'
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
const isFocused = ref(false)
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

// Restore draft on mount, or pre-fill with prompt from query
onMounted(() => {
  if (props.initialPrompt) {
    body.value = props.initialPrompt + '\n\n'
    promptDismissed.value = true
  } else {
    try {
      const draft = localStorage.getItem(DRAFT_KEY)
      if (draft) {
        body.value = draft
      }
    } catch { /* ignore */ }
  }
  nextTick(() => {
    autoGrowTextarea()
    if (props.initialPrompt && textareaRef.value) {
      textareaRef.value.focus()
      textareaRef.value.selectionStart = textareaRef.value.selectionEnd = body.value.length
    }
  })
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
  <div class="flex flex-1 flex-col overflow-hidden">
    <!-- Scrollable content area -->
    <div class="flex-1 overflow-y-auto">
      <div class="mx-auto max-w-2xl px-4 py-4 min-[375px]:px-5 sm:py-6">
        <!-- Prompt strip -->
        <DiaryPromptBanner
          v-if="!promptDismissed"
          :level="level"
          :language="language"
          class="mb-4"
          @use-prompt="handleUsePrompt"
          @dismiss="promptDismissed = true"
        />

        <!-- Textarea: the hero; a notebook margin rule appears on focus -->
        <div class="relative">
          <span
            v-if="isFocused"
            class="pointer-events-none absolute left-0 top-4 bottom-4 w-[3px] rounded-r-[3px] bg-accent"
            aria-hidden="true"
          ></span>
          <textarea
            ref="textareaRef"
            v-model="body"
            :placeholder="placeholder"
            :disabled="isLoading"
            :aria-label="t('diary.todaysDiary')"
            @focus="isFocused = true"
            @blur="isFocused = false"
            class="block w-full resize-none rounded-[14px] border border-hairline bg-surface px-4 py-4 text-body text-ink placeholder:text-ink-muted focus:border-accent/40 focus:outline-none focus-visible:outline-none focus-visible:shadow-none disabled:opacity-55"
            style="min-height: 200px; max-height: 60vh;"
          ></textarea>
        </div>

        <!-- Count + progress -->
        <div class="mt-3 flex items-center gap-3">
          <span class="shrink-0 text-meta tabular-nums text-ink-muted">{{ countLabel }}</span>
          <CmProgress class="flex-1" :value="textCount" :max="softTarget" :label="countLabel" />
          <span
            v-if="targetProgress >= 100"
            class="material-symbols-outlined shrink-0 !text-[18px] text-success"
            aria-hidden="true"
          >check_circle</span>
        </div>
      </div>
    </div>

    <!-- Footer: mic + feedback CTA -->
    <div class="z-10 border-t border-hairline bg-surface px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] min-[375px]:px-5">
      <div class="mx-auto flex max-w-2xl items-center gap-3">
        <button
          v-if="speechSupported"
          type="button"
          @click="toggleSpeech"
          :disabled="isLoading"
          :aria-label="isListening ? t('common.stopVoiceInput') : t('common.startVoiceInput')"
          :aria-pressed="isListening"
          class="inline-flex size-12 shrink-0 items-center justify-center rounded-[10px] border disabled:opacity-55"
          :class="isListening
            ? 'border-transparent bg-error-soft text-error'
            : 'border-hairline bg-surface-raised text-ink-secondary active:bg-surface-sunken'"
        >
          <span class="material-symbols-outlined" aria-hidden="true">{{ isListening ? 'mic_off' : 'mic' }}</span>
        </button>

        <CmButton class="min-w-0 flex-1" :disabled="!canSubmit" @click="handleSubmit">
          <span class="material-symbols-outlined shrink-0" aria-hidden="true">rate_review</span>
          <span class="truncate">{{ isLoading ? t('diary.reading', { name: characterName }) : t('diary.getFeedback', { name: characterName }) }}</span>
        </CmButton>
      </div>
    </div>
  </div>
</template>
