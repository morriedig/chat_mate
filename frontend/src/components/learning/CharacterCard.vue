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
  <article
    class="relative overflow-hidden rounded-[14px] border border-hairline bg-surface p-4 shadow-[var(--cm-shadow-small)]"
    data-testid="character-card"
    :data-learned="learned ? 'true' : 'false'"
  >
    <span v-if="learned" class="absolute left-0 top-4 h-9 w-[3px] rounded-r-[3px] bg-success" aria-hidden="true"></span>

    <div class="flex items-start gap-4">
      <!-- Character + reading + play -->
      <div class="flex w-16 shrink-0 flex-col items-center gap-1">
        <span class="text-[40px] font-medium leading-[48px] text-ink" data-testid="character-glyph">
          {{ character.char }}
        </span>
        <span v-if="character.romaji" class="text-caption text-accent" data-testid="character-romaji">
          {{ character.romaji }}
        </span>
        <button
          type="button"
          @click="playCharacter"
          :disabled="isPlayingChar"
          :aria-label="character.reading"
          class="touch-target inline-flex size-11 items-center justify-center rounded-[10px] text-accent active:bg-surface-raised disabled:opacity-55"
        >
          <span class="material-symbols-outlined" aria-hidden="true">
            {{ isPlayingChar ? 'volume_up' : 'play_arrow' }}
          </span>
        </button>
      </div>

      <!-- Content -->
      <div class="min-w-0 flex-1">
        <!-- Learned status: icon + text -->
        <p v-if="learned" class="mb-1 flex items-center gap-1 text-meta text-success">
          <span class="material-symbols-outlined !text-[16px]" aria-hidden="true">check_circle</span>
          {{ t('prelesson.learned') }}
        </p>

        <p v-if="character.mnemonic" class="mb-2 text-body font-medium text-ink">
          {{ character.mnemonic }}
        </p>

        <p v-if="character.audioHint" class="mb-2 text-caption text-ink-secondary">
          {{ character.audioHint }}
        </p>

        <p v-if="character.strokeCount" class="mb-3 text-meta tabular-nums text-ink-muted">
          {{ t('prelesson.strokes', { count: character.strokeCount }) }}
        </p>

        <!-- Example words -->
        <div v-if="character.examples && character.examples.length > 0">
          <p class="mb-1 text-meta text-ink-muted">
            {{ t('prelesson.exampleWords') }}
          </p>
          <ul class="space-y-1">
            <li
              v-for="(example, index) in character.examples"
              :key="index"
              class="flex flex-wrap items-center gap-x-2 rounded-[10px] bg-surface-sunken py-0.5 pl-0.5 pr-3"
            >
              <button
                type="button"
                @click="playExample(example.word)"
                :disabled="isPlayingExample"
                :aria-label="example.reading"
                class="touch-target inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-accent active:bg-surface-raised disabled:opacity-55"
              >
                <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">volume_up</span>
              </button>
              <span class="text-body font-medium text-ink">{{ example.word }}</span>
              <span v-if="example.reading" class="text-caption text-accent">{{ example.reading }}</span>
              <span class="text-caption text-ink-muted">{{ example.meaning }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Audio Error -->
    <p v-if="audioError" class="mt-2 flex items-center gap-1 text-meta text-warning" role="status">
      <span class="material-symbols-outlined !text-[16px]" aria-hidden="true">warning</span>
      {{ t('learning.audioNotAvailable') }}
    </p>
  </article>
</template>
