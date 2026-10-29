import { ref, computed } from 'vue'
import { useSRS } from './useSRS'
import { getDailyPatterns, getDailyVocab } from '../data/dailyLoader'

const STORAGE_KEY = 'chatmate_daily_practice'
const LEVELS = ['beginner', 'intermediate', 'advanced']
const PLAN_DAYS_KEPT = 14

// Each day: a few due reviews plus a small number of new items
export const PATTERNS_PER_DAY = 3
export const NEW_PATTERNS_PER_DAY = 1
export const WORDS_PER_DAY = 5
export const NEW_WORDS_PER_DAY = 2

function todayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function defaultLevel() {
  try {
    const placement = JSON.parse(localStorage.getItem('chatmate_placement_result') || 'null')
    if (LEVELS.includes(placement?.level)) return placement.level
  } catch {
    // Ignore malformed placement data
  }
  return 'intermediate'
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved && LEVELS.includes(saved.level) && saved.plans) return saved
  } catch {
    // Ignore malformed state
  }
  return { level: defaultLevel(), plans: {} }
}

const state = ref(loadState())

function persist() {
  const keys = Object.keys(state.value.plans).sort()
  for (const key of keys.slice(0, Math.max(0, keys.length - PLAN_DAYS_KEPT))) {
    delete state.value.plans[key]
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
  } catch {
    // Storage unavailable
  }
}

/**
 * Pick today's items: due reviews first (most overdue first), then new items in
 * file order. Up to `newCount` slots are reserved for new items so the user keeps
 * learning something new even when many reviews are due.
 */
export function pickItems(items, total, newCount, srs) {
  const due = srs.getDueWords(items)
  const fresh = items.filter(item => !srs.getWordSRS(item.id))
  const reviewSlots = total - Math.min(newCount, fresh.length)
  const picked = due.slice(0, reviewSlots)
  for (const item of fresh) {
    if (picked.length >= total) break
    picked.push(item)
  }
  return picked.map(item => item.id)
}

export function useDailyPractice() {
  const srs = useSRS()

  const level = computed(() => state.value.level)
  const patterns = computed(() => getDailyPatterns(level.value))
  const words = computed(() => getDailyVocab(level.value))

  function buildPlan() {
    return {
      level: level.value,
      patternIds: pickItems(patterns.value, PATTERNS_PER_DAY, NEW_PATTERNS_PER_DAY, srs),
      wordIds: pickItems(words.value, WORDS_PER_DAY, NEW_WORDS_PER_DAY, srs),
      done: {},
    }
  }

  // Creates today's plan when the day or the level changed; call on screen mount
  function ensureTodayPlan() {
    const key = todayKey()
    const existing = state.value.plans[key]
    if (existing && existing.level === level.value) return
    state.value.plans[key] = buildPlan()
    persist()
  }

  ensureTodayPlan()

  const plan = computed(() =>
    state.value.plans[todayKey()] || { level: level.value, patternIds: [], wordIds: [], done: {} })

  const todayPatterns = computed(() =>
    plan.value.patternIds.map(id => patterns.value.find(p => p.id === id)).filter(Boolean))
  const todayWords = computed(() =>
    plan.value.wordIds.map(id => words.value.find(w => w.id === id)).filter(Boolean))

  const totalCount = computed(() => todayPatterns.value.length + todayWords.value.length)
  const doneCount = computed(() =>
    [...plan.value.patternIds, ...plan.value.wordIds].filter(id => plan.value.done[id]).length)
  const isDoneToday = computed(() => totalCount.value > 0 && doneCount.value >= totalCount.value)

  function isNew(id) {
    return !srs.getWordSRS(id)
  }

  /**
   * Record one finished item. `confidence` is the SM-2 quality (0-5); a wrong
   * choice answer caps it so the item comes back sooner.
   */
  function completeItem(id, { correct, confidence }) {
    const quality = correct ? confidence : Math.min(confidence, 2)
    srs.recordReview(id, correct, quality)
    plan.value.done[id] = true
    persist()
  }

  function setLevel(newLevel) {
    if (!LEVELS.includes(newLevel) || newLevel === state.value.level) return
    state.value.level = newLevel
    persist()
    ensureTodayPlan()
  }

  return {
    levels: LEVELS,
    level,
    todayPatterns,
    todayWords,
    totalCount,
    doneCount,
    isDoneToday,
    isDone: id => !!plan.value.done[id],
    isNew,
    completeItem,
    setLevel,
    ensureTodayPlan,
  }
}
