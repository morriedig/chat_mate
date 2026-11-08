<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { listenOnce, stopListening, isSTTAvailable } from '../../utils/stt'
import { playTTS } from '../../utils/tts'
import { usesPattern } from '../../composables/useSentenceCheck'
import { countEnglishWords } from '../../composables/useDailyPractice'
import PracticeCard from './PracticeCard.vue'
import CmButton from '../ui/CmButton.vue'
import CmIconButton from '../ui/CmIconButton.vue'

const { t } = useI18n()

const props = defineProps({
  // { source, cue, hint, target, original, pattern, match } from useDailyPractice().coreSpeaking
  prompt: { type: Object, required: true },
  // { mode, text } once sent; the answer is revealed only then
  attempt: { type: Object, default: null },
})
const emit = defineEmits(['submit', 'rate'])

const canListen = isSTTAvailable()
// 'voice' until the learner switches (or the mic can't be used)
const inputMode = ref(canListen ? 'voice' : 'text')
const listening = ref(false)
const interim = ref('')
const micMessage = ref('')
const typed = ref('')

const isQueueSentence = computed(() => props.prompt.source === 'chat-summary' || props.prompt.source === 'personal-scenario')
const sourceLabel = computed(() => {
  if (isQueueSentence.value) return t('dailyPractice.speak.labelRepeat')
  if (props.prompt.source === 'pattern-fallback') return t('dailyPractice.speak.labelAgain')
  return t('dailyPractice.speak.labelPattern')
})
// A sentence to repeat shows only the cue and hint; a pattern prompt also shows the skeleton
const showPattern = computed(() => !isQueueSentence.value && !!props.prompt.pattern)
const typedWords = computed(() => countEnglishWords(typed.value))

async function speakNow() {
  micMessage.value = ''
  interim.value = ''
  listening.value = true
  try {
    const text = await listenOnce({ language: 'en', onInterim: s => { interim.value = s } })
    if (text) {
      emit('submit', { mode: 'voice', text })
    } else {
      micMessage.value = t('dailyPractice.speak.noSpeech')
    }
  } catch (e) {
    micMessage.value = e.message === 'not-allowed' ? t('voiceChat.micBlocked') : t('dailyPractice.speak.micFailed')
    inputMode.value = 'text'
  } finally {
    listening.value = false
    interim.value = ''
  }
}

function sendTyped() {
  if (typedWords.value < 2) return
  emit('submit', { mode: 'text', text: typed.value.trim() })
}

const usedPattern = computed(() =>
  !!props.attempt && props.prompt.match?.length > 0 && usesPattern(props.attempt.text, props.prompt.match))

onBeforeUnmount(() => {
  if (listening.value) stopListening()
})
</script>

