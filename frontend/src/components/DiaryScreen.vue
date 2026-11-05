<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useNavState } from '../composables/useNavState'
import { useMotherTongue } from '../composables/useMotherTongue'
import { useDarkMode } from '../composables/useDarkMode'
import { useDiary } from '../composables/useDiary'
import { useDailyGoal } from '../composables/useDailyGoal'
import { characters } from '../data/characters'
import DiaryEditor from './diary/DiaryEditor.vue'
import DiaryFeedback from './diary/DiaryFeedback.vue'
import DiaryEntryCard from './diary/DiaryEntryCard.vue'
import DiaryCalendar from './diary/DiaryCalendar.vue'
import ContributionGrid from './diary/ContributionGrid.vue'
import CmAppBar from './ui/CmAppBar.vue'
import CmButton from './ui/CmButton.vue'
import CmSegmentedControl from './ui/CmSegmentedControl.vue'
import CmStateBlock from './ui/CmStateBlock.vue'
import { toLocalDateKey, LOCALE_MAP } from '../utils/dateUtils'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { isDark, toggle: toggleDark } = useDarkMode()
const {
  selectedCharacter: character,
  selectedLevel: level,
  selectedLanguage: language,
} = useNavState()
const { motherTongue } = useMotherTongue()

// Diary doesn't require character/level selection — use sensible defaults
const diaryLanguage = computed(() => language.value || 'en')
const diaryLevel = computed(() => level.value?.id || 'intermediate')

// Daily goal timer
const { startTimer, stopTimer } = useDailyGoal()

// Diary composable
const {
  entryIndex,
  loadEntry,
  submitEntry,
  retryFeedback,
  todayEntry,
  isLoadingFeedback,
  feedbackError,
  stats,
} = useDiary()

// Prompt passed via query parameter (from DailyPromptCard)
const initialPrompt = ref(route.query.prompt || '')

// View mode: 'write' or 'history'
const viewMode = ref('write')

// History sub-view: 'list' or 'calendar'
const historyView = ref('list')

// Date filter for calendar selection
const filterDate = ref(null)

// Current entry being viewed (for history detail)
const selectedEntry = ref(null)

// Active entry that was just submitted (to show feedback)
const activeEntry = ref(null)

// Rewrite state
const rewriteOfId = ref(null)
const rewriteInitialText = ref('')

// Resolve character for feedback display
const feedbackCharacter = computed(() => {
  const charId = character.value?.id || activeEntry.value?.characterId
  if (character.value) return character.value
  return characters.find(c => c.id === charId) || characters[0]
})

// Today's date formatted
const todayFormatted = computed(() => {
  return new Date().toLocaleDateString(
    LOCALE_MAP[diaryLanguage.value] || 'en-US',
    { month: 'short', day: 'numeric', weekday: 'short' }
  )
})

// Lifecycle
onMounted(() => {
  startTimer()

  // If there's already a today entry with feedback, show it
  if (todayEntry.value) {
    const full = loadEntry(todayEntry.value.id)
    if (full && full.feedback) {
      activeEntry.value = full
    }
  }
})

onBeforeUnmount(() => {
  stopTimer()
})

// Methods
async function handleSubmit(body) {
  const entry = await submitEntry(body, {
    language: diaryLanguage.value,
    level: diaryLevel.value,
    characterId: character.value?.id || 'emma',
    nativeLanguage: motherTongue.value || 'en',
    prompt: initialPrompt.value || null,
    rewriteOf: rewriteOfId.value || null,
  })

  activeEntry.value = entry

  // Clear prompt, draft, and rewrite state after submission
  initialPrompt.value = ''
  rewriteOfId.value = null
  rewriteInitialText.value = ''
  try {
    localStorage.removeItem('chatmate_diary_draft')
  } catch { /* ignore */ }
}

async function handleRetryFeedback() {
  if (!activeEntry.value) return
  // Retry feedback only — don't re-create entry or re-award XP
  await retryFeedback(activeEntry.value.id, {
    language: diaryLanguage.value,
    level: diaryLevel.value,
    characterId: character.value?.id || 'emma',
    nativeLanguage: motherTongue.value || 'en',
  })
  // Reload the entry to get updated feedback
  const updated = loadEntry(activeEntry.value.id)
  if (updated) activeEntry.value = updated
}

