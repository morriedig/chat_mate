# Features Implementation Guide

Based on the design principles in `plans.md`, here's how to implement each feature.

---

## 1. Goal Setting (Travel Destinations)

### Concept
Users select a travel destination (Japan, USA, UK, etc.) and receive contextual vocabulary and conversations.

### Implementation

**Data Structure** - Add to `src/data/destinations.js`:
```javascript
export const destinations = {
  japan: {
    id: 'japan',
    name: { en: 'Japan', ja: '日本', zh: '日本' },
    icon: '🇯🇵',
    scenarios: ['airport', 'train-station', 'restaurant', 'hotel', 'shopping', 'emergency'],
    chapters: ['travel-japan-basics', 'tokyo-navigation', 'japanese-food-ordering']
  },
  usa: {
    id: 'usa',
    name: { en: 'United States', ja: 'アメリカ', zh: '美國' },
    icon: '🇺🇸',
    scenarios: ['airport', 'uber-taxi', 'restaurant', 'hotel', 'shopping', 'tipping'],
    chapters: ['travel-usa-basics', 'american-small-talk', 'us-customs']
  },
  uk: {
    id: 'uk',
    name: { en: 'United Kingdom', ja: 'イギリス', zh: '英國' },
    icon: '🇬🇧',
    scenarios: ['airport', 'tube-bus', 'pub-restaurant', 'hotel', 'shopping'],
    chapters: ['travel-uk-basics', 'british-expressions', 'london-navigation']
  }
}
```

**YAML Chapter Structure** - Create `chapters/travel/japan-basics.yml`:
```yaml
meta:
  id: travel-japan-basics
  title:
    en: "Japan Travel Basics"
    ja: "日本旅行の基本"
    zh: "日本旅行基礎"
  destination: japan
  scenario: general
  level: beginner

words:
  - id: ticket
    word:
      en: Ticket
      ja: 切符
      zh: 車票
    context: "Used at train stations and attractions"
    # ... rest of word data
```

**UI Changes**:
1. Add destination selector in `SetupScreen.vue` after mode selection
2. Filter chapters by selected destination
3. Show destination-specific scenarios in Learning Mode

**Storage** - Add to `useUserProgress.js`:
```javascript
const userGoals = ref({
  destination: null,        // 'japan', 'usa', 'uk'
  tripDate: null,           // Optional: target travel date
  focusScenarios: []        // Selected scenarios to practice
})
```

---

## 2. Progression System (Level Up Mechanism)

### Concept
Unlock harder content as users progress. Track weekly rankings.

### Implementation

**Unlock System** - Add to `useLearningProgress.js`:
```javascript
const chapterUnlocks = {
  // Chapter ID -> requirements to unlock
  'intermediate-conversations': {
    requiredXP: 500,
    requiredChapters: ['basic-greetings', 'numbers', 'apologies-excuse-me'],
    requiredQuizScore: 70  // Minimum 70% on prerequisite quizzes
  },
  'advanced-business': {
    requiredXP: 2000,
    requiredChapters: ['intermediate-conversations', 'work-vocabulary'],
    requiredQuizScore: 80
  }
}

function isChapterUnlocked(chapterId) {
  const requirements = chapterUnlocks[chapterId]
  if (!requirements) return true  // No requirements = always unlocked

  const progress = userProgress.value
  return (
    progress.totalXP >= requirements.requiredXP &&
    requirements.requiredChapters.every(id => isChapterCompleted(id)) &&
    getChapterQuizScore(chapterId) >= requirements.requiredQuizScore
  )
}
```

**Weekly Ranking** - Add `useWeeklyRanking.js`:
```javascript
const STORAGE_KEY = 'chatmate_weeklyRanking'

export function useWeeklyRanking() {
  const weeklyStats = ref({
    weekStart: getWeekStart(),
    xpEarned: 0,
    messagesCount: 0,
    quizzesCompleted: 0,
    streakDays: 0,
    chaptersCompleted: []
  })

  function getWeekStart() {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(now.setDate(diff)).toISOString().split('T')[0]
  }

  function addWeeklyXP(amount) {
    checkWeekReset()
    weeklyStats.value.xpEarned += amount
    save()
  }

  function checkWeekReset() {
    const currentWeek = getWeekStart()
    if (weeklyStats.value.weekStart !== currentWeek) {
      // Archive last week, reset stats
      archiveWeek(weeklyStats.value)
      weeklyStats.value = {
        weekStart: currentWeek,
        xpEarned: 0,
        messagesCount: 0,
        quizzesCompleted: 0,
        streakDays: 0,
        chaptersCompleted: []
      }
    }
  }

  function getWeeklyHistory() {
    return JSON.parse(localStorage.getItem('chatmate_weeklyHistory') || '[]')
  }

  return { weeklyStats, addWeeklyXP, getWeeklyHistory }
}
```

**UI Components**:
1. `WeeklyProgressCard.vue` - Shows current week stats
2. `WeeklyHistoryChart.vue` - Visualize past weeks with chart
3. Lock icons on chapters with tooltip showing unlock requirements

