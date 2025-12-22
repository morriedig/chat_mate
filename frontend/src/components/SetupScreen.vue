<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { characters, levels } from '../data/characters.js'

const { t, locale } = useI18n()
const emit = defineEmits(['start'])

const selectedCharacter = ref(null)
const selectedLevel = ref(null)

function toggleLanguage() {
  locale.value = locale.value === 'en' ? 'ja' : 'en'
  localStorage.setItem('chatmate_locale', locale.value)
}

function startChat() {
  if (selectedCharacter.value && selectedLevel.value) {
    emit('start', {
      character: selectedCharacter.value,
      level: selectedLevel.value,
      language: locale.value,
    })
  }
}
</script>

<template>
  <div class="setup-screen">
    <button class="lang-toggle" @click="toggleLanguage">
      {{ locale === 'en' ? '日本語' : 'English' }}
    </button>

    <h1>{{ t('app.title') }}</h1>
    <p class="subtitle">{{ t('app.subtitle') }}</p>

    <section class="selection-section">
      <h2>{{ t('setup.choosePartner') }}</h2>
      <div class="cards">
        <div
          v-for="char in characters"
          :key="char.id"
          class="card character-card"
          :class="{ selected: selectedCharacter?.id === char.id }"
          @click="selectedCharacter = char"
        >
          <div class="avatar">{{ char.avatar }}</div>
          <div class="info">
            <h3>{{ char.name }}</h3>
            <p class="meta">{{ char.age }} · {{ char.location }}</p>
            <p class="tagline">{{ t(`characters.${char.id}.tagline`) }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="selection-section">
      <h2>{{ t('setup.yourLevel') }}</h2>
      <div class="cards level-cards">
        <div
          v-for="level in levels"
          :key="level.id"
          class="card level-card"
          :class="{ selected: selectedLevel?.id === level.id }"
          @click="selectedLevel = level"
        >
          <div class="icon">{{ level.icon }}</div>
          <h3>{{ t(`levels.${level.id}.name`) }}</h3>
          <p>{{ t(`levels.${level.id}.description`) }}</p>
        </div>
      </div>
    </section>

    <button
      class="start-btn"
      :disabled="!selectedCharacter || !selectedLevel"
      @click="startChat"
    >
      {{ t('setup.startChatting') }}
    </button>
  </div>
</template>

<style scoped>
.setup-screen {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
}

.lang-toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.lang-toggle:hover {
  background: #e0e0e0;
}

h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.selection-section {
  margin-bottom: 2rem;
}

.selection-section h2 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 1rem;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.level-cards {
  flex-direction: row;
}

.card {
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.card:hover {
  border-color: #999;
}

.card.selected {
  border-color: #4a90d9;
  background: #f0f7ff;
}

.character-card {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.character-card .avatar {
  font-size: 2.5rem;
}

.character-card .info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.character-card .meta {
  font-size: 0.85rem;
  color: #666;
  margin: 0 0 0.25rem 0;
}

.character-card .tagline {
  font-size: 0.9rem;
  color: #444;
  margin: 0;
}

.level-card {
  flex: 1;
  text-align: center;
}

.level-card .icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.level-card h3 {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
}

.level-card p {
  margin: 0;
  font-size: 0.75rem;
  color: #666;
}

.start-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: #4a90d9;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.start-btn:hover:not(:disabled) {
  background: #3a7bc8;
}

.start-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
