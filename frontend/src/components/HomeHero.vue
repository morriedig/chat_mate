<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserProgress } from '../composables/useUserProgress'
import { useDailyGoal } from '../composables/useDailyGoal'
import { useDailyPractice } from '../composables/useDailyPractice'
import { levelCode } from '../utils/levelCode'

// Home progress rail: today's minutes, streak and level in one 56 px row (DESIGN.md "Home").
// Rank and XP live in Learning analytics under More.
const { t } = useI18n()

const { progress } = useUserProgress()
const { todayMinutes, goalMinutes, isGoalMet } = useDailyGoal()
const { level } = useDailyPractice()

const streak = computed(() => progress.value.currentStreak || 0)
const minutes = computed(() => Math.floor(todayMinutes.value))
</script>

<template>
  <section :aria-label="t('home.railLabel')">
    <dl class="grid grid-cols-3 items-center rounded-[14px] border border-hairline bg-surface shadow-[var(--cm-shadow-small)] min-h-14">
      <div class="flex min-w-0 flex-col items-center px-1 py-2 text-center">
        <dt class="order-2 text-meta text-ink-muted">{{ t('home.railToday') }}</dt>
        <dd class="order-1 flex items-center gap-1 text-body font-medium text-ink tabular-nums">
          <span v-if="isGoalMet" class="material-symbols-outlined !text-[18px] text-success" :aria-label="t('home.goalMet')">check</span>
          {{ t('home.railMinutes', { count: minutes, goal: goalMinutes }) }}
        </dd>
      </div>
      <div class="flex min-w-0 flex-col items-center border-l border-hairline px-1 py-2 text-center">
        <dt class="order-2 text-meta text-ink-muted">{{ t('home.railStreak') }}</dt>
        <dd class="order-1 text-body font-medium text-ink tabular-nums">{{ t('home.railDays', { count: streak }, streak) }}</dd>
      </div>
      <div class="flex min-w-0 flex-col items-center border-l border-hairline px-1 py-2 text-center">
        <dt class="order-2 text-meta text-ink-muted">{{ t(`levels.${level}.name`) }}</dt>
        <dd class="order-1 text-body font-medium text-ink tabular-nums">{{ levelCode(level) }}</dd>
      </div>
    </dl>
    <p v-if="streak === 0" class="mt-2 px-1 text-meta text-ink-muted">{{ t('home.startStreak', { goal: goalMinutes }) }}</p>
  </section>
</template>
