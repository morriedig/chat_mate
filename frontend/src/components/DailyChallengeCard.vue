<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDailyChallenge } from '../composables/useDailyChallenge'
import CmProgress from './ui/CmProgress.vue'

const { t } = useI18n()
const props = defineProps({
  level: { type: String, default: 'intermediate' },
  language: { type: String, default: 'en' },
})
const emit = defineEmits(['start'])

const {
  getTodayTopic,
  isChallengeCompleted,
  challengeMessageCount,
} = useDailyChallenge()

const topic = computed(() => getTodayTopic(props.level, props.language))
const progress = computed(() => Math.min(challengeMessageCount.value, 5))
</script>

<template>
  <div
    class="rounded-[14px] border p-4"
    :class="isChallengeCompleted ? 'border-success/25 bg-success-soft' : 'border-hairline bg-surface shadow-[var(--cm-shadow-small)]'"
  >
    <div class="flex items-start gap-3">
      <span class="material-symbols-outlined shrink-0" :class="isChallengeCompleted ? 'text-success' : 'text-ink-muted'" aria-hidden="true">
        {{ isChallengeCompleted ? 'task_alt' : 'today' }}
      </span>
      <div class="min-w-0 flex-1">
        <h3 class="text-body font-medium text-ink">{{ t('dailyChallenge.title') }}</h3>
        <p class="mt-0.5 text-caption text-ink-secondary">{{ t('dailyChallenge.todaysTopic') }}: {{ topic }}</p>

        <!-- Progress -->
        <div v-if="!isChallengeCompleted && progress > 0" class="mt-2 flex items-center gap-2">
          <CmProgress class="flex-1" :value="progress" :max="5" :label="t('dailyChallenge.title')" />
          <span class="shrink-0 text-meta text-ink-muted tabular-nums">{{ t('dailyChallenge.progress', { current: progress }) }}</span>
        </div>

        <!-- Completed state -->
        <p v-if="isChallengeCompleted" class="mt-2 text-caption font-medium text-success">
          {{ t('dailyChallenge.completed') }} · {{ t('dailyChallenge.completedMessage') }}
        </p>
        <!-- Start button -->
        <button
          v-if="!isChallengeCompleted && progress === 0"
          type="button"
          @click="emit('start')"
          class="mt-3 min-h-11 rounded-[10px] border border-hairline bg-surface-raised px-3 text-caption font-medium text-ink active:bg-surface-sunken"
        >
          {{ t('dailyChallenge.startChallenge') }}
        </button>
      </div>
      <span v-if="isChallengeCompleted" class="shrink-0 pt-0.5 text-meta text-success">
        {{ t('dailyChallenge.alreadyCompleted') }}
      </span>

    </div>
  </div>
</template>
