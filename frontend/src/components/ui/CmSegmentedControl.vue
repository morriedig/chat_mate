<script setup>
// Rectangular segmented control (levels, ratings, settings choices)
defineProps({
  options: { type: Array, required: true }, // [{ value, label }]
  modelValue: { type: [String, Number], default: null },
  label: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div role="radiogroup" :aria-label="label || undefined" class="grid gap-1 rounded-[10px] bg-surface-raised p-1" :style="{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      role="radio"
      :aria-checked="opt.value === modelValue"
      @click="emit('update:modelValue', opt.value)"
      class="min-h-11 min-w-0 truncate rounded-[8px] px-2 text-caption font-medium"
      :class="opt.value === modelValue ? 'bg-surface text-accent border border-accent/30 shadow-[var(--cm-shadow-small)]' : 'text-ink-secondary border border-transparent'"
    >{{ opt.label }}</button>
  </div>
</template>
