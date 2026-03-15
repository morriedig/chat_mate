import { computed } from 'vue'
import { useDiaryStorage } from './useDiaryStorage'
import { useDiaryFeedback } from './useDiaryFeedback'
import { useDiaryPrompts } from './useDiaryPrompts'
import { useUserProgress } from './useUserProgress'
import { useVocabularyBank } from './useVocabularyBank'
import { useWeeklyQuests } from './useWeeklyQuests'
import { toLocalDateKey, getTodayKey } from '../utils/dateUtils'

const DIARY_XP = 15

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

export function useDiary() {
  const storage = useDiaryStorage()
  const feedback = useDiaryFeedback()
  const prompts = useDiaryPrompts()
  const { addXP, progress, onDiarySubmitted } = useUserProgress()
  const { words: vocabWords } = useVocabularyBank()
  const { onDiaryEntry, onDiaryVocabUsed, onDiaryWordCount } = useWeeklyQuests()

  // Check if an entry exists for today
  const todayEntry = computed(() => {
    const today = getTodayKey()
    return storage.entryIndex.value.find(e => {
      const entryDate = toLocalDateKey(e.createdAt)
      return entryDate && entryDate === today
    }) || null
  })

  // Stats
  const totalEntries = computed(() => storage.entryIndex.value.length)

  const currentWritingStreak = computed(() => {
    return calculateWritingStreak(false)
  })

  const longestWritingStreak = computed(() => {
    return calculateWritingStreak(true)
  })

  const stats = computed(() => ({
    totalEntries: totalEntries.value,
    currentWritingStreak: currentWritingStreak.value,
    longestWritingStreak: longestWritingStreak.value,
  }))

  function calculateWritingStreak(findLongest) {
    const entries = storage.entryIndex.value
    if (entries.length === 0) return 0

    // Get unique dates sorted descending
    const dates = [...new Set(
      entries.map(e => toLocalDateKey(e.createdAt)).filter(Boolean)
    )].sort().reverse()

    if (findLongest) {
      // Find the longest consecutive run in sorted dates
      let longest = 1
      let current = 1
      const sorted = [...dates].sort()
      for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1])
        const curr = new Date(sorted[i])
        const diff = Math.round((curr - prev) / 86400000)
        if (diff === 1) {
          current += 1
          if (current > longest) longest = current
        } else {
          current = 1
        }
      }
      return longest
    }

    // Current streak: count consecutive days starting from today or yesterday
    const today = getTodayKey()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = toLocalDateKey(yesterday)

    // Streak must start from today or yesterday
    if (dates[0] !== today && dates[0] !== yesterdayStr) return 0

    let streak = 1
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1])
      const curr = new Date(dates[i])
      const diff = Math.round((prev - curr) / 86400000)
      if (diff === 1) {
        streak += 1
      } else {
        break
      }
    }
    return streak
  }

  async function submitEntry(body, { language, level, characterId, nativeLanguage, prompt, rewriteOf }) {
    const id = generateId()
    const now = new Date().toISOString()
    // CJK languages don't use spaces — count characters instead
    const isCJK = /[\u3000-\u9fff\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/.test(body)
    const wordCount = isCJK
      ? body.replace(/\s/g, '').length
      : body.trim().split(/\s+/).filter(Boolean).length

    const entry = {
      id,
      createdAt: now,
      title: body.slice(0, 50).trim(),
      body,
      wordCount,
      language,
      level,
      characterId,
      nativeLanguage,
      prompt: prompt || null,
      rewriteOf: rewriteOf || null,
      feedbackStatus: 'none',
      feedback: null,
    }

    // Save entry
    storage.saveEntry(entry)

    // Count how many vocab bank words appear in the diary text
    const bodyLower = body.toLowerCase()
    const vocabWordsUsed = vocabWords.value.filter(w => {
      if (!w.word) return false
      const wLower = w.word.toLowerCase()
      const wIsCJK = /[\u3000-\u9fff\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/.test(wLower)
      if (wIsCJK) return bodyLower.includes(wLower)
      // Word boundary match for non-CJK to avoid substring false positives
      const re = new RegExp(`\\b${wLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
      return re.test(bodyLower)
    }).length

    // Award XP for diary writing
    addXP(DIARY_XP, 'diaryEntry')

    // Update diary progress tracking (achievements, streak, etc.)
    onDiarySubmitted({ wordCount, vocabWordsUsed })

    // Update weekly quest progress
    onDiaryEntry()
    if (vocabWordsUsed > 0) onDiaryVocabUsed(vocabWordsUsed)
    if (wordCount > 0) onDiaryWordCount(wordCount)

    // Update main streak (diary counts toward main streak)
    const today = new Date().toDateString()
    if (progress.value.lastActiveDate !== today) {
      progress.value.lastActiveDate = today
    }

    // Request feedback (async, don't block)
    if (!navigator.onLine) {
      feedback.addToPendingQueue(id)
      entry.feedbackStatus = 'pending'
      storage.saveEntry(entry)
    } else {
      entry.feedbackStatus = 'loading'
      storage.saveEntry(entry)

      const result = await feedback.fetchFeedback({
        diaryText: body,
        language,
        level,
        characterId,
        nativeLanguage,
        streakDays: currentWritingStreak.value,
      })

      if (result) {
        entry.feedbackStatus = 'done'
        entry.feedback = result
      } else {
        entry.feedbackStatus = 'error'
      }
      storage.saveEntry(entry)
    }

    return entry
  }

  // Set up offline queue processing
  feedback.setupReconnectListener(async (queue) => {
    for (const entryId of queue) {
      const entry = storage.loadEntry(entryId)
      if (!entry || entry.feedbackStatus === 'done') {
        feedback.removeFromPendingQueue(entryId)
        continue
      }

      const result = await feedback.fetchFeedback({
        diaryText: entry.body,
        language: entry.language,
        level: entry.level,
        characterId: entry.characterId,
        nativeLanguage: entry.nativeLanguage,
        streakDays: currentWritingStreak.value,
      })

      if (result) {
        entry.feedbackStatus = 'done'
        entry.feedback = result
        storage.saveEntry(entry)
      }
      feedback.removeFromPendingQueue(entryId)
    }
  })

  // Retry feedback only (no XP, no quest tracking, no new entry)
  async function retryFeedback(entryId, { language, level, characterId, nativeLanguage }) {
    const entry = storage.loadEntry(entryId)
    if (!entry) return

    entry.feedbackStatus = 'loading'
    storage.saveEntry(entry)

    const result = await feedback.fetchFeedback({
      diaryText: entry.body,
      language,
      level,
      characterId,
      nativeLanguage,
      streakDays: currentWritingStreak.value,
    })

    if (result) {
      entry.feedback = result
      entry.feedbackStatus = 'done'
    } else {
      entry.feedbackStatus = 'error'
    }
    storage.saveEntry(entry)
  }

  return {
    // Storage pass-through
    entryIndex: storage.entryIndex,
    loadEntry: storage.loadEntry,
    deleteEntry: storage.deleteEntry,
    getEntriesByMonth: storage.getEntriesByMonth,

    // Feedback state
    isLoadingFeedback: feedback.isLoading,
    feedbackError: feedback.error,

    // Prompts
    getTodayPrompt: prompts.getTodayPrompt,
    getRandomPrompt: prompts.getRandomPrompt,

    // Core
    submitEntry,
    retryFeedback,
    todayEntry,
    stats,
    totalEntries,
    currentWritingStreak,
    longestWritingStreak,
  }
}
