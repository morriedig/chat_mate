/**
 * Pinyin for AI chat replies in the Chinese edition (chapter and daily content
 * carry pinyin written in the YAML).
 *
 * Traditional text is first converted to Simplified character by character
 * (opencc-js `tw` → `cn`; never a phrase converter like `twp`, which changes
 * words and their length, e.g. 計程車 → 出租车), then annotated with pinyin-pro.
 * Annotating Traditional text directly gets common words wrong (怎麼 zěn mó,
 * 銀行 yín xíng, 還沒 huán méi).
 *
 * Both packages (~206 KB gzip) load with a dynamic import that is only reachable
 * when IS_ZH, so the English build has no pinyin chunk.
 */
import { IS_ZH } from '../edition'

/**
 * Readings pinyin-pro still gets wrong after conversion, or Taiwan readings.
 * Only entries that can't spoil other words: 東西 → dōng xi is left out because
 * it would also change 東西南北; Taiwan 和 hàn is left out because 和 is only
 * read hàn as a conjunction.
 * Keys are Simplified, since that is what pinyin-pro sees.
 */
export const CUSTOM_PINYIN = {
  长得: 'zhǎng de', // 長得很高 (pinyin-pro: cháng dé)
  垃圾: 'lè sè', // Taiwan reading
}

/**
 * Build an annotator from a Traditional → Simplified converter and pinyin-pro's
 * `pinyin`. Returns text → [{ char, pinyin }] (pinyin '' for non-Chinese characters),
 * keeping the original Traditional characters.
 */
export function createAnnotator(toSimplified, pinyinFn) {
  return function annotate(text) {
    const original = Array.from(String(text || ''))
    const converted = Array.from(toSimplified(original.join('')))
    // Character-level conversion keeps the length; if it ever doesn't, read the original
    const source = converted.length === original.length ? converted : original
    const readings = pinyinFn(source.join(''), { type: 'all' })
    return original.map((char, i) => ({ char, pinyin: readings[i]?.isZh ? readings[i].pinyin : '' }))
  }
}

/**
 * One line of pinyin for a sentence: syllables separated by spaces,
 * punctuation kept after the syllable before it.
 */
export function pinyinLine(chars) {
  let out = ''
  for (const { char, pinyin } of chars) {
    if (pinyin) {
      out += (out && !out.endsWith(' ') ? ' ' : '') + pinyin
    } else if (/\s/.test(char)) {
      if (out && !out.endsWith(' ')) out += ' '
    } else {
      out += char
    }
  }
  return out.trim()
}

let loading = null

/**
 * Load the converter and pinyin-pro once. Resolves to text → pinyin line,
 * or null in the English edition or when loading fails.
 */
export function loadPinyin() {
  if (!IS_ZH) return Promise.resolve(null)
  if (!loading) {
    loading = Promise.all([import('opencc-js/t2cn'), import('pinyin-pro')])
      .then(([opencc, pinyinPro]) => {
        const toSimplified = (opencc.default || opencc).Converter({ from: 'tw', to: 'cn' })
        pinyinPro.customPinyin(CUSTOM_PINYIN)
        const annotate = createAnnotator(toSimplified, pinyinPro.pinyin)
        return text => pinyinLine(annotate(text))
      })
      .catch(() => {
        loading = null
        return null
      })
  }
  return loading
}
