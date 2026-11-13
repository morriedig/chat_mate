<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useDarkMode } from '../composables/useDarkMode'
import { useUserProgress } from '../composables/useUserProgress'
import { useLearningProgress } from '../composables/useLearningProgress'
import { useSRS } from '../composables/useSRS'
import { useNavState } from '../composables/useNavState'
import { getChaptersByLevel, getChapterWords, getChapterConversations, getPreLessons, getChapterCharacters, isPreLesson, getChapterCloze, getChapterConnectors } from '../data/chapterLoader'
import { usePreLessonProgress } from '../composables/usePreLessonProgress'
import { useMotherTongue } from '../composables/useMotherTongue'
import { pickMissionTargets, createMission } from '../composables/useConnectorMission'
import { characters, levels } from '../data/characters.js'
import { chapterSymbol } from '../utils/chapterSymbol'
import VocabularyCard from './learning/VocabularyCard.vue'
import FlashcardMode from './learning/FlashcardMode.vue'
import QuizMode from './learning/QuizMode.vue'
import ConversationPractice from './learning/ConversationPractice.vue'
import CharacterCard from './learning/CharacterCard.vue'
import CharacterGrid from './learning/CharacterGrid.vue'
import CharacterMatchGame from './learning/CharacterMatchGame.vue'
import TonePractice from './learning/TonePractice.vue'
import CmAppBar from './ui/CmAppBar.vue'
import CmButton from './ui/CmButton.vue'
import CmBottomSheet from './ui/CmBottomSheet.vue'
import CmProgress from './ui/CmProgress.vue'
import CmStateBlock from './ui/CmStateBlock.vue'

const { t, locale } = useI18n()
const router = useRouter()
const { isDark } = useDarkMode()
const { addXP } = useUserProgress()
const { getChapterCompletionStatus } = useLearningProgress()
const { getDueWords, getDueCount, totalDueToday } = useSRS()
const { getLessonStatus, areChaptersLocked: checkChaptersLocked, arePreLessonsComplete, markCharacterLearned, markMatchingCompleted, markQuizCompleted, getLearnedCharacters } = usePreLessonProgress()
const {
  learningLevel,
  selectedTargetLanguage,
  selectedMotherTongue,
  uiLanguage,
  selectedCharacter: lastChatCharacter,
  setChatState,
} = useNavState()
const { motherTongue } = useMotherTongue()

// Redirect if missing required state
if (!learningLevel.value) {
  router.replace('/')
}

// Create props-compatible computed values (with safe defaults)
const props = {
  get level() { return learningLevel.value || { id: 'intermediate' } },
  get targetLanguage() { return selectedTargetLanguage.value || 'en' },
  get motherTongue() { return selectedMotherTongue.value || 'en' },
  get uiLanguage() { return uiLanguage.value || 'en' },
}

// State
const selectedChapter = ref(null)
const learningMode = ref('list') // 'list', 'flashcard', 'quiz', 'conversation'
const currentWords = ref([])
const currentConversations = ref([])
const currentCloze = ref([]) // fill-in-the-blank questions (quiz.cloze), [] if none
const showConversationPrompt = ref(false)
const isBilingual = ref(true) // Default to bilingual for beginners
const voiceSpeed = ref('normal') // 'normal', 'slow', 'word'
const isReviewMode = ref(false)
const reviewWords = ref([])
const isPreLessonSelected = ref(false)
const currentCharacters = ref([])
const menuOpen = ref(false) // header overflow menu (phones)

// Foundation icons are script glyphs (あ, b, 声); show them as type, never emoji
function glyphFor(icon) {
  return icon && /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}A-Za-z]{1,2}$/u.test(icon) ? icon : '文'
}

const CEFR = { beginner: 'A1–A2', intermediate: 'B1–B2', advanced: 'C1–C2' }
const levelLabel = computed(() => {
  const id = props.level.id
  const name = t(`levels.${id}.name`)
  return CEFR[id] ? `${name} · ${CEFR[id]}` : name
})

const speedOptions = computed(() => [
  { value: 'normal', label: t('learning.voiceSpeed.normal') },
  { value: 'slow', label: t('learning.voiceSpeed.slow') },
  { value: 'word', label: t('learning.voiceSpeed.word') },
])

