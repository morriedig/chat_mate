<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { usePlacementTest } from '../composables/usePlacementTest'
import { useNavState } from '../composables/useNavState'

const { t, locale } = useI18n()
const router = useRouter()
const { selectedLanguage } = useNavState()
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

function selectAnswer(index) {
  if (isAnswered.value) return
  selectedAnswer.value = index
  isAnswered.value = true
  answers.value.push(index)

  setTimeout(() => {
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

function retake() {
  currentIndex.value = 0
  answers.value = []
  selectedAnswer.value = null
  isAnswered.value = false
  showResult.value = false
}

function handleDone() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
    <!-- Header -->
    <div class="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700 safe-area-top">
      <button @click="router.push('/')" class="text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 class="text-lg font-bold text-text-main dark:text-white">{{ t('placementTest.title') }}</h1>
    </div>

    <!-- Result -->
    <div v-if="showResult && result" class="flex-1 flex flex-col items-center justify-center p-8">
      <div class="text-center">
        <span class="material-symbols-outlined text-6xl text-primary mb-4">emoji_events</span>
        <h2 class="text-2xl font-bold text-text-main dark:text-white mb-2">{{ t('placementTest.result') }}</h2>
        <p class="text-lg text-text-muted dark:text-slate-400 mb-4">{{ t('placementTest.score', { score: result.score }) }}</p>
        <div class="inline-block px-6 py-3 rounded-2xl bg-primary/10 dark:bg-primary/20 border-2 border-primary mb-6">
          <p class="text-sm text-text-muted dark:text-slate-400">{{ t('placementTest.recommended', { level: '' }) }}</p>
          <p class="text-2xl font-bold text-primary capitalize">{{ t(`levels.${result.level}.name`) }}</p>
        </div>
        <div class="flex gap-3 justify-center">
          <button @click="retake" class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-text-main dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {{ t('placementTest.retake') }}
          </button>
          <button @click="handleDone" class="px-6 py-2 rounded-lg bg-primary text-[#0d171b] font-bold hover:bg-primary/90 transition-colors">
            {{ t('setup.startChatting') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Questions -->
    <div v-else-if="currentQuestion" class="flex-1 flex flex-col p-6">
      <!-- Progress -->
      <div class="mb-6">
        <div class="flex justify-between text-sm text-text-muted dark:text-slate-400 mb-2">
          <span>{{ t('placementTest.question', { current: currentIndex + 1, total }) }}</span>
        </div>
        <div class="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div class="h-full rounded-full bg-primary transition-all duration-300" :style="{ width: `${((currentIndex + 1) / total) * 100}%` }" />
        </div>
      </div>

      <!-- Question -->
      <div class="flex-1 flex flex-col justify-center">
        <h2 class="text-xl font-bold text-text-main dark:text-white mb-6 text-center">
          {{ currentQuestion.q }}
        </h2>

        <div class="space-y-3 max-w-md mx-auto w-full">
          <button
            v-for="(option, i) in currentQuestion.options"
            :key="i"
            @click="selectAnswer(i)"
            class="w-full p-4 rounded-xl border-2 text-left font-medium transition-all"
            :class="{
              'border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:border-primary text-text-main dark:text-white': !isAnswered,
              'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300': isAnswered && i === currentQuestion.answer,
              'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300': isAnswered && i === selectedAnswer && i !== currentQuestion.answer,
              'border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark opacity-50': isAnswered && i !== selectedAnswer && i !== currentQuestion.answer,
            }"
            :disabled="isAnswered"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
