<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { articles } from '../data/articles.js'
import { stripMarkers } from '../composables/useArticleParser'

const { t, locale } = useI18n()
const emit = defineEmits(['select', 'back'])
const props = defineProps({
  level: Object
})

// Get articles for current language
const currentArticles = computed(() => {
  const lang = locale.value || 'en'
  return articles[lang] || articles.en || []
})

// Get articles filtered by level
const filteredArticles = computed(() => {
  if (!props.level) return []

  return currentArticles.value.map(article => {
    const levelData = article.levels[props.level.id]
    if (!levelData) return null

    return {
      id: article.id,
      topic_id: article.topic_id,
      levelId: props.level.id,
      title: levelData.title,
      content: levelData.content,
      ai_opening_line: levelData.ai_opening_line,
      vocabulary: levelData.vocabulary
    }
  }).filter(Boolean)
})

function selectArticle(article) {
  emit('select', article)
}

// Get plain text preview (strip [[word]] markers)
function getPreviewText(content) {
  return stripMarkers(content).substring(0, 120)
}
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <!-- Header -->
    <header class="sticky top-0 z-10 flex items-center gap-4 px-4 sm:px-6 py-4 bg-surface-light dark:bg-surface-dark border-b border-[#e7eff3] dark:border-slate-800 shadow-sm">
      <button @click="emit('back')" class="flex items-center justify-center">
        <span class="material-symbols-outlined text-text-main dark:text-white cursor-pointer">arrow_back</span>
      </button>
      <h1 class="text-lg font-bold text-text-main dark:text-white">{{ t('articles.title') }}</h1>
    </header>

    <!-- Level Indicator -->
    <div class="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-900 border-b border-[#e7eff3] dark:border-slate-800">
      <span class="text-sm text-text-muted dark:text-slate-400">
        {{ t('articles.levelLabel') }}:
      </span>
      <span class="ml-2 text-sm px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium">
        {{ t(`levels.${level.id}.name`) }}
      </span>
    </div>

    <!-- Articles List -->
    <div class="p-4 sm:p-6 max-w-3xl mx-auto">
      <div class="grid gap-4">
        <div
          v-for="article in filteredArticles"
          :key="article.id"
          @click="selectArticle(article)"
          class="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
        >
          <!-- Title -->
          <h3 class="font-bold text-lg text-text-main dark:text-white mb-2">{{ article.title }}</h3>

          <!-- Preview -->
          <p class="text-sm text-text-muted dark:text-slate-400 mb-4 line-clamp-2">{{ getPreviewText(article.content) }}...</p>

          <!-- Vocabulary -->
          <div class="flex flex-wrap gap-2">
            <span class="text-xs text-text-muted dark:text-slate-500">{{ t('articles.keyWords') }}:</span>
            <span
              v-for="item in article.vocabulary.slice(0, 3)"
              :key="item.word"
              class="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium"
              :title="item.definition"
            >
              {{ item.word }}
            </span>
          </div>
        </div>

        <!-- No articles -->
        <div v-if="filteredArticles.length === 0" class="text-center py-12">
          <span class="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">article</span>
          <p class="text-text-muted dark:text-slate-400">{{ t('articles.noArticles') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
