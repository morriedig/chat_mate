<template>
  <span class="vocabulary-word-wrapper" @mouseenter="showPopup" @mouseleave="hidePopup">
    <span class="vocabulary-word">{{ word }}</span>
    <Transition name="popup">
      <div v-if="isVisible" class="vocabulary-popup" :class="popupPosition">
        <div class="popup-header">
          <span class="popup-word">{{ word }}</span>
        </div>
        <div class="popup-content">
          <div class="popup-section">
            <span class="popup-label">Definition</span>
            <p class="popup-text">{{ vocabularyData.definition }}</p>
          </div>
          <div v-if="vocabularyData.explanation" class="popup-section">
            <span class="popup-label">Explanation</span>
            <p class="popup-text">{{ vocabularyData.explanation }}</p>
          </div>
          <div v-if="vocabularyData.example" class="popup-section">
            <span class="popup-label">Example</span>
            <p class="popup-text popup-example">"{{ vocabularyData.example }}"</p>
          </div>
        </div>
      </div>
    </Transition>
  </span>
</template>

<script setup>
import { ref } from 'vue'

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

function showPopup() {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  isVisible.value = true
}

function hidePopup() {
  hideTimeout = setTimeout(() => {
    isVisible.value = false
  }, 100)
}
</script>

<style scoped>
.vocabulary-word-wrapper {
  position: relative;
  display: inline;
}

.vocabulary-word {
  background: linear-gradient(120deg, #a78bfa 0%, #8b5cf6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-weight: 600;
  cursor: help;
  border-bottom: 2px dotted #a78bfa;
  transition: all 0.2s ease;
}

.vocabulary-word:hover {
  border-bottom-style: solid;
}

.dark .vocabulary-word {
  background: linear-gradient(120deg, #c4b5fd 0%, #a78bfa 100%);
  background-clip: text;
  -webkit-background-clip: text;
  border-bottom-color: #c4b5fd;
}

.vocabulary-popup {
  position: absolute;
  z-index: 1000;
  min-width: 280px;
  max-width: 350px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  left: 50%;
  transform: translateX(-50%);
}

.vocabulary-popup.bottom {
  top: calc(100% + 8px);
}

.vocabulary-popup.top {
  bottom: calc(100% + 8px);
}

.dark .vocabulary-popup {
  background: #1f2937;
  border-color: #374151;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3);
}

.popup-header {
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.dark .popup-header {
  border-bottom-color: #374151;
}

.popup-word {
  font-size: 1.1rem;
  font-weight: 700;
  color: #7c3aed;
}

.dark .popup-word {
  color: #a78bfa;
}

.popup-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popup-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.popup-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
}

.dark .popup-label {
  color: #6b7280;
}

.popup-text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #374151;
}

.dark .popup-text {
  color: #d1d5db;
}

.popup-example {
  font-style: italic;
  color: #6b7280;
}

.dark .popup-example {
  color: #9ca3af;
}

/* Transition animations */
.popup-enter-active,
.popup-leave-active {
  transition: all 0.2s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}

.popup-enter-to,
.popup-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>
