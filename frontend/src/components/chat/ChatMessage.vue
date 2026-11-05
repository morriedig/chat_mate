<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FeedbackPanel from './FeedbackPanel.vue'
import CmAvatar from '../ui/CmAvatar.vue'
import { splitByConnectors } from '../../utils/connectorDetect'

const { t } = useI18n()

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  character: {
    type: Object,
    required: true
  },
  // Connector targets to highlight in user messages (opinion chat)
  highlightTargets: {
    type: Array,
    default: null
  },
  // Voice conversation: hide the friend's reply behind text bars until tapped (listen first)
  hideText: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['explain', 'word-tap', 'reveal'])

const showFeedback = ref(false)

const userSegments = computed(() => {
  if (props.message.role !== 'user' || !props.highlightTargets) return null
  return splitByConnectors(props.message.content, props.highlightTargets)
})

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
  <!-- Friend message -->
  <div v-if="message.role === 'assistant'" class="chat-turn flex items-end gap-2">
    <CmAvatar :name="character.name" :size="32" />
    <div class="flex min-w-0 max-w-[82%] min-[390px]:max-w-[78%] flex-col items-start gap-1 sm:max-w-xl">
      <span class="ml-1 text-meta text-ink-muted">{{ character.name }}</span>
      <div class="min-w-0 max-w-full rounded-[14px] rounded-bl-[6px] border border-hairline bg-surface px-3.5 py-2.5 text-ink shadow-[var(--cm-shadow-small)]">
        <button
          v-if="hideText"
          type="button"
          @click="emit('reveal')"
          class="hidden-reply block w-48 max-w-full text-left"
        >
          <span class="flex flex-col gap-2 py-1.5" aria-hidden="true">
            <span class="h-2.5 w-full rounded-[3px] bg-surface-raised"></span>
            <span class="h-2.5 w-11/12 rounded-[3px] bg-surface-raised"></span>
            <span class="h-2.5 w-3/5 rounded-[3px] bg-surface-raised"></span>
          </span>
          <span class="mt-2 inline-flex items-center gap-1 text-caption font-medium text-accent">
            <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">visibility</span>{{ t('voiceChat.listenFirst') }}
          </span>
        </button>
        <p v-else class="clickable-words whitespace-pre-wrap break-words overflow-wrap-anywhere text-body" @click="handleWordClick">{{ message.content }}</p>
      </div>
    </div>
  </div>

  <!-- User message: alignment shows authorship, so no label or avatar -->
  <div v-else class="chat-turn flex justify-end">
    <div class="flex min-w-0 max-w-[82%] min-[390px]:max-w-[78%] flex-col items-end gap-1 sm:max-w-xl">
      <div class="user-bubble min-w-0 max-w-full rounded-[14px] rounded-br-[6px] bg-accent-soft px-3.5 py-2.5 text-ink">
        <p v-if="userSegments" class="whitespace-pre-wrap break-words text-body"><template v-for="(seg, i) in userSegments" :key="i"><span
          v-if="seg.id"
          class="connector-mark border-b-2 border-accent font-medium"
          :data-connector="seg.id"
        >{{ seg.text }}</span><template v-else>{{ seg.text }}</template></template></p>
        <p v-else class="whitespace-pre-wrap break-words text-body">{{ message.content }}</p>
      </div>

      <!-- Feedback toggle -->
      <button
        type="button"
        @click="toggleFeedback"
        class="explain-toggle -my-1 inline-flex min-h-11 items-center gap-1 rounded-[10px] px-1 text-meta"
        :class="showFeedback ? 'text-accent' : 'text-ink-muted'"
        :aria-expanded="showFeedback"
      >
        <span class="material-symbols-outlined !text-[16px]" aria-hidden="true">{{ showFeedback ? 'expand_less' : 'spellcheck' }}</span>
        {{ t('feedback.explain') }}
      </button>

      <!-- Feedback Panel -->
      <FeedbackPanel
        v-if="showFeedback"
        :feedback="message.feedback"
        :loading="message.feedbackLoading"
        :error="message.feedbackError"
        @retry="emit('explain', message)"
      />
    </div>
  </div>
</template>
