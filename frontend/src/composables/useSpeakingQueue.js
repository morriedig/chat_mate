import { ref, computed } from 'vue'

/**
 * Sentences to say again on a later day ("明日重說").
 *
 * Items come from the end-of-chat summary (`chat-summary`) or from a daily
 * practice prompt the learner still found hard (`pattern-fallback`). The first
 * pending item due today becomes step 3 of the daily core practice.
 *
 * Only one pending item is kept per `scheduledFor` date.
 */

const STORAGE_KEY = 'chatmate_speaking_queue'
const MAX_ITEMS = 60
const MAX_TEXT = 300
export const SPEAKING_SOURCES = ['chat-summary', 'pattern-fallback', 'personal-scenario']

export function localDateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** The local date `days` after the YYYY-MM-DD `key` */
export function addDays(key, days) {
  const [y, m, d] = key.split('-').map(Number)
  return localDateKey(new Date(y, m - 1, d + days))
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved && Array.isArray(saved.items)) return { version: 1, items: saved.items.filter(i => i && i.id) }
  } catch {
    // Ignore malformed queue
  }
  return { version: 1, items: [] }
}

const state = ref(load())

function persist() {
  // Drop the oldest finished items once the list gets long
  const items = state.value.items
  if (items.length > MAX_ITEMS) {
    const finished = items.filter(i => i.completedAt).sort((a, b) => a.completedAt.localeCompare(b.completedAt))
    const drop = new Set(finished.slice(0, items.length - MAX_ITEMS).map(i => i.id))
    state.value.items = items.filter(i => !drop.has(i.id))
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
  } catch {
    // Storage unavailable
  }
}

const clip = text => String(text || '').trim().slice(0, MAX_TEXT)

function newId() {
  return 'speak_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function useSpeakingQueue() {
  const items = computed(() => state.value.items)
  const pending = computed(() => state.value.items.filter(i => !i.completedAt))

  function getItem(id) {
    return state.value.items.find(i => i.id === id) || null
  }

  /** The pending item already booked for `date`, if any */
  function itemFor(date) {
    return pending.value.find(i => i.scheduledFor === date) || null
  }

  /** Earliest pending item with scheduledFor <= today */
  function nextDue(today = localDateKey()) {
    return pending.value
      .filter(i => i.scheduledFor <= today)
      .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor) || a.createdAt.localeCompare(b.createdAt))[0] || null
  }

  // First date on or after `from` with nothing pending, so each date holds one item
  function firstFreeDate(from, exceptId = null) {
    let date = from
    while (pending.value.some(i => i.scheduledFor === date && i.id !== exceptId)) date = addDays(date, 1)
    return date
  }

  /**
   * Add an item. A taken date means nothing is added (returns null) unless
   * `replace` is set: then an earlier chat-summary sentence is dropped, and
   * anything else (a sentence the learner still found hard) moves to the next free date.
   * @returns {object|null} the new item
   */
  function enqueue({ source, sourceId = '', original = '', target = '', cue, hint = '', patternId = '', scheduledFor, replace = false }) {
    if (!SPEAKING_SOURCES.includes(source) || !clip(cue) || !scheduledFor) return null
    const taken = itemFor(scheduledFor)
    if (taken) {
      if (!replace) return null
      if (taken.source === 'chat-summary') state.value.items = state.value.items.filter(i => i.id !== taken.id)
      else taken.scheduledFor = firstFreeDate(addDays(scheduledFor, 1), taken.id)
    }
    const item = {
      id: newId(),
      source,
      sourceId: clip(sourceId),
      original: clip(original),
      target: clip(target),
      cue: clip(cue),
      hint: clip(hint),
      patternId: clip(patternId),
      scheduledFor,
      createdAt: new Date().toISOString(),
      attempts: [],
      completedAt: null,
    }
    state.value.items.push(item)
    persist()
    return item
  }

  /**
   * Record one attempt. 'got-it' finishes the item; 'again' moves it to the next
   * free local date after today.
   */
  function recordAttempt(id, { mode, text, selfRating }, today = localDateKey()) {
    const item = getItem(id)
    if (!item) return null
    item.attempts.push({ at: new Date().toISOString(), mode, text: clip(text), selfRating })
    if (selfRating === 'got-it') item.completedAt = new Date().toISOString()
    else item.scheduledFor = firstFreeDate(addDays(today, 1), item.id)
    persist()
    return item
  }

  /**
   * Book the chat summary's repeatTomorrow sentence for the next local date.
   * If that date already holds a sentence from another source or chat, nothing
   * changes until the learner asks to replace it (`replace: true`). A newer
   * summary of the same chat simply replaces its own sentence.
   * @returns {{ status: 'none' | 'queued' | 'taken', item?: object }}
   */
  function queueRepeatTomorrow(repeat, { sourceId = '', replace = false, today = localDateKey() } = {}) {
    if (!repeat?.enabled || !clip(repeat.cue) || !clip(repeat.target)) return { status: 'none' }
    const date = addDays(today, 1)
    const taken = itemFor(date)
    if (taken && taken.source === 'chat-summary' && taken.sourceId === clip(sourceId) && taken.target === clip(repeat.target)) {
      return { status: 'queued', item: taken }
    }
    const sameChat = taken && taken.source === 'chat-summary' && sourceId && taken.sourceId === clip(sourceId)
    if (taken && !replace && !sameChat) return { status: 'taken', item: taken }
    const item = enqueue({
      source: 'chat-summary',
      sourceId,
      original: repeat.original,
      target: repeat.target,
      cue: repeat.cue,
      hint: repeat.hint,
      patternId: repeat.patternId,
      scheduledFor: date,
      replace: true,
    })
    return item ? { status: 'queued', item } : { status: 'none' }
  }

  return { items, pending, getItem, itemFor, nextDue, firstFreeDate, enqueue, recordAttempt, queueRepeatTomorrow }
}
