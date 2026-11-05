<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useRetell } from '../composables/useRetell'

const { t } = useI18n()
const router = useRouter()
const { doneToday, lastResult } = useRetell()

function open() {
  router.push('/retell')
}
</script>

<template>
  <!-- div[role=button] (not <button>) so the card can hold block content -->
  <div
    role="button"
    tabindex="0"
    @click="open"
    @keydown.enter.prevent="open"
    @keydown.space.prevent="open"
    class="retell-card cursor-pointer text-left p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99] bg-surface-light dark:bg-surface-dark"
    :class="doneToday ? 'border-green-300 dark:border-green-700' : 'border-slate-200 dark:border-slate-700'"
  >
    <div class="flex items-start gap-3">
      <span class="material-symbols-outlined text-2xl shrink-0" :class="doneToday ? 'text-green-500' : 'text-primary'">
        {{ doneToday ? 'check_circle' : 'record_voice_over' }}
      </span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <h3 class="font-bold text-text-main dark:text-white min-w-0">{{ t('retell.cardTitle') }}</h3>
          <span v-if="doneToday && lastResult" class="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
            {{ t('retell.wpm', { wpm: lastResult.rounds[lastResult.rounds.length - 1]?.wpm || 0 }) }}
          </span>
        </div>
        <p class="text-sm text-text-muted dark:text-slate-400 mt-1">
          {{ doneToday ? t('retell.cardDone') : t('retell.cardSubtitle') }}
        </p>
      </div>
      <span class="material-symbols-outlined text-text-muted dark:text-slate-500 shrink-0 self-center">chevron_right</span>
    </div>
  </div>
</template>
