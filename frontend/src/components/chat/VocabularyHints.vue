<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  hints: {
    type: Array,
    required: true
  }
})

// A quiet row of words; tapping one shows its meaning and example underneath
const openWord = ref(null)
const openHint = computed(() => props.hints.find(h => h.word === openWord.value) || null)

function toggle(word) {
  openWord.value = openWord.value === word ? null : word
}

watch(() => props.hints, () => { openWord.value = null })
</script>

<template>
  <div v-if="hints.length > 0" class="vocab-hints shrink-0 border-t border-hairline bg-surface pt-1">
    <div class="flex items-center gap-2 pl-4 sm:pl-6">
      <span class="shrink-0 text-meta text-ink-muted">{{ t('chat.tryUsing') }}</span>
      <div class="no-scrollbar flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-1 pr-4" role="list" :aria-label="t('chat.tryUsing')">
        <button
          v-for="hint in hints"
          :key="hint.word"
          type="button"
          role="listitem"
          @click="toggle(hint.word)"
          :aria-expanded="openWord === hint.word"
          class="vocab-hint inline-flex min-h-11 max-w-[14rem] shrink-0 items-center rounded-[6px] border px-2 text-caption font-medium"
          :class="openWord === hint.word ? 'border-accent/30 bg-accent-soft text-accent' : 'border-hairline bg-surface-raised text-ink active:bg-surface-sunken'"
        ><span class="truncate">{{ hint.word }}</span></button>
      </div>
      <div v-if="$slots.trailing" class="flex shrink-0 items-center border-l border-hairline pr-1 sm:pr-3">
        <slot name="trailing" />
      </div>
    </div>
    <div v-if="openHint" class="vocab-hint-detail mx-4 mb-2 max-h-32 overflow-y-auto rounded-[10px] bg-surface-sunken px-3 py-2 sm:mx-6" role="region" :aria-label="openHint.word">
      <p class="break-words text-caption text-ink-secondary">{{ openHint.description }}</p>
      <p v-if="openHint.example" class="mt-1 text-caption text-ink [overflow-wrap:anywhere]">“{{ openHint.example }}”</p>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar {
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
