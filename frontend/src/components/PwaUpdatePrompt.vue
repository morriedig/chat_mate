<script setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const intervalMS = 60 * 60 * 1000 // check every hour

const {
  needRefresh,
  updateServiceWorker
} = useRegisterSW({
  onRegisteredSW(swUrl, registration) {
    if (!registration) return
    setInterval(async () => {
      if (registration.installing) return
      if (!navigator.onLine) return
      try {
        await registration.update()
      } catch {
        // Network error — will retry next interval
      }
    }, intervalMS)
  }
})

function update() {
  updateServiceWorker()
}

function dismiss() {
  needRefresh.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="pwa-toast">
      <div
        v-if="needRefresh"
        class="fixed inset-x-4 bottom-[max(16px,env(safe-area-inset-bottom))] z-[9999] mx-auto max-w-md rounded-[14px] border border-hairline bg-surface p-4 shadow-[var(--cm-shadow-float)]"
        role="alert"
      >
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined mt-0.5 shrink-0 text-accent" aria-hidden="true">system_update</span>
          <div class="min-w-0 flex-1">
            <p class="text-body font-medium text-ink">{{ t('pwa.updateAvailable') }}</p>
            <p class="mt-0.5 text-caption text-ink-secondary">{{ t('pwa.updateMessage') }}</p>
          </div>
        </div>
        <div class="mt-3 flex justify-end gap-2">
          <button
            type="button"
            @click="dismiss"
            class="min-h-11 rounded-[10px] px-3 text-caption font-medium text-ink-secondary active:bg-surface-raised"
          >
            {{ t('pwa.later') }}
          </button>
          <button
            type="button"
            @click="update"
            class="min-h-11 rounded-[10px] bg-accent px-4 text-caption font-medium text-on-accent active:bg-accent-pressed"
          >
            {{ t('pwa.update') }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.pwa-toast-enter-active,
.pwa-toast-leave-active {
  transition: opacity var(--motion-sheet) var(--ease-cm), transform var(--motion-sheet) var(--ease-cm);
}
.pwa-toast-enter-from,
.pwa-toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
