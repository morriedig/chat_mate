import { ref, computed } from 'vue'
import { loadProgress, saveProgress } from './useLearningStorage'

/**
 * Learning Progress Tracking (SRP: Only manages progress state)
 *
 * Tracks chapter completion for quiz and conversation.
 * Uses useLearningStorage for persistence (DIP).
 */

// Shared reactive state (singleton pattern for consistency across components)
const progress = ref(loadProgress())

/**
 * Initialize or get chapter progress object
 */
function ensureChapter(chapterId) {
  if (!progress.value.chapters[chapterId]) {
    progress.value.chapters[chapterId] = {
      quizCompleted: false,
      quizScore: 0,
      quizBestScore: 0,
      conversationCompleted: false
    }
  }
  return progress.value.chapters[chapterId]
}

/**
 * Persist current progress state
 */
function persist() {
  saveProgress(progress.value)
}

export function useLearningProgress() {
  // === Quiz Tracking ===

  function markQuizCompleted(chapterId, score, totalQuestions) {
    const chapter = ensureChapter(chapterId)
    const percentage = Math.round((score / totalQuestions) * 100)

    // Update best score
    if (percentage > chapter.quizBestScore) {
      chapter.quizBestScore = percentage
    }

    chapter.quizScore = percentage

    // Mark completed if score >= 60%
    if (percentage >= 60 && !chapter.quizCompleted) {
      chapter.quizCompleted = true
      progress.value.stats.totalQuizzesPassed++
    }

    persist()
    return { percentage, passed: percentage >= 60 }
  }

  function isQuizCompleted(chapterId) {
    return progress.value.chapters[chapterId]?.quizCompleted || false
  }

  function getQuizBestScore(chapterId) {
    return progress.value.chapters[chapterId]?.quizBestScore || 0
  }

  // === Conversation Tracking ===

  function markConversationCompleted(chapterId) {
    const chapter = ensureChapter(chapterId)

    if (!chapter.conversationCompleted) {
      chapter.conversationCompleted = true
      progress.value.stats.totalConversationsCompleted++
      persist()
    }
  }

  function isConversationCompleted(chapterId) {
    return progress.value.chapters[chapterId]?.conversationCompleted || false
  }

  // === Chapter Status ===

  function isChapterCompleted(chapterId) {
    const chapter = progress.value.chapters[chapterId]
    if (!chapter) return false
    return chapter.quizCompleted && chapter.conversationCompleted
  }

  function getChapterCompletionStatus(chapterId) {
    const chapter = progress.value.chapters[chapterId]
    if (!chapter) {
      return { quiz: false, conversation: false, complete: false, quizBestScore: 0 }
    }

    return {
      quiz: chapter.quizCompleted,
      conversation: chapter.conversationCompleted,
      complete: chapter.quizCompleted && chapter.conversationCompleted,
      quizBestScore: chapter.quizBestScore || 0
    }
  }

  // === Stats ===

  const stats = computed(() => progress.value.stats)

  // === Reset ===

  function resetProgress() {
    progress.value = {
      chapters: {},
      stats: {
        totalQuizzesPassed: 0,
        totalConversationsCompleted: 0
      }
    }
    persist()
  }

  return {
    // Quiz
    markQuizCompleted,
    isQuizCompleted,
    getQuizBestScore,

    // Conversation
    markConversationCompleted,
    isConversationCompleted,

    // Chapter
    isChapterCompleted,
    getChapterCompletionStatus,

    // Stats
    stats,

    // Reset
    resetProgress
  }
}

export default useLearningProgress
