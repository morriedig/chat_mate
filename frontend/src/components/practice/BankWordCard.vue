<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { playTTS } from '../../utils/tts'
import PracticeRating from './PracticeRating.vue'
import PracticeCard from './PracticeCard.vue'
import CmButton from '../ui/CmButton.vue'
import CmIconButton from '../ui/CmIconButton.vue'

const { t } = useI18n()

const props = defineProps({
  // Vocabulary bank entry: { id, word, translation, context }
  word: { type: Object, required: true },
})
const emit = defineEmits(['done'])

// Recall first, then reveal what was saved with it
const revealed = ref(false)
watch(() => props.word.id, () => { revealed.value = false })

function rate(confidence) {
  emit('done', { correct: confidence >= 3, confidence })
}
</script>

<template>
  <PracticeCard>
    <div class="flex items-start justify-between gap-2">
      <p class="min-w-0 pt-1 text-section font-medium text-ink break-words">{{ word.word }}</p>
      <CmIconButton icon="volume_up" :label="t('dailyPractice.listen')" class="-mr-2 -mt-1" @click="playTTS(word.word, 'en', 'normal')" />
    </div>

    <template v-if="!revealed">
      <p class="text-caption text-ink-secondary">{{ t('dailyPractice.recallMeaning') }}</p>
      <CmButton block @click="revealed = true">{{ t('dailyPractice.reveal') }}</CmButton>
    </template>

    <template v-else>
      <div class="space-y-2 rounded-[10px] border border-hairline bg-surface-sunken px-3 py-3">
        <p v-if="word.translation" class="text-body font-medium text-ink break-words">{{ word.translation }}</p>
        <p v-if="word.context" class="text-caption text-ink-secondary break-words">“{{ word.context }}”</p>
        <p v-if="!word.translation && !word.context" class="text-caption text-ink-secondary">{{ t('dailyPractice.noSavedMeaning') }}</p>
      </div>
      <PracticeRating @rate="rate" />
    </template>
  </PracticeCard>
</template>
