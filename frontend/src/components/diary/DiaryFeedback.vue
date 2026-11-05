<script setup>
import { reactive } from 'vue'
import CmAvatar from '../ui/CmAvatar.vue'
import CmButton from '../ui/CmButton.vue'
import { useI18n } from 'vue-i18n'
import { useVocabularyBank } from '../../composables/useVocabularyBank'

const { t } = useI18n()
const { addWord, hasWord } = useVocabularyBank()

defineProps({
  feedback: {
    type: Object,
    default: null
  },
  character: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['retry', 'rewrite'])

// Collapsible sections after the reaction; all start open (corrections stay expanded when present)
const openSections = reactive({ didWell: true, corrections: true, better: true, vocab: true })
function toggleSection(key) {
  openSections[key] = !openSections[key]
}

// Track which vocab words and corrections have been added to the bank
const addedWords = reactive({})

function isWordAdded(word) {
  return addedWords[word] || hasWord(word)
}

function handleAddVocabWord(word) {
  const added = addWord({
    word: word.word,
    translation: word.meaning || '',
    context: word.example || '',
    source: 'diary',
  })
  if (added) {
    addedWords[word.word] = true
  }
}

function handleSaveCorrection(correction) {
  const added = addWord({
    word: correction.corrected,
    translation: correction.explanation || '',
    context: correction.original || '',
    source: 'diary',
  })
  if (added) {
    addedWords[correction.corrected] = true
  }
}

// Severity is a quiet margin rule; the corrected text carries the meaning
function getSeverityRule(severity) {
  switch (severity) {
    case 'major': return 'bg-error'
    case 'minor': return 'bg-hairline'
    default: return 'bg-warning'
  }
}

const scoreRows = [
  { key: 'grammar', label: 'diary.feedback.grammar' },
  { key: 'vocabulary', label: 'diary.feedback.vocabulary' },
  { key: 'naturalness', label: 'diary.feedback.naturalness' },
  { key: 'effort', label: 'diary.feedback.effort' },
]

function scoreRatio(score) {
  return Math.min(1, Math.max(0, (Number(score) || 0) / 100))
}
</script>

<template>
  <!-- Loading: static skeleton shaped like the reaction + sections (no shimmer) -->
  <div v-if="loading" class="space-y-4 py-4" role="status" aria-live="polite">
    <div class="flex items-center gap-3">
      <CmAvatar :name="character.name" :size="32" />
      <p class="text-caption text-ink-secondary">{{ t('diary.reading', { name: character.name }) }}</p>
    </div>
    <div class="space-y-2 rounded-[14px] rounded-bl-[6px] border border-hairline bg-surface p-4" aria-hidden="true">
      <div class="h-3 w-5/6 rounded-[2px] bg-accent-soft"></div>
      <div class="h-3 w-full rounded-[2px] bg-surface-raised"></div>
      <div class="h-3 w-4/6 rounded-[2px] bg-surface-raised"></div>
    </div>
    <div class="space-y-2 rounded-[14px] border border-hairline bg-surface p-4" aria-hidden="true">
      <div class="h-3 w-32 rounded-[2px] bg-surface-raised"></div>
      <div class="h-3 w-full rounded-[2px] bg-surface-raised"></div>
      <div class="h-3 w-2/3 rounded-[2px] bg-surface-raised"></div>
    </div>
  </div>

  <!-- Error: beside the failed content, with Retry -->
  <div v-else-if="error" class="py-4">
    <div class="flex items-center gap-3 rounded-[14px] bg-error-soft p-4" role="alert">
      <span class="material-symbols-outlined shrink-0 text-error" aria-hidden="true">error</span>
      <p class="min-w-0 flex-1 text-caption text-ink">{{ t('chat.genericError') }}</p>
      <button
        type="button"
        @click="emit('retry')"
        class="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-[10px] border border-hairline bg-surface px-3 text-caption font-medium text-ink active:bg-surface-raised"
      >
        <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">refresh</span>
        {{ t('diary.feedback.retry') }}
      </button>
    </div>
  </div>

  <!-- Feedback Content -->
  <div v-else-if="feedback" class="space-y-5">
    <!-- 1. Friend's reaction (the hero) -->
    <div v-if="feedback.reaction || feedback.encouragement" class="flex max-w-full items-start gap-2">
      <CmAvatar :name="character.name" :size="32" class="mt-5" />
      <div class="flex min-w-0 flex-col items-start gap-1">
        <span class="text-meta text-ink-muted">{{ character.name }}</span>
        <div class="rounded-[14px] rounded-bl-[6px] border border-hairline bg-surface p-4 text-ink">
          <p class="whitespace-pre-wrap break-words text-body">{{ feedback.reaction || feedback.encouragement }}</p>
        </div>
      </div>
    </div>

    <!-- 2. What worked -->
    <section v-if="feedback.didWell?.length">
      <button
        type="button"
        class="flex min-h-11 w-full items-center gap-2 text-left"
        :aria-expanded="openSections.didWell"
        aria-controls="diary-fb-didwell"
        @click="toggleSection('didWell')"
      >
        <span class="material-symbols-outlined !text-[18px] text-success" aria-hidden="true">check_circle</span>
        <h3 class="min-w-0 flex-1 text-caption font-medium text-ink">{{ t('diary.feedback.niceJob') }}</h3>
        <span class="text-meta tabular-nums text-ink-muted">{{ feedback.didWell.length }}</span>
        <span class="material-symbols-outlined text-ink-muted transition-transform duration-[180ms]" :class="openSections.didWell ? 'rotate-180' : ''" aria-hidden="true">expand_more</span>
      </button>
      <ul v-if="openSections.didWell" id="diary-fb-didwell" class="divide-y divide-hairline rounded-[14px] border border-hairline bg-surface">
        <li
          v-for="(item, i) in feedback.didWell"
          :key="'well-' + i"
          class="flex items-start gap-2 p-4"
        >
          <span class="material-symbols-outlined mt-0.5 shrink-0 !text-[18px] text-success" aria-hidden="true">check</span>
          <p v-if="typeof item === 'string'" class="text-caption text-ink">{{ item }}</p>
          <div v-else class="min-w-0 text-caption">
            <p class="break-words font-medium text-ink">"{{ item.text }}"</p>
            <p v-if="item.comment" class="mt-0.5 text-ink-secondary">{{ item.comment }}</p>
          </div>
        </li>
      </ul>
    </section>

    <!-- 3. Corrections (expanded when present) -->
    <section v-if="feedback.corrections?.length">
      <button
        type="button"
        class="flex min-h-11 w-full items-center gap-2 text-left"
        :aria-expanded="openSections.corrections"
        aria-controls="diary-fb-corrections"
        @click="toggleSection('corrections')"
      >
        <span class="material-symbols-outlined !text-[18px] text-ink-muted" aria-hidden="true">edit_note</span>
        <h3 class="min-w-0 flex-1 text-caption font-medium text-ink">{{ t('diary.feedback.tryNext') }}</h3>
        <span class="text-meta tabular-nums text-ink-muted">{{ feedback.corrections.length }}</span>
        <span class="material-symbols-outlined text-ink-muted transition-transform duration-[180ms]" :class="openSections.corrections ? 'rotate-180' : ''" aria-hidden="true">expand_more</span>
      </button>

      <ul v-if="openSections.corrections" id="diary-fb-corrections" class="space-y-3">
        <li
          v-for="(correction, i) in feedback.corrections"
          :key="'corr-' + i"
          class="relative overflow-hidden rounded-[14px] border border-hairline bg-surface p-4 pl-5"
        >
          <span class="absolute left-0 top-4 h-9 w-[3px] rounded-r-[3px]" :class="getSeverityRule(correction.severity)" aria-hidden="true"></span>
          <p class="break-words rounded-[6px] bg-surface-sunken px-2 py-1 text-caption text-ink-secondary line-through decoration-error/70">{{ correction.original }}</p>
          <p class="mt-2 break-words text-body font-medium text-ink">{{ correction.corrected }}</p>
          <p v-if="correction.explanation" class="mt-1 text-caption text-ink-secondary">{{ correction.explanation }}</p>
          <div class="mt-1 -mb-2 -ml-2">
            <button
              v-if="!isWordAdded(correction.corrected)"
              type="button"
              @click="handleSaveCorrection(correction)"
              class="inline-flex min-h-11 items-center gap-1 rounded-[10px] px-2 text-caption font-medium text-accent active:bg-surface-raised"
            >
              <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">bookmark_add</span>
              {{ t('diary.feedback.saveWord') }}
            </button>
            <span v-else class="inline-flex min-h-11 items-center gap-1 px-2 text-caption text-success">
              <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">check</span>
              {{ t('diary.feedback.added') }}
            </span>
          </div>
        </li>
      </ul>
    </section>

    <!-- 4. Better expressions -->
    <section v-if="feedback.betterExpressions?.length">
      <button
        type="button"
        class="flex min-h-11 w-full items-center gap-2 text-left"
        :aria-expanded="openSections.better"
        aria-controls="diary-fb-better"
        @click="toggleSection('better')"
      >
        <span class="material-symbols-outlined !text-[18px] text-ink-muted" aria-hidden="true">swap_horiz</span>
        <h3 class="min-w-0 flex-1 text-caption font-medium text-ink">{{ t('diary.feedback.betterExpressions') }}</h3>
        <span class="text-meta tabular-nums text-ink-muted">{{ feedback.betterExpressions.length }}</span>
        <span class="material-symbols-outlined text-ink-muted transition-transform duration-[180ms]" :class="openSections.better ? 'rotate-180' : ''" aria-hidden="true">expand_more</span>
      </button>
      <ul v-if="openSections.better" id="diary-fb-better" class="divide-y divide-hairline rounded-[14px] border border-hairline bg-surface">
        <li
          v-for="(expr, i) in feedback.betterExpressions"
          :key="'expr-' + i"
          class="p-4"
        >
          <p class="break-words text-caption text-ink-secondary">{{ expr.original }}</p>
          <p class="mt-1 flex items-start gap-1 break-words text-body font-medium text-ink">
            <span class="material-symbols-outlined mt-0.5 shrink-0 !text-[18px] text-accent" aria-hidden="true">arrow_forward</span>
            <span class="min-w-0">{{ expr.upgraded }}</span>
          </p>
          <p v-if="expr.context" class="mt-1 text-caption text-ink-muted">{{ expr.context }}</p>
        </li>
      </ul>
    </section>

    <!-- 5. New vocabulary -->
    <section v-if="feedback.vocabulary?.suggestions?.length || feedback.newVocabulary?.length">
      <button
        type="button"
        class="flex min-h-11 w-full items-center gap-2 text-left"
        :aria-expanded="openSections.vocab"
        aria-controls="diary-fb-vocab"
        @click="toggleSection('vocab')"
      >
        <span class="material-symbols-outlined !text-[18px] text-ink-muted" aria-hidden="true">dictionary</span>
        <h3 class="min-w-0 flex-1 text-caption font-medium text-ink">{{ t('diary.feedback.wordsToTry') }}</h3>
        <span class="material-symbols-outlined text-ink-muted transition-transform duration-[180ms]" :class="openSections.vocab ? 'rotate-180' : ''" aria-hidden="true">expand_more</span>
      </button>
      <div v-if="openSections.vocab" id="diary-fb-vocab" class="scrollbar-thin -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        <div
          v-for="(word, i) in (feedback.newVocabulary || feedback.vocabulary?.suggestions || [])"
          :key="'vocab-' + i"
          class="w-56 shrink-0 rounded-[14px] border border-hairline bg-surface p-4"
        >
          <template v-if="typeof word === 'object'">
            <p class="break-words text-body font-medium text-ink">{{ word.word }}</p>
            <p v-if="word.meaning" class="mt-0.5 text-caption text-ink-secondary">{{ word.meaning }}</p>
            <p v-if="word.example" class="mt-1 line-clamp-4 break-words text-caption text-ink-muted">"{{ word.example }}"</p>
            <div class="mt-1 -mb-2 -ml-2">
              <button
                v-if="!isWordAdded(word.word)"
                type="button"
                @click="handleAddVocabWord(word)"
                class="inline-flex min-h-11 items-center gap-1 rounded-[10px] px-2 text-caption font-medium text-accent active:bg-surface-raised"
              >
                <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">add</span>
                {{ t('diary.feedback.addToVocab') }}
              </button>
              <span v-else class="inline-flex min-h-11 items-center gap-1 px-2 text-caption text-success">
                <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">check</span>
                {{ t('diary.feedback.added') }}
              </span>
            </div>
          </template>
          <template v-else>
            <p class="text-body text-ink">{{ word }}</p>
          </template>
        </div>
      </div>
    </section>

    <!-- 6. Encouragement (neutral footer message) -->
    <div v-if="feedback.encouragement && (feedback.didWell?.length || feedback.corrections?.length)">
      <p class="rounded-[14px] bg-surface-sunken p-4 text-body text-ink">{{ feedback.encouragement }}</p>
    </div>

    <!-- Rewrite -->
    <div>
      <CmButton variant="secondary" @click="emit('rewrite')">
        <span class="material-symbols-outlined" aria-hidden="true">edit_note</span>
        {{ t('diary.rewrite') }}
      </CmButton>
    </div>

    <!-- 7. Score bars (quiet, at the bottom) -->
    <dl v-if="feedback.grammar?.score || feedback.vocabulary?.score || feedback.naturalness?.score" class="space-y-2 pt-1">
      <template v-for="row in scoreRows" :key="row.key">
        <div v-if="feedback[row.key]?.score" class="flex items-center gap-3">
          <dt class="w-20 shrink-0 text-meta text-ink-muted">{{ t(row.label) }}</dt>
          <dd class="flex flex-1 items-center gap-3">
            <span class="h-1 flex-1 overflow-hidden bg-surface-raised" aria-hidden="true">
              <span
                class="block h-full w-full origin-left rounded-r-[2px] bg-ink-muted transition-transform duration-[180ms]"
                :style="{ transform: `scaleX(${scoreRatio(feedback[row.key].score)})` }"
              ></span>
            </span>
            <span class="w-8 text-right text-meta tabular-nums text-ink-secondary">{{ feedback[row.key].score }}</span>
          </dd>
        </div>
      </template>
    </dl>
  </div>
</template>
