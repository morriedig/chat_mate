import { findConnectorSpans } from './connectorDetect'

// Simple heuristic check for the 3-step structure taught in the
// "Giving Reasons" chapter: Opinion → Reason → Wrap-up.
//
// This is deliberately NOT an NLP judgement — it only looks for surface
// markers, so it can be fooled both ways. It runs offline and instantly,
// which is all the daily drill needs for a "did you hit all three?" nudge.
// The AI feedback is where real quality judgement happens.

const OPINION_MARKERS = [
  /\bi (?:really |honestly |personally |strongly )?(?:think|believe|feel|guess|prefer|reckon|suppose)\b/i,
  /\bi(?:'d| would) (?:say|rather|prefer|choose|go with|pick|keep)\b/i,
  /\bi (?:don't|do not) (?:think|believe|feel)\b/i,
  /\bi(?:'m| am) (?:not )?(?:sure|convinced|for|against)\b/i,
  /\bi (?:agree|disagree|like|love|hate|support)\b/i,
  /\bin my (?:opinion|view|experience)\b/i,
  /\b(?:personally|honestly|for me|to me|my view is|my take is)\b/i,
  /\b(?:is|are|would be) (?:better|worse|more \w+|less \w+)\b/i,
  /\b(?:should|shouldn't|should not)\b/i,
]

// Connector ids that introduce or add a reason/purpose/result
const REASON_CONNECTOR_IDS = new Set([
  'because', 'since', 'due-to', 'because-of', 'as', 'so', 'which-is-why',
  'in-order-to', 'so-that', 'another-reason-is', 'plus', 'on-top-of-that',
])

const REASON_MARKERS = [
  /\bthe (?:main )?reason (?:is|was)\b/i,
  /\b(?:for example|for instance)\b/i,
  /\bthat(?:'s| is) (?:why|because)\b/i,
]

const WRAP_UP_MARKERS = [
  /\bwhat(?:'s| is) your take\b/i,
  /\bwhat do you think\b/i,
  /\b(?:how|what) about you\b/i,
  /\bdo you agree\b/i,
  /\b(?:overall|all in all|in short|to sum up|in the end|anyway|that's why|so yeah|in general)\b/i,
  /\bthat's (?:my|just my) (?:take|opinion|two cents)\b/i,
]

/**
 * Split text into sentences (keeps the terminal punctuation).
 * @param {string} text
 * @returns {string[]}
 */
export function splitSentences(text) {
  if (!text) return []
  return (text.match(/[^.!?。！？\n]+[.!?。！？]*/g) || [])
    .map(s => s.trim())
    .filter(s => /[\p{L}\p{N}]/u.test(s))
}

/**
 * @param {string} text
 * @returns {{ opinion: boolean, reason: boolean, wrapUp: boolean, sentenceCount: number }}
 */
export function analyzeStructure(rawText) {
  // Normalise curly apostrophes (mobile keyboards) so "I’d" matches "I'd"
  const text = (rawText || '').replace(/[’‘]/g, "'")
  const sentences = splitSentences(text)
  if (sentences.length === 0) {
    return { opinion: false, reason: false, wrapUp: false, sentenceCount: 0 }
  }

  // Opinion: look in the first two sentences — that's where a view is stated
  const opening = sentences.slice(0, 2).join(' ')
  const opinion = OPINION_MARKERS.some(re => re.test(opening))

  // Reason: any reason connector, or "the reason is" / "for example"
  const reason =
    findConnectorSpans(text).some(s => REASON_CONNECTOR_IDS.has(s.id)) ||
    REASON_MARKERS.some(re => re.test(text))

  // Wrap-up: only counts in a separate final sentence (needs ≥ 2 sentences),
  // either a question back to the listener or a closing marker.
  let wrapUp = false
  if (sentences.length >= 2) {
    const last = sentences[sentences.length - 1]
    wrapUp = /[?？]\s*$/.test(last) || WRAP_UP_MARKERS.some(re => re.test(last))
  }

  return { opinion, reason, wrapUp, sentenceCount: sentences.length }
}

/**
 * Pick the sentence most worth saving: the one using the most distinct
 * connectors (today's targets count double), ties broken by length.
 * @param {string} text
 * @param {string[]} [targetIds]
 * @returns {string|null}
 */
export function pickBestSentence(text, targetIds = []) {
  const sentences = splitSentences(text)
  if (sentences.length === 0) return null
  const targets = new Set(targetIds)
  let best = null
  let bestScore = -1
  for (const s of sentences) {
    const ids = new Set(findConnectorSpans(s).map(x => x.id))
    let score = 0
    for (const id of ids) score += targets.has(id) ? 2 : 1
    if (score > bestScore || (score === bestScore && s.length > best.length)) {
      best = s
      bestScore = score
    }
  }
  return best
}
