<script setup>
import { computed } from 'vue'
import { useUserProgress } from '../../composables/useUserProgress'
import { achievementIcon } from './achievementIcon'

const props = defineProps({
  achievement: { type: Object, required: true },
  isUnlocked: { type: Boolean, default: false },
  // Unlocked since the user last opened achievements (quiet label, no modal)
  isNew: { type: Boolean, default: false },
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
    class="achievement-badge flex items-center gap-3 rounded-[14px] border border-hairline p-3"
    :class="isUnlocked ? 'unlocked bg-surface' : 'locked bg-surface-sunken'"
    :title="isUnlocked ? '' : $t(`achievements.${achievement.id}.hint`)"
  >
    <div
      class="badge-icon flex size-11 shrink-0 items-center justify-center rounded-[10px]"
      :class="isUnlocked ? 'bg-accent-soft text-accent' : 'bg-surface-raised text-ink-muted'"
    >
      <span class="material-symbols-outlined" aria-hidden="true">{{ isUnlocked ? achievementIcon(achievement) : 'lock' }}</span>
    </div>

    <div class="badge-info flex min-w-0 flex-1 flex-col gap-0.5">
      <span class="flex min-w-0 items-center gap-2">
        <span
          class="badge-title min-w-0 truncate text-caption font-medium"
          :class="isUnlocked ? 'text-ink' : 'text-ink-secondary'"
        >
          {{ $t(`achievements.${achievement.id}.title`) }}
        </span>
        <span v-if="isNew && isUnlocked" class="badge-new shrink-0 rounded-[6px] bg-accent-soft px-1.5 text-meta font-medium text-accent">{{ $t('progressPanel.new') }}</span>
      </span>
      <span class="badge-desc line-clamp-2 text-meta text-ink-muted">
        {{ $t(`achievements.${achievement.id}.description`) }}
      </span>
      <span class="sr-only">{{ isUnlocked ? $t('achievements.unlockedState') : $t('achievements.lockedState') }}</span>
      <!-- Progress for locked -->
      <div v-if="!isUnlocked && progressInfo" class="mt-1.5">
        <div class="mb-1 flex items-center justify-between text-meta text-ink-muted tabular-nums">
          <span>{{ progressInfo.current }} / {{ progressInfo.target }}</span>
          <span>{{ progressInfo.pct }}%</span>
        </div>
        <div class="h-1 overflow-hidden bg-surface-raised">
          <div
            class="h-full w-full origin-left rounded-r-[2px] bg-accent transition-transform duration-[180ms] ease-[var(--ease-cm)]"
            :style="{ transform: `scaleX(${progressInfo.pct / 100})` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
