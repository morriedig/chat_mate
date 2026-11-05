<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Quiet confirmation after a small win. The `type` values are kept for callers
// ('sparkle' | 'confetti' | 'check'); all render the same static check mark —
// no confetti, sparkles or pop (DESIGN.md "Motion behavior").
defineProps({
  type: {
    type: String,
    default: 'sparkle',
  }
})

const emit = defineEmits(['done'])
const visible = ref(true)
let timer = null

onMounted(() => {
  timer = setTimeout(() => {
    visible.value = false
    emit('done')
  }, 1200)
})

onBeforeUnmount(() => clearTimeout(timer))

// Vibrate on mobile if supported (must be in onMounted for SSR safety)
onMounted(() => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(50)
  }
})
</script>

<template>
  <Transition name="reward" appear>
    <div v-if="visible" class="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center" aria-hidden="true">
      <div class="flex size-16 items-center justify-center rounded-[14px] border border-success/25 bg-success-soft shadow-[var(--cm-shadow-float)]">
        <span class="material-symbols-outlined !text-[32px] text-success">task_alt</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.reward-enter-active,
.reward-leave-active {
  transition: opacity var(--motion-control) var(--ease-cm);
}
.reward-enter-from,
.reward-leave-to {
  opacity: 0;
}
</style>
