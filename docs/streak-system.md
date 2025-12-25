# Streak System

Streaks encourage daily practice by tracking consecutive days of activity and rewarding consistency.

## How Streaks Work

1. **First Activity**: User starts with streak = 1
2. **Consecutive Day**: Streak increments (+10 XP bonus)
3. **Missed Day**: Streak resets to 1

## Streak Detection

```javascript
function updateStreak() {
  const today = new Date().toDateString()
  const lastActive = progress.value.lastActiveDate

  if (lastActive === yesterday) {
    // Consecutive - increment streak
    currentStreak += 1
    addXP(10, 'streak')
  } else if (lastActive !== today) {
    // Broken - reset to 1
    currentStreak = 1
  }

  // First message of day bonus
  if (lastActive !== today) {
    addXP(5, 'firstOfDay')
    lastActiveDate = today
  }
}
```

## Streak Milestones

Special achievements for reaching streak goals:

| Days | Bonus XP | Icon | Significance |
|------|----------|------|--------------|
| 3 | 15 | 🔥 | Getting started |
| 7 | 35 | ⚡ | One week |
| 14 | 70 | 💪 | Two weeks |
| 30 | 150 | 🌟 | One month |
| 60 | 300 | 💎 | Two months |
| 100 | 500 | 🏆 | 100 days |
| 365 | 1825 | 👑 | One year |

### Milestone Claiming

- Each milestone can only be claimed once
- Claimed milestones stored in `claimedMilestones[]`
- `StreakMilestoneModal` displays celebration

## Daily Bonuses

| Bonus | XP | Condition |
|-------|-----|-----------|
| Daily Streak | +10 | Continue streak from yesterday |
| First Message | +5 | First message after midnight |

## UI Display

### RankBadge Streak Indicator
- Shows fire emoji 🔥 with streak count
- Example: "🔥 7" for 7-day streak

### Stats Tracked
- `currentStreak` - Current consecutive days
- `longestStreak` - Personal best
- `lastActiveDate` - For streak calculation
- `claimedMilestones` - Awarded milestones

## Psychology

- **Loss Aversion**: Users don't want to break their streak
- **Variable Rewards**: Milestone bonuses add surprise
- **Social Proof**: Streak count is visible and shareable
