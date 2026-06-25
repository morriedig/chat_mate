import { ref, watch } from 'vue'
import { useXPSystem, RANKS, XP_REWARDS, recentXPGain, showLevelUp, newRank } from './useXPSystem'
import { useStreakTracker, STREAK_MILESTONES, showStreakMilestone, currentMilestone } from './useStreakTracker'
import { useAchievements, ACHIEVEMENTS, showAchievementUnlock, newAchievement } from './useAchievements'
import { usePreLessonProgress } from './usePreLessonProgress'

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
    // activityLog: { "YYYY-MM-DD": { messages: N, xp: N } } — last 90 days trimmed
    activityLog: {},
  }
}

function localDateKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function trimActivityLog(log, keepDays = 90) {
  const keys = Object.keys(log || {}).sort()
  if (keys.length <= keepDays) return log
  const drop = keys.slice(0, keys.length - keepDays)
  for (const k of drop) delete log[k]
  return log
}

function recordActivity(progress, kind, xpDelta = 0) {
  const key = localDateKey()
  if (!progress.activityLog) progress.activityLog = {}
  const entry = progress.activityLog[key] || { messages: 0, xp: 0, diary: 0 }
  if (kind === 'message') entry.messages += 1
  if (kind === 'diary') entry.diary += 1
  if (xpDelta) entry.xp += xpDelta
  progress.activityLog[key] = entry
  trimActivityLog(progress.activityLog)
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

// Module-level watcher (runs once, not per useUserProgress() call)
let preLessonWatcherInitialized = false

export function useUserProgress() {
  // Inject pre-lesson stats into progress for achievement checking
  const { stats: preLessonStats, setOnCharacterLearnedCallback } = usePreLessonProgress()
  progress.value.preLessonStats = preLessonStats.value
  if (!preLessonWatcherInitialized) {
    preLessonWatcherInitialized = true
    watch(preLessonStats, (newStats) => {
      progress.value.preLessonStats = newStats
    }, { deep: true })
  }

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

  // Wire up XP reward for pre-lesson character learning (+2 XP per new character)
  setOnCharacterLearnedCallback(() => {
    addXP(2, 'characterLearned')
    // Re-sync preLessonStats after the callback may have updated
    progress.value.preLessonStats = preLessonStats.value
    saveProgress()
    checkAchievements()
  })

  function onMessageSent() {
    updateStreak()
    progress.value.messagesSent += 1
    addXP(XP_REWARDS.userMessage, 'userMessage')
    recordActivity(progress.value, 'message', XP_REWARDS.userMessage)
    saveProgress()
    checkAchievements()
  }

  function onMessageReceived() {
    progress.value.messagesReceived += 1
    addXP(XP_REWARDS.systemMessage, 'systemMessage')
    recordActivity(progress.value, 'message', XP_REWARDS.systemMessage)
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

    recordActivity(progress.value, 'diary', 0)
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
