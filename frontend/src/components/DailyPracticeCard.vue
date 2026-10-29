<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDailyPractice } from '../composables/useDailyPractice'

const { t } = useI18n()
const emit = defineEmits(['open'])
const { level, todayPatterns, todayWords, doneCount, totalCount, isDoneToday, ensureTodayPlan } = useDailyPractice()

// Date may have rolled over since the app was opened
onMounted(ensureTodayPlan)
</script>

<template>
  <!-- div[role=button] (not <button>) so the card can hold block content -->
  <div
    role="button"
    tabindex="0"
    @click="emit('open')"
    @keydown.enter.prevent="emit('open')"
    @keydown.space.prevent="emit('open')"
    class="cursor-pointer text-left p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
    :class="isDoneToday
      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
      : 'border-primary bg-gradient-to-br from-primary/15 to-amber-50 dark:from-primary/25 dark:to-amber-900/10'"
  >
    <div class="flex items-start gap-3">
      <span
        class="material-symbols-outlined text-2xl shrink-0"
        :class="isDoneToday ? 'text-green-500' : 'text-primary'"
      >{{ isDoneToday ? 'check_circle' : 'school' }}</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <h3 class="font-bold text-text-main dark:text-white">{{ t('dailyPractice.cardTitle') }}</h3>
          <span class="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-sky-700 dark:text-primary">
            {{ t(`levels.${level}.name`) }} · {{ doneCount }}/{{ totalCount }}
          </span>
        </div>
        <p class="text-sm text-text-muted dark:text-slate-400 mt-1">
          {{ isDoneToday
            ? t('dailyPractice.cardDone')
            : t('dailyPractice.cardSubtitle', { patterns: todayPatterns.length, words: todayWords.length }) }}
        </p>
        <div v-if="todayPatterns.length" class="flex flex-wrap gap-1.5 mt-2">
          <span
            v-for="p in todayPatterns"
            :key="p.id"
            class="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-text-main dark:text-slate-200 break-words max-w-full"
          >{{ p.pattern }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