---

## 3. Creativity Features

### Concept
Let users create custom scenarios and stories.

### Implementation

**Custom Scenario Creator** - Add `useCustomScenarios.js`:
```javascript
const STORAGE_KEY = 'chatmate_customScenarios'

export function useCustomScenarios() {
  const customScenarios = ref([])

  function createScenario(scenario) {
    const newScenario = {
      id: `custom-${Date.now()}`,
      title: scenario.title,
      description: scenario.description,
      setting: scenario.setting,      // e.g., "coffee shop", "train station"
      role: scenario.role,            // User's role in the scenario
      partnerRole: scenario.partnerRole,  // AI's role
      vocabularyHints: scenario.vocabularyHints,
      createdAt: new Date().toISOString()
    }
    customScenarios.value.push(newScenario)
    save()
    return newScenario
  }

  return { customScenarios, createScenario, deleteScenario, editScenario }
}
```

**Scenario Templates** - Provide starter templates:
```javascript
export const scenarioTemplates = [
  {
    id: 'restaurant-order',
    name: { en: 'Restaurant Ordering', ja: 'レストラン注文', zh: '餐廳點餐' },
    setting: 'restaurant',
    role: 'customer',
    partnerRole: 'waiter',
    suggestedVocabulary: ['menu', 'order', 'bill', 'recommend']
  },
  {
    id: 'lost-directions',
    name: { en: 'Asking Directions', ja: '道を尋ねる', zh: '問路' },
    setting: 'street',
    role: 'tourist',
    partnerRole: 'local',
    suggestedVocabulary: ['where', 'turn', 'straight', 'near']
  }
]
```

**UI Components**:
1. `ScenarioCreator.vue` - Form to create custom scenarios
2. `ScenarioTemplateSelector.vue` - Quick-start templates
3. `MyScenarios.vue` - List and manage custom scenarios

**Integration with Chat**:
- Pass custom scenario context to AI prompt in `server.js`:
```javascript
function buildCustomScenarioPrompt(scenario) {
  return `
    SCENARIO: ${scenario.setting}
    Your role: ${scenario.partnerRole}
    User's role: ${scenario.role}
    Help the user practice this scenario naturally.
    Suggested vocabulary to encourage: ${scenario.vocabularyHints.join(', ')}
  `
}
```

---

## 4. Community Features

### Concept
Social learning with progress sharing and practice partners.

### Implementation

**Note**: Full community features require a backend database. Below is a hybrid approach using localStorage for personal data + optional cloud sync.

**Phase 1: Local Achievements & Sharing** (No backend needed)

`useShareableProgress.js`:
```javascript
export function useShareableProgress() {
  function generateShareCard() {
    const progress = useUserProgress()
    return {
      rank: progress.currentRank,
      totalXP: progress.totalXP,
      streak: progress.currentStreak,
      achievements: progress.unlockedAchievements,
      timestamp: new Date().toISOString()
    }
  }

  function exportAsImage() {
    // Use html2canvas to capture a styled progress card
    // Return shareable image for social media
  }

  function generateShareLink() {
    const data = generateShareCard()
    const encoded = btoa(JSON.stringify(data))
    return `${window.location.origin}/share/${encoded}`
  }

  return { generateShareCard, exportAsImage, generateShareLink }
}
```

**Share Card Component** - `ShareProgressCard.vue`:
```vue
<template>
  <div class="share-card bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-xl">
    <div class="text-white">
      <h2>{{ rankName }} - {{ totalXP }} XP</h2>
      <p>🔥 {{ streak }} day streak</p>
      <div class="achievements-grid">
        <span v-for="a in achievements" :key="a">{{ achievementIcon(a) }}</span>
      </div>
      <p class="text-sm opacity-75">Chat Mate Language Learning</p>
    </div>
  </div>
</template>
```

**Phase 2: Cloud Sync & Leaderboards** (Requires backend)

Backend additions (`server.js`):
```javascript
// POST /api/progress/sync
app.post('/api/progress/sync', async (req, res) => {
  const { userId, progress } = req.body
  await db.collection('progress').upsert({
    odId: odId,
    ...progress,
    updatedAt: new Date()
  })
  res.json({ success: true })
})

// GET /api/leaderboard/weekly
app.get('/api/leaderboard/weekly', async (req, res) => {
  const weekStart = getWeekStart()
  const leaders = await db.collection('progress')
    .find({ weekStart })
    .sort({ weeklyXP: -1 })
    .limit(100)
  res.json(leaders)
})
```

**Phase 3: Practice Partner Matching** (Advanced)

```javascript
// POST /api/matching/find-partner
app.post('/api/matching/find-partner', async (req, res) => {
  const { userId, level, language, availability } = req.body

  // Find users with similar level looking for partners
  const matches = await db.collection('matchingPool')
    .find({
      level: { $in: [level, adjacentLevels(level)] },
      language,
      status: 'searching'
    })
    .limit(5)

  res.json(matches)
})
```

