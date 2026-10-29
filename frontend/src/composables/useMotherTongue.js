import { ref, watch } from 'vue'

const STORAGE_KEY = 'chatmate_motherTongue'

// Supported languages for mother tongue
const allLanguages = [
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { id: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { id: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇹🇼' }
]

// Japanese is hidden while the app focuses on English; its chapters stay in data/
const HIDDEN_LANGUAGES = ['ja']

export const supportedLanguages = allLanguages.filter(lang => !HIDDEN_LANGUAGES.includes(lang.id))

// Get saved mother tongue or default to 'en'
function getSavedMotherTongue() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && supportedLanguages.some(l => l.id === saved)) {
    return saved
  }
  return 'en'
}

// Shared reactive state
const motherTongue = ref(getSavedMotherTongue())

export function useMotherTongue() {
  // Save to localStorage when changed
  watch(motherTongue, (newValue) => {
    localStorage.setItem(STORAGE_KEY, newValue)
  })

  function setMotherTongue(langId) {
    if (supportedLanguages.some(l => l.id === langId)) {
      motherTongue.value = langId
    }
  }

  function getMotherTongueInfo() {
    return supportedLanguages.find(l => l.id === motherTongue.value) || supportedLanguages[0]
  }

  return {
    motherTongue,
    supportedLanguages,
    setMotherTongue,
    getMotherTongueInfo
  }
}
