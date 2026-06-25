<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['close', 'take-test'])

const step = ref(0)

const slides = [
  {
    icon: '💬',
    title: 'Language learning that feels like texting a friend',
    body: 'No flashcard grind. No boring lessons. Just real conversations with characters who feel like people you\'d actually know.',
  },
  {
    icon: '🧠',
    title: 'They remember you',
    body: 'Tell Emma about your cat, your job, your trip to Kyoto — she\'ll bring it up next time. Your relationship grows across sessions.',
  },
  {
    icon: '🌱',
    title: 'Level-calibrated, not dumbed-down',
    body: 'We match their speech to your level — simple at beginner, witty and slang-heavy at advanced. Take a 2-minute test to start in the right place.',
  },
]

function next() {
  if (step.value < slides.length - 1) {
    step.value++
  } else {
    finish()
  }
}

function skip() {
  finish()
}

function takeTest() {
  try { localStorage.setItem('chatmate_onboarded', '1') } catch {}
  emit('take-test')
}

function finish() {
  try { localStorage.setItem('chatmate_onboarded', '1') } catch {}
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="welcome" appear>
      <div class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="welcome-card relative w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-3xl shadow-2xl overflow-hidden">
          <!-- Hero -->
          <div class="p-8 pt-12 text-center bg-gradient-to-br from-primary/10 via-transparent to-rose-100/30 dark:from-primary/20 dark:via-transparent dark:to-rose-900/20">
            <div class="welcome-icon text-6xl mb-5 inline-block">{{ slides[step].icon }}</div>
            <h2 class="text-xl sm:text-2xl font-bold text-text-main dark:text-white mb-3 tracking-tight leading-tight">
              {{ slides[step].title }}
            </h2>
            <p class="text-sm text-text-muted dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
              {{ slides[step].body }}
            </p>
          </div>

          <!-- Controls -->
          <div class="p-6 pt-5 space-y-4">
            <!-- Dots -->
            <div class="flex justify-center gap-1.5">
              <span
                v-for="(s, i) in slides"
                :key="i"
                class="h-1.5 rounded-full transition-all duration-300"
                :class="i === step ? 'w-6 bg-primary' : 'w-1.5 bg-slate-200 dark:bg-slate-700'"
              />
            </div>

            <!-- Primary -->
            <button
              v-if="step < slides.length - 1"
              @click="next"
              class="w-full py-3 rounded-xl font-semibold bg-primary text-[#0d171b] hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md"
            >
              Next
            </button>
            <template v-else>
              <button
                @click="takeTest"
                class="w-full py-3 rounded-xl font-semibold bg-primary text-[#0d171b] hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md"
              >
                Take the 2-minute placement test
              </button>
              <button
                @click="finish"
                class="w-full py-2.5 rounded-xl font-medium text-sm text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white transition-colors"
              >
                Skip — I'll pick my level manually
              </button>
            </template>

            <!-- Skip link -->
            <button
              v-if="step < slides.length - 1"
              @click="skip"
              class="w-full text-xs text-text-muted dark:text-slate-500 hover:text-text-main dark:hover:text-slate-300 transition-colors"
            >
              Skip intro
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.welcome-enter-active,
.welcome-leave-active {
  transition: opacity 320ms ease;
}
.welcome-enter-active .welcome-card,
.welcome-leave-active .welcome-card {
  transition: transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 280ms ease;
}
.welcome-enter-from,
.welcome-leave-to {
  opacity: 0;
}
.welcome-enter-from .welcome-card,
.welcome-leave-to .welcome-card {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.welcome-icon {
  animation: welcome-icon-in 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes welcome-icon-in {
  0% { transform: scale(0) rotate(-20deg); opacity: 0; }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
</style>