<template>
  <PracticeCard>
    <div class="space-y-2">
      <p class="text-meta font-medium text-accent">{{ sourceLabel }}</p>
      <p class="text-title font-medium text-ink break-words">{{ prompt.cue }}</p>
      <p v-if="prompt.hint" class="rounded-[10px] bg-surface-sunken px-3 py-2 text-caption text-ink-secondary break-words">
        <span class="font-medium text-ink">{{ t('dailyPractice.speak.hintLabel') }}</span>
        {{ prompt.hint }}
      </p>
      <p v-if="showPattern" class="text-body font-medium text-ink break-words">
        <span class="text-caption font-normal text-ink-muted">{{ t('dailyPractice.speak.patternLabel') }}</span>
        {{ prompt.pattern }}
      </p>
    </div>

    <!-- ========== Answer ========== -->
    <template v-if="!attempt">
      <div v-if="inputMode === 'voice'" class="space-y-3 border-t border-hairline pt-4">
        <p v-if="listening" class="min-h-6 text-body text-ink break-words" role="status" aria-live="polite">
          {{ interim || t('dailyPractice.speak.listening') }}
        </p>
        <CmButton v-if="!listening" block class="core-speak" @click="speakNow">
          <span class="material-symbols-outlined" aria-hidden="true">mic</span>{{ t('dailyPractice.speak.speak') }}
        </CmButton>
        <CmButton v-else block variant="secondary" @click="stopListening">
          <span class="material-symbols-outlined" aria-hidden="true">stop</span>{{ t('dailyPractice.speak.stop') }}
        </CmButton>
        <p v-if="micMessage" class="text-caption text-ink-secondary" role="status">{{ micMessage }}</p>
        <CmButton v-if="!listening" variant="quiet" block class="core-type-instead" @click="inputMode = 'text'">
          {{ t('dailyPractice.speak.typeInstead') }}
        </CmButton>
      </div>

      <div v-else class="space-y-3 border-t border-hairline pt-4">
        <p v-if="micMessage" class="text-caption text-ink-secondary" role="status">{{ micMessage }}</p>
        <label for="core-typed" class="sr-only">{{ t('dailyPractice.speak.typePlaceholder') }}</label>
        <textarea
          id="core-typed"
          v-model="typed"
          rows="3"
          class="block w-full resize-none rounded-[10px] border border-hairline bg-surface-sunken px-3 py-3 text-base leading-6 text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
          :placeholder="t('dailyPractice.speak.typePlaceholder')"
        ></textarea>
        <p class="text-meta text-ink-muted">{{ t('dailyPractice.speak.typeNote') }}</p>
        <CmButton block class="core-send" :disabled="typedWords < 2" @click="sendTyped">{{ t('dailyPractice.speak.send') }}</CmButton>
        <CmButton v-if="canListen" variant="quiet" block @click="inputMode = 'voice'; micMessage = ''">
          {{ t('dailyPractice.speak.speakInstead') }}
        </CmButton>
      </div>
    </template>

    <!-- ========== Reveal + self-rating ========== -->
    <template v-else>
      <div class="space-y-3 border-t border-hairline pt-4" role="status">
        <div class="rounded-[10px] border border-hairline bg-surface-sunken px-3 py-2.5">
          <p class="text-meta text-ink-muted">{{ attempt.mode === 'voice' ? t('dailyPractice.speak.youSaid') : t('dailyPractice.speak.youWrote') }}</p>
          <p class="mt-1 text-body text-ink break-words">{{ attempt.text }}</p>
        </div>

        <div v-if="prompt.target" class="core-target rounded-[10px] bg-success-soft px-3 py-2.5">
          <div class="flex items-start gap-1">
            <div class="min-w-0 flex-1">
              <p class="text-meta font-medium text-success">{{ t('dailyPractice.speak.sayItLike') }}</p>
              <p class="mt-1 text-body text-ink break-words">{{ prompt.target }}</p>
            </div>
            <CmIconButton icon="volume_up" :label="t('dailyPractice.listen')" class="-mr-2" @click="playTTS(prompt.target, 'en', 'normal')" />
          </div>
        </div>

        <p v-if="prompt.match?.length" class="flex items-center gap-1.5 text-caption font-medium" :class="usedPattern ? 'text-success' : 'text-warning'">
          <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">{{ usedPattern ? 'check_circle' : 'info' }}</span>
          {{ usedPattern ? t('dailyPractice.usedPattern') : t('dailyPractice.missedPattern') }}
        </p>
      </div>

      <div class="space-y-2 border-t border-hairline pt-4" role="group" :aria-label="t('dailyPractice.speak.rateLabel')">
        <p class="text-caption font-medium text-ink-secondary">{{ t('dailyPractice.speak.rateLabel') }}</p>
        <div class="grid grid-cols-2 gap-2">
          <CmButton variant="secondary" class="core-again min-w-0" @click="emit('rate', 'again')">{{ t('dailyPractice.speak.again') }}</CmButton>
          <CmButton class="core-got-it min-w-0" @click="emit('rate', 'got-it')">{{ t('dailyPractice.speak.gotIt') }}</CmButton>
        </div>
        <p class="text-meta text-ink-muted">{{ t('dailyPractice.speak.againNote') }}</p>
      </div>
    </template>
  </PracticeCard>
</template>
