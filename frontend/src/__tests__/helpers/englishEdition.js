// The English edition's constants, for tests that check English behavior.
// Pinning them keeps those tests green under `VITE_EDITION=zh vitest run` too.
// Usage: vi.mock('../../edition', () => import('../helpers/englishEdition'))
export const EDITION = 'en'
export const IS_ZH = false
export const APP_NAME = 'Chat Mate'
export const TARGET_LANG = 'en'
export const TRANSLATION_LANG = 'zh'
export const FIXED_NATIVE_LANG = null
export const FIXED_UI_LOCALE = null
export const LEVELS = ['beginner', 'intermediate', 'advanced']
export const DEFAULT_LEVEL = 'intermediate'
export function isFeatureEnabled() {
  return true
}