function handleRewrite() {
  if (!activeEntry.value) return
  rewriteOfId.value = activeEntry.value.id
  rewriteInitialText.value = activeEntry.value.body
  activeEntry.value = null
}

function handleRewriteFromHistory() {
  if (!selectedEntry.value) return
  rewriteOfId.value = selectedEntry.value.id
  rewriteInitialText.value = selectedEntry.value.body
  selectedEntry.value = null
  viewMode.value = 'write'
}

function handleWriteAnother() {
  activeEntry.value = null
  initialPrompt.value = ''
}

function handleExport() {
  const entries = entryIndex.value
  if (entries.length === 0) return

  const lines = entries.map(meta => {
    const full = loadEntry(meta.id)
    if (!full) return null

    const date = new Date(full.createdAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', weekday: 'short',
    })
    const wordLine = `Words: ${full.wordCount || 0}`
    const parts = [date, '', full.body, '', wordLine]

    if (full.feedback) {
      if (full.feedback.reaction || full.feedback.encouragement) {
        parts.push(`Feedback: ${full.feedback.reaction || full.feedback.encouragement}`)
      }
      if (full.feedback.corrections?.length) {
        parts.push(`Corrections: ${full.feedback.corrections.length}`)
      }
    }

    if (full.rewriteOf) {
      parts.push(`Rewrite of: ${full.rewriteOf}`)
    }

    return parts.join('\n')
  }).filter(Boolean)

  const text = lines.join('\n\n---\n\n')
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  try {
    const a = document.createElement('a')
    a.href = url
    a.download = `diary-export-${getExportDate()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } finally {
    URL.revokeObjectURL(url)
  }
}

function getExportDate() {
  return toLocalDateKey(new Date())
}

// Filtered entries for list view (when a calendar date is selected)
const filteredEntries = computed(() => {
  if (!filterDate.value) return entryIndex.value
  return entryIndex.value.filter(e => {
    const key = toLocalDateKey(e.createdAt)
    return key && key === filterDate.value
  })
})

// Total word count across all entries
const totalWords = computed(() => {
  return entryIndex.value.reduce((sum, e) => sum + (e.wordCount || 0), 0)
})

const historyViewOptions = computed(() => [
  { value: 'list', label: t('diary.list') },
  { value: 'calendar', label: t('diary.calendar') },
])

function setHistoryView(view) {
  historyView.value = view
  filterDate.value = null
}

function toggleViewMode() {
  viewMode.value = viewMode.value === 'write' ? 'history' : 'write'
  selectedEntry.value = null
}

function handleCalendarDate(dateStr) {
  filterDate.value = dateStr
  historyView.value = 'list'
}

function clearDateFilter() {
  filterDate.value = null
}

function handleSelectEntry(entryMeta) {
  const full = loadEntry(entryMeta.id)
  if (full) {
    selectedEntry.value = full
  }
}

function handleBackFromDetail() {
  selectedEntry.value = null
}

function handleBack() {
  if (selectedEntry.value) {
    selectedEntry.value = null
    return
  }
  if (viewMode.value === 'history') {
    viewMode.value = 'write'
    return
  }
  router.push('/')
}
</script>

<template>
  <div class="flex h-screen w-full max-w-[100vw] overflow-hidden">
    <div class="relative flex h-full min-w-0 flex-1 flex-col bg-page">
      <CmAppBar
        :title="viewMode === 'history' && !selectedEntry ? t('diary.history') : t('diary.todaysDiary')"
        :subtitle="todayFormatted"
        :back-label="t('diary.back')"
        @back="handleBack"
      >
        <template #actions>
          <!-- Writing streak: plain meta text, wide screens only -->
          <span v-if="stats.currentWritingStreak > 0" class="mr-2 hidden text-meta tabular-nums text-ink-muted sm:inline">
            {{ t('diary.writingStreak') }}: {{ t('diary.days', { count: stats.currentWritingStreak }) }}
          </span>
          <button
            type="button"
            @click="toggleViewMode"
            :aria-label="viewMode === 'history' ? t('diary.mode') : t('diary.history')"
            :aria-pressed="viewMode === 'history'"
            class="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1 rounded-[10px] px-2.5 active:bg-surface-raised"
            :class="viewMode === 'history' ? 'bg-accent-soft text-accent' : 'text-ink-secondary'"
          >
            <span class="material-symbols-outlined" aria-hidden="true">{{ viewMode === 'history' ? 'edit_note' : 'history' }}</span>
            <span class="hidden text-caption font-medium sm:inline">{{ viewMode === 'history' ? t('diary.mode') : t('diary.history') }}</span>
          </button>
          <button
            type="button"
            @click="toggleDark"
            :aria-label="t('settings.darkMode')"
            :aria-pressed="isDark"
            class="hidden size-11 shrink-0 items-center justify-center rounded-[10px] text-ink-secondary active:bg-surface-raised sm:inline-flex"
          >
            <span class="material-symbols-outlined" aria-hidden="true">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
          </button>
        </template>
      </CmAppBar>

      <!-- Content Area -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- WRITE MODE -->
        <template v-if="viewMode === 'write'">
          <!-- Editor until feedback exists -->
          <DiaryEditor
            v-if="!activeEntry || !activeEntry.feedback"
            :language="diaryLanguage"
            :level="diaryLevel"
            :is-loading="isLoadingFeedback"
            :initial-prompt="rewriteInitialText || initialPrompt"
            :character-name="feedbackCharacter.name"
            @submit="handleSubmit"
          />

          <!-- Feedback when loading or available -->
          <div v-if="activeEntry" class="flex-1 overflow-y-auto">
            <div class="mx-auto max-w-2xl px-4 py-4 min-[375px]:px-5 sm:py-6">
              <!-- Submitted text as a neutral reference -->
              <div v-if="activeEntry.feedback" class="mb-5 rounded-[14px] bg-surface-sunken p-4">
                <p class="mb-1 text-meta text-ink-muted">{{ t('feedback.you') }}</p>
                <p class="whitespace-pre-wrap break-words text-body text-ink">{{ activeEntry.body }}</p>
              </div>

              <DiaryFeedback
                :feedback="activeEntry.feedback"
                :character="feedbackCharacter"
                :loading="isLoadingFeedback"
                :error="activeEntry.feedbackStatus === 'error'"
                @retry="handleRetryFeedback"
                @rewrite="handleRewrite"
              />

              <!-- Actions after feedback -->
              <div v-if="activeEntry.feedback" class="mt-8 flex flex-col gap-3 pb-6 sm:flex-row">
                <CmButton class="flex-1" @click="handleWriteAnother">
                  <span class="material-symbols-outlined" aria-hidden="true">edit_note</span>
                  {{ t('diary.writeAnother') }}
                </CmButton>
                <CmButton variant="secondary" class="flex-1" @click="router.push('/')">
                  <span class="material-symbols-outlined" aria-hidden="true">check</span>
                  {{ t('diary.saveAndClose') }}
                </CmButton>
              </div>
            </div>
          </div>
        </template>

        <!-- HISTORY MODE -->
        <template v-else>
          <!-- Detail view: the selected entry is the only card -->
          <div v-if="selectedEntry" class="flex-1 overflow-y-auto">
            <div class="mx-auto max-w-2xl px-4 py-4 min-[375px]:px-5 sm:py-6">
              <p class="mb-2 text-meta text-ink-muted">
                {{ new Date(selectedEntry.createdAt).toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'zh' ? 'zh-TW' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }) }}
              </p>

              <div class="mb-5 rounded-[14px] border border-hairline bg-surface p-4 shadow-[var(--cm-shadow-small)]">
                <p class="whitespace-pre-wrap break-words text-body text-ink">{{ selectedEntry.body }}</p>
                <p class="mt-2 text-meta tabular-nums text-ink-muted">
                  {{ ['ja', 'zh'].includes(selectedEntry.language) ? t('diary.charCount', { count: selectedEntry.body.length }) : t('diary.wordCount', { count: selectedEntry.wordCount }) }}
                </p>
              </div>

              <DiaryFeedback
                v-if="selectedEntry.feedback || selectedEntry.feedbackStatus === 'loading'"
                :feedback="selectedEntry.feedback"
                :character="feedbackCharacter"
                :loading="selectedEntry.feedbackStatus === 'loading'"
                :error="selectedEntry.feedbackStatus === 'error'"
                @rewrite="handleRewriteFromHistory"
              />

              <div v-else-if="selectedEntry.feedbackStatus === 'pending'" class="flex items-start gap-2 rounded-[14px] bg-warning-soft p-4 text-caption text-ink" role="status">
                <span class="material-symbols-outlined shrink-0 text-warning" aria-hidden="true">wifi_off</span>
                {{ t('diary.offline') }}
              </div>
            </div>
          </div>

          <!-- Grid → totals/export → list/calendar → entries -->
          <div v-else class="flex-1 overflow-y-auto">
            <div class="mx-auto max-w-2xl space-y-4 px-4 py-4 min-[375px]:px-5 sm:py-6">
              <!-- Contribution grid (hero) -->
              <section v-if="entryIndex.length > 0" class="rounded-[14px] border border-hairline bg-surface p-4 shadow-[var(--cm-shadow-small)]">
                <h2 class="mb-3 text-caption font-medium text-ink">{{ t('diary.gridLabel') }}</h2>
                <ContributionGrid :entries="entryIndex" />
              </section>

              <!-- Totals + export -->
              <div v-if="entryIndex.length > 0" class="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span class="text-meta tabular-nums text-ink-muted">{{ t('diary.entries', { count: stats.totalEntries }) }}</span>
                <span class="text-meta tabular-nums text-ink-muted">{{ t('diary.totalWords') }}: {{ totalWords }}</span>
                <span v-if="stats.currentWritingStreak > 0" class="text-meta tabular-nums text-ink-muted">
                  {{ t('diary.writingStreak') }}: {{ t('diary.days', { count: stats.currentWritingStreak }) }}
                </span>
                <button
                  type="button"
                  @click="handleExport"
                  class="ml-auto -mr-2 inline-flex min-h-11 items-center gap-1 rounded-[10px] px-2 text-caption font-medium text-accent active:bg-surface-raised"
                >
                  <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">download</span>
                  {{ t('diary.export') }}
                </button>
              </div>

              <!-- View toggle: List / Calendar -->
              <CmSegmentedControl
                v-if="entryIndex.length > 0"
                :options="historyViewOptions"
                :model-value="historyView"
                :label="t('diary.history')"
                class="sm:max-w-xs"
                @update:model-value="setHistoryView"
              />

              <!-- Calendar view -->
              <div v-if="historyView === 'calendar'" class="rounded-[14px] border border-hairline bg-surface px-2 py-3">
                <DiaryCalendar :entries="entryIndex" @select-date="handleCalendarDate" />
              </div>

              <!-- Date filter indicator -->
              <div v-if="filterDate" class="flex items-center gap-2">
                <span class="text-caption font-medium tabular-nums text-accent">{{ filterDate }}</span>
                <button
                  type="button"
                  @click="clearDateFilter"
                  class="inline-flex min-h-11 items-center rounded-[10px] px-2 text-caption text-ink-secondary underline underline-offset-2"
                >
                  {{ t('diary.list') }}
                </button>
              </div>

              <!-- Entries as a grouped list -->
              <template v-if="historyView === 'list' || filterDate">
                <div v-if="filteredEntries.length" class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface">
                  <DiaryEntryCard
                    v-for="entry in filteredEntries"
                    :key="entry.id"
                    :entry="entry"
                    @select="handleSelectEntry"
                  />
                </div>

                <p v-if="filteredEntries.length === 0 && filterDate" class="py-8 text-center text-caption text-ink-muted">{{ t('diary.noEntriesForDate') }}</p>
              </template>

              <!-- Empty state -->
              <CmStateBlock
                v-if="entryIndex.length === 0"
                class="mt-8"
                icon="edit_note"
                :title="t('diary.noEntries')"
                :body="t('diary.noEntriesDesc')"
                :action="t('diary.writeFirst')"
                @action="viewMode = 'write'"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
