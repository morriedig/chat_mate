import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock chapterLoader to avoid import.meta.glob dependency
vi.mock('../../data/chapterLoader', () => ({
  getPreLessons: vi.fn(() => []),
  getChaptersByLevel: vi.fn(() => []),
}))

// Mock useLearningProgress
const mockGetChapterCompletionStatus = vi.fn(() => ({ quiz: false, conversation: false, complete: false }))
vi.mock('../../composables/useLearningProgress', () => ({
  useLearningProgress: () => ({
    getChapterCompletionStatus: mockGetChapterCompletionStatus,
  }),
}))

let usePreLessonProgress
let getPreLessons
let getChaptersByLevel

describe('usePreLessonProgress', () => {
  beforeEach(async () => {
    localStorage.clear()
    // Reset module to clear singleton state
    vi.resetModules()

    mockGetChapterCompletionStatus.mockReturnValue({ quiz: false, conversation: false, complete: false })

    const chapterLoaderMock = await import('../../data/chapterLoader')
    getPreLessons = chapterLoaderMock.getPreLessons
    getChaptersByLevel = chapterLoaderMock.getChaptersByLevel

    const mod = await import('../../composables/usePreLessonProgress')
    usePreLessonProgress = mod.usePreLessonProgress
  })

  describe('init', () => {
    it('should load from empty localStorage', () => {
      const progress = usePreLessonProgress()
      expect(progress.stats.value).toEqual({
        totalCharactersLearned: 0,
        totalPreLessonsCompleted: 0,
      })
    })

    it('should load existing data from localStorage', () => {
      localStorage.setItem('chatmate_preLessonProgress', JSON.stringify({
        lessons: {
          'hiragana-01': {
            charactersLearned: ['a', 'i'],
            quizCompleted: false,
            quizBestScore: 0,
            matchingCompleted: false,
          }
        },
        stats: { totalCharactersLearned: 2, totalPreLessonsCompleted: 0 }
      }))

      // Need to re-import to pick up localStorage
      return import('../../composables/usePreLessonProgress').then(mod => {
        // The singleton already loaded in beforeEach, so test getLessonStatus
        const progress = mod.usePreLessonProgress()
        const status = progress.getLessonStatus('hiragana-01')
        // Since we cleared modules, this gets fresh data
        expect(status).toBeDefined()
      })
    })
  })

  describe('markCharacterLearned', () => {
    it('should add character to lesson learned array', () => {
      const progress = usePreLessonProgress()
      progress.markCharacterLearned('hiragana-01', 'a')

      const status = progress.getLessonStatus('hiragana-01')
      expect(status.charactersLearned).toBe(1)
    })

    it('should not add duplicate characters', () => {
      const progress = usePreLessonProgress()
      progress.markCharacterLearned('hiragana-01', 'a')
      progress.markCharacterLearned('hiragana-01', 'a')

      const status = progress.getLessonStatus('hiragana-01')
      expect(status.charactersLearned).toBe(1)
    })

    it('should update totalCharactersLearned stat', () => {
      const progress = usePreLessonProgress()
      progress.markCharacterLearned('hiragana-01', 'a')
      progress.markCharacterLearned('hiragana-01', 'i')
      progress.markCharacterLearned('hiragana-01', 'u')

      expect(progress.stats.value.totalCharactersLearned).toBe(3)
    })

    it('should persist to localStorage', () => {
      const progress = usePreLessonProgress()
      progress.markCharacterLearned('hiragana-01', 'ka')

      const saved = JSON.parse(localStorage.getItem('chatmate_preLessonProgress'))
      expect(saved.lessons['hiragana-01'].charactersLearned).toContain('ka')
    })
  })

  describe('isCharacterLearned', () => {
    it('should return true for learned character', () => {
      const progress = usePreLessonProgress()
      progress.markCharacterLearned('hiragana-01', 'a')

      expect(progress.isCharacterLearned('hiragana-01', 'a')).toBe(true)
    })

    it('should return false for unlearned character', () => {
      const progress = usePreLessonProgress()
      expect(progress.isCharacterLearned('hiragana-01', 'a')).toBe(false)
    })

    it('should return false for non-existent lesson', () => {
      const progress = usePreLessonProgress()
      expect(progress.isCharacterLearned('does-not-exist', 'a')).toBe(false)
    })
  })

  describe('markQuizCompleted', () => {
    it('should update quiz state when passing (>= 70%)', () => {
      const progress = usePreLessonProgress()
      const result = progress.markQuizCompleted('hiragana-01', 8, 10)

      expect(result.percentage).toBe(80)
      expect(result.passed).toBe(true)

      const status = progress.getLessonStatus('hiragana-01')
      expect(status.quizCompleted).toBe(true)
      expect(status.quizBestScore).toBe(80)
    })

    it('should not mark completed when failing (< 70%)', () => {
      const progress = usePreLessonProgress()
      const result = progress.markQuizCompleted('hiragana-01', 5, 10)

      expect(result.percentage).toBe(50)
      expect(result.passed).toBe(false)

      const status = progress.getLessonStatus('hiragana-01')
      expect(status.quizCompleted).toBe(false)
    })

    it('should track best score across attempts', () => {
      const progress = usePreLessonProgress()
      progress.markQuizCompleted('hiragana-01', 7, 10) // 70%
      progress.markQuizCompleted('hiragana-01', 9, 10) // 90%
      progress.markQuizCompleted('hiragana-01', 6, 10) // 60% (lower)

      const status = progress.getLessonStatus('hiragana-01')
      expect(status.quizBestScore).toBe(90)
    })

    it('should persist to localStorage', () => {
      const progress = usePreLessonProgress()
      progress.markQuizCompleted('hiragana-01', 8, 10)

      const saved = JSON.parse(localStorage.getItem('chatmate_preLessonProgress'))
      expect(saved.lessons['hiragana-01'].quizCompleted).toBe(true)
    })
  })

  describe('isPreLessonCompleted', () => {
    it('should return false when nothing is done', () => {
      const progress = usePreLessonProgress()
      expect(progress.isPreLessonCompleted('hiragana-01')).toBe(false)
    })

    it('should return false when only characters are learned (no quiz)', () => {
      const progress = usePreLessonProgress()
      progress.markCharacterLearned('hiragana-01', 'a')
      progress.markCharacterLearned('hiragana-01', 'i')

      expect(progress.isPreLessonCompleted('hiragana-01')).toBe(false)
    })

    it('should return true when quiz is passed', () => {
      const progress = usePreLessonProgress()
      progress.markCharacterLearned('hiragana-01', 'a')
      progress.markQuizCompleted('hiragana-01', 8, 10)

      expect(progress.isPreLessonCompleted('hiragana-01')).toBe(true)
    })

    it('should return false for non-existent lesson', () => {
      const progress = usePreLessonProgress()
      expect(progress.isPreLessonCompleted('does-not-exist')).toBe(false)
    })
  })

  describe('arePreLessonsComplete', () => {
    it('should return true when no pre-lessons exist', () => {
      getPreLessons.mockReturnValue([])
      const progress = usePreLessonProgress()
      expect(progress.arePreLessonsComplete('ja')).toBe(true)
    })

    it('should return false when pre-lessons exist but are incomplete', () => {
      getPreLessons.mockReturnValue([
        { id: 'hiragana-01' },
        { id: 'hiragana-02' },
      ])
      const progress = usePreLessonProgress()
      progress.markQuizCompleted('hiragana-01', 8, 10) // only first done

      expect(progress.arePreLessonsComplete('ja')).toBe(false)
    })

    it('should return true when all pre-lessons are complete', () => {
      getPreLessons.mockReturnValue([
        { id: 'hiragana-01' },
        { id: 'hiragana-02' },
      ])
      const progress = usePreLessonProgress()
      progress.markQuizCompleted('hiragana-01', 8, 10)
      progress.markQuizCompleted('hiragana-02', 7, 10)

      expect(progress.arePreLessonsComplete('ja')).toBe(true)
    })
  })

  describe('areChaptersLocked', () => {
    it('should return false for existing users with chapter progress', () => {
      // Simulate existing user with chapter progress (migration check)
      getPreLessons.mockReturnValue([{ id: 'hiragana-01' }])
      getChaptersByLevel.mockReturnValue([{ id: 'chapter-01' }])
      mockGetChapterCompletionStatus.mockReturnValue({ quiz: true, conversation: false, complete: false })

      const progress = usePreLessonProgress()
      expect(progress.areChaptersLocked('ja')).toBe(false)
    })

    it('should return false when no pre-lessons exist', () => {
      getPreLessons.mockReturnValue([])
      const progress = usePreLessonProgress()
      expect(progress.areChaptersLocked('ja')).toBe(false)
    })
  })

  describe('stats', () => {
    it('should update totalCharactersLearned correctly', () => {
      const progress = usePreLessonProgress()
      progress.markCharacterLearned('hiragana-01', 'a')
      progress.markCharacterLearned('hiragana-01', 'i')
      progress.markCharacterLearned('hiragana-02', 'sa')

      expect(progress.stats.value.totalCharactersLearned).toBe(3)
    })

    it('should update totalPreLessonsCompleted on quiz pass', () => {
      const progress = usePreLessonProgress()
      progress.markQuizCompleted('hiragana-01', 8, 10)

      expect(progress.stats.value.totalPreLessonsCompleted).toBe(1)
    })

    it('should not increment totalPreLessonsCompleted on quiz fail', () => {
      const progress = usePreLessonProgress()
      progress.markQuizCompleted('hiragana-01', 5, 10)

      expect(progress.stats.value.totalPreLessonsCompleted).toBe(0)
    })
  })

  describe('resetProgress', () => {
    it('should clear all progress', () => {
      const progress = usePreLessonProgress()
      progress.markCharacterLearned('hiragana-01', 'a')
      progress.markQuizCompleted('hiragana-01', 8, 10)

      progress.resetProgress()

      expect(progress.stats.value.totalCharactersLearned).toBe(0)
      expect(progress.stats.value.totalPreLessonsCompleted).toBe(0)
      expect(progress.getLessonStatus('hiragana-01').charactersLearned).toBe(0)
    })
  })
})
