<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDiaryPrompts } from '../../composables/useDiaryPrompts'

const { t } = useI18n()

const props = defineProps({
  level: {
    type: String,
    default: 'intermediate'
  },
  language: {
    type: String,
    default: 'en'
  }
})

const emit = defineEmits(['use-prompt', 'dismiss'])

const { getTodayPrompt, getRandomPrompt } = useDiaryPrompts()

const currentPrompt = ref(getTodayPrompt(props.level, props.language))

function cyclePrompt() {
  currentPrompt.value = getRandomPrompt(props.level, props.language)
}
</script>

<template>
  <div class="relative bg-gradient-to-r from-primary/10 to-sky-400/10 dark:from-primary/20 dark:to-sky-400/20 border border-primary/20 dark:border-primary/30 rounded-2xl p-4">
    <!-- Dismiss -->
    <button
      @click="emit('dismiss')"
      class="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      aria-label="Dismiss prompt"
    >
      <span class="material-symbols-outlined text-[18px]">close</span>
    </button>

    <!-- Icon + Label -->
    <div class="flex items-center gap-2 mb-2">
      <span class="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
      <span class="text-xs font-semibold text-primary uppercase tracking-wider">{{ t('diary.prompt.label') }}</span>
    </div>

    <!-- Prompt Text -->
    <p class="text-sm text-text-main dark:text-white font-medium mb-3 pr-6">{{ currentPrompt }}</p>

    <!-- Action Buttons -->
    <div class="flex items-center gap-4">
      <button
        @click="emit('use-prompt', currentPrompt)"
        class="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
      >
        <span class="material-symbols-outlined text-[16px]">edit</span>
        {{ t('diary.prompt.useThis') }}
      </button>
      <button
        @click="cyclePrompt"
        class="text-xs font-semibold text-text-muted dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1"
      >
        <span class="material-symbols-outlined text-[16px]">refresh</span>
        {{ t('diary.prompt.another') }}
      </button>
    </div>
  </div>
</template>
