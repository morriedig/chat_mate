<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVocabularyBank } from '../../composables/useVocabularyBank'

const { t } = useI18n()
const emit = defineEmits(['close'])

const { words, wordCount, removeWord, searchWords } = useVocabularyBank()

const searchQuery = ref('')
const filteredWords = computed(() => searchWords(searchQuery.value))

function handleRemove(id) {
  removeWord(id)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="slide">
      <div class="fixed inset-0 z-50 flex justify-end">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/30" @click="emit('close')" />

        <!-- Panel -->
        <div class="relative w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-xl flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h2 class="text-lg font-bold text-text-main dark:text-slate-200">
                {{ t('vocabBank.title') }}
              </h2>
              <p class="text-xs text-text-muted dark:text-slate-400">
                {{ t('vocabBank.wordCount', { count: wordCount }) }}
              </p>
            </div>
            <button
              @click="emit('close')"
              class="material-symbols-outlined text-xl text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-slate-200"
            >
              close
            </button>
          </div>

          <!-- Search -->
          <div class="p-3 border-b border-slate-100 dark:border-slate-800">
            <div class="relative">
              <span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-text-muted dark:text-slate-500">search</span>
              <input
                v-model="searchQuery"
                :placeholder="t('vocabBank.search')"
                class="w-full text-sm py-2 pl-8 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-text-main dark:text-slate-200 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <!-- Word List -->
          <div class="flex-1 overflow-y-auto p-3 space-y-2">
            <div v-if="filteredWords.length === 0" class="text-center py-8">
              <span class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">book</span>
              <p class="text-sm text-text-muted dark:text-slate-400">
                {{ searchQuery ? t('vocabBank.noResults') : t('vocabBank.empty') }}
              </p>
            </div>

            <div
              v-for="entry in filteredWords"
              :key="entry.id"
              class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <span class="font-semibold text-sm text-text-main dark:text-slate-200">{{ entry.word }}</span>
                  <span v-if="entry.translation" class="text-xs text-text-muted dark:text-slate-400 ml-2">{{ entry.translation }}</span>
                </div>
                <button
                  @click="handleRemove(entry.id)"
                  class="material-symbols-outlined text-base text-slate-400 hover:text-red-500 transition-colors shrink-0"
                >
                  delete
                </button>
              </div>
              <p v-if="entry.context" class="text-xs text-text-muted dark:text-slate-400 mt-1 italic truncate">
                "{{ entry.context }}"
              </p>
              <div class="flex items-center gap-2 mt-1.5">
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-text-muted dark:text-slate-400">
                  {{ entry.source }}
                </span>
                <span class="text-[10px] text-text-muted dark:text-slate-500">{{ entry.addedAt }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
.slide-enter-from > div:last-child,
.slide-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>