// Mode tabs (pre-lesson: cards/grid/match/quiz/tones; regular: list/flashcard/quiz/conversation)
const modeTabs = computed(() => {
  if (isPreLessonSelected.value) {
    return [
      { mode: 'cards', icon: 'style', label: 'foundation.cards' },
      { mode: 'grid', icon: 'grid_view', label: 'foundation.grid' },
      { mode: 'match', icon: 'extension', label: 'foundation.match' },
      { mode: 'quiz', icon: 'quiz', label: 'learning.modes.quiz' },
      ...(hasToneData.value ? [{ mode: 'tones', icon: 'music_note', label: 'prelesson.tones' }] : []),
    ]
  }
  return [
    { mode: 'list', icon: 'list', label: 'learning.modes.list' },
    { mode: 'flashcard', icon: 'style', label: 'learning.modes.flashcard' },
    { mode: 'quiz', icon: 'quiz', label: 'learning.modes.quiz' },
    ...(isReviewMode.value ? [] : [{ mode: 'conversation', icon: 'chat', label: 'learning.modes.conversation' }]),
  ]
})

// Pre-lesson: check if current characters have tone data (Chinese pinyin)
const hasToneData = computed(() => {
  return currentCharacters.value.some(c => c.tone !== undefined && c.tone !== null)
})

// Pre-lesson: learned character IDs for the selected chapter
const learnedIds = computed(() => {
  if (!selectedChapter.value) return new Set()
  const ids = getLearnedCharacters(selectedChapter.value.id)
  return new Set(ids)
})

// Pre-lesson computed values
const preLessons = computed(() => {
  return getPreLessons(props.targetLanguage, props.uiLanguage)
})

const chaptersLocked = computed(() => {
  if (preLessons.value.length === 0) return false
  return checkChaptersLocked(props.targetLanguage)
})

const preLessonProgress = computed(() => {
  const result = {}
  for (const pl of preLessons.value) {
    result[pl.id] = getLessonStatus(pl.id)
  }
  return result
})

// Computed - Get chapters for current target language and level from YAML files
const availableChapters = computed(() => {
  return getChaptersByLevel(props.targetLanguage, props.level.id, props.uiLanguage)
})

// Get all words across all available chapters (for SRS review)
const allChapterWords = computed(() => {
  const words = []
  for (const chapter of availableChapters.value) {
    words.push(...getChapterWords(chapter.id, props.targetLanguage, props.motherTongue))
  }
  return words
})

// Words due for review across all chapters at this level
const dueReviewWords = computed(() => getDueWords(allChapterWords.value))

// Cached due counts per chapter (avoids redundant getChapterWords calls in template)
const chapterDueCounts = computed(() => {
  const counts = {}
  for (const chapter of availableChapters.value) {
    const words = getChapterWords(chapter.id, props.targetLanguage, props.motherTongue)
    counts[chapter.id] = getDueCount(words)
  }
  return counts
})

// Methods
function selectChapter(chapter) {
  selectedChapter.value = chapter
  isReviewMode.value = false

  // Check if this is a pre-lesson
  if (chapter.type === 'pre-lesson') {
    isPreLessonSelected.value = true
    currentCharacters.value = getChapterCharacters(chapter.id, props.targetLanguage, props.motherTongue)
    // Adapt characters to word format for quiz reuse
    currentWords.value = charactersAsWords(currentCharacters.value)
    currentConversations.value = []
    currentCloze.value = []
    learningMode.value = 'cards'
  } else {
    isPreLessonSelected.value = false
    currentCharacters.value = []
    currentWords.value = getChapterWords(chapter.id, props.targetLanguage, props.motherTongue)
    currentConversations.value = getChapterConversations(chapter.id, props.targetLanguage, props.motherTongue)
    // Explanations follow the persisted mother tongue (falls back to en in the loader)
    currentCloze.value = getChapterCloze(chapter.id, props.targetLanguage, motherTongue.value)
    learningMode.value = 'list'
  }
}

