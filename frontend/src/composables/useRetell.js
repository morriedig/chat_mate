/**
 * "Say it three times" fluency drill (4/3/2): plan for 30s, then tell the same
 * thing three times with less time each round. Speaking the same content again
 * under time pressure is what builds fluency; no AI involved.
 */
import { ref, computed } from 'vue'
import { OPINION_QUESTIONS } from '../data/dailyOpinion'
import { getDayNumber } from './useDailyOpinion'
import { useUserProgress } from './useUserProgress'

const STORAGE_KEY = 'chatmate_retell'
const MAX_HISTORY = 30

export const PLAN_SECONDS = 30
export const ROUND_SECONDS = [90, 60, 45]
export const RETELL_XP = 10

export function countWords(text) {
  return (text || '').trim().split(/\s+/).filter(word => /[A-Za-z0-9]/.test(word)).length
}

/** Words per minute; 0 when nothing was said */
export function wordsPerMinute(words, seconds) {
  if (!words || !seconds) return 0
  return Math.round(words / (seconds / 60))
}

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return { history: Array.isArray(data?.history) ? data.history : [], xpDate: data?.xpDate || null }
  } catch {
    return { history: [], xpDate: null }
  }
}

function save(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* storage unavailable */ }
}

/** Topic for the day, shifted by `offset` when the user asks for another one */
export function getRetellTopic(offset = 0, date = new Date()) {
  // Start away from the daily opinion question so the two drills differ
  const index = (getDayNumber(date) + 7 + offset) % OPINION_QUESTIONS.length
  return OPINION_QUESTIONS[index]
}

export function useRetell() {
  const data = ref(load())
  const { addXP } = useUserProgress()

  const doneToday = computed(() => data.value.history.some(entry => entry.date === todayKey()))
  const lastResult = computed(() => data.value.history[data.value.history.length - 1] || null)

  /**
   * Save a finished drill; the first one each day earns XP
   * @param {string} topicId
   * @param {Array<{ words: number, seconds: number }>} rounds
   * @returns {{ xpEarned: number }}
   */
  function saveResult(topicId, rounds) {
    const today = todayKey()
    const entry = {
      date: today,
      topicId,
      rounds: rounds.map(r => ({ words: r.words, seconds: r.seconds, wpm: wordsPerMinute(r.words, r.seconds) })),
    }
    const xpEarned = data.value.xpDate === today ? 0 : RETELL_XP
    data.value = {
      history: [...data.value.history, entry].slice(-MAX_HISTORY),
      xpDate: today,
    }
    save(data.value)
    if (xpEarned) addXP(xpEarned, 'retell')
    return { xpEarned }
  }

  return { doneToday, lastResult, saveResult }
}

export { STORAGE_KEY as RETELL_STORAGE_KEY }
