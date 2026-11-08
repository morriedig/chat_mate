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
import { exportBackup, pickBackupFile, parseBackup, previewRestore, applyRestore, clearAllData, BackupError } from '../composables/useBackup'
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

const goalOptions = [5, 10, 15]
const goalChoices = computed(() => goalOptions.map(mins => ({ value: mins, label: t('dailyGoal.minutes', { count: mins }) })))
const pauseChoices = computed(() => PAUSE_CHOICES.map(ms => ({ value: ms, label: t('voiceSettings.seconds', { sec: ms / 1000 }) })))

function handleLanguageChange(langId) {
  setMotherTongue(langId)
  locale.value = langId
  localStorage.setItem('chatmate_locale', langId)
}

const exportState = ref('idle') // idle | working | done
const backupError = ref('')
const restorePreview = ref(null)
const restoreParsed = ref(null)
const restoring = ref(false)

const ERROR_KEYS = {
  invalid: 'settings.backupInvalid',
  corrupt: 'settings.backupCorrupt',
  unsupported: 'settings.backupUnsupported',
  tooLarge: 'settings.backupTooLarge',
}

async function handleExport() {
  if (exportState.value === 'working') return
  backupError.value = ''
  exportState.value = 'working'
  try {
    const result = await exportBackup()
    if (result === 'cancelled') {
      exportState.value = 'idle'
      return
    }
    exportState.value = 'done'
    setTimeout(() => { exportState.value = 'idle' }, 2000)
  } catch (err) {
    console.error('Backup export failed:', err)
    exportState.value = 'idle'
    backupError.value = t('settings.backupExportFailed')
  }
}

async function handleImport() {
  backupError.value = ''
  try {
    const text = await pickBackupFile()
    if (text === null) return
    const parsed = parseBackup(text)
    restoreParsed.value = parsed
    restorePreview.value = previewRestore(parsed)
  } catch (err) {
    backupError.value = t(err instanceof BackupError && ERROR_KEYS[err.code] ? ERROR_KEYS[err.code] : 'settings.backupInvalid')
  }
}

function closeRestore() {
  if (restoring.value) return
  restorePreview.value = null
  restoreParsed.value = null
}

function confirmRestore() {
  if (!restoreParsed.value || restoring.value) return
  restoring.value = true
  try {
    applyRestore(restoreParsed.value)
    window.location.reload()
  } catch (err) {
    console.error('Restore failed:', err)
    restoring.value = false
    restorePreview.value = null
    restoreParsed.value = null
    backupError.value = t('settings.restoreFailed')
  }
}

const backupDate = computed(() => {
  const iso = restorePreview.value?.exportedAt
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString(locale.value, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
})

const restoreCounts = computed(() => {
  const p = restorePreview.value
  if (!p) return []
  return [
    { id: 'add', count: p.add.length },
    { id: 'overwrite', count: p.overwrite.length },
    { id: 'remove', count: p.remove.length },
    { id: 'ignore', count: p.ignore.length },
  ]
})

function handleReset() {
  resetProgress()
  clearAllData()
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
          <button type="button" @click="handleExport" :aria-busy="exportState === 'working'" class="flex min-h-[52px] w-full items-center gap-3 px-4 text-left active:bg-surface-raised">
            <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">ios_share</span>
            <span class="min-w-0 flex-1 text-body text-ink">{{ t('settings.export') }}</span>
            <span v-if="exportState === 'done'" role="status" class="flex shrink-0 items-center gap-1 text-caption text-success">
              <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">check</span>{{ t('settings.saved') }}
            </span>
            <span v-else class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">chevron_right</span>
          </button>
          <button type="button" @click="handleImport" class="flex min-h-[52px] w-full items-center gap-3 px-4 text-left active:bg-surface-raised">
            <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">settings_backup_restore</span>
            <span class="min-w-0 flex-1 text-body text-ink">{{ t('settings.import') }}</span>
            <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">chevron_right</span>
          </button>
          <button type="button" @click="showResetConfirm = true" class="flex min-h-[52px] w-full items-center gap-3 px-4 text-left active:bg-surface-raised">
            <span class="material-symbols-outlined shrink-0 text-error" aria-hidden="true">delete</span>
            <span class="min-w-0 flex-1 text-body text-error">{{ t('settings.reset') }}</span>
          </button>
        </div>
        <p v-if="backupError" role="alert" class="mt-2 flex items-start gap-1.5 px-4 text-caption text-error">
          <span class="material-symbols-outlined shrink-0 !text-[18px]" aria-hidden="true">error</span>
          <span class="min-w-0 break-words">{{ backupError }}</span>
        </p>
        <p class="mt-2 px-4 text-caption text-ink-muted">{{ t('settings.backupHint') }}</p>
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

    <!-- Restore preview -->
    <CmBottomSheet
      v-if="restorePreview"
      :title="t('settings.restoreTitle')"
      :description="t('settings.restoreDate', { date: backupDate })"
      :close-label="t('common.close')"
      @close="closeRestore"
    >
      <div class="space-y-4">
        <section aria-labelledby="restore-categories">
          <h3 id="restore-categories" class="mb-2 text-caption font-medium text-ink-secondary">{{ t('settings.restoreContains') }}</h3>
          <ul v-if="restorePreview.categories.length" class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline">
            <li v-for="cat in restorePreview.categories" :key="cat.id" class="flex min-h-11 items-center gap-3 px-4">
              <span class="min-w-0 flex-1 break-words text-body text-ink">{{ t(`settings.backupCategory.${cat.id}`) }}</span>
              <span class="shrink-0 text-caption text-ink-muted">{{ t('settings.restoreItems', cat.count) }}</span>
            </li>
          </ul>
          <p v-else class="text-body text-ink-secondary">{{ t('settings.restoreEmpty') }}</p>
        </section>

        <section aria-labelledby="restore-changes">
          <h3 id="restore-changes" class="mb-2 text-caption font-medium text-ink-secondary">{{ t('settings.restoreChanges') }}</h3>
          <dl class="grid grid-cols-2 gap-2">
            <div v-for="row in restoreCounts" :key="row.id" class="min-w-0 rounded-[12px] bg-surface-sunken px-3 py-2.5">
              <dt class="break-words text-caption text-ink-secondary">{{ t(`settings.restoreCount.${row.id}`) }}</dt>
              <dd class="text-title font-medium tabular-nums text-ink">{{ row.count }}</dd>
            </div>
          </dl>
          <p v-if="restorePreview.ignore.length" class="mt-2 text-caption text-ink-muted">{{ t('settings.restoreIgnoreHint') }}</p>
        </section>

        <div class="flex items-start gap-2 rounded-[12px] bg-warning-soft px-3 py-3">
          <span class="material-symbols-outlined shrink-0 !text-[20px] text-warning" aria-hidden="true">lock_open</span>
          <p class="min-w-0 break-words text-caption text-ink">{{ t('settings.restoreWarning') }}</p>
        </div>
      </div>
      <template #actions>
        <div class="grid grid-cols-2 gap-3">
          <CmButton variant="secondary" :disabled="restoring" @click="closeRestore">{{ t('common.cancel') }}</CmButton>
          <CmButton :disabled="restoring" @click="confirmRestore">{{ t('settings.restoreButton') }}</CmButton>
        </div>
      </template>
    </CmBottomSheet>
  </div>
</template>
