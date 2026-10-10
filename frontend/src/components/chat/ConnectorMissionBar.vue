<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  // [{ id, phrase }]
  targets: {
    type: Array,
    required: true
  },
  usedIds: {
    type: Array,
    default: () => []
  },
  // Phrase of the connector just used (shows a short friend-style note)
  justUsed: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['back'])

const usedCount = computed(() => props.targets.filter(tg => props.usedIds.includes(tg.id)).length)
const isComplete = computed(() => props.targets.length > 0 && usedCount.value === props.targets.length)
</script>

<template>
  <div
    class="shrink-0 px-4 py-2.5 border-b transition-colors"
    :class="isComplete
      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      : 'bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-700'"
  >
    <div class="flex items-center justify-between gap-2 mb-1.5">
      <span class="flex items-center gap-1 text-xs font-semibold text-text-muted dark:text-slate-400">
        <span class="material-symbols-outlined text-[16px]">flag</span>
        {{ t('mission.title') }}
      </span>
      <span class="text-xs font-semibold" :class="isComplete ? 'text-green-600 dark:text-green-400' : 'text-primary'">
        {{ usedCount }} / {{ targets.length }}
      </span>
    </div>

    <!-- Target chips -->
    <div class="flex flex-wrap gap-1.5">
      <span
        v-for="target in targets"
        :key="target.id"
        class="mission-chip inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium border transition-all"
        :class="usedIds.includes(target.id)
          ? 'bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 is-used'
          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-text-main dark:text-slate-200'"
      >
        <span class="material-symbols-outlined text-[16px]">
          {{ usedIds.includes(target.id) ? 'check_circle' : 'radio_button_unchecked' }}
        </span>
        {{ target.phrase }}
      </span>
    </div>

    <!-- Friend-style note -->
    <p v-if="isComplete" class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-green-700 dark:text-green-300">
      <span>{{ t('mission.complete') }}</span>
      <button
        @click="emit('back')"
        class="inline-flex items-center gap-0.5 text-xs font-semibold underline underline-offset-2 hover:opacity-80"
      >
        {{ t('mission.backToLearning') }}
      </button>
    </p>
    <p v-else-if="justUsed" class="mt-2 text-sm text-primary">
      {{ t('mission.nice', { phrase: justUsed }) }}
    </p>
  </div>
</template>

<style scoped>
.mission-chip.is-used {
  animation: chipPop 0.4s ease-out;
}

@keyframes chipPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.12); }
  100% { transform: scale(1); }
}
</style>
