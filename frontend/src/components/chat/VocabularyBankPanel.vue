<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVocabularyBank } from '../../composables/useVocabularyBank'
import CmBottomSheet from '../ui/CmBottomSheet.vue'
import CmStateBlock from '../ui/CmStateBlock.vue'

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
  <CmBottomSheet
    :title="t('vocabBank.title')"
    :description="t('vocabBank.wordCount', { count: wordCount })"
    :close-label="t('chat.close')"
    @close="emit('close')"
  >
    <div class="vocab-bank-panel">
      <!-- Search -->
      <label class="relative mb-3 block">
        <span class="sr-only">{{ t('vocabBank.search') }}</span>
        <span class="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden="true">search</span>
        <input
          v-model="searchQuery"
          type="search"
          :placeholder="t('vocabBank.search')"
          class="block min-h-11 w-full rounded-[10px] border border-hairline bg-surface-sunken pl-10 pr-3 text-[16px] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
        />
      </label>

      <!-- Empty (no search) -->
      <CmStateBlock
        v-if="filteredWords.length === 0 && !searchQuery"
        icon="bookmark_add"
        :title="t('vocabBank.empty')"
        :body="t('vocabBank.emptyHint')"
      />
      <!-- Empty (with search) -->
      <CmStateBlock
        v-else-if="filteredWords.length === 0 && searchQuery"
        icon="search_off"
        :title="t('vocabBank.noResults')"
        :action="t('vocabBank.clearSearch')"
        @action="searchQuery = ''"
      />

      <ul v-else class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline">
        <li
          v-for="entry in filteredWords"
          :key="entry.id"
          class="flex items-start gap-2 bg-surface py-2 pl-3 pr-1"
        >
          <div class="min-w-0 flex-1 py-1">
            <p class="break-words">
              <span class="text-body font-medium text-ink">{{ entry.word }}</span>
              <span v-if="entry.translation" class="ml-2 text-caption text-ink-secondary">{{ entry.translation }}</span>
            </p>
            <p v-if="entry.context" class="mt-0.5 truncate text-caption text-ink-muted">“{{ entry.context }}”</p>
            <p class="mt-0.5 text-meta text-ink-muted tabular-nums">{{ entry.source }} · {{ entry.addedAt }}</p>
          </div>
          <button
            type="button"
            @click="handleRemove(entry.id)"
            :aria-label="`${t('vocabBank.remove')} ${entry.word}`"
            class="flex size-11 shrink-0 items-center justify-center rounded-[10px] text-ink-muted active:bg-surface-raised"
          >
            <span class="material-symbols-outlined" aria-hidden="true">delete</span>
          </button>
        </li>
      </ul>
    </div>
  </CmBottomSheet>
</template>
