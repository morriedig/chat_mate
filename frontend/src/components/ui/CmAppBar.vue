<script setup>
// 56 px bar + safe area, back button, title, optional subtitle, right slot (DESIGN.md "App bar")
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  backLabel: { type: String, default: 'Back' },
  showBack: { type: Boolean, default: true },
})
const emit = defineEmits(['back'])
</script>

<template>
  <header class="safe-area-top relative z-10 shrink-0 border-b border-hairline bg-surface">
    <div class="flex min-h-14 items-center gap-1 px-1">
      <button v-if="showBack" type="button" @click="emit('back')" :aria-label="backLabel" class="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-ink active:bg-surface-raised">
        <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
      </button>
      <slot name="leading" />
      <div class="min-w-0 flex-1 px-1">
        <h1 class="truncate text-title font-medium text-ink">{{ title }}</h1>
        <p v-if="subtitle" class="truncate text-meta text-ink-muted tabular-nums">{{ subtitle }}</p>
      </div>
      <div class="flex shrink-0 items-center"><slot name="actions" /></div>
    </div>
    <slot name="below" />
  </header>
</template>
