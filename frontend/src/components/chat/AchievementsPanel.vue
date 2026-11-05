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

    <!-- Progress -->
    <div class="mb-6">
      <div class="mb-2 flex items-baseline justify-between">
        <span class="text-section font-medium text-ink tabular-nums">
          {{ unlockedAchievements.length }}<span class="text-caption font-normal text-ink-muted">/{{ ACHIEVEMENTS.length }}</span>
        </span>
        <span class="text-meta text-ink-muted tabular-nums">{{ progressPercent }}%</span>
      </div>
      <div class="progress-bar-container h-1 overflow-hidden bg-surface-raised" role="progressbar" :aria-valuenow="unlockedAchievements.length" :aria-valuemax="ACHIEVEMENTS.length">
        <div
          class="progress-bar h-full w-full origin-left rounded-r-[2px] bg-accent transition-transform duration-[180ms] ease-[var(--ease-cm)]"
          :style="{ transform: `scaleX(${progressPercent / 100})` }"
        ></div>
      </div>
    </div>

    <!-- Categories -->
    <section v-for="category in categories" :key="category" class="category-section mb-6 last:mb-0">
      <div class="mb-2 flex items-center justify-between">
        <h4 class="text-caption font-medium text-ink-secondary">
          {{ $t(`achievements.categories.${category}`) }}
        </h4>
        <span class="text-meta text-ink-muted tabular-nums">
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
    </section>
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
