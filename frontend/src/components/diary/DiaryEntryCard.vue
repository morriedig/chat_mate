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

// Status is plain meta text: icon + label, semantic color only for warning/error/success
const feedbackBadge = computed(() => {
  switch (props.entry.feedbackStatus) {
    case 'done':
      return { label: t('diary.status.reviewed'), icon: 'check', class: 'text-success' }
    case 'loading':
      return { label: t('diary.status.reviewing'), icon: 'schedule', class: 'text-ink-muted' }
    case 'pending':
      return { label: t('diary.status.pending'), icon: 'wifi_off', class: 'text-warning' }
    case 'error':
      return { label: t('diary.status.error'), icon: 'error', class: 'text-error' }
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
  <!-- 72 px grouped-list row (the parent draws the group and dividers) -->
  <button
    type="button"
    @click="emit('select', entry)"
    data-testid="diary-entry-card"
    class="flex min-h-[72px] w-full items-center gap-3 px-4 py-3 text-left active:bg-surface-raised"
  >
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-meta">
        <span data-testid="entry-date" class="text-ink-secondary">{{ dateFormatted }}</span>
        <span data-testid="entry-word-count" class="tabular-nums text-ink-muted">{{ countLabel }}</span>
        <span
          v-if="entry.rewriteOf"
          data-testid="rewrite-badge"
          class="inline-flex items-center gap-0.5 text-ink-muted"
        >
          <span class="material-symbols-outlined !text-[14px]" aria-hidden="true">edit_note</span>
          {{ t('diary.rewriteOf') }}
        </span>
        <span
          v-if="feedbackBadge"
          data-testid="feedback-badge"
          class="inline-flex items-center gap-0.5"
          :class="feedbackBadge.class"
        >
          <span class="material-symbols-outlined !text-[14px]" aria-hidden="true">{{ feedbackBadge.icon }}</span>
          {{ feedbackBadge.label }}
        </span>
      </div>
      <p data-testid="entry-preview" class="mt-0.5 line-clamp-2 break-words text-caption text-ink">{{ previewText }}</p>
    </div>
    <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">chevron_right</span>
  </button>
</template>
