<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVocabularyBank } from '../../composables/useVocabularyBank'
import { useOpinionChat } from '../../composables/useOpinionChat'

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
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="emit('close')" />

      <div class="opinion-summary relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-surface-light dark:bg-surface-dark shadow-2xl px-4 pt-5 pb-6 sm:p-6 safe-area-bottom">
        <!-- Friend header -->
        <div class="flex items-start gap-3 mb-5">
          <div class="flex items-center justify-center rounded-full size-12 shrink-0 shadow-sm bg-slate-100 dark:bg-slate-800 text-3xl">
            {{ character.avatar }}
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-lg font-bold text-text-main dark:text-white">{{ t('opinionChat.summaryTitle') }}</h2>
            <p class="text-sm text-text-muted dark:text-slate-400">
              {{ t('opinionChat.summaryIntro', { name: character.name, count: summary.userTurns }) }}
            </p>
          </div>
          <button
            @click="emit('close')"
            class="shrink-0 material-symbols-outlined text-xl text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-slate-200"
            :aria-label="t('opinionChat.keepChatting')"
          >close</button>
        </div>

        <!-- Connectors used -->
        <section class="mb-5">
          <h3 class="flex items-center gap-1.5 text-sm font-semibold text-text-main dark:text-slate-200 mb-2">
            <span class="material-symbols-outlined text-[18px] text-emerald-500">favorite</span>
            {{ usedItems.length ? t('opinionChat.summaryUsed') : t('opinionChat.summaryNoneUsed') }}
          </h3>
          <ul v-if="usedItems.length" class="space-y-2">
            <li
              v-for="item in usedItems"
              :key="item.id"
              class="summary-used p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900"
            >
              <div class="flex items-baseline gap-2 mb-1">
                <span class="text-sm font-bold text-emerald-700 dark:text-emerald-300">{{ item.label }}</span>
                <span v-if="item.meaning" class="text-xs text-text-muted dark:text-slate-400">{{ item.meaning }}</span>
              </div>
              <p class="text-sm text-text-main dark:text-slate-300 italic break-words">“{{ item.sentence }}”</p>
            </li>
          </ul>
        </section>

        <!-- Try next time -->
        <section v-if="tryNextItems.length" class="mb-5">
          <h3 class="flex items-center gap-1.5 text-sm font-semibold text-text-main dark:text-slate-200 mb-2">
            <span class="material-symbols-outlined text-[18px] text-amber-500">lightbulb</span>
            {{ t('opinionChat.summaryTryNext') }}
          </h3>
          <ul class="space-y-2">
            <li
              v-for="item in tryNextItems"
              :key="item.id"
              class="summary-try p-3 rounded-xl bg-amber-50 dark:bg-amber-900/15 border border-amber-100 dark:border-amber-900"
            >
              <div class="flex items-baseline gap-2 mb-1">
                <span class="text-sm font-bold text-amber-700 dark:text-amber-300">{{ item.label }}</span>
                <span v-if="item.meaning" class="text-xs text-text-muted dark:text-slate-400">{{ item.meaning }}</span>
              </div>
              <p v-if="item.example" class="text-sm text-text-muted dark:text-slate-400 break-words">{{ item.example }}</p>
            </li>
          </ul>
        </section>

        <!-- Best sentence -->
        <section v-if="summary.bestSentence" class="mb-6">
          <h3 class="flex items-center gap-1.5 text-sm font-semibold text-text-main dark:text-slate-200 mb-2">
            <span class="material-symbols-outlined text-[18px] text-primary">format_quote</span>
            {{ t('opinionChat.summaryBest') }}
          </h3>
          <div class="p-3 rounded-xl bg-primary/10 dark:bg-primary/15 border border-primary/20">
            <p class="text-sm font-medium text-text-main dark:text-slate-200 break-words mb-3">“{{ summary.bestSentence }}”</p>
            <button
              @click="handleSaveSentence"
              :disabled="isSaved"
              class="save-sentence inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              :class="isSaved
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                : 'bg-primary text-[#0d171b] hover:bg-primary/90'"
            >
              <span class="material-symbols-outlined text-[16px]">{{ isSaved ? 'check' : 'bookmark_add' }}</span>
              {{ isSaved ? t('opinionChat.saved') : t('opinionChat.saveSentence') }}
            </button>
          </div>
        </section>

        <!-- Actions -->
        <div class="grid grid-cols-2 gap-2">
          <button
            @click="emit('new-topic')"
            class="new-topic col-span-2 py-3 rounded-xl font-bold bg-primary text-[#0d171b] hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            {{ t('opinionChat.newTopic') }}
          </button>
          <button
            @click="emit('close')"
            class="py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {{ t('opinionChat.keepChatting') }}
          </button>
          <button
            @click="emit('home')"
            class="py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {{ t('opinionChat.backHome') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
