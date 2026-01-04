<script setup>
import { ref } from 'vue'
import SetupScreen from './components/SetupScreen.vue'
import ChatScreen from './components/ChatScreen.vue'
import ArticleScreen from './components/ArticleScreen.vue'
import LearningScreen from './components/LearningScreen.vue'

const currentScreen = ref('setup')
const selectedCharacter = ref(null)
const selectedLevel = ref(null)
const selectedLanguage = ref('en')
const selectedArticle = ref(null)
const chatMode = ref('free') // 'free' or 'article'

// Learning mode state
const learningLevel = ref(null)
const selectedMotherTongue = ref('en')
const selectedTargetLanguage = ref('ja')
const uiLanguage = ref('en')

function handleStart({ character, level, language, mode }) {
  selectedCharacter.value = character
  selectedLevel.value = level
  selectedLanguage.value = language
  chatMode.value = mode || 'free'

  if (mode === 'article') {
    currentScreen.value = 'articles'
  } else {
    currentScreen.value = 'chat'
  }
}

function handleStartLearning({ level, targetLanguage, motherTongue, uiLanguage: ui }) {
  learningLevel.value = level
  selectedTargetLanguage.value = targetLanguage
  selectedMotherTongue.value = motherTongue || 'en'
  uiLanguage.value = ui || 'en'
  currentScreen.value = 'learning'
}

function handleArticleSelect(article) {
  selectedArticle.value = article
  currentScreen.value = 'chat'
}

function handleBack() {
  if (currentScreen.value === 'chat' && chatMode.value === 'article') {
    currentScreen.value = 'articles'
    selectedArticle.value = null
  } else if (currentScreen.value === 'learning') {
    currentScreen.value = 'setup'
    learningLevel.value = null
  } else {
    currentScreen.value = 'setup'
    selectedArticle.value = null
    chatMode.value = 'free'
  }
}

function handleBackToSetup() {
  currentScreen.value = 'setup'
  selectedArticle.value = null
  chatMode.value = 'free'
  learningLevel.value = null
}
</script>

<template>
  <SetupScreen
    v-if="currentScreen === 'setup'"
    @start="handleStart"
    @start-learning="handleStartLearning"
  />
  <ArticleScreen
    v-else-if="currentScreen === 'articles'"
    :level="selectedLevel"
    @select="handleArticleSelect"
    @back="handleBackToSetup"
  />
  <LearningScreen
    v-else-if="currentScreen === 'learning'"
    :level="learningLevel"
    :target-language="selectedTargetLanguage"
    :mother-tongue="selectedMotherTongue"
    :ui-language="uiLanguage"
    @back="handleBack"
  />
  <ChatScreen
    v-else
    :character="selectedCharacter"
    :level="selectedLevel"
    :language="selectedLanguage"
    :article="selectedArticle"
    :mode="chatMode"
    @back="handleBack"
  />
</template>
