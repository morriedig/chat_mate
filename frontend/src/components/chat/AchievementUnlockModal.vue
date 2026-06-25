<script setup>
import { useUserProgress } from '../../composables/useUserProgress'

const { showAchievementUnlock, newAchievement, dismissAchievementUnlock } = useUserProgress()

function dismiss() {
  dismissAchievementUnlock()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="unlock-modal">
      <div
        v-if="showAchievementUnlock && newAchievement"
        class="modal-overlay fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="dismiss"
      >
        <div class="unlock-card relative w-full max-w-sm p-8 pt-12 rounded-3xl text-center overflow-hidden shadow-2xl bg-surface-light dark:bg-surface-dark border border-amber-200/50 dark:border-amber-800/30">
          <!-- Background glow -->
          <div class="absolute inset-0 bg-gradient-to-br from-amber-100/40 via-transparent to-rose-100/30 dark:from-amber-500/10 dark:to-rose-500/5 pointer-events-none"></div>

          <!-- Confetti -->
          <div class="celebration absolute inset-0 pointer-events-none overflow-hidden">
            <span
              v-for="i in 12"
              :key="i"
              class="confetti confetti-piece"
              :style="{
                '--delay': `${i * 0.08}s`,
                '--drift': `${(i % 2 === 0 ? 1 : -1) * (20 + (i * 5) % 60)}px`,
                '--rotation': `${Math.random() * 720 - 360}deg`,
                left: `${10 + (i * 6) % 80}%`
              }"
            >
              {{ ['🎉', '✨', '🌟', '⭐', '🎊'][i % 5] }}
            </span>
          </div>

          <!-- Badge -->
          <div class="relative mb-5 inline-flex items-center justify-center">
            <div class="absolute inset-0 rounded-full bg-amber-300/40 dark:bg-amber-500/20 blur-2xl"></div>
            <div class="badge-icon-large relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 dark:from-amber-400 dark:via-amber-500 dark:to-amber-600 flex items-center justify-center text-5xl shadow-lg badge-bounce">
              {{ newAchievement.icon }}
            </div>
          </div>

          <!-- Title -->
          <p class="relative text-xs font-bold tracking-[0.25em] uppercase text-amber-600 dark:text-amber-400 mb-2">
            {{ $t('achievements.unlocked') }}
          </p>
          <h2 class="relative text-2xl font-bold text-text-main dark:text-white mb-2">
            {{ $t(`achievements.${newAchievement.id}.title`) }}
          </h2>
          <p class="relative text-sm text-text-muted dark:text-slate-400 mb-5 max-w-xs mx-auto leading-relaxed">
            {{ $t(`achievements.${newAchievement.id}.description`) }}
          </p>

          <!-- Category -->
          <span class="relative inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-6">
            <span class="material-symbols-outlined text-[14px]">workspace_premium</span>
            {{ $t(`achievements.categories.${newAchievement.category}`) }}
          </span>

          <!-- Continue -->
          <button
            @click="dismiss"
            class="continue-btn relative w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            {{ $t('achievements.continue') }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.unlock-modal-enter-active,
.unlock-modal-leave-active {
  transition: opacity 280ms ease;
}
.unlock-modal-enter-active .unlock-card,
.unlock-modal-leave-active .unlock-card {
  transition: transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 280ms ease;
}
.unlock-modal-enter-from,
.unlock-modal-leave-to {
  opacity: 0;
}
.unlock-modal-enter-from .unlock-card,
.unlock-modal-leave-to .unlock-card {
  opacity: 0;
  transform: scale(0.85) translateY(20px);
}

.badge-bounce {
  animation: badge-in 700ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes badge-in {
  0% { transform: scale(0) rotate(-30deg); }
  60% { transform: scale(1.15) rotate(8deg); }
  100% { transform: scale(1) rotate(0); }
}

.confetti-piece {
  position: absolute;
  top: -20px;
  font-size: 1.25rem;
  opacity: 0;
  animation: confetti-drift 2.2s ease-out forwards;
  animation-delay: var(--delay);
}
@keyframes confetti-drift {
  0% {
    opacity: 0;
    transform: translate(0, -20px) rotate(0deg);
  }
  15% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(var(--drift), 420px) rotate(var(--rotation));
  }
}
</style>
