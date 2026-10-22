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
  <div class="flex items-center gap-2 px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-amber-50/70 dark:bg-amber-900/10">
    <span class="material-symbols-outlined text-[18px] text-amber-500 shrink-0" :title="t('opinionChat.hintsLabel')">lightbulb</span>
    <div class="flex flex-1 gap-2 overflow-x-auto no-scrollbar min-w-0" role="list" :aria-label="t('opinionChat.hintsLabel')">
      <button
        v-for="hint in hints"
        :key="hint.id"
        type="button"
        role="listitem"
        @click="emit('insert', hint)"
        class="connector-hint shrink-0 inline-flex items-baseline gap-1 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 bg-surface-light dark:bg-surface-dark hover:border-amber-400 dark:hover:border-amber-600 active:scale-95 transition-all"
      >
        <span class="text-xs sm:text-sm font-semibold text-text-main dark:text-slate-100 whitespace-nowrap">{{ hint.label }}</span>
        <span v-if="hint.meaning" class="text-[11px] text-text-muted dark:text-slate-400 whitespace-nowrap">{{ hint.meaning }}</span>
      </button>
    </div>
    <button
      type="button"
      @click="emit('dismiss')"
      class="shrink-0 flex items-center justify-center size-7 rounded-full text-text-muted dark:text-slate-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
      :aria-label="t('opinionChat.hideHints')"
    >
      <span class="material-symbols-outlined text-[16px]">close</span>
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
