# Gamification System

A Duolingo-inspired progression system to encourage continuous learning through XP rewards, ranks, and streaks.

## Features Overview

| Feature | Description | Documentation |
|---------|-------------|---------------|
| XP System | Earn experience points through conversations | [xp-system.md](./xp-system.md) |
| Rank System | Level up from Novice to Legend | [rank-system.md](./rank-system.md) |
| Streak System | Track consecutive days of learning | [streak-system.md](./streak-system.md) |

## Quick Reference

### XP Rewards
- User message: +5 XP
- AI response: +2 XP
- Daily streak: +10 XP
- First message of day: +5 XP

### Ranks (10 levels)
Novice (0) -> Beginner (100) -> Learner (300) -> Speaker (600) -> Conversationalist (1000) -> Fluent (1500) -> Advanced (2200) -> Expert (3000) -> Master (4000) -> Legend (5500)

### Streak Milestones
3, 7, 14, 30, 60, 100, 365 days with bonus XP rewards.

## Implementation

All gamification logic is in `frontend/src/composables/useUserProgress.js`.

### Components
- `RankBadge.vue` - Displays rank and streak in header
- `LevelUpModal.vue` - Level-up celebration
- `StreakMilestoneModal.vue` - Streak milestone celebration

### Storage
Progress is persisted to localStorage under key `chatmate_userProgress`.
