<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useMotherTongue } from '../composables/useMotherTongue'
import { useDailyGoal } from '../composables/useDailyGoal'
import { useDailyPractice } from '../composables/useDailyPractice'
import { useSentenceCheck, usesPattern } from '../composables/useSentenceCheck'
import { useMistakes, srsId as mistakeSrsId } from '../composables/useMistakes'
import { bankSrsId } from '../composables/useDailyPractice'
import MistakeCard from './practice/MistakeCard.vue'
import BankWordCard from './practice/BankWordCard.vue'
import ListeningCard from './practice/ListeningCard.vue'
import CoreSpeakingCard from './practice/CoreSpeakingCard.vue'
import PracticeCard from './practice/PracticeCard.vue'
import PracticeRating from './practice/PracticeRating.vue'
import CmAppBar from './ui/CmAppBar.vue'
import CmButton from './ui/CmButton.vue'
import CmIconButton from './ui/CmIconButton.vue'
import CmChip from './ui/CmChip.vue'
import CmProgress from './ui/CmProgress.vue'
import CmSegmentedControl from './ui/CmSegmentedControl.vue'
import CmBottomSheet from './ui/CmBottomSheet.vue'
import { useTaskChatLauncher } from '../composables/useTaskChatLauncher'
import { getDailyVocab } from '../data/dailyLoader'
import { playTTS, stopTTS } from '../utils/tts'
import { shuffleArray } from '../utils/shuffle'

const { t } = useI18n()
const router = useRouter()
const { motherTongue } = useMotherTongue()
const { startTimer, stopTimer } = useDailyGoal()
const { isChecking, checkSentence } = useSentenceCheck()
const { addMistake, removeMistake } = useMistakes()
const { startTaskChat } = useTaskChatLauncher()

const {
  levels,
  level,
  todayPatterns,
  todayWords,
  todayMistakes,
  todayBankWords,
  todayListening,
  totalCount,
  doneCount,
  remainingCount,
  core,
  coreKeys,
  coreStep,
  coreDoneCount,
  coreError,
  corePattern,
  coreSpeaking,
  completeCoreError,
  completeCorePattern,
  submitCoreSpeaking,
  rateCoreSpeaking,
  isDone,
  isNew,
  completeItem,
  setLevel,
  ensureTodayPlan,
} = useDailyPractice()

// ---------- Core 3 steps first ----------
const CORE_STEPS = ['error', 'pattern', 'speaking']
const inCore = computed(() => coreStep.value !== 'done')
const coreEntry = computed(() => {
  if (coreStep.value === 'error') return { kind: 'mistake', key: core.value.errorKey, item: coreError.value, core: true }
  if (coreStep.value === 'pattern') return { kind: 'pattern', key: core.value.patternId, item: corePattern.value, core: true }
  if (coreStep.value === 'speaking') return { kind: 'speak', key: 'core:speak', item: coreSpeaking.value, core: true }
  return null
})
function coreStepState(step) {
  const index = CORE_STEPS.indexOf(step)
  if (!inCore.value || index < CORE_STEPS.indexOf(coreStep.value)) return 'done'
  return step === coreStep.value ? 'current' : 'todo'
}

// ---------- Then the extras ("再練一些"): mistakes, patterns, words, saved words, listening ----------
const showExtras = ref(false)
const queue = computed(() => [
  ...todayMistakes.value.map(item => ({ kind: 'mistake', key: mistakeSrsId(item.id), item })),
  ...todayPatterns.value.map(item => ({ kind: 'pattern', key: item.id, item })),
  ...todayWords.value.map(item => ({ kind: 'word', key: item.id, item })),
  ...todayBankWords.value.map(item => ({ kind: 'bank', key: bankSrsId(item.id), item })),
  ...todayListening.value.map(item => ({ kind: 'listen', key: item.id, item })),
].filter(entry => !coreKeys.value.includes(entry.key)))
const extraCurrent = computed(() => queue.value.find(entry => !isDone(entry.key)) || null)
const current = computed(() => {
  if (inCore.value) return coreEntry.value
  return showExtras.value ? extraCurrent.value : null
})

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
  stage.value = entry?.item?.id && isNew(entry.item.id) ? 'learn' : 'quiz'
  picked.value = null
  sentence.value = ''
  check.value = null
  checkFailed.value = false
  stopTTS()
}

