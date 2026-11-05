<script setup>
// primary | secondary | quiet (DESIGN.md "Buttons")
defineProps({
  variant: { type: String, default: 'primary' },
  block: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center gap-2 rounded-[10px] text-body font-medium disabled:cursor-not-allowed"
    :class="[
      block ? 'w-full' : '',
      variant === 'primary' && 'min-h-12 px-4 bg-accent text-on-accent active:bg-accent-pressed disabled:bg-accent-disabled disabled:opacity-55',
      variant === 'secondary' && 'min-h-12 px-4 bg-surface-raised text-ink border border-hairline active:bg-surface-sunken disabled:opacity-55',
      variant === 'quiet' && 'min-h-11 px-2 bg-transparent text-accent disabled:text-ink-muted',
    ]"
  ><slot /></button>
</template>
