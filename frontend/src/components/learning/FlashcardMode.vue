<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFlashcard } from '../../composables/useFlashcard'
import { playTTS, isTTSAvailable, splitTextForHighlight } from '../../utils/tts'

const { t } = useI18n()

const props = defineProps({
  words: {
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
  }
})

// Audio state (kept in component as it's UI-specific)
const isPlayingWord = ref(false)
const isPlayingMeaning = ref(false)
const isPlayingSentence = ref(false)

// Word-by-word highlight state
const highlightMeaningIndex = ref(-1)
const highlightSentenceIndex = ref(-1)

// Split text for word-by-word display
const meaningWords = computed(() =>
  currentWord.value?.meaning ? splitTextForHighlight(currentWord.value.meaning, props.language) : []
)
const sentenceWords = computed(() =>
  currentWord.value?.example ? splitTextForHighlight(currentWord.value.example, props.language) : []
)

// Use flashcard composable (SRP: component only handles UI)
const {
  currentIndex,
  isFlipped,
  currentWord,
  progress,
  totalCards,
  isFirstCard,
  isLastCard,
  initCards,
  flipCard,
  nextCard,
  prevCard,
  shuffle
} = useFlashcard()

// Methods
function handleFlipCard() {
  flipCard()
}

function handleNextCard() {
  nextCard()
}

function handlePrevCard() {
  prevCard()
}

function handleShuffle() {
  shuffle(props.words)
}

async function playWord() {
  if (!currentWord.value?.word || isPlayingWord.value) return
  if (!isTTSAvailable()) return

  isPlayingWord.value = true
  try {
    await playTTS(currentWord.value.word, props.language, props.voiceSpeed)
  } catch (err) {
    console.warn('Audio playback failed:', err)
  } finally {
    isPlayingWord.value = false
  }
}

