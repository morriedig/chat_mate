<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showAchievementUnlock && newAchievement" class="modal-overlay" @click.self="dismiss">
        <div class="modal-content">
          <!-- Celebration Effect -->
          <div class="celebration">
            <span v-for="i in 12" :key="i" class="confetti" :style="{ '--delay': `${i * 0.1}s`, '--rotation': `${Math.random() * 360}deg` }">
              {{ ['🎉', '✨', '🌟', '⭐'][i % 4] }}
            </span>
          </div>

          <!-- Badge Icon -->
          <div class="badge-icon-large">
            {{ newAchievement.icon }}
          </div>

          <!-- Title -->
          <h2 class="modal-title">{{ $t('achievements.unlocked') }}</h2>

          <!-- Achievement Info -->
          <div class="achievement-info">
            <h3 class="achievement-title">{{ $t(`achievements.${newAchievement.id}.title`) }}</h3>
            <p class="achievement-desc">{{ $t(`achievements.${newAchievement.id}.description`) }}</p>
          </div>

          <!-- Category Tag -->
          <span class="category-tag">{{ $t(`achievements.categories.${newAchievement.category}`) }}</span>

          <!-- Continue Button -->
          <button @click="dismiss" class="continue-btn">
            {{ $t('achievements.continue') }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useUserProgress } from '../../composables/useUserProgress'

const { showAchievementUnlock, newAchievement, dismissAchievementUnlock } = useUserProgress()

function dismiss() {
  dismissAchievementUnlock()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 24px;
  padding: 40px 32px;
  text-align: center;
  max-width: 340px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.dark .modal-content {
  background: #1f2937;
}

.celebration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  font-size: 1.5rem;
  animation: confetti-fall 2s ease-out forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

@keyframes confetti-fall {
  0% {
    top: -20px;
    left: 50%;
    opacity: 1;
    transform: translateX(-50%) rotate(0deg);
  }
  100% {
    top: 100%;
    left: calc(50% + (var(--rotation) / 3));
    opacity: 0;
    transform: translateX(-50%) rotate(var(--rotation));
  }
}

.badge-icon-large {
  font-size: 4rem;
  margin-bottom: 16px;
  animation: bounce-in 0.5s ease-out;
}

@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f59e0b;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.achievement-info {
  margin-bottom: 16px;
}

.achievement-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.dark .achievement-title {
  color: #f3f4f6;
}

.achievement-desc {
  font-size: 0.9rem;
  color: #6b7280;
}

.dark .achievement-desc {
  color: #9ca3af;
}

.category-tag {
  display: inline-block;
  padding: 4px 12px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.dark .category-tag {
  background: #78350f;
  color: #fde68a;
}

.continue-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.continue-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}
</style>