// Adapter: convert characters to word format for QuizMode reuse
function charactersAsWords(characters) {
  return characters.map(c => ({
    id: c.id,
    word: c.char,
    meaning: c.reading,
    reading: c.romaji,
    example: c.examples?.[0]?.word || '',
    nativeWord: c.examples?.[0]?.meaning || '',
    nativeMeaning: c.reading,
    nativeExample: c.examples?.[0]?.meaning || '',
  }))
}

// Handle character selected in CharacterGrid (mark as learned)
function handleCharacterSelect(character) {
  if (selectedChapter.value) {
    markCharacterLearned(selectedChapter.value.id, character.id)
  }
}

// Handle CharacterMatchGame completion
function handleMatchComplete(result) {
  if (selectedChapter.value) {
    markMatchingCompleted(selectedChapter.value.id)
    addXP(15, 'matchQuiz')
  }
}

function startDailyReview() {
  reviewWords.value = dueReviewWords.value
  if (reviewWords.value.length === 0) return
  isReviewMode.value = true
  selectedChapter.value = { id: null, title: t('srs.dailyReview'), icon: null }
  currentWords.value = reviewWords.value
  currentConversations.value = []
  currentCloze.value = []
  learningMode.value = 'quiz'
}

function backToChapters() {
  selectedChapter.value = null
  isReviewMode.value = false
  isPreLessonSelected.value = false
  currentCharacters.value = []
  learningMode.value = 'list'
}

function setMode(mode) {
  learningMode.value = mode
}

// DIP: Handle quiz completion event from QuizMode
function handleQuizComplete(result) {
  if (result.xpEarned > 0) {
    addXP(result.xpEarned, 'quiz')
  }
  // Handle pre-lesson quiz completion
  if (isPreLessonSelected.value && selectedChapter.value) {
    markQuizCompleted(selectedChapter.value.id, result.score, result.total)
    return
  }
  // Skip conversation prompt in review mode (no conversations for cross-chapter review)
  if (isReviewMode.value) return
  // Cloze chapters offer the "use it in chat" bridge on the results screen instead
  if (currentCloze.value.length > 0) return
  // Show conversation prompt after completing quiz
  showConversationPrompt.value = true
}

// Bridge: open the AI chat with 3 target connectors from this chapter
function handleUseInChat(result) {
  const chapter = selectedChapter.value
  if (!chapter?.id) return

  const connectors = getChapterConnectors(chapter.id, props.targetLanguage)
  const targetIds = pickMissionTargets(connectors, result)
  if (targetIds.length === 0) return

  // Chat levels are beginner/intermediate/advanced only
  const chatLevel = levels.find(l => l.id === props.level.id) || levels.find(l => l.id === 'intermediate')
  setChatState({
    character: lastChatCharacter.value || characters[0],
    level: chatLevel,
    // The AI friend speaks the language being practiced, not the UI language
    language: props.targetLanguage,
    mode: 'free',
    scenario: createMission({ chapterId: chapter.id, title: chapter.title, connectors, targetIds }),
  })
  router.push('/chat')
}

// Start conversation practice
function startConversation() {
  showConversationPrompt.value = false
  learningMode.value = 'conversation'
}

// Skip conversation and go back to list
function skipConversation() {
  showConversationPrompt.value = false
}

// Handle conversation completion
function handleConversationComplete(result) {
  // Award bonus XP for conversation practice
  if (result.messagesExchanged >= 4) {
    addXP(10, 'conversation')
  }
  learningMode.value = 'list'
}

// Back from conversation mode
function backFromConversation() {
  learningMode.value = 'list'
}

// Initialize with first chapter if only one exists
onMounted(() => {
  if (availableChapters.value.length === 1) {
    selectChapter(availableChapters.value[0])
  }
})
</script>

