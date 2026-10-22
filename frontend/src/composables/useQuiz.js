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

  // Cloze: options are plain strings; wrap them so the template can key them
  function buildClozeQuestion(question) {
    const options = question.options.map((text, i) => ({ id: `${question.id}_opt_${i}`, text }))
    return { ...question, options: shuffleArray(options) }
  }

  /**
   * @param {Array} wordList - Chapter words (meaning → word quiz)
   * @param {Array} [clozeQuestions] - Optional fill-in-the-blank questions;
   *   when non-empty they replace the generated meaning questions
   */
  function initQuiz(wordList, clozeQuestions = []) {
    if (clozeQuestions?.length) {
      quizWords.value = shuffleArray(clozeQuestions).map(buildClozeQuestion)
    } else {
      const shuffled = shuffleArray(wordList)
      quizWords.value = shuffled.map(word => ({
        ...word,
        options: generateOptions(word, wordList)
      }))
    }
    currentIndex.value = 0
    selectedAnswer.value = null
    isAnswered.value = false
    score.value = 0
    isCompleted.value = false
    answers.value = []
  }

  function checkOption(option, question) {
    if (!option || !question) return false
    if (question.type === 'cloze') return option.text === question.answer
    return option.id === question.id
  }

  function selectAnswer(option) {
    if (isAnswered.value) return null

    selectedAnswer.value = option
    isAnswered.value = true

    const isCorrect = checkOption(option, currentQuestion.value)
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

  function restartQuiz(wordList, clozeQuestions = []) {
    initQuiz(wordList, clozeQuestions)
  }

  function isCorrectOption(option) {
    return checkOption(option, currentQuestion.value)
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
