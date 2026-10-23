<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useNavState } from '../composables/useNavState'
import { useMotherTongue } from '../composables/useMotherTongue'
import { useDarkMode } from '../composables/useDarkMode'
import { useDailyGoal } from '../composables/useDailyGoal'
import { useOnlineStatus } from '../composables/useOnlineStatus'
import { useVocabularyBank } from '../composables/useVocabularyBank'
import { useDailyOpinion, getConnectorInfo } from '../composables/useDailyOpinion'
import { SCAFFOLD_STEPS } from '../data/dailyOpinion'
import { characters } from '../data/characters'
import { detectConnectors, segmentByConnectors } from '../utils/connectorDetect'
import { analyzeStructure, splitSentences, pickBestSentence } from '../utils/opinionStructure'
import DiaryFeedback from './diary/DiaryFeedback.vue'

const { t } = useI18n()
const router = useRouter()
const { isDark, toggle: toggleDark } = useDarkMode()
const { selectedCharacter } = useNavState()
const { motherTongue } = useMotherTongue()
const { startTimer, stopTimer } = useDailyGoal()
const { isOnline } = useOnlineStatus()
const { addWord, hasWord } = useVocabularyBank()

const {
  question,
  connectorIds,
  todayRecord,
  isDoneToday,
  streak,
  isLoadingFeedback,
  refreshDay,
  saveDraft,
  submitAnswer,
  startRewrite,
  cancelRewrite,
  retryFeedback,
  processPending,
  markSentenceSaved,
} = useDailyOpinion()

const character = computed(() => selectedCharacter.value || characters[0])
const mt = computed(() => motherTongue.value || 'en')

const questionGloss = computed(() => (mt.value === 'en' ? '' : question.value[mt.value]))
const targets = computed(() => connectorIds.value.map(id => getConnectorInfo(id, mt.value)))

// Write mode when today isn't done yet, or the user chose to rewrite
const isWriting = computed(() => !isDoneToday.value || !!todayRecord.value?.rewriting)

// ---------- Editor ----------
const body = ref('')
const textareaRef = ref(null)
const submitting = ref(false)

const wordCount = computed(() => body.value.trim().split(/\s+/).filter(Boolean).length)
const canSubmit = computed(() => body.value.trim().length > 0 && !submitting.value)

// Live checks while typing
const liveTargetsUsed = computed(() => detectConnectors(body.value, connectorIds.value))
const liveStructure = computed(() => analyzeStructure(body.value))
const liveSegments = computed(() => segmentByConnectors(body.value))
const hasLiveHighlights = computed(() => liveSegments.value.some(s => s.id))

let draftTimer = null
watch(body, (val) => {
  clearTimeout(draftTimer)
  draftTimer = setTimeout(() => saveDraft(val), 500)
  autoGrow()
})

function autoGrow() {
  nextTick(() => {
    const el = textareaRef.value
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, window.innerHeight * 0.5) + 'px'
  })
}

function insertStarter(text) {
  const sep = body.value && !/\s$/.test(body.value) ? ' ' : ''
  body.value = body.value + sep + text.replace(/…$/, ' ')
  nextTick(() => {
    const el = textareaRef.value
    if (!el) return
    el.focus()
    el.selectionStart = el.selectionEnd = el.value.length
  })
}

// ---------- Speech-to-text (same approach as DiaryEditor / ChatInput) ----------
const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
const speechSupported = !!SpeechRecognition
const isListening = ref(false)
let recognition = null

function toggleSpeech() {
  if (isListening.value) stopSpeech()
  else startSpeech()
}

function startSpeech() {
  if (!SpeechRecognition || isListening.value) return
  recognition = new SpeechRecognition()
  recognition.lang = 'en-US' // answers are always in English
  recognition.interimResults = true
  recognition.continuous = false

  let finalTranscript = body.value && !/\s$/.test(body.value) ? body.value + ' ' : body.value

  recognition.onresult = (event) => {
    let interim = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript
      else interim += event.results[i][0].transcript
    }
    body.value = finalTranscript + interim
  }
  recognition.onend = () => {
    isListening.value = false
    recognition = null
  }
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error)
    isListening.value = false
    recognition = null
  }
  recognition.start()
  isListening.value = true
}

