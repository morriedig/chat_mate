<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChatSummary } from '../../composables/useChatSummary'
import { useMistakes } from '../../composables/useMistakes'

const { t } = useI18n()

const props = defineProps({
  // Task chat from createPatternTask()
  mission: { type: Object, required: true },
  messages: { type: Array, required: true },
  usedIds: { type: Array, default: () => [] },
  character: { type: Object, required: true },
  level: { type: String, default: 'intermediate' },
  motherTongue: { type: String, default: 'zh' },
})
const emit = defineEmits(['close', 'home'])

const { isLoading, failure, summarize } = useChatSummary()
const { addMistake } = useMistakes()

const summary = ref(null)
// Each point shows its hint first; the answer stays hidden until asked for
const revealed = ref([])

const usedTargets = computed(() => {
  const fromAi = summary.value?.usedPatternIds || []
  return props.mission.targets.filter(tg => props.usedIds.includes(tg.id) || fromAi.includes(tg.id))
})
const missedTargets = computed(() => props.mission.targets.filter(tg => !usedTargets.value.includes(tg)))

onMounted(async () => {
  const result = await summarize({
    messages: props.messages,
    level: props.level,
    nativeLanguage: props.motherTongue,
    patterns: props.mission.targets,
  })
  if (!result) return
  summary.value = result
  for (const point of result.points || []) {
    addMistake({ ...point, source: 'summary' })
  }
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="emit('close')" />

      <div class="chat-summary relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-surface-light dark:bg-surface-dark shadow-2xl px-4 pt-5 pb-6 sm:p-6 safe-area-bottom">
        <div class="flex items-start gap-3 mb-5">
          <div class="flex items-center justify-center rounded-full size-12 shrink-0 shadow-sm bg-slate-100 dark:bg-slate-800 text-3xl">
            {{ character.avatar }}
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-lg font-bold text-text-main dark:text-white">{{ t('taskChat.summaryTitle') }}</h2>
            <p class="text-sm text-text-muted dark:text-slate-400">{{ t('taskChat.summaryIntro', { name: character.name }) }}</p>
          </div>
          <button
            @click="emit('close')"
            class="shrink-0 material-symbols-outlined text-xl text-text-muted dark:text-slate-400"
            :aria-label="t('taskChat.keepChatting')"
          >close</button>
        </div>

        <!-- Patterns used -->
        <section class="mb-5">
          <h3 class="flex items-center gap-1.5 text-sm font-semibold text-text-main dark:text-slate-200 mb-2">
            <span class="material-symbols-outlined text-[18px] text-emerald-500">flag</span>
            {{ t('taskChat.patternsUsed', { used: usedTargets.length, total: mission.targets.length }) }}
          </h3>
          <ul class="space-y-1.5">
            <li v-for="tg in usedTargets" :key="tg.id" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-sm text-text-main dark:text-slate-200">
              <span class="material-symbols-outlined text-[18px] text-emerald-500">check_circle</span><span class="min-w-0 break-words">{{ tg.phrase }}</span>
            </li>
            <li v-for="tg in missedTargets" :key="tg.id" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm text-text-muted dark:text-slate-400">
              <span class="material-symbols-outlined text-[18px]">radio_button_unchecked</span><span class="min-w-0 break-words">{{ tg.phrase }}</span>
            </li>
          </ul>
          <p v-if="missedTargets.length" class="mt-2 text-xs text-text-muted dark:text-slate-400">{{ t('taskChat.tryNextTime') }}</p>
        </section>

        <!-- Things to fix -->
        <section class="mb-5">
          <h3 class="flex items-center gap-1.5 text-sm font-semibold text-text-main dark:text-slate-200 mb-2">
            <span class="material-symbols-outlined text-[18px] text-amber-500">edit_note</span>
            {{ t('taskChat.toFix') }}
          </h3>
          <p v-if="isLoading" class="text-sm text-text-muted dark:text-slate-400">{{ t('taskChat.loading', { name: character.name }) }}</p>
          <p v-else-if="failure" class="text-sm text-text-muted dark:text-slate-400">
            {{ failure === 'daily-limit' ? t('common.dailyLimit') : t('taskChat.unavailable') }}
          </p>
          <template v-else-if="summary">
            <p v-if="!summary.points?.length" class="text-sm text-text-main dark:text-slate-200">{{ t('taskChat.nothingToFix') }}</p>
            <ol class="space-y-3">
              <li v-for="(point, i) in summary.points" :key="i" class="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900 space-y-1.5">
                <p class="text-sm text-text-main dark:text-slate-200 break-words">“{{ point.original }}”</p>
                <p class="text-sm text-amber-700 dark:text-amber-300">💡 {{ point.hint }}</p>
                <template v-if="revealed.includes(i)">
                  <p class="text-sm font-semibold text-green-700 dark:text-green-300 break-words">{{ point.corrected }}</p>
                  <p v-if="point.explanation" class="text-xs text-text-muted dark:text-slate-400">{{ point.explanation }}</p>
                </template>
                <button v-else @click="revealed.push(i)" class="text-xs font-semibold text-primary underline underline-offset-2">{{ t('taskChat.showAnswer') }}</button>
              </li>
            </ol>
            <p v-if="summary.points?.length" class="mt-2 text-xs text-text-muted dark:text-slate-400">{{ t('taskChat.savedForReview') }}</p>
            <p v-if="summary.encouragement" class="mt-3 text-sm text-text-main dark:text-slate-200">{{ summary.encouragement }}</p>
          </template>
        </section>

        <div class="grid grid-cols-2 gap-2">
          <button @click="emit('close')" class="py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-text-main dark:text-slate-200">
            {{ t('taskChat.keepChatting') }}
          </button>
          <button @click="emit('home')" class="py-2.5 rounded-xl text-sm font-semibold bg-primary text-white">
            {{ t('taskChat.backHome') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
