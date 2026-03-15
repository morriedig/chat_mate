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
    <div class="flex flex-1 flex-col h-full relative bg-background-light dark:bg-background-dark">
      <!-- Header -->
      <header class="flex items-center justify-between border-b border-[#e7eff3] dark:border-slate-800 px-3 sm:px-6 py-3 sm:py-4 bg-surface-light dark:bg-surface-dark z-10 shadow-sm overflow-hidden safe-area-top">
        <div class="flex items-center gap-2 sm:gap-3 text-text-main dark:text-white min-w-0 shrink">
          <button @click="handleBack" class="flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined cursor-pointer">arrow_back</span>
          </button>
          <div class="flex flex-col min-w-0">
            <h2 class="text-sm sm:text-base font-bold leading-tight tracking-[-0.015em] truncate">
              {{ viewMode === 'history' && !selectedEntry ? t('diary.history') : t('diary.todaysDiary') }}
            </h2>
            <span class="text-xs text-text-muted dark:text-slate-400 truncate">{{ todayFormatted }}</span>
          </div>
        </div>
        <div class="flex items-center gap-1 sm:gap-2">
          <!-- Writing streak badge -->
          <span v-if="stats.currentWritingStreak > 0" class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <span class="material-symbols-outlined text-[14px]">local_fire_department</span>
            {{ stats.currentWritingStreak }}
          </span>
          <!-- History toggle -->
          <button
            @click="viewMode = viewMode === 'write' ? 'history' : 'write'; selectedEntry = null"
            class="flex h-9 w-9 sm:w-auto sm:px-3 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 text-sm font-medium transition-colors shrink-0"
            :class="viewMode === 'history' ? 'bg-primary/10 border-primary/30' : ''"
          >
            <span class="material-symbols-outlined text-[18px]">{{ viewMode === 'history' ? 'edit_note' : 'history' }}</span>
            <span class="hidden sm:inline ml-1">{{ viewMode === 'history' ? t('diary.mode') : t('diary.history') }}</span>
          </button>
          <!-- Dark mode toggle -->
          <button
            @click="toggleDark"
            class="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 transition-colors"
          >
            <span class="material-symbols-outlined text-[18px]">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
          </button>
        </div>
      </header>

      <!-- Content Area -->
      <div class="flex flex-col flex-1 overflow-hidden">
        <!-- WRITE MODE -->
        <template v-if="viewMode === 'write'">
          <!-- Show editor if no active entry with feedback -->
          <DiaryEditor
            v-if="!activeEntry || !activeEntry.feedback"
            :language="diaryLanguage"
            :level="diaryLevel"
            :is-loading="isLoadingFeedback"
            :initial-prompt="rewriteInitialText || initialPrompt"
            @submit="handleSubmit"
          />

          <!-- Show feedback when loading or available -->
          <div v-if="activeEntry" class="flex-1 overflow-y-auto">
            <div class="max-w-2xl mx-auto px-4 py-4 sm:py-6">
              <!-- Show the submitted text as reference -->
              <div v-if="activeEntry.feedback" class="mb-4 p-3 sm:p-4 rounded-2xl bg-primary/10 dark:bg-primary/20 border border-primary/20">
                <p class="text-xs font-medium text-text-muted dark:text-slate-400 mb-1">{{ t('feedback.you') }}</p>
                <p class="text-sm sm:text-base text-text-main dark:text-slate-200 whitespace-pre-wrap break-words">{{ activeEntry.body }}</p>
              </div>

              <DiaryFeedback
                :feedback="activeEntry.feedback"
                :character="feedbackCharacter"
                :loading="isLoadingFeedback"
                :error="activeEntry.feedbackStatus === 'error'"
                @retry="handleRetryFeedback"
                @rewrite="handleRewrite"
              />

              <!-- Action buttons after feedback -->
              <div v-if="activeEntry.feedback" class="mt-6 flex flex-col sm:flex-row gap-3 pb-6">
                <button
                  @click="handleWriteAnother"
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-[#0d171b] font-semibold shadow-md hover:bg-primary/90 transition-colors"
                >
                  <span class="material-symbols-outlined text-[20px]">edit_note</span>
                  {{ t('diary.writeAnother') }}
                </button>
                <button
                  @click="router.push('/')"
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-text-main dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span class="material-symbols-outlined text-[20px]">check</span>
                  {{ t('diary.saveAndClose') }}
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- HISTORY MODE -->
        <template v-else>
          <!-- Detail view -->
          <div v-if="selectedEntry" class="flex-1 overflow-y-auto">
            <div class="max-w-2xl mx-auto px-4 py-4 sm:py-6">
              <!-- Entry date -->
              <div class="flex items-center gap-2 mb-4">
                <span class="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {{ new Date(selectedEntry.createdAt).toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'zh' ? 'zh-TW' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }) }}
                </span>
              </div>

              <!-- Entry body -->
              <div class="mb-4 p-3 sm:p-4 rounded-2xl bg-primary/10 dark:bg-primary/20 border border-primary/20">
                <p class="text-sm sm:text-base text-text-main dark:text-slate-200 whitespace-pre-wrap break-words">{{ selectedEntry.body }}</p>
                <p class="mt-2 text-xs text-text-muted dark:text-slate-500">
                  {{ ['ja', 'zh'].includes(selectedEntry.language) ? t('diary.charCount', { count: selectedEntry.body.length }) : t('diary.wordCount', { count: selectedEntry.wordCount }) }}
                </p>
              </div>

              <!-- Feedback if available -->
              <DiaryFeedback
                v-if="selectedEntry.feedback || selectedEntry.feedbackStatus === 'loading'"
                :feedback="selectedEntry.feedback"
                :character="feedbackCharacter"
                :loading="selectedEntry.feedbackStatus === 'loading'"
                :error="selectedEntry.feedbackStatus === 'error'"
                @rewrite="handleRewriteFromHistory"
              />

              <div v-else-if="selectedEntry.feedbackStatus === 'pending'" class="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-base">wifi_off</span>
                  {{ t('diary.offline') }}
                </div>
              </div>
            </div>
          </div>

          <!-- Entry list / Calendar view -->
          <div v-else class="flex-1 overflow-y-auto">
            <div class="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-3">
              <!-- Contribution heatmap -->
              <div v-if="entryIndex.length > 0" class="p-3 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800">
                <ContributionGrid :entries="entryIndex" />
              </div>

              <!-- Stats bar with streak and totals -->
              <div v-if="entryIndex.length > 0" class="flex items-center flex-wrap gap-3 mb-1 px-1">
                <span class="text-xs text-text-muted dark:text-slate-400">
                  {{ t('diary.entries', { count: stats.totalEntries }) }}
                </span>
                <span class="text-xs text-text-muted dark:text-slate-400">
                  {{ t('diary.totalWords') }}: {{ totalWords }}
                </span>
                <span v-if="stats.currentWritingStreak > 0" class="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">local_fire_department</span>
                  {{ t('diary.writingStreak') }}: {{ t('diary.days', { count: stats.currentWritingStreak }) }}
                </span>
                <button
                  @click="handleExport"
                  class="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-muted dark:text-slate-400 text-xs font-medium transition-colors"
                >
                  <span class="material-symbols-outlined text-[14px]">download</span>
                  {{ t('diary.export') }}
                </button>
              </div>

              <!-- View toggle: List / Calendar -->
              <div v-if="entryIndex.length > 0" class="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
                <button
                  @click="historyView = 'list'; filterDate = null"
                  class="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                  :class="historyView === 'list' ? 'bg-white dark:bg-slate-700 text-text-main dark:text-white shadow-sm' : 'text-text-muted dark:text-slate-400'"
                >
                  <span class="material-symbols-outlined text-[14px]">list</span>
                  {{ t('diary.list') }}
                </button>
                <button
                  @click="historyView = 'calendar'; filterDate = null"
                  class="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                  :class="historyView === 'calendar' ? 'bg-white dark:bg-slate-700 text-text-main dark:text-white shadow-sm' : 'text-text-muted dark:text-slate-400'"
                >
                  <span class="material-symbols-outlined text-[14px]">calendar_month</span>
                  {{ t('diary.calendar') }}
                </button>
              </div>

              <!-- Calendar view -->
              <div v-if="historyView === 'calendar'" class="p-3 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800">
                <DiaryCalendar :entries="entryIndex" @select-date="handleCalendarDate" />
              </div>

              <!-- Date filter indicator -->
              <div v-if="filterDate" class="flex items-center gap-2 px-1">
                <span class="text-xs text-primary font-medium">{{ filterDate }}</span>
                <button
                  @click="clearDateFilter"
                  class="text-xs text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white underline"
                >
                  {{ t('diary.list') }}
                </button>
              </div>

              <!-- List view (default or filtered) -->
              <template v-if="historyView === 'list' || filterDate">
                <DiaryEntryCard
                  v-for="entry in filteredEntries"
                  :key="entry.id"
                  :entry="entry"
                  @select="handleSelectEntry"
                />

                <div v-if="filteredEntries.length === 0 && filterDate" class="text-center py-8">
                  <p class="text-sm text-text-muted dark:text-slate-400">{{ t('diary.noEntriesForDate') }}</p>
                </div>
              </template>

              <!-- Empty state -->
              <div v-if="entryIndex.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
                <span class="material-symbols-outlined text-[48px] text-slate-300 dark:text-slate-600 mb-4">menu_book</span>
                <p class="text-base font-semibold text-text-main dark:text-white mb-1">{{ t('diary.noEntries') }}</p>
                <p class="text-sm text-text-muted dark:text-slate-400 mb-6">{{ t('diary.noEntriesDesc') }}</p>
                <button
                  @click="viewMode = 'write'"
                  class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-[#0d171b] font-semibold shadow-md hover:bg-primary/90 transition-colors"
                >
                  <span class="material-symbols-outlined text-[20px]">edit_note</span>
                  {{ t('diary.writeFirst') }}
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
