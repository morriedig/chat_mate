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
  <div class="article-screen">
    <header class="article-header">
      <button class="back-btn" @click="emit('back')">←</button>
      <h1>{{ t('articles.title') }}</h1>
    </header>

    <div class="category-tabs">
      <button
        v-for="cat in articleCategories"
        :key="cat.id"
        class="category-tab"
        :class="{ active: selectedCategory === cat.id }"
        @click="selectedCategory = cat.id"
      >
        <span class="cat-icon">{{ cat.icon }}</span>
        <span class="cat-name">{{ t(`articles.categories.${cat.id}`) }}</span>
      </button>
    </div>

    <div class="articles-list">
      <div
        v-for="article in filteredArticles"
        :key="article.id"
        class="article-card"
        @click="selectArticle(article)"
      >
        <div class="article-meta">
          <span class="article-category">{{ getCategoryIcon(article.category) }} {{ t(`articles.categories.${article.category}`) }}</span>
          <span class="article-level">{{ t(`levels.${article.level}.name`) }}</span>
        </div>
        <h3 class="article-title">{{ article.title }}</h3>
        <p class="article-preview">{{ article.content.substring(0, 100) }}...</p>
        <div class="article-vocab">
          <span class="vocab-label">{{ t('articles.keyWords') }}:</span>
          <span v-for="item in article.vocabulary.slice(0, 3)" :key="item.word" class="vocab-tag" :title="item.definition">
            {{ item.word }}
          </span>
        </div>
      </div>

      <div v-if="filteredArticles.length === 0" class="no-articles">
        {{ t('articles.noArticles') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-screen {
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.article-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.article-header h1 {
  font-size: 1.25rem;
  margin: 0;
}

.back-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}

.category-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 2rem;
  background: white;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.category-tab:hover {
  border-color: #999;
}

.category-tab.active {
  background: #4a90d9;
  border-color: #4a90d9;
  color: white;
}

.cat-icon {
  font-size: 1rem;
}

.cat-name {
  font-size: 0.85rem;
}

.articles-list {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.article-card {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.article-card:hover {
  border-color: #4a90d9;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.article-category {
  font-size: 0.8rem;
  color: #666;
}

.article-level {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: #e8f4e8;
  border-radius: 1rem;
  color: #2d5a2d;
}

.article-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
}

.article-preview {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

.article-vocab {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.vocab-label {
  font-size: 0.75rem;
  color: #888;
}

.vocab-tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: #f0f0f0;
  border-radius: 4px;
  color: #555;
}

.no-articles {
  text-align: center;
  color: #888;
  padding: 2rem;
}
</style>
