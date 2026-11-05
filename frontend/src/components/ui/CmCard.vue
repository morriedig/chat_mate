<script setup>
// Base card; `marked` adds the notebook margin rule used for the active task (DESIGN.md "Signature")
defineProps({
  marked: { type: Boolean, default: false },
  hero: { type: Boolean, default: false },
  as: { type: String, default: 'div' },
})
</script>

<template>
  <component
    :is="as"
    class="relative rounded-[14px] border border-hairline shadow-[var(--cm-shadow-small)]"
    :class="[marked ? 'bg-accent-soft' : 'bg-surface', hero ? 'p-5' : 'p-4']"
  >
    <span v-if="marked" class="absolute left-0 top-4 h-9 w-[3px] rounded-r-[3px] bg-accent" aria-hidden="true"></span>
    <slot />
  </component>
</template>
