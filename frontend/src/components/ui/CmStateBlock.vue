<script setup>
// Empty / error block: icon tile, sentence, one action (DESIGN.md "Loading, empty, and error states")
defineProps({
  kind: { type: String, default: 'empty' }, // empty | error
  icon: { type: String, default: 'menu_book' },
  title: { type: String, required: true },
  body: { type: String, default: '' },
  action: { type: String, default: '' },
})
const emit = defineEmits(['action'])
</script>

<template>
  <div class="flex flex-col items-center gap-3 rounded-[14px] p-6 text-center" :class="kind === 'error' ? 'bg-error-soft' : ''" :role="kind === 'error' ? 'alert' : undefined">
    <span class="flex size-16 items-center justify-center rounded-[14px]" :class="kind === 'error' ? 'bg-surface text-error' : 'bg-accent-soft text-accent'">
      <span class="material-symbols-outlined !text-[32px]" aria-hidden="true">{{ kind === 'error' ? 'error' : icon }}</span>
    </span>
    <p class="text-title font-medium text-ink">{{ title }}</p>
    <p v-if="body" class="text-caption text-ink-secondary">{{ body }}</p>
    <button v-if="action" type="button" @click="emit('action')" class="min-h-11 rounded-[10px] px-4 text-body font-medium" :class="kind === 'error' ? 'bg-surface text-ink border border-hairline' : 'bg-accent text-on-accent'">{{ action }}</button>
  </div>
</template>
