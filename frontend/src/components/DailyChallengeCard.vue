<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDailyChallenge } from '../composables/useDailyChallenge'

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
  <div class="p-4 rounded-xl border-2 transition-all"
    :class="isChallengeCompleted
      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
      : 'border-amber-300 dark:border-amber-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20'"
  >
    <div class="flex items-start gap-3">
      <span class="material-symbols-outlined text-2xl" :class="isChallengeCompleted ? 'text-green-500' : 'text-amber-500'">
        {{ isChallengeCompleted ? 'check_circle' : 'local_fire_department' }}
      </span>
      <div class="flex-1">
        <h3 class="font-bold text-text-main dark:text-white">{{ t('dailyChallenge.title') }}</h3>
        <p class="text-sm text-text-muted dark:text-slate-400 mt-1">{{ t('dailyChallenge.todaysTopic') }}: {{ topic }}</p>

        <!-- Progress bar -->
        <div v-if="!isChallengeCompleted && progress > 0" class="mt-2">
          <div class="flex justify-between text-xs text-text-muted dark:text-slate-400 mb-1">
            <span>{{ t('dailyChallenge.progress', { current: progress }) }}</span>
          </div>
          <div class="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div class="h-full rounded-full bg-amber-400 transition-all" :style="{ width: `${(progress / 5) * 100}%` }" />
          </div>
        </div>

        <!-- Completed state -->
        <p v-if="isChallengeCompleted" class="text-sm text-green-600 dark:text-green-400 font-medium mt-2">
          {{ t('dailyChallenge.completed') }} {{ t('dailyChallenge.completedMessage') }}
        </p>
      </div>

      <!-- Start button -->
      <button
        v-if="!isChallengeCompleted && progress === 0"
        @click="emit('start')"
        class="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
      >
        {{ t('dailyChallenge.startChallenge') }}
      </button>
      <span v-else-if="isChallengeCompleted" class="text-xs text-green-500 font-medium shrink-0">
        {{ t('dailyChallenge.alreadyCompleted') }}
      </span>
    </div>
  </div>
</template>
