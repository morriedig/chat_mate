<script setup>
import { useI18n } from 'vue-i18n'
import { useDarkMode } from '../../composables/useDarkMode'
import RankBadge from './RankBadge.vue'
import DailyGoalRing from './DailyGoalRing.vue'

const { t } = useI18n()
const { isDark, toggle: toggleDark } = useDarkMode()

const props = defineProps({
  character: {
    type: Object,
    required: true
  },
  level: {
    type: Object,
    required: true
  },
  isArticleMode: {
    type: Boolean,
    default: false
  },
  showArticle: {
    type: Boolean,
    default: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  memoryCount: {
    type: Number,
    default: 0
  },
  conversationCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['back', 'toggle-article', 'renew-chat', 'toggle-vocab-bank', 'show-memories'])
</script>

<template>
  <header class="flex items-center justify-between border-b border-[#e7eff3] dark:border-slate-800 px-3 sm:px-6 py-3 sm:py-4 bg-surface-light dark:bg-surface-dark z-10 shadow-sm overflow-hidden safe-area-top">
    <div class="flex items-center gap-2 sm:gap-3 text-text-main dark:text-white min-w-0 shrink">
      <button @click="emit('back')" class="flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined cursor-pointer">arrow_back</span>
      </button>
      <div class="flex items-center justify-center rounded-full size-8 sm:size-10 shrink-0 shadow-sm border-2 border-white dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xl sm:text-2xl">
        {{ character.avatar }}
      </div>
      <div class="flex flex-col min-w-0">
        <h2 class="text-sm sm:text-base font-bold leading-tight tracking-[-0.015em] truncate">{{ character.name }}</h2>
        <span class="text-xs text-text-muted dark:text-slate-400 truncate">
          {{ t(`levels.${level.id}.name`) }}
          <span v-if="conversationCount > 1" class="ml-1">· chat #{{ conversationCount }}</span>
        </span>
      </div>
      <span class="hidden sm:inline px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold shrink-0">Online</span>
      <span v-if="isArticleMode" class="hidden sm:inline px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold shrink-0">{{ t('chat.articleMode') }}</span>
      <button
        v-if="memoryCount > 0"
        @click="emit('show-memories')"
        class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-semibold shrink-0 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
        :title="`${character.name} remembers ${memoryCount} thing${memoryCount === 1 ? '' : 's'} about you`"
      >
        <span class="material-symbols-outlined text-[14px]">favorite</span>
        {{ memoryCount }}
      </button>
    </div>
    <div class="flex items-center gap-1 sm:gap-2 relative">
      <DailyGoalRing />
      <RankBadge />
      <button
        @click="emit('toggle-vocab-bank')"
        class="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 transition-colors"
      >
        <span class="material-symbols-outlined text-[18px]">book</span>
      </button>
      <button
        @click="toggleDark"
        class="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 transition-colors"
      >
        <span class="material-symbols-outlined text-[18px]">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
      </button>
      <button
        v-if="isArticleMode"
        @click="emit('toggle-article')"
        class="hidden sm:flex h-9 px-3 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 text-sm font-medium transition-colors"
      >
        <span class="mr-1 material-symbols-outlined text-[18px]">article</span>
        {{ showArticle ? 'Hide' : 'Show' }}
      </button>
      <button
        @click="emit('renew-chat')"
        :disabled="isLoading"
        class="flex h-9 w-9 sm:w-auto sm:px-3 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 text-sm font-medium transition-colors disabled:opacity-50 shrink-0"
      >
        <span class="material-symbols-outlined text-[18px]">refresh</span>
        <span class="hidden sm:inline ml-1">New Chat</span>
      </button>
    </div>
  </header>
</template>
