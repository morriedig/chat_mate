<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserProgress } from '../../composables/useUserProgress'
import AchievementsPanel from './AchievementsPanel.vue'

const { t } = useI18n()
const {
  progress,
  currentRank,
  nextRank,
  progressToNextRank,
  xpToNextRank,
  recentXPGain,
  unlockedAchievements,
  ACHIEVEMENTS
} = useUserProgress()

const showAchievements = ref(false)
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Achievements Button -->
    <button
      @click="showAchievements = !showAchievements"
      class="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-200 dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-500 transition-colors"
    >
      <span class="text-base">🏆</span>
      <span class="text-xs font-bold text-yellow-600 dark:text-yellow-400">{{ unlockedAchievements.length }}/{{ ACHIEVEMENTS.length }}</span>
    </button>

    <!-- Streak Badge -->
    <div v-if="progress.currentStreak > 0" class="flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border border-red-200 dark:border-red-700">
      <span class="text-base animate-pulse">🔥</span>
      <span class="text-xs font-bold text-red-600 dark:text-red-400">{{ progress.currentStreak }}</span>
      <span class="hidden sm:inline text-[10px] text-red-500 dark:text-red-400">{{ t('rank.days') }}</span>
    </div>

    <!-- Rank Badge -->
    <div class="relative group">
      <div class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-700">
        <span class="text-base">{{ currentRank.icon }}</span>
        <div class="flex flex-col">
          <span class="text-xs font-semibold text-amber-800 dark:text-amber-200 leading-tight">
            {{ t(`ranks.${currentRank.title.toLowerCase()}`, currentRank.title) }}
          </span>
          <span class="text-[10px] text-amber-600 dark:text-amber-400 leading-tight">
            Lv.{{ currentRank.level }}
          </span>
        </div>
      </div>

      <!-- Tooltip with details -->
      <div class="absolute top-full left-0 mt-2 p-3 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[180px]">
        <div class="text-sm font-semibold text-text-main dark:text-white mb-2">
          {{ currentRank.icon }} {{ t(`ranks.${currentRank.title.toLowerCase()}`, currentRank.title) }}
        </div>
        <div class="text-xs text-text-muted dark:text-slate-400 mb-2">
          {{ t('rank.totalXP', { xp: progress.totalXP }) }}
        </div>
        <div v-if="nextRank" class="space-y-1">
          <div class="flex justify-between text-xs">
            <span class="text-text-muted dark:text-slate-400">{{ t('rank.nextLevel') }}</span>
            <span class="text-amber-600 dark:text-amber-400">{{ xpToNextRank }} XP</span>
          </div>
          <div class="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
              :style="{ width: `${progressToNextRank}%` }"
            ></div>
          </div>
        </div>
        <div v-else class="text-xs text-amber-600 dark:text-amber-400">
          {{ t('rank.maxLevel') }}
        </div>
        <div class="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-text-muted dark:text-slate-400 space-y-1">
          <div>{{ t('rank.messagesSent', { count: progress.messagesSent }) }}</div>
          <div class="flex items-center gap-1">
            <span>🔥</span>
            <span>{{ t('rank.currentStreak', { count: progress.currentStreak }) }}</span>
          </div>
          <div v-if="progress.longestStreak > 0" class="text-amber-600 dark:text-amber-400">
            {{ t('rank.longestStreak', { count: progress.longestStreak }) }}
          </div>
        </div>
      </div>
    </div>

    <!-- XP Progress Bar (compact) -->
    <div v-if="nextRank" class="hidden sm:flex items-center gap-1.5">
      <div class="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
          :style="{ width: `${progressToNextRank}%` }"
        ></div>
      </div>
      <span class="text-[10px] text-text-muted dark:text-slate-400">{{ progressToNextRank }}%</span>
    </div>

    <!-- Recent XP Gain Animation -->
    <transition name="xp-popup">
      <div
        v-if="recentXPGain"
        class="absolute -top-2 right-0 px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold shadow-lg"
      >
        +{{ recentXPGain.amount }} XP
      </div>
    </transition>

    <!-- Achievements Panel Popup -->
    <Teleport to="body">
      <Transition name="panel">
        <div v-if="showAchievements" class="achievements-overlay" @click.self="showAchievements = false">
          <div class="achievements-popup">
            <div class="popup-header">
              <h2 class="popup-title">🏆 {{ $t('achievements.unlocked') }}</h2>
              <button @click="showAchievements = false" class="close-btn">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <AchievementsPanel />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.xp-popup-enter-active {
  animation: xpPopup 0.5s ease-out;
}

.xp-popup-leave-active {
  animation: xpFade 0.3s ease-in forwards;
}

@keyframes xpPopup {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.8);
  }
  50% {
    transform: translateY(-5px) scale(1.1);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes xpFade {
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* Achievements Panel */
.achievements-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.achievements-popup {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.dark .achievements-popup {
  background: #1f2937;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.dark .popup-header {
  border-bottom-color: #374151;
}

.popup-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
}

.dark .popup-title {
  color: #f3f4f6;
}

.close-btn {
  padding: 4px;
  border-radius: 8px;
  color: #6b7280;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
}

.dark .close-btn:hover {
  background: #374151;
}

.achievements-popup :deep(.achievements-panel) {
  max-height: calc(80vh - 60px);
  overflow-y: auto;
}

/* Panel transitions */
.panel-enter-active,
.panel-leave-active {
  transition: all 0.3s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}

.panel-enter-from .achievements-popup,
.panel-leave-to .achievements-popup {
  transform: scale(0.95);
}
</style>
