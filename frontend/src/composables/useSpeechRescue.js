import { ref } from 'vue'
import { getAuthToken, requestAuthToken, clearAuthToken } from './useChatApi'

/**
 * "I'm stuck" rescue in chat: a short opener, a few English pieces for what the
 * learner means, or a sentence frame with blanks. Never a full answer.
 *
 * The hint lives only in the component that asked for it (plus an in-memory
 * cache per turn and mode); it is never added to the messages, so it can't be
 * counted as a turn or picked up by the task pattern detection.
 * Usage counts (no content) go to `chatmate_rescue_stats`.
 */

const API_URL = import.meta.env.VITE_API_URL || ''
export const RESCUE_STATS_KEY = 'chatmate_rescue_stats'
export const RESCUE_MODES = ['starter', 'intent', 'frame']
const MAX_EVENTS = 30
const MAX_MESSAGES = 8
const MAX_CHARS = 4000
const MAX_INTENT = 300
const MAX_CACHE = 30

// Fixed openers used when the AI can't answer
export const FALLBACK_STARTERS = [
  'I think',
  'The main reason is',
  'What I mean is',
  'To be honest',
  'The thing is',
  'In my case',
  "I'm not sure, but",
  'Maybe we could',
]

// Frames used when there is no target pattern to build one from
export const FALLBACK_FRAMES = [
  'I think [your idea], because [your reason]',
  'For me, [your choice] is better because [your reason]',
  'One thing I like about [thing] is [reason]',
  "I'm not sure about [thing], but [your idea]",
]

function getClientId() {
  let clientId = localStorage.getItem('chatmate_clientId')
  if (!clientId) {
    clientId = 'client_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('chatmate_clientId', clientId)
  }
  return clientId
}

function getRescueUrl() {
  if (API_URL.includes('script.google.com')) return API_URL
  return API_URL.replace(/\/chat$/, '') + '/speech-rescue'
}

