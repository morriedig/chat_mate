<script setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuiz } from '../../composables/useQuiz'
import { useLearningProgress } from '../../composables/useLearningProgress'
import { useSRS } from '../../composables/useSRS'
import CmButton from '../ui/CmButton.vue'
import CmProgress from '../ui/CmProgress.vue'

const { t } = useI18n()
const { markQuizCompleted } = useLearningProgress()
const { recordQuizResults } = useSRS()

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
  },
  // Optional fill-in-the-blank questions (from getChapterCloze); when given
  // they replace the meaning → word questions
  cloze: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['complete', 'use-in-chat'])

const isClozeMode = computed(() => props.cloze.length > 0)

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

    // Record per-word results for SRS scheduling (cloze → the word it practices)
    recordQuizResults(isClozeMode.value
      ? answers.value
        .filter(a => a.word.targetId)
        .map(a => ({ ...a, word: { id: a.word.targetId } }))
      : answers.value)

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
  restartQuiz(props.words, props.cloze)
}

// Bridge to chat: hand over which connectors were missed vs. got right
function handleUseInChat() {
  const missed = answers.value.filter(a => !a.isCorrect).map(a => a.word.targetId).filter(Boolean)
  const practiced = answers.value.filter(a => a.isCorrect).map(a => a.word.targetId).filter(Boolean)
  emit('use-in-chat', { missedTargetIds: missed, practicedTargetIds: practiced })
}

// Split "I was late ___ the traffic." around the blank for rendering
function sentenceParts(sentence) {
  const [before, ...rest] = String(sentence || '').split('___')
  return { before, after: rest.join('___') }
}

function getOptionClass(option) {
  if (!isAnswered.value) {
    return 'border-hairline bg-surface active:bg-surface-raised'
  }

  if (isCorrectOption(option)) {
    return 'border-success/40 bg-success-soft'
  }

  if (selectedAnswer.value?.id === option.id && !isCorrectOption(option)) {
    return 'border-error/40 bg-error-soft'
  }

  return 'border-hairline bg-surface opacity-55'
}

// Initialize on mount and when words / cloze questions change
watch([() => props.words, () => props.cloze], () => initQuiz(props.words, props.cloze), { immediate: true })
</script>

