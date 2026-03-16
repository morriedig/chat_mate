import { ref, computed } from 'vue'
import { getPreLessons, getChaptersByLevel } from '../data/chapterLoader'
import { useLearningProgress } from './useLearningProgress'

/**
 * Pre-Lesson Progress Tracking
 *
 * Tracks character learning, quiz, and matching completion for
 * foundation-level pre-lessons (e.g., hiragana, pinyin).
 * Uses singleton pattern (module-level refs) for consistency across components.
 */

const STORAGE_KEY = 'chatmate_preLessonProgress'

const defaultProgress = {
  lessons: {},
  stats: {
    totalCharactersLearned: 0,
    totalPreLessonsCompleted: 0
  }
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : { ...defaultProgress, stats: { ...defaultProgress.stats }, lessons: {} }
  } catch (e) {
    console.error('Failed to load pre-lesson progress:', e)
    return { ...defaultProgress, stats: { ...defaultProgress.stats }, lessons: {} }
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save pre-lesson progress:', e)
  }
}

// Shared reactive state (singleton)
const progress = ref(loadProgress())

// Callback for XP integration — set by useUserProgress to avoid circular dependency
let onCharacterLearnedCallback = null

/**
 * Initialize or get lesson progress object
 */
function ensureLesson(lessonId) {
  if (!progress.value.lessons[lessonId]) {
    progress.value.lessons[lessonId] = {
      charactersLearned: [],
      quizCompleted: false,
      quizBestScore: 0,
      matchingCompleted: false
    }
  }
  return progress.value.lessons[lessonId]
}

/**
 * Persist current progress state
 */
function persist() {
  saveProgress(progress.value)
}

