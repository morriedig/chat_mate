# Rank System

Ranks provide visible milestones and a sense of achievement as users accumulate XP.

## Rank Definitions

| Level | Title | Min XP | Icon | Approx. Messages |
|-------|-------|--------|------|------------------|
| 1 | Novice | 0 | 🌱 | 0 |
| 2 | Beginner | 100 | 🌿 | ~15 |
| 3 | Learner | 300 | 🌳 | ~45 |
| 4 | Speaker | 600 | 💬 | ~90 |
| 5 | Conversationalist | 1000 | 🗣️ | ~145 |
| 6 | Fluent | 1500 | 📚 | ~215 |
| 7 | Advanced | 2200 | 🎓 | ~315 |
| 8 | Expert | 3000 | ⭐ | ~430 |
| 9 | Master | 4000 | 🏆 | ~570 |
| 10 | Legend | 5500 | 👑 | ~785 |

*Messages calculated at ~7 XP per exchange (5 user + 2 AI)*

## Progression Curve

XP requirements increase progressively:
- Early ranks (1-4): Quick wins to hook users
- Mid ranks (5-7): Steady progression
- High ranks (8-10): Long-term commitment

## Level Up Experience

When a user reaches a new rank:
1. `showLevelUp` flag triggers modal
2. `LevelUpModal.vue` displays celebration
3. New rank icon and title shown
4. Confetti animation plays
5. User dismisses to continue

## Implementation

```javascript
const RANKS = [
  { level: 1, title: 'Novice', minXP: 0, icon: '🌱' },
  { level: 2, title: 'Beginner', minXP: 100, icon: '🌿' },
  // ... etc
]

const currentRank = computed(() => {
  let rank = RANKS[0]
  for (const r of RANKS) {
    if (xp >= r.minXP) rank = r
    else break
  }
  return rank
})
```

## UI Components

### RankBadge
- Shows current rank icon and title
- Displays XP progress bar to next rank
- Tooltip shows detailed stats

### Progress Bar
```javascript
const progressToNextRank = computed(() => {
  const xpInCurrentRank = totalXP - currentRank.minXP
  const xpNeededForNext = nextRank.minXP - currentRank.minXP
  return (xpInCurrentRank / xpNeededForNext) * 100
})
```
