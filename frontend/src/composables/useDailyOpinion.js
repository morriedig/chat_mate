import { ref, computed } from 'vue'
import {
  OPINION_QUESTIONS,
  ROTATING_CONNECTOR_IDS,
  GIVING_REASONS_CHAPTER_ID,
} from '../data/dailyOpinion'
import { getChapter } from '../data/chapterLoader'
import { detectConnectors } from '../utils/connectorDetect'
import { analyzeStructure } from '../utils/opinionStructure'
import { toLocalDateKey, getTodayKey } from '../utils/dateUtils'
import { useDiaryFeedback } from './useDiaryFeedback'
import { useUserProgress } from './useUserProgress'

const STORAGE_KEY = 'chatmate_daily_opinion'
const DAILY_OPINION_XP = 10
const KEEP_DAYS = 90

// ---------- Deterministic daily rotation (pure) ----------

/**
 * Days since epoch for the *local* calendar date. Unlike day-of-year (used by
 * useDiaryPrompts) this doesn't jump back on Jan 1, so the rotation keeps
 * cycling evenly across years.
 * @param {Date} [date]
 */
export function getDayNumber(date = new Date()) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000)
}

/** Today's question for the given date */
export function getQuestionForDate(date = new Date()) {
  return OPINION_QUESTIONS[getDayNumber(date) % OPINION_QUESTIONS.length]
}

/**
 * Two distinct connector ids for the given date. The second one is offset by
 * a step that changes every full cycle, so pairs don't repeat in lockstep.
 * @param {Date} [date]
 * @returns {[string, string]}
 */
export function getConnectorIdsForDate(date = new Date()) {
  const pool = ROTATING_CONNECTOR_IDS
  const n = pool.length
  const day = getDayNumber(date)
  const first = day % n
  const step = 1 + (Math.floor(day / n) % (n - 1)) // 1..n-1, never 0
  const second = (first + step) % n
  return [pool[first], pool[second]]
}

/**
 * Connector details from the Giving Reasons chapter, with meaning in the
 * learner's mother tongue.
 * @param {string} id - chapter word id
 * @param {string} motherTongue - 'en' | 'ja' | 'zh'
 */
export function getConnectorInfo(id, motherTongue = 'en') {
  const chapter = getChapter(GIVING_REASONS_CHAPTER_ID, 'en')
  const w = chapter?.words?.find(x => x.id === id)
  if (!w) return { id, word: id, nativeWord: '', meaning: '', example: '' }
  return {
    id,
    word: w.word.en,
    nativeWord: motherTongue === 'en' ? '' : (w.word[motherTongue] || ''),
    meaning: w.description[motherTongue] || w.description.en,
    example: w.sentence.en,
  }
}

// ---------- Persistence ----------

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (parsed && typeof parsed.days === 'object') return parsed
  } catch {
    // ignore
  }
  return { days: {} }
}

function trimDays(days) {
  const keys = Object.keys(days).sort()
  for (const k of keys.slice(0, Math.max(0, keys.length - KEEP_DAYS))) delete days[k]
  return days
}

// Singleton state
const data = ref(loadData())

function persist() {
  try {
    trimDays(data.value.days)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.value))
  } catch {
    // Storage unavailable
  }
}

function updateDay(key, patch) {
  const prev = data.value.days[key] || { date: key }
  data.value = {
    ...data.value,
    days: { ...data.value.days, [key]: { ...prev, ...patch } },
  }
  persist()
  return data.value.days[key]
}

let onlineListenerAdded = false

