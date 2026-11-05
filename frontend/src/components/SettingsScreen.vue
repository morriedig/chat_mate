<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useDarkMode } from '../composables/useDarkMode'
import { useDailyGoal } from '../composables/useDailyGoal'
import { useMotherTongue, supportedLanguages } from '../composables/useMotherTongue'
import { useUserProgress } from '../composables/useUserProgress'
import { useVoiceSettings } from '../composables/useVoiceSettings'
import { languageCode } from '../utils/levelCode'
import CmAppBar from './ui/CmAppBar.vue'
import CmButton from './ui/CmButton.vue'
import CmBottomSheet from './ui/CmBottomSheet.vue'
import CmSegmentedControl from './ui/CmSegmentedControl.vue'

const { t, locale } = useI18n()
const router = useRouter()

const { isDark, toggle: toggleDark } = useDarkMode()
const { goalMinutes, setGoal } = useDailyGoal()
const { motherTongue, setMotherTongue } = useMotherTongue()
const { progress, resetProgress } = useUserProgress()
const { pauseMs, setPauseMs, PAUSE_CHOICES } = useVoiceSettings()

const showResetConfirm = ref(false)
const showExportSuccess = ref(false)

const goalOptions = [5, 10, 15]
const goalChoices = computed(() => goalOptions.map(mins => ({ value: mins, label: t('dailyGoal.minutes', { count: mins }) })))
const pauseChoices = computed(() => PAUSE_CHOICES.map(ms => ({ value: ms, label: t('voiceSettings.seconds', { sec: ms / 1000 }) })))

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
        alert(t('settings.invalidBackup'))
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
      alert(t('settings.importFailed'))
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
  <div class="min-h-screen bg-page">
    <CmAppBar :title="t('settings.title')" :back-label="t('common.back')" @back="router.push('/')" />

    <div class="mx-auto max-w-lg space-y-8 px-4 pb-[max(32px,env(safe-area-inset-bottom))] pt-6 min-[375px]:px-5">
      <!-- Language -->
      <section aria-labelledby="settings-language">
        <h2 id="settings-language" class="mb-2 px-4 text-caption font-medium text-ink-secondary">{{ t('setup.motherTongue') }}</h2>
        <div role="radiogroup" aria-labelledby="settings-language" class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface">
          <button
            v-for="lang in supportedLanguages"
            :key="lang.id"
            type="button"
            role="radio"
            :aria-checked="motherTongue === lang.id"
            @click="handleLanguageChange(lang.id)"
            class="flex min-h-[52px] w-full items-center gap-3 px-4 text-left active:bg-surface-raised"
          >
            <span class="w-12 shrink-0 text-caption font-medium text-ink-muted">{{ languageCode(lang.id) }}</span>
            <span class="min-w-0 flex-1 text-body text-ink">{{ lang.nativeName }}</span>
            <span v-if="motherTongue === lang.id" class="material-symbols-outlined shrink-0 text-accent" aria-hidden="true">check</span>
          </button>
        </div>
      </section>

      <!-- Appearance -->
      <section aria-labelledby="settings-appearance">
        <h2 id="settings-appearance" class="mb-2 px-4 text-caption font-medium text-ink-secondary">{{ t('settings.appearance') }}</h2>
        <div class="overflow-hidden rounded-[14px] border border-hairline bg-surface">
          <div class="flex min-h-[52px] items-center gap-3 pl-4 pr-2">
            <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">{{ isDark ? 'dark_mode' : 'light_mode' }}</span>
            <span id="settings-dark-label" class="min-w-0 flex-1 text-body text-ink">{{ t('settings.darkMode') }}</span>
            <!-- 48 × 28 switch inside a 44 px hit area -->
            <button
              type="button"
              role="switch"
              :aria-checked="isDark"
              aria-labelledby="settings-dark-label"
              @click="toggleDark"
              class="flex h-11 w-14 shrink-0 items-center justify-center rounded-[10px]"
            >
              <span
                class="relative block h-7 w-12 rounded-full border transition-colors duration-[180ms]"
                :class="isDark ? 'border-accent bg-accent' : 'border-hairline bg-surface-raised'"
                aria-hidden="true"
              >
                <span
                  class="absolute left-0.5 top-0.5 size-[22px] rounded-full bg-surface shadow-[var(--cm-shadow-small)] transition-transform duration-[180ms]"
                  :class="isDark ? 'translate-x-5' : 'translate-x-0'"
                ></span>
              </span>
            </button>
          </div>
        </div>
      </section>

      <!-- Daily Goal -->
      <section aria-labelledby="settings-goal">
        <h2 id="settings-goal" class="mb-2 px-4 text-caption font-medium text-ink-secondary">{{ t('dailyGoal.title') }}</h2>
        <div class="rounded-[14px] border border-hairline bg-surface p-3">
          <CmSegmentedControl
            :options="goalChoices"
            :model-value="goalMinutes"
            :label="t('dailyGoal.title')"
            @update:model-value="setGoal"
          />
        </div>
      </section>

      <!-- Voice -->
      <section aria-labelledby="settings-voice">
        <h2 id="settings-voice" class="mb-2 px-4 text-caption font-medium text-ink-secondary">{{ t('voiceSettings.title') }}</h2>
        <div class="rounded-[14px] border border-hairline bg-surface p-4">
          <p class="text-body text-ink">{{ t('voiceSettings.pauseLabel') }}</p>
          <p class="mb-3 mt-0.5 text-caption text-ink-secondary">{{ t('voiceSettings.pauseHint') }}</p>
          <CmSegmentedControl
            :options="pauseChoices"
            :model-value="pauseMs"
            :label="t('voiceSettings.pauseLabel')"
            @update:model-value="setPauseMs"
          />
        </div>
      </section>

      <!-- Data Management -->
      <section aria-labelledby="settings-data">
        <h2 id="settings-data" class="mb-2 px-4 text-caption font-medium text-ink-secondary">{{ t('settings.data') }}</h2>
        <div class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface">
          <button type="button" @click="exportProgress" class="flex min-h-[52px] w-full items-center gap-3 px-4 text-left active:bg-surface-raised">
            <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">download</span>
            <span class="min-w-0 flex-1 text-body text-ink">{{ t('settings.export') }}</span>
            <span v-if="showExportSuccess" role="status" class="flex shrink-0 items-center gap-1 text-caption text-success">
              <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">check</span>{{ t('settings.saved') }}
            </span>
            <span v-else class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">chevron_right</span>
          </button>
          <button type="button" @click="importProgress" class="flex min-h-[52px] w-full items-center gap-3 px-4 text-left active:bg-surface-raised">
            <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">upload</span>
            <span class="min-w-0 flex-1 text-body text-ink">{{ t('settings.import') }}</span>
            <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">chevron_right</span>
          </button>
          <button type="button" @click="showResetConfirm = true" class="flex min-h-[52px] w-full items-center gap-3 px-4 text-left active:bg-surface-raised">
            <span class="material-symbols-outlined shrink-0 text-error" aria-hidden="true">delete</span>
            <span class="min-w-0 flex-1 text-body text-error">{{ t('settings.reset') }}</span>
          </button>
        </div>
      </section>

      <!-- About -->
      <section aria-labelledby="settings-about">
        <h2 id="settings-about" class="mb-2 px-4 text-caption font-medium text-ink-secondary">{{ t('settings.about') }}</h2>
        <div class="flex min-h-[52px] flex-col justify-center rounded-[14px] border border-hairline bg-surface px-4 py-3">
          <p class="text-body text-ink">Chat Mate</p>
          <p class="text-caption text-ink-secondary">{{ t('settings.tagline') }}</p>
        </div>
      </section>
    </div>

    <!-- Reset confirmation: bottom sheet on phones -->
    <CmBottomSheet
      v-if="showResetConfirm"
      :title="t('settings.resetConfirmTitle')"
      :description="t('settings.resetConfirmBody')"
      :close-label="t('common.close')"
      @close="showResetConfirm = false"
    >
      <template #actions>
        <div class="grid grid-cols-2 gap-3">
          <CmButton variant="secondary" @click="showResetConfirm = false">{{ t('common.cancel') }}</CmButton>
          <button type="button" @click="handleReset" class="min-h-12 rounded-[10px] bg-error px-4 text-body font-medium text-on-accent">
            {{ t('settings.resetButton') }}
          </button>
        </div>
      </template>
    </CmBottomSheet>
  </div>
</template>
