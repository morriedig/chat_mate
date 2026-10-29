<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useMotherTongue } from '../composables/useMotherTongue'
import { useDailyGoal } from '../composables/useDailyGoal'
import { useDailyPractice } from '../composables/useDailyPractice'
import { useSentenceCheck, usesPattern } from '../composables/useSentenceCheck'
import { getDailyVocab } from '../data/dailyLoader'
import { playTTS, stopTTS } from '../utils/tts'
import { shuffleArray } from '../utils/shuffle'

const { t } = useI18n()
const router = useRouter()
const { motherTongue } = useMotherTongue()
const { startTimer, stopTimer } = useDailyGoal()
const { isChecking, checkSentence } = useSentenceCheck()

const {
  levels,
  level,
  todayPatterns,
  todayWords,
  totalCount,
  doneCount,
  isDoneToday,
  isDone,
  isNew,
  completeItem,
  setLevel,
  ensureTodayPlan,
} = useDailyPractice()

// One queue: patterns first, then words
const queue = computed(() => [
  ...todayPatterns.value.map(item => ({ kind: 'pattern', item })),
  ...todayWords.value.map(item => ({ kind: 'word', item })),
])
const current = computed(() => queue.value.find(entry => !isDone(entry.item.id)) || null)

// ---------- Per-item state ----------
// stage: 'learn' (study card) → 'quiz' (pick an answer) → 'write' (patterns only) → 'rate'
const stage = ref('learn')
const picked = ref(null)
const sentence = ref('')
const check = ref(null)
const checkFailed = ref(false)

function resetItem() {
  const entry = current.value
  // New items are studied first; reviews start with the quiz (recall before seeing it)
  stage.value = entry && isNew(entry.item.id) ? 'learn' : 'quiz'
  picked.value = null
  sentence.value = ''
  check.value = null
  checkFailed.value = false
  stopTTS()
}

watch(() => current.value?.item.id, resetItem, { immediate: true })

// ---------- Quiz ----------
// Words: pick the English word for the Chinese meaning, distractors from the same level
const levelWords = computed(() => getDailyVocab(level.value))
const wordOptions = computed(() => {
  const entry = current.value
  if (!entry || entry.kind !== 'word') return []
  const others = shuffleArray(levelWords.value.filter(w => w.id !== entry.item.id)).slice(0, 2)
  return shuffleArray([entry.item, ...others]).map(w => ({ id: w.id, text: w.word }))
})

const quizOptions = computed(() => {
  const entry = current.value
  if (!entry) return []
  if (entry.kind === 'word') return wordOptions.value
  return entry.item.choice.options.map((text, i) => ({ id: i, text }))
})
const correctOptionId = computed(() => {
  const entry = current.value
  if (!entry) return null
  return entry.kind === 'word' ? entry.item.id : entry.item.choice.answer
})
const isCorrect = computed(() => picked.value !== null && picked.value === correctOptionId.value)

function pick(optionId) {
  if (picked.value !== null) return
  picked.value = optionId
}

function afterQuiz() {
  const entry = current.value
  if (entry.kind === 'pattern') {
    stage.value = 'write'
  } else {
    stage.value = 'rate'
  }
}

// ---------- Write (patterns) ----------
const localUsedPattern = computed(() =>
  current.value?.kind === 'pattern' && usesPattern(sentence.value, current.value.item.match || []))

async function submitSentence() {
  const entry = current.value
  if (!sentence.value.trim() || !entry) return
  checkFailed.value = false
  const result = await checkSentence({
    sentence: sentence.value.trim(),
    pattern: entry.item.pattern,
    meaning: entry.item.meaning,
    task: entry.item.task,
    level: level.value,
    nativeLanguage: motherTongue.value || 'zh',
  })
  if (result) {
    check.value = result
  } else {
    checkFailed.value = true
  }
  stage.value = 'rate'
}

function skipWriting() {
  stage.value = 'rate'
}

// ---------- Rate ----------
const RATINGS = [
  { key: 'hard', confidence: 2 },
  { key: 'ok', confidence: 3 },
  { key: 'easy', confidence: 5 },
]