<template>
  <div class="min-h-screen bg-page">
    <!-- Header: back, title + level, speed and bilingual (overflow menu on phones) -->
    <div class="sticky top-0 z-20">
      <CmAppBar
        :title="t('learning.chooseChapter')"
        :subtitle="levelLabel"
        :back-label="selectedChapter ? t('learning.backToChapters') : t('learning.backToSetup')"
        @back="selectedChapter ? backToChapters() : router.push('/')"
      >
        <template #actions>
          <!-- Inline controls from 640 px -->
          <div class="hidden items-center gap-2 pr-1 sm:flex">
            <label class="relative inline-flex items-center">
              <span class="sr-only">{{ t('learning.speed') }}</span>
              <span class="material-symbols-outlined pointer-events-none absolute left-2.5 !text-[18px] text-ink-muted" aria-hidden="true">volume_up</span>
              <select
                v-model="voiceSpeed"
                data-testid="speed-select"
                class="min-h-11 appearance-none rounded-[10px] border border-hairline bg-surface-raised pl-8 pr-8 text-caption font-medium text-ink"
              >
                <option v-for="opt in speedOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <span class="material-symbols-outlined pointer-events-none absolute right-2 !text-[18px] text-ink-muted" aria-hidden="true">expand_more</span>
            </label>
            <button
              type="button"
              @click="isBilingual = !isBilingual"
              :aria-pressed="isBilingual"
              class="inline-flex min-h-11 items-center gap-1 rounded-[10px] border px-3 text-caption font-medium"
              :class="isBilingual ? 'border-accent bg-accent-soft text-accent' : 'border-hairline bg-surface-raised text-ink-secondary'"
            >
              <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">translate</span>
              {{ t('learning.bilingual') }}
            </button>
          </div>

          <!-- Overflow menu on phones -->
          <div class="relative sm:hidden" @keydown.esc="menuOpen = false">
            <button
              type="button"
              data-testid="learning-menu-button"
              @click="menuOpen = !menuOpen"
              :aria-label="t('learning.more')"
              :aria-expanded="menuOpen"
              aria-haspopup="menu"
              class="inline-flex size-11 items-center justify-center rounded-[10px] text-ink-secondary active:bg-surface-raised"
            >
              <span class="material-symbols-outlined" aria-hidden="true">more_vert</span>
            </button>
            <template v-if="menuOpen">
              <div class="fixed inset-0 z-30" aria-hidden="true" @click="menuOpen = false"></div>
              <div
                role="menu"
                :aria-label="t('learning.more')"
                class="absolute right-1 top-full z-40 mt-1 w-56 rounded-[10px] border border-hairline bg-surface py-2 shadow-[var(--cm-shadow-float)]"
              >
                <p class="px-4 pb-1 pt-1 text-meta text-ink-muted">{{ t('learning.speed') }}</p>
                <button
                  v-for="opt in speedOptions"
                  :key="opt.value"
                  type="button"
                  role="menuitemradio"
                  :aria-checked="voiceSpeed === opt.value"
                  @click="voiceSpeed = opt.value"
                  class="flex min-h-11 w-full items-center gap-3 px-4 text-left text-body text-ink active:bg-surface-raised"
                >
                  <span class="min-w-0 flex-1">{{ opt.label }}</span>
                  <span v-if="voiceSpeed === opt.value" class="material-symbols-outlined text-accent" aria-hidden="true">check</span>
                </button>
                <div class="my-2 h-px bg-hairline" role="separator"></div>
                <button
                  type="button"
                  role="menuitemcheckbox"
                  :aria-checked="isBilingual"
                  @click="isBilingual = !isBilingual"
                  class="flex min-h-11 w-full items-center gap-3 px-4 text-left text-body text-ink active:bg-surface-raised"
                >
                  <span class="material-symbols-outlined text-ink-muted" aria-hidden="true">translate</span>
                  <span class="min-w-0 flex-1">{{ t('learning.bilingual') }}</span>
                  <span class="material-symbols-outlined" :class="isBilingual ? 'text-accent' : 'text-ink-muted'" aria-hidden="true">{{ isBilingual ? 'check_box' : 'check_box_outline_blank' }}</span>
                </button>
              </div>
            </template>
          </div>
        </template>
      </CmAppBar>
    </div>

    <!-- Main Content -->
    <main class="mx-auto max-w-4xl px-4 pb-10 pt-5 min-[375px]:px-5">
      <!-- Hub: foundation → lock divider → due review → chapters → empty state -->
      <template v-if="!selectedChapter">
        <p class="mb-6 text-caption text-ink-secondary">{{ t('learning.chapterDescription') }}</p>

        <!-- Foundation (pre-lessons) -->
        <section v-if="preLessons.length > 0" class="mb-8">
          <div class="mb-3">
            <h2 class="text-title font-medium text-ink">{{ t('foundation.title') }}</h2>
            <p class="text-meta text-ink-muted">{{ t('foundation.description') }}</p>
          </div>

          <ul class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface">
            <li v-for="pl in preLessons" :key="pl.id">
              <button
                type="button"
                data-testid="prelesson-row"
                @click="selectChapter(pl)"
                class="flex min-h-[72px] w-full items-center gap-2 py-3 pr-3 text-left active:bg-surface-raised"
              >
                <span class="flex w-14 shrink-0 justify-center">
                  <span
                    v-if="preLessonProgress[pl.id]?.quizCompleted"
                    class="material-symbols-outlined text-success"
                    :aria-label="t('prelesson.learned')"
                  >check_circle</span>
                  <span v-else class="flex size-10 items-center justify-center rounded-[10px] border border-hairline bg-surface-raised text-title font-medium text-ink" aria-hidden="true">{{ glyphFor(pl.icon) }}</span>
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-body font-medium text-ink">{{ pl.title }}</span>
                  <span class="block truncate text-meta text-ink-muted">{{ pl.description }}</span>
                  <span v-if="pl.characterCount > 0" class="mt-1.5 flex items-center gap-2">
                    <CmProgress
                      class="max-w-32 flex-1"
                      :value="preLessonProgress[pl.id]?.charactersLearned || 0"
                      :max="pl.characterCount"
                    />
                    <span class="text-meta tabular-nums text-ink-muted">
                      {{ t('foundation.charactersLearned', { learned: preLessonProgress[pl.id]?.charactersLearned || 0, total: pl.characterCount }) }}
                    </span>
                  </span>
                </span>
                <span class="hidden shrink-0 text-meta tabular-nums text-ink-muted sm:inline">{{ t('foundation.characters', { count: pl.characterCount }) }}</span>
                <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">chevron_right</span>
              </button>
            </li>
          </ul>

          <!-- Lock divider -->
          <div v-if="chaptersLocked" class="mt-6 flex items-center gap-3">
            <div class="h-px flex-1 bg-hairline"></div>
            <div class="flex items-center gap-1.5 text-meta text-ink-muted">
              <span class="material-symbols-outlined !text-[16px]" aria-hidden="true">lock</span>
              {{ t('foundation.completeToUnlock') }}
            </div>
            <div class="h-px flex-1 bg-hairline"></div>
          </div>
        </section>

        <!-- Due review: the hub's hero row -->
        <button
          v-if="dueReviewWords.length > 0"
          type="button"
          data-testid="due-review"
          @click="startDailyReview"
          class="relative mb-8 flex min-h-[72px] w-full items-center gap-2 overflow-hidden rounded-[14px] border border-hairline bg-accent-soft py-3 pr-3 text-left"
        >
          <span class="absolute left-0 top-4 h-9 w-[3px] rounded-r-[3px] bg-accent" aria-hidden="true"></span>
          <span class="flex w-14 shrink-0 justify-center">
            <span class="material-symbols-outlined !text-[24px] text-accent" aria-hidden="true">event_repeat</span>
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-body font-medium text-ink">{{ t('srs.dailyReview') }}</span>
            <span class="block text-meta text-ink-secondary">{{ t('srs.dailyReviewDescription') }}</span>
            <span class="mt-0.5 block text-meta font-medium tabular-nums text-accent">{{ t('srs.wordsToReview', { count: dueReviewWords.length }) }}</span>
          </span>
          <span class="material-symbols-outlined shrink-0 text-accent" aria-hidden="true">chevron_right</span>
        </button>

        <!-- Chapters as grouped rows -->
        <ul
          v-if="availableChapters.length > 0"
          class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface"
        >
          <li v-for="(chapter, index) in availableChapters" :key="chapter.id">
            <button
              type="button"
              data-testid="chapter-row"
              :disabled="chaptersLocked"
              @click="!chaptersLocked && selectChapter(chapter)"
              class="flex min-h-[72px] w-full items-center gap-2 py-3 pr-3 text-left active:bg-surface-raised disabled:opacity-55"
            >
              <!-- Number / completion column -->
              <span class="flex w-14 shrink-0 justify-center" data-testid="chapter-number">
                <span
                  v-if="getChapterCompletionStatus(chapter.id).complete"
                  class="material-symbols-outlined text-success"
                  :aria-label="t('learning.quizComplete')"
                >check_circle</span>
                <span v-else class="flex size-6 items-center justify-center rounded-[6px] border border-hairline text-meta font-medium tabular-nums text-ink-secondary">{{ index + 1 }}</span>
              </span>

              <span class="min-w-0 flex-1">
                <span class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined shrink-0 !text-[18px] text-ink-muted" aria-hidden="true" data-testid="chapter-icon">{{ chapterSymbol(chapter.icon) }}</span>
                  <span class="truncate text-body font-medium text-ink">{{ chapter.title }}</span>
                </span>
                <span class="block truncate text-meta text-ink-muted">{{ chapter.description }}</span>
                <!-- Progress metadata -->
                <span class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-meta text-ink-muted">
                  <span class="inline-flex items-center gap-0.5" :class="getChapterCompletionStatus(chapter.id).quiz ? 'text-success' : ''">
                    <span class="material-symbols-outlined !text-[14px]" aria-hidden="true">{{ getChapterCompletionStatus(chapter.id).quiz ? 'check_circle' : 'radio_button_unchecked' }}</span>
                    {{ t('learning.progress.quiz') }}
                  </span>
                  <span class="inline-flex items-center gap-0.5" :class="getChapterCompletionStatus(chapter.id).conversation ? 'text-success' : ''">
                    <span class="material-symbols-outlined !text-[14px]" aria-hidden="true">{{ getChapterCompletionStatus(chapter.id).conversation ? 'check_circle' : 'radio_button_unchecked' }}</span>
                    {{ t('learning.progress.conversation') }}
                  </span>
                  <span class="tabular-nums">{{ chapter.wordCount }} {{ t('learning.words') }}</span>
                  <span v-if="chapterDueCounts[chapter.id] > 0" class="font-medium tabular-nums text-accent">
                    {{ chapterDueCounts[chapter.id] }} {{ t('srs.dueToday') }}
                  </span>
                </span>
              </span>

              <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">{{ chaptersLocked ? 'lock' : 'chevron_right' }}</span>
            </button>
          </li>
        </ul>

        <!-- Empty State -->
        <CmStateBlock
          v-if="availableChapters.length === 0 && preLessons.length === 0"
          class="mt-8"
          icon="menu_book"
          :title="t('learning.noChapters')"
          :body="t('learning.noChaptersDescription')"
          :action="t('learning.tryDifferentLevel')"
          @action="router.push('/')"
        />
      </template>

      <!-- Learning Content -->
      <template v-else>
        <!-- Chapter title (hero) -->
        <div class="mb-4 flex items-start gap-3">
          <span
            v-if="isPreLessonSelected"
            class="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-hairline bg-surface-raised text-title font-medium text-ink"
            aria-hidden="true"
          >{{ glyphFor(selectedChapter.icon) }}</span>
          <span v-else class="material-symbols-outlined mt-1 shrink-0 !text-[24px] text-accent" aria-hidden="true" data-testid="chapter-icon">{{ isReviewMode ? 'event_repeat' : chapterSymbol(selectedChapter.icon) }}</span>
          <div class="min-w-0">
            <h1 class="text-section font-medium text-ink" data-heading>{{ selectedChapter.title }}</h1>
            <p class="text-meta tabular-nums text-ink-muted">
              {{ isPreLessonSelected
                ? t('foundation.characters', { count: currentCharacters.length })
                : `${currentWords.length} ${t('learning.words')}` }}
            </p>
          </div>
        </div>

        <!-- Mode tabs: horizontally scrollable rectangular tabs -->
        <div class="-mx-4 mb-5 overflow-x-auto px-4 min-[375px]:-mx-5 min-[375px]:px-5">
          <div
            role="tablist"
            data-testid="mode-tabs"
            class="flex w-max min-w-full gap-1 rounded-[10px] bg-surface-raised p-1"
          >
            <button
              v-for="tab in modeTabs"
              :key="tab.mode"
              type="button"
              role="tab"
              :aria-selected="learningMode === tab.mode"
              @click="setMode(tab.mode)"
              class="flex min-h-11 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] border px-3 text-caption font-medium"
              :class="learningMode === tab.mode
                ? 'border-accent/30 bg-surface text-accent shadow-[var(--cm-shadow-small)]'
                : 'border-transparent text-ink-secondary'"
            >
              <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">{{ tab.icon }}</span>
              {{ t(tab.label) }}
            </button>
          </div>
        </div>

        <!-- Pre-lesson: Cards Mode -->
        <div v-if="isPreLessonSelected && learningMode === 'cards'" class="space-y-3">
          <CharacterCard
            v-for="char in currentCharacters"
            :key="char.id"
            :character="char"
            :language="props.targetLanguage"
            :learned="learnedIds.has(char.id)"
          />
        </div>

        <!-- Pre-lesson: Grid Mode -->
        <CharacterGrid
          v-else-if="isPreLessonSelected && learningMode === 'grid'"
          :characters="currentCharacters"
          :language="props.targetLanguage"
          :learned-ids="learnedIds"
          @select="handleCharacterSelect"
        />

        <!-- Pre-lesson: Match Mode -->
        <CharacterMatchGame
          v-else-if="isPreLessonSelected && learningMode === 'match'"
          :characters="currentCharacters"
          :language="props.targetLanguage"
          @complete="handleMatchComplete"
        />

        <!-- Pre-lesson: Tones Mode (Chinese) -->
        <TonePractice
          v-else-if="isPreLessonSelected && learningMode === 'tones'"
          :characters="currentCharacters"
          :language="props.targetLanguage"
          @complete="handleMatchComplete"
        />

        <!-- List Mode -->
        <div v-else-if="learningMode === 'list'" class="space-y-3">
          <VocabularyCard
            v-for="word in currentWords"
            :key="word.id"
            :word="word"
            :language="props.targetLanguage"
            :bilingual="isBilingual"
            :voice-speed="voiceSpeed"
          />
        </div>

        <!-- Flashcard Mode -->
        <FlashcardMode
          v-else-if="learningMode === 'flashcard'"
          :words="currentWords"
          :language="props.targetLanguage"
          :bilingual="isBilingual"
          :voice-speed="voiceSpeed"
        />

        <!-- Quiz Mode -->
        <QuizMode
          v-else-if="learningMode === 'quiz'"
          :words="currentWords"
          :language="props.targetLanguage"
          :chapter-id="selectedChapter.id"
          :cloze="currentCloze"
          @complete="handleQuizComplete"
          @use-in-chat="handleUseInChat"
        />

        <!-- Conversation Mode -->
        <ConversationPractice
          v-else-if="learningMode === 'conversation'"
          :conversations="currentConversations"
          :language="props.targetLanguage"
          :bilingual="isBilingual"
          :voice-speed="voiceSpeed"
          :chapter-id="selectedChapter.id"
          @back="backFromConversation"
        />
      </template>
    </main>

    <!-- Conversation prompt after the quiz -->
    <CmBottomSheet
      v-if="showConversationPrompt"
      :title="t('learning.conversation.prompt.title')"
      :description="t('learning.conversation.prompt.description')"
      :close-label="t('learning.conversation.prompt.skip')"
      @close="skipConversation"
    >
      <template #leading>
        <span class="material-symbols-outlined mt-0.5 !text-[24px] text-accent" aria-hidden="true">forum</span>
      </template>
      <template #actions>
        <div class="flex gap-3">
          <CmButton variant="secondary" class="flex-1" @click="skipConversation">
            {{ t('learning.conversation.prompt.skip') }}
          </CmButton>
          <CmButton class="flex-1" @click="startConversation">
            {{ t('learning.conversation.prompt.start') }}
          </CmButton>
        </div>
      </template>
    </CmBottomSheet>
  </div>
</template>
