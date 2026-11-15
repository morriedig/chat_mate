import { watch } from 'vue'
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ja from './locales/ja.json'
import zh from './locales/zh.json'
import { supportedLanguages } from '../composables/useMotherTongue'
import { IS_ZH, FIXED_UI_LOCALE } from '../edition'
import zhEditionEn from './locales/zh-edition.en.json'

// A saved locale for a hidden language (e.g. Japanese) falls back to English.
// The Chinese edition's interface is always English, whatever chatmate_locale says.
function initialLocale() {
  if (FIXED_UI_LOCALE) return FIXED_UI_LOCALE
  const storedLocale = localStorage.getItem('chatmate_locale')
  return supportedLanguages.some(l => l.id === storedLocale) ? storedLocale : 'en'
}

// Deep-merges the Chinese edition's overrides (strings that say "English") into en.json
function mergeMessages(base, overrides) {
  const out = { ...base }
  for (const [key, value] of Object.entries(overrides)) {
    out[key] = value && typeof value === 'object' && !Array.isArray(value)
      ? mergeMessages(base[key] || {}, value)
      : value
  }
  return out
}

const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: 'en',
  messages: { en: IS_ZH ? mergeMessages(en, zhEditionEn) : en, ja, zh }
})

// <html lang> drives the CJK type rules in style.css
const HTML_LANG = { zh: 'zh-TW', ja: 'ja', en: 'en' }
if (typeof document !== 'undefined') {
  watch(i18n.global.locale, (loc) => {
    document.documentElement.lang = HTML_LANG[loc] || 'en'
  }, { immediate: true })
}

export default i18n
