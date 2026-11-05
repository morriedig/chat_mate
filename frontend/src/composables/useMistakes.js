import { ref, computed } from 'vue'

/**
 * Mistakes caught in chat, sentence checks and diaries, kept for review.
 *
 * Each mistake becomes an SRS card (`mistake:<id>`) in daily practice: the learner
 * sees their original sentence, tries to fix it, then compares with the correction.
 */

const STORAGE_KEY = 'chatmate_mistakes'
const MAX_MISTAKES = 300

// Errors Mandarin speakers make most; these come up first and are scheduled tighter
export const L1_TYPES = ['article', 'tense', 'third-person-s', 'plural', 'connector']
export const MISTAKE_TYPES = [...L1_TYPES, 'word-choice', 'other']

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    return saved && typeof saved === 'object' ? saved : {}
  } catch {
    return {}
  }
}

const store = ref(load())

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.value))
  } catch {
    // Storage unavailable
  }
}

export function normalizeSentence(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function mistakeId(original, corrected) {
  const key = `${normalizeSentence(original)}|${normalizeSentence(corrected)}`
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0
  return (hash >>> 0).toString(36)
}

export const srsId = id => `mistake:${id}`

/**
 * Pull "original" → "corrected" out of a free-text chat correction, e.g.
 * `"I am agree" → "I agree" — agree is already a verb`. Returns null when the
 * text has no quoted pair.
 */
export function parseCorrectionText(text) {
  const match = String(text || '').match(/["“](.+?)["”]\s*(?:→|->|=>)\s*["“](.+?)["”]\s*(?:[—–:-]+\s*(.*))?$/s)
  if (!match) return null
  return { original: match[1].trim(), corrected: match[2].trim(), explanation: (match[3] || '').trim() }
}

export function useMistakes() {
  const mistakes = computed(() => Object.values(store.value))

  /**
   * Save a mistake. Ignores empty or unchanged pairs and duplicates.
   * @returns {string|null} the mistake id, or null when nothing was saved
   */
  function addMistake({ original, corrected, explanation = '', hint = '', type = 'other', source = 'chat' }) {
    const from = String(original || '').trim()
    const to = String(corrected || '').trim()
    if (!from || !to || normalizeSentence(from) === normalizeSentence(to)) return null
    if (from.length > 400 || to.length > 400) return null

    const id = mistakeId(from, to)
    if (store.value[id]) return id

    store.value = {
      ...store.value,
      [id]: {
        id,
        original: from,
        corrected: to,
        explanation: String(explanation || '').trim(),
        hint: String(hint || '').trim(),
        type: MISTAKE_TYPES.includes(type) ? type : 'other',
        source,
        createdAt: new Date().toISOString(),
      },
    }

    const all = Object.values(store.value)
    if (all.length > MAX_MISTAKES) {
      const oldest = all.sort((a, b) => a.createdAt.localeCompare(b.createdAt)).slice(0, all.length - MAX_MISTAKES)
      const trimmed = { ...store.value }
      for (const m of oldest) delete trimmed[m.id]
      store.value = trimmed
    }
    persist()
    return id
  }

  function getMistake(id) {
    return store.value[id] || null
  }

  function removeMistake(id) {
    if (!store.value[id]) return
    const next = { ...store.value }
    delete next[id]
    store.value = next
    persist()
  }

  return { mistakes, addMistake, getMistake, removeMistake }
}

/**
 * Today's mistake cards: due reviews first, then a few new ones.
 * Mandarin-speaker error types go first in both groups.
 */
export function pickMistakeIds(mistakes, srs, total, newCount) {
  const l1First = (a, b) => (L1_TYPES.includes(b.type) ? 1 : 0) - (L1_TYPES.includes(a.type) ? 1 : 0)
  const asCards = mistakes.map(m => ({ ...m, id: srsId(m.id), mistakeId: m.id }))
  const due = srs.getDueWords(asCards).sort(l1First)
  const fresh = asCards
    .filter(m => !srs.getWordSRS(m.id))
    .sort((a, b) => l1First(a, b) || b.createdAt.localeCompare(a.createdAt))
  const reviewSlots = total - Math.min(newCount, fresh.length)
  const picked = due.slice(0, reviewSlots)
  for (const m of fresh) {
    if (picked.length >= total) break
    picked.push(m)
  }
  return picked.map(m => m.mistakeId)
}
