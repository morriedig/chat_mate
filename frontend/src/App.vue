<script setup>
import { useI18n } from 'vue-i18n'
import PwaUpdatePrompt from './components/PwaUpdatePrompt.vue'
import { useOnlineStatus } from './composables/useOnlineStatus'

const { t } = useI18n()
const { isOnline } = useOnlineStatus()
</script>

<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>

  <!-- Offline Banner -->
  <Transition name="offline-banner">
    <div
      v-if="!isOnline"
      role="status"
      class="safe-area-top fixed left-0 right-0 top-0 z-[200] border-b border-warning/25 bg-warning-soft"
    >
      <p class="flex min-h-11 items-center justify-center gap-2 px-4 py-2 text-center text-caption text-ink">
        <span class="material-symbols-outlined !text-[18px] shrink-0 text-warning" aria-hidden="true">wifi_off</span>
        {{ t('app.offline') }}
      </p>
    </div>
  </Transition>

  <PwaUpdatePrompt />
</template>

<style scoped>
.offline-banner-enter-active,
.offline-banner-leave-active {
  transition: opacity var(--motion-sheet) var(--ease-cm), transform var(--motion-sheet) var(--ease-cm);
}
.offline-banner-enter-from,
.offline-banner-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
