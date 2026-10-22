/**
 * Connector detection for the "Giving Reasons" practice flows (pure, no Vue).
 *
 * Shared by:
 *   - lesson-first mission chat  (useConnectorMission: chapter-derived targets
 *     with prefixed ids, e.g. { id: 'giving-reasons_so', phrase: 'so' })
 *   - chat-first opinion chat    (useOpinionChat / ChatMessage highlighting)
 *   - daily opinion drill        (useDailyOpinion / DailyOpinionScreen / opinionStructure)
 *
 * Targets can be given as:
 *   - omitted            → every connector in CONNECTOR_PATTERNS
 *   - ids ('so') or { id } without phrases → looked up in CONNECTOR_PATTERNS
 *   - { id, phrase | phrases, accept? }    → custom phrases (any id)
 *
 * Rules (applied to every call, whatever the targets are):
 *   - Case-insensitive, word-boundary aware ("also" ≠ "Alsop", "plus" ≠ "surplus").
 *     Curly apostrophes count as straight ones; words in a phrase may be split by
 *     any whitespace or a hyphen.
 *   - Longest match wins: every match claims its span, so "so that" never also
 *     counts as "so", "because of" never as "because", "on top of that" never as
 *     anything shorter. The built-in connectors always take part in this, so
 *     asking only for 'so' still won't report the "so" inside "so that".
 *   - Blocker phrases ("so much", "so far", "ever since", "as well as", …) claim
 *     their span without producing a hit.
 *   - Ambiguous single words have built-in rules (see PHRASE_RULES): "so" only at
 *     a clause start or before a subject; "since" not about time; "as" only at a
 *     clause start and not "as a / as well / as soon…".
 *   - "that's why" / "that is why" count as which-is-why.
 */

// Connector id → surface forms. Ids match the word ids in
// chapters/en/intermediate/09-giving-reasons.yml.
export const CONNECTOR_PATTERNS = {
  'because': ['because'],
  'since': ['since'],
  'due-to': ['due to'],
  'because-of': ['because of'],
  'as': ['as'],
  'so': ['so'],
  'which-is-why': ['which is why', "that's why", 'that is why'],
  'in-order-to': ['in order to'],
  // Purpose "to" can't be told apart from "go to school" by string matching,
  // so it is intentionally not detectable (and never picked as a target).
  'to-purpose': [],
  'so-that': ['so that'],
  'another-reason-is': ['another reason is', 'another reason was', 'another reason'],
  'plus': ['plus'],
  'also': ['also'],
  'on-top-of-that': ['on top of that'],
  'whats-your-take': ["what's your take", 'what is your take'],
}

// The built-in connectors as target objects (handy for callers that want objects)
export const GIVING_REASONS_TARGETS = Object.entries(CONNECTOR_PATTERNS)
  .filter(([, phrases]) => phrases.length > 0)
  .map(([id, phrases]) => ({ id, phrases }))

// Phrases that contain a connector word but are NOT that connector
const BLOCKERS = [
  'even so', 'so far', 'so much', 'so many', 'and so on', 'or so',
  'ever since', 'as well as', 'as soon as', 'as long as', 'as far as', 'such as',
]

// ---- Disambiguation rules for ambiguous single words -----------------------

