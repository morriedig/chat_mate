import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'chatmate_userProgress'

// Rank definitions with XP thresholds
const RANKS = [
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

// XP rewards (Duolingo-style simple rules)
const XP_REWARDS = {
  userMessage: 5,      // User sends a message: +5 XP
  systemMessage: 2,    // AI responds: +2 XP
  dailyStreak: 10,     // Daily streak bonus
  firstMessageOfDay: 5, // First message of the day bonus
}

// Streak milestones with bonus XP
const STREAK_MILESTONES = [
  { days: 3, bonus: 15, icon: '🔥' },
  { days: 7, bonus: 35, icon: '⚡' },
  { days: 14, bonus: 70, icon: '💪' },
  { days: 30, bonus: 150, icon: '🌟' },
  { days: 60, bonus: 300, icon: '💎' },
  { days: 100, bonus: 500, icon: '🏆' },
  { days: 365, bonus: 1825, icon: '👑' },
]

function getDefaultProgress() {
  return {
    totalXP: 0,
    messagesSent: 0,
    messagesReceived: 0,
    articlesStarted: [],
    articlesCompleted: [],
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    totalSessionMinutes: 0,
    wordsLearned: [],
    characterStats: {},
    claimedMilestones: [], // Track which streak milestones have been claimed
  }
}

function loadProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...getDefaultProgress(), ...JSON.parse(stored) }
    }
  } catch {
    // ignore
  }
  return getDefaultProgress()
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

// Singleton state
const progress = ref(loadProgress())
const recentXPGain = ref(null)
const showLevelUp = ref(false)
const newRank = ref(null)
const showStreakMilestone = ref(false)
const currentMilestone = ref(null)

export function useUserProgress() {
  // Computed properties
  const currentRank = computed(() => {
    const xp = progress.value.totalXP
    let rank = RANKS[0]
    for (const r of RANKS) {
      if (xp >= r.minXP) {
        rank = r
      } else {
        break
      }
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

  // Check for streak milestones
  function checkStreakMilestone(streakDays) {
    for (const milestone of STREAK_MILESTONES) {
      if (streakDays === milestone.days && !progress.value.claimedMilestones.includes(milestone.days)) {
        // Claim this milestone
        progress.value.claimedMilestones.push(milestone.days)
        // Award bonus XP
        addXP(milestone.bonus, 'streakMilestone')
        // Show milestone notification
        currentMilestone.value = milestone
        showStreakMilestone.value = true
        return true
      }
    }
    return false
  }

  // Check and update streak
  function updateStreak() {
    const today = new Date().toDateString()
    const lastActive = progress.value.lastActiveDate

    if (lastActive !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      if (lastActive === yesterday.toDateString()) {
        // Consecutive day - increase streak
        progress.value.currentStreak += 1
        if (progress.value.currentStreak > progress.value.longestStreak) {
          progress.value.longestStreak = progress.value.currentStreak
        }
        // Award streak bonus
        addXP(XP_REWARDS.dailyStreak, 'streak')
        // Check for milestone achievement
        checkStreakMilestone(progress.value.currentStreak)
      } else if (lastActive !== today) {
        // Streak broken - reset to 1
        progress.value.currentStreak = 1
      }

      // First message of day bonus
      addXP(XP_REWARDS.firstMessageOfDay, 'firstOfDay')
      progress.value.lastActiveDate = today
    }
  }

  // Add XP (simple Duolingo-style)
  function addXP(amount, reason = 'action') {
    const previousRank = currentRank.value.level

    progress.value.totalXP += amount
    recentXPGain.value = { amount, reason }

    // Check for level up
    const newLevel = currentRank.value.level
    if (newLevel > previousRank) {
      newRank.value = currentRank.value
      showLevelUp.value = true
    }

    saveProgress(progress.value)

    // Clear recent XP display after delay
    setTimeout(() => {
      recentXPGain.value = null
    }, 2000)

    return amount
  }

  // Track user message sent: +5 XP
  function onMessageSent() {
    updateStreak()
    progress.value.messagesSent += 1
    addXP(XP_REWARDS.userMessage, 'userMessage')
    saveProgress(progress.value)
  }

  // Track system/AI message received: +2 XP
  function onMessageReceived() {
    progress.value.messagesReceived += 1
    addXP(XP_REWARDS.systemMessage, 'systemMessage')
    saveProgress(progress.value)
  }

  // Track article started (no XP, just tracking)
  function onArticleStarted(articleId) {
    if (!progress.value.articlesStarted.includes(articleId)) {
      progress.value.articlesStarted.push(articleId)
      saveProgress(progress.value)
    }
  }

  // Track word learned
  function onWordLearned(word) {
    if (!progress.value.wordsLearned.includes(word)) {
      progress.value.wordsLearned.push(word)
      saveProgress(progress.value)
    }
  }

  // Track character interaction
  function trackCharacterInteraction(characterId) {
    if (!progress.value.characterStats[characterId]) {
      progress.value.characterStats[characterId] = { messages: 0 }
    }
    progress.value.characterStats[characterId].messages += 1
    saveProgress(progress.value)
  }

  // Dismiss level up notification
  function dismissLevelUp() {
    showLevelUp.value = false
    newRank.value = null
  }

  // Dismiss streak milestone notification
  function dismissStreakMilestone() {
    showStreakMilestone.value = false
    currentMilestone.value = null
  }

  // Get all ranks
  function getAllRanks() {
    return RANKS
  }

  // Reset progress (for testing)
  function resetProgress() {
    progress.value = getDefaultProgress()
    saveProgress(progress.value)
  }

  // Auto-save on changes
  watch(progress, () => {
    saveProgress(progress.value)
  }, { deep: true })

  return {
    // State
    progress,
    recentXPGain,
    showLevelUp,
    newRank,
    showStreakMilestone,
    currentMilestone,

    // Computed
    currentRank,
    nextRank,
    xpToNextRank,
    progressToNextRank,

    // Actions
    addXP,
    onMessageSent,
    onMessageReceived,
    onArticleStarted,
    onWordLearned,
    trackCharacterInteraction,
    dismissLevelUp,
    dismissStreakMilestone,
    getAllRanks,
    resetProgress,

    // Constants
    RANKS,
    XP_REWARDS,
    STREAK_MILESTONES,
  }
}
