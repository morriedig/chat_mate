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
    diaryEntries: 0,
    diaryStreak: 0,
    longestDiaryStreak: 0,
    diaryVocabUsed: 0,
    hasWrittenLongEntry: false,
    lastDiaryDate: null,
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

  function onDiarySubmitted({ wordCount = 0, vocabWordsUsed = 0 } = {}) {
    // Update diary streak
    const today = new Date().toDateString()
    const lastDate = progress.value.lastDiaryDate
    if (lastDate === today) {
      // Already submitted today — only update long entry flag, don't inflate count
      if (wordCount >= 200) {
        progress.value.hasWrittenLongEntry = true
      }
      saveProgress()
      checkAchievements()
      return
    }

    // First entry of the day — increment count
    progress.value.diaryEntries += 1

    {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      if (lastDate === yesterday.toDateString()) {
        progress.value.diaryStreak += 1
      } else {
        progress.value.diaryStreak = 1
      }
      progress.value.lastDiaryDate = today
    }

    if (progress.value.diaryStreak > progress.value.longestDiaryStreak) {
      progress.value.longestDiaryStreak = progress.value.diaryStreak
    }

    // Track vocab words used
    if (vocabWordsUsed > 0) {
      progress.value.diaryVocabUsed += vocabWordsUsed
    }

    // Track long entries (200+ words)
    if (wordCount >= 200) {
      progress.value.hasWrittenLongEntry = true
    }

    saveProgress()
    checkAchievements()
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
    onDiarySubmitted,
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
