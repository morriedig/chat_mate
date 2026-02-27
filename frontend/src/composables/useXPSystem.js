import { ref, computed } from 'vue'

// Rank definitions with XP thresholds
export const RANKS = [
  { level: 1, title: 'Novice', minXP: 0, icon: '🌱' },
  { level: 2, title: 'Beginner', minXP: 100, icon: '🌿' },
  { level: 3, title: 'Learner', minXP: 300, icon: '🌳' },
  { level: 4, title: 'Speaker', minXP: 600, icon: '💬' },
  { level: 5, title: 'Conversationalist', minXP: 1000, icon: '🗣️' },
  { level: 6, title: 'Fluent', minXP: 1500, icon: '📚' },
  { level: 7, title: 'Advanced', minXP: 2200, icon: '🎓' },
  { level: 8, title: 'Expert', minXP: 3000, icon: '⭐' },
  { level: 9, title: 'Master', minXP: 4000, icon: '🏆' },
  { level: 10, title: 'Legend', minXP: 5500, icon: '👑' },
]

// XP rewards
export const XP_REWARDS = {
  userMessage: 5,
  systemMessage: 2,
  dailyStreak: 10,
  firstMessageOfDay: 5,
}

// Singleton UI state
export const recentXPGain = ref(null)
export const showLevelUp = ref(false)
export const newRank = ref(null)

let xpTimer = null

export function useXPSystem(progress, saveProgress) {
  const currentRank = computed(() => {
    const xp = progress.value.totalXP
    let rank = RANKS[0]
    for (const r of RANKS) {
      if (xp >= r.minXP) rank = r
      else break
    }
    return rank
  })

  const nextRank = computed(() => {
    const currentLevel = currentRank.value.level
    return RANKS.find(r => r.level === currentLevel + 1) || null
  })

  const xpToNextRank = computed(() => {
    if (!nextRank.value) return 0
    return nextRank.value.minXP - progress.value.totalXP
  })

  const progressToNextRank = computed(() => {
    if (!nextRank.value) return 100
    const current = currentRank.value
    const next = nextRank.value
    const xpInCurrentRank = progress.value.totalXP - current.minXP
    const xpNeededForNext = next.minXP - current.minXP
    return Math.min(100, Math.round((xpInCurrentRank / xpNeededForNext) * 100))
  })

  function addXP(amount, reason = 'action') {
    const previousRank = currentRank.value.level

    progress.value.totalXP += amount
    recentXPGain.value = { amount, reason }

    const newLevel = currentRank.value.level
    if (newLevel > previousRank) {
      newRank.value = currentRank.value
      showLevelUp.value = true
    }

    saveProgress()

    if (xpTimer) clearTimeout(xpTimer)
    xpTimer = setTimeout(() => {
      recentXPGain.value = null
    }, 2000)

    return amount
  }

  function dismissLevelUp() {
    showLevelUp.value = false
    newRank.value = null
  }

  function getAllRanks() {
    return RANKS
  }

  return {
    currentRank,
    nextRank,
    xpToNextRank,
    progressToNextRank,
    addXP,
    dismissLevelUp,
    getAllRanks,
  }
}
