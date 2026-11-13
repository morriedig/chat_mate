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
import CmAppBar from './ui/CmAppBar.vue'
import CmButton from './ui/CmButton.vue'
import CmChip from './ui/CmChip.vue'
import CmIconButton from './ui/CmIconButton.vue'
import PracticeCard from './practice/PracticeCard.vue'
import { isSTTAvailable, listenOnce, stopListening } from '../utils/stt'

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
// The stepper's helper line follows the first step not written yet
const activeStep = computed(() => SCAFFOLD_STEPS.find(s => !liveStructure.value[s.key]) || SCAFFOLD_STEPS[SCAFFOLD_STEPS.length - 1])

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
const speechSupported = isSTTAvailable()
const isListening = ref(false)
let listenId = 0
let unmounted = false

function toggleSpeech() {
  if (isListening.value) stopSpeech()
  else startSpeech()
}

async function startSpeech() {
  if (!speechSupported || isListening.value) return
  const id = ++listenId
  const isCurrent = () => id === listenId && !unmounted
  const base = body.value && !/\s$/.test(body.value) ? body.value + ' ' : body.value
  // Without anything heard the field stays as it was (no dangling separator)
  const original = body.value

  isListening.value = true
  try {
    const heard = await listenOnce({
      language: 'en', // answers are always in English
      onInterim: (text) => { if (isCurrent()) body.value = base + text },
    })
    if (isCurrent()) body.value = heard ? base + heard : original
  } catch (error) {
    if (isCurrent()) console.error('Speech recognition error:', error?.message)
  } finally {
    if (isCurrent()) isListening.value = false
  }
}

function stopSpeech() {
  if (isListening.value) stopListening()
}

async function handleSubmit() {
  if (!canSubmit.value) return
  // Submitting what's on screen: drop any transcript that arrives after this
  if (isListening.value) {
    listenId++
    isListening.value = false
    stopListening()
  }
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
  unmounted = true
  clearTimeout(draftTimer)
  if (isWriting.value) saveDraft(body.value)
})

function handleBack() {
  router.push('/')
}
</script>

