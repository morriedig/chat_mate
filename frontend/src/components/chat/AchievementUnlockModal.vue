<script setup>
import { useUserProgress } from '../../composables/useUserProgress'
import { achievementIcon } from './achievementIcon'

const { showAchievementUnlock, newAchievement, dismissAchievementUnlock } = useUserProgress()

function dismiss() {
  dismissAchievementUnlock()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="cm-sheet">
      <div
        v-if="showAchievementUnlock && newAchievement"
        class="modal-overlay fixed inset-0 z-[120] flex items-end justify-center bg-[var(--cm-scrim)] sm:items-center sm:p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('achievements.unlocked')"
        @click.self="dismiss"
      >
        <div class="unlock-card cm-sheet-panel w-full rounded-t-[24px] bg-surface px-5 pt-6 pb-[max(24px,env(safe-area-inset-bottom))] text-center shadow-[var(--cm-shadow-float)] sm:max-w-sm sm:rounded-[20px] sm:pb-6">
          <span class="badge-icon-large mx-auto mb-4 flex size-16 items-center justify-center rounded-[14px] bg-accent-soft text-accent" aria-hidden="true">
            <span class="material-symbols-outlined !text-[32px]">{{ achievementIcon(newAchievement) }}</span>
          </span>

          <p class="mb-1 text-caption text-ink-muted">
            {{ $t('achievements.unlocked') }} · {{ $t(`achievements.categories.${newAchievement.category}`) }}
          </p>
          <h2 class="mb-2 text-section font-medium text-ink">
            {{ $t(`achievements.${newAchievement.id}.title`) }}
          </h2>
          <p class="mx-auto mb-6 max-w-xs text-body text-ink-secondary">
            {{ $t(`achievements.${newAchievement.id}.description`) }}
          </p>

          <button
            type="button"
            @click="dismiss"
            class="continue-btn min-h-12 w-full rounded-[10px] bg-accent px-4 text-body font-medium text-on-accent active:bg-accent-pressed"
          >
            {{ $t('achievements.continue') }}
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
