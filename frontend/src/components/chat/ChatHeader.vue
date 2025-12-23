<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
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
  }
})

const emit = defineEmits(['back', 'toggle-article', 'renew-chat'])
</script>

<template>
  <header class="flex items-center justify-between border-b border-[#e7eff3] dark:border-slate-800 px-4 sm:px-6 py-4 bg-surface-light dark:bg-surface-dark z-10 shadow-sm">
    <div class="flex items-center gap-3 text-text-main dark:text-white">
      <button @click="emit('back')" class="flex items-center justify-center">
        <span class="material-symbols-outlined cursor-pointer">arrow_back</span>
      </button>
      <div class="flex items-center justify-center rounded-full size-10 shrink-0 shadow-sm border-2 border-white dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-2xl">
        {{ character.avatar }}
      </div>
      <div class="flex flex-col">
        <h2 class="text-base font-bold leading-tight tracking-[-0.015em]">{{ character.name }}</h2>
        <span class="text-xs text-text-muted dark:text-slate-400">{{ t(`levels.${level.id}.name`) }}</span>
      </div>
      <span class="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold">Online</span>
      <span v-if="isArticleMode" class="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold">{{ t('chat.articleMode') }}</span>
    </div>
    <div class="flex items-center gap-2">
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
        class="flex h-9 px-3 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 text-sm font-medium transition-colors disabled:opacity-50"
      >
        <span class="material-symbols-outlined text-[18px]">refresh</span>
        <span class="hidden sm:inline ml-1">New Chat</span>
      </button>
    </div>
  </header>
</template>
