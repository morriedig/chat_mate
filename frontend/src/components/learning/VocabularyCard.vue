<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { playTTS, isTTSAvailable, splitTextForHighlight } from '../../utils/tts'
import { usePronunciationCheck } from '../../composables/usePronunciationCheck'

const { t } = useI18n()
const { isSupported: pronSupported, isListening, score: pronScore, checkPronunciation, stopListening } = usePronunciationCheck()

const props = defineProps({
  word: {
    type: Object,
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
  }
})

const isPlayingWord = ref(false)
const isPlayingMeaning = ref(false)
const isPlayingSentence = ref(false)
const audioError = ref(false)
const pronError = ref(false)

async function handlePronCheck() {
  if (isListening.value) {
    stopListening()
    return
  }
  pronError.value = false
  try {
    await checkPronunciation(props.word.word, props.language)
  } catch {
    pronError.value = true
  }
}

// Word-by-word highlight state
const highlightMeaningIndex = ref(-1)
const highlightSentenceIndex = ref(-1)

// Split text for word-by-word display
const meaningWords = computed(() => splitTextForHighlight(props.word.meaning, props.language))
const sentenceWords = computed(() => splitTextForHighlight(props.word.example, props.language))

async function playWord() {
  if (isPlayingWord.value) return
  if (!isTTSAvailable()) {
    audioError.value = true
    return
  }

  isPlayingWord.value = true
  audioError.value = false

  try {
    await playTTS(props.word.word, props.language, props.voiceSpeed)
  } catch (err) {
    audioError.value = true
    console.warn('Audio playback failed:', err)
  } finally {
    isPlayingWord.value = false
  }
}

async function playMeaning() {
  if (isPlayingMeaning.value) return
  if (!isTTSAvailable()) return

  isPlayingMeaning.value = true
  highlightMeaningIndex.value = -1

  try {
    await playTTS(props.word.meaning, props.language, props.voiceSpeed, (index) => {
      highlightMeaningIndex.value = index
    })
  } catch (err) {
    console.warn('Audio playback failed:', err)
  } finally {
    isPlayingMeaning.value = false
    highlightMeaningIndex.value = -1
  }
}

async function playSentence() {
  if (isPlayingSentence.value) return
  if (!isTTSAvailable()) return

  isPlayingSentence.value = true
  highlightSentenceIndex.value = -1

  try {
    await playTTS(props.word.example, props.language, props.voiceSpeed, (index) => {
      highlightSentenceIndex.value = index
    })
  } catch (err) {
    console.warn('Audio playback failed:', err)
  } finally {
    isPlayingSentence.value = false
    highlightSentenceIndex.value = -1
  }
}
</script>

