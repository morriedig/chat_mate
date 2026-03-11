import { ref } from 'vue'

// Streak milestones with bonus XP
export const STREAK_MILESTONES = [
  { days: 3, bonus: 15, icon: '🔥' },
  { days: 7, bonus: 35, icon: '⚡' },
  { days: 14, bonus: 70, icon: '💪' },
  { days: 30, bonus: 150, icon: '🌟' },
  { days: 60, bonus: 300, icon: '💎' },
  { days: 100, bonus: 500, icon: '🏆' },
  { days: 365, bonus: 1825, icon: '👑' },
]

// Singleton UI state
export const showStreakMilestone = ref(false)
export const currentMilestone = ref(null)

export function useStreakTracker(progress, saveProgress, addXP, XP_REWARDS) {
  function checkStreakMilestone(streakDays) {
    for (const milestone of STREAK_MILESTONES) {
      if (streakDays === milestone.days && !progress.value.claimedMilestones.includes(milestone.days)) {
        progress.value.claimedMilestones.push(milestone.days)
        addXP(milestone.bonus, 'streakMilestone')
        currentMilestone.value = milestone
        showStreakMilestone.value = true
        return true
      }
    }
    return false
  }

  // Streak freeze: replenish weekly, auto-use on streak break
  function replenishFreezes() {
    const now = new Date()
    const lastReplenish = progress.value.lastFreezeReplenish
    if (!lastReplenish) {
      progress.value.streakFreezes = Math.min((progress.value.streakFreezes || 0) + 1, 2)
      progress.value.lastFreezeReplenish = now.toDateString()
      return
    }
    // Replenish 1 freeze every 7 days (DST-safe using date comparison)
    const lastDate = new Date(lastReplenish)
    const diffDays = Math.round((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate())) / 86400000)
    if (diffDays >= 7) {
      progress.value.streakFreezes = Math.min((progress.value.streakFreezes || 0) + 1, 2)
      progress.value.lastFreezeReplenish = now.toDateString()
    }
  }

  function useStreakFreeze() {
    if ((progress.value.streakFreezes || 0) > 0) {
      progress.value.streakFreezes -= 1
      return true
    }
    return false
  }

  function updateStreak() {
    const today = new Date().toDateString()
    const lastActive = progress.value.lastActiveDate

    // Replenish freezes on each visit
    replenishFreezes()

    if (lastActive !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      if (lastActive === yesterday.toDateString()) {
        // Consecutive day
        progress.value.currentStreak += 1
        if (progress.value.currentStreak > progress.value.longestStreak) {
          progress.value.longestStreak = progress.value.currentStreak
        }
        addXP(XP_REWARDS.dailyStreak, 'streak')
        checkStreakMilestone(progress.value.currentStreak)
      } else if (lastActive) {
        // Missed at least one day - try to use a freeze
        const todayDate = new Date(today)
        const lastActiveDate = new Date(lastActive)
        const daysMissed = Math.round((Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()) - Date.UTC(lastActiveDate.getFullYear(), lastActiveDate.getMonth(), lastActiveDate.getDate())) / 86400000)
        if (daysMissed === 2 && useStreakFreeze()) {
          // Freeze covers 1 missed day (yesterday)
          progress.value.currentStreak += 1
          if (progress.value.currentStreak > progress.value.longestStreak) {
            progress.value.longestStreak = progress.value.currentStreak
          }
        } else {
          // Streak broken
          progress.value.currentStreak = 1
        }
      } else {
        progress.value.currentStreak = 1
      }

      addXP(XP_REWARDS.firstMessageOfDay, 'firstOfDay')
      progress.value.lastActiveDate = today
      saveProgress()
    }
  }

  function dismissStreakMilestone() {
    showStreakMilestone.value = false
    currentMilestone.value = null
  }

  return {
    updateStreak,
    dismissStreakMilestone,
  }
}
