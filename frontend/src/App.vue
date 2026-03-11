<script setup>
import { useRouter } from 'vue-router'
import PwaUpdatePrompt from './components/PwaUpdatePrompt.vue'
import { useOnlineStatus } from './composables/useOnlineStatus'

const { isOnline } = useOnlineStatus()
const router = useRouter()
</script>

<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>

  <!-- Offline Banner -->
  <Transition name="slide-down">
    <div v-if="!isOnline" class="fixed top-0 left-0 right-0 z-[200] bg-amber-500 text-white text-center text-sm py-2 px-4 shadow-md safe-area-top">
      <span class="material-symbols-outlined text-sm align-middle mr-1">wifi_off</span>
      You're offline. Some features may be limited.
    </div>
  </Transition>

  <PwaUpdatePrompt />
</template>