<template>
  <article class="rounded-[14px] border border-hairline bg-surface p-4 shadow-[var(--cm-shadow-small)]" data-testid="vocabulary-card">
    <!-- Word (hero) + quiet play control -->
    <div class="flex items-start gap-2">
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 class="break-words text-section font-medium text-ink" data-heading>{{ word.word }}</h3>
          <span v-if="bilingual && word.nativeWord" class="text-body text-ink-secondary">({{ word.nativeWord }})</span>
        </div>
        <div v-if="word.phonetic || word.reading" class="mt-0.5 flex flex-wrap gap-x-2 text-caption">
          <span v-if="word.phonetic" class="text-ink-muted">{{ word.phonetic }}</span>
          <span v-if="word.reading" class="text-accent">{{ word.reading }}</span>
        </div>
      </div>
      <button
        type="button"
        @click="playWord"
        :disabled="isPlayingWord"
        :aria-label="t('learning.listen')"
        data-testid="play-word"
        class="-mr-2 -mt-1 inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-accent active:bg-surface-raised disabled:opacity-55"
      >
        <span class="material-symbols-outlined" aria-hidden="true">
          {{ isPlayingWord ? 'volume_up' : 'play_arrow' }}
        </span>
      </button>
    </div>

    <!-- Meaning -->
    <div class="mt-2 flex items-start gap-1">
      <button
        type="button"
        @click="playMeaning"
        :disabled="isPlayingMeaning"
        :aria-label="t('learning.conversation.playAudio')"
        class="-ml-3 -my-2 inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-ink-muted active:bg-surface-raised disabled:opacity-55"
      >
        <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">volume_up</span>
      </button>
      <div class="min-w-0">
        <!-- Word-by-word highlight mode -->
        <p v-if="voiceSpeed === 'word' && highlightMeaningIndex >= 0" class="text-body text-ink-secondary">
          <span
            v-for="(w, i) in meaningWords"
            :key="i"
            :class="i === highlightMeaningIndex ? 'rounded-[4px] bg-accent-soft px-0.5 text-accent' : ''"
          >{{ w }}{{ i < meaningWords.length - 1 ? ' ' : '' }}</span>
        </p>
        <p v-else class="text-body text-ink-secondary">{{ word.meaning }}</p>
        <p v-if="bilingual && word.nativeMeaning" class="text-caption text-ink-muted">{{ word.nativeMeaning }}</p>
      </div>
    </div>

    <!-- Example sentence in a sunken field -->
    <div class="mt-3 flex items-start gap-1 rounded-[10px] bg-surface-sunken p-3 pl-1" data-testid="example">
      <button
        type="button"
        @click="playSentence"
        :disabled="isPlayingSentence"
        :aria-label="t('learning.conversation.playAudio')"
        class="-my-2 inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-accent active:bg-surface-raised disabled:opacity-55"
      >
        <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">volume_up</span>
      </button>
      <div class="min-w-0">
        <!-- Word-by-word highlight mode for sentence -->
        <p v-if="voiceSpeed === 'word' && highlightSentenceIndex >= 0" class="break-words text-body text-ink">
          "<span
            v-for="(w, i) in sentenceWords"
            :key="i"
            :class="i === highlightSentenceIndex ? 'rounded-[4px] bg-accent-soft px-0.5 text-accent' : ''"
          >{{ w }}{{ i < sentenceWords.length - 1 ? ' ' : '' }}</span>"
        </p>
        <p v-else class="break-words text-body text-ink">
          "{{ word.example }}"
        </p>
        <p v-if="bilingual && word.nativeExample" class="mt-1 text-caption text-ink-muted">
          "{{ word.nativeExample }}"
        </p>
      </div>
    </div>

    <!-- Pronunciation check -->
    <div v-if="pronSupported" class="mt-3 flex items-center gap-3">
      <button
        type="button"
        @click="handlePronCheck"
        :aria-pressed="isListening"
        class="inline-flex min-h-11 items-center gap-1.5 rounded-[10px] border px-3 text-caption font-medium"
        :class="isListening
          ? 'border-transparent bg-error-soft text-error'
          : 'border-hairline bg-surface-raised text-ink-secondary active:bg-surface-sunken'"
      >
        <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">{{ isListening ? 'mic' : 'mic_none' }}</span>
        {{ isListening ? t('common.listening') : t('learning.trySayingIt') }}
      </button>
      <div v-if="pronScore !== null" class="flex items-center gap-2">
        <span class="h-1 w-16 overflow-hidden bg-surface-raised" aria-hidden="true">
          <span
            class="block h-full w-full origin-left rounded-r-[2px] bg-accent transition-transform duration-[180ms]"
            :style="{ transform: `scaleX(${Math.min(1, Math.max(0, pronScore / 100))})` }"
          />
        </span>
        <span class="text-meta font-medium tabular-nums text-ink-secondary">{{ pronScore }}%</span>
      </div>
    </div>

    <!-- Audio Error -->
    <p v-if="audioError || pronError" class="mt-2 flex items-center gap-1 text-meta text-warning" role="status">
      <span class="material-symbols-outlined !text-[16px]" aria-hidden="true">warning</span>
      {{ t('learning.audioNotAvailable') }}
    </p>
  </article>
</template>
