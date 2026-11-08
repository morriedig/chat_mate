<script setup>
// "I'm stuck": a bottom sheet with three kinds of hint, and the hint card above the input.
// The hint stays in this component only: it never goes into the messages or the turn count.
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import CmBottomSheet from '../ui/CmBottomSheet.vue'
import CmButton from '../ui/CmButton.vue'
import CmIconButton from '../ui/CmIconButton.vue'
import { useSpeechRescue, turnKey } from '../../composables/useSpeechRescue'
import { listenOnce, stopListening, isSTTAvailable } from '../../utils/stt'

const { t } = useI18n()

const props = defineProps({
  // { messages, task, patterns, level, language, nativeLanguage, sessionType }
  context: { type: Object, required: true },
})
const emit = defineEmits(['open', 'close'])

const { isLoading, result, request, clear } = useSpeechRescue()

const sheetOpen = ref(false)
const step = ref('choose') // 'choose' | 'intent'
const intentText = ref('')
const intentRef = ref(null)
const dictating = ref(false)
const canDictate = isSTTAvailable()

const OPTIONS = [
  { mode: 'starter', icon: 'start' },
  { mode: 'intent', icon: 'translate' },
  { mode: 'frame', icon: 'view_agenda' },
]

function open() {
  step.value = 'choose'
  sheetOpen.value = true
  emit('open')
}

function closeSheet() {
  stopDictation()
  sheetOpen.value = false
  emit('close')
}

async function choose(mode) {
  if (mode === 'intent') {
    step.value = 'intent'
    await nextTick()
    intentRef.value?.focus()
    return
  }
  closeSheet()
  await request({ mode, context: props.context })
}

async function submitIntent() {
  const intent = intentText.value.trim()
  if (!intent) return
  closeSheet()
  await request({ mode: 'intent', intent, context: props.context })
}

// "Say it another way": back to the intent step with the text kept
function retryIntent() {
  clear()
  sheetOpen.value = true
  step.value = 'intent'
  emit('open')
  nextTick(() => intentRef.value?.focus())
}

async function toggleDictation() {
  if (dictating.value) {
    stopDictation()
    return
  }
  dictating.value = true
  const before = intentText.value
  try {
    const heard = await listenOnce({
      language: props.context.nativeLanguage || 'zh',
      onInterim: s => { intentText.value = (before ? before + ' ' : '') + s },
    })
    if (heard) intentText.value = ((before ? before + ' ' : '') + heard).slice(0, 300)
  } catch {
    // Mic blocked or unavailable: typing still works
  } finally {
    dictating.value = false
  }
}

function stopDictation() {
  if (dictating.value) stopListening()
  dictating.value = false
}

// A new message (either side) is a new turn: the old hint no longer fits
watch(() => turnKey(props.context.messages || []), () => {
  clear()
  intentText.value = ''
})

onBeforeUnmount(stopDictation)

const resultLabel = computed(() => result.value ? t(`rescue.result.${result.value.mode}`) : '')
const intentFailed = computed(() => result.value?.mode === 'intent' && result.value.pieces.length === 0)

// "I'd say [your choice], because [your reason]" → text and slot parts
const frameParts = computed(() => {
  const frame = result.value?.frame || ''
  return frame.split(/(\[[^[\]]+\])/).filter(Boolean).map(text => ({ text, slot: /^\[.*\]$/.test(text) }))
})

const note = computed(() => {
  const r = result.value
  if (!r) return ''
  if (intentFailed.value) return r.reason === 'offline' ? t('rescue.intentOffline') : t('rescue.intentFailed')
  if (r.source === 'fallback') return t(`rescue.fallback.${r.reason === 'offline' || r.reason === 'limit' ? r.reason : 'busy'}`)
  return t(`rescue.finish.${r.mode}`)
})

defineExpose({ open })
</script>

