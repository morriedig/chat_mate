<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { characters, levels } from '../data/characters.js'
import { useDarkMode } from '../composables/useDarkMode'
import { useMotherTongue, supportedLanguages } from '../composables/useMotherTongue'
import { useDailyChallenge } from '../composables/useDailyChallenge'
import { useUserProgress } from '../composables/useUserProgress'
import { useNavState } from '../composables/useNavState'
import { useLastSession } from '../composables/useLastSession'
import { useOpinionChat } from '../composables/useOpinionChat'
import DailyChallengeCard from './DailyChallengeCard.vue'
import ScenarioSelector from './ScenarioSelector.vue'
import ProgressPanel from './ProgressPanel.vue'
import { useProgressSeen } from '../composables/useProgressSeen'
import HomeHero from './HomeHero.vue'
import DailyOpinionCard from './DailyOpinionCard.vue'
import DailyPracticeCard from './DailyPracticeCard.vue'
import TaskChatCard from './TaskChatCard.vue'
import RetellCard from './RetellCard.vue'
import { useTaskChatLauncher } from '../composables/useTaskChatLauncher'
import { useDailyPractice } from '../composables/useDailyPractice'
import WelcomeOnboarding from './WelcomeOnboarding.vue'
import CmAvatar from './ui/CmAvatar.vue'
import CmIconButton from './ui/CmIconButton.vue'
import CmButton from './ui/CmButton.vue'
import { levelCode, languageCode } from '../utils/levelCode'

const { t, locale } = useI18n()
const router = useRouter()
const { isDark, toggle: toggleDark } = useDarkMode()
const { motherTongue, setMotherTongue } = useMotherTongue()
useUserProgress()
const { startChallenge } = useDailyChallenge()
const { setChatState, setLearningState, selectedLevel: navSelectedLevel } = useNavState()
const { load: loadLastSession, saveChatSession, saveLearningSession } = useLastSession()

const showScenarios = ref(false)
// XP, rank, achievements, quests, daily goal, analytics and share card live in one panel
const showProgress = ref(false)
const { hasNew: progressHasNew } = useProgressSeen()
const showWelcome = ref(false)
const placementBanner = ref(null)

// Restore last session
const last = loadLastSession()

// Primary mode: 'chat' or 'learning'
const primaryMode = ref(last?.type || 'learning')

// Chat mode options — consume placement result if present
function readPlacementResult() {
  try {
    const raw = localStorage.getItem('chatmate_placement_result')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Only surface banner if applied within the last 10 minutes
    if (parsed.appliedAt && Date.now() - parsed.appliedAt < 10 * 60 * 1000) return parsed
    return null
  } catch {
    return null
  }
}
const placement = readPlacementResult()

// Initial level: placement > nav state > last session > null
const initialLevel = (() => {
  if (placement?.level) {
    const match = levels.find(l => l.id === placement.level)
    if (match) return match
  }
  if (navSelectedLevel.value) return navSelectedLevel.value
  if (last?.type === 'chat') return levels.find(l => l.id === last.levelId) || null
  return null
})()

const selectedCharacter = ref(
  last?.type === 'chat' ? characters.find(c => c.id === last.characterId) || null : null
)
const selectedLevel = ref(initialLevel)
const selectedChatMode = ref(last?.type === 'chat' ? last.mode || 'free' : 'free')

// Learning mode options
const selectedLearningLevel = ref(
  placement?.level ? levels.find(l => l.id === placement.level) || null
    : last?.type === 'learning' ? levels.find(l => l.id === last.levelId) || null
    : null
)
const lastTargetLanguage = last?.type === 'learning' ? last.targetLanguage : null
const selectedTargetLanguage = ref(supportedLanguages.some(l => l.id === lastTargetLanguage) ? lastTargetLanguage : null)

onMounted(() => {
  // First-run onboarding
  try {
    if (!localStorage.getItem('chatmate_onboarded')) {
      showWelcome.value = true
    }
  } catch {}

  // Show placement banner if we just came from the placement test
  if (placement) {
    placementBanner.value = placement
    try { localStorage.removeItem('chatmate_placement_result') } catch {}
  }
})

function handleOnboardingTakeTest() {
  showWelcome.value = false
  router.push('/placement-test')
}

function dismissPlacementBanner() {
  placementBanner.value = null
}

// Available target languages (exclude mother tongue)
const availableTargetLanguages = computed(() => {
  return supportedLanguages.filter(lang => lang.id !== motherTongue.value)
})

