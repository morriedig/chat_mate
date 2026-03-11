<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
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

function getScoreColor(score) {
  if (score >= 80) return 'text-green-600 dark:text-green-400'
  if (score >= 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function getScoreBg(score) {
  if (score >= 80) return 'bg-green-100 dark:bg-green-900/30'
  if (score >= 60) return 'bg-amber-100 dark:bg-amber-900/30'
  return 'bg-red-100 dark:bg-red-900/30'
}
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
    <div class="flex items-center gap-2 text-sm text-text-muted dark:text-slate-400">
      <span class="material-symbols-outlined text-base animate-spin">progress_activity</span>
      {{ t('feedback.analyzing') }}
    </div>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="mt-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
    <div class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
      <span class="material-symbols-outlined text-base">error</span>
      {{ t('chat.genericError') }}
    </div>
  </div>

  <!-- Feedback Content -->
  <div v-else-if="feedback" class="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
    <!-- Score Pills -->
    <div class="flex flex-wrap gap-2">
      <span
        v-if="feedback.grammar"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
        :class="[getScoreBg(feedback.grammar.score), getScoreColor(feedback.grammar.score)]"
      >
        {{ t('feedback.grammar') }} {{ feedback.grammar.score }}
      </span>
      <span
        v-if="feedback.vocabulary"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
        :class="[getScoreBg(feedback.vocabulary.score), getScoreColor(feedback.vocabulary.score)]"
      >
        {{ t('feedback.vocabulary') }} {{ feedback.vocabulary.score }}
      </span>
      <span
        v-if="feedback.naturalness"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
        :class="[getScoreBg(feedback.naturalness.score), getScoreColor(feedback.naturalness.score)]"
      >
        {{ t('feedback.naturalness') }} {{ feedback.naturalness.score }}
      </span>
    </div>

    <!-- Corrections -->
    <div v-if="feedback.grammar?.corrections?.length" class="space-y-1">
      <p class="text-xs font-medium text-text-muted dark:text-slate-400">{{ t('feedback.corrections') }}</p>
      <p
        v-for="(correction, i) in feedback.grammar.corrections"
        :key="i"
        class="text-sm text-text-main dark:text-slate-200"
      >
        → {{ correction }}
      </p>
    </div>

    <!-- Suggestions -->
    <div v-if="feedback.alternatives?.length" class="space-y-1">
      <p class="text-xs font-medium text-text-muted dark:text-slate-400">{{ t('feedback.alternatives') }}</p>
      <p
        v-for="(alt, i) in feedback.alternatives"
        :key="i"
        class="text-sm text-text-main dark:text-slate-200 italic"
      >
        "{{ alt }}"
      </p>
    </div>

    <!-- Tips -->
    <div v-if="feedback.naturalness?.tips?.length" class="space-y-1">
      <p class="text-xs font-medium text-text-muted dark:text-slate-400">{{ t('feedback.tips') }}</p>
      <p
        v-for="(tip, i) in feedback.naturalness.tips"
        :key="i"
        class="text-sm text-text-main dark:text-slate-200"
      >
        {{ tip }}
      </p>
    </div>
  </div>
</template>
