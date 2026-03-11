import { ref } from 'vue'

// Shared navigation state (singleton)
const selectedCharacter = ref(null)
const selectedLevel = ref(null)
const selectedLanguage = ref('en')
const selectedArticle = ref(null)
const chatMode = ref('free')
const activeScenario = ref(null)

// Learning mode state
const learningLevel = ref(null)
const selectedMotherTongue = ref('en')
const selectedTargetLanguage = ref('ja')
const uiLanguage = ref('en')

export function useNavState() {
  function setChatState({ character, level, language, mode, scenario }) {
    selectedCharacter.value = character
    selectedLevel.value = level
    selectedLanguage.value = language
    chatMode.value = mode || 'free'
    activeScenario.value = scenario || null
  }

  function setLearningState({ level, targetLanguage, motherTongue, uiLanguage: ui }) {
    learningLevel.value = level
    selectedTargetLanguage.value = targetLanguage
    selectedMotherTongue.value = motherTongue || 'en'
    uiLanguage.value = ui || 'en'
  }

  function setArticle(article) {
    selectedArticle.value = article
  }

  function clearArticle() {
    selectedArticle.value = null
  }

  function clearState() {
    selectedArticle.value = null
    chatMode.value = 'free'
    activeScenario.value = null
    learningLevel.value = null
  }

  return {
    // Chat state
    selectedCharacter,
    selectedLevel,
    selectedLanguage,
    selectedArticle,
    chatMode,
    activeScenario,
    // Learning state
    learningLevel,
    selectedMotherTongue,
    selectedTargetLanguage,
    uiLanguage,
    // Actions
    setChatState,
    setLearningState,
    setArticle,
    clearArticle,
    clearState,
  }
}
