<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { playTTS, isTTSAvailable } from '../../utils/tts'

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
    return 'border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary bg-surface-light dark:bg-surface-dark'
  }

  const isSelected = selectedId.value === character.id
  const isCorrectOption = character.id === currentQuestion.value.correct.id

  if (isCorrectOption) {
    return 'border-green-500 bg-green-50 dark:bg-green-900/30'
  }

  if (isSelected && !isCorrectOption) {
    return 'border-red-500 bg-red-50 dark:bg-red-900/30 animate-shake'
  }

  return 'border-slate-200 dark:border-slate-700 opacity-40'
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
  <div class="flex flex-col items-center w-full max-w-lg mx-auto">
    <!-- Empty State -->
    <div v-if="totalQuestions === 0" class="text-center py-12">
      <span class="material-symbols-outlined text-[48px] text-slate-300 dark:text-slate-600 mb-4">quiz</span>
      <p class="text-sm text-text-muted dark:text-slate-400">No characters to practice</p>
    </div>

    <!-- Game In Progress -->
    <template v-else-if="!isCompleted">
      <!-- Progress Bar -->
      <div class="w-full mb-6">
        <div class="flex justify-between text-sm text-text-muted dark:text-slate-400 mb-2">
          <span>{{ currentIndex + 1 }} / {{ totalQuestions }}</span>
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-sm text-green-500">check_circle</span>
            {{ score }}
          </span>
        </div>
        <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-primary to-green-400 rounded-full transition-all duration-300"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Audio Prompt Card -->
      <div class="w-full p-8 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/30 dark:to-indigo-900/20 border border-violet-200 dark:border-violet-800 mb-6 text-center">
        <template v-if="isTTSAvailable()">
          <button
            @click="playCurrentAudio"
            :disabled="isPlayingAudio"
            aria-label="Play audio"
            class="mx-auto flex items-center justify-center size-16 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow"
            :class="{ 'animate-pulse': isPlayingAudio }"
          >
            <span class="material-symbols-outlined text-3xl text-primary">
              {{ isPlayingAudio ? 'volume_up' : 'play_arrow' }}
            </span>
          </button>
          <p class="mt-4 text-sm text-text-muted dark:text-slate-400">
            {{ t('prelesson.tapCharacterYouHear') }}
          </p>
        </template>
        <template v-else>
          <p class="text-3xl font-bold text-primary mb-2">{{ currentQuestion?.correct.romaji }}</p>
          <p class="text-sm text-text-muted dark:text-slate-400">
            {{ t('prelesson.tapCharacterYouHear') }}
          </p>
        </template>
      </div>

      <!-- Character Options -->
      <div class="w-full grid grid-cols-3 gap-3 sm:grid-cols-5">
        <button
          v-for="option in currentQuestion?.options"
          :key="option.id"
          @click="selectOption(option)"
          :disabled="isAnswered"
          :aria-label="option.char + ' ' + option.romaji"
          class="relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all touch-target"
          :class="getOptionClasses(option)"
        >
          <span class="text-3xl font-bold text-text-main dark:text-white">
            {{ option.char }}
          </span>
          <span class="text-xs text-text-muted dark:text-slate-400 mt-1">
            {{ option.romaji }}
          </span>

          <!-- Correct checkmark overlay -->
          <span
            v-if="isAnswered && option.id === currentQuestion?.correct.id"
            class="absolute top-1 right-1 material-symbols-outlined text-green-500 text-lg"
          >
            check_circle
          </span>
          <!-- Wrong X overlay -->
          <span
            v-if="isAnswered && selectedId === option.id && option.id !== currentQuestion?.correct.id"
            class="absolute top-1 right-1 material-symbols-outlined text-red-500 text-lg"
          >
            cancel
          </span>
        </button>
      </div>

      <!-- Wrong Answer: Play Again / Next Button -->
      <div v-if="isAnswered && !isCorrect" class="w-full mt-6">
        <button
          @click="handlePlayAgain"
          class="w-full py-4 rounded-xl bg-primary text-[#0d171b] font-bold text-lg hover:bg-primary/90 transition-colors"
        >
          <span class="flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">arrow_forward</span>
            {{ t('prelesson.nextCharacter') }}
          </span>
        </button>
      </div>
    </template>

    <!-- Game Complete -->
    <template v-else>
      <div class="w-full text-center">
        <div class="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 mb-6">
          <div class="text-6xl mb-4">
            {{ accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪' }}
          </div>
          <h2 class="text-2xl font-bold text-text-main dark:text-white mb-2">
            {{ t('prelesson.matchComplete') }}
          </h2>
          <p class="text-text-muted dark:text-slate-400 mb-4">{{ t('learning.yourScore') }}</p>

          <div class="flex items-center justify-center gap-4">
            <div class="text-center">
              <span class="text-4xl font-bold text-primary">{{ score }}</span>
              <span class="text-2xl text-text-muted dark:text-slate-400"> / {{ totalQuestions }}</span>
            </div>
            <div class="h-12 w-px bg-slate-300 dark:bg-slate-600"></div>
            <div class="text-center">
              <span
                class="text-4xl font-bold"
                :class="accuracy >= 80 ? 'text-green-500' : accuracy >= 60 ? 'text-amber-500' : 'text-red-500'"
              >
                {{ accuracy }}%
              </span>
            </div>
          </div>

          <p class="mt-4 text-sm text-amber-600 dark:text-amber-400">
            {{ t('prelesson.xpEarned', { xp: score * 2 }) }}
          </p>
        </div>

        <!-- Restart Button -->
        <button
          @click="restartGame"
          class="w-full py-4 rounded-xl bg-primary text-[#0d171b] font-bold text-lg hover:bg-primary/90 transition-colors"
        >
          <span class="flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">replay</span>
            {{ t('learning.tryAgain') }}
          </span>
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
