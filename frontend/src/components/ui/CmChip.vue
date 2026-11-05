<script setup>
// Pattern chip / mission target (DESIGN.md "Chips")
defineProps({
  done: { type: Boolean, default: false },
})
</script>

<template>
  <span
    class="inline-flex max-w-full items-start gap-1 rounded-[6px] border px-2 py-1.5 text-caption font-medium break-words"
    :class="done ? 'bg-success-soft text-success border-success/25' : 'bg-surface-raised text-ink border-hairline'"
  >
    <span v-if="done" class="material-symbols-outlined !text-[18px]" aria-hidden="true">check</span>
    <span class="min-w-0"><slot /></span>
  </span>
</template>