// With only one language to learn there is nothing to choose, so pick it
watch(availableTargetLanguages, (langs) => {
  if (langs.length === 1 && selectedTargetLanguage.value !== langs[0].id) {
    selectedTargetLanguage.value = langs[0].id
  }
}, { immediate: true })

// Handle mother tongue change - also updates UI language
function handleMotherTongueChange(langId) {
  setMotherTongue(langId)
  selectedTargetLanguage.value = null
  // Also update UI language to match mother tongue
  locale.value = langId
  localStorage.setItem('chatmate_locale', langId)
}

const canStartChat = computed(() => selectedCharacter.value && selectedLevel.value)
const canStartLearning = computed(() => selectedLearningLevel.value && selectedTargetLanguage.value)

// The AI friend always speaks English while the app focuses on English
const CHAT_LANGUAGE = 'en'

// Main path: today's practice → task chat with today's patterns → retell drill.
// Everything else (free chat setup, learning, extras) sits under "More".
const { startTaskChat, todayPatterns } = useTaskChatLauncher()
const { isDoneToday: practiceDone } = useDailyPractice()
const MORE_KEY = 'chatmate_home_more_open'
const moreOpen = ref((() => {
  try { return localStorage.getItem(MORE_KEY) === '1' } catch { return false }
})())
// The route marks one step as current: practice until it is done, then task chat
const currentStep = computed(() => (practiceDone.value ? 2 : 1))
const routeSteps = computed(() => [1, 2, 3].map(n => ({ n, current: n === currentStep.value })))

const primaryModeOptions = computed(() => [
  { id: 'chat', icon: 'forum', name: t('setup.primaryModes.chat.name'), desc: t('setup.primaryModes.chat.description') },
  { id: 'learning', icon: 'school', name: t('setup.primaryModes.learning.name'), desc: t('setup.primaryModes.learning.description') },
  { id: 'diary', icon: 'edit_note', name: t('diary.mode'), desc: t('diary.modeDesc') },
])
const chatModeOptions = computed(() => [
  { id: 'free', icon: 'chat_bubble', name: t('setup.modes.free.name'), desc: t('setup.modes.free.description') },
  { id: 'article', icon: 'article', name: t('setup.modes.article.name'), desc: t('setup.modes.article.description') },
])
const tools = computed(() => [
  { id: 'progress', icon: 'insights', label: t('progressPanel.title'), isNew: progressHasNew.value, open: () => { showProgress.value = true } },
  { id: 'scenarios', icon: 'theater_comedy', label: t('scenarios.title'), open: () => { showScenarios.value = true } },
  { id: 'placement', icon: 'quiz', label: t('placementTest.title'), open: () => router.push('/placement-test') },
])

const canStart = computed(() =>
  (primaryMode.value === 'chat' && canStartChat.value) ||
  (primaryMode.value === 'learning' && canStartLearning.value) ||
  primaryMode.value === 'diary')

function toggleMore() {
  moreOpen.value = !moreOpen.value
  try { localStorage.setItem(MORE_KEY, moreOpen.value ? '1' : '0') } catch { /* storage unavailable */ }
}

// Opinion chat entry (chat-first prototype): always English, intermediate level
const { topic: opinionTopic } = useOpinionChat()
const opinionCharacter = computed(() => selectedCharacter.value || characters[0])

function handleStartOpinionChat() {
  setChatState({
    character: opinionCharacter.value,
    level: levels.find(l => l.id === 'intermediate'),
    language: CHAT_LANGUAGE,
    mode: 'opinion',
  })
  router.push('/chat')
}

function handleScenarioSelect(scenario) {
  showScenarios.value = false
  if (canStartChat.value) {
    setChatState({
      character: selectedCharacter.value,
      level: selectedLevel.value,
      language: CHAT_LANGUAGE,
      mode: 'free',
      scenario,
    })
    saveChatSession({ characterId: selectedCharacter.value.id, levelId: selectedLevel.value.id, language: CHAT_LANGUAGE, mode: 'free' })
    router.push('/chat')
  }
}

