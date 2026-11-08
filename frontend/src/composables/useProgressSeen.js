import { ref, computed } from 'vue'
import { useUserProgress } from './useUserProgress'

// Quiet "new" markers for the 進度與成就 panel. Level-ups and unlocks no longer
// open a modal, so the panel shows what changed since the user last looked.
// Only the seen snapshot is stored here; XP, streak and achievements are untouched.
export const SEEN_KEY = 'chatmate_progress_seen'

function readSeen() {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.achievements)) return null
    return { achievements: parsed.achievements, rankLevel: Number(parsed.rankLevel) || 1 }
  } catch {
    return null
  }
}

function writeSeen(value) {
  try { localStorage.setItem(SEEN_KEY, JSON.stringify(value)) } catch { /* storage unavailable */ }
}

const seen = ref(null)

export function useProgressSeen() {
  const { progress, currentRank } = useUserProgress()

  // First run: treat everything earned so far as seen, so nothing old is marked new
  if (!seen.value) {
    seen.value = readSeen() || {
      achievements: [...(progress.value.unlockedAchievements || [])],
      rankLevel: currentRank.value.level,
    }
    writeSeen(seen.value)
  }

  const newAchievementIds = computed(() =>
    (progress.value.unlockedAchievements || []).filter(id => !seen.value.achievements.includes(id))
  )
  const rankIsNew = computed(() => currentRank.value.level > seen.value.rankLevel)
  const hasNew = computed(() => newAchievementIds.value.length > 0 || rankIsNew.value)

  function markAchievementsSeen() {
    seen.value = { ...seen.value, achievements: [...(progress.value.unlockedAchievements || [])] }
    writeSeen(seen.value)
  }

  function markRankSeen() {
    seen.value = { ...seen.value, rankLevel: currentRank.value.level }
    writeSeen(seen.value)
  }

  return { newAchievementIds, rankIsNew, hasNew, markAchievementsSeen, markRankSeen }
}

// Tests only
export function _resetProgressSeen() {
  seen.value = null
}
