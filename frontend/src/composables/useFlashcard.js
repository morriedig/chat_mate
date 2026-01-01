import { ref, computed } from 'vue'
import { shuffleArray } from '../utils/shuffle'

/**
 * Flashcard logic composable (SRP: handles only flashcard state and navigation)
 * @returns {Object} Flashcard state and methods
 */
export function useFlashcard() {
  // State
  const shuffledWords = ref([])
  const currentIndex = ref(0)
  const isFlipped = ref(false)

  // Computed
  const currentWord = computed(() => shuffledWords.value[currentIndex.value])

  const progress = computed(() => {
    if (shuffledWords.value.length === 0) return 0
    return ((currentIndex.value + 1) / shuffledWords.value.length) * 100
  })

  const totalCards = computed(() => shuffledWords.value.length)

  const isFirstCard = computed(() => currentIndex.value === 0)

  const isLastCard = computed(() => currentIndex.value === shuffledWords.value.length - 1)

  // Methods
  function initCards(wordList) {
    shuffledWords.value = shuffleArray(wordList)
    currentIndex.value = 0
    isFlipped.value = false
  }

  function flipCard() {
    isFlipped.value = !isFlipped.value
  }

  function nextCard() {
    if (currentIndex.value < shuffledWords.value.length - 1) {
      currentIndex.value++
      isFlipped.value = false
    }
  }

  function prevCard() {
    if (currentIndex.value > 0) {
      currentIndex.value--
      isFlipped.value = false
    }
  }

  function shuffle(wordList) {
    initCards(wordList)
  }

  return {
    // State
    shuffledWords,
    currentIndex,
    isFlipped,
    // Computed
    currentWord,
    progress,
    totalCards,
    isFirstCard,
    isLastCard,
    // Methods
    initCards,
    flipCard,
    nextCard,
    prevCard,
    shuffle
  }
}
