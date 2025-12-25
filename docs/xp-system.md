# XP System

Experience points (XP) are the core currency of the gamification system. Users earn XP through interactions, which accumulate toward rank progression.

## XP Rewards

| Action | XP | Trigger |
|--------|-----|---------|
| User sends message | +5 | `onMessageSent()` |
| AI responds | +2 | `onMessageReceived()` |
| Daily streak bonus | +10 | First activity on consecutive day |
| First message of day | +5 | First message after midnight |

## Design Principles

### Simplicity (Duolingo-style)
- Fixed XP values per action
- No difficulty multipliers
- Predictable progression

### Engagement Loop
1. User sends message -> +5 XP
2. AI responds -> +2 XP
3. Total per exchange: +7 XP
4. ~15 exchanges = 100 XP = Level 2

## Implementation

```javascript
const XP_REWARDS = {
  userMessage: 5,
  systemMessage: 2,
  dailyStreak: 10,
  firstMessageOfDay: 5,
}

function addXP(amount, reason) {
  progress.value.totalXP += amount
  // Check for level up
  // Save to localStorage
}
```

## XP Display

XP gains are shown briefly (+5 XP animation) and accumulated in the rank badge tooltip.

### Tracked Stats
- `totalXP` - Cumulative XP earned
- `messagesSent` - Total user messages
- `messagesReceived` - Total AI responses
