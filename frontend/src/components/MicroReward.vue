<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'sparkle', // 'sparkle', 'confetti', 'check'
  }
})

const emit = defineEmits(['done'])
const visible = ref(true)

onMounted(() => {
  setTimeout(() => {
    visible.value = false
    emit('done')
  }, 1200)
})

// Vibrate on mobile if supported (must be in onMounted for SSR safety)
onMounted(() => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(50)
  }
})
</script>

<template>
  <Transition name="reward">
    <div v-if="visible" class="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      <!-- Sparkle -->
      <template v-if="type === 'sparkle'">
        <div class="sparkle-container">
          <span v-for="i in 8" :key="i" class="sparkle" :style="{ '--i': i }" />
        </div>
      </template>

      <!-- Confetti -->
      <template v-else-if="type === 'confetti'">
        <div class="confetti-container">
          <span v-for="i in 20" :key="i" class="confetti-piece" :style="{ '--i': i, '--c': ['#2badee', '#fbbf24', '#34d399', '#f472b6', '#a78bfa'][i % 5] }" />
        </div>
      </template>

      <!-- Check -->
      <template v-else-if="type === 'check'">
        <div class="check-circle">
          <span class="material-symbols-outlined text-4xl text-white">check</span>
        </div>
      </template>
    </div>
  </Transition>
</template>

<style scoped>
.reward-leave-active {
  transition: opacity 0.3s ease;
}
.reward-leave-to {
  opacity: 0;
}

/* Sparkle */
.sparkle-container {
  position: relative;
  width: 60px;
  height: 60px;
}

.sparkle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fbbf24;
  top: 50%;
  left: 50%;
  animation: sparkleOut 0.8s ease-out forwards;
  animation-delay: calc(var(--i) * 0.05s);
}

@keyframes sparkleOut {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(-50% + cos(calc(var(--i) * 45deg)) * 40px),
      calc(-50% + sin(calc(var(--i) * 45deg)) * 40px)
    ) scale(1);
    opacity: 0;
  }
}

/* Confetti */
.confetti-container {
  position: relative;
  width: 200px;
  height: 200px;
}

.confetti-piece {
  position: absolute;
  width: 8px;
  height: 12px;
  background: var(--c);
  top: 50%;
  left: 50%;
  border-radius: 2px;
  animation: confettiFall 1s ease-out forwards;
  animation-delay: calc(var(--i) * 0.03s);
}

@keyframes confettiFall {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) scale(0);
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(-50% + (var(--i) - 10) * 15px),
      calc(-50% + 100px)
    ) rotate(calc(var(--i) * 90deg)) scale(1);
    opacity: 0;
  }
}

/* Check */
.check-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #34d399;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: checkPop 0.5s ease-out;
}

@keyframes checkPop {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
