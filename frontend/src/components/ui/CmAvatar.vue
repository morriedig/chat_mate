<script setup>
import { computed } from 'vue'

// Monogram tile for an AI friend (replaces emoji avatars; DESIGN.md "Avatar treatment")
const props = defineProps({
  name: { type: String, required: true },
  // 32 in messages, 40 in headers, 48 in sheets
  size: { type: Number, default: 40 },
})
const initial = computed(() => (props.name || '?').trim().charAt(0).toUpperCase())
const fontSize = computed(() => Math.round(props.size * 0.42))
</script>

<template>
  <span
    role="img"
    :aria-label="name"
    class="inline-flex shrink-0 items-center justify-center rounded-[10px] bg-accent-soft text-accent font-medium border border-accent/20 select-none"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${fontSize}px` }"
  >{{ initial }}</span>
</template>
