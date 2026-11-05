<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { articles } from '../data/articles.js'
import { stripMarkers } from '../composables/useArticleParser'
import { useNavState } from '../composables/useNavState'
import CmAppBar from './ui/CmAppBar.vue'
import CmStateBlock from './ui/CmStateBlock.vue'

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
  <div class="min-h-screen bg-page">
    <div class="sticky top-0 z-10">
      <CmAppBar
        :title="t('articles.title')"
        :subtitle="level ? `${t('articles.levelLabel')} · ${t(`levels.${level.id}.name`)}` : ''"
        :back-label="t('chat.back')"
        @back="router.push('/')"
      />
    </div>

    <!-- No level selected guard -->
    <div v-if="!level" class="mx-auto max-w-md px-4 py-12">
      <CmStateBlock
        icon="tune"
        :title="t('articles.pickLevelTitle')"
        :body="t('articles.pickLevelBody')"
        :action="t('articles.backHome')"
        @action="router.push('/')"
      />
    </div>

    <!-- Articles List -->
    <div v-else class="mx-auto max-w-3xl px-4 py-5 min-[375px]:px-5 sm:px-6">
      <ul class="grid gap-3">
        <li v-for="article in filteredArticles" :key="article.id">
          <button
            type="button"
            @click="selectArticle(article)"
            class="article-card block w-full cursor-pointer rounded-[14px] border border-hairline bg-surface p-4 text-left shadow-[var(--cm-shadow-small)] active:bg-surface-raised"
          >
            <!-- Title -->
            <span class="mb-1 flex items-start gap-2">
              <span class="min-w-0 flex-1 text-title font-medium text-ink">{{ article.title }}</span>
              <span class="material-symbols-outlined mt-0.5 shrink-0 text-ink-muted" aria-hidden="true">chevron_right</span>
            </span>

            <!-- Preview -->
            <span class="mb-3 line-clamp-2 block text-caption text-ink-secondary">{{ getPreviewText(article.content) }}...</span>

            <!-- Vocabulary -->
            <span class="flex flex-wrap items-center gap-1.5">
              <span class="text-meta text-ink-muted">{{ t('articles.keyWords') }}</span>
              <span
                v-for="item in article.vocabulary.slice(0, 3)"
                :key="item.word"
                class="rounded-[6px] border border-hairline bg-surface-raised px-2 py-0.5 text-meta font-medium text-ink"
                :title="item.definition"
              >
                {{ item.word }}
              </span>
            </span>
          </button>
        </li>
      </ul>

      <!-- No articles -->
      <CmStateBlock
        v-if="filteredArticles.length === 0"
        class="mt-8"
        icon="article"
        :title="t('articles.noArticles')"
        :body="t('articles.noArticlesHint')"
        :action="t('articles.changeLevel')"
        @action="router.push('/')"
      />
    </div>
  </div>
</template>
