<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserProgress } from '../composables/useUserProgress'

const { t } = useI18n()
const emit = defineEmits(['close'])

const { progress, currentRank, progressToNextRank } = useUserProgress()

// Generate last 30 days activity heatmap data
const heatmapData = computed(() => {
  const days = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    // Simulate activity based on streak data (in a real app, we'd track daily activity)
    const isActive = progress.value.lastActiveDate === dateStr ||
      (i === 0 && progress.value.currentStreak > 0)
    days.push({
      date: dateStr,
      day: date.getDate(),
      active: isActive,
      weekday: date.getDay(),
    })
  }
  return days
})

const stats = computed(() => [
  { label: 'Total XP', value: progress.value.totalXP, icon: 'star', color: 'text-amber-500' },
  { label: 'Messages', value: progress.value.messagesSent, icon: 'chat', color: 'text-blue-500' },
  { label: 'Streak', value: `${progress.value.currentStreak}d`, icon: 'local_fire_department', color: 'text-orange-500' },
  { label: 'Best Streak', value: `${progress.value.longestStreak}d`, icon: 'emoji_events', color: 'text-purple-500' },
  { label: 'Words', value: (progress.value.wordsLearned || []).length, icon: 'menu_book', color: 'text-green-500' },
  { label: 'Achievements', value: (progress.value.unlockedAchievements || []).length, icon: 'military_tech', color: 'text-pink-500' },
])

const rankProgress = computed(() => Math.round(progressToNextRank.value * 100))
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div class="fixed inset-0 z-[90] flex items-end justify-center">
        <div class="absolute inset-0 bg-black/40" @click="emit('close')" />
        <div class="relative w-full max-w-lg bg-surface-light dark:bg-surface-dark rounded-t-2xl p-6 pb-8 max-h-[80vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">analytics</span>
              Learning Analytics
            </h2>
            <button @click="emit('close')" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Rank Progress -->
          <div class="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 border border-primary/20">
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold text-text-main dark:text-white capitalize">{{ currentRank?.name || 'Novice' }}</span>
              <span class="text-sm text-text-muted dark:text-slate-400">{{ rankProgress }}%</span>
            </div>
            <div class="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div class="h-full rounded-full bg-primary transition-all" :style="{ width: `${rankProgress}%` }" />
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-3 gap-3 mb-6">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center"
            >
              <span class="material-symbols-outlined text-2xl" :class="stat.color">{{ stat.icon }}</span>
              <p class="text-lg font-bold text-text-main dark:text-white mt-1">{{ stat.value }}</p>
              <p class="text-xs text-text-muted dark:text-slate-400">{{ stat.label }}</p>
            </div>
          </div>

          <!-- 30-Day Activity -->
          <div class="mb-4">
            <h3 class="text-sm font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider mb-3">30-Day Activity</h3>
            <div class="grid grid-cols-10 gap-1">
              <div
                v-for="day in heatmapData"
                :key="day.date"
                class="aspect-square rounded-sm transition-colors"
                :class="day.active
                  ? 'bg-green-400 dark:bg-green-500'
                  : 'bg-slate-100 dark:bg-slate-800'"
                :title="day.date"
              />
            </div>
          </div>

          <!-- Characters Interacted -->
          <div v-if="Object.keys(progress.characterStats || {}).length > 0">
            <h3 class="text-sm font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider mb-3">Character Interactions</h3>
            <div class="space-y-2">
              <div
                v-for="(charStats, charId) in progress.characterStats"
                :key="charId"
                class="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <span class="font-medium text-text-main dark:text-white capitalize">{{ charId }}</span>
                <span class="text-sm text-text-muted dark:text-slate-400">{{ charStats.messages }} messages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
