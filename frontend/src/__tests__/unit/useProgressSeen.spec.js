import { describe, it, expect, beforeEach, vi } from 'vitest'

// useUserProgress reads localStorage at import time, so each test loads fresh modules
async function load() {
  vi.resetModules()
  const progressMod = await import('../../composables/useUserProgress')
  const seenMod = await import('../../composables/useProgressSeen')
  return { useUserProgress: progressMod.useUserProgress, ...seenMod }
}

const storedProgress = (extra = {}) => ({
  totalXP: 120,
  messagesSent: 12,
  currentStreak: 3,
  longestStreak: 5,
  unlockedAchievements: ['first_chat', 'ice_breaker'],
  ...extra,
})

describe('useProgressSeen', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('treats everything earned before the first run as seen', async () => {
    localStorage.setItem('chatmate_userProgress', JSON.stringify(storedProgress()))
    const { useProgressSeen, SEEN_KEY } = await load()
    const { hasNew, newAchievementIds, rankIsNew } = useProgressSeen()

    expect(hasNew.value).toBe(false)
    expect(newAchievementIds.value).toEqual([])
    expect(rankIsNew.value).toBe(false)
    expect(JSON.parse(localStorage.getItem(SEEN_KEY))).toEqual({
      achievements: ['first_chat', 'ice_breaker'],
      rankLevel: 2,
    })
  })

  it('marks a later unlock and rank as new until seen, without touching progress data', async () => {
    localStorage.setItem('chatmate_userProgress', JSON.stringify(storedProgress()))
    localStorage.setItem('chatmate_progress_seen', JSON.stringify({ achievements: ['first_chat'], rankLevel: 1 }))
    const { useProgressSeen } = await load()
    const before = localStorage.getItem('chatmate_userProgress')
    const { hasNew, newAchievementIds, rankIsNew, markAchievementsSeen, markRankSeen } = useProgressSeen()

    expect(newAchievementIds.value).toEqual(['ice_breaker'])
    expect(rankIsNew.value).toBe(true)
    expect(hasNew.value).toBe(true)

    markAchievementsSeen()
    expect(newAchievementIds.value).toEqual([])
    expect(hasNew.value).toBe(true)
    markRankSeen()
    expect(hasNew.value).toBe(false)

    expect(localStorage.getItem('chatmate_userProgress')).toBe(before)
  })

  it('keeps accumulating XP and achievements; unlocks show as new instead of a modal', async () => {
    const { useUserProgress, useProgressSeen } = await load()
    const { onMessageSent, progress } = useUserProgress()
    const { newAchievementIds } = useProgressSeen()
    expect(newAchievementIds.value).toEqual([])

    onMessageSent()

    expect(progress.value.totalXP).toBeGreaterThan(0)
    expect(progress.value.unlockedAchievements).toContain('first_chat')
    expect(newAchievementIds.value).toContain('first_chat')
  })

  it('recovers from a corrupt seen record', async () => {
    localStorage.setItem('chatmate_progress_seen', '{bad json')
    const { useProgressSeen } = await load()
    expect(useProgressSeen().hasNew.value).toBe(false)
  })
})