<template>
  <div>
    <!-- Hint card: above the input, never in the message list -->
    <div
      v-if="isLoading || result"
      class="speech-rescue-card mb-2 rounded-[14px] border border-hairline bg-surface-raised py-2 pl-3 pr-1"
      role="status"
      aria-live="polite"
    >
      <div class="flex items-start gap-2">
        <span class="material-symbols-outlined mt-0.5 shrink-0 !text-[20px] text-accent" aria-hidden="true">support</span>
        <div class="min-w-0 flex-1 py-0.5">
          <p v-if="isLoading" class="text-body text-ink-secondary">{{ t('rescue.loading') }}</p>
          <template v-else-if="result">
            <p class="text-meta font-medium text-ink-secondary">{{ resultLabel }}</p>
            <p v-if="result.mode === 'starter'" class="rescue-starter mt-0.5 break-words text-title font-medium text-ink">
              {{ result.pieces[0] }} …
            </p>
            <ul v-else-if="result.mode === 'intent' && !intentFailed" class="rescue-pieces mt-1 flex flex-wrap gap-1.5">
              <li
                v-for="piece in result.pieces"
                :key="piece"
                class="max-w-full break-words rounded-[6px] border border-accent/25 bg-accent-soft px-2 py-1 text-body font-medium text-accent"
              >{{ piece }}</li>
            </ul>
            <p v-else-if="result.mode === 'frame'" class="rescue-frame mt-0.5 break-words text-title font-medium text-ink">
              <span v-for="(part, i) in frameParts" :key="i" :class="part.slot ? 'rescue-slot rounded-[4px] bg-accent-soft text-accent' : ''">{{ part.text }}</span>
            </p>
            <p class="rescue-note mt-1 break-words text-meta text-ink-muted">{{ note }}</p>
            <button
              v-if="intentFailed"
              type="button"
              @click="retryIntent"
              class="rescue-retry -ml-2 mt-1 inline-flex min-h-11 items-center gap-1 rounded-[10px] px-2 text-caption font-medium text-accent"
            >
              <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">edit</span>
              {{ t('rescue.tryAgain') }}
            </button>
          </template>
        </div>
        <CmIconButton icon="close" :label="t('rescue.closeHint')" class="rescue-close" @click="clear" />
      </div>
    </div>

    <CmBottomSheet
      v-if="sheetOpen"
      :title="step === 'intent' ? t('rescue.modes.intent') : t('rescue.sheetTitle')"
      :description="step === 'intent' ? t('rescue.intentDescription') : t('rescue.sheetDescription')"
      :close-label="t('common.close')"
      @close="closeSheet"
    >
      <ul v-if="step === 'choose'" class="rescue-options -mx-2 flex flex-col">
        <li v-for="option in OPTIONS" :key="option.mode">
          <button
            type="button"
            @click="choose(option.mode)"
            :class="`rescue-option rescue-option-${option.mode}`"
            class="flex min-h-14 w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left active:bg-surface-raised"
          >
            <span class="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-accent-soft text-accent">
              <span class="material-symbols-outlined" aria-hidden="true">{{ option.icon }}</span>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block break-words text-body font-medium text-ink">{{ t(`rescue.modes.${option.mode}`) }}</span>
              <span class="block break-words text-caption text-ink-muted">{{ t(`rescue.modeHints.${option.mode}`) }}</span>
            </span>
            <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">chevron_right</span>
          </button>
        </li>
      </ul>

      <form v-else class="rescue-intent flex flex-col gap-2" @submit.prevent="submitIntent">
        <label for="rescue-intent-input" class="text-caption font-medium text-ink-secondary">{{ t('rescue.intentLabel') }}</label>
        <div class="flex items-end gap-2">
          <textarea
            id="rescue-intent-input"
            ref="intentRef"
            v-model="intentText"
            maxlength="300"
            rows="3"
            :placeholder="t('rescue.intentPlaceholder')"
            class="block min-h-12 min-w-0 flex-1 resize-none rounded-[10px] border border-hairline bg-surface-sunken px-3.5 py-[11px] text-[16px] leading-6 text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
          ></textarea>
          <button
            v-if="canDictate"
            type="button"
            @click="toggleDictation"
            :aria-label="dictating ? t('common.stopVoiceInput') : t('common.startVoiceInput')"
            :aria-pressed="dictating"
            class="rescue-dictate flex size-12 shrink-0 items-center justify-center rounded-[10px] border"
            :class="dictating ? 'border-error/30 bg-error-soft text-error' : 'border-hairline bg-surface-raised text-ink-secondary active:bg-surface-sunken'"
          >
            <span class="material-symbols-outlined" aria-hidden="true">{{ dictating ? 'stop' : 'mic' }}</span>
          </button>
        </div>
        <p v-if="dictating" class="flex items-center gap-2 text-meta text-error" role="status">
          <span class="size-2 rounded-full bg-error" aria-hidden="true"></span>{{ t('voiceChat.listening') }}
        </p>
      </form>

      <template v-if="step === 'intent'" #actions>
        <div class="flex gap-2">
          <CmButton variant="secondary" class="rescue-back shrink-0" @click="step = 'choose'">{{ t('common.back') }}</CmButton>
          <CmButton class="rescue-submit min-w-0 flex-1" :disabled="!intentText.trim()" @click="submitIntent">{{ t('rescue.intentSubmit') }}</CmButton>
        </div>
      </template>
    </CmBottomSheet>
  </div>
</template>
