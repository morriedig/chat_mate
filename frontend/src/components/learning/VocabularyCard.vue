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
  <div class="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
    <div class="flex items-start gap-4">
      <!-- Audio Button for Word -->
      <button
        @click="playWord"
        :disabled="isPlayingWord"
        class="shrink-0 flex items-center justify-center size-12 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors disabled:opacity-50"
        :class="{ 'animate-pulse': isPlayingWord }"
      >
        <span class="material-symbols-outlined text-xl">
          {{ isPlayingWord ? 'volume_up' : 'play_arrow' }}
        </span>
      </button>

      <!-- Word Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline gap-2 flex-wrap">
          <h3 class="text-xl font-bold text-text-main dark:text-white">{{ word.word }}</h3>
          <span v-if="bilingual && word.nativeWord" class="text-lg text-primary font-medium">({{ word.nativeWord }})</span>
          <span v-if="word.phonetic" class="text-sm text-text-muted dark:text-slate-400">{{ word.phonetic }}</span>
          <span v-if="word.reading" class="text-sm text-primary">{{ word.reading }}</span>
        </div>

        <!-- Meaning with play button -->
        <div class="flex items-start gap-2 mt-1">
          <button
            @click="playMeaning"
            :disabled="isPlayingMeaning"
            class="shrink-0 flex items-center justify-center size-6 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-text-muted dark:text-slate-400 transition-colors disabled:opacity-50"
            :class="{ 'animate-pulse': isPlayingMeaning }"
          >
            <span class="material-symbols-outlined text-sm">
              {{ isPlayingMeaning ? 'volume_up' : 'volume_up' }}
            </span>
          </button>
          <div>
            <!-- Word-by-word highlight mode -->
            <p v-if="voiceSpeed === 'word' && highlightMeaningIndex >= 0" class="text-text-muted dark:text-slate-300">
              <span
                v-for="(w, i) in meaningWords"
                :key="i"
                :class="i === highlightMeaningIndex ? 'bg-primary/30 text-primary font-semibold px-0.5 rounded' : ''"
              >{{ w }}{{ i < meaningWords.length - 1 ? ' ' : '' }}</span>
            </p>
            <p v-else class="text-text-muted dark:text-slate-300">{{ word.meaning }}</p>
            <p v-if="bilingual && word.nativeMeaning" class="text-sm text-slate-500 dark:text-slate-400">{{ word.nativeMeaning }}</p>
          </div>
        </div>

        <!-- Example sentence with play button -->
        <div class="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-l-4 border-primary">
          <div class="flex items-start gap-2">
            <button
              @click="playSentence"
              :disabled="isPlayingSentence"
              class="shrink-0 flex items-center justify-center size-6 rounded-full bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-primary transition-colors disabled:opacity-50 shadow-sm"
              :class="{ 'animate-pulse': isPlayingSentence }"
            >
              <span class="material-symbols-outlined text-sm">volume_up</span>
            </button>
            <div>
              <!-- Word-by-word highlight mode for sentence -->
              <p v-if="voiceSpeed === 'word' && highlightSentenceIndex >= 0" class="text-sm text-text-main dark:text-slate-200 italic">
                "<span
                  v-for="(w, i) in sentenceWords"
                  :key="i"
                  :class="i === highlightSentenceIndex ? 'bg-primary/30 text-primary font-semibold not-italic px-0.5 rounded' : ''"
                >{{ w }}{{ i < sentenceWords.length - 1 ? ' ' : '' }}</span>"
              </p>
              <p v-else class="text-sm text-text-main dark:text-slate-200 italic">
                "{{ word.example }}"
              </p>
              <p v-if="bilingual && word.nativeExample" class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                "{{ word.nativeExample }}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pronunciation Check -->
    <div v-if="pronSupported" class="mt-3 flex items-center gap-3">
      <button
        @click="handlePronCheck"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
        :class="isListening
          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse'
          : 'bg-slate-100 dark:bg-slate-700 text-text-muted dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'"
      >
        <span class="material-symbols-outlined text-sm">{{ isListening ? 'mic' : 'mic_none' }}</span>
        {{ isListening ? 'Listening...' : 'Try saying it' }}
      </button>
      <div v-if="pronScore !== null" class="flex items-center gap-1.5">
        <div class="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            class="h-full rounded-full transition-all"
            :class="pronScore >= 80 ? 'bg-green-400' : pronScore >= 50 ? 'bg-amber-400' : 'bg-red-400'"
            :style="{ width: `${pronScore}%` }"
          />
        </div>
        <span class="text-xs font-bold" :class="pronScore >= 80 ? 'text-green-500' : pronScore >= 50 ? 'text-amber-500' : 'text-red-500'">
          {{ pronScore }}%
        </span>
      </div>
    </div>

    <!-- Audio Error -->
    <p v-if="audioError || pronError" class="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
      <span class="material-symbols-outlined text-sm">warning</span>
      {{ t('learning.audioNotAvailable') }}
    </p>
  </div>
</template>
