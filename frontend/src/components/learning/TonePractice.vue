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
    default: 'zh'
  }
})

const emit = defineEmits(['complete'])

// Tone labels with visual contours
const toneButtons = [
  { tone: 1, label: '1st', contour: '\u2500', description: 'tone1' },
  { tone: 2, label: '2nd', contour: '\u2571', description: 'tone2' },
  { tone: 3, label: '3rd', contour: '\u2228', description: 'tone3' },
  { tone: 4, label: '4th', contour: '\u2572', description: 'tone4' },
]

// Game state
const questions = ref([])
const currentIndex = ref(0)
const score = ref(0)
const selectedTone = ref(null)
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

  // Filter characters that have tone info (exclude neutral tone from quiz)
  const toneChars = characters.filter(c => c.tone && c.tone >= 1 && c.tone <= 4)
  if (toneChars.length === 0) return

  // Build multiple rounds — repeat each tone a few times with different syllables
  const builtQuestions = []
  const shuffledChars = shuffle(toneChars)

  for (const char of shuffledChars) {
    const exampleWord = char.examples?.[0]
    const playText = exampleWord ? exampleWord.word : char.char

    builtQuestions.push({
      correctTone: char.tone,
      playText,
      char: char,
      displayHint: exampleWord ? exampleWord.reading : char.romaji,
    })
  }

  // Add a second round with shuffled order for more practice
  for (const char of shuffle(toneChars)) {
    const exampleWord = char.examples?.[1] || char.examples?.[0]
    const playText = exampleWord ? exampleWord.word : char.char

    builtQuestions.push({
      correctTone: char.tone,
      playText,
      char: char,
      displayHint: exampleWord ? exampleWord.reading : char.romaji,
    })
  }

  questions.value = shuffle(builtQuestions)
  currentIndex.value = 0
  score.value = 0
  selectedTone.value = null
  isAnswered.value = false
  isCorrect.value = false
  isCompleted.value = false

  nextTick(() => playCurrentAudio())
}

async function playCurrentAudio() {
  if (!currentQuestion.value || isPlayingAudio.value) return
  if (!isTTSAvailable()) return

  isPlayingAudio.value = true
  try {
    await playTTS(currentQuestion.value.playText, props.language)
  } catch (err) {
    console.warn('TTS playback failed:', err)
  } finally {
    isPlayingAudio.value = false
  }
}

function selectTone(tone) {
  if (isAnswered.value) return

  selectedTone.value = tone
  isAnswered.value = true
  isCorrect.value = tone === currentQuestion.value.correctTone

  if (isCorrect.value) {
    score.value++
    autoAdvanceTimer.value = setTimeout(() => advanceQuestion(), 800)
  }
}

function advanceQuestion() {
  if (currentIndex.value >= totalQuestions.value - 1) {
    isCompleted.value = true
    emit('complete', {
      score: score.value,
      total: totalQuestions.value
    })
    return
  }

  currentIndex.value++
  selectedTone.value = null
  isAnswered.value = false
  isCorrect.value = false

  nextTick(() => playCurrentAudio())
}

function handleNext() {
  advanceQuestion()
}

function restartGame() {
  if (autoAdvanceTimer.value) {
    clearTimeout(autoAdvanceTimer.value)
    autoAdvanceTimer.value = null
  }
  buildQuestions(props.characters)
}

onBeforeUnmount(() => {
  if (autoAdvanceTimer.value) {
    clearTimeout(autoAdvanceTimer.value)
    autoAdvanceTimer.value = null
  }
})

function getToneButtonClasses(tone) {
  if (!isAnswered.value) {
    return 'border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary bg-surface-light dark:bg-surface-dark'
  }

  const isSelected = selectedTone.value === tone
  const isCorrectTone = tone === currentQuestion.value.correctTone

  if (isCorrectTone) {
    return 'border-green-500 bg-green-50 dark:bg-green-900/30'
  }

  if (isSelected && !isCorrectTone) {
    return 'border-red-500 bg-red-50 dark:bg-red-900/30 animate-shake'
  }

  return 'border-slate-200 dark:border-slate-700 opacity-40'
}

watch(() => props.characters, (newChars) => buildQuestions(newChars), { immediate: true })
</script>

<template>
  <div class="flex flex-col items-center w-full max-w-lg mx-auto">
    <!-- Empty state -->
    <div v-if="totalQuestions === 0" class="text-center py-12">
      <span class="material-symbols-outlined text-[48px] text-slate-300 dark:text-slate-600 mb-4">music_off</span>
      <p class="text-sm text-text-muted dark:text-slate-400">{{ t('prelesson.tones') }}</p>
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
            class="mx-auto flex items-center justify-center size-16 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow"
            :class="{ 'animate-pulse': isPlayingAudio }"
          >
            <span class="material-symbols-outlined text-3xl text-primary">
              {{ isPlayingAudio ? 'volume_up' : 'play_arrow' }}
            </span>
          </button>
          <p class="mt-4 text-sm text-text-muted dark:text-slate-400">
            {{ t('prelesson.pickTone') }}
          </p>
        </template>
        <template v-else>
          <p class="text-3xl font-bold text-primary mb-2">{{ currentQuestion?.displayHint }}</p>
          <p class="text-sm text-text-muted dark:text-slate-400">
            {{ t('prelesson.pickTone') }}
          </p>
        </template>
      </div>

      <!-- Tone Buttons -->
      <div class="w-full grid grid-cols-2 gap-3">
        <button
          v-for="btn in toneButtons"
          :key="btn.tone"
          @click="selectTone(btn.tone)"
          :disabled="isAnswered"
          class="relative flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all touch-target"
          :class="getToneButtonClasses(btn.tone)"
        >
          <!-- Tone contour -->
          <span class="text-3xl font-mono text-text-main dark:text-white mb-1">
            {{ btn.contour }}
          </span>
          <!-- Tone label -->
          <span class="text-sm font-bold text-text-main dark:text-white">
            {{ t(`prelesson.${btn.description}`) }}
          </span>

          <!-- Correct checkmark overlay -->
          <span
            v-if="isAnswered && btn.tone === currentQuestion?.correctTone"
            class="absolute top-1 right-1 material-symbols-outlined text-green-500 text-lg"
          >
            check_circle
          </span>
          <!-- Wrong X overlay -->
          <span
            v-if="isAnswered && selectedTone === btn.tone && btn.tone !== currentQuestion?.correctTone"
            class="absolute top-1 right-1 material-symbols-outlined text-red-500 text-lg"
          >
            cancel
          </span>
        </button>
      </div>

      <!-- Show correct answer info after answering -->
      <div v-if="isAnswered" class="w-full mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
        <p class="text-sm text-text-muted dark:text-slate-400">
          {{ currentQuestion?.displayHint }}
        </p>
        <p class="text-xs text-text-muted dark:text-slate-500 mt-1">
          {{ currentQuestion?.char?.toneDescription }}
        </p>
      </div>

      <!-- Wrong Answer: Next Button -->
      <div v-if="isAnswered && !isCorrect" class="w-full mt-6">
        <button
          @click="handleNext"
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
