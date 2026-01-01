<script setup>
import { toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useArticleParser } from '../../composables/useArticleParser'
import VocabularyWord from './VocabularyWord.vue'

const { t } = useI18n()

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

// Use composable for parsing (SRP: parsing logic is separated)
const { contentSegments } = useArticleParser(toRef(props, 'article'))
</script>

<template>
  <div class="w-full lg:w-[500px] shrink-0 max-h-64 lg:max-h-none border-b lg:border-b-0 lg:border-r border-[#e7eff3] dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 overflow-y-auto">
    <h3 class="font-bold text-lg mb-3 text-text-main dark:text-white">{{ article.title }}</h3>

    <!-- Article Content with Vocabulary Highlights -->
    <div class="text-sm text-text-main dark:text-slate-300 leading-relaxed mb-4">
      <template v-for="(segment, index) in contentSegments" :key="index">
        <span v-if="segment.type === 'text'">{{ segment.content }}</span>
        <br v-else-if="segment.type === 'break'" />
        <VocabularyWord
          v-else-if="segment.type === 'vocab'"
          :word="segment.word"
          :vocabulary-data="segment.data"
        />
      </template>
    </div>

    <!-- Vocabulary List -->
    <div class="mb-3">
      <span class="text-xs font-bold text-primary uppercase tracking-wider">{{ t('articles.keyWords') }}</span>
    </div>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="item in article.vocabulary"
        :key="item.word"
        class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
      >
        <span class="font-semibold text-primary text-sm">{{ item.word }}</span>
        <span class="text-xs text-text-muted dark:text-slate-400 block">{{ item.definition }}</span>
      </div>
    </div>
  </div>
</template>
