import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
  function updateDarkClass() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem('chatmate_darkMode', isDark.value ? 'dark' : 'light')
    updateDarkClass()
  }

  function init() {
    const stored = localStorage.getItem('chatmate_darkMode')
    if (stored) {
      isDark.value = stored === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    updateDarkClass()
  }

  onMounted(() => {
    init()
  })

  return {
    isDark,
    toggle,
    init
  }
}
