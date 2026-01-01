/**
 * Learning Progress Storage (SRP: Only handles persistence)
 * DIP: Can be swapped with different storage implementations
 */

const STORAGE_KEY = 'chatmate_learningProgress'

const defaultProgress = {
  chapters: {},
  stats: {
    totalQuizzesPassed: 0,
    totalConversationsCompleted: 0
  }
}

export function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : { ...defaultProgress }
  } catch (e) {
    console.error('Failed to load learning progress:', e)
    return { ...defaultProgress }
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (e) {
    console.error('Failed to save learning progress:', e)
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error('Failed to clear learning progress:', e)
  }
}

export default {
  loadProgress,
  saveProgress,
  clearProgress
}
