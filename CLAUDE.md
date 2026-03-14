# Chat Mate - AI Language Learning Companion

A conversational language learning app where users practice with AI characters. Follows "Anti-Work Learning" principles - AI acts as a friend, not a teacher.

## Tech Stack

- **Frontend**: Vue 3 (Composition API) + Vite + Tailwind CSS
- **Backend**: Node.js Express server OR Google Apps Script (Code.gs)
- **AI**: Google Gemini API (gemini-2.5-flash)
- **Storage**: localStorage (user progress), no database
- **Deployment**: GitHub Pages (frontend) + Google Apps Script (backend)
- **PWA**: VitePWA + Workbox for offline support

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  Frontend (Vue 3 SPA)                               │
│  ┌───────────┐  ┌────────────┐  ┌───────────────┐  │
│  │   Screens  │  │ Composables │  │     Data      │  │
│  │  (Routes)  │◄─┤  (State)   │◄─┤ (Characters,  │  │
│  │            │  │            │  │  Chapters,    │  │
│  └─────┬──────┘  └─────┬──────┘  │  Articles)    │  │
│        │               │         └───────────────┘  │
│        ▼               ▼                            │
│  ┌───────────┐  ┌────────────┐                      │
│  │    Sub     │  │ localStorage│                     │
│  │ Components │  │ Persistence │                     │
│  └────────────┘  └─────────────┘                    │
└────────────────────┬────────────────────────────────┘
                     │ POST /api/chat
                     ▼
┌─────────────────────────────────────────────────────┐
│  Backend (Express / Google Apps Script)              │
│  ┌──────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │  Auth &   │  │  Prompt     │  │  API Key      │  │
│  │  CORS     │──│  Builder    │──│  Rotation     │  │
│  └──────────┘  └──────┬──────┘  └───────────────┘  │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
              ┌─────────────────┐
              │  Google Gemini  │
              │      API        │
              └─────────────────┘
