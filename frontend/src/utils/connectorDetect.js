// Detect "Giving Reasons" connectors (chapters/en/intermediate/09-giving-reasons.yml)
// in free text. Pure functions — no Vue, no storage — so they can be shared by
// the daily drill, chat summaries and tests.

// Connector id → surface forms. Ids match the chapter's word ids.
// Multi-word forms are matched before single words, and a matched span is
// "consumed", so "so that" never also counts as "so" and "because of" never
// also counts as "because".
export const CONNECTOR_PATTERNS = {
  'because': ['because'],
  'since': ['since'],
  'due-to': ['due to'],
  'because-of': ['because of'],
  // "as" is everywhere ("as well as", "such as"); only count it as a reason
  // connector at the start of a sentence, which is how the chapter teaches it.
  'as': [{ phrase: 'as', sentenceStart: true }],
  'so': ['so'],
  'which-is-why': ['which is why', "that's why", 'that is why'],
  'in-order-to': ['in order to'],
  // Purpose "to" can't be told apart from "go to school" by string matching,
  // so it is intentionally not detectable (and not picked as a daily target).
  'to-purpose': [],
  'so-that': ['so that'],
  'another-reason-is': ['another reason is', 'another reason was', 'another reason'],
  'plus': ['plus'],
  'also': ['also'],
  'on-top-of-that': ['on top of that'],
  'whats-your-take': ["what's your take", 'what is your take'],
}

// Phrases that contain a connector word but are NOT that connector.
// They are matched first and consume their span without producing a hit.
const BLOCKERS = [
  'even so', 'so far', 'so much', 'so many', 'and so on', 'or so',
  'ever since', 'as well as', 'as soon as', 'as long as', 'as far as', 'such as',
]

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Build a case-insensitive, word-boundary-aware regex for a phrase.
// Spaces match any whitespace; apostrophes match both ' and ’.
function phraseRegex(phrase) {
  const body = phrase
    .split(/\s+/)
    .map(w => escapeRegExp(w).replace(/'/g, "['’]"))
    .join('\\s+')
  return new RegExp(`(?<![\\p{L}\\p{N}'’])${body}(?![\\p{L}\\p{N}'’])`, 'giu')
}

// Flatten into a list sorted longest-first (by word count, then length)
const COMPILED = (() => {
  const list = []
  for (const phrase of BLOCKERS) {
    list.push({ id: null, phrase, sentenceStart: false })
  }
  for (const [id, forms] of Object.entries(CONNECTOR_PATTERNS)) {
    for (const form of forms) {
      const f = typeof form === 'string' ? { phrase: form } : form
      list.push({ id, phrase: f.phrase, sentenceStart: !!f.sentenceStart })
    }
  }
  const words = p => p.split(/\s+/).length
  list.sort((a, b) => words(b.phrase) - words(a.phrase) || b.phrase.length - a.phrase.length)
  return list.map(item => ({ ...item, re: phraseRegex(item.phrase) }))
})()

function isSentenceStart(text, index) {
  const before = text.slice(0, index).trimEnd()
  return before === '' || /[.!?…。！？\n]$/.test(before) || /[.!?]["'”’)]$/.test(before)
}

/**
 * Find every connector occurrence in the text.
 * @param {string} text
 * @returns {Array<{ id: string, start: number, end: number, text: string }>} sorted by start
 */
export function findConnectorSpans(text) {
  if (!text || typeof text !== 'string') return []
  const taken = [] // [start, end) ranges already consumed
  const spans = []

  const overlaps = (s, e) => taken.some(([ts, te]) => s < te && e > ts)

  for (const item of COMPILED) {
    item.re.lastIndex = 0
    let m
    while ((m = item.re.exec(text)) !== null) {
      const start = m.index
      const end = start + m[0].length
      if (overlaps(start, end)) continue
      if (item.sentenceStart && !isSentenceStart(text, start)) continue
      taken.push([start, end])
      if (item.id) spans.push({ id: item.id, start, end, text: m[0] })
    }
  }

  return spans.sort((a, b) => a.start - b.start)
}

/**
 * Which of the target connectors appear in the text?
 * @param {string} text - user's answer
 * @param {Array<string|{id: string}>} [targets] - connector ids to look for; omit for all
 * @returns {string[]} matched target ids, in the order given by `targets`
 */
export function detectConnectors(text, targets) {
  const found = new Set(findConnectorSpans(text).map(s => s.id))
  const ids = targets
    ? targets.map(t => (typeof t === 'string' ? t : t?.id)).filter(Boolean)
    : Object.keys(CONNECTOR_PATTERNS)
  return [...new Set(ids)].filter(id => found.has(id))
}

/**
 * Split text into plain/highlight segments for rendering.
 * @param {string} text
 * @param {string[]} [highlightIds] - only highlight these ids; omit for all
 * @returns {Array<{ text: string, id: string|null }>}
 */
export function segmentByConnectors(text, highlightIds) {
  if (!text) return []
  const filter = highlightIds ? new Set(highlightIds) : null
  const spans = findConnectorSpans(text).filter(s => !filter || filter.has(s.id))
  const segments = []
  let cursor = 0
  for (const s of spans) {
    if (s.start > cursor) segments.push({ text: text.slice(cursor, s.start), id: null })
    segments.push({ text: text.slice(s.start, s.end), id: s.id })
    cursor = s.end
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), id: null })
  return segments
}
