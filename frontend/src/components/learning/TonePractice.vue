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
    return 'border-hairline bg-surface active:bg-surface-raised'
  }

  const isSelected = selectedTone.value === tone
  const isCorrectTone = tone === currentQuestion.value.correctTone

  if (isCorrectTone) {
    return 'border-success/40 bg-success-soft'
  }

  if (isSelected && !isCorrectTone) {
    return 'border-error/40 bg-error-soft'
  }

  return 'border-hairline bg-surface opacity-40'
}

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
    <!-- Empty state -->
    <div v-if="totalQuestions === 0" class="flex flex-col items-center gap-3 py-12 text-center">
      <span class="flex size-16 items-center justify-center rounded-[14px] bg-accent-soft text-accent">
        <span class="material-symbols-outlined !text-[32px]" aria-hidden="true">music_off</span>
      </span>
      <p class="text-caption text-ink-secondary">{{ t('prelesson.tones') }}</p>
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
        <CmProgress :value="progress" :max="100" :label="t('prelesson.pickTone')" />
      </div>

      <!-- Audio prompt -->
      <div class="relative mb-4 rounded-[14px] border border-hairline bg-surface p-5 text-center shadow-[var(--cm-shadow-small)]" data-testid="tone-prompt">
        <span class="absolute left-0 top-5 h-9 w-[3px] rounded-r-[3px] bg-accent" aria-hidden="true"></span>
        <template v-if="isTTSAvailable()">
          <button
            type="button"
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
            {{ t('prelesson.pickTone') }}
          </p>
        </template>
        <template v-else>
          <p class="mb-1 text-display font-medium text-accent">{{ currentQuestion?.displayHint }}</p>
          <p class="text-caption text-ink-secondary">
            {{ t('prelesson.pickTone') }}
          </p>
        </template>
      </div>

      <!-- Tone buttons -->
      <div class="grid w-full grid-cols-2 gap-2">
        <button
          v-for="btn in toneButtons"
          :key="btn.tone"
          type="button"
          @click="selectTone(btn.tone)"
          :disabled="isAnswered"
          :aria-label="t(`prelesson.${btn.description}`)"
          class="touch-target relative flex min-h-[88px] flex-col items-center justify-center rounded-[10px] border p-3 transition-colors duration-[180ms]"
          :class="getToneButtonClasses(btn.tone)"
        >
          <span class="mb-1 font-mono text-section text-ink" aria-hidden="true">
            {{ btn.contour }}
          </span>
          <span class="text-caption font-medium text-ink">
            {{ t(`prelesson.${btn.description}`) }}
          </span>

          <span
            v-if="isAnswered && btn.tone === currentQuestion?.correctTone"
            class="absolute right-1 top-1 material-symbols-outlined !text-[18px] text-success"
            aria-hidden="true"
          >check_circle</span>
          <span
            v-if="isAnswered && selectedTone === btn.tone && btn.tone !== currentQuestion?.correctTone"
            class="absolute right-1 top-1 material-symbols-outlined !text-[18px] text-error"
            aria-hidden="true"
          >cancel</span>
        </button>
      </div>

      <!-- Answer info -->
      <div v-if="isAnswered" class="mt-4 rounded-[14px] bg-surface-sunken p-4 text-center" role="status">
        <p class="flex items-center justify-center gap-1 text-caption font-medium" :class="isCorrect ? 'text-success' : 'text-error'">
          <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">{{ isCorrect ? 'check_circle' : 'cancel' }}</span>
          {{ isCorrect ? t('learning.correct') : t('learning.incorrect') }}
        </p>
        <p class="mt-1 text-body text-ink">
          {{ currentQuestion?.displayHint }}
        </p>
        <p class="mt-1 text-meta text-ink-muted">
          {{ currentQuestion?.char?.toneDescription }}
        </p>
      </div>

      <!-- Wrong answer: next -->
      <div v-if="isAnswered && !isCorrect" class="mt-5 w-full">
        <CmButton block @click="handleNext">
          <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
          {{ t('prelesson.nextCharacter') }}
        </CmButton>
      </div>
    </template>

    <!-- Game complete: factual result -->
    <template v-else>
      <div class="mb-6 rounded-[14px] border border-hairline bg-surface p-5 shadow-[var(--cm-shadow-small)]">
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

      <CmButton block @click="restartGame">
        <span class="material-symbols-outlined" aria-hidden="true">replay</span>
        {{ t('learning.tryAgain') }}
      </CmButton>
    </template>
  </div>
</template>
