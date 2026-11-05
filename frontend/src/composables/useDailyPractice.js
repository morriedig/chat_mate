import { ref, computed } from 'vue'
import { useSRS } from './useSRS'
import { getDailyPatterns, getDailyVocab } from '../data/dailyLoader'
import { useMistakes, pickMistakeIds, srsId as mistakeSrsId, L1_TYPES } from './useMistakes'
import { useVocabularyBank } from './useVocabularyBank'

const STORAGE_KEY = 'chatmate_daily_practice'
const LEVELS = ['beginner', 'intermediate', 'advanced']
const PLAN_DAYS_KEPT = 14

// Each day: a few due reviews plus a small number of new items
export const PATTERNS_PER_DAY = 3
export const NEW_PATTERNS_PER_DAY = 1
export const WORDS_PER_DAY = 5
export const NEW_WORDS_PER_DAY = 2
export const MISTAKES_PER_DAY = 3
export const NEW_MISTAKES_PER_DAY = 2
export const BANK_WORDS_PER_DAY = 3
export const NEW_BANK_WORDS_PER_DAY = 2
export const LISTENING_PER_DAY = 2
export const bankSrsId = id => `bank:${id}`

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

/**
 * Two listening items built from today's example sentences: one "which sentence
 * did you hear" and one dictation (the shortest sentence, so it's fair to type).
 */
export function buildListening(patterns, words, allPatterns) {
  const pool = [
    ...patterns.flatMap(p => p.examples || []),
    ...words.map(w => w.example).filter(Boolean),
  ].filter(ex => ex && ex.en)
  if (pool.length === 0) return []

  const items = []
  const choose = pool[0]
  const distractors = allPatterns
    .flatMap(p => p.examples || [])
    .filter(ex => ex.en && ex.en !== choose.en)
    .sort((a, b) => Math.abs(a.en.length - choose.en.length) - Math.abs(b.en.length - choose.en.length))
    .slice(0, 2)
  if (distractors.length === 2) {
    items.push({ id: 'listen:choose', mode: 'choose', en: choose.en, zh: choose.zh || '', options: [choose.en, ...distractors.map(d => d.en)] })
  }
  const shortest = [...pool].filter(ex => ex.en !== choose.en).sort((a, b) => a.en.length - b.en.length)[0] || choose
  items.push({ id: 'listen:dictation', mode: 'dictation', en: shortest.en, zh: shortest.zh || '' })
  return items.slice(0, LISTENING_PER_DAY)
}

export function useDailyPractice() {
  const srs = useSRS()
  const { mistakes, getMistake } = useMistakes()
  const { words: bankWords, getWord: getBankWord } = useVocabularyBank()

  const level = computed(() => state.value.level)
  const patterns = computed(() => getDailyPatterns(level.value))
  const words = computed(() => getDailyVocab(level.value))

  function pickBankIds() {
    const cards = bankWords.value.map(w => ({ ...w, id: bankSrsId(w.id), bankId: w.id, addedAt: w.addedAt || '' }))
    const due = srs.getDueWords(cards)
    const fresh = cards.filter(c => !srs.getWordSRS(c.id)).sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    const reviewSlots = BANK_WORDS_PER_DAY - Math.min(NEW_BANK_WORDS_PER_DAY, fresh.length)
    const picked = due.slice(0, reviewSlots)
    for (const c of fresh) {
      if (picked.length >= BANK_WORDS_PER_DAY) break
      picked.push(c)
    }
    return picked.map(c => c.bankId)
  }

  // Review cards that don't depend on the level: caught mistakes and saved words
  function addPersonalCards(plan) {
    if (!plan.mistakeIds) plan.mistakeIds = pickMistakeIds(mistakes.value, srs, MISTAKES_PER_DAY, NEW_MISTAKES_PER_DAY)
    if (!plan.bankIds) plan.bankIds = pickBankIds()
    if (!plan.listening) {
      const byId = (list, ids) => ids.map(id => list.find(x => x.id === id)).filter(Boolean)
      plan.listening = buildListening(byId(patterns.value, plan.patternIds), byId(words.value, plan.wordIds), patterns.value)
    }
    return plan
  }

  function buildPlan(previous) {
    return addPersonalCards({
      level: level.value,
      patternIds: pickItems(patterns.value, PATTERNS_PER_DAY, NEW_PATTERNS_PER_DAY, srs),
      wordIds: pickItems(words.value, WORDS_PER_DAY, NEW_WORDS_PER_DAY, srs),
      // Switching level keeps the personal cards already picked (and done) today
      mistakeIds: previous?.mistakeIds,
      bankIds: previous?.bankIds,
      done: previous ? Object.fromEntries(Object.entries(previous.done).filter(([id]) => id.startsWith('mistake:') || id.startsWith('bank:'))) : {},
    })
  }

  // Creates today's plan when the day or the level changed; call on screen mount
  function ensureTodayPlan() {
    const key = todayKey()
    const existing = state.value.plans[key]
    if (existing && existing.level === level.value) {
      // Plans made before mistake, saved-word and listening cards existed
      if (!existing.mistakeIds || !existing.bankIds || !existing.listening) {
        addPersonalCards(existing)
        persist()
      }
      return
    }
    state.value.plans[key] = buildPlan(existing)
    persist()
  }

  ensureTodayPlan()

  const plan = computed(() =>
    state.value.plans[todayKey()] || { level: level.value, patternIds: [], wordIds: [], mistakeIds: [], bankIds: [], listening: [], done: {} })

  const todayPatterns = computed(() =>
    plan.value.patternIds.map(id => patterns.value.find(p => p.id === id)).filter(Boolean))
  const todayWords = computed(() =>
    plan.value.wordIds.map(id => words.value.find(w => w.id === id)).filter(Boolean))

  const todayMistakes = computed(() =>
    (plan.value.mistakeIds || []).map(getMistake).filter(Boolean))
  const todayBankWords = computed(() =>
    (plan.value.bankIds || []).map(getBankWord).filter(Boolean))
  const todayListening = computed(() => plan.value.listening || [])

  // Every card's done-key, in the order the screen shows them
  const allKeys = computed(() => [
    ...todayMistakes.value.map(m => mistakeSrsId(m.id)),
    ...todayPatterns.value.map(p => p.id),
    ...todayWords.value.map(w => w.id),
    ...todayBankWords.value.map(w => bankSrsId(w.id)),
    ...todayListening.value.map(l => l.id),
  ])
  const totalCount = computed(() => allKeys.value.length)
  const doneCount = computed(() => allKeys.value.filter(id => plan.value.done[id]).length)
  const isDoneToday = computed(() => totalCount.value > 0 && doneCount.value >= totalCount.value)

  function isNew(id) {
    return !srs.getWordSRS(id)
  }

  /**
   * Record one finished item. `confidence` is the SM-2 quality (0-5); a wrong
   * choice answer caps it so the item comes back sooner.
   */
  function completeItem(id, { correct, confidence, track = true }) {
    let quality = correct ? confidence : Math.min(confidence, 2)
    // Typical Mandarin-speaker errors are scheduled a little tighter
    const mistake = id.startsWith('mistake:') && getMistake(id.slice('mistake:'.length))
    if (mistake && L1_TYPES.includes(mistake.type)) quality = Math.min(quality, 4)
    if (track) srs.recordReview(id, correct, quality)
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
    todayMistakes,
    todayBankWords,
    todayListening,
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
