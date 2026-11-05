<template>
  <span
    class="vocabulary-word-wrapper"
    @mouseenter="showPopup"
    @mouseleave="hidePopup"
  >
    <span
      class="vocabulary-word"
      role="button"
      tabindex="0"
      :aria-expanded="isVisible"
      @click="togglePopup"
      @keydown.enter.prevent="togglePopup"
      @keydown.space.prevent="togglePopup"
      @keydown.esc="isVisible = false"
    >{{ word }}</span>
    <Transition name="popup">
      <span v-if="isVisible" class="vocabulary-popup" :class="popupPosition" role="tooltip">
        <span class="popup-header">
          <span class="popup-word">{{ word }}</span>
        </span>
        <span class="popup-content">
          <span class="popup-section">
            <span class="popup-label">{{ t('vocabPopup.definition') }}</span>
            <span class="popup-text">{{ vocabularyData.definition }}</span>
          </span>
          <span v-if="vocabularyData.explanation" class="popup-section">
            <span class="popup-label">{{ t('vocabPopup.explanation') }}</span>
            <span class="popup-text">{{ vocabularyData.explanation }}</span>
          </span>
          <span v-if="vocabularyData.example" class="popup-section">
            <span class="popup-label">{{ t('vocabPopup.example') }}</span>
            <span class="popup-text popup-example">“{{ vocabularyData.example }}”</span>
          </span>
        </span>
      </span>
    </Transition>
  </span>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  word: {
    type: String,
    required: true
  },
  vocabularyData: {
    type: Object,
    required: true
  },
  popupPosition: {
    type: String,
    default: 'bottom'
  }
})

const isVisible = ref(false)
let hideTimeout = null
// A tap fires mouseenter right before click; don't let that click close it again
let shownAt = 0

function showPopup() {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  if (!isVisible.value) shownAt = Date.now()
  isVisible.value = true
}

function hidePopup() {
  hideTimeout = setTimeout(() => {
    isVisible.value = false
  }, 100)
}

// Touch and keyboard: tap or Enter opens and closes the definition
function togglePopup() {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  if (isVisible.value && Date.now() - shownAt < 400) return
  isVisible.value = !isVisible.value
  if (isVisible.value) shownAt = Date.now()
}
</script>

<style scoped>
.vocabulary-word-wrapper {
  position: relative;
  display: inline;
}

/* Accent text with a dotted rule; the rule turns solid on press/focus */
.vocabulary-word {
  color: var(--cm-accent);
  font-weight: 500;
  cursor: pointer;
  border-bottom: 1px dotted var(--cm-accent);
  border-radius: 2px;
  transition: border-color var(--motion-micro) var(--ease-cm);
}

.vocabulary-word:hover,
.vocabulary-word:active,
.vocabulary-word:focus-visible,
.vocabulary-word[aria-expanded="true"] {
  border-bottom-style: solid;
}

.vocabulary-popup {
  position: absolute;
  z-index: 60;
  display: block;
  width: 280px;
  max-width: calc(100vw - 32px);
  padding: 16px;
  background: var(--cm-surface);
  border-radius: 10px;
  box-shadow: var(--cm-shadow-float);
  border: 1px solid var(--cm-border);
  left: 50%;
  transform: translateX(-50%);
  text-align: left;
}

.vocabulary-popup.bottom {
  top: calc(100% + 8px);
}

.vocabulary-popup.top {
  bottom: calc(100% + 8px);
}

/* Phones: pin the definition to the bottom edge instead of following the word */
@media (max-width: 639px) {
  .vocabulary-popup,
  .vocabulary-popup.bottom,
  .vocabulary-popup.top {
    position: fixed;
    top: auto;
    left: 16px;
    right: 16px;
    bottom: max(16px, env(safe-area-inset-bottom));
    width: auto;
    max-width: none;
    transform: none;
  }
}

.popup-header {
  display: block;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--cm-border);
}

.popup-word {
  font-size: 1.0625rem;
  line-height: 1.5rem;
  font-weight: 500;
  color: var(--cm-text-primary);
}

.popup-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popup-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.popup-label {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  color: var(--cm-text-muted);
}

.popup-text {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: var(--cm-text-primary);
}

.popup-example {
  color: var(--cm-text-secondary);
}

/* Fade + 4 px rise only */
.popup-enter-active,
.popup-leave-active {
  transition: opacity 180ms var(--ease-cm), translate 180ms var(--ease-cm);
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  translate: 0 4px;
}
</style>
