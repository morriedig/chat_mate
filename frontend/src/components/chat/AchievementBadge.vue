<script setup>
import { computed } from 'vue'
import { useUserProgress } from '../../composables/useUserProgress'

const props = defineProps({
  achievement: { type: Object, required: true },
  isUnlocked: { type: Boolean, default: false },
})

const { progress } = useUserProgress()

// For measurable achievements, try to derive a progress fraction
const progressInfo = computed(() => {
  if (props.isUnlocked) return null
  const p = progress.value
  const id = props.achievement.id

  // (current, target) tuples per achievement — keeps definitions simple
  const map = {
    first_chat: [p.messagesSent, 1],
    ice_breaker: [p.messagesSent, 10],
    chatterbox: [p.messagesSent, 100],
    streak_3: [p.longestStreak, 3],
    streak_7: [p.longestStreak, 7],
    streak_30: [p.longestStreak, 30],
    word_collector: [p.wordsLearned?.length || 0, 10],
    bookworm: [p.articlesCompleted?.length || 0, 5],
    polyglot: [Object.keys(p.characterStats || {}).length, 3],
    diary_first: [p.diaryEntries, 1],
    diary_week: [p.diaryEntries, 7],
    diary_month: [p.diaryEntries, 30],
    diary_100: [p.diaryEntries, 100],
    diary_vocab_5: [p.diaryVocabUsed, 5],
    diary_vocab_25: [p.diaryVocabUsed, 25],
    diary_streak_7: [p.longestDiaryStreak, 7],
    first_character: [p.preLessonStats?.totalCharactersLearned || 0, 1],
    hiragana_10: [p.preLessonStats?.totalCharactersLearned || 0, 10],
    hiragana_master: [p.preLessonStats?.totalCharactersLearned || 0, 46],
    script_scholar: [p.preLessonStats?.totalPreLessonsCompleted || 0, 5],
    level_beginner: [p.totalXP, 100],
    level_speaker: [p.totalXP, 600],
    level_legend: [p.totalXP, 5500],
  }
  const tuple = map[id]
  if (!tuple) return null
  const [current, target] = tuple
  if (!target) return null
  return {
    current: Math.min(current, target),
    target,
    pct: Math.min(100, Math.round((current / target) * 100)),
  }
})
</script>

<template>
  <div
    class="achievement-badge flex items-center gap-3 p-3 rounded-xl transition-all"
    :class="[
      isUnlocked
        ? 'unlocked bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-900/30 dark:to-amber-900/10 border border-amber-300/60 dark:border-amber-700/50'
        : 'locked bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 opacity-80'
    ]"
    :title="isUnlocked ? '' : $t(`achievements.${achievement.id}.hint`)"
  >
    <div
      class="badge-icon shrink-0 flex items-center justify-center w-12 h-12 rounded-full text-2xl shadow-sm transition-all"
      :class="isUnlocked
        ? 'bg-white dark:bg-slate-700 shadow-amber-200/40 dark:shadow-amber-900/30'
        : 'bg-white/60 dark:bg-slate-800 grayscale'"
    >
      <span v-if="isUnlocked">{{ achievement.icon }}</span>
      <span v-else class="locked-icon text-slate-400 dark:text-slate-500">🔒</span>
    </div>

    <div class="badge-info flex flex-col gap-0.5 flex-1 min-w-0">
      <span
        class="badge-title text-sm font-semibold truncate"
        :class="isUnlocked ? 'text-text-main dark:text-white' : 'text-text-muted dark:text-slate-400'"
      >
        {{ $t(`achievements.${achievement.id}.title`) }}
      </span>
      <span class="badge-desc text-xs text-text-muted dark:text-slate-400 line-clamp-2 leading-snug">
        {{ $t(`achievements.${achievement.id}.description`) }}
      </span>
      <!-- Progress for locked -->
      <div v-if="!isUnlocked && progressInfo" class="mt-1.5">
        <div class="flex items-center justify-between text-[10px] text-text-muted dark:text-slate-500 mb-1">
          <span>{{ progressInfo.current }} / {{ progressInfo.target }}</span>
          <span>{{ progressInfo.pct }}%</span>
        </div>
        <div class="h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            class="h-full rounded-full bg-amber-400 dark:bg-amber-500 transition-all duration-500"
            :style="{ width: `${progressInfo.pct}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
