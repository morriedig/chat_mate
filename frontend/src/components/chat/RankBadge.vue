<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserProgress } from '../../composables/useUserProgress'
import AchievementsPanel from './AchievementsPanel.vue'
import CmBottomSheet from '../ui/CmBottomSheet.vue'

// Rank, streak and achievements as quiet text. No longer shown in the chat header
// (DESIGN.md: no XP/rank/streak in a conversation header); kept for other screens.
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
  <div class="relative flex items-center gap-1 text-meta text-ink-secondary tabular-nums">
    <!-- Achievements -->
    <button
      type="button"
      @click="showAchievements = !showAchievements"
      :aria-label="t('chat.achievements')"
      class="hidden min-h-11 items-center gap-1 rounded-[10px] px-2 active:bg-surface-raised min-[360px]:flex"
    >
      <span class="material-symbols-outlined !text-[18px] text-ink-muted" aria-hidden="true">military_tech</span>
      <span>{{ unlockedAchievements.length }}/{{ ACHIEVEMENTS.length }}</span>
    </button>

    <!-- Streak -->
    <div v-if="progress.currentStreak > 0" class="flex items-center gap-1 px-2">
      <span class="material-symbols-outlined !text-[18px] text-ink-muted" aria-hidden="true">event_available</span>
      <span>{{ progress.currentStreak }}</span>
      <span class="hidden sm:inline">{{ t('rank.days') }}</span>
      <span v-if="progress.streakFreezes > 0" class="ml-1 hidden items-center gap-0.5 sm:inline-flex" :title="t('rank.streakFreeze', { count: progress.streakFreezes })">
        <span class="material-symbols-outlined !text-[16px] text-ink-muted" aria-hidden="true">ac_unit</span>{{ progress.streakFreezes }}
      </span>
    </div>

    <!-- Rank (details are a hover tooltip, so phones skip it) -->
    <div class="group relative hidden sm:block">
      <div class="flex items-center gap-1.5 px-2">
        <span class="material-symbols-outlined !text-[18px] text-ink-muted" aria-hidden="true">trending_up</span>
        <span class="text-ink">Lv.{{ currentRank.level }}</span>
        <span>{{ t(`ranks.${currentRank.title.toLowerCase()}`, currentRank.title) }}</span>
      </div>

      <!-- Tooltip with details -->
      <div class="invisible absolute left-0 top-full z-50 mt-2 min-w-[200px] rounded-[10px] border border-hairline bg-surface p-3 opacity-0 shadow-[var(--cm-shadow-float)] transition-opacity group-hover:visible group-hover:opacity-100">
        <p class="mb-1 text-caption font-medium text-ink">
          Lv.{{ currentRank.level }} {{ t(`ranks.${currentRank.title.toLowerCase()}`, currentRank.title) }}
        </p>
        <p class="mb-2 text-meta text-ink-muted">{{ t('rank.totalXP', { xp: progress.totalXP }) }}</p>
        <div v-if="nextRank" class="space-y-1">
          <div class="flex justify-between text-meta">
            <span class="text-ink-muted">{{ t('rank.nextLevel') }}</span>
            <span class="text-ink">{{ xpToNextRank }} XP</span>
          </div>
          <div class="h-1 overflow-hidden bg-surface-raised">
            <div
              class="h-full w-full origin-left rounded-r-[2px] bg-accent"
              :style="{ transform: `scaleX(${progressToNextRank / 100})` }"
            ></div>
          </div>
        </div>
        <p v-else class="text-meta text-ink">{{ t('rank.maxLevel') }}</p>
        <div class="mt-2 space-y-0.5 border-t border-hairline pt-2 text-meta text-ink-muted">
          <p>{{ t('rank.messagesSent', { count: progress.messagesSent }) }}</p>
          <p>{{ t('rank.currentStreak', { count: progress.currentStreak }) }}</p>
          <p v-if="progress.longestStreak > 0">{{ t('rank.longestStreak', { count: progress.longestStreak }) }}</p>
        </div>
      </div>
    </div>

    <!-- XP progress (compact) -->
    <div v-if="nextRank" class="hidden items-center gap-1.5 px-1 sm:flex">
      <div class="rank-xp-bar h-1 w-16 overflow-hidden bg-surface-raised">
        <div
          class="h-full w-full origin-left rounded-r-[2px] bg-accent transition-transform duration-[180ms] ease-[var(--ease-cm)]"
          :style="{ transform: `scaleX(${progressToNextRank / 100})` }"
        ></div>
      </div>
      <span class="text-ink-muted">{{ progressToNextRank }}%</span>
    </div>

    <!-- Recent XP gain: plain text, fades -->
    <transition name="xp-note">
      <span
        v-if="recentXPGain"
        class="absolute -top-3 right-0 rounded-[6px] bg-success-soft px-1.5 text-meta font-medium text-success"
        role="status"
      >+{{ recentXPGain.amount }} XP</span>
    </transition>

    <CmBottomSheet
      v-if="showAchievements"
      :title="t('chat.achievements')"
      :description="t('chat.achievementsDescription')"
      :close-label="t('chat.close')"
      @close="showAchievements = false"
    >
      <AchievementsPanel class="-mx-5 -mt-4" />
    </CmBottomSheet>
  </div>
</template>

<style scoped>
.xp-note-enter-active,
.xp-note-leave-active {
  transition: opacity var(--motion-control) var(--ease-cm);
}
.xp-note-enter-from,
.xp-note-leave-to {
  opacity: 0;
}
</style>
