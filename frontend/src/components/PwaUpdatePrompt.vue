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
        class="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-md rounded-xl bg-gray-900 p-4 shadow-lg shadow-black/20 ring-1 ring-white/10"
        role="alert"
      >
        <div class="flex items-start gap-3">
          <span class="mt-0.5 text-xl">🔄</span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-white">{{ t('pwa.updateAvailable') }}</p>
            <p class="mt-0.5 text-xs text-gray-400">{{ t('pwa.updateMessage') }}</p>
          </div>
        </div>
        <div class="mt-3 flex gap-2 justify-end">
          <button
            @click="dismiss"
            class="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-white"
          >
            {{ t('pwa.later') }}
          </button>
          <button
            @click="update"
            class="rounded-lg bg-[#2badee] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#2badee]/80"
          >
            {{ t('pwa.update') }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.pwa-toast-enter-active {
  transition: all 0.3s ease-out;
}
.pwa-toast-leave-active {
  transition: all 0.2s ease-in;
}
.pwa-toast-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.pwa-toast-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