watch(() => current.value?.key, resetItem, { immediate: true })

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
  if (entry.kind !== 'pattern') return []
  return entry.item.choice.options.map((text, i) => ({ id: i, text }))
})
const correctOptionId = computed(() => {
  const entry = current.value
  if (!entry) return null
  if (entry.kind === 'word') return entry.item.id
  return entry.kind === 'pattern' ? entry.item.choice.answer : null
})
const isCorrect = computed(() => picked.value !== null && picked.value === correctOptionId.value)

function pick(optionId) {
  if (picked.value !== null) return
  picked.value = optionId
}

function afterQuiz() {
  const entry = current.value
  // Core step 2 is recall only: the answer itself sets the SM-2 quality (step 3 is the output)
  if (entry.core) {
    completeCorePattern(isCorrect.value)
    return
  }
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
    // A corrected sentence comes back later as a review card
    if (result.corrected) {
      addMistake({
        original: sentence.value.trim(),
        corrected: result.corrected,
        explanation: result.comment,
        type: result.errorType,
        source: 'practice',
      })
    }
  } else {
    checkFailed.value = true
  }
  stage.value = 'rate'
}

function skipWriting() {
  stage.value = 'rate'
}

// ---------- Rate ----------
function rate(confidence) {
  const entry = current.value
  // A wrong quiz answer or an unused pattern means the item comes back sooner
  const usedPattern = check.value ? check.value.usedPattern : localUsedPattern.value
  const wrote = sentence.value.trim().length > 0
  const correct = isCorrect.value && (entry.kind === 'word' || !wrote || usedPattern)
  completeItem(entry.key, { correct, confidence })
}

// Mistake, saved-word and listening cards report their own result
function finishCard(entry, result) {
  if (entry.core) completeCoreError(result)
  else completeItem(entry.key, { ...result, track: entry.kind !== 'listen' })
}

function dropMistake(entry) {
  if (entry.core) completeCoreError({ correct: true, confidence: 5 }, { removed: true })
  else completeItem(entry.key, { correct: true, confidence: 5, track: false })
  removeMistake(entry.item.id)
}

// ---------- Misc ----------
function speak(text) {
  playTTS(text, 'en', 'normal')
}

function handleBack() {
  router.push('/')
}

// ---------- Level ----------
const levelOptions = computed(() => levels.map(lv => ({ value: lv, label: t(`levels.${lv}.name`) })))
// Switching level replaces today's plan, so ask first when an answer is in progress
const pendingLevel = ref(null)
const midAnswer = computed(() => {
  const entry = current.value
  // The core's pattern step (and a pattern prompt in step 3) belong to the level
  if (inCore.value && coreDoneCount.value > 0) return true
  if (!entry || (entry.kind !== 'pattern' && entry.kind !== 'word')) return false
  return picked.value !== null || sentence.value.trim().length > 0 || stage.value === 'write' || stage.value === 'rate'
})

function requestLevel(lv) {
  if (lv === level.value) return
  if (midAnswer.value) pendingLevel.value = lv
  else setLevel(lv)
}

function confirmLevel() {
  const lv = pendingLevel.value
  pendingLevel.value = null
  if (lv) setLevel(lv)
}

// Plain label above the current card
const sectionLabel = computed(() => {
  const entry = current.value
  if (!entry) return ''
  if (entry.core) return t('dailyPractice.core.stepOf', { n: CORE_STEPS.indexOf(coreStep.value) + 1 }) + ' · ' + t(`dailyPractice.core.steps.${coreStep.value}`)
  if (entry.kind === 'mistake') return t('dailyPractice.mistakeReview')
  if (entry.kind === 'bank') return t('dailyPractice.savedWord')
  if (entry.kind === 'listen') return t('listening.label')
  if (entry.kind === 'pattern') return isNew(entry.item.id) ? t('dailyPractice.newPattern') : t('dailyPractice.reviewPattern')
  return isNew(entry.item.id) ? t('dailyPractice.newWord') : t('dailyPractice.reviewWord')
})

