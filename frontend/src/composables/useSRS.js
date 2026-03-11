import { ref, computed } from 'vue'

/**
 * Spaced Repetition System (SM-2 algorithm)
 *
 * Tracks per-word review data and schedules optimal review times.
 * Integrates with quiz and flashcard modes to record word-level results.
 *
 * SM-2 Algorithm:
 * - easeFactor starts at 2.5
 * - After each review, score 0-5 determines new interval and ease
 * - Score < 3: reset to interval 1, keep ease
 * - Score >= 3: interval *= easeFactor, adjust ease
 */

const STORAGE_KEY = 'chatmate_srsProgress'

// Singleton state
const srsData = ref(loadSRSData())

function loadSRSData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : { words: {} }
  } catch {
    return { words: {} }
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(srsData.value))
  } catch (e) {
    console.error('Failed to save SRS data:', e)
  }
}

/**
 * Get today's date string in YYYY-MM-DD format
 */
function today() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Calculate days between two date strings
 */
function daysBetween(dateA, dateB) {
  const a = new Date(dateA)
  const b = new Date(dateB)
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

/**
 * SM-2 algorithm: calculate next review schedule
 * @param {Object} card - Current card state { interval, easeFactor, repetitions }
 * @param {number} quality - Score 0-5 (0=forgot, 3=correct with effort, 5=perfect)
 * @returns {Object} Updated card state
 */
function sm2(card, quality) {
  let { interval, easeFactor, repetitions } = card

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions++
  } else {
    // Incorrect response — reset
    repetitions = 0
    interval = 1
  }

  // Update ease factor (minimum 1.3)
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)

  return {
    interval,
    easeFactor: Math.round(easeFactor * 100) / 100,
    repetitions,
    nextReview: nextReview.toISOString().split('T')[0]
  }
}

export function useSRS() {
  /**
   * Record a word review result
   * @param {string} wordId - Word identifier (e.g., 'morning-routine_alarm')
   * @param {boolean} correct - Whether the answer was correct
   * @param {number} [confidence=3] - Optional confidence 0-5 for SM-2 quality score
   */
  function recordReview(wordId, correct, confidence) {
    const existing = srsData.value.words[wordId] || {
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      nextReview: today(),
      correctCount: 0,
      incorrectCount: 0,
      lastReviewed: null
    }

    // Determine SM-2 quality score
    // If explicit confidence provided, use it. Otherwise: correct=4, incorrect=1
    const quality = confidence !== undefined ? confidence : (correct ? 4 : 1)

    const updated = sm2(
      {
        interval: existing.interval,
        easeFactor: existing.easeFactor,
        repetitions: existing.repetitions
      },
      quality
    )

    srsData.value.words[wordId] = {
      ...updated,
      correctCount: existing.correctCount + (correct ? 1 : 0),
      incorrectCount: existing.incorrectCount + (correct ? 0 : 1),
      lastReviewed: today()
    }

    persist()
  }

  /**
   * Record results from a completed quiz
   * @param {Array} answers - Array of { word: { id }, isCorrect }
   */
  function recordQuizResults(answers) {
    for (const answer of answers) {
      recordReview(answer.word.id, answer.isCorrect)
    }
  }

  /**
   * Get words that are due for review today
   * @param {Array} allWords - Array of word objects with .id property
   * @returns {Array} Words due for review, sorted by overdue days (most overdue first)
   */
  function getDueWords(allWords) {
    const todayStr = today()

    return allWords
      .filter(word => {
        const srs = srsData.value.words[word.id]
        if (!srs) return false // Never reviewed — not due (must learn first)
        return srs.nextReview <= todayStr
      })
      .sort((a, b) => {
        const srsA = srsData.value.words[a.id]
        const srsB = srsData.value.words[b.id]
        // Most overdue first
        return daysBetween(srsA.nextReview, todayStr) - daysBetween(srsB.nextReview, todayStr)
      })
      .reverse()
  }

  /**
   * Get the number of words due for review from a set of words
   * @param {Array} allWords - Array of word objects with .id property
   * @returns {number} Count of due words
   */
  function getDueCount(allWords) {
    const todayStr = today()
    return allWords.filter(word => {
      const srs = srsData.value.words[word.id]
      if (!srs) return false
      return srs.nextReview <= todayStr
    }).length
  }

  /**
   * Get SRS data for a specific word
   * @param {string} wordId
   * @returns {Object|null} SRS state or null if never reviewed
   */
  function getWordSRS(wordId) {
    return srsData.value.words[wordId] || null
  }

  /**
   * Get mastery level for a word (0-100)
   * Based on repetitions and ease factor
   */
  function getWordMastery(wordId) {
    const srs = srsData.value.words[wordId]
    if (!srs) return 0

    const total = srs.correctCount + srs.incorrectCount
    if (total === 0) return 0

    // Combine accuracy with repetition depth
    const accuracy = srs.correctCount / total
    const repetitionFactor = Math.min(srs.repetitions / 5, 1) // Cap at 5 repetitions
    return Math.round(accuracy * 50 + repetitionFactor * 50)
  }

  /**
   * Total number of words with SRS data
   */
  const totalTrackedWords = computed(() => Object.keys(srsData.value.words).length)

  /**
   * Total words due for review today (across all chapters)
   */
  const totalDueToday = computed(() => {
    const todayStr = today()
    return Object.values(srsData.value.words).filter(w => w.nextReview <= todayStr).length
  })

  /**
   * Reset all SRS data
   */
  function resetSRS() {
    srsData.value = { words: {} }
    persist()
  }

  return {
    // Core review
    recordReview,
    recordQuizResults,

    // Query
    getDueWords,
    getDueCount,
    getWordSRS,
    getWordMastery,

    // Stats
    totalTrackedWords,
    totalDueToday,

    // Reset
    resetSRS
  }
}

export default useSRS
