import { ref, computed } from 'vue'
import { useSRS } from './useSRS'
import { getDailyPatterns, getDailyVocab } from '../data/dailyLoader'
import { useMistakes, pickMistakeIds, srsId as mistakeSrsId, L1_TYPES } from './useMistakes'
import { useVocabularyBank } from './useVocabularyBank'
import { useSpeakingQueue, addDays } from './useSpeakingQueue'
import { useUserProgress } from './useUserProgress'

const STORAGE_KEY = 'chatmate_daily_practice'
const STATE_VERSION = 2
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
export const builtinErrorKey = patternId => `builtin:${patternId}`

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

/**
 * Version 1 had no `version` field and no `core` slot. Its plans keep working
 * as they are; today's plan gets a `core` slot the next time it is opened.
 */
export function migrateState(saved) {
  if (!saved || typeof saved !== 'object' || !LEVELS.includes(saved.level) || !saved.plans || typeof saved.plans !== 'object') return null
  return { ...saved, version: STATE_VERSION }
}

function loadState() {
  try {
    const migrated = migrateState(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'))
    if (migrated) return migrated
  } catch {
    // Ignore malformed state
  }
  return { version: STATE_VERSION, level: defaultLevel(), plans: {} }
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

// Step 3 needs a real attempt: any spoken transcript, or at least 2 English words typed
export function countEnglishWords(text) {
  return (String(text || '').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g) || []).length
}

export function isValidCoreAnswer(mode, text) {
  if (mode === 'voice') return String(text || '').trim().length > 0
  return countEnglishWords(text) >= 2
}

export function useDailyPractice() {
  const srs = useSRS()
  const { mistakes, getMistake } = useMistakes()
  const { words: bankWords, getWord: getBankWord } = useVocabularyBank()
  const speakingQueue = useSpeakingQueue()

  const level = computed(() => state.value.level)
  const patterns = computed(() => getDailyPatterns(level.value))
  const words = computed(() => getDailyVocab(level.value))
  const findPattern = id => patterns.value.find(p => p.id === id) || null

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

  // ---------- Core 3 steps: building ----------

  // A "common mistake" card from the pattern data, for learners with no mistakes of their own
  function builtinErrorPatternId(plan, corePatternId) {
    const candidates = [findPattern(corePatternId), ...plan.patternIds.map(findPattern), ...patterns.value]
    return candidates.find(p => p?.mistake?.wrong && p?.mistake?.right)?.id || null
  }

  function fallbackPromptFor(patternId) {
    const p = findPattern(patternId)
    return p ? { task: p.task || '', pattern: p.pattern || '', meaning: p.meaning || '' } : null
  }

  /**
   * Today's core: one old mistake, one pattern, one sentence to say.
   * Old mistake: the first personal card (mistakeIds is already due-first, then
   * newest), else a built-in common mistake. Pattern: first due, then new
   * (patternIds order). Sentence: the earliest due speaking-queue item, else a
   * local prompt from the pattern's task (no AI call).
   */
  function buildCore(plan, previousCore = null) {
    const patternId = plan.patternIds.find(id => !plan.done[id]) || plan.patternIds[0] || null
    const mistakeId = (plan.mistakeIds || []).find(id => getMistake(id) && !plan.done[mistakeSrsId(id)])
    const builtinId = mistakeId ? null : builtinErrorPatternId(plan, patternId)
    const due = speakingQueue.nextDue(todayKey())
    const core = {
      errorKey: mistakeId ? mistakeSrsId(mistakeId) : builtinId ? builtinErrorKey(builtinId) : null,
      errorSource: mistakeId ? 'personal' : 'builtin',
      patternId,
      speakingSource: due ? 'queue' : 'pattern',
      speakingItemId: due ? due.id : null,
      fallbackPrompt: due ? null : fallbackPromptFor(patternId),
      errorCompletedAt: null,
      patternCompletedAt: null,
      speakingAttempt: null,
      speakingMode: null,
      speakingCompletedAt: null,
      completedAt: null,
    }
    // Switching level only swaps the level-bound parts; finished personal steps stay
    if (previousCore) {
      if (previousCore.completedAt) return previousCore
      if (previousCore.errorSource === 'personal') {
        for (const k of ['errorKey', 'errorSource', 'errorCompletedAt']) core[k] = previousCore[k]
      }
      if (previousCore.speakingSource === 'queue') {
        for (const k of ['speakingSource', 'speakingItemId', 'fallbackPrompt', 'speakingAttempt', 'speakingMode', 'speakingCompletedAt']) core[k] = previousCore[k]
      }
    }
    return core
  }

  function buildPlan(previous) {
    const plan = addPersonalCards({
      level: level.value,
      patternIds: pickItems(patterns.value, PATTERNS_PER_DAY, NEW_PATTERNS_PER_DAY, srs),
      wordIds: pickItems(words.value, WORDS_PER_DAY, NEW_WORDS_PER_DAY, srs),
      // Switching level keeps the personal cards already picked (and done) today
      mistakeIds: previous?.mistakeIds,
      bankIds: previous?.bankIds,
      done: previous ? Object.fromEntries(Object.entries(previous.done).filter(([id]) => id.startsWith('mistake:') || id.startsWith('bank:'))) : {},
    })
    plan.core = buildCore(plan, previous?.core)
    return plan
  }

  // Version 1 plans, and cores whose content went missing (a deleted mistake or queue item)
  function repairCore(plan) {
    if (!plan.core) {
      plan.core = buildCore(plan)
      // Every card was finished before the core existed: today already counts as done
      const keys = [
        ...(plan.mistakeIds || []).filter(getMistake).map(mistakeSrsId),
        ...plan.patternIds,
        ...plan.wordIds,
        ...(plan.bankIds || []).filter(getBankWord).map(bankSrsId),
        ...(plan.listening || []).map(l => l.id),
      ]
      if (keys.length > 0 && keys.every(k => plan.done[k])) plan.core.completedAt = new Date().toISOString()
      return true
    }
    const core = plan.core
    if (core.completedAt) return false
    let changed = false
    if (!core.errorCompletedAt && core.errorSource === 'personal' && !getMistake(String(core.errorKey || '').slice('mistake:'.length))) {
      const builtinId = builtinErrorPatternId(plan, core.patternId)
      core.errorKey = builtinId ? builtinErrorKey(builtinId) : null
      core.errorSource = 'builtin'
      changed = true
    }
    if (!core.speakingCompletedAt && core.speakingSource === 'queue' && !speakingQueue.getItem(core.speakingItemId)) {
      core.speakingSource = 'pattern'
      core.speakingItemId = null
      core.fallbackPrompt = fallbackPromptFor(core.patternId)
      core.speakingAttempt = null
      changed = true
    }
    return changed
  }

  // Creates today's plan when the day or the level changed; call on screen mount
  function ensureTodayPlan() {
    const key = todayKey()
    const existing = state.value.plans[key]
    if (existing && existing.level === level.value) {
      let changed = false
      // Plans made before mistake, saved-word and listening cards existed
      if (!existing.mistakeIds || !existing.bankIds || !existing.listening) {
        addPersonalCards(existing)
        changed = true
      }
      if (repairCore(existing)) changed = true
      if (changed) persist()
      return
    }
    state.value.plans[key] = buildPlan(existing)
    persist()
  }

  ensureTodayPlan()

  const plan = computed(() =>
    state.value.plans[todayKey()] || { level: level.value, patternIds: [], wordIds: [], mistakeIds: [], bankIds: [], listening: [], done: {}, core: null })

  const todayPatterns = computed(() =>
    plan.value.patternIds.map(id => patterns.value.find(p => p.id === id)).filter(Boolean))
  const todayWords = computed(() =>
    plan.value.wordIds.map(id => words.value.find(w => w.id === id)).filter(Boolean))

  const todayMistakes = computed(() =>
    (plan.value.mistakeIds || []).map(getMistake).filter(Boolean))
  const todayBankWords = computed(() =>
    (plan.value.bankIds || []).map(getBankWord).filter(Boolean))
  const todayListening = computed(() => plan.value.listening || [])

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

  // ---------- Core 3 steps: state ----------
  const core = computed(() => plan.value.core || null)
  const coreKeys = computed(() => [core.value?.errorKey, core.value?.patternId].filter(Boolean))

  const coreError = computed(() => {
    const c = core.value
    if (!c?.errorKey) return null
    if (c.errorSource === 'personal') return getMistake(c.errorKey.slice('mistake:'.length))
    const p = findPattern(c.errorKey.slice('builtin:'.length))
    if (!p?.mistake) return null
    return { id: c.errorKey, original: p.mistake.wrong, corrected: p.mistake.right, explanation: p.mistake.why || '', hint: '', type: 'other', source: 'builtin' }
  })
  const corePattern = computed(() => (core.value?.patternId ? findPattern(core.value.patternId) : null))

  // What step 3 asks for. `target` is only shown after the learner has tried.
  const coreSpeaking = computed(() => {
    const c = core.value
    if (!c) return null
    const item = c.speakingSource === 'queue' ? speakingQueue.getItem(c.speakingItemId) : null
    if (item) {
      const p = item.patternId ? findPattern(item.patternId) : null
      return { source: item.source, itemId: item.id, cue: item.cue, hint: item.hint, target: item.target, original: item.original, pattern: p?.pattern || '', match: p?.match || [] }
    }
    const fallback = c.fallbackPrompt || fallbackPromptFor(c.patternId)
    if (!fallback) return null
    return { source: 'pattern', itemId: null, cue: fallback.task, hint: fallback.meaning, target: '', original: '', pattern: fallback.pattern, match: corePattern.value?.match || [] }
  })

  const errorStepDone = computed(() => !!core.value && (!!core.value.errorCompletedAt || !coreError.value))
  const patternStepDone = computed(() => !!core.value && (!!core.value.patternCompletedAt || !corePattern.value))
  const speakingStepDone = computed(() => !!core.value && (!!core.value.speakingCompletedAt || !coreSpeaking.value))

  // 'error' | 'pattern' | 'speaking' | 'done'; picks up exactly where the learner left
  const coreStep = computed(() => {
    if (!core.value || core.value.completedAt) return 'done'
    if (!errorStepDone.value) return 'error'
    if (!patternStepDone.value) return 'pattern'
    if (!speakingStepDone.value) return 'speaking'
    return 'done'
  })
  const coreDoneCount = computed(() => {
    if (core.value?.completedAt) return 3
    return [errorStepDone.value, patternStepDone.value, speakingStepDone.value].filter(Boolean).length
  })

  // "Today is done" means the core 3 steps, whatever happens with the extra items
  const isDoneToday = computed(() => !!core.value?.completedAt)

  function finishCoreIfReady() {
    const c = core.value
    if (!c || c.completedAt) return
    if (!errorStepDone.value || !patternStepDone.value || !speakingStepDone.value) return
    c.completedAt = new Date().toISOString()
    persist()
    useUserProgress().markPracticeDay('core-practice', { mode: c.speakingMode || 'text' })
  }

  /** Step 1 finished. A personal mistake also counts as today's mistake card. */
  function completeCoreError(result = { correct: true, confidence: 3 }, { removed = false } = {}) {
    const c = core.value
    if (!c || c.errorCompletedAt) return
    if (c.errorSource === 'personal' && c.errorKey) completeItem(c.errorKey, { ...result, track: !removed })
    c.errorCompletedAt = new Date().toISOString()
    persist()
    finishCoreIfReady()
  }

  /** Step 2 answered: right = SM-2 quality 4, wrong = 2 */
  function completeCorePattern(correct) {
    const c = core.value
    if (!c || c.patternCompletedAt) return
    if (c.patternId) completeItem(c.patternId, { correct, confidence: correct ? 4 : 2 })
    c.patternCompletedAt = new Date().toISOString()
    persist()
    finishCoreIfReady()
  }

  /** Step 3 attempt sent (kept so a reopened screen shows it waiting for a rating) */
  function submitCoreSpeaking({ mode, text }) {
    const c = core.value
    if (!c || c.speakingCompletedAt || !isValidCoreAnswer(mode, text)) return false
    c.speakingAttempt = { mode: mode === 'voice' ? 'voice' : 'text', text: String(text).trim(), at: new Date().toISOString() }
    persist()
    return true
  }

  /**
   * Step 3 rated. The core counts as done either way; 'again' brings the
   * sentence back on the next free day, 'got-it' finishes a queue item.
   */
  function rateCoreSpeaking(selfRating) {
    const c = core.value
    const attempt = c?.speakingAttempt
    if (!c || !attempt || c.speakingCompletedAt) return
    const prompt = coreSpeaking.value
    if (prompt?.itemId) {
      speakingQueue.recordAttempt(prompt.itemId, { mode: attempt.mode, text: attempt.text, selfRating }, todayKey())
    } else if (selfRating === 'again' && prompt) {
      speakingQueue.enqueue({
        source: 'pattern-fallback',
        sourceId: c.patternId || '',
        cue: prompt.cue,
        hint: prompt.hint,
        patternId: c.patternId || '',
        scheduledFor: speakingQueue.firstFreeDate(addDays(todayKey(), 1)),
      })
    }
    c.speakingMode = attempt.mode
    c.speakingRating = selfRating
    c.speakingCompletedAt = new Date().toISOString()
    persist()
    finishCoreIfReady()
  }

  // ---------- Extra items ("再練一些"): every card the core didn't use ----------
  const allKeys = computed(() => [
    ...todayMistakes.value.map(m => mistakeSrsId(m.id)),
    ...todayPatterns.value.map(p => p.id),
    ...todayWords.value.map(w => w.id),
    ...todayBankWords.value.map(w => bankSrsId(w.id)),
    ...todayListening.value.map(l => l.id),
  ])
  const extraKeys = computed(() => allKeys.value.filter(k => !coreKeys.value.includes(k)))
  const totalCount = computed(() => extraKeys.value.length)
  const doneCount = computed(() => extraKeys.value.filter(id => plan.value.done[id]).length)
  const remainingCount = computed(() => totalCount.value - doneCount.value)

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
    // Extra items only (the core's mistake and pattern are left out)
    totalCount,
    doneCount,
    remainingCount,
    isDoneToday,
    core,
    coreKeys,
    coreStep,
    coreDoneCount,
    coreError,
    corePattern,
    coreSpeaking,
    completeCoreError,
    completeCorePattern,
    submitCoreSpeaking,
    rateCoreSpeaking,
    isDone: id => !!plan.value.done[id],
    isNew,
    completeItem,
    setLevel,
    ensureTodayPlan,
  }
}
