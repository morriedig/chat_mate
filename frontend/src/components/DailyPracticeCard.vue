<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDailyPractice } from '../composables/useDailyPractice'
import CmChip from './ui/CmChip.vue'

const { t } = useI18n()
const emit = defineEmits(['open'])
const { todayPatterns, todayWords, doneCount, totalCount, isDoneToday, ensureTodayPlan } = useDailyPractice()
// Mistake, saved-word and listening cards on top of the patterns and words
const extraCount = computed(() => totalCount.value - todayPatterns.value.length - todayWords.value.length)
const subtitle = computed(() => {
  if (isDoneToday.value) return t('dailyPractice.cardDone')
  const base = t('dailyPractice.cardSubtitle', { patterns: todayPatterns.value.length, words: todayWords.value.length })
  return extraCount.value > 0 ? base + t('dailyPractice.cardExtras', { count: extraCount.value }) : base
})

// Date may have rolled over since the app was opened
onMounted(ensureTodayPlan)
</script>

<template>
  <!-- div[role=button] (not <button>) so the card can hold block content.
       Step 1 is the current step until done: accent-soft fill + margin rule. -->
  <div
    role="button"
    tabindex="0"
    @click="emit('open')"
    @keydown.enter.prevent="emit('open')"
    @keydown.space.prevent="emit('open')"
    class="relative min-h-16 cursor-pointer rounded-[14px] border p-4 text-left shadow-[var(--cm-shadow-small)]"
    :class="isDoneToday ? 'border-hairline bg-surface' : 'border-accent/30 bg-accent-soft pl-[18px]'"
  >
    <span v-if="!isDoneToday" class="absolute left-0 top-3.5 h-9 w-[3px] rounded-r-[3px] bg-accent" aria-hidden="true"></span>
    <div class="flex items-start gap-2.5">
      <span
        class="material-symbols-outlined shrink-0"
        :class="isDoneToday ? 'text-success' : 'text-accent'"
        aria-hidden="true"
      >{{ isDoneToday ? 'task_alt' : 'school' }}</span>
      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-body font-medium text-ink">{{ t('dailyPractice.cardTitle') }}</h3>
          <span class="shrink-0 pt-0.5 text-meta text-ink-muted tabular-nums">{{ doneCount }} / {{ totalCount }}</span>
        </div>
        <p class="mt-0.5 text-caption" :class="isDoneToday ? 'text-success' : 'text-ink-secondary'">{{ subtitle }}</p>
        <div v-if="todayPatterns.length" class="mt-2 flex flex-wrap gap-1.5">
          <CmChip v-for="p in todayPatterns" :key="p.id" class="!bg-surface">{{ p.pattern }}</CmChip>
        </div>
      </div>
    </div>
  </div>
</template>
