import { ref, computed } from 'vue'
import { shuffleArray } from '../utils/shuffle'

/**
 * Quiz logic composable (SRP: handles only quiz state and logic)
 * @param {Array} words - Array of vocabulary words
 * @returns {Object} Quiz state and methods
 */
export function useQuiz(words) {
  // State
  const quizWords = ref([])
  const currentIndex = ref(0)
  const selectedAnswer = ref(null)
  const isAnswered = ref(false)
  const score = ref(0)
  const isCompleted = ref(false)
  const answers = ref([])

  // Computed
  const currentQuestion = computed(() => quizWords.value[currentIndex.value])

  const progress = computed(() => {
    if (quizWords.value.length === 0) return 0
    return (currentIndex.value / quizWords.value.length) * 100
  })

  const accuracy = computed(() => {
    if (quizWords.value.length === 0) return 0
    return Math.round((score.value / quizWords.value.length) * 100)
  })

  const totalQuestions = computed(() => quizWords.value.length)

  const xpEarned = computed(() => {
    if (quizWords.value.length === 0) return 0
    return Math.round((score.value / quizWords.value.length) * 20)
  })

  // Methods
  function generateOptions(correctWord, allWords) {
    const options = [correctWord]
    const otherWords = allWords.filter(w => w.id !== correctWord.id)
    const shuffled = shuffleArray(otherWords)

    // Pick 3 random wrong answers
    for (let i = 0; i < Math.min(3, shuffled.length); i++) {
      options.push(shuffled[i])
    }

    return shuffleArray(options)
  }

  function initQuiz(wordList) {
    const shuffled = shuffleArray(wordList)
    quizWords.value = shuffled.map(word => ({
      ...word,
      options: generateOptions(word, wordList)
    }))
    currentIndex.value = 0
    selectedAnswer.value = null
    isAnswered.value = false
    score.value = 0
    isCompleted.value = false
    answers.value = []
  }

  function selectAnswer(option) {
    if (isAnswered.value) return null

    selectedAnswer.value = option
    isAnswered.value = true

    const isCorrect = option.id === currentQuestion.value.id
    answers.value.push({
      word: currentQuestion.value,
      selected: option,
      isCorrect
    })

    if (isCorrect) {
      score.value++
    }

    return isCorrect
  }

  function nextQuestion() {
    if (currentIndex.value < quizWords.value.length - 1) {
      currentIndex.value++
      selectedAnswer.value = null
      isAnswered.value = false
      return { completed: false }
    } else {
      isCompleted.value = true
      return {
        completed: true,
        score: score.value,
        total: quizWords.value.length,
        accuracy: accuracy.value,
        xpEarned: xpEarned.value
      }
    }
  }

  function restartQuiz(wordList) {
    initQuiz(wordList)
  }

  function isCorrectOption(option) {
    if (!currentQuestion.value) return false
    return option.id === currentQuestion.value.id
  }

  return {
    // State
    quizWords,
    currentIndex,
    selectedAnswer,
    isAnswered,
    score,
    isCompleted,
    answers,
    // Computed
    currentQuestion,
    progress,
    accuracy,
    totalQuestions,
    xpEarned,
    // Methods
    initQuiz,
    selectAnswer,
    nextQuestion,
    restartQuiz,
    isCorrectOption
  }
}