function rate(confidence) {
  const entry = current.value
  // A wrong quiz answer or an unused pattern means the item comes back sooner
  const usedPattern = check.value ? check.value.usedPattern : localUsedPattern.value
  const wrote = sentence.value.trim().length > 0
  const correct = isCorrect.value && (entry.kind === 'word' || !wrote || usedPattern)
  completeItem(entry.item.id, { correct, confidence })
}

// ---------- Misc ----------
function speak(text) {
  playTTS(text, 'en', 'normal')
}

function handleBack() {
  router.push('/')
}

const progressPercent = computed(() =>
  totalCount.value ? Math.round((doneCount.value / totalCount.value) * 100) : 0)
const patternsDone = computed(() => todayPatterns.value.filter(p => isDone(p.id)).length)
const wordsDone = computed(() => todayWords.value.filter(w => isDone(w.id)).length)

onMounted(() => {
  ensureTodayPlan()
  startTimer()
})

onBeforeUnmount(() => {
  stopTimer()
  stopTTS()
})
</script>

<template>
  <div class="flex h-screen w-full max-w-[100vw] overflow-hidden">
    <div class="flex flex-1 flex-col h-full relative bg-background-light dark:bg-background-dark">
      <!-- Header -->
      <header class="flex items-center justify-between border-b border-[#e7eff3] dark:border-slate-800 px-3 sm:px-6 py-3 sm:py-4 bg-surface-light dark:bg-surface-dark z-10 shadow-sm overflow-hidden safe-area-top">
        <div class="flex items-center gap-2 sm:gap-3 text-text-main dark:text-white min-w-0 shrink">
          <button @click="handleBack" class="flex items-center justify-center shrink-0" :aria-label="t('dailyPractice.back')">
            <span class="material-symbols-outlined cursor-pointer">arrow_back</span>
          </button>
          <div class="flex flex-col min-w-0">
            <h2 class="text-sm sm:text-base font-bold leading-tight truncate">{{ t('dailyPractice.title') }}</h2>
            <span class="text-xs text-text-muted dark:text-slate-400 truncate">
              {{ t('dailyPractice.progress', { done: doneCount, total: totalCount }) }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button
            v-for="lv in levels"
            :key="lv"
            @click="setLevel(lv)"
            class="px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors"
            :class="lv === level
              ? 'bg-primary text-white border-primary'
              : 'border-slate-200 dark:border-slate-700 text-text-muted dark:text-slate-400'"
          >{{ t(`levels.${lv}.name`) }}</button>
        </div>
      </header>
      <div class="h-1 bg-slate-100 dark:bg-slate-800">
        <div class="h-1 bg-primary transition-all" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div class="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-4">
          <!-- ========== DONE ========== -->
          <template v-if="isDoneToday || !current">
            <div class="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm text-center space-y-2">
              <p class="text-4xl">🎉</p>
              <p class="text-lg font-bold text-text-main dark:text-white">{{ t('dailyPractice.doneTitle') }}</p>
              <p class="text-sm text-text-muted dark:text-slate-400">
                {{ t('dailyPractice.doneSummary', { patterns: patternsDone, words: wordsDone }) }}
              </p>
            </div>
            <p class="text-sm font-medium text-text-main dark:text-slate-200">{{ t('dailyPractice.useThemHint') }}</p>
            <ul class="space-y-1.5">
              <li v-for="p in todayPatterns" :key="p.id" class="text-sm text-text-main dark:text-slate-200 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 break-words">{{ p.pattern }}</li>
            </ul>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button @click="router.push('/daily-opinion')" class="py-3 rounded-xl bg-primary text-white font-semibold">{{ t('dailyPractice.writeOpinion') }}</button>
              <button @click="router.push('/')" class="py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-text-main dark:text-slate-200 font-semibold">{{ t('dailyPractice.backHome') }}</button>
            </div>
          </template>

          <!-- ========== PATTERN ========== -->
          <template v-else-if="current.kind === 'pattern'">
            <p class="text-xs font-semibold text-primary uppercase tracking-wider">
              {{ isNew(current.item.id) ? t('dailyPractice.newPattern') : t('dailyPractice.reviewPattern') }}
            </p>

            <!-- Study card: shown first for new patterns, after the quiz for reviews -->
            <div
              v-if="stage !== 'quiz' || picked !== null"
              class="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div class="flex items-start justify-between gap-2">
                <p class="text-lg font-bold text-text-main dark:text-white break-words">{{ current.item.pattern }}</p>
                <button @click="speak(current.item.examples[0].en)" class="shrink-0 text-primary" :aria-label="t('dailyPractice.listen')">
                  <span class="material-symbols-outlined">volume_up</span>
                </button>
              </div>
              <p class="text-sm font-medium text-text-main dark:text-slate-200">{{ current.item.meaning }}</p>
              <p class="text-sm text-text-muted dark:text-slate-400">{{ current.item.when }}</p>
              <div v-for="(ex, i) in current.item.examples" :key="i" class="pl-3 border-l-2 border-primary/40">
                <button @click="speak(ex.en)" class="text-left text-sm text-text-main dark:text-slate-200 break-words">{{ ex.en }}</button>
                <p class="text-xs text-text-muted dark:text-slate-400 break-words">{{ ex.zh }}</p>
              </div>
              <div v-if="current.item.mistake" class="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm space-y-1">
                <p class="text-amber-700 dark:text-amber-300 line-through break-words">{{ current.item.mistake.wrong }}</p>
                <p class="text-green-700 dark:text-green-400 break-words">{{ current.item.mistake.right }}</p>
                <p class="text-text-muted dark:text-slate-400">{{ current.item.mistake.why }}</p>
              </div>
              <button v-if="stage === 'learn'" @click="stage = 'quiz'" class="w-full py-3 rounded-xl bg-primary text-white font-semibold">
                {{ t('dailyPractice.startPractice') }}
              </button>
            </div>

            <!-- Quiz: pick the natural sentence -->
            <div v-if="stage === 'quiz'" class="space-y-2">
              <p class="text-sm font-medium text-text-main dark:text-slate-200">{{ current.item.choice.situation }}</p>
              <button
                v-for="opt in quizOptions"
                :key="opt.id"
                @click="pick(opt.id)"
                class="w-full text-left p-3 rounded-xl border text-sm break-words transition-colors"
                :class="picked === null
                  ? 'border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark text-text-main dark:text-slate-200 hover:border-primary/50'
                  : opt.id === correctOptionId
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/20 text-text-main dark:text-slate-200'
                    : opt.id === picked
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-text-main dark:text-slate-200'
                      : 'border-slate-200 dark:border-slate-700 text-text-muted dark:text-slate-500'"
              >{{ opt.text }}</button>
              <template v-if="picked !== null">
                <p class="text-sm" :class="isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                  {{ isCorrect ? t('dailyPractice.correct') : t('dailyPractice.notQuite') }}
                </p>
                <p class="text-sm text-text-muted dark:text-slate-400">{{ current.item.choice.explain }}</p>
                <button @click="afterQuiz" class="w-full py-3 rounded-xl bg-primary text-white font-semibold">{{ t('dailyPractice.next') }}</button>
              </template>
            </div>

            <!-- Write your own sentence -->
            <div v-if="stage === 'write' || stage === 'rate'" class="space-y-2">
              <p class="text-sm font-medium text-text-main dark:text-slate-200">{{ current.item.task }}</p>
              <textarea
                v-model="sentence"
                :disabled="stage === 'rate'"
                rows="3"
                class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark text-text-main dark:text-slate-200 text-base focus:ring-2 focus:ring-primary focus:outline-none"
                :placeholder="current.item.pattern"
              ></textarea>
              <div v-if="stage === 'write'" class="flex gap-2">
                <button
                  @click="submitSentence"
                  :disabled="!sentence.trim() || isChecking"
                  class="flex-1 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50"
                >{{ isChecking ? t('dailyPractice.checking') : t('dailyPractice.check') }}</button>
                <button @click="skipWriting" class="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-text-muted dark:text-slate-400 text-sm">
                  {{ t('dailyPractice.skip') }}
                </button>
              </div>

              <!-- AI friend's check -->
              <div v-if="check" class="p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800 text-sm space-y-2">
                <p :class="check.usedPattern ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-300'">
                  {{ check.usedPattern ? t('dailyPractice.usedPattern') : t('dailyPractice.missedPattern') }}
                </p>
                <p class="text-text-main dark:text-slate-200">{{ check.comment }}</p>
                <p v-if="check.corrected && check.corrected.trim() !== sentence.trim()" class="break-words">
                  <span class="text-text-muted dark:text-slate-400">{{ t('dailyPractice.corrected') }}</span>
                  <span class="text-text-main dark:text-slate-200">{{ check.corrected }}</span>
                </p>
                <button @click="speak(check.better)" class="text-left break-words">
                  <span class="text-text-muted dark:text-slate-400">{{ t('dailyPractice.better') }}</span>
                  <span class="text-primary">{{ check.better }}</span>
                </button>
              </div>
              <p v-else-if="checkFailed" class="text-sm text-text-muted dark:text-slate-400">
                {{ localUsedPattern ? t('dailyPractice.usedPattern') : t('dailyPractice.missedPattern') }}
                {{ t('dailyPractice.checkUnavailable') }}
              </p>
            </div>
          </template>

          <!-- ========== WORD ========== -->
          <template v-else>
            <p class="text-xs font-semibold text-primary uppercase tracking-wider">
              {{ isNew(current.item.id) ? t('dailyPractice.newWord') : t('dailyPractice.reviewWord') }}
            </p>

            <!-- Quiz: meaning → word -->
            <div v-if="stage === 'quiz'" class="space-y-2">
              <p class="text-base font-semibold text-text-main dark:text-white">{{ current.item.meaning }}</p>
              <button
                v-for="opt in quizOptions"
                :key="opt.id"
                @click="pick(opt.id)"
                class="w-full text-left p-3 rounded-xl border text-base transition-colors"
                :class="picked === null
                  ? 'border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark text-text-main dark:text-slate-200 hover:border-primary/50'
                  : opt.id === correctOptionId
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/20 text-text-main dark:text-slate-200'
                    : opt.id === picked
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-text-main dark:text-slate-200'
                      : 'border-slate-200 dark:border-slate-700 text-text-muted dark:text-slate-500'"
              >{{ opt.text }}</button>
            </div>

            <!-- Word card: first for new words, after answering for reviews -->
            <div
              v-if="stage !== 'quiz' || picked !== null"
              class="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm space-y-2"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="min-w-0">
                  <p class="text-xl font-bold text-text-main dark:text-white break-words">{{ current.item.word }}</p>
                  <p class="text-xs text-text-muted dark:text-slate-400">{{ current.item.pos }} {{ current.item.phonetic }}</p>
                </div>
                <button @click="speak(current.item.word)" class="shrink-0 text-primary" :aria-label="t('dailyPractice.listen')">
                  <span class="material-symbols-outlined">volume_up</span>
                </button>
              </div>
              <p class="text-sm font-medium text-text-main dark:text-slate-200">{{ current.item.meaning }}</p>
              <div class="pl-3 border-l-2 border-primary/40">
                <button @click="speak(current.item.example.en)" class="text-left text-sm text-text-main dark:text-slate-200 break-words">{{ current.item.example.en }}</button>
                <p class="text-xs text-text-muted dark:text-slate-400 break-words">{{ current.item.example.zh }}</p>
              </div>
              <div v-if="current.item.collocations?.length" class="flex flex-wrap gap-1.5">
                <span v-for="c in current.item.collocations" :key="c" class="text-xs px-2 py-1 rounded-lg bg-primary/10 dark:bg-primary/20 text-text-main dark:text-slate-200">{{ c }}</span>
              </div>
              <p v-if="current.item.note" class="text-sm text-text-muted dark:text-slate-400">{{ current.item.note }}</p>
              <button v-if="stage === 'learn'" @click="stage = 'quiz'" class="w-full py-3 rounded-xl bg-primary text-white font-semibold">
                {{ t('dailyPractice.startPractice') }}
              </button>
              <button v-else-if="stage === 'quiz' && picked !== null" @click="afterQuiz" class="w-full py-3 rounded-xl bg-primary text-white font-semibold">
                {{ t('dailyPractice.next') }}
              </button>
            </div>
          </template>

          <!-- Self-rating: how well do you know it now? -->
          <div v-if="current && !isDoneToday && stage === 'rate'" class="space-y-2">
            <p class="text-sm font-medium text-text-main dark:text-slate-200">{{ t('dailyPractice.howWell') }}</p>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="r in RATINGS"
                :key="r.key"
                @click="rate(r.confidence)"
                class="py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark text-sm font-semibold text-text-main dark:text-slate-200 hover:border-primary/50"
              >{{ t(`dailyPractice.rating.${r.key}`) }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
