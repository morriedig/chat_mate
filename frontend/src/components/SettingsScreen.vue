<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useDarkMode } from '../composables/useDarkMode'
import { useDailyGoal } from '../composables/useDailyGoal'
import { useMotherTongue, supportedLanguages } from '../composables/useMotherTongue'
import { useUserProgress } from '../composables/useUserProgress'

const { t, locale } = useI18n()
const router = useRouter()

const { isDark, toggle: toggleDark } = useDarkMode()
const { goalMinutes, setGoal } = useDailyGoal()
const { motherTongue, setMotherTongue } = useMotherTongue()
const { progress, resetProgress } = useUserProgress()

const showResetConfirm = ref(false)
const showExportSuccess = ref(false)

const goalOptions = [5, 10, 15]

function handleLanguageChange(langId) {
  setMotherTongue(langId)
  locale.value = langId
  localStorage.setItem('chatmate_locale', langId)
}

function exportProgress() {
  const data = {
    userProgress: localStorage.getItem('chatmate_userProgress'),
    srs: localStorage.getItem('chatmate_srs'),
    vocabBank: localStorage.getItem('chatmate_vocabBank'),
    dailyGoal: localStorage.getItem('chatmate_dailyGoal'),
    exportedAt: new Date().toISOString(),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const link = document.createElement('a')
  link.download = `chatmate-backup-${new Date().toISOString().split('T')[0]}.json`
  const url = URL.createObjectURL(blob)
  link.href = url
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
  showExportSuccess.value = true
  setTimeout(() => showExportSuccess.value = false, 2000)
}

function importProgress() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      // Validate it looks like a Chat Mate backup
      if (!data.exportedAt || typeof data !== 'object') {
        alert('Invalid backup file')
        return
      }
      const validKeys = ['userProgress', 'srs', 'vocabBank', 'dailyGoal']
      for (const key of validKeys) {
        if (data[key] && typeof data[key] === 'string') {
          // Verify it's valid JSON before storing
          JSON.parse(data[key])
          localStorage.setItem(`chatmate_${key}`, data[key])
        }
      }
      window.location.reload()
    } catch (err) {
      console.error('Import failed:', err)
      alert('Failed to import backup file')
    }
  }
  input.click()
}

function handleReset() {
  resetProgress()
  localStorage.removeItem('chatmate_srs')
  localStorage.removeItem('chatmate_vocabBank')
  localStorage.removeItem('chatmate_dailyGoal')
  localStorage.removeItem('chatmate_dailyChallenge')
  localStorage.removeItem('chatmate_weeklyQuests')
  localStorage.removeItem('chatmate_scenarios')
  showResetConfirm.value = false
  window.location.reload()
}
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <!-- Header -->
    <div class="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700 safe-area-top">
      <button @click="router.push('/')" class="text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 class="text-lg font-bold text-text-main dark:text-white">Settings</h1>
    </div>

    <div class="max-w-lg mx-auto p-4 space-y-6">
      <!-- Language -->
      <section>
        <h3 class="text-sm font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider mb-3">{{ t('setup.motherTongue') }}</h3>
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div
            v-for="lang in supportedLanguages"
            :key="lang.id"
            @click="handleLanguageChange(lang.id)"
            class="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
          >
            <span class="flex items-center gap-3">
              <span class="text-lg">{{ lang.flag }}</span>
              <span class="text-text-main dark:text-white font-medium">{{ lang.nativeName }}</span>
            </span>
            <span v-if="motherTongue === lang.id" class="material-symbols-outlined text-primary">check</span>
          </div>
        </div>
      </section>

      <!-- Dark Mode -->
      <section>
        <h3 class="text-sm font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider mb-3">Appearance</h3>
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-3">
              <span class="material-symbols-outlined text-text-muted dark:text-slate-400">{{ isDark ? 'dark_mode' : 'light_mode' }}</span>
              <span class="text-text-main dark:text-white font-medium">Dark Mode</span>
            </span>
            <button
              @click="toggleDark"
              class="relative w-12 h-7 rounded-full transition-colors"
              :class="isDark ? 'bg-primary' : 'bg-slate-300'"
            >
              <span
                class="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform"
                :class="isDark ? 'translate-x-5' : 'translate-x-0.5'"
              />
            </button>
          </div>
        </div>
      </section>

      <!-- Daily Goal -->
      <section>
        <h3 class="text-sm font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider mb-3">{{ t('dailyGoal.title') }}</h3>
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="mins in goalOptions"
              :key="mins"
              @click="setGoal(mins)"
              class="py-3 rounded-xl border-2 font-bold transition-all text-center"
              :class="goalMinutes === mins
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-slate-200 dark:border-slate-700 text-text-main dark:text-white hover:border-primary/50'"
            >
              {{ t('dailyGoal.minutes', { count: mins }) }}
            </button>
          </div>
        </div>
      </section>

      <!-- Data Management -->
      <section>
        <h3 class="text-sm font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider mb-3">Data</h3>
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <button @click="exportProgress" class="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-700">
            <span class="flex items-center gap-3">
              <span class="material-symbols-outlined text-text-muted dark:text-slate-400">download</span>
              <span class="text-text-main dark:text-white font-medium">Export Progress</span>
            </span>
            <span v-if="showExportSuccess" class="text-green-500 text-sm">Saved!</span>
            <span v-else class="material-symbols-outlined text-slate-400">chevron_right</span>
          </button>
          <button @click="importProgress" class="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-700">
            <span class="flex items-center gap-3">
              <span class="material-symbols-outlined text-text-muted dark:text-slate-400">upload</span>
              <span class="text-text-main dark:text-white font-medium">Import Progress</span>
            </span>
            <span class="material-symbols-outlined text-slate-400">chevron_right</span>
          </button>
          <button @click="showResetConfirm = true" class="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <span class="flex items-center gap-3">
              <span class="material-symbols-outlined text-red-500">delete_forever</span>
              <span class="text-red-600 dark:text-red-400 font-medium">Reset All Progress</span>
            </span>
            <span class="material-symbols-outlined text-slate-400">chevron_right</span>
          </button>
        </div>
      </section>

      <!-- About -->
      <section class="pb-8">
        <h3 class="text-sm font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider mb-3">About</h3>
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p class="text-text-main dark:text-white font-medium">Chat Mate</p>
          <p class="text-sm text-text-muted dark:text-slate-400">AI Language Learning Companion</p>
        </div>
      </section>
    </div>

    <!-- Reset Confirm Dialog -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showResetConfirm" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50" @click="showResetConfirm = false" />
          <div class="relative bg-surface-light dark:bg-surface-dark rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <span class="material-symbols-outlined text-4xl text-red-500 mb-3">warning</span>
            <h3 class="text-lg font-bold text-text-main dark:text-white mb-2">Reset All Progress?</h3>
            <p class="text-sm text-text-muted dark:text-slate-400 mb-4">This will permanently delete all your XP, streaks, vocabulary, and achievements. This cannot be undone.</p>
            <div class="flex gap-3">
              <button @click="showResetConfirm = false" class="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-text-main dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Cancel
              </button>
              <button @click="handleReset" class="flex-1 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors">
                Reset
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
