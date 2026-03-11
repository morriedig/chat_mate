import { ref, onMounted, onBeforeUnmount } from 'vue'

const isOnline = ref(navigator.onLine)

function handleOnline() { isOnline.value = true }
function handleOffline() { isOnline.value = false }

// Global listeners (only attach once)
let listenersAttached = false
if (!listenersAttached) {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  listenersAttached = true
}

export function useOnlineStatus() {
  return { isOnline }
}
