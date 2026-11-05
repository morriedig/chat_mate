<script setup>
// Practice hero card: surface, 20 px padding, and the notebook margin rule that marks
// the active learning task (DESIGN.md "Signature", "Practice hero")
defineProps({
  as: { type: String, default: 'section' },
})
</script>

<template>
  <component :is="as" class="relative space-y-4 rounded-[14px] border border-hairline bg-surface p-5 shadow-[var(--cm-shadow-small)]">
    <span class="absolute left-0 top-5 h-9 w-[3px] rounded-r-[3px] bg-accent" aria-hidden="true"></span>
    <slot />
  </component>
</template>
