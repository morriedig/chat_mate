<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChatSummary } from '../../composables/useChatSummary'
import { useMistakes } from '../../composables/useMistakes'
import { useSpeakingQueue } from '../../composables/useSpeakingQueue'
import CmBottomSheet from '../ui/CmBottomSheet.vue'
import CmAvatar from '../ui/CmAvatar.vue'
import CmButton from '../ui/CmButton.vue'

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
const { queueRepeatTomorrow } = useSpeakingQueue()

const summary = ref(null)
// Each point shows its hint first; the answer stays hidden until asked for
const revealed = ref([])

const usedTargets = computed(() => {
  const fromAi = summary.value?.usedPatternIds || []
  return props.mission.targets.filter(tg => props.usedIds.includes(tg.id) || fromAi.includes(tg.id))
})
const missedTargets = computed(() => props.mission.targets.filter(tg => !usedTargets.value.includes(tg)))

async function load() {
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
  repeat.value = queueRepeatTomorrow(result.repeatTomorrow, { sourceId: props.mission.id || '' })
}

// "明天再說這句": booked for tomorrow, or waiting for the learner to replace tomorrow's sentence
const repeat = ref({ status: 'none' })
const repeatSentence = computed(() => (summary.value?.repeatTomorrow?.enabled ? summary.value.repeatTomorrow : null))

function replaceRepeat() {
  repeat.value = queueRepeatTomorrow(summary.value?.repeatTomorrow, { sourceId: props.mission.id || '', replace: true })
}

onMounted(load)
</script>

