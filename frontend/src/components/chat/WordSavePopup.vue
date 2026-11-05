<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVocabularyBank, generateWordId } from '../../composables/useVocabularyBank'
import CmBottomSheet from '../ui/CmBottomSheet.vue'
import CmButton from '../ui/CmButton.vue'

const { t } = useI18n()

// Bottom sheet on phones, centered panel on wider screens (DESIGN.md "Word popup")
const props = defineProps({
  word: { type: String, required: true },
  context: { type: String, default: '' },
  // Tap position; kept for callers, the sheet no longer follows the pointer
  position: { type: Object, default: () => ({ x: 0, y: 0 }) },
})

const emit = defineEmits(['close', 'saved'])

const { addWord, hasWord, removeWord } = useVocabularyBank()

const translation = ref('')
const alreadySaved = ref(hasWord(props.word))

function handleSave() {
  const added = addWord({
    word: props.word,
    translation: translation.value,
    context: props.context,
    source: 'chat',
  })
  if (added) {
    alreadySaved.value = true
    emit('saved', props.word)
  }
  emit('close')
}

function handleRemove() {
  const id = generateWordId(props.word)
  removeWord(id)
  alreadySaved.value = false
  emit('close')
}
</script>

<template>
  <CmBottomSheet
    :title="word"
    :description="alreadySaved ? t('vocabBank.alreadySaved') : t('vocabBank.sheetDescription')"
    :close-label="t('chat.close')"
    @close="emit('close')"
  >
    <div class="word-save-sheet space-y-4">
      <div v-if="context">
        <p class="mb-1 text-caption text-ink-secondary">{{ t('vocabBank.context') }}</p>
        <p class="rounded-[10px] border border-hairline bg-surface-sunken px-3 py-2 text-body text-ink"><span class="line-clamp-4 break-words">{{ context }}</span></p>
      </div>

      <label v-if="!alreadySaved" class="block">
        <span class="mb-1 block text-caption text-ink-secondary">{{ t('vocabBank.addTranslation') }}</span>
        <input
          v-model="translation"
          class="block min-h-12 w-full rounded-[10px] border border-hairline bg-surface-sunken px-3 text-[16px] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
          @keydown.enter="handleSave"
        />
      </label>
    </div>

    <template #actions>
      <button
        v-if="alreadySaved"
        type="button"
        @click="handleRemove"
        class="word-remove flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border border-hairline bg-surface-raised text-body font-medium text-error active:bg-surface-sunken"
      >
        <span class="material-symbols-outlined" aria-hidden="true">bookmark_remove</span>
        {{ t('vocabBank.remove') }}
      </button>
      <CmButton v-else block class="word-save" @click="handleSave">
        <span class="material-symbols-outlined" aria-hidden="true">bookmark_add</span>
        {{ t('vocabBank.save') }}
      </CmButton>
    </template>
  </CmBottomSheet>
</template>
