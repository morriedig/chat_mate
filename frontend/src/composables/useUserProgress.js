import { ref } from 'vue'
import { useXPSystem, RANKS, XP_REWARDS, recentXPGain, showLevelUp, newRank } from './useXPSystem'
import { useStreakTracker, STREAK_MILESTONES, showStreakMilestone, currentMilestone } from './useStreakTracker'
import { useAchievements, ACHIEVEMENTS, showAchievementUnlock, newAchievement } from './useAchievements'

const STORAGE_KEY = 'chatmate_userProgress'

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
    claimedMilestones: [],
    unlockedAchievements: [],
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

// Singleton state
const progress = ref(loadProgress())

// Debounced save: batches multiple synchronous calls into one write
let saveScheduled = false
function saveProgress() {
  if (!saveScheduled) {
    saveScheduled = true
    queueMicrotask(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress.value))
      saveScheduled = false
    })
  }
}

export function useUserProgress() {
  // Compose sub-systems
  const {
    currentRank, nextRank, xpToNextRank, progressToNextRank,
    addXP, dismissLevelUp, getAllRanks,
  } = useXPSystem(progress, saveProgress)

  const {
    updateStreak, dismissStreakMilestone,
  } = useStreakTracker(progress, saveProgress, addXP, XP_REWARDS)

  const {
    unlockedAchievements, lockedAchievements,
    checkAchievements, dismissAchievementUnlock,
  } = useAchievements(progress, saveProgress)

  function onMessageSent() {
    updateStreak()
    progress.value.messagesSent += 1
    addXP(XP_REWARDS.userMessage, 'userMessage')
    saveProgress()
    checkAchievements()
  }

  function onMessageReceived() {
    progress.value.messagesReceived += 1
    addXP(XP_REWARDS.systemMessage, 'systemMessage')
    saveProgress()
    checkAchievements()
  }

  function onArticleStarted(articleId) {
    if (!progress.value.articlesStarted.includes(articleId)) {
      progress.value.articlesStarted.push(articleId)
      saveProgress()
    }
  }

  function onWordLearned(word) {
    if (!progress.value.wordsLearned.includes(word)) {
      progress.value.wordsLearned.push(word)
      saveProgress()
    }
  }

  function trackCharacterInteraction(characterId) {
    if (!progress.value.characterStats[characterId]) {
      progress.value.characterStats[characterId] = { messages: 0 }
    }
    progress.value.characterStats[characterId].messages += 1
    saveProgress()
  }

  function resetProgress() {
    progress.value = getDefaultProgress()
    saveProgress()
  }

  return {
    // State
    progress,
    recentXPGain,
    showLevelUp,
    newRank,
    showStreakMilestone,
    currentMilestone,
    showAchievementUnlock,
    newAchievement,

    // Computed
    currentRank,
    nextRank,
    xpToNextRank,
    progressToNextRank,
    unlockedAchievements,
    lockedAchievements,

    // Actions
    addXP,
    onMessageSent,
    onMessageReceived,
    onArticleStarted,
    onWordLearned,
    trackCharacterInteraction,
    dismissLevelUp,
    dismissStreakMilestone,
    dismissAchievementUnlock,
    checkAchievements,
    getAllRanks,
    resetProgress,

    // Constants
    RANKS,
    XP_REWARDS,
    STREAK_MILESTONES,
    ACHIEVEMENTS,
  }
}
