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
  <!-- Quiet 48 px strip: prompt text, use / another / dismiss (DESIGN.md "Diary") -->
  <section
    class="flex min-h-12 items-center gap-1 border-y border-hairline py-1"
    :aria-label="t('diary.prompt.label')"
  >
    <span class="material-symbols-outlined shrink-0 !text-[18px] text-ink-muted" aria-hidden="true">lightbulb</span>
    <p class="min-w-0 flex-1 px-1 text-caption text-ink">{{ currentPrompt }}</p>
    <button
      type="button"
      @click="emit('use-prompt', currentPrompt)"
      class="inline-flex min-h-11 shrink-0 items-center rounded-[10px] px-2 text-caption font-medium text-accent active:bg-surface-raised"
    >
      {{ t('diary.prompt.useThis') }}
    </button>
    <button
      type="button"
      @click="cyclePrompt"
      :aria-label="t('diary.prompt.another')"
      class="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-ink-muted active:bg-surface-raised"
    >
      <span class="material-symbols-outlined" aria-hidden="true">refresh</span>
    </button>
    <button
      type="button"
      @click="emit('dismiss')"
      :aria-label="t('common.dismissPrompt')"
      class="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-ink-muted active:bg-surface-raised"
    >
      <span class="material-symbols-outlined" aria-hidden="true">close</span>
    </button>
  </section>
</template>
