<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserProgress } from '../composables/useUserProgress'
import { useDailyGoal } from '../composables/useDailyGoal'
import { useDailyPractice } from '../composables/useDailyPractice'
import { levelCode } from '../utils/levelCode'

// Home progress rail: streak and practice level in one 56 px row (DESIGN.md "Home").
// Daily goal minutes, rank, XP and achievements live in More → 進度與成就.
const { t } = useI18n()

const { progress } = useUserProgress()
const { goalMinutes } = useDailyGoal()
const { level } = useDailyPractice()

const streak = computed(() => progress.value.currentStreak || 0)
</script>

<template>
  <section :aria-label="t('home.railLabel')">
    <dl class="grid grid-cols-2 items-center rounded-[14px] border border-hairline bg-surface shadow-[var(--cm-shadow-small)] min-h-14">
      <div class="flex min-w-0 flex-col items-center px-1 py-2 text-center">
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
