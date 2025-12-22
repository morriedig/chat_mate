<script setup>
import { ref } from 'vue'
import SetupScreen from './components/SetupScreen.vue'
import ChatScreen from './components/ChatScreen.vue'

const currentScreen = ref('setup')
const selectedCharacter = ref(null)
const selectedLevel = ref(null)
const selectedLanguage = ref('en')

function handleStart({ character, level, language }) {
  selectedCharacter.value = character
  selectedLevel.value = level
  selectedLanguage.value = language
  currentScreen.value = 'chat'
}

function handleBack() {
  currentScreen.value = 'setup'
}
</script>

<template>
  <SetupScreen v-if="currentScreen === 'setup'" @start="handleStart" />
  <ChatScreen
    v-else
    :character="selectedCharacter"
    :level="selectedLevel"
    :language="selectedLanguage"
    @back="handleBack"
  />
</template>
