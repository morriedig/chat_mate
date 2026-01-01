import { describe, it, expect, beforeEach } from 'vitest'
import { useFlashcard } from '../../composables/useFlashcard'

// Mock words for testing
const mockWords = [
  { id: 1, word: 'hello', meaning: 'greeting', audio: '/audio/hello.mp3' },
  { id: 2, word: 'goodbye', meaning: 'farewell', audio: '/audio/goodbye.mp3' },
  { id: 3, word: 'thanks', meaning: 'gratitude', audio: '/audio/thanks.mp3' },
  { id: 4, word: 'please', meaning: 'polite request', audio: '/audio/please.mp3' },
  { id: 5, word: 'sorry', meaning: 'apology', audio: '/audio/sorry.mp3' }
]

describe('useFlashcard', () => {
  let flashcard

  beforeEach(() => {
    flashcard = useFlashcard()
  })

  describe('initial state', () => {
    it('should have empty initial state', () => {
      expect(flashcard.shuffledWords.value).toEqual([])
      expect(flashcard.currentIndex.value).toBe(0)
      expect(flashcard.isFlipped.value).toBe(false)
    })

    it('should have zero total cards initially', () => {
      expect(flashcard.totalCards.value).toBe(0)
    })

    it('should have zero progress initially', () => {
      expect(flashcard.progress.value).toBe(0)
    })

    it('should return undefined for currentWord initially', () => {
      expect(flashcard.currentWord.value).toBeUndefined()
    })
  })

  describe('initCards', () => {
    it('should initialize with shuffled words', () => {
      flashcard.initCards(mockWords)

      expect(flashcard.shuffledWords.value.length).toBe(mockWords.length)
      expect(flashcard.totalCards.value).toBe(mockWords.length)
    })

    it('should reset index to 0', () => {
      flashcard.initCards(mockWords)
      flashcard.nextCard()
      flashcard.nextCard()

      flashcard.initCards(mockWords)

      expect(flashcard.currentIndex.value).toBe(0)
    })

    it('should reset flipped state', () => {
      flashcard.initCards(mockWords)
      flashcard.flipCard()

      flashcard.initCards(mockWords)

      expect(flashcard.isFlipped.value).toBe(false)
    })

    it('should contain all original words', () => {
      flashcard.initCards(mockWords)

      const shuffledIds = flashcard.shuffledWords.value.map(w => w.id).sort()
      const originalIds = mockWords.map(w => w.id).sort()

      expect(shuffledIds).toEqual(originalIds)
    })
  })

  describe('currentWord', () => {
    beforeEach(() => {
      flashcard.initCards(mockWords)
    })

    it('should return the current word', () => {
      const current = flashcard.currentWord.value

      expect(current).toBeDefined()
      expect(current.word).toBeDefined()
      expect(current.meaning).toBeDefined()
    })

    it('should update when index changes', () => {
      const first = flashcard.currentWord.value

      flashcard.nextCard()

      const second = flashcard.currentWord.value

      expect(second).not.toBe(first)
    })
  })

  describe('flipCard', () => {
    beforeEach(() => {
      flashcard.initCards(mockWords)
    })

    it('should toggle flipped state', () => {
      expect(flashcard.isFlipped.value).toBe(false)

      flashcard.flipCard()
      expect(flashcard.isFlipped.value).toBe(true)

      flashcard.flipCard()
      expect(flashcard.isFlipped.value).toBe(false)
    })
  })

  describe('nextCard', () => {
    beforeEach(() => {
      flashcard.initCards(mockWords)
    })

    it('should increment current index', () => {
      expect(flashcard.currentIndex.value).toBe(0)

      flashcard.nextCard()
      expect(flashcard.currentIndex.value).toBe(1)

      flashcard.nextCard()
      expect(flashcard.currentIndex.value).toBe(2)
    })

    it('should reset flipped state', () => {
      flashcard.flipCard()
      expect(flashcard.isFlipped.value).toBe(true)

      flashcard.nextCard()
      expect(flashcard.isFlipped.value).toBe(false)
    })

    it('should not go beyond last card', () => {
      // Go to last card
      for (let i = 0; i < mockWords.length - 1; i++) {
        flashcard.nextCard()
      }

      expect(flashcard.currentIndex.value).toBe(mockWords.length - 1)

      // Try to go beyond
      flashcard.nextCard()
      expect(flashcard.currentIndex.value).toBe(mockWords.length - 1)
    })
  })

  describe('prevCard', () => {
    beforeEach(() => {
      flashcard.initCards(mockWords)
    })

    it('should decrement current index', () => {
      flashcard.nextCard()
      flashcard.nextCard()
      expect(flashcard.currentIndex.value).toBe(2)

      flashcard.prevCard()
      expect(flashcard.currentIndex.value).toBe(1)

      flashcard.prevCard()
      expect(flashcard.currentIndex.value).toBe(0)
    })

    it('should reset flipped state', () => {
      flashcard.nextCard()
      flashcard.flipCard()
      expect(flashcard.isFlipped.value).toBe(true)

      flashcard.prevCard()
      expect(flashcard.isFlipped.value).toBe(false)
    })

    it('should not go below first card', () => {
      expect(flashcard.currentIndex.value).toBe(0)

      flashcard.prevCard()
      expect(flashcard.currentIndex.value).toBe(0)
    })
  })

  describe('progress', () => {
    beforeEach(() => {
      flashcard.initCards(mockWords)
    })

    it('should start at 20% (first card)', () => {
      // Progress is (currentIndex + 1) / total * 100
      expect(flashcard.progress.value).toBe(20) // 1/5 = 20%
    })

    it('should increase as cards are viewed', () => {
      flashcard.nextCard()
      expect(flashcard.progress.value).toBe(40) // 2/5 = 40%

      flashcard.nextCard()
      expect(flashcard.progress.value).toBe(60) // 3/5 = 60%

      flashcard.nextCard()
      expect(flashcard.progress.value).toBe(80) // 4/5 = 80%

      flashcard.nextCard()
      expect(flashcard.progress.value).toBe(100) // 5/5 = 100%
    })
  })

  describe('isFirstCard', () => {
    beforeEach(() => {
      flashcard.initCards(mockWords)
    })

    it('should be true on first card', () => {
      expect(flashcard.isFirstCard.value).toBe(true)
    })

    it('should be false after moving', () => {
      flashcard.nextCard()
      expect(flashcard.isFirstCard.value).toBe(false)
    })

    it('should be true after going back to first', () => {
      flashcard.nextCard()
      flashcard.prevCard()
      expect(flashcard.isFirstCard.value).toBe(true)
    })
  })

  describe('isLastCard', () => {
    beforeEach(() => {
      flashcard.initCards(mockWords)
    })

    it('should be false on first card', () => {
      expect(flashcard.isLastCard.value).toBe(false)
    })

    it('should be true on last card', () => {
      // Navigate to last card
      for (let i = 0; i < mockWords.length - 1; i++) {
        flashcard.nextCard()
      }

      expect(flashcard.isLastCard.value).toBe(true)
    })

    it('should be false after going back from last', () => {
      // Navigate to last card
      for (let i = 0; i < mockWords.length - 1; i++) {
        flashcard.nextCard()
      }

      flashcard.prevCard()
      expect(flashcard.isLastCard.value).toBe(false)
    })
  })

  describe('shuffle', () => {
    beforeEach(() => {
      flashcard.initCards(mockWords)
    })

    it('should re-shuffle the words', () => {
      // Navigate somewhere
      flashcard.nextCard()
      flashcard.nextCard()
      flashcard.flipCard()

      flashcard.shuffle(mockWords)

      expect(flashcard.currentIndex.value).toBe(0)
      expect(flashcard.isFlipped.value).toBe(false)
      expect(flashcard.shuffledWords.value.length).toBe(mockWords.length)
    })

    it('should contain all original words after shuffle', () => {
      flashcard.shuffle(mockWords)

      const shuffledIds = flashcard.shuffledWords.value.map(w => w.id).sort()
      const originalIds = mockWords.map(w => w.id).sort()

      expect(shuffledIds).toEqual(originalIds)
    })
  })

  describe('totalCards', () => {
    it('should return correct count', () => {
      flashcard.initCards(mockWords)
      expect(flashcard.totalCards.value).toBe(5)
    })

    it('should return 0 when not initialized', () => {
      expect(flashcard.totalCards.value).toBe(0)
    })

    it('should update with different word lists', () => {
      flashcard.initCards(mockWords)
      expect(flashcard.totalCards.value).toBe(5)

      flashcard.initCards(mockWords.slice(0, 2))
      expect(flashcard.totalCards.value).toBe(2)
    })
  })

  describe('edge cases', () => {
    it('should handle empty word list', () => {
      flashcard.initCards([])

      expect(flashcard.shuffledWords.value).toEqual([])
      expect(flashcard.totalCards.value).toBe(0)
      expect(flashcard.currentWord.value).toBeUndefined()
      expect(flashcard.progress.value).toBe(0)
    })

    it('should handle single word', () => {
      flashcard.initCards([mockWords[0]])

      expect(flashcard.totalCards.value).toBe(1)
      expect(flashcard.isFirstCard.value).toBe(true)
      expect(flashcard.isLastCard.value).toBe(true)
      expect(flashcard.progress.value).toBe(100)
    })
  })
})
