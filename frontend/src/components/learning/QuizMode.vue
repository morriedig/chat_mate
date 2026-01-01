<script setup>
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuiz } from '../../composables/useQuiz'
import { useLearningProgress } from '../../composables/useLearningProgress'

const { t } = useI18n()
const { markQuizCompleted } = useLearningProgress()

const props = defineProps({
  words: {
    type: Array,
    required: true
  },
  language: {
    type: String,
    default: 'en'
  },
  chapterId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['complete'])

// Use quiz composable (SRP: component only handles UI)
const {
  currentIndex,
  selectedAnswer,
  isAnswered,
  score,
  isCompleted,
  answers,
  currentQuestion,
  progress,
  accuracy,
  totalQuestions,
  xpEarned,
  initQuiz,
  selectAnswer,
  nextQuestion,
  restartQuiz,
  isCorrectOption
} = useQuiz()

// Methods
function handleSelectAnswer(option) {
  selectAnswer(option)
}

function handleNextQuestion() {
  const result = nextQuestion()
  if (result.completed) {
    // Track quiz completion in learning progress
    if (props.chapterId) {
      markQuizCompleted(props.chapterId, result.score, result.total)
    }

    // DIP: Emit event instead of calling XP system directly
    emit('complete', {
      score: result.score,
      total: result.total,
      accuracy: result.accuracy,
      xpEarned: result.xpEarned
    })
  }
}

function handleRestartQuiz() {
  restartQuiz(props.words)
}

function getOptionClass(option) {
  if (!isAnswered.value) {
    return 'border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary'
  }

  if (isCorrectOption(option)) {
    return 'border-green-500 bg-green-50 dark:bg-green-900/30'
  }

  if (selectedAnswer.value?.id === option.id && !isCorrectOption(option)) {
    return 'border-red-500 bg-red-50 dark:bg-red-900/30'
  }

  return 'border-slate-200 dark:border-slate-700 opacity-50'
}

// Initialize on mount and when words change
watch(() => props.words, (newWords) => initQuiz(newWords), { immediate: true })
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Quiz In Progress -->
    <template v-if="!isCompleted">
      <!-- Progress Bar -->
      <div class="w-full max-w-lg mb-6">
        <div class="flex justify-between text-sm text-text-muted dark:text-slate-400 mb-2">
          <span>{{ t('learning.question') }} {{ currentIndex + 1 }} / {{ totalQuestions }}</span>
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

      <!-- Question Card -->
      <div class="w-full max-w-lg p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 mb-6">
        <p class="text-sm text-text-muted dark:text-slate-400 mb-2">{{ t('learning.whatMeans') }}</p>
        <h2 class="text-3xl sm:text-4xl font-bold text-text-main dark:text-white text-center">
          {{ currentQuestion?.word }}
        </h2>
        <p v-if="currentQuestion?.reading" class="text-xl text-primary text-center mt-2">{{ currentQuestion.reading }}</p>
        <p v-if="currentQuestion?.phonetic" class="text-lg text-text-muted dark:text-slate-400 text-center mt-1">{{ currentQuestion.phonetic }}</p>
      </div>

      <!-- Answer Options -->
      <div class="w-full max-w-lg space-y-3">
        <button
          v-for="(option, index) in currentQuestion?.options"
          :key="option.id"
          @click="handleSelectAnswer(option)"
          :disabled="isAnswered"
          class="w-full p-4 rounded-xl border-2 text-left transition-all"
          :class="getOptionClass(option)"
        >
          <div class="flex items-center gap-3">
            <span class="flex items-center justify-center size-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold text-text-muted">
              {{ String.fromCharCode(65 + index) }}
            </span>
            <span class="text-text-main dark:text-white">{{ option.meaning }}</span>
            <span v-if="isAnswered && isCorrectOption(option)" class="ml-auto material-symbols-outlined text-green-500">check_circle</span>
            <span v-if="isAnswered && selectedAnswer?.id === option.id && !isCorrectOption(option)" class="ml-auto material-symbols-outlined text-red-500">cancel</span>
          </div>
        </button>
      </div>

      <!-- Feedback & Next Button -->
      <div v-if="isAnswered" class="w-full max-w-lg mt-6">
        <div
          class="p-4 rounded-xl mb-4"
          :class="selectedAnswer?.id === currentQuestion?.id
            ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
            : 'bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700'"
        >
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined" :class="selectedAnswer?.id === currentQuestion?.id ? 'text-green-600' : 'text-red-600'">
              {{ selectedAnswer?.id === currentQuestion?.id ? 'celebration' : 'sentiment_dissatisfied' }}
            </span>
            <span class="font-semibold" :class="selectedAnswer?.id === currentQuestion?.id ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
              {{ selectedAnswer?.id === currentQuestion?.id ? t('learning.correct') : t('learning.incorrect') }}
            </span>
          </div>
          <p class="text-sm text-text-muted dark:text-slate-400">
            {{ currentQuestion?.example }}
          </p>
        </div>

        <button
          @click="handleNextQuestion"
          class="w-full py-4 rounded-xl bg-primary text-[#0d171b] font-bold text-lg hover:bg-primary/90 transition-colors"
        >
          {{ currentIndex < totalQuestions - 1 ? t('learning.nextQuestion') : t('learning.finishQuiz') }}
        </button>
      </div>
    </template>

    <!-- Quiz Completed -->
    <template v-else>
      <div class="w-full max-w-lg text-center">
        <!-- Score Display -->
        <div class="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 mb-6">
          <div class="text-6xl mb-4">
            {{ accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪' }}
          </div>
          <h2 class="text-2xl font-bold text-text-main dark:text-white mb-2">{{ t('learning.quizComplete') }}</h2>
          <p class="text-text-muted dark:text-slate-400 mb-4">{{ t('learning.yourScore') }}</p>

          <div class="flex items-center justify-center gap-4">
            <div class="text-center">
              <span class="text-4xl font-bold text-primary">{{ score }}</span>
              <span class="text-2xl text-text-muted dark:text-slate-400"> / {{ totalQuestions }}</span>
            </div>
            <div class="h-12 w-px bg-slate-300 dark:bg-slate-600"></div>
            <div class="text-center">
              <span class="text-4xl font-bold" :class="accuracy >= 80 ? 'text-green-500' : accuracy >= 60 ? 'text-amber-500' : 'text-red-500'">{{ accuracy }}%</span>
            </div>
          </div>

          <p class="mt-4 text-sm text-amber-600 dark:text-amber-400">
            +{{ xpEarned }} XP {{ t('learning.earned') }}
          </p>
        </div>

        <!-- Answer Review -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-text-main dark:text-white mb-3 text-left">{{ t('learning.reviewAnswers') }}</h3>
          <div class="space-y-2">
            <div
              v-for="(answer, index) in answers"
              :key="index"
              class="flex items-center gap-3 p-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700"
            >
              <span
                class="material-symbols-outlined"
                :class="answer.isCorrect ? 'text-green-500' : 'text-red-500'"
              >
                {{ answer.isCorrect ? 'check_circle' : 'cancel' }}
              </span>
              <span class="font-medium text-text-main dark:text-white">{{ answer.word.word }}</span>
              <span class="text-text-muted dark:text-slate-400">-</span>
              <span class="text-sm text-text-muted dark:text-slate-400 truncate flex-1">{{ answer.word.meaning }}</span>
            </div>
          </div>
        </div>

        <!-- Restart Button -->
        <button
          @click="handleRestartQuiz"
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