function stopSpeech() {
  if (recognition) recognition.stop()
  isListening.value = false
}

async function handleSubmit() {
  if (!canSubmit.value) return
  stopSpeech()
  clearTimeout(draftTimer)
  submitting.value = true
  try {
    await submitAnswer(body.value, {
      characterId: character.value.id,
      nativeLanguage: mt.value,
      level: 'intermediate',
    })
    selectedSentence.value = null
  } finally {
    submitting.value = false
  }
}

function handleRewrite() {
  startRewrite()
  body.value = todayRecord.value?.answer || ''
  autoGrow()
}

function handleCancelRewrite() {
  cancelRewrite()
  body.value = ''
}

// ---------- Result (local section) ----------
const answer = computed(() => todayRecord.value?.answer || '')
const resultSegments = computed(() => segmentByConnectors(answer.value))
const resultTargets = computed(() =>
  (todayRecord.value?.connectorIds || connectorIds.value).map(id => ({
    ...getConnectorInfo(id, mt.value),
    used: (todayRecord.value?.usedTargets || []).includes(id),
  }))
)
const otherConnectorsUsed = computed(() => {
  const targetSet = new Set(todayRecord.value?.connectorIds || [])
  return (todayRecord.value?.usedAll || [])
    .filter(id => !targetSet.has(id))
    .map(id => getConnectorInfo(id, mt.value))
})
const structure = computed(() => todayRecord.value?.structure || { opinion: false, reason: false, wrapUp: false })
const structureCount = computed(() => SCAFFOLD_STEPS.filter(s => structure.value[s.key]).length)

const sentences = computed(() => splitSentences(answer.value))
const selectedSentence = ref(null)
const bestSentence = computed(() => pickBestSentence(answer.value, todayRecord.value?.connectorIds || []))
const sentenceToSave = computed(() => selectedSentence.value || bestSentence.value)
const sentenceSaved = computed(() =>
  !!sentenceToSave.value && (hasWord(sentenceToSave.value) || (todayRecord.value?.savedSentences || []).includes(sentenceToSave.value))
)

function handleSaveSentence() {
  const s = sentenceToSave.value
  if (!s || sentenceSaved.value) return
  const used = detectConnectors(s).map(id => getConnectorInfo(id, mt.value).word)
  const added = addWord({
    word: s,
    translation: used.length ? used.join(' · ') : t('dailyOpinion.title'),
    context: question.value.en,
    source: 'dailyOpinion',
  })
  if (added || hasWord(s)) markSentenceSaved(s)
}

// Feedback status helpers
const feedbackStatus = computed(() => todayRecord.value?.feedbackStatus || 'none')
const feedbackLoading = computed(() => feedbackStatus.value === 'loading' || isLoadingFeedback.value)

// Friendly line built from local detection, shown above the AI feedback
const localCheer = computed(() => {
  const used = resultTargets.value.filter(c => c.used).map(c => c.word)
  if (used.length === 2) return t('dailyOpinion.cheerBoth', { a: used[0], b: used[1] })
  if (used.length === 1) return t('dailyOpinion.cheerOne', { a: used[0] })
  if (otherConnectorsUsed.value.length) return t('dailyOpinion.cheerOther', { a: otherConnectorsUsed.value[0].word })
  return t('dailyOpinion.cheerNone')
})

// ---------- Lifecycle ----------
onMounted(() => {
  startTimer()
  refreshDay()
  body.value = todayRecord.value?.draft || ''
  autoGrow()

  // A request interrupted by leaving the page leaves 'loading' behind — retry it
  if (feedbackStatus.value === 'loading' && !isLoadingFeedback.value) retryFeedback()
  else if (feedbackStatus.value === 'pending' && isOnline.value) processPending()
})

onBeforeUnmount(() => {
  stopTimer()
  stopSpeech()
  clearTimeout(draftTimer)
  if (isWriting.value) saveDraft(body.value)
})

function handleBack() {
  router.push('/')
}
</script>