<template>
  <div class="mx-auto flex w-full max-w-lg flex-col">
    <!-- Quiz In Progress -->
    <template v-if="!isCompleted">
      <!-- Progress -->
      <div class="mb-4">
        <div class="mb-2 flex items-center justify-between text-meta tabular-nums text-ink-muted">
          <span>{{ t('learning.question') }} {{ currentIndex + 1 }} / {{ totalQuestions }}</span>
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined !text-[16px] text-success" aria-hidden="true">check</span>
            {{ score }}
          </span>
        </div>
        <CmProgress :value="progress" :max="100" :label="t('learning.question')" />
      </div>

      <!-- Prompt: Cloze -->
      <div v-if="isClozeMode" class="relative mb-4 rounded-[14px] border border-hairline bg-surface p-5 shadow-[var(--cm-shadow-small)]" data-testid="quiz-prompt">
        <span class="absolute left-0 top-5 h-9 w-[3px] rounded-r-[3px] bg-accent" aria-hidden="true"></span>
        <p class="mb-3 text-caption text-ink-secondary">{{ t('learning.fillBlank') }}</p>
        <p class="text-section font-medium text-ink">
          {{ sentenceParts(currentQuestion?.sentence).before }}<span
            class="mx-1 inline-block min-w-[4.5rem] border-b-2 px-2 text-center"
            :class="isAnswered ? 'border-success text-success' : 'border-accent text-accent'"
          >{{ isAnswered ? currentQuestion?.answer : ' ' }}</span>{{ sentenceParts(currentQuestion?.sentence).after }}
        </p>
      </div>

      <!-- Prompt: word -->
      <div v-else class="relative mb-4 rounded-[14px] border border-hairline bg-surface p-5 text-center shadow-[var(--cm-shadow-small)]" data-testid="quiz-prompt">
        <span class="absolute left-0 top-5 h-9 w-[3px] rounded-r-[3px] bg-accent" aria-hidden="true"></span>
        <p class="mb-2 text-caption text-ink-secondary">{{ t('learning.whatMeans') }}</p>
        <h2 class="break-words text-display font-medium text-ink" data-heading>
          {{ currentQuestion?.word }}
        </h2>
        <p v-if="currentQuestion?.reading" class="mt-1 text-body text-accent">{{ currentQuestion.reading }}</p>
        <p v-if="currentQuestion?.phonetic" class="mt-1 text-caption text-ink-muted">{{ currentQuestion.phonetic }}</p>
      </div>

      <!-- Answer rows -->
      <div class="space-y-2" role="group" :aria-label="t('learning.question')">
        <button
          v-for="(option, index) in currentQuestion?.options"
          :key="option.id"
          type="button"
          data-testid="quiz-option"
          @click="handleSelectAnswer(option)"
          :disabled="isAnswered"
          class="flex min-h-14 w-full items-center gap-3 rounded-[10px] border px-3 py-2 text-left transition-colors duration-[180ms]"
          :class="getOptionClass(option)"
        >
          <span class="flex size-6 shrink-0 items-center justify-center rounded-[6px] border border-hairline bg-surface-raised text-meta font-medium text-ink-secondary" aria-hidden="true">
            {{ String.fromCharCode(65 + index) }}
          </span>
          <span class="min-w-0 flex-1 break-words text-body text-ink">{{ isClozeMode ? option.text : option.meaning }}</span>
          <span v-if="isAnswered && isCorrectOption(option)" class="material-symbols-outlined shrink-0 text-success" aria-hidden="true">check_circle</span>
          <span v-if="isAnswered && selectedAnswer?.id === option.id && !isCorrectOption(option)" class="material-symbols-outlined shrink-0 text-error" aria-hidden="true">cancel</span>
        </button>
      </div>

      <!-- Explanation & Next -->
      <div v-if="isAnswered" class="mt-4">
        <div
          class="mb-4 rounded-[14px] p-4"
          :class="isCorrectOption(selectedAnswer) ? 'bg-success-soft' : 'bg-error-soft'"
          role="status"
          aria-live="polite"
        >
          <div class="mb-1 flex items-center gap-2">
            <span class="material-symbols-outlined" :class="isCorrectOption(selectedAnswer) ? 'text-success' : 'text-error'" aria-hidden="true">
              {{ isCorrectOption(selectedAnswer) ? 'check_circle' : 'cancel' }}
            </span>
            <span class="text-body font-medium" :class="isCorrectOption(selectedAnswer) ? 'text-success' : 'text-error'">
              {{ isCorrectOption(selectedAnswer) ? t('learning.correct') : t('learning.incorrect') }}
            </span>
          </div>
          <!-- Cloze: explain the mistake in the user's mother tongue -->
          <p v-if="isClozeMode && !isCorrectOption(selectedAnswer) && currentQuestion?.explain" class="text-caption text-ink">
            <span class="font-medium">{{ t('learning.whyLabel') }}</span>
            {{ currentQuestion.explain }}
          </p>
          <p v-else-if="!isClozeMode" class="break-words text-caption text-ink-secondary">
            {{ currentQuestion?.example }}
          </p>
        </div>

        <CmButton block data-testid="quiz-next" @click="handleNextQuestion">
          {{ currentIndex < totalQuestions - 1 ? t('learning.nextQuestion') : t('learning.finishQuiz') }}
        </CmButton>
      </div>
    </template>

    <!-- Quiz Completed: factual result -->
    <template v-else>
      <div class="mb-6 rounded-[14px] border border-hairline bg-surface p-5 shadow-[var(--cm-shadow-small)]" data-testid="quiz-result">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-accent" aria-hidden="true">task_alt</span>
          <h2 class="text-title font-medium text-ink">{{ t('learning.quizComplete') }}</h2>
        </div>
        <p class="mt-3 text-meta text-ink-muted">{{ t('learning.yourScore') }}</p>
        <div class="flex items-baseline gap-3">
          <span class="text-display font-medium tabular-nums text-ink">{{ score }} / {{ totalQuestions }}</span>
          <span class="text-title tabular-nums text-ink-secondary">{{ accuracy }}%</span>
        </div>
        <p class="mt-2 text-meta tabular-nums text-ink-muted">
          +{{ xpEarned }} XP {{ t('learning.earned') }}
        </p>
      </div>

      <!-- Answer review -->
      <section class="mb-6">
        <h3 class="mb-2 text-caption font-medium text-ink">{{ t('learning.reviewAnswers') }}</h3>
        <ul class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface">
          <li
            v-for="(answer, index) in answers"
            :key="index"
            class="flex min-h-12 items-center gap-3 px-4 py-2"
          >
            <span
              class="material-symbols-outlined shrink-0"
              :class="answer.isCorrect ? 'text-success' : 'text-error'"
              :aria-label="answer.isCorrect ? t('learning.correct') : t('learning.incorrect')"
            >
              {{ answer.isCorrect ? 'check_circle' : 'cancel' }}
            </span>
            <template v-if="isClozeMode">
              <span class="shrink-0 text-body font-medium text-ink">{{ answer.word.answer }}</span>
              <span class="min-w-0 flex-1 truncate text-left text-caption text-ink-muted">{{ answer.word.sentence }}</span>
            </template>
            <template v-else>
              <span class="shrink-0 text-body font-medium text-ink">{{ answer.word.word }}</span>
              <span class="text-ink-muted" aria-hidden="true">-</span>
              <span class="min-w-0 flex-1 truncate text-caption text-ink-muted">{{ answer.word.meaning }}</span>
            </template>
          </li>
        </ul>
      </section>

      <!-- Bridge: use the connectors in a real chat -->
      <div v-if="isClozeMode" class="mb-3">
        <CmButton block @click="handleUseInChat">
          <span class="material-symbols-outlined" aria-hidden="true">forum</span>
          {{ t('learning.useInChat') }}
        </CmButton>
        <p class="mt-2 text-caption text-ink-secondary">{{ t('learning.useInChatHint') }}</p>
      </div>

      <!-- Restart -->
      <CmButton block :variant="isClozeMode ? 'secondary' : 'primary'" data-testid="quiz-restart" @click="handleRestartQuiz">
        <span class="material-symbols-outlined" aria-hidden="true">replay</span>
        {{ t('learning.tryAgain') }}
      </CmButton>
    </template>
  </div>
</template>
