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
    class="retell-card relative min-h-16 cursor-pointer rounded-[14px] border border-hairline bg-surface p-4 text-left shadow-[var(--cm-shadow-small)]"
  >
    <div class="flex items-start gap-2.5">
      <span class="material-symbols-outlined shrink-0" :class="doneToday ? 'text-success' : 'text-accent'" aria-hidden="true">
        {{ doneToday ? 'task_alt' : 'mic' }}
      </span>
      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-2">
          <h3 class="min-w-0 text-body font-medium text-ink">{{ t('retell.cardTitle') }}</h3>
          <span v-if="doneToday && lastResult" class="shrink-0 pt-0.5 text-meta text-ink-muted tabular-nums">
            {{ t('retell.wpm', { wpm: lastResult.rounds[lastResult.rounds.length - 1]?.wpm || 0 }) }}
          </span>
        </div>
        <p class="mt-0.5 text-caption" :class="doneToday ? 'text-success' : 'text-ink-secondary'">
          {{ doneToday ? t('retell.cardDone') : t('retell.cardSubtitle') }}
        </p>
      </div>
    </div>
  </div>
</template>
