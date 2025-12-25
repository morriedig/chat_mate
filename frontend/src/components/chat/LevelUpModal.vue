<script setup>
import { useI18n } from 'vue-i18n'
import { useUserProgress } from '../../composables/useUserProgress'

const { t } = useI18n()
const { showLevelUp, newRank, dismissLevelUp, progress } = useUserProgress()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showLevelUp && newRank"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="dismissLevelUp"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Modal Content -->
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
          <!-- Confetti Background -->
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="confetti-container">
              <div v-for="i in 20" :key="i" class="confetti" :style="{ '--delay': `${i * 0.1}s`, '--x': `${Math.random() * 100}%` }"></div>
            </div>
          </div>

          <!-- Content -->
          <div class="relative p-6 text-center">
            <!-- Trophy Animation -->
            <div class="text-6xl mb-4 animate-bounce">
              {{ newRank.icon }}
            </div>

            <!-- Level Up Text -->
            <h2 class="text-2xl font-bold text-text-main dark:text-white mb-2">
              {{ t('rank.levelUp') }}
            </h2>

            <!-- New Rank -->
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 mb-4">
              <span class="text-lg font-bold text-amber-700 dark:text-amber-300">
                Lv.{{ newRank.level }}
              </span>
              <span class="text-lg font-semibold text-amber-600 dark:text-amber-400">
                {{ t(`ranks.${newRank.title.toLowerCase()}`, newRank.title) }}
              </span>
            </div>

            <!-- Total XP -->
            <p class="text-sm text-text-muted dark:text-slate-400 mb-6">
              {{ t('rank.totalXP', { xp: progress.totalXP }) }}
            </p>

            <!-- Continue Button -->
            <button
              @click="dismissLevelUp"
              class="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg transition-all"
            >
              {{ t('rank.continue') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active {
  animation: modalIn 0.3s ease-out;
}

.modal-leave-active {
  animation: modalOut 0.2s ease-in forwards;
}

@keyframes modalIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes modalOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.9);
  }
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  left: var(--x);
  background: linear-gradient(135deg, #f59e0b, #f97316);
  border-radius: 2px;
  animation: confettiFall 3s ease-out var(--delay) infinite;
}

.confetti:nth-child(odd) {
  background: linear-gradient(135deg, #fbbf24, #fb923c);
  width: 8px;
  height: 8px;
}

.confetti:nth-child(3n) {
  background: linear-gradient(135deg, #fcd34d, #fdba74);
  width: 6px;
  height: 6px;
}

@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(300px) rotate(720deg);
    opacity: 0;
  }
}
</style>
