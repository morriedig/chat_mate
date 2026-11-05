<script setup>
import { useI18n } from 'vue-i18n'
import { useUserProgress } from '../../composables/useUserProgress'

const { t } = useI18n()
const { showLevelUp, newRank, dismissLevelUp, progress } = useUserProgress()
</script>

<template>
  <Teleport to="body">
    <Transition name="cm-sheet">
      <div
        v-if="showLevelUp && newRank"
        class="fixed inset-0 z-50 flex items-end justify-center bg-[var(--cm-scrim)] sm:items-center sm:p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="t('rank.levelUp')"
        @click.self="dismissLevelUp"
      >
        <div class="cm-sheet-panel w-full rounded-t-[24px] bg-surface px-5 pt-6 pb-[max(24px,env(safe-area-inset-bottom))] text-center shadow-[var(--cm-shadow-float)] sm:max-w-sm sm:rounded-[20px] sm:pb-6">
          <span class="mx-auto mb-4 flex size-16 items-center justify-center rounded-[14px] bg-accent-soft text-accent" aria-hidden="true">
            <span class="material-symbols-outlined !text-[32px]">trending_up</span>
          </span>

          <h2 class="mb-1 text-title font-medium text-ink">{{ t('rank.levelUp') }}</h2>

          <p class="mb-1 text-display font-medium text-ink tabular-nums">Lv.{{ newRank.level }}</p>
          <p class="mb-1 text-body text-ink-secondary">{{ t(`ranks.${newRank.title.toLowerCase()}`, newRank.title) }}</p>
          <p class="mb-6 text-caption text-ink-muted tabular-nums">{{ t('rank.totalXP', { xp: progress.totalXP }) }}</p>

          <button
            type="button"
            @click="dismissLevelUp"
            class="min-h-12 w-full rounded-[10px] bg-accent px-4 text-body font-medium text-on-accent active:bg-accent-pressed"
          >
            {{ t('rank.continue') }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Sheet: opacity + 12 px rise only */
.cm-sheet-enter-active,
.cm-sheet-leave-active {
  transition: opacity var(--motion-sheet) var(--ease-cm);
}
.cm-sheet-enter-active .cm-sheet-panel,
.cm-sheet-leave-active .cm-sheet-panel {
  transition: transform var(--motion-sheet) var(--ease-cm);
}
.cm-sheet-enter-from,
.cm-sheet-leave-to {
  opacity: 0;
}
.cm-sheet-enter-from .cm-sheet-panel,
.cm-sheet-leave-to .cm-sheet-panel {
  transform: translateY(12px);
}
</style>
