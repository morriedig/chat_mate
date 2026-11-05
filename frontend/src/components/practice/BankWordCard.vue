<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { playTTS } from '../../utils/tts'
import PracticeRating from './PracticeRating.vue'

const { t } = useI18n()

const props = defineProps({
  // Vocabulary bank entry: { id, word, translation, context }
  word: { type: Object, required: true },
})
const emit = defineEmits(['done'])

// Recall first, then reveal what was saved with it
const revealed = ref(false)
watch(() => props.word.id, () => { revealed.value = false })

function rate(confidence) {
  emit('done', { correct: confidence >= 3, confidence })
}
</script>

<template>
  <div class="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-xs font-semibold text-primary">{{ t('dailyPractice.savedWord') }}</p>
        <p class="mt-1 text-2xl font-bold text-text-main dark:text-white break-words">{{ word.word }}</p>
      </div>
      <button @click="playTTS(word.word, 'en', 'normal')" class="shrink-0 text-primary mt-4" :aria-label="t('dailyPractice.listen')">
        <span class="material-symbols-outlined">volume_up</span>
      </button>
    </div>

    <template v-if="!revealed">
      <p class="text-sm text-text-muted dark:text-slate-400">{{ t('dailyPractice.recallMeaning') }}</p>
      <button @click="revealed = true" class="w-full py-3 rounded-xl bg-primary text-white font-semibold">{{ t('dailyPractice.reveal') }}</button>
    </template>

    <template v-else>
      <div class="rounded-xl p-4 bg-primary/5 dark:bg-primary/10 space-y-2">
        <p v-if="word.translation" class="text-base font-semibold text-text-main dark:text-white">{{ word.translation }}</p>
        <p v-if="word.context" class="text-sm italic text-text-muted dark:text-slate-400 leading-relaxed">“{{ word.context }}”</p>
        <p v-if="!word.translation && !word.context" class="text-sm text-text-muted dark:text-slate-400">{{ t('dailyPractice.noSavedMeaning') }}</p>
      </div>
      <PracticeRating @rate="rate" />
    </template>
  </div>
</template>
