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
      return 'border-success/40 bg-success-soft text-ink'
    case 'in-progress':
      return 'border-warning/40 bg-warning-soft text-ink'
    default:
      return 'border-hairline bg-surface-raised text-ink-muted active:bg-surface-sunken'
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
    <!-- Summary + legend -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <span class="text-caption tabular-nums text-ink-secondary">
        {{ t('prelesson.collected', { learned: learnedSet.size, total: characters.length }) }}
      </span>
      <div class="flex items-center gap-3 text-meta text-ink-muted">
        <span class="flex items-center gap-1">
          <span class="inline-block size-3 rounded-[3px] border border-success/40 bg-success-soft" aria-hidden="true"></span>
          {{ t('prelesson.stateLearned') }}
        </span>
        <span class="flex items-center gap-1">
          <span class="inline-block size-3 rounded-[3px] border border-warning/40 bg-warning-soft" aria-hidden="true"></span>
          {{ t('prelesson.stateInProgress') }}
        </span>
        <span class="flex items-center gap-1">
          <span class="inline-block size-3 rounded-[3px] border border-hairline bg-surface-raised" aria-hidden="true"></span>
          {{ t('prelesson.stateNew') }}
        </span>
      </div>
    </div>

    <!-- Grid by row groups -->
    <div v-for="group in groupedCharacters" :key="group.row || 'all'" class="mb-4">
      <p v-if="group.row" class="mb-2 text-meta font-medium text-ink-muted">
        {{ group.row }}
      </p>

      <div
        class="grid gap-1.5"
        :style="gridStyle"
      >
        <button
          v-for="character in group.characters"
          :key="character.id"
          type="button"
          @click="handleSelect(character)"
          :aria-label="character.char + ' ' + character.romaji"
          :data-state="getCellState(character.id)"
          class="touch-target relative flex flex-col items-center justify-center rounded-[10px] border p-1.5"
          :class="getCellClasses(character.id)"
        >
          <span class="text-title font-medium leading-tight">
            {{ character.char }}
          </span>
          <span class="mt-0.5 text-meta leading-tight">
            {{ character.romaji }}
          </span>
          <!-- Status marker: icon, not color alone -->
          <span
            v-if="isLearned(character.id)"
            data-testid="learned-mark"
            class="absolute right-0.5 top-0.5 material-symbols-outlined !text-[14px] text-success"
            aria-hidden="true"
          >check</span>
          <span
            v-else-if="isInProgress(character.id)"
            class="absolute right-0.5 top-0.5 material-symbols-outlined !text-[14px] text-warning"
            aria-hidden="true"
          >more_horiz</span>
        </button>
      </div>
    </div>
  </div>
</template>
