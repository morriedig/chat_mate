import { ref } from 'vue'

const STORAGE_KEY = 'chatmate_voice_pause_ms'

// How long a pause ends your turn when speaking
export const PAUSE_CHOICES = [1500, 2500, 4000]
export const DEFAULT_PAUSE_MS = 2500

function readPause() {
  try {
    const saved = Number(localStorage.getItem(STORAGE_KEY))
    return PAUSE_CHOICES.includes(saved) ? saved : DEFAULT_PAUSE_MS
  } catch {
    return DEFAULT_PAUSE_MS
  }
}

// Shared across components
const pauseMs = ref(readPause())

export function getPauseMs() {
  return pauseMs.value
}

export function setPauseMs(ms) {
  if (!PAUSE_CHOICES.includes(ms)) return
  pauseMs.value = ms
  try { localStorage.setItem(STORAGE_KEY, String(ms)) } catch { /* storage unavailable */ }
}

export function useVoiceSettings() {
  return { pauseMs, setPauseMs, PAUSE_CHOICES }
}
