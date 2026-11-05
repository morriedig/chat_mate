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
  // Current step once daily practice is done: accent-soft fill + margin rule
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
    class="relative min-h-16 cursor-pointer rounded-[14px] border p-4 text-left shadow-[var(--cm-shadow-small)]"
    :class="recommended ? 'border-accent/30 bg-accent-soft pl-[18px]' : 'border-hairline bg-surface'"
  >
    <span v-if="recommended" class="absolute left-0 top-3.5 h-9 w-[3px] rounded-r-[3px] bg-accent" aria-hidden="true"></span>
    <div class="flex items-start gap-2.5">
      <span class="material-symbols-outlined shrink-0 text-accent" aria-hidden="true">chat_bubble</span>
      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-body font-medium text-ink">{{ t('taskChat.cardTitle') }}</h3>
          <span v-if="patterns.length" class="shrink-0 pt-0.5 text-meta text-ink-muted tabular-nums">{{ t('taskChat.cardCount', { count: patterns.length }) }}</span>
        </div>
        <p class="mt-0.5 text-caption text-ink-secondary">{{ task }}</p>
        <p class="mt-1 text-meta text-ink-muted">{{ t('taskChat.cardHint', { count: patterns.length }) }}</p>
      </div>
    </div>
  </div>
</template>
