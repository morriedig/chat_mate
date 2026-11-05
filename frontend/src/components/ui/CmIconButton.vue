<script setup>
// 44 × 44 icon-only control with an accessible name
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
})
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    class="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-ink-secondary active:bg-surface-raised disabled:opacity-55"
  ><span class="material-symbols-outlined" aria-hidden="true">{{ icon }}</span></button>
</template>