export function usePreLessonProgress() {
  // === Character Tracking ===

  /**
   * Mark a character as learned (studied/tapped)
   * @param {string} lessonId - Pre-lesson ID (e.g., 'hiragana-01-vowels-k')
   * @param {string} characterId - Character ID (e.g., 'a', 'ka')
   */
  function markCharacterLearned(lessonId, characterId) {
    const lesson = ensureLesson(lessonId)

    if (!lesson.charactersLearned.includes(characterId)) {
      lesson.charactersLearned.push(characterId)
      progress.value.stats.totalCharactersLearned++
      persist()

      // Award XP for first-time character learning
      if (onCharacterLearnedCallback) {
        onCharacterLearnedCallback(lessonId, characterId)
      }
    }
  }

  /**
   * Check if a character has been learned
   */
  function isCharacterLearned(lessonId, characterId) {
    return progress.value.lessons[lessonId]?.charactersLearned?.includes(characterId) || false
  }

  /**
   * Get list of learned character IDs for a lesson
   */
  function getLearnedCharacters(lessonId) {
    return progress.value.lessons[lessonId]?.charactersLearned || []
  }

  // === Quiz Tracking ===

  /**
   * Mark quiz as completed with score
   * @param {string} lessonId - Pre-lesson ID
   * @param {number} score - Number of correct answers
   * @param {number} total - Total questions
   * @returns {{ percentage: number, passed: boolean }}
   */
  function markQuizCompleted(lessonId, score, total) {
    if (total === 0) return { percentage: 0, passed: false }
    const lesson = ensureLesson(lessonId)
    const percentage = Math.round((score / total) * 100)

    if (percentage > lesson.quizBestScore) {
      lesson.quizBestScore = percentage
    }

    // Mark completed if score >= 70%
    if (percentage >= 70) {
      const wasNotCompleted = !lesson.quizCompleted
      lesson.quizCompleted = true

      // Check if the whole pre-lesson is now complete
      if (wasNotCompleted) {
        updateCompletionStats()
      }
    }

    persist()
    return { percentage, passed: percentage >= 70 }
  }

  /**
   * Check if quiz is completed for a lesson
   */
  function isQuizCompleted(lessonId) {
    return progress.value.lessons[lessonId]?.quizCompleted || false
  }

  /**
   * Get best quiz score for a lesson
   */
  function getQuizBestScore(lessonId) {
    return progress.value.lessons[lessonId]?.quizBestScore || 0
  }

  // === Matching Tracking ===

  /**
   * Mark matching game as completed
   */
  function markMatchingCompleted(lessonId) {
    const lesson = ensureLesson(lessonId)

    if (!lesson.matchingCompleted) {
      lesson.matchingCompleted = true
      persist()
    }
  }

  /**
   * Check if matching game is completed for a lesson
   */
  function isMatchingCompleted(lessonId) {
    return progress.value.lessons[lessonId]?.matchingCompleted || false
  }

  // === Completion Status ===

  /**
   * Check if a pre-lesson is fully completed
   * (quiz passed with >= 70%)
   */
  function isPreLessonCompleted(lessonId) {
    const lesson = progress.value.lessons[lessonId]
    if (!lesson) return false
    return lesson.quizCompleted
  }

  /**
   * Recalculate total completed pre-lessons
   */
  function updateCompletionStats() {
    const completedCount = Object.values(progress.value.lessons)
      .filter(l => l.quizCompleted)
      .length
    progress.value.stats.totalPreLessonsCompleted = completedCount
  }

  /**
   * Check if all pre-lessons for a language are complete
   */
  function arePreLessonsComplete(targetLanguage = 'ja') {
    const preLessons = getPreLessons(targetLanguage)
    if (preLessons.length === 0) return true

    return preLessons.every(pl => isPreLessonCompleted(pl.id))
  }

  /**
   * Check if regular chapters should be locked (soft gate)
   * Returns false for existing users who already have chapter progress (migration)
   */
  function areChaptersLocked(targetLanguage = 'ja') {
    // Migration check: if user already has progress on any regular chapter, don't lock
    const { getChapterCompletionStatus } = useLearningProgress()
    const regularChapters = getChaptersByLevel(targetLanguage, 'beginner')

    const hasExistingProgress = regularChapters.some(ch => {
      const status = getChapterCompletionStatus(ch.id)
      return status.quiz || status.conversation
    })

    if (hasExistingProgress) return false

    // If no pre-lessons exist for this language, don't lock
    const preLessons = getPreLessons(targetLanguage)
    if (preLessons.length === 0) return false

    return !arePreLessonsComplete(targetLanguage)
  }

  /**
   * Get completion status for a pre-lesson
   */
  function getLessonStatus(lessonId) {
    const lesson = progress.value.lessons[lessonId]
    if (!lesson) {
      return {
        charactersLearned: 0,
        quizCompleted: false,
        quizBestScore: 0,
        matchingCompleted: false,
        complete: false
      }
    }

    return {
      charactersLearned: lesson.charactersLearned.length,
      quizCompleted: lesson.quizCompleted,
      quizBestScore: lesson.quizBestScore,
      matchingCompleted: lesson.matchingCompleted,
      complete: lesson.quizCompleted
    }
  }

  // === Stats ===

  const stats = computed(() => progress.value.stats)

  // === Reset ===

  function resetProgress() {
    progress.value = {
      lessons: {},
      stats: {
        totalCharactersLearned: 0,
        totalPreLessonsCompleted: 0
      }
    }
    persist()
  }

  /**
   * Register a callback for when a character is learned for the first time.
   * Used by useUserProgress to award XP without circular dependency.
   */
  function setOnCharacterLearnedCallback(cb) {
    onCharacterLearnedCallback = cb
  }

  return {
    // Character
    markCharacterLearned,
    isCharacterLearned,
    getLearnedCharacters,

    // Quiz
    markQuizCompleted,
    isQuizCompleted,
    getQuizBestScore,

    // Matching
    markMatchingCompleted,
    isMatchingCompleted,

    // Completion
    isPreLessonCompleted,
    arePreLessonsComplete,
    areChaptersLocked,
    getLessonStatus,

    // Stats
    stats,

    // XP integration
    setOnCharacterLearnedCallback,

    // Reset
    resetProgress
  }
}

export default usePreLessonProgress
