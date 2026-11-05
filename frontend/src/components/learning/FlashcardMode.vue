<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFlashcard } from '../../composables/useFlashcard'
import { playTTS, isTTSAvailable, splitTextForHighlight } from '../../utils/tts'
import CmButton from '../ui/CmButton.vue'
import CmProgress from '../ui/CmProgress.vue'

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
  <div class="mx-auto flex w-full max-w-lg flex-col">
    <!-- Progress -->
    <div class="mb-4 flex items-center gap-3">
      <CmProgress class="flex-1" :value="currentIndex + 1" :max="totalCards" :label="t('learning.modes.flashcard')" />
      <span class="text-meta tabular-nums text-ink-muted">{{ currentIndex + 1 }} / {{ totalCards }}</span>
      <span class="sr-only">{{ Math.round(progress) }}%</span>
    </div>

    <!-- One surface; front/back crossfade (no 3D spin) -->
    <div
      role="button"
      tabindex="0"
      data-testid="flashcard"
      :data-flipped="isFlipped ? 'true' : 'false'"
      :aria-pressed="isFlipped"
      :aria-label="t('learning.tapToFlip')"
      @click="handleFlipCard"
      @keydown.enter.prevent="handleFlipCard"
      @keydown.space.prevent="handleFlipCard"
      class="relative flex min-h-72 w-full cursor-pointer flex-col overflow-hidden rounded-[14px] border border-hairline p-5 shadow-[var(--cm-shadow-small)]"
      :class="isFlipped ? 'bg-surface' : 'bg-accent-soft'"
    >
      <span v-if="!isFlipped" class="absolute left-0 top-5 h-9 w-[3px] rounded-r-[3px] bg-accent" aria-hidden="true"></span>
      <Transition name="cm-card" mode="out-in">
        <!-- Front (Word) -->
        <div v-if="!isFlipped" key="front" class="flex flex-1 flex-col items-center justify-center text-center">
          <span class="break-words text-display font-medium text-ink" data-heading>
            {{ currentWord?.word }}
          </span>
          <span v-if="bilingual && currentWord?.nativeWord" class="mt-1 text-body text-ink-secondary">
            ({{ currentWord.nativeWord }})
          </span>
          <span v-if="currentWord?.reading" class="mt-1 text-body text-accent">{{ currentWord.reading }}</span>
          <span v-if="currentWord?.phonetic" class="mt-1 text-caption text-ink-muted">{{ currentWord.phonetic }}</span>

          <button
            type="button"
            data-testid="flashcard-listen"
            @click.stop="playWord"
            :disabled="isPlayingWord"
            class="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-hairline bg-surface px-4 text-caption font-medium text-ink active:bg-surface-raised disabled:opacity-55"
          >
            <span class="material-symbols-outlined text-accent" aria-hidden="true">
              {{ isPlayingWord ? 'volume_up' : 'play_arrow' }}
            </span>
            {{ t('learning.listen') }}
          </button>
        </div>

        <!-- Back (Meaning) -->
        <div v-else key="back" class="flex flex-1 flex-col justify-center">
          <div class="flex items-start gap-1">
            <button
              type="button"
              @click.stop="playMeaning"
              :disabled="isPlayingMeaning"
              :aria-label="t('learning.conversation.playAudio')"
              class="-ml-2 -mt-2 inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-accent active:bg-surface-raised disabled:opacity-55"
            >
              <span class="material-symbols-outlined" aria-hidden="true">volume_up</span>
            </button>
            <div class="min-w-0">
              <!-- Word-by-word highlight mode -->
              <p v-if="voiceSpeed === 'word' && highlightMeaningIndex >= 0" class="text-title text-ink">
                <span
                  v-for="(w, i) in meaningWords"
                  :key="i"
                  :class="i === highlightMeaningIndex ? 'rounded-[4px] bg-accent-soft px-0.5 text-accent' : ''"
                >{{ w }}{{ i < meaningWords.length - 1 ? ' ' : '' }}</span>
              </p>
              <p v-else class="text-title text-ink">
                {{ currentWord?.meaning }}
              </p>
              <p v-if="bilingual && currentWord?.nativeMeaning" class="text-caption text-ink-secondary">
                {{ currentWord.nativeMeaning }}
              </p>
            </div>
          </div>

          <!-- Sentence with voice -->
          <div class="mt-4 flex items-start gap-1 rounded-[10px] bg-surface-sunken p-3 pl-1">
            <button
              type="button"
              @click.stop="playSentence"
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
                "{{ currentWord?.example }}"
              </p>
              <p v-if="bilingual && currentWord?.nativeExample" class="mt-1 text-caption text-ink-muted">
                "{{ currentWord.nativeExample }}"
              </p>
            </div>
          </div>
        </div>
      </Transition>
      <p class="mt-4 text-center text-meta text-ink-muted">{{ t('learning.tapToFlip') }}</p>
    </div>

    <!-- Navigation -->
    <div class="mt-5 flex items-center justify-center gap-3">
      <button
        type="button"
        data-testid="flashcard-prev"
        @click="handlePrevCard"
        :disabled="isFirstCard"
        :aria-label="t('learning.previousCard')"
        class="inline-flex size-12 items-center justify-center rounded-[10px] border border-hairline bg-surface-raised text-ink active:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
      </button>

      <CmButton variant="secondary" data-testid="flashcard-shuffle" @click="handleShuffle">
        <span class="material-symbols-outlined" aria-hidden="true">shuffle</span>
        {{ t('learning.shuffle') }}
      </CmButton>

      <button
        type="button"
        data-testid="flashcard-next"
        @click="handleNextCard"
        :disabled="isLastCard"
        :aria-label="t('learning.nextCard')"
        class="inline-flex size-12 items-center justify-center rounded-[10px] border border-hairline bg-surface-raised text-ink active:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      </button>
    </div>

    <!-- Keyboard Hints -->
    <p class="mt-4 hidden text-center text-meta text-ink-muted sm:block">
      {{ t('learning.keyboardHints') }}
    </p>
  </div>
</template>

<style scoped>
/* Crossfade + 8 px rise; reduced motion collapses durations globally */
.cm-card-enter-active,
.cm-card-leave-active {
  transition: opacity 180ms var(--ease-cm), transform 180ms var(--ease-cm);
}
.cm-card-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.cm-card-leave-to {
  opacity: 0;
}
</style>
