<template>
  <div class="achievements-panel">
    <div class="panel-header">
      <h3 class="panel-title">{{ $t('achievements.unlocked') }}</h3>
      <span class="badge-count">{{ unlockedAchievements.length }}/{{ ACHIEVEMENTS.length }}</span>
    </div>

    <!-- Progress Bar -->
    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: `${progressPercent}%` }"></div>
    </div>

    <!-- Categories -->
    <div v-for="category in categories" :key="category" class="category-section">
      <h4 class="category-title">{{ $t(`achievements.categories.${category}`) }}</h4>
      <div class="achievements-grid">
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

<script setup>
import { computed } from 'vue'
import { useUserProgress } from '../../composables/useUserProgress'
import AchievementBadge from './AchievementBadge.vue'

const { unlockedAchievements, ACHIEVEMENTS, progress } = useUserProgress()

const categories = ['first_steps', 'consistency', 'learning', 'mastery']

const progressPercent = computed(() => {
  return Math.round((unlockedAchievements.value.length / ACHIEVEMENTS.length) * 100)
})

function getAchievementsByCategory(category) {
  return ACHIEVEMENTS.filter(a => a.category === category)
}

function isUnlocked(achievementId) {
  return progress.value.unlockedAchievements.includes(achievementId)
}
</script>

<style scoped>
.achievements-panel {
  padding: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.panel-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
}

.dark .panel-title {
  color: #f3f4f6;
}

.badge-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: #f59e0b;
}

.progress-bar-container {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 24px;
}

.dark .progress-bar-container {
  background: #374151;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.category-section {
  margin-bottom: 20px;
}

.category-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  margin-bottom: 12px;
}

.dark .category-title {
  color: #9ca3af;
}

.achievements-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
