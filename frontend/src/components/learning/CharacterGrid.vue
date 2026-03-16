<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { playTTS, isTTSAvailable } from '../../utils/tts'

const { t } = useI18n()

const props = defineProps({
  characters: {
    type: Array,
    required: true
  },
  language: {
    type: String,
    default: 'ja'
  },
  learnedIds: {
    type: [Set, Array],
    default: () => new Set()
  },
  inProgressIds: {
    type: [Set, Array],
    default: () => new Set()
  },
  columns: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['select'])

// Normalize learnedIds and inProgressIds to Sets for fast lookup
const learnedSet = computed(() => {
  if (props.learnedIds instanceof Set) return props.learnedIds
  return new Set(props.learnedIds)
})

const inProgressSet = computed(() => {
  if (props.inProgressIds instanceof Set) return props.inProgressIds
  return new Set(props.inProgressIds)
})

// Group characters by row if they have a row property
const groupedCharacters = computed(() => {
  const hasRows = props.characters.some(c => c.row)
  if (!hasRows) return [{ row: null, characters: props.characters }]

  const groups = []
  const rowMap = new Map()

  for (const char of props.characters) {
    const row = char.row || 'other'
    if (!rowMap.has(row)) {
      const group = { row, characters: [] }
      rowMap.set(row, group)
      groups.push(group)
    }
    rowMap.get(row).characters.push(char)
  }

  return groups
})

function isLearned(characterId) {
  return learnedSet.value.has(characterId)
}

function isInProgress(characterId) {
  return inProgressSet.value.has(characterId)
}

function getCellState(characterId) {
  if (isLearned(characterId)) return 'learned'
  if (isInProgress(characterId)) return 'in-progress'
  return 'not-started'
}

function getCellClasses(characterId) {
  const state = getCellState(characterId)
  switch (state) {
    case 'learned':
      return 'bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-text-main dark:text-white'
    case 'in-progress':
      return 'bg-amber-100 dark:bg-amber-900/30 border-amber-400 dark:border-amber-600 text-text-main dark:text-white'
    default:
      return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
  }
}

async function handleSelect(character) {
  emit('select', character)

  // Play pronunciation
  if (isTTSAvailable()) {
    try {
      await playTTS(character.char, props.language)
    } catch (err) {
      console.warn('TTS playback failed:', err)
    }
  }
}

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))`
}))
</script>

<template>
  <div class="w-full">
    <!-- Summary -->
    <div class="flex items-center justify-between mb-4">
      <span class="text-sm text-text-muted dark:text-slate-400">
        {{ t('prelesson.collected', { learned: learnedSet.size, total: characters.length }) }}
      </span>
      <div class="flex items-center gap-3 text-xs text-text-muted dark:text-slate-400">
        <span class="flex items-center gap-1">
          <span class="inline-block size-3 rounded-sm bg-green-400"></span>
          {{ t('prelesson.stateLearned') }}
        </span>
        <span class="flex items-center gap-1">
          <span class="inline-block size-3 rounded-sm bg-amber-400"></span>
          {{ t('prelesson.stateInProgress') }}
        </span>
        <span class="flex items-center gap-1">
          <span class="inline-block size-3 rounded-sm bg-slate-300 dark:bg-slate-600"></span>
          {{ t('prelesson.stateNew') }}
        </span>
      </div>
    </div>

    <!-- Grid by Row Groups -->
    <div v-for="group in groupedCharacters" :key="group.row || 'all'" class="mb-4">
      <!-- Row Header -->
      <p v-if="group.row" class="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wide mb-2">
        {{ group.row }}
      </p>

      <!-- Character Grid -->
      <div
        class="grid gap-1.5"
        :style="gridStyle"
      >
        <button
          v-for="character in group.characters"
          :key="character.id"
          @click="handleSelect(character)"
          :aria-label="character.char + ' ' + character.romaji"
          class="relative flex flex-col items-center justify-center p-1.5 rounded-lg border-2 transition-all touch-target active:scale-95 character-cell"
          :class="getCellClasses(character.id)"
        >
          <!-- Character -->
          <span class="text-2xl font-bold leading-tight">
            {{ character.char }}
          </span>
          <!-- Romaji -->
          <span class="text-xs leading-tight mt-0.5">
            {{ character.romaji }}
          </span>
          <!-- Status Indicator -->
          <span
            v-if="isLearned(character.id)"
            class="absolute -top-1 -right-1 flex items-center justify-center size-4 rounded-full bg-green-500 text-white"
          >
            <span class="material-symbols-outlined text-xs" style="font-size: 10px;">check</span>
          </span>
          <span
            v-else-if="isInProgress(character.id)"
            class="absolute -top-1 -right-1 flex items-center justify-center size-4 rounded-full bg-amber-500"
          >
            <span class="text-white text-xs font-bold" style="font-size: 8px; line-height: 1;">...</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.character-cell:active {
  transform: scale(0.95);
}

/* Green pulse animation for learned cells on tap */
.character-cell.bg-green-100:active,
.character-cell.dark\:bg-green-900\/30:active {
  animation: greenPulse 0.4s ease-out;
}

@keyframes greenPulse {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
  100% { box-shadow: 0 0 0 12px rgba(34, 197, 94, 0); }
}
</style>