export function useDailyOpinion() {
  const feedbackApi = useDiaryFeedback()
  const { addXP } = useUserProgress()

  const todayKey = ref(getTodayKey())

  const question = computed(() => getQuestionForDate(new Date(todayKey.value + 'T00:00:00')))
  const connectorIds = computed(() => getConnectorIdsForDate(new Date(todayKey.value + 'T00:00:00')))

  const todayRecord = computed(() => data.value.days[todayKey.value] || null)
  const isDoneToday = computed(() => !!todayRecord.value?.completedAt)

  // Last 7 days, oldest first, for the dot row
  const last7Days = computed(() => {
    const out = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = toLocalDateKey(d)
      out.push({ key, done: !!data.value.days[key]?.completedAt, isToday: i === 0 })
    }
    return out
  })

  // Consecutive days done, counting back from today (or yesterday if today isn't done yet)
  const streak = computed(() => {
    let count = 0
    const d = new Date()
    if (!data.value.days[toLocalDateKey(d)]?.completedAt) d.setDate(d.getDate() - 1)
    while (data.value.days[toLocalDateKey(d)]?.completedAt) {
      count++
      d.setDate(d.getDate() - 1)
    }
    return count
  })

  function refreshDay() {
    todayKey.value = getTodayKey()
  }

  function saveDraft(text) {
    if (isDoneToday.value && !todayRecord.value?.rewriting) return
    updateDay(todayKey.value, { draft: text })
  }

  async function requestFeedback(key) {
    const rec = data.value.days[key]
    if (!rec?.answer || !rec.feedbackRequest) return

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      updateDay(key, { feedbackStatus: 'pending' })
      return
    }

    updateDay(key, { feedbackStatus: 'loading' })
    // Same request contract as the diary — the answer is sent as diaryText.
    const result = await feedbackApi.fetchFeedback({
      diaryText: rec.answer,
      ...rec.feedbackRequest,
      streakDays: streak.value,
    })
    if (result) {
      updateDay(key, { feedbackStatus: 'done', feedback: result })
    } else {
      updateDay(key, { feedbackStatus: 'error' })
    }
  }

  /**
   * Submit today's answer: run local checks, mark the day done, award XP once,
   * then ask for AI feedback (or queue it if offline).
   */
  async function submitAnswer(text, { characterId, nativeLanguage, level = 'intermediate' }) {
    refreshDay()
    const key = todayKey.value
    const answer = text.trim()
    if (!answer) return null

    const firstTime = !data.value.days[key]?.completedAt

    updateDay(key, {
      questionId: question.value.id,
      connectorIds: connectorIds.value,
      answer,
      usedTargets: detectConnectors(answer, connectorIds.value),
      usedAll: detectConnectors(answer),
      structure: analyzeStructure(answer),
      completedAt: data.value.days[key]?.completedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      draft: '',
      rewriting: false,
      feedback: null,
      feedbackStatus: 'none',
      feedbackRequest: { language: 'en', level, characterId, nativeLanguage },
    })

    if (firstTime) {
      addXP(DAILY_OPINION_XP, 'dailyOpinion')
    }

    await requestFeedback(key)
    return data.value.days[key]
  }

  function startRewrite() {
    const rec = todayRecord.value
    if (!rec) return
    updateDay(todayKey.value, { rewriting: true, draft: rec.answer || '' })
  }

  function cancelRewrite() {
    updateDay(todayKey.value, { rewriting: false })
  }

  function retryFeedback() {
    return requestFeedback(todayKey.value)
  }

  function markSentenceSaved(sentence) {
    const rec = todayRecord.value
    const saved = new Set(rec?.savedSentences || [])
    saved.add(sentence)
    updateDay(todayKey.value, { savedSentences: [...saved] })
  }

  // Retry any queued (offline) feedback once we're back online
  async function processPending() {
    for (const [key, rec] of Object.entries(data.value.days)) {
      if (rec.feedbackStatus === 'pending') await requestFeedback(key)
    }
  }

  if (!onlineListenerAdded && typeof window !== 'undefined') {
    onlineListenerAdded = true
    window.addEventListener('online', () => { processPending() })
  }

  return {
    // State
    question,
    connectorIds,
    todayRecord,
    isDoneToday,
    last7Days,
    streak,
    isLoadingFeedback: feedbackApi.isLoading,

    // Actions
    refreshDay,
    saveDraft,
    submitAnswer,
    startRewrite,
    cancelRewrite,
    retryFeedback,
    processPending,
    markSentenceSaved,
  }
}

export { STORAGE_KEY as DAILY_OPINION_STORAGE_KEY, DAILY_OPINION_XP }