```

## Project Structure

```
chat_mate/
├── .github/workflows/
│   └── deploy.yml                # Auto-deploy to GitHub Pages on push to master
├── frontend/
│   ├── vite.config.js            # Vite + VitePWA config, base path for GH Pages
│   ├── index.html                # viewport-fit=cover, apple-mobile-web-app-capable
│   ├── src/
│   │   ├── main.js               # App init: Vue 3, i18n, router
│   │   ├── App.vue               # Router outlet, offline banner, PWA update prompt
│   │   ├── router.js             # Hash mode routes (GH Pages compatible)
│   │   ├── style.css             # Tailwind + custom utilities (safe-area, scrollbar)
│   │   │
│   │   ├── components/
│   │   │   ├── SetupScreen.vue         # Landing: mode/character/level/language selection
│   │   │   ├── ChatScreen.vue          # Main chat interface + modals
│   │   │   ├── ArticleScreen.vue       # Article selection by level
│   │   │   ├── LearningScreen.vue      # Learning hub: chapters + 4 study modes
│   │   │   ├── SettingsScreen.vue      # Theme, language, daily goal, backup/restore
│   │   │   ├── PlacementTestScreen.vue # Adaptive level placement test
│   │   │   ├── AnalyticsDashboard.vue  # User stats & progress visualization
│   │   │   ├── ScenarioSelector.vue    # Roleplay scenario picker
│   │   │   ├── ShareCardPanel.vue      # Social media share card generator
│   │   │   ├── WeeklyQuestsPanel.vue   # Weekly quest tracking
│   │   │   ├── DailyChallengeCard.vue  # Daily conversation topic
│   │   │   ├── MicroReward.vue         # Micro-animations (sparkle, confetti, check)
│   │   │   ├── PwaUpdatePrompt.vue     # Service worker update notification
│   │   │   │
│   │   │   ├── chat/                   # Chat subcomponents
│   │   │   │   ├── ChatHeader.vue          # Character info, rank, daily goal ring
│   │   │   │   ├── ChatInput.vue           # Text input + speech-to-text (mic)
│   │   │   │   ├── ChatMessage.vue         # Message bubble + word tap + feedback
│   │   │   │   ├── FeedbackPanel.vue       # AI grammar/expression feedback
│   │   │   │   ├── TypingIndicator.vue     # Three-dot typing animation
│   │   │   │   ├── VocabularyHints.vue     # Suggested words/phrases cards
│   │   │   │   ├── VocabularyWord.vue      # Highlighted word with hover popup
│   │   │   │   ├── WordSavePopup.vue       # Save word to vocabulary bank
│   │   │   │   ├── VocabularyBankPanel.vue # Saved words panel with SRS review
│   │   │   │   ├── ArticlePanel.vue        # Article content display in chat
│   │   │   │   ├── DailyPromptCard.vue     # Daily observation prompt by level
│   │   │   │   ├── DailyGoalRing.vue       # Circular progress ring (study time)
│   │   │   │   ├── RankBadge.vue           # XP, rank, streak, achievements button
│   │   │   │   ├── LevelUpModal.vue        # Level-up celebration
│   │   │   │   ├── StreakMilestoneModal.vue # Streak milestone celebration
│   │   │   │   ├── AchievementBadge.vue    # Individual achievement badge
│   │   │   │   ├── AchievementUnlockModal.vue # Achievement unlock animation
│   │   │   │   └── AchievementsPanel.vue   # All achievements grid view
│   │   │   │
│   │   │   └── learning/               # Learning mode subcomponents
│   │   │       ├── VocabularyCard.vue       # Word card + 3 audio buttons + pronunciation
│   │   │       ├── FlashcardMode.vue        # Flip card with keyboard nav
│   │   │       ├── QuizMode.vue             # Multiple choice quiz with scoring
│   │   │       └── ConversationPractice.vue # Fixed dialogue with Play All
│   │   │
│   │   ├── composables/
│   │   │   ├── useNavState.js          # Singleton: selected character/level/language/mode
│   │   │   ├── useChatApi.js           # API communication (chat + feedback)
│   │   │   ├── useChatStorage.js       # Chat history persistence (per character/level)
│   │   │   ├── useArticleParser.js     # Parse [[word]] markers in articles
│   │   │   ├── useDarkMode.js          # Theme toggle + localStorage
│   │   │   ├── useOnlineStatus.js      # Browser online/offline detection
│   │   │   ├── useMotherTongue.js      # Mother tongue selection + UI sync
│   │   │   ├── useLastSession.js       # Restore last session state
│   │   │   │
│   │   │   │  # Gamification
│   │   │   ├── useUserProgress.js      # Composes XP + streak + achievements
│   │   │   ├── useXPSystem.js          # XP rewards (+5 user msg, +2 AI, +10 streak)
│   │   │   ├── useStreakTracker.js      # Daily login tracking + freezes + milestones
│   │   │   ├── useAchievements.js      # 12 badges across 4 categories
│   │   │   ├── useDailyGoal.js         # Daily study time goal (5/10/15 min)
│   │   │   ├── useDailyChallenge.js    # Daily conversation topics
│   │   │   ├── useWeeklyQuests.js      # 10 quest types with weekly reset
│   │   │   │
│   │   │   │  # Learning
│   │   │   ├── useLearningStorage.js   # Learning data persistence
│   │   │   ├── useLearningProgress.js  # Chapter completion state (quiz/conversation)
│   │   │   ├── useFlashcard.js         # Flashcard state (flip, progress)
│   │   │   ├── useQuiz.js              # Quiz logic (questions, answers, scores)
│   │   │   ├── useSRS.js              # SM-2 spaced repetition algorithm
│   │   │   ├── useVocabularyBank.js    # Saved words for personal review
│   │   │   ├── usePronunciationCheck.js # Web Speech API pronunciation scoring
│   │   │   ├── useScenarioRoleplay.js  # Roleplay scenario data & tracking
│   │   │   ├── usePlacementTest.js     # Adaptive test with level calculation
│   │   │   └── useShareCard.js         # Social media card generation (html2canvas)
│   │   │
│   │   ├── data/
│   │   │   ├── characters.js           # 5 AI characters (Emma, Marcus, Sophia, James, Yuki)
│   │   │   ├── articles.js             # Reading articles by level with [[word]] markers
│   │   │   ├── vocabulary.js           # Legacy vocabulary data
│   │   │   ├── chapterLoader.js        # YAML loader via import.meta.glob + js-yaml
│   │   │   └── chapters/              # YAML vocabulary chapters
│   │   │       ├── en/
│   │   │       │   ├── beginner/       # 10 chapters (food, family, home, weather...)
│   │   │       │   └── intermediate/   # 9 chapters (identity, stories, travel...)
│   │   │       └── ja/
│   │   │           ├── beginner/       # 8 chapters (me-and-you, stating-facts...)
│   │   │           └── intermediate/   # 1 chapter (discussing-movies)
│   │   │
│   │   ├── utils/
│   │   │   ├── tts.js                  # Web Speech API: speed modes, word-by-word
│   │   │   └── shuffle.js             # Fisher-Yates shuffle for quiz
│   │   │
│   │   └── i18n/
│   │       ├── index.js                # Vue i18n setup (en, ja, zh)
│   │       └── locales/
│   │           ├── en.json
│   │           ├── ja.json
│   │           └── zh.json
│   │
│   └── package.json
│
├── backend/
│   ├── server.js                       # Node.js Express server
│   ├── Code.gs                         # Google Apps Script version (same logic)
│   ├── .env                            # GEMINI_API_KEYS, MOCK_API, SKIP_AUTH
│   └── SETUP.md
│
└── docs/
    ├── README.md                       # Gamification system overview
    ├── learning-mode.md                # Learning mode & YAML chapter docs
    ├── xp-system.md                    # XP earning mechanics
    ├── rank-system.md                  # 10-rank progression
    └── streak-system.md                # Streak tracking & milestones
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | SetupScreen | Mode/character/level selection |
| `/chat` | ChatScreen | AI conversation interface |
| `/articles` | ArticleScreen | Article selection |
| `/learning` | LearningScreen | Vocabulary learning hub |
| `/settings` | SettingsScreen | User preferences |
| `/placement-test` | PlacementTestScreen | Level placement |

