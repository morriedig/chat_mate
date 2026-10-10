/**
 * Target-phrase detection for connector practice (pure, no Vue).
 *
 * Longer phrases win: every match claims its character span, longest first,
 * so "so that" / "on top of that" / "because of" are never also counted as
 * "so" / "that" / "because". To get that shadowing, pass ALL of the chapter's
 * connectors as targets and filter the result by the ids you care about.
 */

// Normalize a phrase or message: lowercase, curly quotes → straight, drop
// punctuation except apostrophes, collapse whitespace.
export function normalizePhrase(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function phrasesOf(target) {
  const list = target.phrases || (target.phrase ? [target.phrase] : [])
  return list.map(normalizePhrase).filter(Boolean)
}

/**
 * @param {string} text - The user's message
 * @param {Array<{id: string, phrase?: string, phrases?: string[]}>} targets
 * @returns {string[]} Matched target ids, in the order targets were given
 */
export function detectConnectors(text, targets) {
  if (!text || !Array.isArray(targets) || targets.length === 0) return []

  // Lowercase only (no punctuation stripping) so match offsets stay stable
  const haystack = String(text)
    .toLowerCase()
    .replace(/[‘’ʼ]/g, "'")

  const candidates = []
  for (const target of targets) {
    for (const phrase of phrasesOf(target)) {
      const pattern = phrase.split(' ').map(escapeRegExp).join('[\\s\\-]+')
      // Word boundary that also treats apostrophes as part of a word
      const re = new RegExp(`(?<![a-z0-9'])${pattern}(?![a-z0-9'])`, 'g')
      let m
      while ((m = re.exec(haystack)) !== null) {
        candidates.push({ id: target.id, start: m.index, end: m.index + m[0].length })
      }
    }
  }

  // Longest match first; drop any match overlapping an already-claimed span
  candidates.sort((a, b) => (b.end - b.start) - (a.end - a.start) || a.start - b.start)
  const claimed = []
  const matched = new Set()
  for (const c of candidates) {
    if (claimed.some(s => c.start < s.end && s.start < c.end)) continue
    claimed.push(c)
    matched.add(c.id)
  }

  return targets.map(t => t.id).filter((id, i, arr) => matched.has(id) && arr.indexOf(id) === i)
}
