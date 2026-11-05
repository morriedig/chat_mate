<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { playTTS, isTTSAvailable } from '../../utils/tts'
import CmButton from '../ui/CmButton.vue'
import CmProgress from '../ui/CmProgress.vue'

const { t } = useI18n()

const props = defineProps({
  characters: {
    type: Array,
    required: true
  },
  language: {
    type: String,
    default: 'ja'
  }
})

const emit = defineEmits(['complete'])

// Game state
const questions = ref([])
const currentIndex = ref(0)
const score = ref(0)
const selectedId = ref(null)
const isAnswered = ref(false)
const isCorrect = ref(false)
const isCompleted = ref(false)
const isPlayingAudio = ref(false)
const autoAdvanceTimer = ref(null)

const totalQuestions = computed(() => questions.value.length)
const progress = computed(() => totalQuestions.value > 0 ? ((currentIndex.value) / totalQuestions.value) * 100 : 0)
const currentQuestion = computed(() => questions.value[currentIndex.value] || null)
const accuracy = computed(() => totalQuestions.value > 0 ? Math.round((score.value / totalQuestions.value) * 100) : 0)

function shuffle(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function buildQuestions(characters) {
  if (!characters || characters.length === 0) return

  const shuffledChars = shuffle(characters)
  const builtQuestions = shuffledChars.map(correctChar => {
    // Pick 4 distractors (or fewer if not enough characters)
    const distractors = shuffle(
      characters.filter(c => c.id !== correctChar.id)
    ).slice(0, 4)

    // Combine correct answer with distractors and shuffle options
    const options = shuffle([correctChar, ...distractors])

    return {
      correct: correctChar,
      options
    }
  })

  questions.value = builtQuestions
  currentIndex.value = 0
  score.value = 0
  selectedId.value = null
  isAnswered.value = false
  isCorrect.value = false
  isCompleted.value = false

  // Auto-play first question audio
  nextTick(() => playCurrentAudio())
}

async function playCurrentAudio() {
  if (!currentQuestion.value || isPlayingAudio.value) return
  if (!isTTSAvailable()) return

  isPlayingAudio.value = true
  try {
    await playTTS(currentQuestion.value.correct.char, props.language)
  } catch (err) {
    console.warn('TTS playback failed:', err)
  } finally {
    isPlayingAudio.value = false
  }
}

function selectOption(character) {
  if (isAnswered.value) return

  selectedId.value = character.id
  isAnswered.value = true
  isCorrect.value = character.id === currentQuestion.value.correct.id

  if (isCorrect.value) {
    score.value++
    // Auto-advance after 800ms
    autoAdvanceTimer.value = setTimeout(() => advanceQuestion(), 800)
  }
}

function advanceQuestion() {
  if (currentIndex.value >= totalQuestions.value - 1) {
    // Game complete
    isCompleted.value = true
    emit('complete', {
      score: score.value,
      total: totalQuestions.value
    })
    return
  }

  currentIndex.value++
  selectedId.value = null
  isAnswered.value = false
  isCorrect.value = false

  // Auto-play next question audio
  nextTick(() => playCurrentAudio())
}

function handlePlayAgain() {
  // For wrong answers, allow replaying the audio and trying next question
  advanceQuestion()
}

function restartGame() {
  if (autoAdvanceTimer.value) {
    clearTimeout(autoAdvanceTimer.value)
    autoAdvanceTimer.value = null
  }
  buildQuestions(props.characters)
}

// Cleanup timer on unmount to prevent stale execution
onBeforeUnmount(() => {
  if (autoAdvanceTimer.value) {
    clearTimeout(autoAdvanceTimer.value)
    autoAdvanceTimer.value = null
  }
})

function getOptionClasses(character) {
  if (!isAnswered.value) {
    return 'border-hairline bg-surface active:bg-surface-raised'
  }

  const isSelected = selectedId.value === character.id
  const isCorrectOption = character.id === currentQuestion.value.correct.id

  if (isCorrectOption) {
    return 'border-success/40 bg-success-soft'
  }

  if (isSelected && !isCorrectOption) {
    return 'border-error/40 bg-error-soft'
  }

  return 'border-hairline bg-surface opacity-40'
}

// Initialize on mount and when characters change
watch(() => props.characters, (newChars) => {
  if (autoAdvanceTimer.value) {
    clearTimeout(autoAdvanceTimer.value)
    autoAdvanceTimer.value = null
  }
  buildQuestions(newChars)
}, { immediate: true })
</script>

<template>
  <div class="mx-auto flex w-full max-w-lg flex-col">
    <!-- Empty State -->
    <div v-if="totalQuestions === 0" class="flex flex-col items-center gap-3 py-12 text-center">
      <span class="flex size-16 items-center justify-center rounded-[14px] bg-accent-soft text-accent">
        <span class="material-symbols-outlined !text-[32px]" aria-hidden="true">quiz</span>
      </span>
      <p class="text-caption text-ink-secondary">No characters to practice</p>
    </div>

    <!-- Game In Progress -->
    <template v-else-if="!isCompleted">
      <!-- Progress -->
      <div class="mb-4">
        <div class="mb-2 flex items-center justify-between text-meta tabular-nums text-ink-muted">
          <span>{{ currentIndex + 1 }} / {{ totalQuestions }}</span>
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined !text-[16px] text-success" aria-hidden="true">check_circle</span>
            {{ score }}
          </span>
        </div>
        <CmProgress :value="progress" :max="100" :label="t('prelesson.tapCharacterYouHear')" />
      </div>

      <!-- Audio prompt -->
      <div class="relative mb-4 rounded-[14px] border border-hairline bg-surface p-5 text-center shadow-[var(--cm-shadow-small)]" data-testid="match-prompt">
        <span class="absolute left-0 top-5 h-9 w-[3px] rounded-r-[3px] bg-accent" aria-hidden="true"></span>
        <template v-if="isTTSAvailable()">
          <button
            type="button"
            data-testid="match-play"
            @click="playCurrentAudio"
            :disabled="isPlayingAudio"
            :aria-label="t('learning.conversation.playAudio')"
            class="mx-auto flex size-16 items-center justify-center rounded-[14px] bg-accent text-on-accent active:bg-accent-pressed disabled:opacity-70"
          >
            <span class="material-symbols-outlined !text-[28px]" aria-hidden="true">
              {{ isPlayingAudio ? 'volume_up' : 'play_arrow' }}
            </span>
          </button>
          <p class="mt-3 text-caption text-ink-secondary">
            {{ t('prelesson.tapCharacterYouHear') }}
          </p>
        </template>
        <template v-else>
          <p class="mb-1 text-display font-medium text-accent">{{ currentQuestion?.correct.romaji }}</p>
          <p class="text-caption text-ink-secondary">
            {{ t('prelesson.tapCharacterYouHear') }}
          </p>
        </template>
      </div>

      <!-- Character options -->
      <div class="grid w-full grid-cols-3 gap-2 sm:grid-cols-5">
        <button
          v-for="option in currentQuestion?.options"
          :key="option.id"
          type="button"
          @click="selectOption(option)"
          :disabled="isAnswered"
          :aria-label="option.char + ' ' + option.romaji"
          class="touch-target relative flex flex-col items-center justify-center rounded-[10px] border p-3 transition-colors duration-[180ms]"
          :class="getOptionClasses(option)"
        >
          <span class="text-section font-medium text-ink">
            {{ option.char }}
          </span>
          <span class="mt-0.5 text-meta text-ink-muted">
            {{ option.romaji }}
          </span>

          <span
            v-if="isAnswered && option.id === currentQuestion?.correct.id"
            class="absolute right-1 top-1 material-symbols-outlined !text-[18px] text-success"
            aria-hidden="true"
          >check_circle</span>
          <span
            v-if="isAnswered && selectedId === option.id && option.id !== currentQuestion?.correct.id"
            class="absolute right-1 top-1 material-symbols-outlined !text-[18px] text-error"
            aria-hidden="true"
          >cancel</span>
        </button>
      </div>

      <p v-if="isAnswered" class="sr-only" role="status">{{ isCorrect ? t('learning.correct') : t('learning.incorrect') }}</p>

      <!-- Wrong answer: next -->
      <div v-if="isAnswered && !isCorrect" class="mt-5 w-full">
        <CmButton block data-testid="match-next" @click="handlePlayAgain">
          <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
          {{ t('prelesson.nextCharacter') }}
        </CmButton>
      </div>
    </template>

    <!-- Game complete: factual result -->
    <template v-else>
      <div class="mb-6 rounded-[14px] border border-hairline bg-surface p-5 shadow-[var(--cm-shadow-small)]" data-testid="match-result">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-accent" aria-hidden="true">task_alt</span>
          <h2 class="text-title font-medium text-ink">{{ t('prelesson.matchComplete') }}</h2>
        </div>
        <p class="mt-3 text-meta text-ink-muted">{{ t('learning.yourScore') }}</p>
        <div class="flex items-baseline gap-3">
          <span class="text-display font-medium tabular-nums text-ink">{{ score }} / {{ totalQuestions }}</span>
          <span class="text-title tabular-nums text-ink-secondary">{{ accuracy }}%</span>
        </div>
        <p class="mt-2 text-meta tabular-nums text-ink-muted">
          {{ t('prelesson.xpEarned', { xp: score * 2 }) }}
        </p>
      </div>

      <CmButton block data-testid="match-restart" @click="restartGame">
        <span class="material-symbols-outlined" aria-hidden="true">replay</span>
        {{ t('learning.tryAgain') }}
      </CmButton>
    </template>
  </div>
</template>
