<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMotherTongue } from '../composables/useMotherTongue'
import { useDailyOpinion, getConnectorInfo } from '../composables/useDailyOpinion'
import CmChip from './ui/CmChip.vue'

const { t } = useI18n()
const emit = defineEmits(['open'])
const { motherTongue } = useMotherTongue()
const { question, connectorIds, isDoneToday, last7Days, streak, refreshDay } = useDailyOpinion()

// Date may have rolled over since the app was opened
onMounted(refreshDay)

const gloss = computed(() => (motherTongue.value === 'en' ? '' : question.value[motherTongue.value]))
const connectors = computed(() => connectorIds.value.map(id => getConnectorInfo(id, motherTongue.value)))
const doneDays = computed(() => last7Days.value.filter(d => d.done).length)
</script>

<template>
  <!-- div[role=button] (not <button>) so the card can hold block content -->
  <div
    role="button"
    tabindex="0"
    @click="emit('open')"
    @keydown.enter.prevent="emit('open')"
    @keydown.space.prevent="emit('open')"
    class="cursor-pointer rounded-[14px] border border-hairline bg-surface p-4 text-left shadow-[var(--cm-shadow-small)]"
  >
    <div class="flex items-start gap-3">
      <span
        class="material-symbols-outlined shrink-0"
        :class="isDoneToday ? 'text-success' : 'text-ink-muted'"
        aria-hidden="true"
      >{{ isDoneToday ? 'task_alt' : 'lightbulb' }}</span>
      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-body font-medium text-ink">{{ t('dailyOpinion.cardTitle') }}</h3>
          <span class="shrink-0 pt-0.5 text-meta" :class="isDoneToday ? 'text-success' : 'text-ink-muted'">
            {{ isDoneToday ? t('dailyOpinion.doneToday') : t('dailyOpinion.cardDuration') }}
          </span>
        </div>

        <p lang="en" class="mt-0.5 text-caption text-ink break-words">{{ question.en }}</p>
        <p v-if="gloss" class="text-meta text-ink-secondary break-words">{{ gloss }}</p>

        <div class="mt-2 flex flex-wrap items-center gap-1.5">
          <span class="text-meta text-ink-muted">{{ t('dailyOpinion.todaysConnectors') }}</span>
          <CmChip v-for="c in connectors" :key="c.id">{{ c.word }}</CmChip>
        </div>

        <!-- 7-day record: filled square = done; today has an accent outline -->
        <div class="mt-3 flex items-center gap-2">
          <div class="flex items-center gap-1.5" role="img" :aria-label="t('dailyOpinion.last7Days', { count: doneDays })">
            <span
              v-for="d in last7Days"
              :key="d.key"
              :title="d.key"
              class="size-2.5 rounded-[2px] border"
              :class="[
                d.done ? 'bg-success border-success' : 'bg-surface-raised border-transparent',
                d.isToday && !d.done ? '!border-accent' : '',
              ]"
            ></span>
          </div>
          <span v-if="streak > 0" class="text-meta text-ink-muted tabular-nums">
            {{ t('dailyOpinion.streakDays', { count: streak }) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
