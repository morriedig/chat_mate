<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDailyPractice } from '../composables/useDailyPractice'

const { t } = useI18n()
const emit = defineEmits(['open'])
const { coreStep, coreDoneCount, remainingCount, isDoneToday, ensureTodayPlan } = useDailyPractice()

const CORE_STEPS = ['error', 'pattern', 'speaking']
const subtitle = computed(() => {
  if (isDoneToday.value) {
    return remainingCount.value > 0 ? t('dailyPractice.cardMore', { count: remainingCount.value }) : t('dailyPractice.cardAllDone')
  }
  if (coreDoneCount.value === 0) return t('dailyPractice.cardCore')
  return t('dailyPractice.cardResume', { step: t(`dailyPractice.core.steps.${coreStep.value}`) })
})

// Date may have rolled over since the app was opened
onMounted(ensureTodayPlan)
</script>

<template>
  <!-- div[role=button] (not <button>) so the card can hold block content.
       Step 1 is the current step until done: accent-soft fill + margin rule. -->
  <div
    role="button"
    tabindex="0"
    @click="emit('open')"
    @keydown.enter.prevent="emit('open')"
    @keydown.space.prevent="emit('open')"
    class="relative min-h-16 cursor-pointer rounded-[14px] border p-4 text-left shadow-[var(--cm-shadow-small)]"
    :class="isDoneToday ? 'border-hairline bg-surface' : 'border-accent/30 bg-accent-soft pl-[18px]'"
  >
    <span v-if="!isDoneToday" class="absolute left-0 top-3.5 h-9 w-[3px] rounded-r-[3px] bg-accent" aria-hidden="true"></span>
    <div class="flex items-start gap-2.5">
      <span
        class="material-symbols-outlined shrink-0"
        :class="isDoneToday ? 'text-success' : 'text-accent'"
        aria-hidden="true"
      >{{ isDoneToday ? 'task_alt' : 'school' }}</span>
      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-body font-medium text-ink">{{ t('dailyPractice.cardTitle') }}</h3>
          <span
            class="shrink-0 pt-0.5 text-meta tabular-nums"
            :class="isDoneToday ? 'font-medium text-success' : 'text-ink-muted'"
          >{{ isDoneToday ? t('dailyPractice.core.doneTitle') : `${coreDoneCount} / 3` }}</span>
        </div>
        <p class="mt-0.5 text-caption text-ink-secondary break-words">{{ subtitle }}</p>
        <!-- The three core steps, each marked when finished -->
        <ul v-if="!isDoneToday" class="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          <li v-for="(step, i) in CORE_STEPS" :key="step" class="flex min-w-0 items-center gap-1 text-meta" :class="i < coreDoneCount ? 'text-success' : 'text-ink-secondary'">
            <span class="material-symbols-outlined shrink-0 !text-[16px]" aria-hidden="true">{{ i < coreDoneCount ? 'check_circle' : 'radio_button_unchecked' }}</span>
            <span class="min-w-0">{{ t(`dailyPractice.core.steps.${step}`) }}</span>
            <span v-if="i < coreDoneCount" class="sr-only">, {{ t('dailyPractice.core.stepDone') }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
