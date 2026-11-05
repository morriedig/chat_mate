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
  <!-- Self-report, not correctness: neutral segments, accent-soft on press (DESIGN.md "Progress and rating") -->
  <div class="space-y-2" role="group" :aria-label="t('dailyPractice.howWell')">
    <p class="text-caption font-medium text-ink-secondary">{{ t('dailyPractice.howWell') }}</p>
    <div class="grid grid-cols-3 gap-1 rounded-[10px] bg-surface-raised p-1">
      <button
        v-for="r in RATINGS"
        :key="r.key"
        type="button"
        @click="emit('rate', r.confidence)"
        class="min-h-12 min-w-0 rounded-[8px] px-1 text-caption font-medium text-ink active:bg-accent-soft active:text-accent"
      >{{ t(`dailyPractice.rating.${r.key}`) }}</button>
    </div>
  </div>
</template>