<template>
  <CmBottomSheet
    :title="t('taskChat.summaryTitle')"
    :description="t('taskChat.summaryIntro', { name: character.name })"
    :close-label="t('taskChat.keepChatting')"
    @close="emit('close')"
  >
    <template #leading>
      <CmAvatar :name="character.name" :size="48" />
    </template>

    <div class="chat-summary">
      <!-- 1. Metric: how many of today's patterns were used -->
      <div
        class="summary-metric relative mb-5 rounded-[14px] bg-accent-soft px-4 py-3.5"
        role="status"
        :aria-label="t('taskChat.patternsUsed', { used: usedTargets.length, total: mission.targets.length })"
      >
        <span class="absolute left-0 top-3.5 h-9 w-[3px] rounded-r-[3px] bg-accent" aria-hidden="true"></span>
        <p class="text-display font-medium text-ink tabular-nums" aria-hidden="true">{{ usedTargets.length }} / {{ mission.targets.length }}</p>
        <p class="text-caption text-ink-secondary" aria-hidden="true">{{ t('taskChat.patternsUsedLabel') }}</p>
      </div>

      <!-- 2. Target list: used and missed together; icon carries the status -->
      <section class="mb-5">
        <h3 class="mb-2 text-caption font-medium text-ink-secondary">{{ t('taskChat.todayPatterns') }}</h3>
        <ul class="divide-y divide-hairline overflow-hidden rounded-[10px] border border-hairline">
          <li
            v-for="tg in mission.targets"
            :key="tg.id"
            class="summary-target flex min-h-11 items-center gap-2.5 px-3 py-2.5 text-caption font-medium text-ink"
            :class="usedTargets.includes(tg) ? 'is-used bg-success-soft' : 'bg-surface'"
          >
            <span
              v-if="usedTargets.includes(tg)"
              class="flex size-5 shrink-0 items-center justify-center rounded-[6px] bg-success text-surface"
              aria-hidden="true"
            ><span class="material-symbols-outlined !text-[16px]">check</span></span>
            <span v-else class="size-5 shrink-0 rounded-[6px] border border-ink-muted" aria-hidden="true"></span>
            <span class="min-w-0 break-words">{{ tg.phrase }}</span>
            <span class="sr-only">, {{ usedTargets.includes(tg) ? t('mission.used') : t('mission.notUsed') }}</span>
          </li>
        </ul>
        <p v-if="missedTargets.length" class="mt-2 text-meta text-ink-muted">{{ t('taskChat.tryNextTime') }}</p>
      </section>

      <!-- 3. Corrections: hint first, answer on request -->
      <section>
        <h3 class="mb-2 text-caption font-medium text-ink-secondary">{{ t('taskChat.toFix') }}</h3>

        <!-- Loading: static skeleton shaped like a correction card -->
        <div v-if="isLoading" class="summary-loading rounded-[14px] border border-hairline p-3.5" role="status">
          <p class="mb-3 text-caption text-ink-muted">{{ t('taskChat.loading', { name: character.name }) }}</p>
          <div class="space-y-2" aria-hidden="true">
            <div class="h-3 w-4/5 rounded-[3px] bg-accent-soft"></div>
            <div class="h-3 w-full rounded-[3px] bg-surface-raised"></div>
            <div class="h-10 w-full rounded-[10px] bg-surface-raised"></div>
          </div>
        </div>

        <!-- Failure stays inside this section, with Retry -->
        <div v-else-if="failure" class="summary-failure flex items-start gap-2 rounded-[14px] bg-error-soft p-3" role="alert">
          <span class="material-symbols-outlined mt-0.5 text-error" aria-hidden="true">error</span>
          <div class="min-w-0 flex-1">
            <p class="text-caption text-ink">{{ failure === 'daily-limit' ? t('common.dailyLimit') : t('taskChat.unavailable') }}</p>
            <button
              v-if="failure !== 'daily-limit'"
              type="button"
              @click="load"
              class="summary-retry -mx-2 mt-1 inline-flex min-h-11 items-center gap-1 rounded-[10px] px-2 text-caption font-medium text-ink"
            >
              <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">refresh</span>{{ t('common.retry') }}
            </button>
          </div>
        </div>

        <template v-else-if="summary">
          <p v-if="!summary.points?.length" class="text-body text-ink">{{ t('taskChat.nothingToFix') }}</p>
          <ol class="space-y-3">
            <li v-for="(point, i) in summary.points" :key="i" class="summary-point rounded-[14px] border border-hairline bg-surface p-3.5">
              <p class="break-words text-body text-ink">“{{ point.original }}”</p>
              <div class="mt-2.5 rounded-[10px] bg-warning-soft px-3 py-2.5">
                <p class="text-caption font-medium text-warning">{{ t('taskChat.hint') }}</p>
                <p class="text-caption text-ink-secondary">{{ point.hint }}</p>
              </div>
              <div v-if="revealed.includes(i)" class="summary-answer mt-2 rounded-[10px] bg-success-soft px-3 py-2.5">
                <p class="flex items-center gap-1 text-caption font-medium text-success">
                  <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">check</span>{{ t('taskChat.suggested') }}
                </p>
                <p class="break-words text-body text-ink">{{ point.corrected }}</p>
                <p v-if="point.explanation" class="mt-1 text-caption text-ink-secondary">{{ point.explanation }}</p>
              </div>
              <button
                v-else
                type="button"
                @click="revealed.push(i)"
                class="summary-show-answer -mx-1 mt-1 inline-flex min-h-11 items-center rounded-[10px] px-1 text-caption font-medium text-accent"
              >{{ t('taskChat.showAnswer') }}</button>
            </li>
          </ol>
          <p v-if="summary.points?.length" class="mt-2 text-meta text-ink-muted">{{ t('taskChat.savedForReview') }}</p>

          <!-- 4. One sentence to say again tomorrow (the answer stays hidden until then) -->
          <div v-if="repeatSentence && repeat.status !== 'none'" class="summary-repeat mt-5 rounded-[14px] border border-hairline bg-surface p-3.5">
            <h3 class="flex items-center gap-1.5 text-caption font-medium text-ink-secondary">
              <span class="material-symbols-outlined !text-[18px] text-accent" aria-hidden="true">event_repeat</span>
              {{ t('taskChat.repeatTomorrow.title') }}
            </h3>
            <p class="mt-2 break-words text-body text-ink">“{{ repeatSentence.original }}”</p>
            <p class="mt-1 break-words text-caption text-ink-secondary">{{ repeatSentence.cue }}</p>
            <p v-if="repeat.status === 'queued'" class="mt-2 flex items-center gap-1 text-meta text-success" role="status">
              <span class="material-symbols-outlined !text-[16px]" aria-hidden="true">check</span>{{ t('taskChat.repeatTomorrow.queued') }}
            </p>
            <template v-else>
              <p class="mt-2 break-words text-meta text-ink-muted">{{ t('taskChat.repeatTomorrow.taken', { cue: repeat.item?.cue || '' }) }}</p>
              <button
                type="button"
                @click="replaceRepeat"
                class="summary-repeat-replace -mx-1 mt-1 inline-flex min-h-11 items-center rounded-[10px] px-1 text-caption font-medium text-accent"
              >{{ t('taskChat.repeatTomorrow.replace') }}</button>
            </template>
          </div>

          <p v-if="summary.encouragement" class="mt-4 text-body text-ink-secondary">{{ summary.encouragement }}</p>
        </template>
      </section>
    </div>

    <template #actions>
      <div class="grid grid-cols-2 gap-2">
        <CmButton variant="secondary" class="summary-keep" @click="emit('close')">{{ t('taskChat.keepChatting') }}</CmButton>
        <CmButton class="summary-home" @click="emit('home')">{{ t('taskChat.backHome') }}</CmButton>
      </div>
    </template>
  </CmBottomSheet>
</template>