function handleStart() {
  if (primaryMode.value === 'chat' && canStartChat.value) {
    setChatState({
      character: selectedCharacter.value,
      level: selectedLevel.value,
      language: CHAT_LANGUAGE,
      mode: selectedChatMode.value,
    })
    saveChatSession({ characterId: selectedCharacter.value.id, levelId: selectedLevel.value.id, language: CHAT_LANGUAGE, mode: selectedChatMode.value })
    if (selectedChatMode.value === 'article') {
      router.push('/articles')
    } else {
      router.push('/chat')
    }
  } else if (primaryMode.value === 'learning' && canStartLearning.value) {
    setLearningState({
      level: selectedLearningLevel.value,
      targetLanguage: selectedTargetLanguage.value,
      motherTongue: motherTongue.value,
      uiLanguage: locale.value,
    })
    saveLearningSession({ levelId: selectedLearningLevel.value.id, targetLanguage: selectedTargetLanguage.value, motherTongue: motherTongue.value, uiLanguage: locale.value })
    router.push('/learning')
  } else if (primaryMode.value === 'diary') {
    router.push('/diary')
  }
}
</script>

<template>
  <div class="min-h-screen overflow-y-auto bg-page safe-area-inset">
    <div class="mx-auto max-w-2xl px-4 pb-12 pt-2 min-[375px]:px-5">
      <!-- Header: quiet product title + language, theme, settings -->
      <header class="flex min-h-14 items-center justify-between gap-2">
        <h1 class="min-w-0 truncate text-title font-semibold text-ink">{{ t('app.title') }}</h1>
        <div class="flex shrink-0 items-center gap-1">
          <!-- Mother Tongue / UI Language Selector (combined) -->
          <div class="relative">
            <select
              :value="motherTongue"
              @change="handleMotherTongueChange($event.target.value)"
              :aria-label="t('setup.motherTongue')"
              class="h-11 min-h-11 cursor-pointer appearance-none rounded-[10px] border border-hairline bg-surface pl-3 pr-8 text-caption font-medium text-ink-secondary"
            >
              <option v-for="lang in supportedLanguages" :key="lang.id" :value="lang.id">
                {{ lang.nativeName }}
              </option>
            </select>
            <span class="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 !text-[18px] text-ink-muted" aria-hidden="true">expand_more</span>
          </div>
          <CmIconButton :icon="isDark ? 'light_mode' : 'dark_mode'" :label="t('setup.toggleDark')" @click="toggleDark" />
          <CmIconButton icon="settings" :label="t('setup.settings')" @click="router.push('/settings')" />
        </div>
      </header>

      <p class="mb-4 mt-1 text-body text-ink-secondary">{{ t('app.subtitle') }}</p>

      <!-- Compact progress rail: today's minutes, streak, level -->
      <HomeHero class="mb-6" />

      <!-- Placement Result Banner -->
      <Transition name="fade-slide">
        <div
          v-if="placementBanner"
          role="status"
          class="mb-6 flex items-start gap-3 rounded-[14px] border border-success/25 bg-success-soft py-2 pl-4 pr-1"
        >
          <span class="material-symbols-outlined mt-2.5 shrink-0 text-success" aria-hidden="true">task_alt</span>
          <div class="min-w-0 flex-1 py-2">
            <p class="text-caption font-medium text-ink">
              {{ t('setup.placementDone') }}
              <span>{{ t(`levels.${placementBanner.level}.name`) }}</span>
            </p>
            <p class="mt-0.5 text-meta text-ink-secondary">
              {{ t('setup.placementHint') }}
            </p>
          </div>
          <CmIconButton icon="close" :label="t('common.dismiss')" @click="dismissPlacementBanner" />
        </div>
      </Transition>

      <!-- Today's route: practice → task chat (with summary) → retell -->
      <section class="mb-5" aria-labelledby="home-route-title">
        <h2 id="home-route-title" class="mb-2.5 text-caption font-medium text-ink-secondary">{{ t('home.todayPath') }}</h2>
        <ol class="relative ml-1 grid grid-cols-1 gap-2.5">
          <!-- Faint vertical hairline through the step markers -->
          <span class="pointer-events-none absolute bottom-8 left-[11px] top-8 w-px bg-hairline" aria-hidden="true"></span>
          <li v-for="step in routeSteps" :key="step.n" class="relative grid min-w-0 grid-cols-[24px_minmax(0,1fr)] gap-2.5" :aria-current="step.current ? 'step' : undefined">
            <span
              class="relative z-[1] mt-3.5 flex size-6 items-center justify-center rounded-[6px] text-meta font-medium tabular-nums"
              :class="step.current ? 'bg-accent text-on-accent' : 'bg-surface-raised text-ink-secondary'"
              aria-hidden="true"
            >{{ step.n }}</span>
            <DailyPracticeCard v-if="step.n === 1" class="min-w-0" @open="router.push('/daily-practice')" />
            <TaskChatCard v-else-if="step.n === 2" class="min-w-0" :patterns="todayPatterns" :recommended="practiceDone" @open="startTaskChat" />
            <RetellCard v-else class="min-w-0" />
          </li>
        </ol>
      </section>

      <section class="mb-3">
        <DailyOpinionCard class="min-w-0" @open="router.push('/daily-opinion')" />
      </section>

      <!-- More: free chat, learning, diary and extras -->
      <button
        type="button"
        @click="toggleMore"
        :aria-expanded="moreOpen"
        aria-controls="home-more"
        class="flex min-h-12 w-full items-center justify-between rounded-[10px] border border-hairline bg-surface px-4 text-body font-medium text-ink"
      >
        <span>{{ t('home.more') }}</span>
        <span class="material-symbols-outlined text-ink-muted transition-transform duration-[180ms]" :class="moreOpen ? 'rotate-180' : ''" aria-hidden="true">expand_more</span>
      </button>
      <p v-if="!moreOpen" class="mt-3 px-0.5 text-meta text-ink-muted">{{ t('home.moreHint') }}</p>

      <div v-show="moreOpen" id="home-more" class="mt-6 space-y-8">
        <!-- Opinion chat (free chat about today's topic) -->
        <section>
          <button
            type="button"
            @click="handleStartOpinionChat"
            class="opinion-chat-entry flex w-full min-w-0 items-center gap-3 rounded-[14px] border border-hairline bg-surface p-4 text-left shadow-[var(--cm-shadow-small)]"
          >
            <CmAvatar :name="opinionCharacter.name" :size="40" />
            <span class="min-w-0 flex-1">
              <span class="block text-body font-medium text-ink">{{ t('opinionChat.homeTitle') }}</span>
              <span class="mt-0.5 block text-caption text-ink-secondary">{{ t('opinionChat.homeDesc') }}</span>
              <span lang="en" class="mt-1 block truncate text-meta text-accent">{{ opinionTopic.en }}</span>
            </span>
            <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">chevron_right</span>
          </button>
        </section>

        <!-- Primary mode: chat / learning / diary -->
        <section aria-labelledby="home-mode-title">
          <h2 id="home-mode-title" class="mb-2 px-1 text-caption font-medium text-ink-secondary">{{ t('setup.practiceType') }}</h2>
          <div role="radiogroup" aria-labelledby="home-mode-title" class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface">
            <button
              v-for="m in primaryModeOptions"
              :key="m.id"
              type="button"
              role="radio"
              data-test="primary-mode"
              :aria-checked="primaryMode === m.id"
              @click="primaryMode = m.id"
              class="flex min-h-14 w-full items-center gap-3 px-4 py-2.5 text-left"
              :class="primaryMode === m.id ? 'bg-accent-soft' : ''"
            >
              <span class="material-symbols-outlined shrink-0" :class="primaryMode === m.id ? 'text-accent' : 'text-ink-muted'" aria-hidden="true">{{ m.icon }}</span>
              <span class="min-w-0 flex-1">
                <span class="block text-body font-medium text-ink">{{ m.name }}</span>
                <span class="block text-meta text-ink-secondary">{{ m.desc }}</span>
              </span>
              <span v-if="primaryMode === m.id" class="material-symbols-outlined shrink-0 text-accent" aria-hidden="true">check</span>
            </button>
          </div>
        </section>

        <!-- ========== CHAT MODE OPTIONS ========== -->
        <template v-if="primaryMode === 'chat'">
          <!-- Friend -->
          <section aria-labelledby="home-partner-title">
            <h2 id="home-partner-title" class="mb-2 px-1 text-caption font-medium text-ink-secondary">{{ t('setup.choosePartner') }}</h2>
            <div role="radiogroup" aria-labelledby="home-partner-title" class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface">
              <button
                v-for="char in characters"
                :key="char.id"
                type="button"
                role="radio"
                data-test="character"
                :aria-checked="selectedCharacter?.id === char.id"
                @click="selectedCharacter = char"
                class="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left"
                :class="selectedCharacter?.id === char.id ? 'bg-accent-soft' : ''"
              >
                <CmAvatar :name="char.name" :size="40" />
                <span class="min-w-0 flex-1">
                  <span class="block text-body font-medium text-ink">{{ char.name }} <span class="text-meta font-normal text-ink-muted">{{ char.age }} · {{ char.location }}</span></span>
                  <span class="block text-caption text-ink-secondary">{{ t(`characters.${char.id}.tagline`) }}</span>
                </span>
                <span v-if="selectedCharacter?.id === char.id" class="material-symbols-outlined shrink-0 text-accent" aria-hidden="true">check</span>
              </button>
            </div>
          </section>

          <!-- Level -->
          <section aria-labelledby="home-level-title">
            <h2 id="home-level-title" class="mb-2 px-1 text-caption font-medium text-ink-secondary">{{ t('setup.yourLevel') }}</h2>
            <div role="radiogroup" aria-labelledby="home-level-title" class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface">
              <button
                v-for="level in levels"
                :key="level.id"
                type="button"
                role="radio"
                data-test="chat-level"
                :aria-checked="selectedLevel?.id === level.id"
                @click="selectedLevel = level"
                class="flex min-h-14 w-full items-center gap-3 px-4 py-2.5 text-left"
                :class="selectedLevel?.id === level.id ? 'bg-accent-soft' : ''"
              >
                <span class="w-12 shrink-0 text-caption font-medium text-ink-secondary tabular-nums">{{ levelCode(level.id) }}</span>
                <span class="min-w-0 flex-1">
                  <span class="block text-body font-medium text-ink">{{ t(`levels.${level.id}.name`) }}</span>
                  <span class="block text-meta text-ink-secondary">{{ t(`levels.${level.id}.description`) }}</span>
                </span>
                <span v-if="selectedLevel?.id === level.id" class="material-symbols-outlined shrink-0 text-accent" aria-hidden="true">check</span>
              </button>
            </div>
          </section>

          <!-- Chat type -->
          <section aria-labelledby="home-chatmode-title">
            <h2 id="home-chatmode-title" class="mb-2 px-1 text-caption font-medium text-ink-secondary">{{ t('setup.chooseMode') }}</h2>
            <div role="radiogroup" aria-labelledby="home-chatmode-title" class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface">
              <button
                v-for="m in chatModeOptions"
                :key="m.id"
                type="button"
                role="radio"
                data-test="chat-mode"
                :aria-checked="selectedChatMode === m.id"
                @click="selectedChatMode = m.id"
                class="flex min-h-14 w-full items-center gap-3 px-4 py-2.5 text-left"
                :class="selectedChatMode === m.id ? 'bg-accent-soft' : ''"
              >
                <span class="material-symbols-outlined shrink-0" :class="selectedChatMode === m.id ? 'text-accent' : 'text-ink-muted'" aria-hidden="true">{{ m.icon }}</span>
                <span class="min-w-0 flex-1">
                  <span class="block text-body font-medium text-ink">{{ m.name }}</span>
                  <span class="block text-meta text-ink-secondary">{{ m.desc }}</span>
                </span>
                <span v-if="selectedChatMode === m.id" class="material-symbols-outlined shrink-0 text-accent" aria-hidden="true">check</span>
              </button>
            </div>
          </section>
        </template>

        <!-- ========== LEARNING MODE OPTIONS ========== -->
        <template v-if="primaryMode === 'learning'">
          <!-- Target Language -->
          <section aria-labelledby="home-target-title">
            <h2 id="home-target-title" class="mb-2 px-1 text-caption font-medium text-ink-secondary">{{ t('setup.targetLanguage') }}</h2>
            <div role="radiogroup" aria-labelledby="home-target-title" class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface">
              <button
                v-for="lang in availableTargetLanguages"
                :key="lang.id"
                type="button"
                role="radio"
                data-test="target-language"
                :aria-checked="selectedTargetLanguage === lang.id"
                @click="selectedTargetLanguage = lang.id"
                class="flex min-h-14 w-full items-center gap-3 px-4 py-2.5 text-left"
                :class="selectedTargetLanguage === lang.id ? 'bg-accent-soft' : ''"
              >
                <span class="w-12 shrink-0 text-caption font-medium text-ink-secondary">{{ languageCode(lang.id) }}</span>
                <span class="min-w-0 flex-1 text-body font-medium text-ink">{{ lang.nativeName }}</span>
                <span v-if="selectedTargetLanguage === lang.id" class="material-symbols-outlined shrink-0 text-accent" aria-hidden="true">check</span>
              </button>
            </div>
          </section>

          <!-- Level -->
          <section aria-labelledby="home-learning-level-title">
            <h2 id="home-learning-level-title" class="mb-2 px-1 text-caption font-medium text-ink-secondary">{{ t('setup.learningLevel') }}</h2>
            <div role="radiogroup" aria-labelledby="home-learning-level-title" class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface">
              <button
                v-for="level in levels"
                :key="level.id"
                type="button"
                role="radio"
                data-test="learning-level"
                :aria-checked="selectedLearningLevel?.id === level.id"
                @click="selectedLearningLevel = level"
                class="flex min-h-14 w-full items-center gap-3 px-4 py-2.5 text-left"
                :class="selectedLearningLevel?.id === level.id ? 'bg-accent-soft' : ''"
              >
                <span class="w-12 shrink-0 text-caption font-medium text-ink-secondary tabular-nums">{{ levelCode(level.id) }}</span>
                <span class="min-w-0 flex-1">
                  <span class="block text-body font-medium text-ink">{{ t(`levels.${level.id}.name`) }}</span>
                  <span class="block text-meta text-ink-secondary">{{ t(`levels.${level.id}.description`) }}</span>
                </span>
                <span v-if="selectedLearningLevel?.id === level.id" class="material-symbols-outlined shrink-0 text-accent" aria-hidden="true">check</span>
              </button>
            </div>
          </section>

          <!-- What learning mode includes -->
          <section class="rounded-[14px] border border-hairline bg-surface p-4">
            <h3 class="text-caption font-medium text-ink">{{ t('setup.learningModeInfo.title') }}</h3>
            <ul class="mt-2 space-y-1.5 text-caption text-ink-secondary">
              <li class="flex items-start gap-2">
                <span class="material-symbols-outlined !text-[18px] shrink-0 text-ink-muted" aria-hidden="true">check</span>
                {{ t('setup.learningModeInfo.flashcards') }}
              </li>
              <li class="flex items-start gap-2">
                <span class="material-symbols-outlined !text-[18px] shrink-0 text-ink-muted" aria-hidden="true">check</span>
                {{ t('setup.learningModeInfo.audio') }}
              </li>
              <li class="flex items-start gap-2">
                <span class="material-symbols-outlined !text-[18px] shrink-0 text-ink-muted" aria-hidden="true">check</span>
                {{ t('setup.learningModeInfo.quiz') }}
              </li>
            </ul>
          </section>
        </template>

        <!-- Daily Challenge Card (shown when chat mode selected) -->
        <section v-if="primaryMode === 'chat' && canStartChat">
          <DailyChallengeCard
            :level="selectedLevel?.id || 'intermediate'"
            :language="locale"
            @start="() => {
              startChallenge(selectedLevel.id, locale)
              handleStart()
            }"
          />
        </section>

        <!-- Tools -->
        <section aria-labelledby="home-tools-title">
          <h2 id="home-tools-title" class="mb-2 px-1 text-caption font-medium text-ink-secondary">{{ t('home.tools') }}</h2>
          <ul class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface">
            <li v-for="tool in tools" :key="tool.id">
              <button
                type="button"
                :data-test="`tool-${tool.id}`"
                @click="tool.open"
                class="flex min-h-[52px] w-full items-center gap-3 px-4 py-2 text-left active:bg-surface-raised"
              >
                <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">{{ tool.icon }}</span>
                <span class="min-w-0 flex-1 break-words text-body text-ink">{{ tool.label }} <span v-if="tool.isNew" class="inline-block rounded-[6px] bg-accent-soft px-1.5 align-middle text-meta font-medium text-accent">{{ t('progressPanel.new') }}</span></span>
                <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">chevron_right</span>
              </button>
            </li>
          </ul>
        </section>

        <!-- Start Button -->
        <CmButton
          block
          class="start-button"
          @click="handleStart"
          :disabled="!canStart"
        >
          {{ primaryMode === 'chat' ? t('setup.startChatting') : primaryMode === 'diary' ? t('setup.startDiary') : t('setup.startLearning') }}
          <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </CmButton>
      </div>
    </div>

    <!-- Scenario Selector -->
    <ScenarioSelector
      v-if="showScenarios"
      :level="selectedLevel?.id || selectedLearningLevel?.id || 'intermediate'"
      @select="handleScenarioSelect"
      @close="showScenarios = false"
    />

    <!-- Progress and achievements (opened on purpose; nothing pops up by itself) -->
    <ProgressPanel v-if="showProgress" @close="showProgress = false" />

    <!-- First-run Welcome -->
    <WelcomeOnboarding
      v-if="showWelcome"
      @close="showWelcome = false"
      @take-test="handleOnboardingTakeTest"
    />
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity var(--motion-control) var(--ease-cm), transform var(--motion-control) var(--ease-cm);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
