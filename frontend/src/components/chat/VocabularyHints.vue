<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  hints: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div v-if="hints.length > 0" class="max-w-[calc(100vw-2rem)] sm:max-w-3xl">
    <div class="flex items-center gap-2 mb-3 px-1">
      <span class="material-symbols-outlined text-primary text-sm">auto_awesome</span>
      <span class="text-xs font-bold text-primary uppercase tracking-wider">{{ t('chat.tryUsing') }}</span>
    </div>
    <div class="flex gap-3 pb-2 overflow-x-auto sm:grid sm:grid-cols-3 sm:overflow-visible">
      <div
        v-for="hint in hints"
        :key="hint.word"
        class="flex flex-col p-3 sm:p-4 bg-white dark:bg-[#1e2930] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 w-48 sm:w-auto sm:shrink"
      >
        <div class="mb-2">
          <span class="font-bold text-primary text-lg">{{ hint.word }}</span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">{{ hint.description }}</p>
        <div class="mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
          <p class="text-xs italic text-text-main dark:text-slate-300">"{{ hint.example }}"</p>
        </div>
      </div>
    </div>
  </div>
</template>
