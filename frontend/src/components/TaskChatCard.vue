<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMotherTongue } from '../composables/useMotherTongue'
import { pickTask, taskText } from '../composables/usePatternTask'

const { t } = useI18n()
const { motherTongue } = useMotherTongue()

defineProps({
  // Today's daily-practice patterns
  patterns: { type: Array, default: () => [] },
  // Highlighted as the next step once daily practice is done
  recommended: { type: Boolean, default: false },
})
const emit = defineEmits(['open'])

const task = computed(() => taskText(pickTask(), motherTongue.value))
</script>

<template>
  <div
    role="button"
    tabindex="0"
    @click="emit('open')"
    @keydown.enter.prevent="emit('open')"
    @keydown.space.prevent="emit('open')"
    class="cursor-pointer text-left p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
    :class="recommended
      ? 'border-primary bg-gradient-to-br from-primary/15 to-amber-50 dark:from-primary/25 dark:to-amber-900/10'
      : 'border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark'"
  >
    <div class="flex items-start gap-3">
      <span class="material-symbols-outlined text-2xl shrink-0 text-primary">forum</span>
      <div class="flex-1 min-w-0">
        <h3 class="font-bold text-text-main dark:text-white">{{ t('taskChat.cardTitle') }}</h3>
        <p class="text-sm text-text-main dark:text-slate-200 mt-1 leading-snug">{{ task }}</p>
        <p class="text-xs text-text-muted dark:text-slate-400 mt-1.5">{{ t('taskChat.cardHint', { count: patterns.length }) }}</p>
      </div>
      <span class="material-symbols-outlined text-primary shrink-0 self-center">arrow_forward</span>
    </div>
  </div>
</template>
