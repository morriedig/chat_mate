<script setup>
import { ref, reactive } from 'vue'
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

const correctionsExpanded = ref(false)

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

function getSeverityBorder(severity) {
  switch (severity) {
    case 'major': return 'border-l-red-400 dark:border-l-red-500'
    case 'moderate': return 'border-l-amber-400 dark:border-l-amber-500'
    case 'minor': return 'border-l-slate-300 dark:border-l-slate-600'
    default: return 'border-l-amber-400 dark:border-l-amber-500'
  }
}

function getScoreColor(score) {
  if (score >= 80) return 'text-green-600 dark:text-green-400'
  if (score >= 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function getScoreBarBg(score) {
  if (score >= 80) return 'bg-green-400 dark:bg-green-500'
  if (score >= 60) return 'bg-amber-400 dark:bg-amber-500'
  return 'bg-red-400 dark:bg-red-500'
}
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="py-6">
    <div class="flex items-end gap-2 sm:gap-3 max-w-full">
      <div class="flex items-center justify-center rounded-full size-8 sm:size-10 shrink-0 shadow-sm bg-slate-100 dark:bg-slate-800 text-xl sm:text-2xl">
        {{ character.avatar }}
      </div>
      <div class="flex flex-col gap-1 items-start">
        <span class="text-text-muted dark:text-slate-400 text-[13px] font-medium ml-1">{{ character.name }}</span>
        <div class="p-3 sm:p-4 rounded-2xl rounded-bl-none bg-surface-light dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="flex items-center gap-2 text-sm text-text-muted dark:text-slate-400">
            <div class="flex gap-1">
              <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </div>
            <span class="ml-1">{{ t('diary.submitting') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="py-4">
    <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <span class="material-symbols-outlined text-base">error</span>
          {{ t('chat.genericError') }}
        </div>
        <button
          @click="emit('retry')"
          class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-semibold hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
        >
          <span class="material-symbols-outlined text-[16px]">refresh</span>
          {{ t('diary.feedback.retry') }}
        </button>
      </div>
    </div>
  </div>

  <!-- Feedback Content -->
  <div v-else-if="feedback" class="space-y-4">
    <!-- 1. Friend's Reaction (chat bubble style) -->
    <div v-if="feedback.reaction || feedback.encouragement" class="flex items-end gap-2 sm:gap-3 max-w-full">
      <div class="flex items-center justify-center rounded-full size-8 sm:size-10 shrink-0 shadow-sm bg-slate-100 dark:bg-slate-800 text-xl sm:text-2xl">
        {{ character.avatar }}
      </div>
      <div class="flex flex-col gap-1 items-start min-w-0 overflow-hidden">
        <span class="text-text-muted dark:text-slate-400 text-[13px] font-medium ml-1">{{ character.name }}</span>
        <div class="p-3 sm:p-4 rounded-2xl rounded-bl-none bg-surface-light dark:bg-surface-dark text-text-main dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700">
          <p class="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{{ feedback.reaction || feedback.encouragement }}</p>
        </div>
      </div>
    </div>

    <!-- 2. Nice Job / Did Well -->
    <div v-if="feedback.didWell?.length" class="space-y-2">
      <p class="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider flex items-center gap-1.5">
        <span class="material-symbols-outlined text-[16px]">thumb_up</span>
        {{ t('diary.feedback.niceJob') }}
      </p>
      <div class="space-y-2">
        <div
          v-for="(item, i) in feedback.didWell"
          :key="'well-' + i"
          class="flex items-start gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
        >
          <span class="material-symbols-outlined text-green-500 text-[18px] shrink-0 mt-0.5">check_circle</span>
          <p class="text-sm text-text-main dark:text-slate-200">{{ item }}</p>
        </div>
      </div>
    </div>

    <!-- 3. Corrections (expandable) -->
    <div v-if="feedback.corrections?.length" class="space-y-2">
      <button
        @click="correctionsExpanded = !correctionsExpanded"
        class="w-full flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider"
      >
        <span class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">edit_note</span>
          {{ t('diary.feedback.tryNext') }} ({{ feedback.corrections.length }})
        </span>
        <span class="material-symbols-outlined text-[18px] transition-transform" :class="correctionsExpanded ? 'rotate-180' : ''">expand_more</span>
      </button>

      <div v-if="correctionsExpanded" class="space-y-2">
        <div
          v-for="(correction, i) in feedback.corrections"
          :key="'corr-' + i"
          class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-l-4"
          :class="getSeverityBorder(correction.severity)"
        >
          <!-- Original with strikethrough -->
          <p class="text-sm">
            <span class="line-through text-red-400/60 dark:text-red-400/60">{{ correction.original }}</span>
          </p>
          <!-- Corrected -->
          <p class="text-sm font-medium text-primary mt-1">
            {{ correction.corrected }}
          </p>
          <!-- Explanation -->
          <p v-if="correction.explanation" class="text-xs text-text-muted dark:text-slate-400 mt-1.5">
            {{ correction.explanation }}
          </p>
          <!-- Save corrected word to vocab bank -->
          <div class="mt-1.5">
            <button
              v-if="!isWordAdded(correction.corrected)"
              @click="handleSaveCorrection(correction)"
              class="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-0.5 font-medium"
            >
              <span class="material-symbols-outlined text-[14px]">bookmark_add</span>
              {{ t('diary.feedback.saveWord') }}
            </button>
            <span
              v-else
              class="text-xs text-green-600 dark:text-green-400 flex items-center gap-0.5 font-medium"
            >
              <span class="material-symbols-outlined text-[14px]">check_circle</span>
              {{ t('diary.feedback.added') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Better Expressions -->
    <div v-if="feedback.betterExpressions?.length" class="space-y-2">
      <p class="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
        <span class="material-symbols-outlined text-[16px]">auto_awesome</span>
        {{ t('diary.feedback.betterExpressions') }}
      </p>
      <div class="space-y-2">
        <div
          v-for="(expr, i) in feedback.betterExpressions"
          :key="'expr-' + i"
          class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
        >
          <div class="flex items-center gap-2 text-sm">
            <span class="text-text-muted dark:text-slate-400">{{ expr.original }}</span>
            <span class="material-symbols-outlined text-primary text-[16px] shrink-0">arrow_forward</span>
            <span class="font-medium text-text-main dark:text-slate-200">{{ expr.upgraded }}</span>
          </div>
          <p v-if="expr.context" class="text-xs text-text-muted dark:text-slate-400 mt-1.5">
            {{ expr.context }}
          </p>
        </div>
      </div>
    </div>

    <!-- 5. New Vocabulary -->
    <div v-if="feedback.vocabulary?.suggestions?.length || feedback.newVocabulary?.length" class="space-y-2">
      <p class="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
        <span class="material-symbols-outlined text-[16px]">dictionary</span>
        {{ t('diary.feedback.wordsToTry') }}
      </p>
      <div class="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
        <div
          v-for="(word, i) in (feedback.newVocabulary || feedback.vocabulary?.suggestions || [])"
          :key="'vocab-' + i"
          class="flex-shrink-0 w-48 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
        >
          <template v-if="typeof word === 'object'">
            <p class="text-sm font-semibold text-text-main dark:text-white">{{ word.word }}</p>
            <p v-if="word.meaning" class="text-xs text-text-muted dark:text-slate-400 mt-0.5">{{ word.meaning }}</p>
            <p v-if="word.example" class="text-xs text-text-muted dark:text-slate-500 mt-1 italic">"{{ word.example }}"</p>
            <button
              v-if="!isWordAdded(word.word)"
              @click="handleAddVocabWord(word)"
              class="mt-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-[14px]">add</span>
              {{ t('diary.feedback.addToVocab') }}
            </button>
            <span
              v-else
              class="mt-2 text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-[14px]">check_circle</span>
              {{ t('diary.feedback.added') }}
            </span>
          </template>
          <template v-else>
            <p class="text-sm text-text-main dark:text-slate-200">{{ word }}</p>
          </template>
        </div>
      </div>
    </div>

    <!-- 6. Encouragement (footer message) -->
    <div v-if="feedback.encouragement && (feedback.didWell?.length || feedback.corrections?.length)" class="pt-2">
      <div class="p-3 rounded-xl bg-gradient-to-r from-primary/5 to-sky-400/5 dark:from-primary/10 dark:to-sky-400/10 border border-primary/10 dark:border-primary/20">
        <p class="text-sm text-text-main dark:text-slate-200 text-center font-medium">{{ feedback.encouragement }}</p>
      </div>
    </div>

    <!-- Rewrite button -->
    <div class="pt-2">
      <button
        @click="emit('rewrite')"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-text-main dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <span class="material-symbols-outlined text-[18px]">edit_note</span>
        {{ t('diary.rewrite') }}
      </button>
    </div>

    <!-- 7. Score bars (subtle, at bottom) -->
    <div v-if="feedback.grammar?.score || feedback.vocabulary?.score || feedback.naturalness?.score" class="pt-2 space-y-2">
      <!-- Grammar -->
      <div v-if="feedback.grammar?.score" class="flex items-center gap-2">
        <span class="text-xs text-text-muted dark:text-slate-400 w-20 shrink-0">{{ t('diary.feedback.grammar') }}</span>
        <div class="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            class="h-full rounded-full transition-all"
            :class="getScoreBarBg(feedback.grammar.score)"
            :style="{ width: feedback.grammar.score + '%' }"
          ></div>
        </div>
        <span class="text-xs font-medium w-8 text-right" :class="getScoreColor(feedback.grammar.score)">{{ feedback.grammar.score }}</span>
      </div>
      <!-- Vocabulary -->
      <div v-if="feedback.vocabulary?.score" class="flex items-center gap-2">
        <span class="text-xs text-text-muted dark:text-slate-400 w-20 shrink-0">{{ t('diary.feedback.vocabulary') }}</span>
        <div class="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            class="h-full rounded-full transition-all"
            :class="getScoreBarBg(feedback.vocabulary.score)"
            :style="{ width: feedback.vocabulary.score + '%' }"
          ></div>
        </div>
        <span class="text-xs font-medium w-8 text-right" :class="getScoreColor(feedback.vocabulary.score)">{{ feedback.vocabulary.score }}</span>
      </div>
      <!-- Naturalness -->
      <div v-if="feedback.naturalness?.score" class="flex items-center gap-2">
        <span class="text-xs text-text-muted dark:text-slate-400 w-20 shrink-0">{{ t('diary.feedback.naturalness') }}</span>
        <div class="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            class="h-full rounded-full transition-all"
            :class="getScoreBarBg(feedback.naturalness.score)"
            :style="{ width: feedback.naturalness.score + '%' }"
          ></div>
        </div>
        <span class="text-xs font-medium w-8 text-right" :class="getScoreColor(feedback.naturalness.score)">{{ feedback.naturalness.score }}</span>
      </div>
      <!-- Effort -->
      <div v-if="feedback.effort?.score" class="flex items-center gap-2">
        <span class="text-xs text-text-muted dark:text-slate-400 w-20 shrink-0">{{ t('diary.feedback.effort') }}</span>
        <div class="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            class="h-full rounded-full transition-all"
            :class="getScoreBarBg(feedback.effort.score)"
            :style="{ width: feedback.effort.score + '%' }"
          ></div>
        </div>
        <span class="text-xs font-medium w-8 text-right" :class="getScoreColor(feedback.effort.score)">{{ feedback.effort.score }}</span>
      </div>
    </div>
  </div>
</template>
