<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { articles, articleCategories } from '../data/articles.js'

const { t } = useI18n()
const emit = defineEmits(['select', 'back'])
const props = defineProps({
  level: Object
})

const selectedCategory = ref('all')

const filteredArticles = computed(() => {
  let result = articles

  // Filter by level
  if (props.level) {
    result = result.filter(a => a.level === props.level.id)
  }

  // Filter by category
  if (selectedCategory.value !== 'all') {
    result = result.filter(a => a.category === selectedCategory.value)
  }

  return result
})

function selectArticle(article) {
  emit('select', article)
}

function getCategoryIcon(category) {
  const cat = articleCategories.find(c => c.id === category)
  return cat ? cat.icon : ''
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

    <!-- Category Tabs -->
    <div class="flex gap-2 px-4 sm:px-6 py-4 overflow-x-auto bg-slate-50 dark:bg-slate-900 border-b border-[#e7eff3] dark:border-slate-800">
      <button
        v-for="cat in articleCategories"
        :key="cat.id"
        @click="selectedCategory = cat.id"
        class="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium"
        :class="selectedCategory === cat.id
          ? 'bg-primary text-[#0d171b]'
          : 'bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-text-main dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'"
      >
        <span>{{ cat.icon }}</span>
        <span>{{ t(`articles.categories.${cat.id}`) }}</span>
      </button>
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
          <!-- Meta -->
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm text-text-muted dark:text-slate-400 flex items-center gap-1">
              {{ getCategoryIcon(article.category) }}
              {{ t(`articles.categories.${article.category}`) }}
            </span>
            <span class="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium">
              {{ t(`levels.${article.level}.name`) }}
            </span>
          </div>

          <!-- Title -->
          <h3 class="font-bold text-lg text-text-main dark:text-white mb-2">{{ article.title }}</h3>

          <!-- Preview -->
          <p class="text-sm text-text-muted dark:text-slate-400 mb-4 line-clamp-2">{{ article.content.substring(0, 120) }}...</p>

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
