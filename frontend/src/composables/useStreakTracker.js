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

  function updateStreak() {
    const today = new Date().toDateString()
    const lastActive = progress.value.lastActiveDate

    if (lastActive !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      if (lastActive === yesterday.toDateString()) {
        progress.value.currentStreak += 1
        if (progress.value.currentStreak > progress.value.longestStreak) {
          progress.value.longestStreak = progress.value.currentStreak
        }
        addXP(XP_REWARDS.dailyStreak, 'streak')
        checkStreakMilestone(progress.value.currentStreak)
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
