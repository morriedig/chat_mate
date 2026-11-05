<script setup>
// Bottom sheet on phones, centered panel from sm up (DESIGN.md "Bottom sheets")
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  closeLabel: { type: String, default: 'Close' },
})
const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" :aria-label="title">
      <div class="absolute inset-0 bg-[var(--cm-scrim)]" @click="emit('close')"></div>
      <div class="cm-sheet relative flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-[24px] bg-surface shadow-[var(--cm-shadow-float)] sm:max-w-[520px] sm:rounded-[20px]">
        <div class="flex items-start gap-3 px-5 pt-5">
          <slot name="leading" />
          <div class="min-w-0 flex-1">
            <h2 class="text-title font-medium text-ink">{{ title }}</h2>
            <p v-if="description" class="text-caption text-ink-muted">{{ description }}</p>
          </div>
          <button type="button" @click="emit('close')" :aria-label="closeLabel" class="-mr-2 -mt-2 inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-ink-secondary active:bg-surface-raised">
            <span class="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-4"><slot /></div>
        <div v-if="$slots.actions" class="border-t border-hairline px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]"><slot name="actions" /></div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.cm-sheet {
  animation: cm-sheet-in var(--motion-sheet) var(--ease-cm) both;
}
@keyframes cm-sheet-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
