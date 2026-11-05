<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { playTTS, stopTTS } from '../../utils/tts'
import { shuffleArray } from '../../utils/shuffle'
import { diffWords } from '../../utils/wordDiff'
import PracticeCard from './PracticeCard.vue'
import CmButton from '../ui/CmButton.vue'

const { t } = useI18n()

const props = defineProps({
  // { id, mode: 'choose' | 'dictation', en, zh, options? }
  item: { type: Object, required: true },
})
const emit = defineEmits(['done'])

const picked = ref(null)
const typed = ref('')
const checked = ref(false)
const options = ref([])

function play(speed = 'normal') {
  playTTS(props.item.en, 'en', speed)
}

watch(() => props.item.id, () => {
  picked.value = null
  typed.value = ''
  checked.value = false
  options.value = props.item.mode === 'choose' ? shuffleArray([...props.item.options]) : []
  play()
}, { immediate: true })

const diff = computed(() => diffWords(typed.value, props.item.en))
const answered = computed(() => props.item.mode === 'choose' ? picked.value !== null : checked.value)
const correct = computed(() => props.item.mode === 'choose' ? picked.value === props.item.en : diff.value.matches)

function finish() {
  emit('done', { correct: correct.value, confidence: correct.value ? 4 : 2 })
}

function optionState(option) {
  if (picked.value === null) return 'idle'
  if (option === props.item.en) return 'right'
  return option === picked.value ? 'wrong' : 'other'
}

onBeforeUnmount(stopTTS)
</script>

<template>
  <PracticeCard>
    <p class="text-title font-medium text-ink">
      {{ item.mode === 'choose' ? t('listening.chooseTitle') : t('listening.dictationTitle') }}
    </p>

    <div class="grid grid-cols-2 gap-2">
      <CmButton @click="play('normal')">
        <span class="material-symbols-outlined" aria-hidden="true">volume_up</span>{{ t('listening.play') }}
      </CmButton>
      <CmButton variant="secondary" @click="play('slow')">
        <span class="material-symbols-outlined" aria-hidden="true">slow_motion_video</span>{{ t('listening.slow') }}
      </CmButton>
    </div>

    <!-- Which sentence did you hear? Full-width radio rows -->
    <div v-if="item.mode === 'choose'" role="radiogroup" :aria-label="t('listening.chooseTitle')" class="space-y-2">
      <button
        v-for="option in options"
        :key="option"
        type="button"
        role="radio"
        :aria-checked="option === picked"
        :aria-disabled="picked !== null"
        @click="picked === null && (picked = option)"
        class="flex min-h-12 w-full items-start gap-3 rounded-[10px] border px-3 py-3 text-left text-body break-words"
        :class="{
          idle: 'border-hairline bg-surface text-ink active:bg-surface-raised',
          right: 'border-success/40 bg-success-soft text-ink',
          wrong: 'border-error/40 bg-error-soft text-ink',
          other: 'border-hairline bg-surface text-ink-muted',
        }[optionState(option)]"
      >
        <span
          class="material-symbols-outlined mt-0.5 shrink-0"
          :class="{ idle: 'text-ink-muted', right: 'text-success', wrong: 'text-error', other: 'text-ink-muted' }[optionState(option)]"
          aria-hidden="true"
        >{{ { right: 'check_circle', wrong: 'cancel' }[optionState(option)] || 'radio_button_unchecked' }}</span>
        <span class="min-w-0 flex-1">{{ option }}</span>
      </button>
    </div>

    <!-- Dictation: same field style as mistake review -->
    <div v-else class="space-y-3">
      <textarea
        v-model="typed"
        :disabled="checked"
        rows="2"
        autocapitalize="sentences"
        :placeholder="t('listening.typeWhatYouHear')"
        :aria-label="t('listening.dictationTitle')"
        class="block w-full resize-none rounded-[10px] border border-hairline bg-surface-sunken px-3 py-3 text-base leading-6 text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none disabled:text-ink-secondary"
      ></textarea>
      <CmButton v-if="!checked" block :disabled="!typed.trim()" @click="checked = true">{{ t('listening.check') }}</CmButton>
    </div>

    <div v-if="answered" class="space-y-1.5 rounded-[10px] p-3" :class="correct ? 'bg-success-soft' : 'bg-surface-sunken border border-hairline'" role="status">
      <p class="flex items-center gap-1.5 text-caption font-medium" :class="correct ? 'text-success' : 'text-ink'">
        <span class="material-symbols-outlined !text-[18px]" :class="correct ? '' : 'text-error'" aria-hidden="true">{{ correct ? 'check_circle' : 'cancel' }}</span>
        {{ correct ? t('listening.correct') : t('listening.answerWas') }}
      </p>
      <p class="text-body text-ink break-words">
        <template v-if="item.mode === 'dictation'"><template v-for="(part, i) in diff.parts" :key="i"><span :class="part.same ? '' : 'rounded-[4px] bg-error-soft px-0.5 font-medium text-error underline decoration-1 underline-offset-4'">{{ part.text }}</span>{{ ' ' }}</template></template>
        <template v-else>{{ item.en }}</template>
      </p>
      <p v-if="item.zh" class="text-caption text-ink-secondary break-words">{{ item.zh }}</p>
      <p v-if="item.mode === 'dictation' && !correct" class="text-meta text-ink-muted">{{ t('listening.missedWords') }}</p>
    </div>

    <CmButton v-if="answered" block @click="finish">{{ t('dailyPractice.next') }}</CmButton>
  </PracticeCard>
</template>
