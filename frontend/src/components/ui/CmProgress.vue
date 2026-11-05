<script setup>
import { computed } from 'vue'

// 4 px track; the bar scales with transform, never width (DESIGN.md "Progress")
const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 1 },
  label: { type: String, default: '' },
})
const ratio = computed(() => (props.max > 0 ? Math.min(1, Math.max(0, props.value / props.max)) : 0))
</script>

<template>
  <div class="h-1 w-full overflow-hidden bg-surface-raised" role="progressbar" :aria-valuenow="value" :aria-valuemax="max" :aria-label="label || undefined">
    <div
      class="h-full w-full origin-left rounded-r-[2px] bg-accent transition-transform duration-[180ms] ease-[var(--ease-cm)]"
      :style="{ transform: `scaleX(${ratio})` }"
    ></div>
  </div>
</template>
