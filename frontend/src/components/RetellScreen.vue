<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useMotherTongue } from '../composables/useMotherTongue'
import { useDailyGoal } from '../composables/useDailyGoal'
import { useRetell, getRetellTopic, countWords, wordsPerMinute, PLAN_SECONDS, ROUND_SECONDS } from '../composables/useRetell'
import { listenOnce, stopListening, isSTTAvailable } from '../utils/stt'

const { t } = useI18n()
const router = useRouter()
const { motherTongue } = useMotherTongue()
const { startTimer, stopTimer } = useDailyGoal()
const { saveResult } = useRetell()

const canListen = isSTTAvailable()

// 'pick' → 'plan' → 'round' → 'between' → … → 'result'
const stage = ref('pick')
const topicOffset = ref(0)
const topic = computed(() => getRetellTopic(topicOffset.value))
const nativeTopic = computed(() => (motherTongue.value !== 'en' && topic.value[motherTongue.value]) || '')

const notes = ref('')
const secondsLeft = ref(0)
const roundIndex = ref(0)
const rounds = ref([])
const transcript = ref('')
const interim = ref('')
const typed = ref('')
const listening = ref(false)
const micError = ref('')
const xpEarned = ref(0)

let ticker = null
let roundStartedAt = 0
let roundActive = false

const roundLimit = computed(() => ROUND_SECONDS[roundIndex.value])
const liveText = computed(() => [transcript.value, interim.value].filter(Boolean).join(' '))
const lastRound = computed(() => rounds.value[rounds.value.length - 1] || null)
const maxWpm = computed(() => Math.max(1, ...rounds.value.map(r => r.wpm)))
const improved = computed(() => rounds.value.length === 3 && rounds.value[2].wpm > rounds.value[0].wpm)

