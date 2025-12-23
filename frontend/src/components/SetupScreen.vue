<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { characters, levels } from '../data/characters.js'
import { useDarkMode } from '../composables/useDarkMode'

const { t, locale } = useI18n()
const { isDark, toggle: toggleDark } = useDarkMode()
const emit = defineEmits(['start'])

const selectedCharacter = ref(null)
const selectedLevel = ref(null)
const selectedMode = ref('free')

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
      mode: selectedMode.value,
    })
  }
}
</script>

<template>
  <div class="min-h-screen overflow-y-auto bg-background-light dark:bg-background-dark">
    <div class="max-w-2xl mx-auto px-4 py-8 pb-12">
      <!-- Header with language toggle -->
      <div class="flex justify-between items-center mb-8">
        <div></div>
        <div class="flex items-center gap-2">
          <button
            @click="toggleDark"
            class="flex items-center justify-center size-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 transition-colors"
          >
            <span class="material-symbols-outlined text-[20px]">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
          </button>
          <button
            @click="toggleLanguage"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 text-sm font-medium transition-colors"
          >
            <span class="material-symbols-outlined text-[18px]">translate</span>
            {{ locale === 'en' ? '日本語' : 'English' }}
          </button>
        </div>
      </div>

      <!-- Title -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-text-main dark:text-white mb-2">{{ t('app.title') }}</h1>
        <p class="text-text-muted dark:text-slate-400">{{ t('app.subtitle') }}</p>
      </div>

      <!-- Choose Partner Section -->
      <section class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <span class="material-symbols-outlined text-primary">person</span>
          <h2 class="text-lg font-semibold text-text-main dark:text-white">{{ t('setup.choosePartner') }}</h2>
        </div>
        <div class="flex gap-4 overflow-x-auto pb-2">
          <div
            v-for="char in characters"
            :key="char.id"
            @click="selectedCharacter = char"
            class="flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer bg-surface-light dark:bg-surface-dark shrink-0 w-72"
            :class="selectedCharacter?.id === char.id
              ? 'border-primary bg-primary/5 dark:bg-primary/10'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'"
          >
            <div class="flex items-center justify-center rounded-full size-16 shrink-0 shadow-md bg-slate-100 dark:bg-slate-800 text-4xl">
              {{ char.avatar }}
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-text-main dark:text-white text-lg">{{ char.name }}</h3>
              <p class="text-sm text-text-muted dark:text-slate-400">{{ char.age }} · {{ char.location }}</p>
              <p class="text-sm text-text-main dark:text-slate-300 mt-1">{{ t(`characters.${char.id}.tagline`) }}</p>
            </div>
            <div v-if="selectedCharacter?.id === char.id" class="shrink-0">
              <span class="material-symbols-outlined icon-filled text-primary text-2xl">check_circle</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Choose Level Section -->
      <section class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <span class="material-symbols-outlined text-primary">signal_cellular_alt</span>
          <h2 class="text-lg font-semibold text-text-main dark:text-white">{{ t('setup.yourLevel') }}</h2>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="level in levels"
            :key="level.id"
            @click="selectedLevel = level"
            class="flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer bg-surface-light dark:bg-surface-dark"
            :class="selectedLevel?.id === level.id
              ? 'border-primary bg-primary/5 dark:bg-primary/10'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'"
          >
            <span class="text-2xl mb-2">{{ level.icon }}</span>
            <h3 class="font-semibold text-text-main dark:text-white text-sm">{{ t(`levels.${level.id}.name`) }}</h3>
            <p class="text-xs text-text-muted dark:text-slate-400 text-center mt-1">{{ t(`levels.${level.id}.description`) }}</p>
          </div>
        </div>
      </section>

      <!-- Choose Mode Section -->
      <section class="mb-10">
        <div class="flex items-center gap-2 mb-4">
          <span class="material-symbols-outlined text-primary">category</span>
          <h2 class="text-lg font-semibold text-text-main dark:text-white">{{ t('setup.chooseMode') }}</h2>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div
            @click="selectedMode = 'free'"
            class="flex flex-col items-center p-5 rounded-xl border-2 transition-all cursor-pointer bg-surface-light dark:bg-surface-dark"
            :class="selectedMode === 'free'
              ? 'border-primary bg-primary/5 dark:bg-primary/10'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'"
          >
            <span class="material-symbols-outlined text-4xl mb-2" :class="selectedMode === 'free' ? 'text-primary' : 'text-slate-400'">chat_bubble</span>
            <h3 class="font-semibold text-text-main dark:text-white">{{ t('setup.modes.free.name') }}</h3>
            <p class="text-xs text-text-muted dark:text-slate-400 text-center mt-1">{{ t('setup.modes.free.description') }}</p>
          </div>
          <div
            @click="selectedMode = 'article'"
            class="flex flex-col items-center p-5 rounded-xl border-2 transition-all cursor-pointer bg-surface-light dark:bg-surface-dark"
            :class="selectedMode === 'article'
              ? 'border-primary bg-primary/5 dark:bg-primary/10'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'"
          >
            <span class="material-symbols-outlined text-4xl mb-2" :class="selectedMode === 'article' ? 'text-primary' : 'text-slate-400'">article</span>
            <h3 class="font-semibold text-text-main dark:text-white">{{ t('setup.modes.article.name') }}</h3>
            <p class="text-xs text-text-muted dark:text-slate-400 text-center mt-1">{{ t('setup.modes.article.description') }}</p>
          </div>
        </div>
      </section>

      <!-- Start Button -->
      <button
        @click="startChat"
        :disabled="!selectedCharacter || !selectedLevel"
        class="w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        :class="selectedCharacter && selectedLevel
          ? 'bg-primary text-[#0d171b] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]'
          : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400'"
      >
        <span class="flex items-center justify-center gap-2">
          <span class="material-symbols-outlined">arrow_forward</span>
          {{ t('setup.startChatting') }}
        </span>
      </button>
    </div>
  </div>
</template>
