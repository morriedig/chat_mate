<script setup>
import { useI18n } from 'vue-i18n'
import { useDailyGoal } from '../../composables/useDailyGoal'

const { t } = useI18n()
const { progress, isGoalMet, todayMinutes, goalMinutes } = useDailyGoal()

const radius = 16
const circumference = 2 * Math.PI * radius
</script>

<template>
  <div class="relative flex items-center justify-center" :title="t('dailyGoal.progress', { current: Math.floor(todayMinutes), goal: goalMinutes })">
    <svg width="40" height="40" class="transform -rotate-90">
      <!-- Background circle -->
      <circle
        :r="radius"
        cx="20" cy="20"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        class="text-slate-200 dark:text-slate-700"
      />
      <!-- Progress circle -->
      <circle
        :r="radius"
        cx="20" cy="20"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="circumference * (1 - progress)"
        class="transition-all duration-500"
        :class="isGoalMet ? 'text-green-500' : 'text-primary'"
      />
    </svg>
    <span class="absolute text-[10px] font-bold" :class="isGoalMet ? 'text-green-500' : 'text-text-main dark:text-slate-200'">
      <span v-if="isGoalMet" class="material-symbols-outlined text-xs">check</span>
      <template v-else>{{ Math.floor(todayMinutes) }}</template>
    </span>
  </div>
</template>
