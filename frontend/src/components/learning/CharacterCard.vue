<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { playTTS, isTTSAvailable } from '../../utils/tts'

const { t } = useI18n()

const props = defineProps({
  character: {
    type: Object,
    required: true
  },
  language: {
    type: String,
    default: 'ja'
  },
  learned: {
    type: Boolean,
    default: false
  }
})

const isPlayingChar = ref(false)
const isPlayingExample = ref(false)
const audioError = ref(false)

async function playCharacter() {
  if (isPlayingChar.value) return
  if (!isTTSAvailable()) {
    audioError.value = true
    return
  }

  isPlayingChar.value = true
  audioError.value = false

  try {
    await playTTS(props.character.char, props.language)
  } catch (err) {
    audioError.value = true
    console.warn('Audio playback failed:', err)
  } finally {
    isPlayingChar.value = false
  }
}

async function playExample(word) {
  if (isPlayingExample.value) return
  if (!isTTSAvailable()) {
    audioError.value = true
    return
  }

  isPlayingExample.value = true
  audioError.value = false

  try {
    await playTTS(word, props.language)
  } catch (err) {
    audioError.value = true
    console.warn('Audio playback failed:', err)
  } finally {
    isPlayingExample.value = false
  }
}
</script>

<template>
  <div
    class="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
    :class="{ 'border-l-4 border-l-green-500': learned }"
  >
    <!-- Learned Badge -->
    <div v-if="learned" class="flex justify-end mb-1">
      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium">
        <span class="material-symbols-outlined text-sm">check_circle</span>
        {{ t('prelesson.learned') }}
      </span>
    </div>

    <div class="flex items-start gap-4">
      <!-- Audio Button + Character Display -->
      <div class="flex flex-col items-center gap-2">
        <span class="text-4xl font-bold text-text-main dark:text-white">
          {{ character.char }}
        </span>
        <span v-if="character.romaji" class="text-sm text-primary font-medium">
          {{ character.romaji }}
        </span>
        <button
          @click="playCharacter"
          :disabled="isPlayingChar"
          :aria-label="character.reading"
          class="flex items-center justify-center size-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors disabled:opacity-50 touch-target"
          :class="{ 'animate-pulse': isPlayingChar }"
        >
          <span class="material-symbols-outlined text-xl">
            {{ isPlayingChar ? 'volume_up' : 'play_arrow' }}
          </span>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- Mnemonic -->
        <p v-if="character.mnemonic" class="text-base text-text-main dark:text-slate-200 font-medium mb-2">
          {{ character.mnemonic }}
        </p>

        <!-- Audio Hint -->
        <p v-if="character.audioHint" class="text-sm text-text-muted dark:text-slate-400 mb-3">
          {{ character.audioHint }}
        </p>

        <!-- Stroke Count -->
        <p v-if="character.strokeCount" class="text-xs text-text-muted dark:text-slate-500 mb-3">
          {{ t('prelesson.strokes', { count: character.strokeCount }) }}
        </p>

        <!-- Example Words -->
        <div v-if="character.examples && character.examples.length > 0" class="space-y-2">
          <p class="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wide">
            {{ t('prelesson.exampleWords') }}
          </p>
          <div
            v-for="(example, index) in character.examples"
            :key="index"
            class="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
          >
            <button
              @click="playExample(example.word)"
              :disabled="isPlayingExample"
              :aria-label="example.reading"
              class="shrink-0 flex items-center justify-center size-7 rounded-full bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-primary transition-colors disabled:opacity-50 shadow-sm touch-target"
              :class="{ 'animate-pulse': isPlayingExample }"
            >
              <span class="material-symbols-outlined text-sm">volume_up</span>
            </button>
            <span class="text-sm font-medium text-text-main dark:text-white">{{ example.word }}</span>
            <span v-if="example.reading" class="text-xs text-primary">{{ example.reading }}</span>
            <span class="text-xs text-text-muted dark:text-slate-400">{{ example.meaning }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Audio Error -->
    <p v-if="audioError" class="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
      <span class="material-symbols-outlined text-sm">warning</span>
      {{ t('learning.audioNotAvailable') }}
    </p>
  </div>
</template>
