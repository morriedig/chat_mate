<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  feedback: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['retry'])

// Scores read as one quiet line of text, not coloured pills
const scores = computed(() => {
  const f = props.feedback
  if (!f) return []
  return [
    f.grammar && { label: t('feedback.grammar'), score: f.grammar.score },
    f.vocabulary && { label: t('feedback.vocabulary'), score: f.vocabulary.score },
    f.naturalness && { label: t('feedback.naturalness'), score: f.naturalness.score },
  ].filter(Boolean)
})
</script>

<template>
  <!-- Loading: static skeleton + text -->
  <div v-if="loading" class="feedback-panel w-full rounded-[14px] border border-hairline bg-surface p-3" role="status">
    <p class="mb-2 text-caption text-ink-muted">{{ t('feedback.analyzing') }}</p>
    <div class="space-y-2" aria-hidden="true">
      <div class="h-2.5 w-3/4 rounded-[3px] bg-accent-soft"></div>
      <div class="h-2.5 w-full rounded-[3px] bg-surface-raised"></div>
      <div class="h-2.5 w-2/3 rounded-[3px] bg-surface-raised"></div>
    </div>
  </div>

  <!-- Error: beside the failed action, with Retry -->
  <div v-else-if="error" class="feedback-panel flex w-full items-start gap-2 rounded-[14px] bg-error-soft p-3" role="alert">
    <span class="material-symbols-outlined mt-0.5 text-error" aria-hidden="true">error</span>
    <div class="min-w-0 flex-1">
      <p class="text-caption text-ink">{{ t('feedback.error') }}</p>
      <button type="button" @click="emit('retry')" class="feedback-retry -mx-2 mt-1 inline-flex min-h-11 items-center gap-1 rounded-[10px] px-2 text-caption font-medium text-ink">
        <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">refresh</span>{{ t('common.retry') }}
      </button>
    </div>
  </div>

  <!-- Feedback content -->
  <div v-else-if="feedback" class="feedback-panel w-full space-y-3 rounded-[14px] border border-hairline bg-surface p-3 text-left">
    <p v-if="scores.length" class="flex flex-wrap gap-x-3 gap-y-1 text-meta text-ink-muted tabular-nums">
      <span v-for="s in scores" :key="s.label" class="feedback-score">{{ s.label }} {{ s.score }}</span>
    </p>

    <!-- Corrections -->
    <div v-if="feedback.grammar?.corrections?.length" class="space-y-1">
      <p class="text-caption font-medium text-ink-secondary">{{ t('feedback.corrections') }}</p>
      <p
        v-for="(correction, i) in feedback.grammar.corrections"
        :key="i"
        class="break-words text-body text-ink"
      >{{ correction }}</p>
    </div>

    <!-- Suggestions -->
    <div v-if="feedback.alternatives?.length" class="space-y-1">
      <p class="text-caption font-medium text-ink-secondary">{{ t('feedback.alternatives') }}</p>
      <p
        v-for="(alt, i) in feedback.alternatives"
        :key="i"
        class="break-words text-body text-ink"
      >“{{ alt }}”</p>
    </div>

    <!-- Tips -->
    <div v-if="feedback.naturalness?.tips?.length" class="space-y-1">
      <p class="text-caption font-medium text-ink-secondary">{{ t('feedback.tips') }}</p>
      <p
        v-for="(tip, i) in feedback.naturalness.tips"
        :key="i"
        class="break-words text-body text-ink"
      >{{ tip }}</p>
    </div>
  </div>
</template>
