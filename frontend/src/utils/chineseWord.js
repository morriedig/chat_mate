/**
 * The whole Chinese word at a character offset (Chinese has no spaces, so a tap
 * would otherwise pick one character). Falls back to the single character when
 * Intl.Segmenter is missing or the offset isn't inside a word.
 */
let segmenter = null

export function chineseWordAt(text, offset) {
  const str = String(text || '')
  if (offset < 0 || offset >= str.length) return ''
  if (typeof Intl === 'undefined' || typeof Intl.Segmenter !== 'function') return str[offset]
  if (!segmenter) segmenter = new Intl.Segmenter('zh-TW', { granularity: 'word' })
  for (const { segment, index, isWordLike } of segmenter.segment(str)) {
    if (offset >= index && offset < index + segment.length) return isWordLike ? segment : str[offset]
  }
  return str[offset]
}
