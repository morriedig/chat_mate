<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FeedbackPanel from './FeedbackPanel.vue'

const { t } = useI18n()

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  character: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['explain', 'word-tap'])

const showFeedback = ref(false)

function handleWordClick(event) {
  // Use caretRangeFromPoint to find the word at click position
  let range
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY)
  } else if (document.caretPositionFromPoint) {
    const pos = document.caretPositionFromPoint(event.clientX, event.clientY)
    if (pos) {
      range = document.createRange()
      range.setStart(pos.offsetNode, pos.offset)
      range.setEnd(pos.offsetNode, pos.offset)
    }
  }
  if (!range || range.startContainer.nodeType !== Node.TEXT_NODE) return

  const text = range.startContainer.textContent
  const offset = range.startOffset
  if (offset >= text.length) return

  const isCJK = /[\u3000-\u9fff\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/.test(text[offset])

  let word
  if (isCJK) {
    // For CJK: capture the single character (CJK languages don't use spaces)
    word = text[offset]
  } else {
    // For Latin/etc: expand to word boundaries
    let start = offset
    let end = offset
    const wordChar = /[\w'-]/
    while (start > 0 && wordChar.test(text[start - 1])) start--
    while (end < text.length && wordChar.test(text[end])) end++
    word = text.slice(start, end).trim()
    if (word.length < 2) return
  }

  if (!word) return

  emit('word-tap', {
    word,
    context: props.message.content.slice(0, 200),
    position: { x: event.clientX, y: event.clientY + 10 }
  })
}

function toggleFeedback() {
  if (!showFeedback.value) {
    // Opening: request feedback if not already loaded or loading
    if (!props.message.feedback && !props.message.feedbackLoading) {
      emit('explain', props.message)
    }
    showFeedback.value = true
  } else {
    // Closing: allow retry on next open if there was an error
    showFeedback.value = false
  }
}
</script>

<template>
  <!-- Bot Message -->
  <div v-if="message.role === 'assistant'" class="flex items-end gap-2 sm:gap-3 max-w-[calc(100%-2.5rem)] sm:max-w-3xl">
    <div class="flex items-center justify-center rounded-full size-8 sm:size-10 shrink-0 shadow-sm bg-slate-100 dark:bg-slate-800 text-xl sm:text-2xl">
      {{ character.avatar }}
    </div>
    <div class="flex flex-col gap-1 items-start min-w-0 overflow-hidden">
      <span class="text-text-muted dark:text-slate-400 text-[13px] font-medium ml-1">{{ character.name }}</span>
      <div class="p-3 sm:p-4 rounded-2xl rounded-bl-none bg-surface-light dark:bg-surface-dark text-text-main dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700">
        <p class="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere clickable-words" @click="handleWordClick">{{ message.content }}</p>
      </div>
    </div>
  </div>

  <!-- User Message -->
  <div v-else class="flex items-end gap-2 sm:gap-3 justify-end">
    <div class="flex flex-col gap-1 items-end min-w-0 max-w-[80%] sm:max-w-xl">
      <span class="text-text-muted dark:text-slate-400 text-[13px] font-medium mr-1">{{ t('feedback.you') }}</span>
      <div class="p-3 sm:p-4 rounded-2xl rounded-br-none bg-primary text-[#0d171b] shadow-md">
        <p class="text-sm sm:text-base leading-relaxed font-medium whitespace-pre-wrap break-words">{{ message.content }}</p>
      </div>

      <!-- Explain Button -->
      <button
        @click="toggleFeedback"
        class="flex items-center gap-1 mt-0.5 mr-1 text-xs transition-colors"
        :class="showFeedback
          ? 'text-primary'
          : 'text-text-muted dark:text-slate-500 hover:text-primary dark:hover:text-primary'"
      >
        <span class="material-symbols-outlined text-sm">lightbulb</span>
        {{ t('feedback.explain') }}
      </button>

      <!-- Feedback Panel -->
      <FeedbackPanel
        v-if="showFeedback"
        :feedback="message.feedback"
        :loading="message.feedbackLoading"
        :error="message.feedbackError"
      />
    </div>
    <div class="flex items-center justify-center rounded-full size-8 sm:size-10 shrink-0 shadow-sm bg-primary/20 text-xl sm:text-2xl">
      👤
    </div>
  </div>
</template>
