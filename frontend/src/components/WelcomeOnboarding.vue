<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CmButton from './ui/CmButton.vue'
import CmProgress from './ui/CmProgress.vue'

const { t } = useI18n()

const emit = defineEmits(['close', 'take-test'])

const step = ref(0)

// Each page has one line-art diagram: message exchange, remembered note, level path
const slides = [
  { art: 'messages', title: 'welcome.slide1Title', body: 'welcome.slide1Body' },
  { art: 'note', title: 'welcome.slide2Title', body: 'welcome.slide2Body' },
  { art: 'path', title: 'welcome.slide3Title', body: 'welcome.slide3Body' },
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
    <div
      class="fixed inset-0 z-[120] flex flex-col bg-page safe-area-inset"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div class="mx-auto flex h-full w-full max-w-md flex-col px-5">
        <!-- Page indicator + skip -->
        <div class="flex min-h-14 items-center gap-3">
          <span class="shrink-0 text-meta text-ink-muted tabular-nums" aria-live="polite">{{ t('welcome.pageOf', { current: step + 1, total: slides.length }) }}</span>
          <CmProgress class="flex-1" :value="step + 1" :max="slides.length" :label="t('welcome.pageOf', { current: step + 1, total: slides.length })" />
          <button
            v-if="step < slides.length - 1"
            type="button"
            @click="skip"
            class="-mr-2 min-h-11 shrink-0 rounded-[10px] px-2 text-caption text-ink-secondary"
          >
            {{ t('welcome.skipIntro') }}
          </button>
        </div>

        <!-- Page content: one fade-and-rise per page change -->
        <div :key="step" class="welcome-page flex min-h-0 flex-1 flex-col">
          <!-- Illustration: upper 42% -->
          <div class="flex h-[42%] min-h-[160px] items-center justify-center text-accent" aria-hidden="true">
            <svg v-if="slides[step].art === 'messages'" viewBox="0 0 200 140" class="h-full max-h-[200px] w-auto" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
              <rect x="20" y="22" width="104" height="40" rx="10" />
              <path d="M34 62 L30 74 L46 62" />
              <line x1="36" y1="38" x2="104" y2="38" />
              <line x1="36" y1="48" x2="84" y2="48" />
              <rect x="76" y="80" width="104" height="40" rx="10" class="opacity-60" />
              <path d="M166 120 L170 132 L154 120" class="opacity-60" />
              <line x1="92" y1="96" x2="160" y2="96" class="opacity-60" />
              <line x1="92" y1="106" x2="136" y2="106" class="opacity-60" />
            </svg>
            <svg v-else-if="slides[step].art === 'note'" viewBox="0 0 200 140" class="h-full max-h-[200px] w-auto" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
              <rect x="50" y="14" width="100" height="116" rx="6" />
              <line x1="66" y1="14" x2="66" y2="130" class="opacity-60" />
              <line x1="78" y1="40" x2="134" y2="40" />
              <line x1="78" y1="56" x2="134" y2="56" />
              <line x1="78" y1="72" x2="118" y2="72" />
              <line x1="78" y1="88" x2="134" y2="88" class="opacity-60" />
              <line x1="78" y1="104" x2="110" y2="104" class="opacity-60" />
              <path d="M124 14 V34 L131 28 L138 34 V14" />
            </svg>
            <svg v-else viewBox="0 0 200 140" class="h-full max-h-[200px] w-auto" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
              <path d="M30 116 H74 V84 H118 V52 H170" class="opacity-60" />
              <rect x="22" y="108" width="16" height="16" rx="3" />
              <rect x="66" y="76" width="16" height="16" rx="3" />
              <rect x="110" y="44" width="16" height="16" rx="3" fill="currentColor" />
              <line x1="170" y1="52" x2="170" y2="20" />
              <path d="M170 20 L186 26 L170 32" />
            </svg>
          </div>

          <!-- Copy -->
          <div class="pt-2">
            <h2 id="welcome-title" class="text-display font-medium text-ink">{{ t(slides[step].title) }}</h2>
            <p class="mt-3 text-body text-ink-secondary">{{ t(slides[step].body) }}</p>
          </div>
        </div>

        <!-- Actions pinned above the home indicator -->
        <div class="space-y-2 pb-4 pt-4">
          <CmButton v-if="step < slides.length - 1" block @click="next">
            {{ t('welcome.next') }}
          </CmButton>
          <template v-else>
            <CmButton block @click="takeTest">
              {{ t('welcome.takeTest') }}
            </CmButton>
            <CmButton block variant="secondary" @click="finish">
              {{ t('welcome.skipPick') }}
            </CmButton>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.welcome-page {
  animation: welcome-page-in var(--motion-enter) var(--ease-cm) both;
}
@keyframes welcome-page-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .welcome-page { animation: none; }
}
</style>
