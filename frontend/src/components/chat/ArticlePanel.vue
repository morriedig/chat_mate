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
  },
  // Phones show the article in a full-height sheet; wide screens use a split view
  inSheet: {
    type: Boolean,
    default: false
  }
})

// Use composable for parsing (SRP: parsing logic is separated)
const { contentSegments } = useArticleParser(toRef(props, 'article'))
</script>

<template>
  <div
    class="article-panel overflow-y-auto bg-surface"
    :class="inSheet ? 'h-full px-5 pt-4 pb-[max(24px,env(safe-area-inset-bottom))]' : 'w-[460px] shrink-0 border-r border-hairline p-6 xl:w-[500px]'"
  >
    <h2 class="mb-3 text-section font-medium text-ink">{{ article.title }}</h2>

    <!-- Article content with vocabulary highlights -->
    <div class="mb-6 text-body text-ink">
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

    <!-- Key words -->
    <h3 class="mb-2 text-caption font-medium text-ink-secondary">{{ t('articles.keyWords') }}</h3>
    <ul class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline">
      <li
        v-for="item in article.vocabulary"
        :key="item.word"
        class="article-keyword bg-surface px-3.5 py-2.5"
      >
        <span class="block text-body font-medium text-ink">{{ item.word }}</span>
        <span class="block text-caption text-ink-secondary">{{ item.definition }}</span>
      </li>
    </ul>
  </div>
</template>
