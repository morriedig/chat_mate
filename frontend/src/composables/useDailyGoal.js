import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const STORAGE_KEY = 'chatmate_dailyGoal'
const GOALS = [5, 10, 15] // minutes

function loadGoalData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveGoalData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage unavailable
  }
}

function getToday() {
  return new Date().toISOString().split('T')[0]
}

// Singleton state
const goalMinutes = ref(10)
const todayMinutes = ref(0)
const lastDate = ref(getToday())
let sessionStart = null
let timerInterval = null

// Initialize from storage
const saved = loadGoalData()
if (saved) {
  goalMinutes.value = saved.goalMinutes || 10
  if (saved.lastDate === getToday()) {
    todayMinutes.value = saved.todayMinutes || 0
  }
  lastDate.value = saved.lastDate || getToday()
}

export function useDailyGoal() {
  const progress = computed(() => {
    if (goalMinutes.value <= 0) return 0
    return Math.min(1, todayMinutes.value / goalMinutes.value)
  })

  const isGoalMet = computed(() => progress.value >= 1)
  const remainingMinutes = computed(() => Math.max(0, goalMinutes.value - todayMinutes.value))

  function startTimer() {
    if (timerInterval) return // Already running (singleton guard)
    // Reset if it's a new day
    if (lastDate.value !== getToday()) {
      todayMinutes.value = 0
      lastDate.value = getToday()
    }
    sessionStart = Date.now()
    timerInterval = setInterval(tick, 30000) // Update every 30 seconds
  }

  function stopTimer() {
    if (!timerInterval) return
    tick() // Final update
    sessionStart = null
    clearInterval(timerInterval)
    timerInterval = null
  }

  function tick() {
    if (!sessionStart) return
    const elapsed = (Date.now() - sessionStart) / 60000 // minutes
    const prevMinutes = todayMinutes.value
    todayMinutes.value = Math.round((todayMinutes.value + elapsed) * 10) / 10
    sessionStart = Date.now() // Reset for next tick
    save()

    // Return true if goal was just met
    return prevMinutes < goalMinutes.value && todayMinutes.value >= goalMinutes.value
  }

  function setGoal(minutes) {
    if (GOALS.includes(minutes)) {
      goalMinutes.value = minutes
      save()
    }
  }

  function save() {
    saveGoalData({
      goalMinutes: goalMinutes.value,
      todayMinutes: todayMinutes.value,
      lastDate: lastDate.value,
    })
  }

  return {
    goalMinutes,
    todayMinutes,
    progress,
    isGoalMet,
    remainingMinutes,
    goals: GOALS,
    startTimer,
    stopTimer,
    setGoal,
  }
}
