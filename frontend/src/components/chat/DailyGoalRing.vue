<script setup>
import { useI18n } from 'vue-i18n'
import { useDailyGoal } from '../../composables/useDailyGoal'

// Compact daily-goal ring. Not shown in the chat header any more (DESIGN.md); kept for reuse.
const { t } = useI18n()
const { progress, isGoalMet, todayMinutes, goalMinutes } = useDailyGoal()

const radius = 16
const circumference = 2 * Math.PI * radius
</script>

<template>
  <div
    class="relative flex size-11 items-center justify-center"
    role="img"
    :aria-label="t('dailyGoal.progress', { current: Math.floor(todayMinutes), goal: goalMinutes })"
    :title="t('dailyGoal.progress', { current: Math.floor(todayMinutes), goal: goalMinutes })"
  >
    <svg width="40" height="40" class="-rotate-90" aria-hidden="true">
      <circle
        :r="radius"
        cx="20" cy="20"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        class="text-surface-raised"
      />
      <circle
        :r="radius"
        cx="20" cy="20"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="circumference * (1 - progress)"
        class="transition-[stroke-dashoffset] duration-[180ms]"
        :class="isGoalMet ? 'text-success' : 'text-accent'"
      />
    </svg>
    <span class="absolute text-meta font-medium tabular-nums" :class="isGoalMet ? 'text-success' : 'text-ink'" aria-hidden="true">
      <span v-if="isGoalMet" class="material-symbols-outlined !text-[16px]">check</span>
      <template v-else>{{ Math.floor(todayMinutes) }}</template>
    </span>
  </div>
</template>
