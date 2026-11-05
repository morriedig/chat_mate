<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  // [{ id, label, insert, meaning }]
  hints: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['insert', 'dismiss'])
</script>

<template>
  <div class="connector-hint-strip flex shrink-0 items-center gap-2 border-t border-hairline bg-surface pl-4 pr-1 pt-1 sm:pl-6">
    <span class="shrink-0 text-meta text-ink-muted">{{ t('opinionChat.hintsLabel') }}</span>
    <div class="no-scrollbar flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-1" role="list" :aria-label="t('opinionChat.hintsLabel')">
      <button
        v-for="hint in hints"
        :key="hint.id"
        type="button"
        role="listitem"
        @click="emit('insert', hint)"
        class="connector-hint inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-[6px] border border-hairline bg-surface-raised px-2 active:bg-surface-sunken"
      >
        <span class="whitespace-nowrap text-caption font-medium text-ink">{{ hint.label }}</span>
        <span v-if="hint.meaning" class="whitespace-nowrap text-meta text-ink-muted">{{ hint.meaning }}</span>
      </button>
    </div>
    <button
      type="button"
      @click="emit('dismiss')"
      class="flex size-11 shrink-0 items-center justify-center rounded-[10px] text-ink-muted active:bg-surface-raised"
      :aria-label="t('opinionChat.hideHints')"
    >
      <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">close</span>
    </button>
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