// Answer rows: icon + semantic-soft fill, never color alone
const OPTION_CLASS = {
  idle: 'border-hairline bg-surface text-ink active:bg-surface-raised',
  right: 'border-success/40 bg-success-soft text-ink',
  wrong: 'border-error/40 bg-error-soft text-ink',
  other: 'border-hairline bg-surface text-ink-muted',
}
const OPTION_ICON = { idle: 'radio_button_unchecked', right: 'check_circle', wrong: 'cancel', other: 'radio_button_unchecked' }
const OPTION_ICON_CLASS = { idle: 'text-ink-muted', right: 'text-success', wrong: 'text-error', other: 'text-ink-muted' }

function optionState(id) {
  if (picked.value === null) return 'idle'
  if (id === correctOptionId.value) return 'right'
  return id === picked.value ? 'wrong' : 'other'
}
// Header: the core counts 3 steps; the extras count their own items
const headerProgress = computed(() => {
  if (inCore.value || !showExtras.value) {
    const label = inCore.value ? t('dailyPractice.core.progress', { done: coreDoneCount.value }) : t('dailyPractice.core.doneTitle')
    return { done: coreDoneCount.value, total: 3, label }
  }
  return { done: doneCount.value, total: totalCount.value, label: t('dailyPractice.progress', { done: doneCount.value, total: totalCount.value }) }
})