---

## 5. Feedback System

### Concept
Real-time feedback on pronunciation, vocabulary usage, and grammar.

### Implementation

**Grammar & Vocabulary Analysis** - Enhance AI response in `server.js`:
```javascript
function buildFeedbackPrompt(userMessage, level) {
  return `
    Analyze this message for a ${level} learner:
    "${userMessage}"

    Provide JSON response:
    {
      "reply": "Your conversational response",
      "feedback": {
        "grammar": {
          "score": 0-100,
          "issues": ["issue1", "issue2"],
          "corrections": ["corrected sentence"]
        },
        "vocabulary": {
          "score": 0-100,
          "levelAppropriate": true/false,
          "suggestions": ["word1 -> better word"]
        },
        "naturalness": {
          "score": 0-100,
          "tips": ["tip1", "tip2"]
        }
      },
      "hints": ["vocabulary hints"]
    }
  `
}
```

**Pronunciation Feedback** - Add `usePronunciationCheck.js`:
```javascript
export function usePronunciationCheck() {
  const recognition = new webkitSpeechRecognition()

  function checkPronunciation(targetText, language) {
    return new Promise((resolve) => {
      recognition.lang = language
      recognition.start()

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript
        const confidence = event.results[0][0].confidence

        resolve({
          spoken,
          target: targetText,
          confidence,
          match: similarity(spoken, targetText),
          feedback: generatePronunciationFeedback(spoken, targetText)
        })
      }
    })
  }

  function similarity(a, b) {
    // Levenshtein distance or similar algorithm
    // Return 0-100 score
  }

  return { checkPronunciation }
}
```

**Learning Analytics Dashboard** - `useAnalytics.js`:
```javascript
export function useAnalytics() {
  const analytics = ref({
    dailyActivity: [],      // Last 30 days
    vocabularyMastery: {},  // Word -> { seen, correct, lastSeen }
    grammarPatterns: {},    // Pattern -> { correct, incorrect }
    weakAreas: [],          // Auto-detected weak points
    recommendations: []     // Personalized suggestions
  })

  function trackVocabulary(wordId, correct) {
    const word = analytics.value.vocabularyMastery[wordId] || { seen: 0, correct: 0 }
    word.seen++
    if (correct) word.correct++
    word.lastSeen = new Date().toISOString()
    word.mastery = (word.correct / word.seen) * 100
    analytics.value.vocabularyMastery[wordId] = word

    updateRecommendations()
  }

  function updateRecommendations() {
    const weak = Object.entries(analytics.value.vocabularyMastery)
      .filter(([_, data]) => data.mastery < 70 && data.seen >= 3)
      .map(([wordId]) => wordId)

    analytics.value.weakAreas = weak
    analytics.value.recommendations = generateRecommendations(weak)
  }

  return { analytics, trackVocabulary, trackGrammar }
}
```

**UI Components**:
1. `FeedbackPanel.vue` - Show real-time feedback after each message
2. `PronunciationPractice.vue` - Record and compare pronunciation
3. `AnalyticsDashboard.vue` - Visual charts of progress
4. `WeakAreasCard.vue` - Show areas needing practice
5. `RecommendationsPanel.vue` - Suggested next steps

---

## Implementation Priority

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| 1 | Weekly Ranking | Medium | High |
| 2 | Goal Setting (Destinations) | Medium | High |
| 3 | Feedback in Chat | Medium | High |
| 4 | Unlock System | Low | Medium |
| 5 | Share Progress Card | Low | Medium |
| 6 | Custom Scenarios | Medium | Medium |
| 7 | Analytics Dashboard | High | High |
| 8 | Pronunciation Check | High | Medium |
| 9 | Community Backend | Very High | High |

---

## File Structure After Implementation

```
src/
├── composables/
│   ├── useUserProgress.js       # Existing - add unlock logic
│   ├── useWeeklyRanking.js      # NEW
│   ├── useCustomScenarios.js    # NEW
│   ├── useShareableProgress.js  # NEW
│   ├── usePronunciationCheck.js # NEW
│   └── useAnalytics.js          # NEW
├── components/
│   ├── goals/
│   │   ├── DestinationSelector.vue
│   │   └── ScenarioSelector.vue
│   ├── progress/
│   │   ├── WeeklyProgressCard.vue
│   │   ├── WeeklyHistoryChart.vue
│   │   └── UnlockRequirements.vue
│   ├── creativity/
│   │   ├── ScenarioCreator.vue
│   │   └── MyScenarios.vue
│   ├── social/
│   │   ├── ShareProgressCard.vue
│   │   └── LeaderboardView.vue
│   └── feedback/
│       ├── FeedbackPanel.vue
│       ├── PronunciationPractice.vue
│       ├── AnalyticsDashboard.vue
│       └── RecommendationsPanel.vue
└── data/
    ├── destinations.js
    └── scenarioTemplates.js
```
