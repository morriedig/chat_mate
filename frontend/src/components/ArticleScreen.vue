<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { articles } from '../data/articles.js'
import { stripMarkers } from '../composables/useArticleParser'
import { useNavState } from '../composables/useNavState'

const { t, locale } = useI18n()
const router = useRouter()
const { selectedLevel: level, setArticle } = useNavState()

// Get articles for current language
const currentArticles = computed(() => {
  const lang = locale.value || 'en'
  return articles[lang] || articles.en || []
})

// Get articles filtered by level
const filteredArticles = computed(() => {
  if (!level.value) return []

  return currentArticles.value.map(article => {
    const levelData = article.levels[level.value.id]
    if (!levelData) return null

    return {
      id: article.id,
      topic_id: article.topic_id,
      levelId: level.value.id,
      title: levelData.title,
      content: levelData.content,
      ai_opening_line: levelData.ai_opening_line,
      vocabulary: levelData.vocabulary
    }
  }).filter(Boolean)
})

function selectArticle(a) {
  setArticle(a)
  router.push('/chat')
}

// Get plain text preview (strip [[word]] markers)
function getPreviewText(content) {
  return stripMarkers(content).substring(0, 120)
}
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <!-- Header -->
    <header class="sticky top-0 z-10 flex items-center gap-4 px-4 sm:px-6 py-4 bg-surface-light dark:bg-surface-dark border-b border-[#e7eff3] dark:border-slate-800 shadow-sm safe-area-top">
      <button @click="router.push('/')" class="flex items-center justify-center">
        <span class="material-symbols-outlined text-text-main dark:text-white cursor-pointer">arrow_back</span>
      </button>
      <h1 class="text-lg font-bold text-text-main dark:text-white">{{ t('articles.title') }}</h1>
    </header>

    <!-- No level selected guard -->
    <div v-if="!level" class="p-8 max-w-md mx-auto">
      <div class="flex flex-col items-center text-center py-12">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center mb-4">
          <span class="material-symbols-outlined text-3xl text-primary">tune</span>
        </div>
        <h2 class="text-lg font-semibold text-text-main dark:text-white mb-2">Pick a level first</h2>
        <p class="text-sm text-text-muted dark:text-slate-400 mb-5">
          Go back to the home screen and choose your level so we know which articles to show you.
        </p>
        <button
          @click="router.push('/')"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-[#0d171b] font-semibold hover:bg-primary/90 transition-colors"
        >
          <span class="material-symbols-outlined text-[18px]">home</span>
          Back to home
        </button>
      </div>
    </div>

    <template v-else>
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
        <div v-if="filteredArticles.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-3xl text-primary">article</span>
          </div>
          <p class="text-sm font-medium text-text-main dark:text-slate-200 mb-1">{{ t('articles.noArticles') }}</p>
          <p class="text-xs text-text-muted dark:text-slate-400 max-w-xs mb-5">We don't have articles at this level yet — try a different one from the home screen.</p>
          <button
            @click="router.push('/')"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:border-primary text-text-main dark:text-slate-200 text-sm font-semibold transition-colors"
          >
            <span class="material-symbols-outlined text-[18px]">tune</span>
            Change level
          </button>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>