function clock(seconds) {
  const s = Math.max(0, seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function countdown(seconds, onEnd) {
  clearInterval(ticker)
  secondsLeft.value = seconds
  ticker = setInterval(() => {
    secondsLeft.value -= 1
    if (secondsLeft.value <= 0) {
      clearInterval(ticker)
      onEnd()
    }
  }, 1000)
}

function startPlanning() {
  stage.value = 'plan'
  startTimer()
  countdown(PLAN_SECONDS, startRound)
}

// Keep listening for the whole round: each utterance is added, then we listen again
async function listenLoop() {
  while (roundActive) {
    listening.value = true
    try {
      const remaining = roundLimit.value * 1000 - (Date.now() - roundStartedAt)
      if (remaining < 500) break
      const text = await listenOnce({ language: 'en', onInterim: s => { interim.value = s }, maxMs: remaining })
      if (text) transcript.value = [transcript.value, text].filter(Boolean).join(' ')
      interim.value = ''
    } catch (e) {
      micError.value = e.message === 'not-allowed' ? t('voiceChat.micBlocked') : t('retell.micFailed')
      break
    }
  }
  listening.value = false
}

function startRound() {
  clearInterval(ticker)
  stage.value = 'round'
  transcript.value = ''
  interim.value = ''
  typed.value = ''
  micError.value = ''
  roundStartedAt = Date.now()
  roundActive = true
  countdown(roundLimit.value, finishRound)
  if (canListen) listenLoop()
}

function finishRound() {
  if (!roundActive) return
  roundActive = false
  clearInterval(ticker)
  stopListening()
  // At least 10s, so ending a round right away doesn't produce an absurd pace
  const seconds = Math.min(roundLimit.value, Math.max(10, Math.round((Date.now() - roundStartedAt) / 1000)))
  const text = canListen && !micError.value ? liveText.value : typed.value || liveText.value
  const words = countWords(text)
  rounds.value.push({ words, seconds, wpm: wordsPerMinute(words, seconds), text })
  interim.value = ''
  if (rounds.value.length === ROUND_SECONDS.length) {
    stopTimer()
    xpEarned.value = saveResult(topic.value.id, rounds.value).xpEarned
    stage.value = 'result'
  } else {
    stage.value = 'between'
  }
}

function nextRound() {
  roundIndex.value += 1
  startRound()
}

function restart() {
  rounds.value = []
  roundIndex.value = 0
  notes.value = ''
  xpEarned.value = 0
  stage.value = 'pick'
}

function handleBack() {
  roundActive = false
  clearInterval(ticker)
  stopListening()
  stopTimer()
  router.push('/')
}

onBeforeUnmount(() => {
  roundActive = false
  clearInterval(ticker)
  stopListening()
  stopTimer()
})
</script>

<template>
  <div class="flex h-screen w-full max-w-[100vw] overflow-hidden">
    <div class="flex flex-1 min-w-0 flex-col h-full relative bg-background-light dark:bg-background-dark">
      <!-- Header -->
      <header class="flex items-center border-b border-[#e7eff3] dark:border-slate-800 px-3 sm:px-6 py-3 sm:py-4 bg-surface-light dark:bg-surface-dark z-10 shadow-sm safe-area-top">
        <div class="flex items-center gap-2 sm:gap-3 text-text-main dark:text-white min-w-0">
          <button @click="handleBack" class="flex items-center justify-center shrink-0" :aria-label="t('retell.back')">
            <span class="material-symbols-outlined cursor-pointer">arrow_back</span>
          </button>
          <div class="flex flex-col min-w-0">
            <h2 class="text-sm sm:text-base font-bold leading-tight truncate">{{ t('retell.title') }}</h2>
            <span class="text-xs text-text-muted dark:text-slate-400 truncate">{{ t('retell.subtitle') }}</span>
          </div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto">
        <div class="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-4">
          <!-- Topic -->
          <div class="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm">
            <p class="text-xs font-semibold text-primary mb-1">{{ t('retell.topicLabel') }}</p>
            <p class="text-lg font-bold text-text-main dark:text-white leading-snug">{{ topic.en }}</p>
            <p v-if="nativeTopic" class="text-sm text-text-muted dark:text-slate-400 mt-1">{{ nativeTopic }}</p>
          </div>

          <!-- ========== PICK ========== -->
          <template v-if="stage === 'pick'">
            <div class="p-4 rounded-2xl bg-primary/5 dark:bg-primary/10 text-sm text-text-main dark:text-slate-200 space-y-2">
              <p class="font-semibold">{{ t('retell.howTitle') }}</p>
              <ol class="list-decimal pl-5 space-y-1 text-text-muted dark:text-slate-300">
                <li>{{ t('retell.howPlan', { sec: PLAN_SECONDS }) }}</li>
                <li>{{ t('retell.howRounds', { a: ROUND_SECONDS[0], b: ROUND_SECONDS[1], c: ROUND_SECONDS[2] }) }}</li>
                <li>{{ t('retell.howWhy') }}</li>
              </ol>
            </div>
            <p v-if="!canListen" class="text-xs text-amber-700 dark:text-amber-300">{{ t('retell.noMic') }}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button @click="startPlanning" class="start-plan py-3 rounded-xl bg-primary text-white font-semibold">{{ t('retell.start') }}</button>
              <button @click="topicOffset += 1" class="py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-text-main dark:text-slate-200 font-semibold">{{ t('retell.otherTopic') }}</button>
            </div>
          </template>

          <!-- ========== PLAN ========== -->
          <template v-else-if="stage === 'plan'">
            <div class="flex items-center justify-between gap-3">
              <p class="text-sm font-semibold text-text-main dark:text-white min-w-0">{{ t('retell.planTitle') }}</p>
              <span class="shrink-0 text-2xl font-bold tabular-nums text-primary">{{ clock(secondsLeft) }}</span>
            </div>
            <p class="text-sm text-text-muted dark:text-slate-400">{{ t('retell.planHint') }}</p>
            <textarea
              v-model="notes"
              rows="4"
              :placeholder="t('retell.notesPlaceholder')"
              class="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark text-text-main dark:text-white px-4 py-3 text-base focus:border-primary focus:ring-1 focus:ring-primary"
            ></textarea>
            <button @click="startRound" class="skip-plan w-full py-3 rounded-xl bg-primary text-white font-semibold">{{ t('retell.readyNow') }}</button>
          </template>

          <!-- ========== ROUND ========== -->
          <template v-else-if="stage === 'round'">
            <div class="flex items-center justify-between gap-3">
              <p class="text-sm font-semibold text-text-main dark:text-white min-w-0">{{ t('retell.roundTitle', { n: roundIndex + 1, total: ROUND_SECONDS.length }) }}</p>
              <span class="shrink-0 text-2xl font-bold tabular-nums" :class="secondsLeft <= 10 ? 'text-red-500' : 'text-primary'">{{ clock(secondsLeft) }}</span>
            </div>
            <div class="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div class="h-full bg-primary transition-all duration-1000" :style="{ width: `${(secondsLeft / roundLimit) * 100}%` }"></div>
            </div>
            <p class="text-sm text-text-muted dark:text-slate-400">{{ roundIndex === 0 ? t('retell.roundHintFirst') : t('retell.roundHintAgain') }}</p>
            <p v-if="notes" class="text-xs text-text-muted dark:text-slate-400 whitespace-pre-wrap break-words px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">{{ notes }}</p>

            <template v-if="canListen && !micError">
              <div class="min-h-[6rem] p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800 text-text-main dark:text-slate-200 break-words">
                <span v-if="liveText">{{ liveText }}</span>
                <span v-else class="text-text-muted dark:text-slate-500">{{ t('retell.speakNow') }}</span>
              </div>
              <p class="flex items-center gap-1.5 text-xs text-red-500">
                <span class="size-2 rounded-full bg-red-500" :class="listening ? 'animate-pulse' : 'opacity-30'"></span>
                {{ listening ? t('retell.listening') : t('retell.paused') }}
              </p>
            </template>
            <template v-else>
              <p v-if="micError" class="text-xs text-amber-700 dark:text-amber-300">{{ micError }}</p>
              <textarea
                v-model="typed"
                rows="5"
                :placeholder="t('retell.typePlaceholder')"
                class="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark text-text-main dark:text-white px-4 py-3 text-base focus:border-primary focus:ring-1 focus:ring-primary"
              ></textarea>
            </template>
            <button @click="finishRound" class="finish-round w-full py-3 rounded-xl bg-primary text-white font-semibold">{{ t('retell.done') }}</button>
          </template>

          <!-- ========== BETWEEN ROUNDS ========== -->
          <template v-else-if="stage === 'between' && lastRound">
            <div class="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm text-center space-y-1">
              <p class="text-sm text-text-muted dark:text-slate-400">{{ t('retell.roundDone', { n: rounds.length }) }}</p>
              <p class="text-3xl font-bold text-text-main dark:text-white">{{ t('retell.wpm', { wpm: lastRound.wpm }) }}</p>
              <p class="text-xs text-text-muted dark:text-slate-400">{{ t('retell.stats', { words: lastRound.words, sec: lastRound.seconds }) }}</p>
            </div>
            <p class="text-sm text-text-main dark:text-slate-200">{{ t('retell.nextHint', { sec: ROUND_SECONDS[roundIndex + 1] }) }}</p>
            <button @click="nextRound" class="next-round w-full py-3 rounded-xl bg-primary text-white font-semibold">{{ t('retell.nextRound', { n: rounds.length + 1 }) }}</button>
          </template>

          <!-- ========== RESULT ========== -->
          <template v-else-if="stage === 'result'">
            <div class="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
              <p class="text-lg font-bold text-text-main dark:text-white">{{ improved ? t('retell.resultImproved') : t('retell.resultSteady') }}</p>
              <div v-for="(r, i) in rounds" :key="i" class="space-y-1">
                <div class="flex justify-between gap-2 text-xs text-text-muted dark:text-slate-400">
                  <span>{{ t('retell.roundShort', { n: i + 1, sec: ROUND_SECONDS[i] }) }}</span>
                  <span class="font-semibold text-text-main dark:text-slate-200">{{ t('retell.wpm', { wpm: r.wpm }) }}</span>
                </div>
                <div class="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div class="h-full rounded-full bg-primary" :style="{ width: `${(r.wpm / maxWpm) * 100}%` }"></div>
                </div>
              </div>
              <p class="text-xs text-text-muted dark:text-slate-400">{{ t('retell.wpmNote') }}</p>
              <p v-if="xpEarned" class="text-sm font-semibold text-primary">+{{ xpEarned }} XP</p>
            </div>
            <details class="rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800 p-4">
              <summary class="text-sm font-semibold text-text-main dark:text-white cursor-pointer">{{ t('retell.showTranscripts') }}</summary>
              <div v-for="(r, i) in rounds" :key="i" class="mt-3">
                <p class="text-xs font-semibold text-text-muted dark:text-slate-400">{{ t('retell.roundShort', { n: i + 1, sec: ROUND_SECONDS[i] }) }}</p>
                <p class="text-sm text-text-main dark:text-slate-200 break-words">{{ r.text || '—' }}</p>
              </div>
            </details>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button @click="restart" class="py-3 rounded-xl bg-primary text-white font-semibold">{{ t('retell.again') }}</button>
              <button @click="handleBack" class="py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-text-main dark:text-slate-200 font-semibold">{{ t('retell.home') }}</button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
