/**
 * Target-phrase detection for connectors (because, so that, on top of that…).
 *
 * A target looks like:
 *   { id: 'so-that', phrases: ['so that'], accept?: ({ before, after, match }) => boolean }
 *
 * - Matching is case-insensitive and word-boundary aware ("also" won't match "Alsop").
 * - Longer phrases win over shorter ones that overlap them, so "so that" does not
 *   also count as "so", and "because of" does not also count as "because".
 * - `accept` lets a target reject ambiguous uses (e.g. "so good", "since 2019").
 */

const WORD_CHAR = '[\\p{L}\\p{N}_]'

// Curly apostrophes → straight, keeping string length so indices stay valid
function normalize(text) {
  return text.replace(/[‘’ʼ]/g, "'")
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function phraseToRegex(phrase) {
  const body = normalize(phrase.trim())
    .split(/\s+/)
    .map(escapeRegex)
    .join('\\s+')
  // "so that" must not match inside "so that's", so a trailing 's / 'd also blocks
  return new RegExp(`(?<!${WORD_CHAR}|${WORD_CHAR}')${body}(?!${WORD_CHAR}|'${WORD_CHAR})`, 'giu')
}

/**
 * Find connector spans in a text.
 * @param {string} text
 * @param {Array} targets
 * @returns {Array<{ id: string, start: number, end: number }>} non-overlapping, sorted by start
 */
export function findConnectorSpans(text, targets) {
  if (!text || !Array.isArray(targets) || targets.length === 0) return []
  const src = normalize(text)

  const candidates = []
  for (const target of targets) {
    for (const phrase of target.phrases || []) {
      for (const m of src.matchAll(phraseToRegex(phrase))) {
        const start = m.index
        const end = start + m[0].length
        if (target.accept && !target.accept({ before: src.slice(0, start), after: src.slice(end), match: m[0] })) {
          continue
        }
        candidates.push({ id: target.id, start, end })
      }
    }
  }

  // Longest match first (then earliest), greedily claim non-overlapping spans
  candidates.sort((a, b) => (b.end - b.start) - (a.end - a.start) || a.start - b.start)
  const claimed = []
  for (const c of candidates) {
    if (!claimed.some(s => c.start < s.end && s.start < c.end)) claimed.push(c)
  }
  return claimed.sort((a, b) => a.start - b.start)
}

/**
 * Detect which targets appear in a text.
 * @returns {string[]} unique target ids, in order of first appearance
 */
export function detectConnectors(text, targets) {
  const ids = []
  for (const span of findConnectorSpans(text, targets)) {
    if (!ids.includes(span.id)) ids.push(span.id)
  }
  return ids
}

/**
 * Split a text into plain / connector segments for highlighting.
 * @returns {Array<{ text: string, id: string|null }>}
 */
export function splitByConnectors(text, targets) {
  if (!text) return []
  const segments = []
  let cursor = 0
  for (const span of findConnectorSpans(text, targets)) {
    if (span.start > cursor) segments.push({ text: text.slice(cursor, span.start), id: null })
    segments.push({ text: text.slice(span.start, span.end), id: span.id })
    cursor = span.end
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), id: null })
  return segments
}