<template>
  <div class="flex h-screen w-full max-w-[100vw] overflow-hidden">
    <div class="flex flex-1 flex-col h-full relative bg-background-light dark:bg-background-dark">
      <!-- Header -->
      <header class="flex items-center justify-between border-b border-[#e7eff3] dark:border-slate-800 px-3 sm:px-6 py-3 sm:py-4 bg-surface-light dark:bg-surface-dark z-10 shadow-sm overflow-hidden safe-area-top">
        <div class="flex items-center gap-2 sm:gap-3 text-text-main dark:text-white min-w-0 shrink">
          <button @click="handleBack" class="flex items-center justify-center shrink-0" :aria-label="t('dailyOpinion.back')">
            <span class="material-symbols-outlined cursor-pointer">arrow_back</span>
          </button>
          <div class="flex flex-col min-w-0">
            <h2 class="text-sm sm:text-base font-bold leading-tight tracking-[-0.015em] truncate">{{ t('dailyOpinion.title') }}</h2>
            <span class="text-xs text-text-muted dark:text-slate-400 truncate">{{ t('dailyOpinion.subtitle') }}</span>
          </div>
        </div>
        <div class="flex items-center gap-1 sm:gap-2">
          <span v-if="streak > 0" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <span class="material-symbols-outlined text-[14px]">local_fire_department</span>
            {{ streak }}
          </span>
          <button
            @click="toggleDark"
            class="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 transition-colors"
          >
            <span class="material-symbols-outlined text-[18px]">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
          </button>
        </div>
      </header>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto">
        <div class="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-4">
          <!-- Question -->
          <div class="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm">
            <p class="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <span class="material-symbols-outlined text-[16px]">help</span>
              {{ t('dailyOpinion.todaysQuestion') }}
            </p>
            <p class="text-base sm:text-lg font-semibold text-text-main dark:text-white break-words">{{ question.en }}</p>
            <p v-if="questionGloss" class="text-sm text-text-muted dark:text-slate-400 mt-1 break-words">{{ questionGloss }}</p>
          </div>

          <!-- ========== WRITE MODE ========== -->
          <template v-if="isWriting">
            <!-- 3-step scaffold (hints in mother tongue); ticks light up live -->
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="(step, i) in SCAFFOLD_STEPS"
                :key="step.key"
                type="button"
                @click="insertStarter(step.starter.split(' / ')[0])"
                class="text-left p-2.5 sm:p-3 rounded-xl border transition-colors"
                :class="liveStructure[step.key]
                  ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                  : 'border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:border-primary/50'"
              >
                <div class="flex items-center gap-1">
                  <span class="text-[11px] font-bold text-text-muted dark:text-slate-500">{{ i + 1 }}</span>
                  <span class="text-sm font-semibold text-text-main dark:text-white">{{ step.label[mt] || step.label.en }}</span>
                  <span v-if="liveStructure[step.key]" class="material-symbols-outlined text-green-500 text-[16px] ml-auto">check_circle</span>
                </div>
                <p class="text-[11px] sm:text-xs text-text-muted dark:text-slate-400 mt-1 leading-snug">{{ step.hint[mt] || step.hint.en }}</p>
                <p class="text-[11px] sm:text-xs text-primary mt-1 italic truncate">{{ step.starter }}</p>
              </button>
            </div>

            <!-- Today's connectors -->
            <div class="space-y-2">
              <p class="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">link</span>
                {{ t('dailyOpinion.todaysConnectors') }}
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  v-for="c in targets"
                  :key="c.id"
                  class="p-3 rounded-xl border transition-colors"
                  :class="liveTargetsUsed.includes(c.id)
                    ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                    : 'border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark'"
                >
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-text-main dark:text-white">{{ c.word }}</span>
                    <span v-if="c.nativeWord" class="text-xs text-text-muted dark:text-slate-400">{{ c.nativeWord }}</span>
                    <span v-if="liveTargetsUsed.includes(c.id)" class="ml-auto text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-0.5">
                      <span class="material-symbols-outlined text-[14px]">check</span>{{ t('dailyOpinion.used') }}
                    </span>
                  </div>
                  <p class="text-xs text-text-muted dark:text-slate-400 mt-1 leading-snug">{{ c.meaning }}</p>
                  <p class="text-xs text-text-main/80 dark:text-slate-300 mt-1 italic">"{{ c.example }}"</p>
                </div>
              </div>
            </div>

            <!-- Textarea -->
            <div>
              <textarea
                ref="textareaRef"
                v-model="body"
                :placeholder="t('dailyOpinion.placeholder')"
                :disabled="submitting"
                class="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark text-text-main dark:text-white px-4 py-4 text-base leading-relaxed focus:border-primary focus:ring-1 focus:ring-primary dark:focus:ring-primary placeholder-slate-400 disabled:opacity-50 transition-colors"
                style="min-height: 140px; max-height: 50vh;"
              ></textarea>
              <div class="mt-2 flex items-center justify-between text-xs text-text-muted dark:text-slate-400">
                <span>{{ t('diary.wordCount', { count: wordCount }) }}</span>
                <span>{{ t('dailyOpinion.structureProgress', { count: SCAFFOLD_STEPS.filter(s => liveStructure[s.key]).length }) }}</span>
              </div>
            </div>

            <!-- Live highlight preview -->
            <div v-if="hasLiveHighlights" class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <p class="text-[11px] font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider mb-1">{{ t('dailyOpinion.livePreview') }}</p>
              <p class="text-sm text-text-main dark:text-slate-200 whitespace-pre-wrap break-words leading-relaxed"><template
                v-for="(seg, i) in liveSegments"
                :key="i"
              ><mark
                v-if="seg.id"
                class="rounded px-0.5 font-semibold text-text-main dark:text-white"
                :class="connectorIds.includes(seg.id) ? 'bg-primary/30' : 'bg-amber-200/70 dark:bg-amber-700/40'"
              >{{ seg.text }}</mark><template v-else>{{ seg.text }}</template></template></p>
            </div>

            <button
              v-if="todayRecord?.rewriting"
              @click="handleCancelRewrite"
              class="text-xs text-text-muted dark:text-slate-400 underline"
            >{{ t('dailyOpinion.cancelRewrite') }}</button>
          </template>

          <!-- ========== RESULT MODE ========== -->
          <template v-else>
            <!-- Your answer, highlighted -->
            <div class="p-3 sm:p-4 rounded-2xl bg-primary/10 dark:bg-primary/20 border border-primary/20">
              <p class="text-xs font-medium text-text-muted dark:text-slate-400 mb-1">{{ t('feedback.you') }}</p>
              <p class="text-sm sm:text-base text-text-main dark:text-slate-200 whitespace-pre-wrap break-words leading-relaxed"><template
                v-for="(seg, i) in resultSegments"
                :key="i"
              ><mark
                v-if="seg.id"
                class="rounded px-0.5 font-semibold text-text-main dark:text-white"
                :class="(todayRecord?.connectorIds || []).includes(seg.id) ? 'bg-primary/40' : 'bg-amber-200/70 dark:bg-amber-700/40'"
              >{{ seg.text }}</mark><template v-else>{{ seg.text }}</template></template></p>
            </div>

            <!-- Local check (works offline) -->
            <div class="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <p class="text-sm font-medium text-text-main dark:text-slate-200">{{ localCheer }}</p>

              <!-- Connectors -->
              <div>
                <p class="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider mb-2">{{ t('dailyOpinion.connectorsUsed') }}</p>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="c in resultTargets"
                    :key="c.id"
                    class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg border"
                    :class="c.used
                      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'border-dashed border-slate-300 dark:border-slate-600 text-text-muted dark:text-slate-400'"
                  >
                    <span class="material-symbols-outlined text-[14px]">{{ c.used ? 'check' : 'radio_button_unchecked' }}</span>
                    {{ c.word }}
                  </span>
                  <span
                    v-for="c in otherConnectorsUsed"
                    :key="c.id"
                    class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                  >
                    <span class="material-symbols-outlined text-[14px]">add</span>
                    {{ c.word }}
                  </span>
                </div>
              </div>

              <!-- 3 parts -->
              <div>
                <p class="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider mb-2">
                  {{ t('dailyOpinion.structureTitle') }} · {{ structureCount }}/3
                </p>
                <div class="grid grid-cols-3 gap-2">
                  <div
                    v-for="step in SCAFFOLD_STEPS"
                    :key="step.key"
                    class="flex items-center gap-1.5 p-2 rounded-lg text-sm"
                    :class="structure[step.key]
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'bg-slate-50 dark:bg-slate-800/50 text-text-muted dark:text-slate-400'"
                  >
                    <span class="material-symbols-outlined text-[16px]">{{ structure[step.key] ? 'check_circle' : 'radio_button_unchecked' }}</span>
                    {{ step.label[mt] || step.label.en }}
                  </div>
                </div>
                <p v-if="structureCount < 3" class="text-xs text-text-muted dark:text-slate-400 mt-2">
                  {{ SCAFFOLD_STEPS.find(s => !structure[s.key]).hint[mt] || SCAFFOLD_STEPS.find(s => !structure[s.key]).hint.en }}
                </p>
              </div>

              <!-- Save a sentence -->
              <div v-if="sentences.length">
                <p class="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider mb-2">{{ t('dailyOpinion.saveSentenceTitle') }}</p>
                <div class="space-y-1.5">
                  <button
                    v-for="(s, i) in sentences"
                    :key="i"
                    type="button"
                    @click="selectedSentence = s"
                    class="w-full text-left text-sm px-3 py-2 rounded-lg border transition-colors break-words"
                    :class="s === sentenceToSave
                      ? 'border-primary bg-primary/10 text-text-main dark:text-white'
                      : 'border-slate-200 dark:border-slate-700 text-text-muted dark:text-slate-400 hover:border-primary/50'"
                  >{{ s }}</button>
                </div>
                <button
                  v-if="!sentenceSaved"
                  @click="handleSaveSentence"
                  class="mt-2 flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <span class="material-symbols-outlined text-[18px]">bookmark_add</span>
                  {{ t('dailyOpinion.saveSentence') }}
                </button>
                <span v-else class="mt-2 flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
                  <span class="material-symbols-outlined text-[18px]">check_circle</span>
                  {{ t('dailyOpinion.sentenceSaved') }}
                </span>
              </div>
            </div>

            <!-- AI friend feedback -->
            <div
              v-if="feedbackStatus === 'pending'"
              class="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300"
            >
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base">wifi_off</span>
                {{ t('dailyOpinion.offlineFeedback') }}
              </div>
            </div>
            <DiaryFeedback
              v-else-if="feedbackLoading || feedbackStatus === 'error' || todayRecord?.feedback"
              :feedback="todayRecord?.feedback"
              :character="character"
              :loading="feedbackLoading"
              :error="feedbackStatus === 'error'"
              @retry="retryFeedback"
              @rewrite="handleRewrite"
            />

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-3 pt-2 pb-6">
              <button
                v-if="!todayRecord?.feedback"
                @click="handleRewrite"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-text-main dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span class="material-symbols-outlined text-[20px]">edit_note</span>
                {{ t('diary.rewrite') }}
              </button>
              <button
                @click="router.push('/')"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-[#0d171b] font-semibold shadow-md hover:bg-primary/90 transition-colors"
              >
                <span class="material-symbols-outlined text-[20px]">check</span>
                {{ t('dailyOpinion.doneSeeYouTomorrow') }}
              </button>
            </div>
          </template>
        </div>
      </div>

      <!-- Footer (write mode): mic + submit -->
      <div v-if="isWriting" class="p-4 sm:p-6 bg-surface-light dark:bg-surface-dark border-t border-[#e7eff3] dark:border-slate-800 z-10 safe-area-bottom">
        <div class="flex items-center gap-3 max-w-2xl mx-auto">
          <button
            v-if="speechSupported"
            @click="toggleSpeech"
            :disabled="submitting"
            :aria-label="isListening ? 'Stop voice input' : 'Start voice input'"
            class="shrink-0 flex items-center justify-center size-12 rounded-full transition-all disabled:opacity-50"
            :class="isListening
              ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-text-muted dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'"
          >
            <span class="material-symbols-outlined text-[22px]">{{ isListening ? 'mic_off' : 'mic' }}</span>
          </button>
          <button
            @click="handleSubmit"
            :disabled="!canSubmit"
            class="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-[#0d171b] font-semibold shadow-lg hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <span v-if="submitting" class="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
            <span v-else class="material-symbols-outlined text-[20px]">send</span>
            {{ submitting ? t('diary.submitting') : t('dailyOpinion.submit') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
