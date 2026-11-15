// What src/edition.js exports in each build, for vi.mock / vi.doMock('<path>/edition', () => zhEdition).
// Tests of English behavior pin enEdition so they stay green in a `VITE_EDITION=zh vitest run`.
const HIDDEN_IN_ZH = [
  'weeklyChapters', 'dailyOpinion', 'opinionChat', 'retell', 'articles',
  'placementTest', 'diary', 'dailyChallenge', 'roleplay', 'languageSwitch',
]

export const zhEdition = {
  EDITION: 'zh',
  IS_ZH: true,
  APP_NAME: 'Chat Mate 華語',
  TARGET_LANG: 'zh',
  TRANSLATION_LANG: 'en',
  FIXED_NATIVE_LANG: 'en',
  FIXED_UI_LOCALE: 'en',
  LEVELS: ['beginner'],
  DEFAULT_LEVEL: 'beginner',
  isFeatureEnabled: (feature) => !HIDDEN_IN_ZH.includes(feature),
}

export const enEdition = {
  EDITION: 'en',
  IS_ZH: false,
  APP_NAME: 'Chat Mate',
  TARGET_LANG: 'en',
  TRANSLATION_LANG: 'zh',
  FIXED_NATIVE_LANG: null,
  FIXED_UI_LOCALE: null,
  LEVELS: ['beginner', 'intermediate', 'advanced'],
  DEFAULT_LEVEL: 'intermediate',
  isFeatureEnabled: () => true,
}
