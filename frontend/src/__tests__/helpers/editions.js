// What src/edition.js exports in each build, for vi.mock / vi.doMock('<path>/edition', () => zhEdition).
// Tests of English behavior pin enEdition so they stay green in a `VITE_EDITION=zh vitest run`.
import { vi } from 'vitest'

// The hidden-feature list comes from the real module (bypassing any mock of it),
// so the helpers can't drift from edition.js
const { HIDDEN_IN_ZH } = await vi.importActual('../../edition')

export const zhEdition = {
  EDITION: 'zh',
  IS_ZH: true,
  APP_NAME: 'Chat Mate 華語',
  TARGET_LANG: 'zh',
  TARGET_LANG_TAG: 'zh-Hant-TW',
  TRANSLATION_LANG: 'en',
  FIXED_NATIVE_LANG: 'en',
  FIXED_UI_LOCALE: 'en',
  LEVELS: ['beginner'],
  DEFAULT_LEVEL: 'beginner',
  HIDDEN_IN_ZH,
  isFeatureEnabled: (feature) => !HIDDEN_IN_ZH.includes(feature),
}

export const enEdition = {
  EDITION: 'en',
  IS_ZH: false,
  APP_NAME: 'Chat Mate',
  TARGET_LANG: 'en',
  TARGET_LANG_TAG: null,
  TRANSLATION_LANG: 'zh',
  FIXED_NATIVE_LANG: null,
  FIXED_UI_LOCALE: null,
  LEVELS: ['beginner', 'intermediate', 'advanced'],
  DEFAULT_LEVEL: 'intermediate',
  HIDDEN_IN_ZH,
  isFeatureEnabled: () => true,
}
