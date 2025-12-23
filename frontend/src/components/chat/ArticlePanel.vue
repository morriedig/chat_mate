<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  article: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="w-full lg:w-[500px] shrink-0 max-h-64 lg:max-h-none border-b lg:border-b-0 lg:border-r border-[#e7eff3] dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 overflow-y-auto">
    <h3 class="font-bold text-lg mb-2 text-text-main dark:text-white">{{ article.title }}</h3>
    <p class="text-sm text-text-main dark:text-slate-300 whitespace-pre-line mb-3">{{ article.content }}</p>
    <div class="mb-3">
      <span class="text-xs font-bold text-primary uppercase tracking-wider">{{ t('articles.keyWords') }}</span>
    </div>
    <div class="flex flex-wrap gap-2">
      <div v-for="item in article.vocabulary" :key="item.word" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
        <span class="font-semibold text-primary text-sm">{{ item.word }}</span>
        <span class="text-xs text-text-muted dark:text-slate-400 block">{{ item.definition }}</span>
      </div>
    </div>
  </div>
</template>
