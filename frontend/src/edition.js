/**
 * Which app this build is. Set at build time with VITE_EDITION:
 * - 'en' (default): Chat Mate, English for Mandarin speakers
 * - 'zh': Chat Mate 華語, Taiwan Mandarin (Traditional) for English speakers
 *
 * Import these constants instead of reading import.meta.env, so tests can mock this module
 * and the English build drops Chinese-only branches as dead code.
 * Plan: docs/plans/zh-edition.md
 */
export const EDITION = import.meta.env.VITE_EDITION === 'zh' ? 'zh' : 'en'
export const IS_ZH = EDITION === 'zh'

export const APP_NAME = IS_ZH ? 'Chat Mate 華語' : 'Chat Mate'

// The language being learned, and the language its examples are translated into
export const TARGET_LANG = IS_ZH ? 'zh' : 'en'
// lang attribute for target-language text: Traditional glyphs need zh-Hant-TW.
// null in the English edition, so Vue leaves the attribute off.
export const TARGET_LANG_TAG = IS_ZH ? 'zh-Hant-TW' : null
export const TRANSLATION_LANG = IS_ZH ? 'en' : 'zh'

// The Chinese edition fixes the learner's native language and the interface to English
export const FIXED_NATIVE_LANG = IS_ZH ? 'en' : null
export const FIXED_UI_LOCALE = IS_ZH ? 'en' : null

// Levels with content; the Chinese edition starts with beginner only
export const LEVELS = IS_ZH ? ['beginner'] : ['beginner', 'intermediate', 'advanced']
export const DEFAULT_LEVEL = IS_ZH ? 'beginner' : 'intermediate'

// Features the Chinese edition hides (tests build their edition mocks from this list)
export const HIDDEN_IN_ZH = [
  'dailyOpinion', // 今日觀點
  'opinionChat', // opinion chat with English connectors
  'retell', // say it three times: word count and WPM count English words
  'articles',
  'placementTest',
  'diary',
  'dailyChallenge',
  'roleplay', // scenario content is English
  'languageSwitch', // native language / interface language pickers
]

export function isFeatureEnabled(feature) {
  return !(IS_ZH && HIDDEN_IN_ZH.includes(feature))
}
