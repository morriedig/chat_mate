<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['rate'])

const RATINGS = [
  { key: 'hard', confidence: 2 },
  { key: 'ok', confidence: 3 },
  { key: 'easy', confidence: 5 },
]
</script>

<template>
  <div class="space-y-2">
    <p class="text-sm font-medium text-text-main dark:text-slate-200">{{ t('dailyPractice.howWell') }}</p>
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="r in RATINGS"
        :key="r.key"
        @click="emit('rate', r.confidence)"
        class="py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark text-sm font-semibold text-text-main dark:text-slate-200 hover:border-primary/50"
      >{{ t(`dailyPractice.rating.${r.key}`) }}</button>
    </div>
  </div>
</template>
