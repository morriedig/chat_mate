<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useMotherTongue } from '../composables/useMotherTongue'
import { useDailyGoal } from '../composables/useDailyGoal'
import { useRetell, getRetellTopic, countWords, wordsPerMinute, PLAN_SECONDS, ROUND_SECONDS } from '../composables/useRetell'
import { listenOnce, stopListening, isSTTAvailable } from '../utils/stt'
import CmAppBar from './ui/CmAppBar.vue'
import CmButton from './ui/CmButton.vue'
import CmProgress from './ui/CmProgress.vue'
import PracticeCard from './practice/PracticeCard.vue'

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
  <div class="flex h-screen w-full max-w-[100vw] overflow-hidden bg-page">
    <div class="relative flex h-full min-w-0 flex-1 flex-col">
      <CmAppBar
        :title="t('retell.title')"
        :subtitle="t('retell.subtitle')"
        :back-label="t('retell.back')"
        @back="handleBack"
      />

      <div class="flex-1 overflow-y-auto">
        <div class="mx-auto max-w-2xl space-y-4 px-4 py-5 min-[375px]:px-5">
          <!-- Topic (hero) with the drill sequence on one line -->
          <PracticeCard>
            <div class="space-y-1">
              <p class="text-caption font-medium text-ink-secondary">{{ t('retell.topicLabel') }}</p>
              <p class="text-section font-medium text-ink break-words">{{ topic.en }}</p>
              <p v-if="nativeTopic" class="text-caption text-ink-secondary break-words">{{ nativeTopic }}</p>
            </div>
            <p class="text-meta text-ink-muted tabular-nums">
              {{ t('retell.sequence', { plan: PLAN_SECONDS, a: ROUND_SECONDS[0], b: ROUND_SECONDS[1], c: ROUND_SECONDS[2] }) }}
            </p>
          </PracticeCard>

          <!-- ========== PICK ========== -->
          <template v-if="stage === 'pick'">
            <section class="space-y-2 px-1">
              <h2 class="text-caption font-medium text-ink-secondary">{{ t('retell.howTitle') }}</h2>
              <ol class="space-y-2 text-caption text-ink">
                <li class="flex gap-3">
                  <span class="flex size-6 shrink-0 items-center justify-center rounded-[6px] border border-hairline bg-surface text-meta tabular-nums text-ink-secondary">1</span>
                  <span class="min-w-0">{{ t('retell.howPlan', { sec: PLAN_SECONDS }) }}</span>
                </li>
                <li class="flex gap-3">
                  <span class="flex size-6 shrink-0 items-center justify-center rounded-[6px] border border-hairline bg-surface text-meta tabular-nums text-ink-secondary">2</span>
                  <span class="min-w-0">{{ t('retell.howRounds', { a: ROUND_SECONDS[0], b: ROUND_SECONDS[1], c: ROUND_SECONDS[2] }) }}</span>
                </li>
                <li class="flex gap-3">
                  <span class="flex size-6 shrink-0 items-center justify-center rounded-[6px] border border-hairline bg-surface text-meta tabular-nums text-ink-secondary">3</span>
                  <span class="min-w-0 text-ink-secondary">{{ t('retell.howWhy') }}</span>
                </li>
              </ol>
            </section>
            <p v-if="!canListen" class="flex items-start gap-1.5 rounded-[10px] bg-warning-soft px-3 py-2 text-caption text-warning">
              <span class="material-symbols-outlined mt-px shrink-0 !text-[18px]" aria-hidden="true">mic_off</span>
              <span class="min-w-0">{{ t('retell.noMic') }}</span>
            </p>
            <div class="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
              <CmButton class="start-plan" @click="startPlanning">{{ t('retell.start') }}</CmButton>
              <CmButton variant="secondary" @click="topicOffset += 1">{{ t('retell.otherTopic') }}</CmButton>
            </div>
          </template>

          <!-- ========== PLAN ========== -->
          <template v-else-if="stage === 'plan'">
            <div class="flex items-end justify-between gap-3">
              <div class="min-w-0">
                <p class="text-title font-medium text-ink">{{ t('retell.planTitle') }}</p>
                <p class="text-caption text-ink-secondary">{{ t('retell.planHint') }}</p>
              </div>
              <span class="shrink-0 text-display font-medium tabular-nums text-accent" role="timer" aria-live="off">{{ clock(secondsLeft) }}</span>
            </div>
            <textarea
              v-model="notes"
              rows="4"
              :placeholder="t('retell.notesPlaceholder')"
              :aria-label="t('retell.notesPlaceholder')"
              class="block w-full resize-none rounded-[10px] border border-hairline bg-surface-sunken px-3 py-3 text-base leading-6 text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
            ></textarea>
            <CmButton block class="skip-plan" @click="startRound">{{ t('retell.readyNow') }}</CmButton>
          </template>

          <!-- ========== ROUND ========== -->
          <template v-else-if="stage === 'round'">
            <div class="space-y-2">
              <div class="flex items-end justify-between gap-3">
                <p class="min-w-0 text-title font-medium text-ink tabular-nums">{{ t('retell.roundTitle', { n: roundIndex + 1, total: ROUND_SECONDS.length }) }}</p>
                <span class="shrink-0 text-display font-medium tabular-nums" :class="secondsLeft <= 10 ? 'text-error' : 'text-accent'" role="timer" aria-live="off">{{ clock(secondsLeft) }}</span>
              </div>
              <CmProgress :value="secondsLeft" :max="roundLimit" :label="t('retell.timeLeft')" />
            </div>
            <p class="text-caption text-ink-secondary">{{ roundIndex === 0 ? t('retell.roundHintFirst') : t('retell.roundHintAgain') }}</p>
            <p v-if="notes" class="whitespace-pre-wrap break-words rounded-[10px] border border-hairline bg-surface-sunken px-3 py-2 text-caption text-ink-secondary">{{ notes }}</p>

            <template v-if="canListen && !micError">
              <div class="min-h-24 break-words rounded-[14px] border border-hairline bg-surface p-4 text-body text-ink" aria-live="polite">
                <span v-if="liveText">{{ liveText }}</span>
                <span v-else class="text-ink-muted">{{ t('retell.speakNow') }}</span>
              </div>
              <!-- Static status dot: no pulse -->
              <p class="flex items-center gap-2 text-caption" :class="listening ? 'text-error' : 'text-ink-muted'" role="status">
                <span class="size-2 shrink-0 rounded-full" :class="listening ? 'bg-error' : 'bg-ink-muted'" aria-hidden="true"></span>
                {{ listening ? t('retell.listening') : t('retell.paused') }}
              </p>
            </template>
            <template v-else>
              <p v-if="micError" class="flex items-start gap-1.5 rounded-[10px] bg-warning-soft px-3 py-2 text-caption text-warning" role="alert">
                <span class="material-symbols-outlined mt-px shrink-0 !text-[18px]" aria-hidden="true">mic_off</span>
                <span class="min-w-0">{{ micError }}</span>
              </p>
              <textarea
                v-model="typed"
                rows="5"
                :placeholder="t('retell.typePlaceholder')"
                :aria-label="t('retell.typePlaceholder')"
                class="block w-full resize-none rounded-[10px] border border-hairline bg-surface-sunken px-3 py-3 text-base leading-6 text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
              ></textarea>
            </template>
            <CmButton block class="finish-round" @click="finishRound">{{ t('retell.done') }}</CmButton>
          </template>

          <!-- ========== BETWEEN ROUNDS ========== -->
          <template v-else-if="stage === 'between' && lastRound">
            <section class="space-y-1 rounded-[14px] border border-hairline bg-surface p-5 text-center shadow-[var(--cm-shadow-small)]">
              <p class="text-caption text-ink-secondary">{{ t('retell.roundDone', { n: rounds.length }) }}</p>
              <p class="text-display font-medium text-ink tabular-nums">{{ t('retell.wpm', { wpm: lastRound.wpm }) }}</p>
              <p class="text-meta text-ink-muted tabular-nums">{{ t('retell.stats', { words: lastRound.words, sec: lastRound.seconds }) }}</p>
            </section>
            <p class="text-body text-ink">{{ t('retell.nextHint', { sec: ROUND_SECONDS[roundIndex + 1] }) }}</p>
            <CmButton block class="next-round" @click="nextRound">{{ t('retell.nextRound', { n: rounds.length + 1 }) }}</CmButton>
          </template>

          <!-- ========== RESULT ========== -->
          <template v-else-if="stage === 'result'">
            <section class="space-y-4 rounded-[14px] border border-hairline bg-surface p-5 shadow-[var(--cm-shadow-small)]">
              <h2 class="text-title font-medium text-ink">{{ improved ? t('retell.resultImproved') : t('retell.resultSteady') }}</h2>
              <ul class="space-y-3">
                <li v-for="(r, i) in rounds" :key="i" class="space-y-1.5">
                  <div class="flex justify-between gap-2 text-caption">
                    <span class="text-ink-secondary">{{ t('retell.roundShort', { n: i + 1, sec: ROUND_SECONDS[i] }) }}</span>
                    <span class="font-medium text-ink tabular-nums">{{ t('retell.wpm', { wpm: r.wpm }) }}</span>
                  </div>
                  <div class="h-2 overflow-hidden rounded-[2px] bg-surface-raised" aria-hidden="true">
                    <div class="h-full w-full origin-left rounded-r-[2px]" :class="i === rounds.length - 1 ? 'bg-accent' : 'bg-accent-disabled'" :style="{ transform: `scaleX(${r.wpm / maxWpm})` }"></div>
                  </div>
                </li>
              </ul>
              <p class="text-meta text-ink-muted">{{ t('retell.wpmNote') }}</p>
              <p v-if="xpEarned" class="text-caption font-medium text-accent tabular-nums">+{{ xpEarned }} XP</p>
            </section>
            <details class="group rounded-[14px] border border-hairline bg-surface">
              <summary class="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 px-4 text-body font-medium text-ink [&::-webkit-details-marker]:hidden">
                {{ t('retell.showTranscripts') }}
                <span class="material-symbols-outlined text-ink-muted transition-transform duration-[180ms] group-open:rotate-180" aria-hidden="true">expand_more</span>
              </summary>
              <div class="space-y-3 border-t border-hairline px-4 py-3">
                <div v-for="(r, i) in rounds" :key="i">
                  <p class="text-meta text-ink-muted">{{ t('retell.roundShort', { n: i + 1, sec: ROUND_SECONDS[i] }) }}</p>
                  <p class="text-body text-ink break-words">{{ r.text || '—' }}</p>
                </div>
              </div>
            </details>
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <CmButton @click="restart">{{ t('retell.again') }}</CmButton>
              <CmButton variant="secondary" @click="handleBack">{{ t('retell.home') }}</CmButton>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
