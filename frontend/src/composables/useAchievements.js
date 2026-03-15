import { ref, computed } from 'vue'

// Achievement definitions
export const ACHIEVEMENTS = [
  // First Steps
  { id: 'first_chat', category: 'first_steps', icon: '💬', condition: (p) => p.messagesSent >= 1 },
  { id: 'ice_breaker', category: 'first_steps', icon: '🧊', condition: (p) => p.messagesSent >= 10 },
  { id: 'chatterbox', category: 'first_steps', icon: '🗣️', condition: (p) => p.messagesSent >= 100 },
  // Consistency
  { id: 'streak_3', category: 'consistency', icon: '🔥', condition: (p) => p.longestStreak >= 3 },
  { id: 'streak_7', category: 'consistency', icon: '⚡', condition: (p) => p.longestStreak >= 7 },
  { id: 'streak_30', category: 'consistency', icon: '🌟', condition: (p) => p.longestStreak >= 30 },
  // Learning
  { id: 'word_collector', category: 'learning', icon: '📝', condition: (p) => p.wordsLearned.length >= 10 },
  { id: 'bookworm', category: 'learning', icon: '📚', condition: (p) => p.articlesCompleted.length >= 5 },
  { id: 'polyglot', category: 'learning', icon: '🌍', condition: (p) => Object.keys(p.characterStats).length >= 3 },
  // Writing (diary)
  { id: 'diary_first', category: 'writing', icon: '📓', condition: (p) => p.diaryEntries >= 1 },
  { id: 'diary_week', category: 'writing', icon: '📖', condition: (p) => p.diaryEntries >= 7 },
  { id: 'diary_month', category: 'writing', icon: '📘', condition: (p) => p.diaryEntries >= 30 },
  { id: 'diary_vocab_5', category: 'writing', icon: '🧵', condition: (p) => p.diaryVocabUsed >= 5 },
  { id: 'diary_vocab_25', category: 'writing', icon: '📕', condition: (p) => p.diaryVocabUsed >= 25 },
  { id: 'diary_streak_7', category: 'writing', icon: '🖋️', condition: (p) => p.longestDiaryStreak >= 7 },
  { id: 'diary_long', category: 'writing', icon: '💭', condition: (p) => p.hasWrittenLongEntry === true },
  { id: 'diary_100', category: 'writing', icon: '🏛️', condition: (p) => p.diaryEntries >= 100 },
  // Mastery (rank-based)
  { id: 'level_beginner', category: 'mastery', icon: '🌿', condition: (p) => p.totalXP >= 100 },
  { id: 'level_speaker', category: 'mastery', icon: '💬', condition: (p) => p.totalXP >= 600 },
  { id: 'level_legend', category: 'mastery', icon: '👑', condition: (p) => p.totalXP >= 5500 },
]

// Singleton UI state
export const showAchievementUnlock = ref(false)
export const newAchievement = ref(null)

export function useAchievements(progress, saveProgress) {
  const unlockedAchievements = computed(() => {
    return ACHIEVEMENTS.filter(a => progress.value.unlockedAchievements.includes(a.id))
  })

  const lockedAchievements = computed(() => {
    return ACHIEVEMENTS.filter(a => !progress.value.unlockedAchievements.includes(a.id))
  })

  function checkAchievements() {
    for (const achievement of ACHIEVEMENTS) {
      if (!progress.value.unlockedAchievements.includes(achievement.id)) {
        if (achievement.condition(progress.value)) {
          progress.value.unlockedAchievements.push(achievement.id)
          newAchievement.value = achievement
          showAchievementUnlock.value = true
          saveProgress()
          return true
        }
      }
    }
    return false
  }

  function dismissAchievementUnlock() {
    showAchievementUnlock.value = false
    newAchievement.value = null
    setTimeout(() => checkAchievements(), 300)
  }

  return {
    unlockedAchievements,
    lockedAchievements,
    checkAchievements,
    dismissAchievementUnlock,
  }
}
