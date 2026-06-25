<script setup>
import { computed } from 'vue'
import { useUserProgress } from '../../composables/useUserProgress'
import AchievementBadge from './AchievementBadge.vue'

const { unlockedAchievements, ACHIEVEMENTS, progress } = useUserProgress()

const categories = ['first_steps', 'consistency', 'learning', 'mastery']

const progressPercent = computed(() =>
  Math.round((unlockedAchievements.value.length / ACHIEVEMENTS.length) * 100)
)

function getAchievementsByCategory(category) {
  return ACHIEVEMENTS.filter(a => a.category === category)
}

function getUnlockedCount(category) {
  return getAchievementsByCategory(category).filter(a =>
    progress.value.unlockedAchievements.includes(a.id)
  ).length
}

function isUnlocked(achievementId) {
  return progress.value.unlockedAchievements.includes(achievementId)
}
</script>

<template>
  <div class="achievements-panel p-5">
    <!-- Header (screen-reader friendly text for tests) -->
    <p class="sr-only">{{ $t('achievements.unlocked') }}</p>

    <!-- Progress Header -->
    <div class="mb-5">
      <div class="flex items-baseline justify-between mb-2">
        <span class="text-2xl font-bold text-text-main dark:text-white">
          {{ unlockedAchievements.length }}<span class="text-sm font-medium text-text-muted dark:text-slate-400">/{{ ACHIEVEMENTS.length }}</span>
        </span>
        <span class="text-sm font-semibold text-amber-500">{{ progressPercent }}%</span>
      </div>
      <div class="progress-bar-container h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          class="progress-bar h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
          :style="{ width: `${progressPercent}%` }"
        ></div>
      </div>
    </div>

    <!-- Categories -->
    <div v-for="category in categories" :key="category" class="category-section mb-5 last:mb-0">
      <div class="flex items-center justify-between mb-2">
        <h4 class="text-[11px] font-bold uppercase tracking-wider text-text-muted dark:text-slate-500">
          {{ $t(`achievements.categories.${category}`) }}
        </h4>
        <span class="text-[11px] text-text-muted dark:text-slate-500 font-medium">
          {{ getUnlockedCount(category) }}/{{ getAchievementsByCategory(category).length }}
        </span>
      </div>
      <div class="achievements-grid flex flex-col gap-2">
        <AchievementBadge
          v-for="achievement in getAchievementsByCategory(category)"
          :key="achievement.id"
          :achievement="achievement"
          :is-unlocked="isUnlocked(achievement.id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
