<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserProgress } from '../composables/useUserProgress'

const { t } = useI18n()
const emit = defineEmits(['close'])

const { progress, currentRank, progressToNextRank } = useUserProgress()

function localDateKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Generate last 30 days activity heatmap using real activityLog
const heatmapData = computed(() => {
  const log = progress.value.activityLog || {}
  const days = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const key = localDateKey(date)
    const entry = log[key]
    const total = entry ? (entry.messages || 0) + (entry.diary || 0) * 3 : 0
    // 4-tier intensity: 0=none, 1=light (1-3), 2=medium (4-10), 3=heavy (11+)
    let level = 0
    if (total > 0) level = 1
    if (total >= 4) level = 2
    if (total >= 11) level = 3
    days.push({
      date: key,
      day: date.getDate(),
      level,
      total,
      weekday: date.getDay(),
    })
  }
  return days
})

const hasAnyActivity = computed(() => heatmapData.value.some(d => d.level > 0))

function intensityClass(level) {
  if (level === 0) return 'bg-slate-100 dark:bg-slate-800'
  if (level === 1) return 'bg-green-200 dark:bg-green-900'
  if (level === 2) return 'bg-green-400 dark:bg-green-600'
  return 'bg-green-500 dark:bg-green-400'
}

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
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider">30-Day Activity</h3>
              <div v-if="hasAnyActivity" class="flex items-center gap-1 text-[10px] text-text-muted dark:text-slate-500">
                <span>Less</span>
                <span class="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-slate-800"></span>
                <span class="w-2.5 h-2.5 rounded-sm bg-green-200 dark:bg-green-900"></span>
                <span class="w-2.5 h-2.5 rounded-sm bg-green-400 dark:bg-green-600"></span>
                <span class="w-2.5 h-2.5 rounded-sm bg-green-500 dark:bg-green-400"></span>
                <span>More</span>
              </div>
            </div>
            <div v-if="!hasAnyActivity" class="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center">
              <span class="material-symbols-outlined text-2xl text-slate-300 dark:text-slate-600 mb-1 block">timeline</span>
              <p class="text-xs text-text-muted dark:text-slate-400">
                Your activity heatmap fills in as you chat, study, and write diary entries.
              </p>
            </div>
            <div v-else class="grid grid-cols-10 gap-1">
              <div
                v-for="day in heatmapData"
                :key="day.date"
                class="aspect-square rounded-sm transition-colors"
                :class="intensityClass(day.level)"
                :title="`${day.date} · ${day.total} ${day.total === 1 ? 'activity' : 'activities'}`"
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
