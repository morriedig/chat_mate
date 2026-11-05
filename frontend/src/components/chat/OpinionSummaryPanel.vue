<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVocabularyBank } from '../../composables/useVocabularyBank'
import { useOpinionChat } from '../../composables/useOpinionChat'
import CmBottomSheet from '../ui/CmBottomSheet.vue'
import CmAvatar from '../ui/CmAvatar.vue'
import CmButton from '../ui/CmButton.vue'

const { t } = useI18n()

const props = defineProps({
  // Result of buildOpinionSummary()
  summary: {
    type: Object,
    required: true
  },
  character: {
    type: Object,
    required: true
  },
  topic: {
    type: String,
    default: ''
  },
  motherTongue: {
    type: String,
    default: 'en'
  }
})

const emit = defineEmits(['close', 'new-topic', 'home'])

const { addWord, hasWord } = useVocabularyBank()
const { getConnectorInfo } = useOpinionChat()

const usedItems = computed(() =>
  props.summary.used.map(u => ({ ...getConnectorInfo(u.id, props.motherTongue), sentence: u.sentence }))
)
const tryNextItems = computed(() =>
  props.summary.tryNext.map(id => getConnectorInfo(id, props.motherTongue))
)

const justSaved = ref(false)
const isSaved = computed(() => justSaved.value || (props.summary.bestSentence && hasWord(props.summary.bestSentence)))

function handleSaveSentence() {
  const sentence = props.summary.bestSentence
  if (!sentence || isSaved.value) return
  const connectorLabels = props.summary.used
    .filter(u => u.sentence === sentence)
    .map(u => getConnectorInfo(u.id, props.motherTongue).label)
  addWord({
    word: sentence,
    translation: connectorLabels.join(' · '),
    context: props.topic,
    source: 'opinion-chat',
  })
  justSaved.value = true
}
</script>

<template>
  <CmBottomSheet
    :title="t('opinionChat.summaryTitle')"
    :description="t('opinionChat.summaryIntro', { name: character.name, count: summary.userTurns })"
    :close-label="t('opinionChat.keepChatting')"
    @close="emit('close')"
  >
    <template #leading>
      <CmAvatar :name="character.name" :size="48" />
    </template>

    <div class="opinion-summary">
      <!-- Connectors used -->
      <section class="mb-5">
        <h3 class="mb-2 text-caption font-medium text-ink-secondary">
          {{ usedItems.length ? t('opinionChat.summaryUsed') : t('opinionChat.summaryNoneUsed') }}
        </h3>
        <ul v-if="usedItems.length" class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline">
          <li
            v-for="item in usedItems"
            :key="item.id"
            class="summary-used bg-surface px-3.5 py-3"
          >
            <p class="mb-1 flex flex-wrap items-baseline gap-x-2">
              <span class="inline-flex items-center gap-1 text-caption font-medium text-success">
                <span class="material-symbols-outlined !text-[18px] self-center" aria-hidden="true">check</span>{{ item.label }}
              </span>
              <span v-if="item.meaning" class="text-meta text-ink-muted">{{ item.meaning }}</span>
            </p>
            <p class="break-words text-body text-ink">“{{ item.sentence }}”</p>
          </li>
        </ul>
      </section>

      <!-- Try next time -->
      <section v-if="tryNextItems.length" class="mb-5">
        <h3 class="mb-2 text-caption font-medium text-ink-secondary">{{ t('opinionChat.summaryTryNext') }}</h3>
        <ul class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline">
          <li
            v-for="item in tryNextItems"
            :key="item.id"
            class="summary-try bg-surface px-3.5 py-3"
          >
            <p class="mb-1 flex flex-wrap items-baseline gap-x-2">
              <span class="text-caption font-medium text-ink">{{ item.label }}</span>
              <span v-if="item.meaning" class="text-meta text-ink-muted">{{ item.meaning }}</span>
            </p>
            <p v-if="item.example" class="break-words text-caption text-ink-secondary">{{ item.example }}</p>
          </li>
        </ul>
      </section>

      <!-- Best sentence -->
      <section v-if="summary.bestSentence">
        <h3 class="mb-2 text-caption font-medium text-ink-secondary">{{ t('opinionChat.summaryBest') }}</h3>
        <div class="relative rounded-[14px] bg-accent-soft py-3.5 pl-4 pr-3.5">
          <span class="absolute left-0 top-3.5 h-9 w-[3px] rounded-r-[3px] bg-accent" aria-hidden="true"></span>
          <p class="mb-2 break-words text-body font-medium text-ink">“{{ summary.bestSentence }}”</p>
          <button
            type="button"
            @click="handleSaveSentence"
            :disabled="isSaved"
            class="save-sentence -mx-1 inline-flex min-h-11 items-center gap-1.5 rounded-[10px] px-1 text-caption font-medium"
            :class="isSaved ? 'text-success' : 'text-accent'"
          >
            <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">{{ isSaved ? 'check' : 'bookmark_add' }}</span>
            {{ isSaved ? t('opinionChat.saved') : t('opinionChat.saveSentence') }}
          </button>
        </div>
      </section>
    </div>

    <template #actions>
      <div class="grid grid-cols-2 gap-2">
        <CmButton block class="new-topic col-span-2" @click="emit('new-topic')">{{ t('opinionChat.newTopic') }}</CmButton>
        <CmButton variant="secondary" @click="emit('close')">{{ t('opinionChat.keepChatting') }}</CmButton>
        <CmButton variant="secondary" @click="emit('home')">{{ t('opinionChat.backHome') }}</CmButton>
      </div>
    </template>
  </CmBottomSheet>
</template>
