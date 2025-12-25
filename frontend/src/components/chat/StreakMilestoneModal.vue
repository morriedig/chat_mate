<script setup>
import { useI18n } from 'vue-i18n'
import { useUserProgress } from '../../composables/useUserProgress'

const { t } = useI18n()
const { showStreakMilestone, currentMilestone, dismissStreakMilestone } = useUserProgress()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showStreakMilestone && currentMilestone"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="dismissStreakMilestone"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Modal Content -->
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
          <!-- Fire Background Animation -->
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="fire-container">
              <div v-for="i in 15" :key="i" class="fire-particle" :style="{ '--delay': `${i * 0.15}s`, '--x': `${Math.random() * 100}%` }"></div>
            </div>
          </div>

          <!-- Content -->
          <div class="relative p-6 text-center">
            <!-- Streak Icon Animation -->
            <div class="text-6xl mb-4 animate-bounce">
              {{ currentMilestone.icon }}
            </div>

            <!-- Streak Achievement Text -->
            <h2 class="text-2xl font-bold text-text-main dark:text-white mb-2">
              {{ t('rank.streakBonus') }}
            </h2>

            <!-- Days Count -->
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 mb-3">
              <span class="text-2xl">🔥</span>
              <span class="text-xl font-bold text-red-600 dark:text-red-400">
                {{ t('rank.streakMilestone', { days: currentMilestone.days }) }}
              </span>
            </div>

            <!-- Bonus XP -->
            <div class="text-lg font-semibold text-green-600 dark:text-green-400 mb-6">
              +{{ currentMilestone.bonus }} XP
            </div>

            <!-- Continue Button -->
            <button
              @click="dismissStreakMilestone"
              class="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold shadow-lg transition-all"
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

.fire-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow: hidden;
}

.fire-particle {
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: -20px;
  left: var(--x);
  background: radial-gradient(circle, #ff6b35 0%, #f7931e 50%, transparent 70%);
  border-radius: 50%;
  animation: fireRise 2s ease-out var(--delay) infinite;
  opacity: 0.7;
}

.fire-particle:nth-child(odd) {
  width: 15px;
  height: 15px;
  background: radial-gradient(circle, #ff4500 0%, #ff6b35 50%, transparent 70%);
}

.fire-particle:nth-child(3n) {
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, #ffd700 0%, #ff6b35 50%, transparent 70%);
}

@keyframes fireRise {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
  50% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(-300px) scale(0.3);
    opacity: 0;
  }
}
</style>