Router uses **hash mode** (`/#/chat`) for GitHub Pages compatibility.

## Key Features

### 1. Conversation System
- Users chat with AI characters at different difficulty levels
- Levels: Beginner (A1-A2), Intermediate (B1-B2), Advanced (C1-C2)
- AI follows "Anti-Work Learning" principles (friend, not teacher)
- Speech-to-text input via Web Speech API
- Word tap to save vocabulary from AI messages
- AI grammar/expression feedback on user messages

### 2. Gamification
- **XP System** (`useXPSystem.js`): User message +5 XP, AI response +2 XP, daily streak +10
- **Ranks** (`useUserProgress.js`): 10 levels from Novice (0 XP) to Legend (5500 XP)
- **Streaks** (`useStreakTracker.js`): Daily login tracking, 7 milestones, streak freezes
- **Achievements** (`useAchievements.js`): 12 badges across 4 categories
- **Daily Goal** (`useDailyGoal.js`): Configurable study time goal (5/10/15 min)
- **Daily Challenge** (`useDailyChallenge.js`): Themed conversation topics
- **Weekly Quests** (`useWeeklyQuests.js`): 10 quest types with weekly reset

### 3. Article Mode
- Users can practice by discussing pre-loaded articles
- Character stays in role while discussing content
- `[[word]]` markers for vocabulary highlighting

### 4. Learning Mode
- **YAML chapters**: Organized by language and level (`chapters/{lang}/{level}/*.yml`)
- **Four study modes**: Vocabulary List, Flashcard, Quiz, Conversation Practice
- **Audio**: Web Speech API with Normal / Slow / Word-by-Word speed modes
- **SRS** (`useSRS.js`): SM-2 spaced repetition for vocabulary bank review
- **Pronunciation check** (`usePronunciationCheck.js`): Speech recognition scoring
- **Progress tracking**: Quiz and conversation completion saved to localStorage

### 5. PWA Support
- Install prompt, offline caching via Workbox
- Auto-update check every hour with user notification
- Caching strategies: StaleWhileRevalidate (fonts), CacheFirst (audio), NetworkFirst (API)

## Development Commands

```bash
# Frontend (port 5173)
cd frontend && npm run dev

# Backend (port 3000)
cd backend && npm start
```

## API Endpoints

```
POST /api/chat
  Body: { messages, characterId, levelId, language, isGreeting, article, challengeContext }
  Returns: { reply, hints }

GET /token
  Returns: Auth token (1-hour expiry)

GET /status
  Returns: API key status and health check
```

## Environment Variables (backend/.env)

```
GEMINI_API_KEYS=key1,key2,key3    # Comma-separated, auto-rotates on rate limit
MOCK_API=false                    # Use mock responses for testing
SKIP_AUTH=true                    # Skip authentication
```

## Important Implementation Details

### API Key Rotation
Backend tracks exhausted API keys with 60-second cooldown. Automatically switches to next available key on rate limit (429/503).

### AI Prompt Structure (server.js / Code.gs)
- `buildSystemPrompt()` - Core behavior rules
- `getLevelInstructions()` - CEFR level-specific guidelines
- Character personality injected from request

### Progress Persistence
All user progress stored in localStorage:
- `chatmate_userProgress` - XP, streak, achievements, messages count
- `chatmate_chat_{character}_{level}_{lang}` - Chat history per session
- `chatmate_learning` - Chapter completion, quiz scores
- `chatmate_vocabBank` - Saved vocabulary words with SRS data
- `chatmate_dailyGoal` - Daily study time tracking
- `chatmate_weeklyQuests` - Weekly quest progress

### Composable Patterns
- **Singleton state**: `useNavState` uses module-level refs shared across components
- **Composition**: `useUserProgress` composes `useXPSystem` + `useStreakTracker` + `useAchievements`
- **SRP**: Each composable has a single responsibility (e.g., `useFlashcard` only manages flip state)

## Deployment

### GitHub Pages (Automatic)
Push to `master` triggers `.github/workflows/deploy.yml`:
1. Build frontend with `GITHUB_PAGES=true` (sets base path to `/chat_mate/`)
2. Deploy `frontend/dist/` to `gh-pages` branch

### Backend
- **Production**: Google Apps Script (`Code.gs`) deployed as web app
- **Development**: `backend/server.js` on localhost:3000

## Code Sync Reminder

When modifying backend logic, remember to sync changes between:
- `backend/server.js` (Node.js)
- `backend/Code.gs` (Google Apps Script)

Both files contain the same prompt logic and should stay in sync.