<template>
  <div class="flex h-screen w-full max-w-[100vw] overflow-hidden bg-page">
    <div class="relative flex h-full min-w-0 flex-1 flex-col">
      <CmAppBar
        :title="t('dailyOpinion.title')"
        :subtitle="t('dailyOpinion.subtitle')"
        :back-label="t('dailyOpinion.back')"
        @back="handleBack"
      >
        <template #actions>
          <span v-if="streak > 0" class="px-2 text-meta text-ink-muted tabular-nums">{{ t('dailyOpinion.streakDays', { count: streak }) }}</span>
          <span class="hidden sm:contents">
            <CmIconButton
              :icon="isDark ? 'light_mode' : 'dark_mode'"
              :label="t('setup.toggleDark')"
              @click="toggleDark"
            />
          </span>
        </template>
      </CmAppBar>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto">
        <div class="mx-auto max-w-2xl space-y-5 px-4 py-5 min-[375px]:px-5">
          <!-- Question (hero) with the gloss directly below -->
          <PracticeCard>
            <div class="space-y-1">
              <p class="text-caption font-medium text-ink-secondary">{{ t('dailyOpinion.todaysQuestion') }}</p>
              <p class="text-section font-medium text-ink break-words">{{ question.en }}</p>
              <p v-if="questionGloss" class="text-caption text-ink-secondary break-words">{{ questionGloss }}</p>
            </div>
          </PracticeCard>

          <!-- ========== WRITE MODE ========== -->
          <template v-if="isWriting">
            <!-- 3-step stepper; tapping a step inserts its starter, ticks follow the live text -->
            <section class="space-y-2">
              <ol class="grid grid-cols-3 gap-1 rounded-[10px] bg-surface-raised p-1">
                <li v-for="(step, i) in SCAFFOLD_STEPS" :key="step.key" class="min-w-0">
                  <button
                    type="button"
                    @click="insertStarter(step.starter.split(' / ')[0])"
                    class="flex min-h-11 w-full min-w-0 items-center justify-center gap-1.5 rounded-[8px] border px-1.5 text-caption font-medium"
                    :class="liveStructure[step.key]
                      ? 'border-transparent text-success'
                      : step.key === activeStep.key
                        ? 'border-accent/30 bg-surface text-accent shadow-[var(--cm-shadow-small)]'
                        : 'border-transparent text-ink-secondary'"
                    :aria-label="`${i + 1}. ${step.label[mt] || step.label.en}: ${step.starter}`"
                  >
                    <span v-if="liveStructure[step.key]" class="material-symbols-outlined shrink-0 !text-[18px]" aria-hidden="true">check</span>
                    <span v-else class="shrink-0 text-meta tabular-nums" aria-hidden="true">{{ i + 1 }}</span>
                    <span class="truncate">{{ step.label[mt] || step.label.en }}</span>
                  </button>
                </li>
              </ol>
              <p class="px-1 text-caption text-ink-secondary">
                {{ activeStep.hint[mt] || activeStep.hint.en }}
                <span class="text-accent">{{ activeStep.starter }}</span>
              </p>
            </section>

            <!-- Today's connectors: two pattern chips -->
            <section class="space-y-2">
              <h2 class="text-caption font-medium text-ink-secondary">{{ t('dailyOpinion.todaysConnectors') }}</h2>
              <ul class="space-y-3">
                <li v-for="c in targets" :key="c.id" class="space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <CmChip :done="liveTargetsUsed.includes(c.id)">{{ c.word }}</CmChip>
                    <span v-if="c.nativeWord" class="text-meta text-ink-muted">{{ c.nativeWord }}</span>
                    <span v-if="liveTargetsUsed.includes(c.id)" class="text-meta text-success">{{ t('dailyOpinion.used') }}</span>
                  </div>
                  <p class="text-caption text-ink-secondary">{{ c.meaning }}</p>
                  <p class="text-caption text-ink break-words">“{{ c.example }}”</p>
                </li>
              </ul>
            </section>

            <!-- Textarea -->
            <div>
              <textarea
                ref="textareaRef"
                v-model="body"
                :placeholder="t('dailyOpinion.placeholder')"
                :aria-label="question.en"
                :disabled="submitting"
                class="block w-full resize-none rounded-[14px] border border-hairline bg-surface px-4 py-4 text-base leading-7 text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none disabled:opacity-55"
                style="min-height: 160px; max-height: 50vh;"
              ></textarea>
              <div class="mt-2 flex items-center justify-between px-1 text-meta text-ink-muted tabular-nums">
                <span>{{ t('diary.wordCount', { count: wordCount }) }}</span>
                <span>{{ t('dailyOpinion.structureProgress', { count: SCAFFOLD_STEPS.filter(s => liveStructure[s.key]).length }) }}</span>
              </div>
            </div>

            <!-- Live connector preview: only once a connector is detected -->
            <div v-if="hasLiveHighlights" class="rounded-[10px] border border-hairline bg-surface-sunken px-3 py-3">
              <p class="mb-1 text-meta text-ink-muted">{{ t('dailyOpinion.livePreview') }}</p>
              <p class="whitespace-pre-wrap break-words text-body text-ink"><template
                v-for="(seg, i) in liveSegments"
                :key="i"
              ><span
                v-if="seg.id"
                class="border-b-2 font-medium"
                :class="connectorIds.includes(seg.id) ? 'border-accent' : 'border-warning'"
              >{{ seg.text }}</span><template v-else>{{ seg.text }}</template></template></p>
            </div>

            <CmButton
              v-if="todayRecord?.rewriting"
              variant="quiet"
              class="!text-ink-secondary"
              @click="handleCancelRewrite"
            >{{ t('dailyOpinion.cancelRewrite') }}</CmButton>
          </template>

          <!-- ========== RESULT MODE ========== -->
          <template v-else>
            <!-- One summary card: answer, connectors, structure, save a sentence (works offline) -->
            <section class="space-y-5 rounded-[14px] border border-hairline bg-surface p-4 shadow-[var(--cm-shadow-small)]">
              <div>
                <p class="mb-1 text-meta text-ink-muted">{{ t('feedback.you') }}</p>
                <p class="whitespace-pre-wrap break-words text-body text-ink"><template
                  v-for="(seg, i) in resultSegments"
                  :key="i"
                ><span
                  v-if="seg.id"
                  class="border-b-2 font-medium"
                  :class="(todayRecord?.connectorIds || []).includes(seg.id) ? 'border-accent' : 'border-warning'"
                >{{ seg.text }}</span><template v-else>{{ seg.text }}</template></template></p>
              </div>

              <p class="border-t border-hairline pt-4 text-body font-medium text-ink">{{ localCheer }}</p>

              <!-- Connectors -->
              <div>
                <h2 class="mb-2 text-caption font-medium text-ink-secondary">{{ t('dailyOpinion.connectorsUsed') }}</h2>
                <ul class="flex flex-wrap gap-2">
                  <li v-for="c in resultTargets" :key="c.id" class="max-w-full">
                    <CmChip v-if="c.used" done>{{ c.word }}</CmChip>
                    <span v-else class="inline-flex max-w-full items-start gap-1 rounded-[6px] border border-dashed border-hairline px-2 py-1.5 text-caption font-medium text-ink-muted break-words">
                      <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">check_box_outline_blank</span>
                      <span class="min-w-0">{{ c.word }}</span>
                    </span>
                  </li>
                  <li v-for="c in otherConnectorsUsed" :key="c.id" class="max-w-full">
                    <CmChip>
                      <span class="inline-flex items-start gap-1">
                        <span class="material-symbols-outlined !text-[18px] text-ink-muted" aria-hidden="true">add</span>{{ c.word }}
                      </span>
                    </CmChip>
                  </li>
                </ul>
              </div>

              <!-- 3 parts -->
              <div>
                <h2 class="mb-2 text-caption font-medium text-ink-secondary tabular-nums">
                  {{ t('dailyOpinion.structureTitle') }} · {{ structureCount }}/3
                </h2>
                <ul class="grid grid-cols-3 gap-2">
                  <li
                    v-for="step in SCAFFOLD_STEPS"
                    :key="step.key"
                    class="flex min-w-0 items-center gap-1.5 text-caption"
                    :class="structure[step.key] ? 'text-success' : 'text-ink-muted'"
                  >
                    <span class="material-symbols-outlined shrink-0 !text-[18px]" aria-hidden="true">{{ structure[step.key] ? 'check_circle' : 'radio_button_unchecked' }}</span>
                    <span class="truncate">{{ step.label[mt] || step.label.en }}</span>
                  </li>
                </ul>
                <p v-if="structureCount < 3" class="mt-2 text-caption text-ink-secondary">
                  {{ SCAFFOLD_STEPS.find(s => !structure[s.key]).hint[mt] || SCAFFOLD_STEPS.find(s => !structure[s.key]).hint.en }}
                </p>
              </div>

              <!-- Save a sentence -->
              <div v-if="sentences.length">
                <h2 class="mb-2 text-caption font-medium text-ink-secondary">{{ t('dailyOpinion.saveSentenceTitle') }}</h2>
                <div role="radiogroup" :aria-label="t('dailyOpinion.saveSentenceTitle')" class="space-y-2">
                  <button
                    v-for="(s, i) in sentences"
                    :key="i"
                    type="button"
                    role="radio"
                    :aria-checked="s === sentenceToSave"
                    @click="selectedSentence = s"
                    class="flex min-h-11 w-full items-start gap-2 rounded-[10px] border px-3 py-2.5 text-left text-caption break-words"
                    :class="s === sentenceToSave
                      ? 'border-accent bg-accent-soft text-ink'
                      : 'border-hairline text-ink-secondary active:bg-surface-raised'"
                  >
                    <span class="material-symbols-outlined shrink-0 !text-[18px]" :class="s === sentenceToSave ? 'text-accent' : 'text-ink-muted'" aria-hidden="true">{{ s === sentenceToSave ? 'radio_button_checked' : 'radio_button_unchecked' }}</span>
                    <span class="min-w-0">{{ s }}</span>
                  </button>
                </div>
                <CmButton v-if="!sentenceSaved" variant="quiet" class="mt-1 -ml-2" @click="handleSaveSentence">
                  <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">bookmark_add</span>
                  {{ t('dailyOpinion.saveSentence') }}
                </CmButton>
                <p v-else class="mt-1 flex min-h-11 items-center gap-1.5 text-caption font-medium text-success" role="status">
                  <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">check_circle</span>
                  {{ t('dailyOpinion.sentenceSaved') }}
                </p>
              </div>
            </section>

            <!-- AI friend feedback -->
            <p
              v-if="feedbackStatus === 'pending'"
              class="flex items-start gap-2 rounded-[10px] bg-warning-soft px-3 py-3 text-caption text-warning"
              role="status"
            >
              <span class="material-symbols-outlined mt-px shrink-0 !text-[18px]" aria-hidden="true">wifi_off</span>
              <span class="min-w-0">{{ t('dailyOpinion.offlineFeedback') }}</span>
            </p>
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
            <div class="flex flex-col gap-2 pb-6 sm:flex-row">
              <CmButton v-if="!todayRecord?.feedback" variant="secondary" class="flex-1" @click="handleRewrite">
                <span class="material-symbols-outlined" aria-hidden="true">edit_note</span>
                {{ t('diary.rewrite') }}
              </CmButton>
              <CmButton class="flex-1" @click="router.push('/')">
                <span class="material-symbols-outlined" aria-hidden="true">check</span>
                {{ t('dailyOpinion.doneSeeYouTomorrow') }}
              </CmButton>
            </div>
          </template>
        </div>
      </div>

      <!-- Footer (write mode): mic + submit, sticky at the bottom -->
      <div v-if="isWriting" class="z-10 border-t border-hairline bg-surface px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] min-[375px]:px-5">
        <div class="mx-auto flex max-w-2xl items-center gap-2">
          <button
            v-if="speechSupported"
            type="button"
            @click="toggleSpeech"
            :disabled="submitting"
            :aria-label="isListening ? t('common.stopVoiceInput') : t('common.startVoiceInput')"
            :aria-pressed="isListening"
            class="flex size-12 shrink-0 items-center justify-center rounded-[10px] border disabled:opacity-55"
            :class="isListening
              ? 'border-error/30 bg-error-soft text-error'
              : 'border-hairline bg-surface-raised text-ink-secondary active:bg-surface-sunken'"
          >
            <span class="material-symbols-outlined" aria-hidden="true">{{ isListening ? 'mic_off' : 'mic' }}</span>
          </button>
          <CmButton class="min-w-0 flex-1" :disabled="!canSubmit" @click="handleSubmit">
            <span v-if="!submitting" class="material-symbols-outlined" aria-hidden="true">send</span>
            {{ submitting ? t('diary.submitting') : t('dailyOpinion.submit', { name: character.name }) }}
          </CmButton>
        </div>
      </div>
    </div>
  </div>
</template>