const patternsDone = computed(() => todayPatterns.value.filter(p => isDone(p.id)).length)
const wordsDone = computed(() => todayWords.value.filter(w => isDone(w.id)).length)
const extrasDone = computed(() =>
  todayMistakes.value.filter(m => isDone(mistakeSrsId(m.id))).length
  + todayBankWords.value.filter(w => isDone(bankSrsId(w.id))).length)

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
  <div class="flex h-screen w-full max-w-[100vw] overflow-hidden bg-page">
    <div class="relative flex h-full min-w-0 flex-1 flex-col">
      <!-- Header, level control and progress stay fixed; content scrolls -->
      <CmAppBar
        :title="t('dailyPractice.title')"
        :subtitle="headerProgress.label"
        :back-label="t('dailyPractice.back')"
        @back="handleBack"
      >
        <template #below>
          <div class="px-4 pb-2 min-[375px]:px-5">
            <CmSegmentedControl
              :options="levelOptions"
              :model-value="level"
              :label="t('dailyPractice.levelLabel')"
              @update:model-value="requestLevel"
            />
          </div>
          <CmProgress :value="headerProgress.done" :max="headerProgress.total || 1" :label="headerProgress.label" />
        </template>
      </CmAppBar>

      <div class="flex-1 overflow-y-auto">
        <div class="mx-auto max-w-2xl space-y-3 px-4 py-5 min-[375px]:px-5">
          <!-- ========== CORE STEPS ========== -->
          <ol v-if="inCore" class="core-steps grid grid-cols-3 gap-1.5" :aria-label="t('dailyPractice.core.title')">
            <li
              v-for="(step, i) in CORE_STEPS"
              :key="step"
              class="flex min-w-0 items-start gap-1.5 rounded-[10px] border px-2 py-2"
              :class="coreStepState(step) === 'current' ? 'border-accent/30 bg-accent-soft' : 'border-hairline bg-surface'"
              :aria-current="coreStepState(step) === 'current' ? 'step' : undefined"
            >
              <span
                class="material-symbols-outlined shrink-0 !text-[18px]"
                :class="coreStepState(step) === 'done' ? 'text-success' : coreStepState(step) === 'current' ? 'text-accent' : 'text-ink-muted'"
                aria-hidden="true"
              >{{ coreStepState(step) === 'done' ? 'check_circle' : 'radio_button_unchecked' }}</span>
              <span class="min-w-0 text-meta break-words" :class="coreStepState(step) === 'todo' ? 'text-ink-muted' : 'text-ink'">
                <span class="sr-only">{{ i + 1 }}. {{ t(`dailyPractice.core.steps.${step}`) }}</span>
                <span aria-hidden="true">{{ t(`dailyPractice.core.stepsShort.${step}`) }}</span>
                <span v-if="coreStepState(step) === 'done'" class="sr-only">, {{ t('dailyPractice.core.stepDone') }}</span>
              </span>
            </li>
          </ol>

          <!-- ========== CORE DONE: today counts, extras are optional ========== -->
          <template v-if="!current && !showExtras">
            <section class="core-done flex flex-col items-center gap-3 rounded-[14px] border border-hairline bg-surface p-6 text-center shadow-[var(--cm-shadow-small)]" role="status">
              <span class="flex size-16 items-center justify-center rounded-[14px] bg-success-soft text-success">
                <span class="material-symbols-outlined !text-[32px]" aria-hidden="true">task_alt</span>
              </span>
              <h2 class="text-section font-medium text-ink">{{ t('dailyPractice.core.doneTitle') }}</h2>
              <p class="text-caption text-ink-secondary">{{ t('dailyPractice.core.doneBody') }}</p>
              <p v-if="core?.speakingMode" class="text-caption text-ink-secondary">
                {{ core.speakingMode === 'voice' ? t('dailyPractice.core.doneVoice') : t('dailyPractice.core.doneText') }}
              </p>
            </section>
            <div class="grid grid-cols-1 gap-2 pt-5">
              <CmButton @click="startTaskChat">{{ t('taskChat.startFromPractice') }}</CmButton>
              <CmButton v-if="remainingCount > 0" variant="secondary" class="core-more" @click="showExtras = true">
                {{ t('dailyPractice.core.more', { count: remainingCount }) }}
              </CmButton>
              <CmButton variant="secondary" @click="router.push('/')">{{ t('dailyPractice.backHome') }}</CmButton>
            </div>
          </template>

          <!-- ========== EVERYTHING DONE ========== -->
          <template v-else-if="!current">
            <section class="flex flex-col items-center gap-3 rounded-[14px] border border-hairline bg-surface p-6 text-center shadow-[var(--cm-shadow-small)]">
              <span class="flex size-16 items-center justify-center rounded-[14px] bg-accent-soft text-accent">
                <span class="material-symbols-outlined !text-[32px]" aria-hidden="true">task_alt</span>
              </span>
              <h2 class="text-section font-medium text-ink">{{ t('dailyPractice.doneTitle') }}</h2>
              <p class="text-caption text-ink-secondary tabular-nums">
                {{ t('dailyPractice.doneSummary', { patterns: patternsDone, words: wordsDone }) }}
              </p>
              <p v-if="extrasDone" class="text-caption text-ink-secondary tabular-nums">
                {{ t('dailyPractice.doneExtras', { count: extrasDone }) }}
              </p>
            </section>
            <div class="space-y-2 pt-5">
              <p class="text-caption font-medium text-ink-secondary">{{ t('dailyPractice.useThemHint') }}</p>
              <ul class="flex flex-wrap gap-2">
                <li v-for="p in todayPatterns" :key="p.id" class="max-w-full"><CmChip>{{ p.pattern }}</CmChip></li>
              </ul>
            </div>
            <div class="grid grid-cols-1 gap-2 pt-5 sm:grid-cols-2">
              <CmButton class="sm:col-span-2" @click="startTaskChat">{{ t('taskChat.startFromPractice') }}</CmButton>
              <CmButton variant="secondary" @click="router.push('/daily-opinion')">{{ t('dailyPractice.writeOpinion') }}</CmButton>
              <CmButton variant="secondary" @click="router.push('/')">{{ t('dailyPractice.backHome') }}</CmButton>
            </div>
          </template>

          <template v-else>
            <p class="text-caption font-medium text-ink-secondary">{{ sectionLabel }}</p>

            <!-- ========== MISTAKE / SAVED WORD / LISTENING ========== -->
            <MistakeCard
              v-if="current.kind === 'mistake'"
              :mistake="current.item"
              :removable="current.item.source !== 'builtin'"
              @done="finishCard(current, $event)"
              @remove="dropMistake(current)"
            />
            <CoreSpeakingCard
              v-else-if="current.kind === 'speak'"
              :prompt="current.item"
              :attempt="core?.speakingAttempt || null"
              @submit="submitCoreSpeaking"
              @rate="rateCoreSpeaking"
            />
            <BankWordCard v-else-if="current.kind === 'bank'" :word="current.item" @done="finishCard(current, $event)" />
            <ListeningCard v-else-if="current.kind === 'listen'" :item="current.item" @done="finishCard(current, $event)" />

            <!-- ========== PATTERN ========== -->
            <PracticeCard v-else-if="current.kind === 'pattern'">
              <!-- Study: shown first for new patterns, after the quiz for reviews -->
              <template v-if="stage !== 'quiz' || picked !== null">
                <div class="flex items-start justify-between gap-2">
                  <p class="min-w-0 text-section font-medium text-ink break-words">{{ current.item.pattern }}</p>
                  <CmIconButton icon="volume_up" :label="t('dailyPractice.listen')" class="-mr-2 -mt-2" @click="speak(current.item.examples[0].en)" />
                </div>
                <div class="space-y-1">
                  <p class="text-body font-medium text-ink">{{ current.item.meaning }}</p>
                  <p class="text-caption text-ink-secondary">{{ current.item.when }}</p>
                </div>
                <ul class="space-y-1">
                  <li v-for="(ex, i) in current.item.examples" :key="i">
                    <button type="button" @click="speak(ex.en)" class="flex min-h-11 w-full items-start gap-2 rounded-[10px] py-1 text-left active:bg-surface-raised">
                      <span class="material-symbols-outlined mt-0.5 shrink-0 !text-[18px] text-ink-muted" aria-hidden="true">volume_up</span>
                      <span class="min-w-0">
                        <span class="block text-body text-ink break-words">{{ ex.en }}</span>
                        <span class="block text-caption text-ink-secondary break-words">{{ ex.zh }}</span>
                      </span>
                    </button>
                  </li>
                </ul>
                <div v-if="current.item.mistake" class="space-y-1.5 rounded-[10px] border border-hairline bg-surface-sunken px-3 py-3 text-caption">
                  <p class="flex items-start gap-1.5 text-ink-secondary break-words">
                    <span class="material-symbols-outlined mt-px shrink-0 !text-[18px] text-error" aria-hidden="true">close</span>
                    <span class="min-w-0 line-through decoration-error">{{ current.item.mistake.wrong }}</span>
                  </p>
                  <p class="flex items-start gap-1.5 text-ink break-words">
                    <span class="material-symbols-outlined mt-px shrink-0 !text-[18px] text-success" aria-hidden="true">check</span>
                    <span class="min-w-0">{{ current.item.mistake.right }}</span>
                  </p>
                  <p class="text-ink-secondary">{{ current.item.mistake.why }}</p>
                </div>
                <CmButton v-if="stage === 'learn'" block @click="stage = 'quiz'">{{ t('dailyPractice.startPractice') }}</CmButton>
              </template>

              <!-- Quiz: pick the natural sentence -->
              <div v-if="stage === 'quiz'" class="space-y-2" :class="picked !== null ? 'border-t border-hairline pt-4' : ''">
                <p class="text-body font-medium text-ink">{{ current.item.choice.situation }}</p>
                <div role="radiogroup" :aria-label="current.item.choice.situation" class="space-y-2">
                  <button
                    v-for="opt in quizOptions"
                    :key="opt.id"
                    type="button"
                    role="radio"
                    :aria-checked="opt.id === picked"
                    :aria-disabled="picked !== null"
                    @click="pick(opt.id)"
                    class="flex min-h-12 w-full items-start gap-3 rounded-[10px] border px-3 py-3 text-left text-body break-words"
                    :class="OPTION_CLASS[optionState(opt.id)]"
                  >
                    <span class="material-symbols-outlined mt-0.5 shrink-0" :class="OPTION_ICON_CLASS[optionState(opt.id)]" aria-hidden="true">{{ OPTION_ICON[optionState(opt.id)] }}</span>
                    <span class="min-w-0 flex-1">{{ opt.text }}</span>
                  </button>
                </div>
                <template v-if="picked !== null">
                  <p class="flex items-center gap-1.5 pt-1 text-caption font-medium" :class="isCorrect ? 'text-success' : 'text-error'" role="status">
                    <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">{{ isCorrect ? 'check_circle' : 'info' }}</span>
                    {{ isCorrect ? t('dailyPractice.correct') : t('dailyPractice.notQuite') }}
                  </p>
                  <p class="text-caption text-ink-secondary">{{ current.item.choice.explain }}</p>
                  <CmButton block class="!mt-4" @click="afterQuiz">{{ t('dailyPractice.next') }}</CmButton>
                </template>
              </div>

              <!-- Write your own sentence -->
              <div v-if="stage === 'write' || stage === 'rate'" class="space-y-3 border-t border-hairline pt-4">
                <label for="dp-own-sentence" class="block text-body font-medium text-ink">{{ current.item.task }}</label>
                <textarea
                  id="dp-own-sentence"
                  v-model="sentence"
                  :disabled="stage === 'rate'"
                  rows="3"
                  class="block w-full resize-none rounded-[10px] border border-hairline bg-surface-sunken px-3 py-3 text-base leading-6 text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none disabled:text-ink-secondary"
                  :placeholder="current.item.pattern"
                ></textarea>
                <div v-if="stage === 'write'" class="flex gap-2">
                  <CmButton class="min-w-0 flex-1" :disabled="!sentence.trim() || isChecking" @click="submitSentence">
                    {{ isChecking ? t('dailyPractice.checking') : t('dailyPractice.check') }}
                  </CmButton>
                  <CmButton variant="secondary" class="shrink-0" @click="skipWriting">{{ t('dailyPractice.skip') }}</CmButton>
                </div>

                <!-- AI friend's check -->
                <div v-if="check" class="space-y-2 rounded-[10px] border border-hairline bg-surface-sunken px-3 py-3 text-caption" role="status">
                  <p class="flex items-center gap-1.5 font-medium" :class="check.usedPattern ? 'text-success' : 'text-warning'">
                    <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">{{ check.usedPattern ? 'check_circle' : 'info' }}</span>
                    {{ check.usedPattern ? t('dailyPractice.usedPattern') : t('dailyPractice.missedPattern') }}
                  </p>
                  <p class="text-ink break-words">{{ check.comment }}</p>
                  <p v-if="check.corrected && check.corrected.trim() !== sentence.trim()" class="break-words">
                    <span class="text-ink-muted">{{ t('dailyPractice.corrected') }}</span>
                    <span class="text-ink">{{ check.corrected }}</span>
                  </p>
                  <button v-if="check.better" type="button" @click="speak(check.better)" class="block min-h-11 w-full text-left break-words">
                    <span class="text-ink-muted">{{ t('dailyPractice.better') }}</span>
                    <span class="text-accent">{{ check.better }}</span>
                  </button>
                </div>
                <p v-else-if="checkFailed" class="text-caption text-ink-secondary">
                  {{ localUsedPattern ? t('dailyPractice.usedPattern') : t('dailyPractice.missedPattern') }}
                  {{ t('dailyPractice.checkUnavailable') }}
                </p>
              </div>

              <PracticeRating v-if="stage === 'rate'" class="border-t border-hairline pt-4" @rate="rate" />
            </PracticeCard>

            <!-- ========== WORD ========== -->
            <PracticeCard v-else-if="current.kind === 'word'">
              <!-- Quiz: meaning → word -->
              <div v-if="stage === 'quiz'" class="space-y-2">
                <p class="text-title font-medium text-ink">{{ current.item.meaning }}</p>
                <div role="radiogroup" :aria-label="current.item.meaning" class="space-y-2">
                  <button
                    v-for="opt in quizOptions"
                    :key="opt.id"
                    type="button"
                    role="radio"
                    :aria-checked="opt.id === picked"
                    :aria-disabled="picked !== null"
                    @click="pick(opt.id)"
                    class="flex min-h-12 w-full items-center gap-3 rounded-[10px] border px-3 py-2.5 text-left text-body break-words"
                    :class="OPTION_CLASS[optionState(opt.id)]"
                  >
                    <span class="material-symbols-outlined shrink-0" :class="OPTION_ICON_CLASS[optionState(opt.id)]" aria-hidden="true">{{ OPTION_ICON[optionState(opt.id)] }}</span>
                    <span class="min-w-0 flex-1">{{ opt.text }}</span>
                  </button>
                </div>
              </div>

              <!-- Word card: first for new words, after answering for reviews -->
              <div v-if="stage !== 'quiz' || picked !== null" class="space-y-3" :class="stage === 'quiz' ? 'border-t border-hairline pt-4' : ''">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="text-section font-medium text-ink break-words">{{ current.item.word }}</p>
                    <p class="text-meta text-ink-muted">{{ current.item.pos }} {{ current.item.phonetic }}</p>
                  </div>
                  <CmIconButton icon="volume_up" :label="t('dailyPractice.listen')" class="-mr-2 -mt-1" @click="speak(current.item.word)" />
                </div>
                <p class="text-body font-medium text-ink">{{ current.item.meaning }}</p>
                <button type="button" @click="speak(current.item.example.en)" class="flex min-h-11 w-full items-start gap-2 rounded-[10px] py-1 text-left active:bg-surface-raised">
                  <span class="material-symbols-outlined mt-0.5 shrink-0 !text-[18px] text-ink-muted" aria-hidden="true">volume_up</span>
                  <span class="min-w-0">
                    <span class="block text-body text-ink break-words">{{ current.item.example.en }}</span>
                    <span class="block text-caption text-ink-secondary break-words">{{ current.item.example.zh }}</span>
                  </span>
                </button>
                <ul v-if="current.item.collocations?.length" class="flex flex-wrap gap-2">
                  <li v-for="c in current.item.collocations" :key="c" class="max-w-full"><CmChip>{{ c }}</CmChip></li>
                </ul>
                <p v-if="current.item.note" class="text-caption text-ink-secondary">{{ current.item.note }}</p>
                <CmButton v-if="stage === 'learn'" block @click="stage = 'quiz'">{{ t('dailyPractice.startPractice') }}</CmButton>
                <CmButton v-else-if="stage === 'quiz' && picked !== null" block @click="afterQuiz">{{ t('dailyPractice.next') }}</CmButton>
              </div>

              <PracticeRating v-if="stage === 'rate'" class="border-t border-hairline pt-4" @rate="rate" />
            </PracticeCard>
          </template>
        </div>
      </div>
    </div>

    <!-- Changing level while answering replaces today's plan: confirm first -->
    <CmBottomSheet
      v-if="pendingLevel"
      :title="t('dailyPractice.levelChangeTitle')"
      :description="t('dailyPractice.levelChangeBody')"
      :close-label="t('common.cancel')"
      @close="pendingLevel = null"
    >
      <template #actions>
        <div class="grid grid-cols-2 gap-2">
          <CmButton variant="secondary" @click="pendingLevel = null">{{ t('common.cancel') }}</CmButton>
          <CmButton @click="confirmLevel">{{ t('dailyPractice.levelChangeConfirm') }}</CmButton>
        </div>
      </template>
    </CmBottomSheet>
  </div>
</template>