async function playMeaning() {
  if (!currentWord.value?.meaning || isPlayingMeaning.value) return
  if (!isTTSAvailable()) return

  isPlayingMeaning.value = true
  highlightMeaningIndex.value = -1

  try {
    await playTTS(currentWord.value.meaning, props.language, props.voiceSpeed, (index) => {
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
  if (!currentWord.value?.example || isPlayingSentence.value) return
  if (!isTTSAvailable()) return

  isPlayingSentence.value = true
  highlightSentenceIndex.value = -1

  try {
    await playTTS(currentWord.value.example, props.language, props.voiceSpeed, (index) => {
      highlightSentenceIndex.value = index
    })
  } catch (err) {
    console.warn('Audio playback failed:', err)
  } finally {
    isPlayingSentence.value = false
    highlightSentenceIndex.value = -1
  }
}

// Initialize on mount and when words change
watch(() => props.words, (newWords) => initCards(newWords), { immediate: true })
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Progress Bar -->
    <div class="w-full max-w-lg mb-6">
      <div class="flex justify-between text-sm text-text-muted dark:text-slate-400 mb-2">
        <span>{{ currentIndex + 1 }} / {{ totalCards }}</span>
        <span>{{ Math.round(progress) }}%</span>
      </div>
      <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-primary to-green-400 rounded-full transition-all duration-300"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>

    <!-- Flashcard -->
    <div
      @click="handleFlipCard"
      class="w-full max-w-lg aspect-[4/3] perspective-1000 cursor-pointer"
    >
      <div
        class="relative w-full h-full transition-transform duration-500 transform-style-3d"
        :class="{ 'rotate-y-180': isFlipped }"
      >
        <!-- Front (Word) -->
        <div class="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 border-2 border-primary/30 shadow-lg flex flex-col items-center justify-center p-8">
          <span class="text-4xl sm:text-5xl font-bold text-text-main dark:text-white text-center mb-2">
            {{ currentWord?.word }}
          </span>
          <span v-if="bilingual && currentWord?.nativeWord" class="text-2xl text-primary font-medium mb-2">
            ({{ currentWord.nativeWord }})
          </span>
          <span v-if="currentWord?.reading" class="text-xl text-primary mb-2">{{ currentWord.reading }}</span>
          <span v-if="currentWord?.phonetic" class="text-lg text-text-muted dark:text-slate-400">{{ currentWord.phonetic }}</span>

          <!-- Audio Button -->
          <button
            @click.stop="playWord"
            :disabled="isPlayingWord"
            class="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow"
            :class="{ 'animate-pulse': isPlayingWord }"
          >
            <span class="material-symbols-outlined text-primary">
              {{ isPlayingWord ? 'volume_up' : 'play_arrow' }}
            </span>
            <span class="text-sm font-medium text-text-main dark:text-white">{{ t('learning.listen') }}</span>
          </button>

          <p class="absolute bottom-4 text-sm text-text-muted dark:text-slate-400">{{ t('learning.tapToFlip') }}</p>
        </div>

        <!-- Back (Meaning) -->
        <div class="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 shadow-lg flex flex-col items-center justify-center p-6">
          <!-- Meaning with voice -->
          <div class="flex items-start gap-2 mb-2">
            <button
              @click.stop="playMeaning"
              :disabled="isPlayingMeaning"
              class="flex-shrink-0 p-1.5 rounded-full hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
              :class="{ 'animate-pulse text-primary': isPlayingMeaning }"
            >
              <span class="material-symbols-outlined text-xl text-green-600 dark:text-green-400">
                {{ isPlayingMeaning ? 'volume_up' : 'volume_up' }}
              </span>
            </button>
            <div class="text-center">
              <!-- Word-by-word highlight mode -->
              <p v-if="voiceSpeed === 'word' && highlightMeaningIndex >= 0" class="text-lg sm:text-xl text-text-main dark:text-white">
                <span
                  v-for="(w, i) in meaningWords"
                  :key="i"
                  :class="i === highlightMeaningIndex ? 'bg-primary/40 text-primary font-bold px-1 rounded' : ''"
                >{{ w }}{{ i < meaningWords.length - 1 ? ' ' : '' }}</span>
              </p>
              <p v-else class="text-lg sm:text-xl text-text-main dark:text-white">
                {{ currentWord?.meaning }}
              </p>
              <p v-if="bilingual && currentWord?.nativeMeaning" class="text-sm text-slate-600 dark:text-slate-400">
                {{ currentWord.nativeMeaning }}
              </p>
            </div>
          </div>

          <!-- Sentence with voice -->
          <div class="p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 w-full mt-2">
            <div class="flex items-start gap-2">
              <button
                @click.stop="playSentence"
                :disabled="isPlayingSentence"
                class="flex-shrink-0 p-1.5 rounded-full hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors"
                :class="{ 'animate-pulse text-primary': isPlayingSentence }"
              >
                <span class="material-symbols-outlined text-xl text-green-600 dark:text-green-400">
                  {{ isPlayingSentence ? 'volume_up' : 'volume_up' }}
                </span>
              </button>
              <div>
                <!-- Word-by-word highlight mode for sentence -->
                <p v-if="voiceSpeed === 'word' && highlightSentenceIndex >= 0" class="text-text-muted dark:text-slate-300 italic text-sm">
                  "<span
                    v-for="(w, i) in sentenceWords"
                    :key="i"
                    :class="i === highlightSentenceIndex ? 'bg-primary/40 text-primary font-bold not-italic px-0.5 rounded' : ''"
                  >{{ w }}{{ i < sentenceWords.length - 1 ? ' ' : '' }}</span>"
                </p>
                <p v-else class="text-text-muted dark:text-slate-300 italic text-sm">
                  "{{ currentWord?.example }}"
                </p>
                <p v-if="bilingual && currentWord?.nativeExample" class="text-xs text-slate-500 dark:text-slate-400 italic mt-1">
                  "{{ currentWord.nativeExample }}"
                </p>
              </div>
            </div>
          </div>
          <p class="absolute bottom-4 text-sm text-text-muted dark:text-slate-400">{{ t('learning.tapToFlip') }}</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex items-center gap-4 mt-8">
      <button
        @click="handlePrevCard"
        :disabled="isFirstCard"
        class="flex items-center justify-center size-12 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span class="material-symbols-outlined text-text-main dark:text-white">chevron_left</span>
      </button>

      <button
        @click="handleShuffle"
        class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
      >
        <span class="material-symbols-outlined">replay</span>
        {{ t('learning.shuffle') }}
      </button>

      <button
        @click="handleNextCard"
        :disabled="isLastCard"
        class="flex items-center justify-center size-12 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span class="material-symbols-outlined text-text-main dark:text-white">chevron_right</span>
      </button>
    </div>

    <!-- Keyboard Hints -->
    <p class="mt-4 text-xs text-text-muted dark:text-slate-400 hidden sm:block">
      {{ t('learning.keyboardHints') }}
    </p>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
