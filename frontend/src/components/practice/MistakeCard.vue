<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { diffWords } from '../../utils/wordDiff'
import { playTTS } from '../../utils/tts'
import PracticeRating from './PracticeRating.vue'

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
const changedNothing = computed(() => attempt.value.trim() === props.mistake.original.trim())

function compare() {
  stage.value = 'compare'
}

function rate(confidence) {
  emit('done', { correct: diff.value.matches || confidence >= 3, confidence })
}
</script>

<template>
  <div class="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
    <div>
      <p class="text-xs font-semibold text-amber-600 dark:text-amber-400">{{ t(`mistakes.source.${mistake.source}`, t('mistakes.source.chat')) }}</p>
      <p class="mt-1 text-sm text-text-muted dark:text-slate-400">{{ t('mistakes.prompt') }}</p>
      <p class="mt-2 text-base text-text-main dark:text-white leading-relaxed">“{{ mistake.original }}”</p>
    </div>

    <template v-if="stage === 'fix'">
      <textarea
        v-model="attempt"
        rows="3"
        class="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark text-text-main dark:text-white px-3 py-2.5 text-base leading-relaxed focus:border-primary focus:ring-1 focus:ring-primary"
        :aria-label="t('mistakes.yourFix')"
      ></textarea>
      <p v-if="showHint && mistake.hint" class="text-sm text-primary">💡 {{ mistake.hint }}</p>
      <div class="flex gap-2">
        <button
          @click="compare"
          class="flex-1 py-3 rounded-xl bg-primary text-white font-semibold"
        >{{ t('mistakes.compare') }}</button>
        <button
          v-if="mistake.hint && !showHint"
          @click="showHint = true"
          class="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-text-main dark:text-slate-200"
        >{{ t('mistakes.showHint') }}</button>
      </div>
    </template>

    <template v-else>
      <div class="rounded-xl p-4 space-y-2" :class="diff.matches ? 'bg-green-50 dark:bg-green-900/20' : 'bg-primary/5 dark:bg-primary/10'">
        <p class="text-sm font-semibold" :class="diff.matches ? 'text-green-700 dark:text-green-300' : 'text-text-main dark:text-slate-200'">
          {{ diff.matches ? t('mistakes.matched') : changedNothing ? t('mistakes.unchanged') : t('mistakes.compareHint') }}
        </p>
        <div class="flex items-start gap-2">
          <p class="flex-1 text-base leading-relaxed text-text-main dark:text-white">
            <template v-for="(part, i) in diff.parts" :key="i"><span :class="part.same ? '' : 'font-semibold text-green-700 dark:text-green-300 underline decoration-2 underline-offset-2'">{{ part.text }}</span>{{ ' ' }}</template>
          </p>
          <button @click="playTTS(mistake.corrected, 'en', 'normal')" class="shrink-0 text-primary" :aria-label="t('dailyPractice.listen')">
            <span class="material-symbols-outlined">volume_up</span>
          </button>
        </div>
        <p v-if="mistake.explanation" class="text-sm text-text-muted dark:text-slate-400 leading-relaxed">{{ mistake.explanation }}</p>
      </div>
      <PracticeRating @rate="rate" />
      <button @click="emit('remove')" class="w-full text-xs text-text-muted dark:text-slate-500 underline">{{ t('mistakes.remove') }}</button>
    </template>
  </div>
</template>