// True when the word sits at the start of a sentence or clause
const CLAUSE_START = /(^|[.!?…。！？,;:—\-\n]["'”’)]?)\s*$/

const SO_RESULT_FOLLOWERS = /^\s+(i|i'm|i'd|i've|i'll|we|we're|you|you're|he|she|they|they're|it|it's|that|that's|this|there|there's|the|a|my|our|your|his|her|their|people|everyone|now|maybe|basically|in|at|if|when)\b/i
const SO_NOT_CONNECTOR = /^\s+(far|much|many|long|on|forth)\b/i

const SINCE_TIME = /^\s+(\d|then\b|last\b|yesterday\b|ever\b|childhood\b|high school\b|college\b|university\b|the (beginning|start)\b|(this|that) (morning|year|week|month|time)\b|(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b|(january|february|march|april|may|june|july|august|september|october|november|december)\b|i was (a )?(kid|child|little|young|teenager|student)\b)/i

const AS_NOT_REASON = /^\s+(a|an|well|soon|long|far|for|if|though|usual|much|many|i said|you said|i mentioned|you know|mentioned)\b/i

// Keyed by normalized phrase, so chapter-derived targets get them too
const PHRASE_RULES = {
  // Reject "so good" / "I think so." / "so far"; accept "…, so we left" / "so I left"
  so: ({ before, after }) => {
    if (SO_NOT_CONNECTOR.test(after)) return false
    return CLAUSE_START.test(before) || SO_RESULT_FOLLOWERS.test(after)
  },
  // Reject "since 2019", "since last year", "ever since"
  since: ({ before, after }) => !/\bever\s*$/i.test(before) && !SINCE_TIME.test(after),
  // Reason "as" only at a clause start: "As the office is closed, …"
  as: ({ before, after }) => CLAUSE_START.test(before) && !AS_NOT_REASON.test(after),
}

// ---- Matching core ---------------------------------------------------------

const WORD_CHAR = '[\\p{L}\\p{N}_]'

// Curly apostrophes → straight; keeps string length so indices stay valid
function normalizeQuotes(text) {
  return String(text).replace(/[‘’ʼ]/g, "'")
}

/** Lowercase, straighten quotes, strip punctuation, collapse spaces. */
export function normalizePhrase(text) {
  return normalizeQuotes(text || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}'\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const regexCache = new Map()
function phraseRegex(phrase) {
  if (!regexCache.has(phrase)) {
    const body = phrase.split(' ').map(escapeRegExp).join('[\\s\\-]+')
    // A trailing 's / 'd also blocks, so "so that" does not match inside "so that's"
    regexCache.set(phrase, new RegExp(`(?<!${WORD_CHAR}|${WORD_CHAR}')${body}(?!${WORD_CHAR}|'${WORD_CHAR})`, 'giu'))
  }
  const re = regexCache.get(phrase)
  re.lastIndex = 0
  return re
}

function phrasesOf(target) {
  const list = target.phrases || (target.phrase ? [target.phrase] : [])
  return list.map(normalizePhrase).filter(Boolean)
}

/**
 * Resolve the caller's targets into { wanted ids, custom target objects }.
 * Returns wanted = null when every built-in connector is wanted.
 */
function resolveTargets(targets) {
  if (targets == null) return { wanted: null, custom: [] }
  if (!Array.isArray(targets)) return { wanted: new Set(), custom: [] }
  const wanted = new Set()
  const custom = []
  for (const t of targets) {
    if (typeof t === 'string') {
      wanted.add(t)
    } else if (t && t.id) {
      wanted.add(t.id)
      if (t.phrase || t.phrases) custom.push(t)
    }
  }
  return { wanted, custom }
}

/**
 * Find connector occurrences.
 * @param {string} text
 * @param {Array<string|{id: string, phrase?: string, phrases?: string[], accept?: Function}>} [targets]
 * @returns {Array<{ id: string, start: number, end: number, text: string }>} non-overlapping, sorted by start
 */
export function findConnectorSpans(text, targets) {
  if (!text || typeof text !== 'string') return []
  const { wanted, custom } = resolveTargets(targets)
  if (wanted && wanted.size === 0) return []

  const src = normalizeQuotes(text)
  // priority breaks ties between equal-length spans: caller's targets > built-in > blockers
  const entries = []
  for (const phrase of BLOCKERS) entries.push({ id: null, phrase, priority: 0 })
  for (const [id, forms] of Object.entries(CONNECTOR_PATTERNS)) {
    for (const phrase of forms) entries.push({ id, phrase, priority: 1 })
  }
  for (const t of custom) {
    for (const phrase of phrasesOf(t)) entries.push({ id: t.id, phrase, accept: t.accept, priority: 2 })
  }

  const candidates = []
  for (const entry of entries) {
    const accept = entry.accept || PHRASE_RULES[entry.phrase]
    const re = phraseRegex(entry.phrase)
    let m
    while ((m = re.exec(src)) !== null) {
      const start = m.index
      const end = start + m[0].length
      if (accept && !accept({ before: src.slice(0, start), after: src.slice(end), match: m[0] })) continue
      candidates.push({ id: entry.id, start, end, priority: entry.priority })
    }
  }

  candidates.sort((a, b) =>
    (b.end - b.start) - (a.end - a.start) || b.priority - a.priority || a.start - b.start)

  const claimed = []
  for (const c of candidates) {
    if (!claimed.some(s => c.start < s.end && s.start < c.end)) claimed.push(c)
  }

  return claimed
    // Built-in matches only count when asked for; custom ones always are
    .filter(c => c.id && (wanted === null || wanted.has(c.id)))
    .sort((a, b) => a.start - b.start)
    .map(c => ({ id: c.id, start: c.start, end: c.end, text: text.slice(c.start, c.end) }))
}

/**
 * Which targets appear in the text?
 * @returns {string[]} unique matched ids, in the order the targets were given
 *   (CONNECTOR_PATTERNS order when targets are omitted)
 */
export function detectConnectors(text, targets) {
  const found = new Set(findConnectorSpans(text, targets).map(s => s.id))
  const order = targets == null
    ? Object.keys(CONNECTOR_PATTERNS)
    : (Array.isArray(targets) ? targets : []).map(t => (typeof t === 'string' ? t : t?.id))
  return [...new Set(order.filter(Boolean))].filter(id => found.has(id))
}

/**
 * Unique matched ids in order of first appearance in the text.
 */
export function detectConnectorsInOrder(text, targets) {
  const ids = []
  for (const span of findConnectorSpans(text, targets)) {
    if (!ids.includes(span.id)) ids.push(span.id)
  }
  return ids
}

/**
 * Split text into plain / connector segments for live highlighting.
 * Joined segment texts always equal the original text.
 * @param {string} text
 * @param {Array} [targets] - ids or target objects to highlight; omit for all
 * @returns {Array<{ text: string, id: string|null }>}
 */
export function segmentByConnectors(text, targets) {
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

// Alias kept for the opinion-chat callers
export const splitByConnectors = segmentByConnectors
