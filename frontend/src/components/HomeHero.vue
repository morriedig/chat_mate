<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserProgress } from '../composables/useUserProgress'
import { useDailyGoal } from '../composables/useDailyGoal'
import { STREAK_MILESTONES } from '../composables/useStreakTracker'
import { useCharacterMemory } from '../composables/useCharacterMemory'
import { characters } from '../data/characters'

const { t } = useI18n()

defineProps({
  compact: { type: Boolean, default: false },
})

const { progress, currentRank, progressToNextRank } = useUserProgress()
const { todayMinutes, goalMinutes, progress: goalProgress, isGoalMet } = useDailyGoal()
const { getAllCharactersWithMemories } = useCharacterMemory()

const streak = computed(() => progress.value.currentStreak || 0)
const longestStreak = computed(() => progress.value.longestStreak || 0)
const totalXP = computed(() => progress.value.totalXP || 0)

// Next milestone
const nextMilestone = computed(() => {
  return STREAK_MILESTONES.find(m => m.days > streak.value) || null
})
const daysToMilestone = computed(() => {
  if (!nextMilestone.value) return null
  return nextMilestone.value.days - streak.value
})

// Rank progress
const rankProgressPct = computed(() => Math.round((progressToNextRank.value || 0) * 100))

// Daily goal ring math
const goalPct = computed(() => Math.min(1, goalProgress.value))
const radius = 26
const circumference = 2 * Math.PI * radius
const goalDashOffset = computed(() => circumference * (1 - goalPct.value))

// Character affinity: who does the user know best?
const topCharacter = ref(null)
onMounted(() => {
  const chars = getAllCharactersWithMemories()
  if (!chars.length) return
  const sorted = chars.sort((a, b) => (b.meta?.conversationCount || 0) - (a.meta?.conversationCount || 0))
  const top = sorted[0]
  if (top?.meta?.conversationCount > 0) {
    topCharacter.value = characters.find(c => c.id === top.characterId)
  }
})

// Greeting based on time of day
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 5) return 'Still up?'
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 22) return 'Good evening'
  return 'Late night?'
})
</script>

<template>
  <section class="mb-6">
    <div class="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-primary/10 via-surface-light to-rose-50 dark:from-primary/20 dark:via-surface-dark dark:to-slate-900 border border-primary/10 dark:border-primary/20 shadow-sm">
      <!-- Decorative glow -->
      <div class="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary/10 dark:bg-primary/20 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-rose-200/30 dark:bg-rose-900/20 blur-3xl pointer-events-none"></div>

      <div class="relative flex items-start justify-between gap-4">
        <div class="flex-1 min-w-0">
          <!-- Greeting -->
          <p class="text-xs font-medium text-text-muted dark:text-slate-400 mb-1">{{ greeting }}</p>

          <!-- Streak (or welcome) -->
          <div v-if="streak > 0" class="flex items-baseline gap-2 mb-1">
            <span class="text-3xl sm:text-4xl font-bold tracking-tight text-text-main dark:text-white">{{ streak }}</span>
            <span class="text-sm font-semibold text-text-muted dark:text-slate-300">day streak 🔥</span>
          </div>
          <div v-else class="mb-1">
            <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-text-main dark:text-white">
              Let's start a streak
            </h2>
          </div>

          <!-- Subtitle -->
          <p class="text-xs text-text-muted dark:text-slate-400">
            <template v-if="streak > 0 && nextMilestone">
              {{ daysToMilestone }} more to {{ nextMilestone.icon }} {{ nextMilestone.days }}-day milestone · {{ totalXP }} XP total
            </template>
            <template v-else-if="streak > 0">
              {{ longestStreak === streak ? 'Your longest streak ever' : `Best: ${longestStreak} days` }} · {{ totalXP }} XP
            </template>
            <template v-else>
              Chat, learn, or write — any activity counts toward your daily streak.
            </template>
          </p>
        </div>

        <!-- Daily Goal Ring -->
        <div class="shrink-0 flex flex-col items-center gap-1">
          <div class="relative">
            <svg :width="radius * 2 + 8" :height="radius * 2 + 8" class="-rotate-90">
              <circle
                :cx="radius + 4"
                :cy="radius + 4"
                :r="radius"
                fill="none"
                stroke="currentColor"
                stroke-width="4"
                class="text-slate-200 dark:text-slate-700"
              />
              <circle
                :cx="radius + 4"
                :cy="radius + 4"
                :r="radius"
                fill="none"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="goalDashOffset"
                class="transition-all duration-500"
                :class="isGoalMet ? 'text-green-500' : 'text-primary'"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span v-if="isGoalMet" class="material-symbols-outlined text-green-500 text-[22px]">check</span>
              <span v-else class="text-[13px] font-bold text-text-main dark:text-white">{{ Math.floor(todayMinutes) }}m</span>
            </div>
          </div>
          <span class="text-[10px] text-text-muted dark:text-slate-400">/{{ goalMinutes }}m today</span>
        </div>
      </div>

      <!-- Rank progress bar -->
      <div v-if="currentRank" class="relative mt-5">
        <div class="flex items-center justify-between text-[11px] mb-1.5">
          <span class="font-semibold text-text-muted dark:text-slate-300 capitalize">
            <span class="mr-1">{{ currentRank.icon || '⭐' }}</span>{{ currentRank.name }}
          </span>
          <span class="text-text-muted dark:text-slate-500">{{ rankProgressPct }}%</span>
        </div>
        <div class="h-1.5 rounded-full bg-white/40 dark:bg-slate-800/60 overflow-hidden">
          <div class="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-700" :style="{ width: `${rankProgressPct}%` }"></div>
        </div>
      </div>

      <!-- Top character affinity (hidden when compact) -->
      <div v-if="!compact && topCharacter" class="relative mt-4 flex items-center gap-2 text-xs text-text-muted dark:text-slate-400">
        <span class="text-base">{{ topCharacter.avatar }}</span>
        <span>{{ topCharacter.name }} remembers things about you</span>
      </div>
    </div>
  </section>
</template>
