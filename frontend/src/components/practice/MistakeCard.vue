<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { diffWords } from '../../utils/wordDiff'
import { playTTS } from '../../utils/tts'
import PracticeRating from './PracticeRating.vue'
import PracticeCard from './PracticeCard.vue'
import CmButton from '../ui/CmButton.vue'
import CmIconButton from '../ui/CmIconButton.vue'

const { t } = useI18n()

const props = defineProps({
  // { id, original, corrected, explanation, hint, type, source }
  mistake: { type: Object, required: true },
})
const emit = defineEmits(['done', 'remove'])

// 'fix' (learner rewrites) → 'compare' (see the correction) → rate
const stage = ref('fix')
const attempt = ref('')
const showHint = ref(false)

watch(() => props.mistake.id, () => {
  stage.value = 'fix'
  attempt.value = props.mistake.original
  showHint.value = false
}, { immediate: true })

const diff = computed(() => diffWords(attempt.value, props.mistake.corrected))
// The learner's words, marked where they differ from the suggestion (shown struck through)
const attemptParts = computed(() => diffWords(props.mistake.corrected, attempt.value).parts)
const changedNothing = computed(() => attempt.value.trim() === props.mistake.original.trim())

function compare() {
  stage.value = 'compare'
}

function rate(confidence) {
  emit('done', { correct: diff.value.matches || confidence >= 3, confidence })
}
</script>

<template>
  <PracticeCard>
    <div>
      <p class="text-meta font-medium text-warning">{{ t(`mistakes.source.${mistake.source}`, t('mistakes.source.chat')) }}</p>
      <p class="mt-1 text-caption text-ink-secondary">{{ t('mistakes.prompt') }}</p>
      <p class="mt-2 text-title font-medium text-ink break-words">“{{ mistake.original }}”</p>
    </div>

    <template v-if="stage === 'fix'">
      <textarea
        v-model="attempt"
        :rows="Math.min(6, Math.ceil(attempt.length / 30) + 1)"
        class="block w-full resize-none rounded-[10px] border border-hairline bg-surface-sunken px-3 py-3 text-base leading-6 text-ink focus:border-accent focus:outline-none"
        :aria-label="t('mistakes.yourFix')"
      ></textarea>
      <p v-if="showHint && mistake.hint" class="rounded-[10px] bg-accent-soft px-3 py-2 text-caption text-ink break-words">
        <span class="font-medium text-accent">{{ t('mistakes.hintLabel') }}</span>
        {{ mistake.hint }}
      </p>
      <div class="flex gap-2">
        <CmButton class="flex-1" @click="compare">{{ t('mistakes.compare') }}</CmButton>
        <CmButton
          v-if="mistake.hint && !showHint"
          variant="secondary"
          class="shrink-0"
          @click="showHint = true"
        >{{ t('mistakes.showHint') }}</CmButton>
      </div>
    </template>

    <template v-else>
      <!-- Matches: icon + text + success-soft, never color alone -->
      <div v-if="diff.matches" class="space-y-2 rounded-[10px] bg-success-soft p-3" role="status">
        <p class="flex items-center gap-1.5 text-caption font-medium text-success">
          <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">check_circle</span>
          {{ t('mistakes.matched') }}
        </p>
        <div class="flex items-start gap-1">
          <p class="flex-1 min-w-0 py-2.5 text-body text-ink break-words">{{ mistake.corrected }}</p>
          <CmIconButton icon="volume_up" :label="t('dailyPractice.listen')" @click="playTTS(mistake.corrected, 'en', 'normal')" />
        </div>
      </div>

      <div v-else class="space-y-3" role="status">
        <p class="text-caption font-medium text-ink">
          {{ changedNothing ? t('mistakes.unchanged') : t('mistakes.compareHint') }}
        </p>
        <div class="rounded-[10px] border border-hairline bg-surface-sunken px-3 py-2.5">
          <p class="text-meta text-ink-muted">{{ t('mistakes.youWrote') }}</p>
          <p class="mt-1 text-body text-ink-secondary break-words">
            <template v-for="(part, i) in attemptParts" :key="i"><span :class="part.same ? '' : 'rounded-[4px] bg-error-soft px-0.5 text-error line-through'">{{ part.text }}</span>{{ ' ' }}</template>
          </p>
        </div>
        <div class="rounded-[10px] border border-hairline bg-surface px-3 py-2.5">
          <div class="flex items-start gap-1">
            <div class="min-w-0 flex-1">
              <p class="text-meta text-ink-muted">{{ t('mistakes.suggested') }}</p>
              <p class="mt-1 text-body text-ink break-words">
                <template v-for="(part, i) in diff.parts" :key="i"><span :class="part.same ? '' : 'rounded-[4px] bg-success-soft px-0.5 font-medium text-success underline decoration-1 underline-offset-4'">{{ part.text }}</span>{{ ' ' }}</template>
              </p>
            </div>
            <CmIconButton icon="volume_up" :label="t('dailyPractice.listen')" class="-mr-2" @click="playTTS(mistake.corrected, 'en', 'normal')" />
          </div>
        </div>
      </div>
      <p v-if="mistake.explanation" class="text-caption text-ink-secondary break-words">{{ mistake.explanation }}</p>

      <PracticeRating @rate="rate" />
      <CmButton variant="quiet" block class="!text-ink-muted !text-caption !font-normal" @click="emit('remove')">{{ t('mistakes.remove') }}</CmButton>
    </template>
  </PracticeCard>
</template>