// ---------- Validation (same rules as the backend) ----------

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function isValidPiece(piece) {
  if (typeof piece !== 'string') return false
  const text = piece.trim()
  if (!text || text.length > 60) return false
  if (!/[A-Za-z]/.test(text) || /[^\x20-\x7E’]/.test(text)) return false
  if (/[.?!;:[\]"]/.test(text)) return false
  return countWords(text) <= 5
}

export function isValidFrame(frame) {
  if (typeof frame !== 'string') return false
  const text = frame.trim()
  if (!text || text.length > 100) return false
  if (/[^\x20-\x7E’]/.test(text)) return false
  if (!/\[[^[\]]{1,30}\]/.test(text)) return false
  if ((text.match(/\[/g) || []).length > 3) return false
  if (/[.?!]$/.test(text)) return false
  return countWords(text) <= 14
}

/** Whether a rescue from the server is safe to show for this mode. */
export function isValidRescue(rescue, mode) {
  if (!rescue || rescue.mode !== mode || !Array.isArray(rescue.pieces)) return false
  if (mode === 'starter') {
    return rescue.pieces.length === 1 && isValidPiece(rescue.pieces[0]) && countWords(rescue.pieces[0]) >= 2
  }
  if (mode === 'intent') {
    return rescue.pieces.length >= 2 && rescue.pieces.length <= 3 && rescue.pieces.every(isValidPiece)
  }
  if (mode === 'frame') return rescue.pieces.length === 0 && isValidFrame(rescue.frame)
  return false
}

// ---------- Fallbacks ----------

/**
 * A frame from a target pattern: "If you ask me, ..." → "If you ask me, [your idea]".
 * Returns '' when the pattern can't make a valid frame.
 */
export function buildFrameFromPattern(pattern) {
  if (typeof pattern !== 'string' || !pattern.trim()) return ''
  const slots = ['[your idea]', '[the rest]', '[more]']
  let n = 0
  let frame = pattern.trim().replace(/\.\.\.|…/g, () => slots[Math.min(n++, slots.length - 1)])
  if (n === 0) frame = `${frame.replace(/[.?!]+$/, '')} [your idea]`
  frame = frame.replace(/\s+/g, ' ').replace(/[.?!]+$/, '').trim()
  return isValidFrame(frame) ? frame : ''
}

export function fallbackStarter(turn = 0) {
  return FALLBACK_STARTERS[Math.abs(turn) % FALLBACK_STARTERS.length]
}

export function fallbackFrame(patterns = [], turn = 0) {
  const fromPatterns = patterns.map(p => buildFrameFromPattern(p?.pattern)).filter(Boolean)
  if (fromPatterns.length) return fromPatterns[Math.abs(turn) % fromPatterns.length]
  return FALLBACK_FRAMES[Math.abs(turn) % FALLBACK_FRAMES.length]
}

/**
 * What to show when the AI can't help. Starter and frame get a local hint;
 * intent gets nothing (no whole-sentence translation), so the UI asks to try again.
 */
export function buildFallback(mode, { patterns = [], turn = 0 } = {}) {
  if (mode === 'starter') return { mode, pieces: [fallbackStarter(turn)], frame: '' }
  if (mode === 'frame') return { mode, pieces: [], frame: fallbackFrame(patterns, turn) }
  return { mode, pieces: [], frame: '' }
}

// ---------- Request ----------

/** Last 8 messages, trimmed from the oldest so the total stays under 4000 characters. */
export function trimMessages(messages = []) {
  const recent = messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_MESSAGES)
    .map(m => ({ role: m.role, content: m.content }))
  let total = recent.reduce((sum, m) => sum + m.content.length, 0)
  for (let i = 0; i < recent.length && total > MAX_CHARS; i++) {
    const cut = Math.min(recent[i].content.length, total - MAX_CHARS)
    recent[i].content = recent[i].content.slice(cut)
    total -= cut
  }
  return recent.filter(m => m.content.length > 0)
}

export function buildRescueRequest({ mode, intent = '', messages = [], task = null, patterns = [], level = 'intermediate', language = 'en', nativeLanguage = 'zh' }) {
  return {
    action: 'speech-rescue',
    mode,
    intent: mode === 'intent' ? String(intent).trim().slice(0, MAX_INTENT) : '',
    messages: trimMessages(messages),
    taskContext: task ? { title: String(task.title || '').slice(0, 300), goal: String(task.goal || '').slice(0, 300) } : { title: '', goal: '' },
    targetPatterns: patterns.slice(0, 3).map(p => ({
      id: String(p.id || ''),
      pattern: String(p.pattern || '').slice(0, 200),
      meaning: String(p.meaning || '').slice(0, 200),
    })),
    level,
    language,
    nativeLanguage,
  }
}

/** Identifies the current turn: a new message (either side) starts a new one. */
export function turnKey(messages = []) {
  const last = messages[messages.length - 1]
  return `${messages.length}:${last ? last.role + ':' + String(last.content).slice(0, 80) : ''}`
}

// In-memory only (gone on reload): reopening the same mode in the same turn reuses the hint
const cache = new Map()

function cacheKey(turn, mode, intent) {
  return `${turn}|${mode}|${mode === 'intent' ? String(intent).trim() : ''}`
}

export function clearRescueCache() {
  cache.clear()
}

// ---------- Usage stats (no content) ----------

export function loadRescueStats() {
  try {
    const raw = JSON.parse(localStorage.getItem(RESCUE_STATS_KEY))
    if (raw && raw.version === 1 && raw.counts && Array.isArray(raw.events)) {
      return {
        version: 1,
        counts: { starter: raw.counts.starter || 0, intent: raw.counts.intent || 0, frame: raw.counts.frame || 0 },
        events: raw.events.slice(-MAX_EVENTS),
      }
    }
  } catch { /* corrupt or unavailable */ }
  return { version: 1, counts: { starter: 0, intent: 0, frame: 0 }, events: [] }
}

export function recordRescueUse(mode, sessionType = 'free') {
  if (!RESCUE_MODES.includes(mode)) return
  const stats = loadRescueStats()
  stats.counts[mode] += 1
  stats.events.push({ at: new Date().toISOString(), mode, sessionType })
  stats.events = stats.events.slice(-MAX_EVENTS)
  try {
    localStorage.setItem(RESCUE_STATS_KEY, JSON.stringify(stats))
  } catch { /* storage full or blocked */ }
}

async function postRescue(body) {
  const post = () => fetch(getRescueUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
    redirect: 'follow',
  }).then(r => r.json())

  let data = await post()
  if (!data.success && data.isTokenError) {
    clearAuthToken()
    const newToken = await requestAuthToken()
    if (newToken) {
      body.authToken = newToken
      data = await post()
    }
  }
  return data
}

/**
 * @returns {{ isLoading, result, request }}
 * `result`: { mode, pieces, frame, source: 'ai'|'fallback', reason?: 'offline'|'limit'|'busy'|'error' }
 * An intent result with no pieces means "try saying it another way".
 */
export function useSpeechRescue() {
  const isLoading = ref(false)
  const result = ref(null)
  let requestId = 0

  /**
   * @param {Object} options
   * @param {'starter'|'intent'|'frame'} options.mode
   * @param {string} [options.intent] - what the learner means, in their own language (intent mode)
   * @param {Object} options.context - { messages, task, patterns, level, language, nativeLanguage, sessionType }
   */
  async function request({ mode, intent = '', context = {} }) {
    const messages = context.messages || []
    const turn = turnKey(messages)
    const key = cacheKey(turn, mode, intent)
    if (cache.has(key)) {
      result.value = cache.get(key)
      return result.value
    }

    const id = ++requestId
    const turnNumber = messages.filter(m => m.role === 'user').length
    const fallback = (reason) => ({
      ...buildFallback(mode, { patterns: context.patterns || [], turn: turnNumber }),
      source: 'fallback',
      reason,
    })

    recordRescueUse(mode, context.sessionType)
    isLoading.value = true
    result.value = null
    let next
    try {
      if (!API_URL || (typeof navigator !== 'undefined' && navigator.onLine === false)) {
        next = fallback(API_URL ? 'offline' : 'error')
      } else {
        const body = {
          ...buildRescueRequest({ mode, intent, ...context }),
          clientId: getClientId(),
          origin: window.location.origin,
          authToken: await getAuthToken(),
        }
        const data = await postRescue(body)
        if (data.success && isValidRescue(data.rescue, mode)) {
          next = { mode, pieces: data.rescue.pieces, frame: data.rescue.frame || '', source: 'ai' }
          cache.set(key, next)
          if (cache.size > MAX_CACHE) cache.delete(cache.keys().next().value)
        } else {
          next = fallback(data.isDailyLimit ? 'limit' : data.isRateLimit ? 'busy' : 'error')
        }
      }
    } catch {
      next = fallback(typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'error')
    } finally {
      if (id === requestId) isLoading.value = false
    }
    if (id === requestId) result.value = next
    return next
  }

  function clear() {
    requestId++
    isLoading.value = false
    result.value = null
  }

  return { isLoading, result, request, clear }
}
