<script setup>
import { useI18n } from 'vue-i18n'
import { useUserProgress } from '../../composables/useUserProgress'

const { t } = useI18n()
const {
  progress,
  currentRank,
  nextRank,
  progressToNextRank,
  xpToNextRank,
  recentXPGain
} = useUserProgress()
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Streak Badge -->
    <div v-if="progress.currentStreak > 0" class="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border border-red-200 dark:border-red-700">
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
</style>
