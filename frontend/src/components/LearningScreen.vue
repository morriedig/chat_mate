<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useDarkMode } from '../composables/useDarkMode'
import { useUserProgress } from '../composables/useUserProgress'
import { useLearningProgress } from '../composables/useLearningProgress'
import { useSRS } from '../composables/useSRS'
import { useNavState } from '../composables/useNavState'
import { getChaptersByLevel, getChapterWords, getChapterConversations, getPreLessons, getChapterCharacters, isPreLesson } from '../data/chapterLoader'
import { usePreLessonProgress } from '../composables/usePreLessonProgress'
import VocabularyCard from './learning/VocabularyCard.vue'
import FlashcardMode from './learning/FlashcardMode.vue'
import QuizMode from './learning/QuizMode.vue'
import ConversationPractice from './learning/ConversationPractice.vue'
import CharacterCard from './learning/CharacterCard.vue'
import CharacterGrid from './learning/CharacterGrid.vue'
import CharacterMatchGame from './learning/CharacterMatchGame.vue'

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
} = useNavState()

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
const showConversationPrompt = ref(false)
const isBilingual = ref(true) // Default to bilingual for beginners
const voiceSpeed = ref('normal') // 'normal', 'slow', 'word'
const isReviewMode = ref(false)
const reviewWords = ref([])
const isPreLessonSelected = ref(false)
const currentCharacters = ref([])

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
    learningMode.value = 'cards'
  } else {
    isPreLessonSelected.value = false
    currentCharacters.value = []
    currentWords.value = getChapterWords(chapter.id, props.targetLanguage, props.motherTongue)
    currentConversations.value = getChapterConversations(chapter.id, props.targetLanguage, props.motherTongue)
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
  selectedChapter.value = { id: null, title: t('srs.dailyReview'), icon: '🔄' }
  currentWords.value = reviewWords.value
  currentConversations.value = []
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
  // Show conversation prompt after completing quiz
  showConversationPrompt.value = true
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
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <!-- Header -->
    <header class="sticky top-0 z-10 bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-700 safe-area-top">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          @click="selectedChapter ? backToChapters() : router.push('/')"
          class="flex items-center gap-2 text-text-muted hover:text-text-main dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <span class="material-symbols-outlined">arrow_back</span>
          <span class="text-sm font-medium">{{ selectedChapter ? t('learning.backToChapters') : t('learning.backToSetup') }}</span>
        </button>

        <div class="flex items-center gap-4">
          <!-- Voice Speed Select -->
          <div class="relative">
            <select
              v-model="voiceSpeed"
              class="appearance-none pl-8 pr-8 py-1.5 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-text-main dark:text-slate-300 border-none cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="normal">{{ t('learning.voiceSpeed.normal') }}</option>
              <option value="slow">{{ t('learning.voiceSpeed.slow') }}</option>
              <option value="word">{{ t('learning.voiceSpeed.word') }}</option>
            </select>
            <span class="material-symbols-outlined text-lg absolute left-2 top-1/2 -translate-y-1/2 text-text-muted dark:text-slate-400 pointer-events-none">volume_up</span>
            <span class="material-symbols-outlined text-sm absolute right-2 top-1/2 -translate-y-1/2 text-text-muted dark:text-slate-400 pointer-events-none">expand_more</span>
          </div>

          <!-- Bilingual Toggle -->
          <button
            @click="isBilingual = !isBilingual"
            class="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            :class="isBilingual
              ? 'bg-primary/10 text-primary'
              : 'bg-slate-100 dark:bg-slate-800 text-text-muted dark:text-slate-400'"
          >
            <span class="material-symbols-outlined text-lg">translate</span>
            <span class="hidden sm:inline">{{ t('learning.bilingual') }}</span>
          </button>

          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ props.level.icon }}</span>
            <span class="font-semibold text-text-main dark:text-white">{{ t(`levels.${props.level.id}.name`) }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 py-6">
      <!-- Chapter Selection -->
      <template v-if="!selectedChapter">
        <h1 class="text-2xl font-bold text-text-main dark:text-white mb-2">{{ t('learning.chooseChapter') }}</h1>
        <p class="text-text-muted dark:text-slate-400 mb-6">{{ t('learning.chapterDescription') }}</p>

        <!-- Pre-Lesson Foundation Section -->
        <div v-if="preLessons.length > 0" class="mb-6">
          <div class="flex items-center gap-2 mb-3">
            <span class="material-symbols-outlined text-violet-500">auto_stories</span>
            <h2 class="text-lg font-bold text-text-main dark:text-white">{{ t('foundation.title') }}</h2>
            <span class="text-sm text-text-muted dark:text-slate-400">{{ t('foundation.description') }}</span>
          </div>

          <div class="space-y-3">
            <div
              v-for="pl in preLessons"
              :key="pl.id"
              @click="selectChapter(pl)"
              class="flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.01] bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20"
              :class="preLessonProgress[pl.id]?.quizCompleted
                ? 'border-green-400 dark:border-green-600'
                : 'border-violet-300 dark:border-violet-700 hover:border-violet-400 dark:hover:border-violet-500'"
            >
              <!-- Icon -->
              <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <span v-if="preLessonProgress[pl.id]?.quizCompleted" class="material-symbols-outlined text-2xl text-green-600 dark:text-green-400">check_circle</span>
                <span v-else class="text-2xl">{{ pl.icon }}</span>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-text-main dark:text-white text-lg">{{ pl.title }}</h3>
                <p class="text-sm text-text-muted dark:text-slate-400 truncate">{{ pl.description }}</p>
                <!-- Character progress bar -->
                <div v-if="pl.characterCount > 0" class="mt-2">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs text-violet-600 dark:text-violet-400">
                      {{ t('foundation.charactersLearned', { learned: preLessonProgress[pl.id]?.charactersLearned || 0, total: pl.characterCount }) }}
                    </span>
                  </div>
                  <div class="w-full h-1.5 bg-violet-200 dark:bg-violet-800 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-violet-500 dark:bg-violet-400 rounded-full transition-all duration-300"
                      :style="{ width: `${Math.min(100, ((preLessonProgress[pl.id]?.charactersLearned || 0) / pl.characterCount) * 100)}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Character Count Badge -->
              <div class="flex-shrink-0 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                <span class="text-sm font-medium text-violet-600 dark:text-violet-400">
                  {{ t('foundation.characters', { count: pl.characterCount }) }}
                </span>
              </div>

              <!-- Arrow -->
              <span class="material-symbols-outlined text-violet-400 dark:text-violet-500">chevron_right</span>
            </div>
          </div>

          <!-- Lock Divider -->
          <div v-if="chaptersLocked" class="flex items-center gap-3 my-6">
            <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            <div class="flex items-center gap-1.5 text-sm text-text-muted dark:text-slate-500">
              <span class="material-symbols-outlined text-base">lock</span>
              {{ t('foundation.completeToUnlock') }}
            </div>
            <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>

        <!-- Daily Review Card -->
        <div
          v-if="dueReviewWords.length > 0"
          @click="startDailyReview"
          class="flex items-center gap-4 p-4 mb-6 rounded-2xl border-2 border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 cursor-pointer transition-all hover:scale-[1.01]"
        >
          <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <span class="text-2xl">🔄</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-text-main dark:text-white text-lg">{{ t('srs.dailyReview') }}</h3>
            <p class="text-sm text-text-muted dark:text-slate-400">{{ t('srs.dailyReviewDescription') }}</p>
          </div>
          <div class="flex-shrink-0 px-3 py-1 bg-amber-200 dark:bg-amber-800 rounded-full">
            <span class="text-sm font-bold text-amber-800 dark:text-amber-200">
              {{ t('srs.wordsToReview', { count: dueReviewWords.length }) }}
            </span>
          </div>
          <span class="material-symbols-outlined text-amber-600 dark:text-amber-400">chevron_right</span>
        </div>

        <div class="space-y-4">
          <div
            v-for="(chapter, index) in availableChapters"
            :key="chapter.id"
            @click="!chaptersLocked && selectChapter(chapter)"
            class="flex items-center gap-4 p-4 rounded-2xl border-2 bg-surface-light dark:bg-surface-dark transition-all"
            :class="[
              chaptersLocked
                ? 'opacity-50 pointer-events-none border-slate-200 dark:border-slate-700'
                : [
                    'hover:border-primary dark:hover:border-primary cursor-pointer hover:scale-[1.01]',
                    getChapterCompletionStatus(chapter.id).complete
                      ? 'border-green-400 dark:border-green-600'
                      : 'border-slate-200 dark:border-slate-700'
                  ]
            ]"
          >
            <!-- Chapter Number / Completion Check -->
            <div
              class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
              :class="getChapterCompletionStatus(chapter.id).complete
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-primary/10 dark:bg-primary/20'"
            >
              <span
                v-if="getChapterCompletionStatus(chapter.id).complete"
                class="material-symbols-outlined text-2xl text-green-600 dark:text-green-400"
              >check_circle</span>
              <span v-else class="text-lg font-bold text-primary">{{ index + 1 }}</span>
            </div>

            <!-- Chapter Icon -->
            <span class="text-4xl">{{ chapter.icon }}</span>

            <!-- Chapter Info -->
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-text-main dark:text-white text-lg">{{ chapter.title }}</h3>
              <p class="text-sm text-text-muted dark:text-slate-400 truncate">{{ chapter.description }}</p>
              <!-- Progress indicators -->
              <div class="flex items-center gap-3 mt-1">
                <span
                  class="flex items-center gap-1 text-xs"
                  :class="getChapterCompletionStatus(chapter.id).quiz
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-text-muted dark:text-slate-500'"
                >
                  <span class="material-symbols-outlined text-sm">
                    {{ getChapterCompletionStatus(chapter.id).quiz ? 'check_circle' : 'radio_button_unchecked' }}
                  </span>
                  {{ t('learning.progress.quiz') }}
                </span>
                <span
                  class="flex items-center gap-1 text-xs"
                  :class="getChapterCompletionStatus(chapter.id).conversation
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-text-muted dark:text-slate-500'"
                >
                  <span class="material-symbols-outlined text-sm">
                    {{ getChapterCompletionStatus(chapter.id).conversation ? 'check_circle' : 'radio_button_unchecked' }}
                  </span>
                  {{ t('learning.progress.conversation') }}
                </span>
              </div>
            </div>

            <!-- SRS Due Badge -->
            <div
              v-if="chapterDueCounts[chapter.id] > 0"
              class="flex-shrink-0 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full"
            >
              <span class="text-xs font-bold text-amber-700 dark:text-amber-300">
                {{ chapterDueCounts[chapter.id] }} {{ t('srs.dueToday') }}
              </span>
            </div>

            <!-- Word Count Badge -->
            <div class="flex-shrink-0 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
              <span class="text-sm font-medium text-text-muted dark:text-slate-400">
                {{ chapter.wordCount }} {{ t('learning.words') }}
              </span>
            </div>

            <!-- Arrow -->
            <span class="material-symbols-outlined text-text-muted dark:text-slate-400">chevron_right</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="availableChapters.length === 0 && preLessons.length === 0" class="text-center py-12">
          <span class="text-6xl block mb-4">📚</span>
          <h3 class="text-lg font-semibold text-text-main dark:text-white mb-2">{{ t('learning.noChapters') }}</h3>
          <p class="text-text-muted dark:text-slate-400">{{ t('learning.noChaptersDescription') }}</p>
        </div>
      </template>

      <!-- Learning Content -->
      <template v-else>
        <!-- Chapter Header with Mode Selector -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div class="flex items-center gap-3">
            <span class="text-4xl">{{ selectedChapter.icon }}</span>
            <div>
              <h1 class="text-2xl font-bold text-text-main dark:text-white">{{ selectedChapter.title }}</h1>
              <p class="text-sm text-text-muted dark:text-slate-400">
                {{ isPreLessonSelected
                  ? t('foundation.characters', { count: currentCharacters.length })
                  : `${currentWords.length} ${t('learning.words')}` }}
              </p>
            </div>
          </div>

          <!-- Mode Tabs: Pre-lesson modes -->
          <div v-if="isPreLessonSelected" class="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button
              @click="setMode('cards')"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="learningMode === 'cards'
                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                : 'text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white'"
            >
              <span class="material-symbols-outlined text-lg">style</span>
              {{ t('foundation.cards') }}
            </button>
            <button
              @click="setMode('grid')"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="learningMode === 'grid'
                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                : 'text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white'"
            >
              <span class="material-symbols-outlined text-lg">grid_view</span>
              {{ t('foundation.grid') }}
            </button>
            <button
              @click="setMode('match')"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="learningMode === 'match'
                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                : 'text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white'"
            >
              <span class="material-symbols-outlined text-lg">extension</span>
              {{ t('foundation.match') }}
            </button>
            <button
              @click="setMode('quiz')"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="learningMode === 'quiz'
                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                : 'text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white'"
            >
              <span class="material-symbols-outlined text-lg">quiz</span>
              {{ t('learning.modes.quiz') }}
            </button>
          </div>

          <!-- Mode Tabs: Regular chapter modes -->
          <div v-else class="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button
              @click="setMode('list')"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="learningMode === 'list'
                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                : 'text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white'"
            >
              <span class="material-symbols-outlined text-lg">list</span>
              {{ t('learning.modes.list') }}
            </button>
            <button
              @click="setMode('flashcard')"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="learningMode === 'flashcard'
                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                : 'text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white'"
            >
              <span class="material-symbols-outlined text-lg">style</span>
              {{ t('learning.modes.flashcard') }}
            </button>
            <button
              @click="setMode('quiz')"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="learningMode === 'quiz'
                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                : 'text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white'"
            >
              <span class="material-symbols-outlined text-lg">quiz</span>
              {{ t('learning.modes.quiz') }}
            </button>
            <button
              v-if="!isReviewMode"
              @click="setMode('conversation')"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="learningMode === 'conversation'
                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                : 'text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white'"
            >
              <span class="material-symbols-outlined text-lg">chat</span>
              {{ t('learning.modes.conversation') }}
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

        <!-- List Mode -->
        <div v-else-if="learningMode === 'list'" class="space-y-3">
          <VocabularyCard
            v-for="word in currentWords"
            :key="word.id"
            :word="word"
            :language="targetLanguage"
            :bilingual="isBilingual"
            :voice-speed="voiceSpeed"
          />
        </div>

        <!-- Flashcard Mode -->
        <FlashcardMode
          v-else-if="learningMode === 'flashcard'"
          :words="currentWords"
          :language="targetLanguage"
          :bilingual="isBilingual"
          :voice-speed="voiceSpeed"
        />

        <!-- Quiz Mode -->
        <QuizMode
          v-else-if="learningMode === 'quiz'"
          :words="currentWords"
          :language="targetLanguage"
          :chapter-id="selectedChapter.id"
          @complete="handleQuizComplete"
        />

        <!-- Conversation Mode -->
        <ConversationPractice
          v-else-if="learningMode === 'conversation'"
          :conversations="currentConversations"
          :language="targetLanguage"
          :bilingual="isBilingual"
          :voice-speed="voiceSpeed"
          :chapter-id="selectedChapter.id"
          @back="backFromConversation"
        />
      </template>
    </main>

    <!-- Conversation Prompt Modal (after quiz) -->
    <Teleport to="body">
      <div
        v-if="showConversationPrompt"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="skipConversation"
      >
        <div class="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 max-w-md w-full shadow-xl">
          <div class="text-center">
            <span class="text-5xl block mb-4">💬</span>
            <h3 class="text-xl font-bold text-text-main dark:text-white mb-2">
              {{ t('learning.conversation.prompt.title') }}
            </h3>
            <p class="text-text-muted dark:text-slate-400 mb-6">
              {{ t('learning.conversation.prompt.description') }}
            </p>
            <div class="flex gap-3">
              <button
                @click="skipConversation"
                class="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-text-main dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {{ t('learning.conversation.prompt.skip') }}
              </button>
              <button
                @click="startConversation"
                class="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                {{ t('learning.conversation.prompt.start') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
