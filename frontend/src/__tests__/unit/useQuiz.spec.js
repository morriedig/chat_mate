import { describe, it, expect, beforeEach } from 'vitest'
import { useQuiz } from '../../composables/useQuiz'

// Mock words for testing
const mockWords = [
  { id: 1, word: 'hello', meaning: 'greeting', example: 'Hello there!' },
  { id: 2, word: 'goodbye', meaning: 'farewell', example: 'Goodbye friend!' },
  { id: 3, word: 'thanks', meaning: 'gratitude', example: 'Thanks for helping!' },
  { id: 4, word: 'please', meaning: 'polite request', example: 'Please help me.' },
  { id: 5, word: 'sorry', meaning: 'apology', example: 'Sorry about that.' }
]

describe('useQuiz', () => {
  let quiz

  beforeEach(() => {
    quiz = useQuiz()
  })

  describe('initial state', () => {
    it('should have empty initial state', () => {
      expect(quiz.quizWords.value).toEqual([])
      expect(quiz.currentIndex.value).toBe(0)
      expect(quiz.selectedAnswer.value).toBeNull()
      expect(quiz.isAnswered.value).toBe(false)
      expect(quiz.score.value).toBe(0)
      expect(quiz.isCompleted.value).toBe(false)
      expect(quiz.answers.value).toEqual([])
    })

    it('should have zero progress initially', () => {
      expect(quiz.progress.value).toBe(0)
    })

    it('should have zero accuracy initially', () => {
      expect(quiz.accuracy.value).toBe(0)
    })

    it('should have zero xpEarned initially', () => {
      expect(quiz.xpEarned.value).toBe(0)
    })
  })

  describe('initQuiz', () => {
    it('should initialize quiz with words', () => {
      quiz.initQuiz(mockWords)

      expect(quiz.quizWords.value.length).toBe(mockWords.length)
      expect(quiz.currentIndex.value).toBe(0)
      expect(quiz.isCompleted.value).toBe(false)
    })

    it('should generate options for each question', () => {
      quiz.initQuiz(mockWords)

      quiz.quizWords.value.forEach(question => {
        expect(question.options).toBeDefined()
        expect(question.options.length).toBeGreaterThanOrEqual(2)
        expect(question.options.length).toBeLessThanOrEqual(4)
        // The correct answer should be included in options
        expect(question.options.some(opt => opt.id === question.id)).toBe(true)
      })
    })

    it('should reset state when re-initializing', () => {
      quiz.initQuiz(mockWords)
      quiz.selectAnswer(quiz.currentQuestion.value.options[0])
      quiz.nextQuestion()

      quiz.initQuiz(mockWords)

      expect(quiz.currentIndex.value).toBe(0)
      expect(quiz.selectedAnswer.value).toBeNull()
      expect(quiz.isAnswered.value).toBe(false)
      expect(quiz.score.value).toBe(0)
      expect(quiz.answers.value).toEqual([])
    })
  })

  describe('currentQuestion', () => {
    it('should return the current question', () => {
      quiz.initQuiz(mockWords)

      const current = quiz.currentQuestion.value
      expect(current).toBeDefined()
      expect(current.word).toBeDefined()
      expect(current.meaning).toBeDefined()
    })

    it('should return undefined when quiz not initialized', () => {
      expect(quiz.currentQuestion.value).toBeUndefined()
    })
  })

  describe('selectAnswer', () => {
    beforeEach(() => {
      quiz.initQuiz(mockWords)
    })

    it('should mark quiz as answered', () => {
      const option = quiz.currentQuestion.value.options[0]
      quiz.selectAnswer(option)

      expect(quiz.isAnswered.value).toBe(true)
      expect(quiz.selectedAnswer.value).toBe(option)
    })

    it('should return true for correct answer', () => {
      const currentWord = quiz.currentQuestion.value
      const correctOption = quiz.currentQuestion.value.options.find(
        opt => opt.id === currentWord.id
      )

      const result = quiz.selectAnswer(correctOption)

      expect(result).toBe(true)
      expect(quiz.score.value).toBe(1)
    })

    it('should return false for incorrect answer', () => {
      const currentWord = quiz.currentQuestion.value
      const wrongOption = quiz.currentQuestion.value.options.find(
        opt => opt.id !== currentWord.id
      )

      const result = quiz.selectAnswer(wrongOption)

      expect(result).toBe(false)
      expect(quiz.score.value).toBe(0)
    })

    it('should not allow selecting another answer after answering', () => {
      const options = quiz.currentQuestion.value.options
      quiz.selectAnswer(options[0])
      const result = quiz.selectAnswer(options[1])

      expect(result).toBeNull()
      expect(quiz.selectedAnswer.value).toBe(options[0])
    })

    it('should record answer in answers array', () => {
      const option = quiz.currentQuestion.value.options[0]
      quiz.selectAnswer(option)

      expect(quiz.answers.value.length).toBe(1)
      expect(quiz.answers.value[0].selected).toBe(option)
    })
  })

  describe('nextQuestion', () => {
    beforeEach(() => {
      quiz.initQuiz(mockWords)
    })

    it('should move to next question', () => {
      quiz.selectAnswer(quiz.currentQuestion.value.options[0])
      const result = quiz.nextQuestion()

      expect(result.completed).toBe(false)
      expect(quiz.currentIndex.value).toBe(1)
    })

    it('should reset answered state for new question', () => {
      quiz.selectAnswer(quiz.currentQuestion.value.options[0])
      quiz.nextQuestion()

      expect(quiz.isAnswered.value).toBe(false)
      expect(quiz.selectedAnswer.value).toBeNull()
    })

    it('should mark quiz as completed on last question', () => {
      // Answer all questions
      for (let i = 0; i < mockWords.length; i++) {
        quiz.selectAnswer(quiz.currentQuestion.value.options[0])
        const result = quiz.nextQuestion()

        if (i === mockWords.length - 1) {
          expect(result.completed).toBe(true)
          expect(quiz.isCompleted.value).toBe(true)
        }
      }
    })

    it('should return final results when completed', () => {
      // Answer all questions correctly
      for (let i = 0; i < mockWords.length; i++) {
        const correctOption = quiz.currentQuestion.value.options.find(
          opt => opt.id === quiz.currentQuestion.value.id
        )
        quiz.selectAnswer(correctOption)
        const result = quiz.nextQuestion()

        if (i === mockWords.length - 1) {
          expect(result.score).toBe(mockWords.length)
          expect(result.total).toBe(mockWords.length)
          expect(result.accuracy).toBe(100)
          expect(result.xpEarned).toBe(20) // 100% accuracy = 20 XP
        }
      }
    })
  })

  describe('progress', () => {
    beforeEach(() => {
      quiz.initQuiz(mockWords)
    })

    it('should calculate progress correctly', () => {
      expect(quiz.progress.value).toBe(0)

      quiz.selectAnswer(quiz.currentQuestion.value.options[0])
      quiz.nextQuestion()
      expect(quiz.progress.value).toBe(20) // 1/5 = 20%

      quiz.selectAnswer(quiz.currentQuestion.value.options[0])
      quiz.nextQuestion()
      expect(quiz.progress.value).toBe(40) // 2/5 = 40%
    })
  })

  describe('accuracy', () => {
    beforeEach(() => {
      quiz.initQuiz(mockWords)
    })

    it('should calculate accuracy based on correct answers', () => {
      // Answer 2 correctly, 3 wrong
      for (let i = 0; i < mockWords.length; i++) {
        const currentWord = quiz.currentQuestion.value
        const option = i < 2
          ? quiz.currentQuestion.value.options.find(opt => opt.id === currentWord.id)
          : quiz.currentQuestion.value.options.find(opt => opt.id !== currentWord.id)

        quiz.selectAnswer(option)
        quiz.nextQuestion()
      }

      expect(quiz.accuracy.value).toBe(40) // 2/5 = 40%
    })
  })

  describe('xpEarned', () => {
    beforeEach(() => {
      quiz.initQuiz(mockWords)
    })

    it('should calculate XP based on score', () => {
      // Answer all correctly
      for (let i = 0; i < mockWords.length; i++) {
        const correctOption = quiz.currentQuestion.value.options.find(
          opt => opt.id === quiz.currentQuestion.value.id
        )
        quiz.selectAnswer(correctOption)
        quiz.nextQuestion()
      }

      expect(quiz.xpEarned.value).toBe(20) // 5/5 * 20 = 20 XP
    })

    it('should give partial XP for partial score', () => {
      // Answer 2 correctly out of 5
      for (let i = 0; i < mockWords.length; i++) {
        const currentWord = quiz.currentQuestion.value
        const option = i < 2
          ? quiz.currentQuestion.value.options.find(opt => opt.id === currentWord.id)
          : quiz.currentQuestion.value.options.find(opt => opt.id !== currentWord.id)

        quiz.selectAnswer(option)
        quiz.nextQuestion()
      }

      expect(quiz.xpEarned.value).toBe(8) // 2/5 * 20 = 8 XP
    })
  })

  describe('isCorrectOption', () => {
    beforeEach(() => {
      quiz.initQuiz(mockWords)
    })

    it('should return true for correct option', () => {
      const correctOption = quiz.currentQuestion.value.options.find(
        opt => opt.id === quiz.currentQuestion.value.id
      )
      expect(quiz.isCorrectOption(correctOption)).toBe(true)
    })

    it('should return false for incorrect option', () => {
      const wrongOption = quiz.currentQuestion.value.options.find(
        opt => opt.id !== quiz.currentQuestion.value.id
      )
      expect(quiz.isCorrectOption(wrongOption)).toBe(false)
    })

    it('should return false when no current question', () => {
      const newQuiz = useQuiz()
      expect(newQuiz.isCorrectOption({ id: 1 })).toBe(false)
    })
  })

  describe('restartQuiz', () => {
    it('should reset quiz completely', () => {
      quiz.initQuiz(mockWords)

      // Complete a quiz
      for (let i = 0; i < mockWords.length; i++) {
        quiz.selectAnswer(quiz.currentQuestion.value.options[0])
        quiz.nextQuestion()
      }

      expect(quiz.isCompleted.value).toBe(true)

      quiz.restartQuiz(mockWords)

      expect(quiz.isCompleted.value).toBe(false)
      expect(quiz.currentIndex.value).toBe(0)
      expect(quiz.score.value).toBe(0)
      expect(quiz.answers.value).toEqual([])
    })
  })

  describe('totalQuestions', () => {
    it('should return total number of questions', () => {
      quiz.initQuiz(mockWords)
      expect(quiz.totalQuestions.value).toBe(mockWords.length)
    })

    it('should return 0 when not initialized', () => {
      expect(quiz.totalQuestions.value).toBe(0)
    })
  })
})
