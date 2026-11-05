<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { usePlacementTest } from '../composables/usePlacementTest'
import { useNavState } from '../composables/useNavState'
import { levels } from '../data/characters'
import { levelCode } from '../utils/levelCode'
import CmAppBar from './ui/CmAppBar.vue'
import CmButton from './ui/CmButton.vue'
import CmProgress from './ui/CmProgress.vue'

const { t, locale } = useI18n()
const router = useRouter()
const { selectedLanguage, selectedLevel } = useNavState()
const language = computed(() => selectedLanguage.value || locale.value || 'en')

const { getQuestions, calculateLevel, result } = usePlacementTest()

const questions = computed(() => getQuestions(language.value))
const currentIndex = ref(0)
const answers = ref([])
const showResult = ref(!!result.value)
const selectedAnswer = ref(null)
const isAnswered = ref(false)

const currentQuestion = computed(() => questions.value[currentIndex.value] || null)
const total = computed(() => questions.value.length || 1)
const markers = ['A', 'B', 'C', 'D', 'E', 'F']
let advanceTimer = null

// Announced through the live region after each answer
const answerFeedback = computed(() => {
  if (!isAnswered.value || !currentQuestion.value) return ''
  return selectedAnswer.value === currentQuestion.value.answer
    ? t('placementTest.correct')
    : t('placementTest.wrongAnswer', { answer: currentQuestion.value.options[currentQuestion.value.answer] })
})

function optionState(i) {
  if (!isAnswered.value) return 'idle'
  if (i === currentQuestion.value.answer) return 'correct'
  if (i === selectedAnswer.value) return 'wrong'
  return 'dim'
}

function selectAnswer(index) {
  if (isAnswered.value) return
  selectedAnswer.value = index
  isAnswered.value = true
  answers.value.push(index)

  advanceTimer = setTimeout(() => {
    advanceTimer = null
    if (currentIndex.value < total.value - 1) {
      currentIndex.value++
      selectedAnswer.value = null
      isAnswered.value = false
    } else {
      calculateLevel(answers.value, language.value)
      showResult.value = true
    }
  }, 600)
}

onBeforeUnmount(() => clearTimeout(advanceTimer))

function retake() {
  currentIndex.value = 0
  answers.value = []
  selectedAnswer.value = null
  isAnswered.value = false
  showResult.value = false
}

function handleDone() {
  // Auto-apply the tested level to global nav state so home shows it pre-selected
  if (result.value?.level) {
    const matched = levels.find(l => l.id === result.value.level)
    if (matched) selectedLevel.value = matched
    try {
      localStorage.setItem('chatmate_placement_result', JSON.stringify({
        level: result.value.level,
        score: result.value.score,
        appliedAt: Date.now(),
      }))
    } catch {}
  }
  router.push('/')
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-page">
    <CmAppBar :title="t('placementTest.title')" :back-label="t('common.back')" @back="router.push('/')">
      <template v-if="!(showResult && result) && currentQuestion" #below>
        <div class="flex items-center gap-3 px-4 pb-3 min-[375px]:px-5">
          <span class="shrink-0 text-meta text-ink-muted tabular-nums">{{ t('placementTest.question', { current: currentIndex + 1, total }) }}</span>
          <CmProgress class="flex-1" :value="currentIndex + 1" :max="total" :label="t('placementTest.question', { current: currentIndex + 1, total })" />
        </div>
      </template>
    </CmAppBar>

    <!-- Result -->
    <div v-if="showResult && result" class="flex flex-1 flex-col justify-center px-4 py-8 min-[375px]:px-5">
      <div class="mx-auto w-full max-w-md">
        <p class="text-caption text-ink-secondary">{{ t('placementTest.result') }}</p>
        <p class="mt-1 text-display font-medium text-ink">{{ t(`levels.${result.level}.name`) }}</p>
        <p class="mt-1 text-caption text-ink-muted tabular-nums">{{ levelCode(result.level) }} · {{ t('placementTest.score', { score: result.score }) }}</p>
        <div class="mt-8 grid grid-cols-1 gap-3 min-[375px]:grid-cols-2">
          <CmButton variant="secondary" @click="retake">{{ t('placementTest.retake') }}</CmButton>
          <CmButton @click="handleDone">{{ t('placementTest.useLevel') }}</CmButton>
        </div>
      </div>
    </div>

    <!-- Questions -->
    <div v-else-if="currentQuestion" class="flex flex-1 flex-col justify-center px-4 py-8 min-[375px]:px-5">
      <div class="mx-auto w-full max-w-md">
        <h2 class="text-section font-medium text-ink">{{ currentQuestion.q }}</h2>

        <div class="mt-6 space-y-2.5" role="group" :aria-label="currentQuestion.q">
          <button
            v-for="(option, i) in currentQuestion.options"
            :key="i"
            type="button"
            @click="selectAnswer(i)"
            :disabled="isAnswered"
            class="flex min-h-14 w-full items-center gap-3 rounded-[10px] border px-3 py-2.5 text-left text-body disabled:cursor-default"
            :class="{
              'border-hairline bg-surface text-ink active:bg-surface-raised': optionState(i) === 'idle',
              'border-success/30 bg-success-soft text-ink': optionState(i) === 'correct',
              'border-error/30 bg-error-soft text-ink': optionState(i) === 'wrong',
              'border-hairline bg-surface text-ink opacity-55': optionState(i) === 'dim',
            }"
          >
            <span
              class="flex size-6 shrink-0 items-center justify-center rounded-[6px] text-meta font-medium"
              :class="{
                'bg-surface-raised text-ink-secondary': optionState(i) === 'idle' || optionState(i) === 'dim',
                'bg-success text-on-accent': optionState(i) === 'correct',
                'bg-error text-on-accent': optionState(i) === 'wrong',
              }"
              aria-hidden="true"
            >{{ markers[i] }}</span>
            <span class="min-w-0 flex-1">{{ option }}</span>
            <span v-if="optionState(i) === 'correct'" class="flex shrink-0 items-center gap-1 text-caption text-success">
              <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">check</span>{{ t('placementTest.correctLabel') }}
            </span>
            <span v-else-if="optionState(i) === 'wrong'" class="flex shrink-0 items-center gap-1 text-caption text-error">
              <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">close</span>{{ t('placementTest.wrongLabel') }}
            </span>
          </button>
        </div>
        <p class="sr-only" aria-live="polite">{{ answerFeedback }}</p>
      </div>
    </div>
  </div>
</template>
