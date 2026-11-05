// CEFR text codes shown in place of level emoji (DESIGN.md "Avatar treatment")
const LEVEL_CODES = {
  beginner: 'A1–A2',
  intermediate: 'B1–B2',
  advanced: 'C1–C2',
}

export function levelCode(levelId) {
  return LEVEL_CODES[levelId] || ''
}

// Text codes shown in place of flag emoji
const LANGUAGE_CODES = {
  en: 'EN',
  zh: '中文',
  ja: '日本語',
}

export function languageCode(langId) {
  return LANGUAGE_CODES[langId] || String(langId || '').toUpperCase()
}
