<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVocabularyBank, generateWordId } from '../../composables/useVocabularyBank'

const { t } = useI18n()

const props = defineProps({
  word: { type: String, required: true },
  context: { type: String, default: '' },
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
  <div
    class="fixed inset-0 z-50"
    @click.self="emit('close')"
  >
    <div
      class="absolute bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 w-64 z-50"
      :style="{ left: position.x + 'px', top: position.y + 'px' }"
    >
      <!-- Word -->
      <div class="font-semibold text-sm text-text-main dark:text-slate-200 mb-2">
        {{ word }}
      </div>

      <template v-if="alreadySaved">
        <p class="text-xs text-green-600 dark:text-green-400 mb-2">
          <span class="material-symbols-outlined text-xs align-middle">check_circle</span>
          {{ t('vocabBank.alreadySaved') }}
        </p>
        <button
          @click="handleRemove"
          class="w-full text-xs py-1.5 px-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          {{ t('vocabBank.remove') }}
        </button>
      </template>

      <template v-else>
        <!-- Translation input -->
        <input
          v-model="translation"
          :placeholder="t('vocabBank.addTranslation')"
          class="w-full text-xs py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-text-main dark:text-slate-200 mb-2 focus:outline-none focus:border-primary"
          @keydown.enter="handleSave"
        />

        <!-- Save button -->
        <button
          @click="handleSave"
          class="w-full text-xs py-1.5 px-3 rounded-lg bg-primary text-[#0d171b] font-medium hover:bg-primary/90 transition-colors"
        >
          <span class="material-symbols-outlined text-xs align-middle mr-1">bookmark_add</span>
          {{ t('vocabBank.save') }}
        </button>
      </template>
    </div>
  </div>
</template>
