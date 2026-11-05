import { watch } from 'vue'
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ja from './locales/ja.json'
import zh from './locales/zh.json'
import { supportedLanguages } from '../composables/useMotherTongue'

// A saved locale for a hidden language (e.g. Japanese) falls back to English
const storedLocale = localStorage.getItem('chatmate_locale')
const savedLocale = supportedLanguages.some(l => l.id === storedLocale) ? storedLocale : 'en'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { en, ja, zh }
})

// <html lang> drives the CJK type rules in style.css
const HTML_LANG = { zh: 'zh-TW', ja: 'ja', en: 'en' }
if (typeof document !== 'undefined') {
  watch(i18n.global.locale, (loc) => {
    document.documentElement.lang = HTML_LANG[loc] || 'en'
  }, { immediate: true })
}

export default i18n
