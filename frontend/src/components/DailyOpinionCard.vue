<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMotherTongue } from '../composables/useMotherTongue'
import { useDailyOpinion, getConnectorInfo } from '../composables/useDailyOpinion'

const { t } = useI18n()
const emit = defineEmits(['open'])
const { motherTongue } = useMotherTongue()
const { question, connectorIds, isDoneToday, last7Days, streak, refreshDay } = useDailyOpinion()

// Date may have rolled over since the app was opened
onMounted(refreshDay)

const gloss = computed(() => (motherTongue.value === 'en' ? '' : question.value[motherTongue.value]))
const connectors = computed(() => connectorIds.value.map(id => getConnectorInfo(id, motherTongue.value)))
</script>

<template>
  <!-- div[role=button] (not <button>) so the card can hold block content -->
  <div
    role="button"
    tabindex="0"
    @click="emit('open')"
    @keydown.enter.prevent="emit('open')"
    @keydown.space.prevent="emit('open')"
    class="cursor-pointer text-left p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
    :class="isDoneToday
      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
      : 'border-primary/40 bg-gradient-to-br from-primary/10 to-sky-400/5 dark:from-primary/20 dark:to-sky-400/10'"
  >
    <div class="flex items-start gap-3">
      <span
        class="material-symbols-outlined text-2xl shrink-0"
        :class="isDoneToday ? 'text-green-500' : 'text-primary'"
      >{{ isDoneToday ? 'check_circle' : 'lightbulb' }}</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <h3 class="font-bold text-text-main dark:text-white">{{ t('dailyOpinion.cardTitle') }}</h3>
          <span
            class="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
            :class="isDoneToday
              ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
              : 'bg-primary/15 text-sky-700 dark:text-primary'"
          >{{ isDoneToday ? t('dailyOpinion.doneToday') : t('dailyOpinion.notDoneToday') }}</span>
        </div>

        <p class="text-sm font-medium text-text-main dark:text-slate-200 mt-1.5 break-words">{{ question.en }}</p>
        <p v-if="gloss" class="text-xs text-text-muted dark:text-slate-400 mt-0.5 break-words">{{ gloss }}</p>

        <div class="flex flex-wrap items-center gap-1.5 mt-2">
          <span class="text-xs text-text-muted dark:text-slate-400">{{ t('dailyOpinion.todaysConnectors') }}:</span>
          <span
            v-for="c in connectors"
            :key="c.id"
            class="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-text-main dark:text-slate-200"
          >{{ c.word }}</span>
        </div>

        <!-- 7-day dot row -->
        <div class="flex items-center gap-2 mt-3">
          <div class="flex items-center gap-1.5" :aria-label="t('dailyOpinion.last7Days')">
            <span
              v-for="d in last7Days"
              :key="d.key"
              :title="d.key"
              class="size-2.5 rounded-full"
              :class="[
                d.done ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700',
                d.isToday ? 'ring-2 ring-offset-1 ring-primary/60 ring-offset-transparent' : '',
              ]"
            ></span>
          </div>
          <span v-if="streak > 0" class="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
            <span class="material-symbols-outlined text-[14px]">local_fire_department</span>
            {{ t('dailyOpinion.streakDays', { count: streak }) }}
          </span>
        </div>
      </div>
      <span class="material-symbols-outlined text-text-muted dark:text-slate-500 shrink-0 self-center">chevron_right</span>
    </div>
  </div>
</template>
