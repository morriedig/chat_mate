// The English edition's constants as named exports, for tests that check English behavior.
// Pinning them keeps those tests green under `VITE_EDITION=zh vitest run` too.
// Usage: vi.mock('../../edition', () => import('../helpers/englishEdition'))
// Single source: enEdition in ./editions.js
import { enEdition } from './editions'

export const {
  EDITION, IS_ZH, APP_NAME, TARGET_LANG, TARGET_LANG_TAG, TRANSLATION_LANG,
  FIXED_NATIVE_LANG, FIXED_UI_LOCALE, LEVELS, DEFAULT_LEVEL, HIDDEN_IN_ZH, isFeatureEnabled,
} = enEdition
