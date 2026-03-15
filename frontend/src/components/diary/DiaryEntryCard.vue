<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  entry: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])

const dateFormatted = computed(() => {
  const date = new Date(props.entry.createdAt)
  const lang = props.entry.language
  return date.toLocaleDateString(
    lang === 'ja' ? 'ja-JP' : lang === 'zh' ? 'zh-TW' : 'en-US',
    { month: 'short', day: 'numeric', weekday: 'short' }
  )
})

const previewText = computed(() => {
  const text = props.entry.title || ''
  // Show first ~80 chars, truncated
  return text.length > 80 ? text.slice(0, 80) + '...' : text
})

const feedbackBadge = computed(() => {
  switch (props.entry.feedbackStatus) {
    case 'done':
      return { label: 'Reviewed', class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' }
    case 'loading':
      return { label: 'Reviewing...', class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' }
    case 'pending':
      return { label: 'Pending', class: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' }
    case 'error':
      return { label: 'Error', class: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' }
    default:
      return null
  }
})

const isCJK = computed(() => ['ja', 'zh'].includes(props.entry.language))

const countLabel = computed(() => {
  if (isCJK.value) {
    return t('diary.charCount', { count: props.entry.wordCount || 0 })
  }
  return t('diary.wordCount', { count: props.entry.wordCount || 0 })
})
</script>

<template>
  <button
    @click="emit('select', entry)"
    class="w-full text-left p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary/30 dark:hover:border-primary/30 transition-all active:scale-[0.99]"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <!-- Date -->
        <p class="text-xs font-medium text-text-muted dark:text-slate-400 mb-1">{{ dateFormatted }}</p>
        <!-- Preview text -->
        <p class="text-sm text-text-main dark:text-slate-200 leading-relaxed line-clamp-2">{{ previewText }}</p>
        <!-- Word count -->
        <p class="text-xs text-text-muted dark:text-slate-500 mt-1.5">{{ countLabel }}</p>
      </div>
      <!-- Feedback badge -->
      <div class="shrink-0 flex flex-col items-end gap-2">
        <span
          v-if="feedbackBadge"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium"
          :class="feedbackBadge.class"
        >
          {{ feedbackBadge.label }}
        </span>
        <span class="material-symbols-outlined text-[18px] text-slate-300 dark:text-slate-600">chevron_right</span>
      </div>
    </div>
  </button>
</template>
