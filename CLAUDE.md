# Chat Mate - AI Language Learning Companion

A conversational language learning app where users practice with AI characters. Follows "Anti-Work Learning" principles - AI acts as a friend, not a teacher.

## Tech Stack

- **Frontend**: Vue 3 (Composition API) + Vite + Tailwind CSS
- **Backend**: Node.js Express server OR Google Apps Script (Code.gs)
- **AI**: Google Gemini API
- **Storage**: localStorage (user progress), no database

## Project Structure

```
chat_mate/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SetupScreen.vue      # Mode/character/level selection (Chat vs Learning)
│   │   │   ├── ChatScreen.vue       # Main chat interface
│   │   │   ├── ArticleScreen.vue    # Article-based learning mode
│   │   │   ├── LearningScreen.vue   # Vocabulary learning mode
│   │   │   ├── chat/                # Chat-related components
│   │   │   │   ├── ChatHeader.vue
│   │   │   │   ├── ChatInput.vue
│   │   │   │   ├── ChatMessage.vue
│   │   │   │   ├── VocabularyHints.vue
│   │   │   │   ├── VocabularyWord.vue    # Highlighted word with hover popup
│   │   │   │   ├── RankBadge.vue         # XP/rank display + achievements button
│   │   │   │   ├── LevelUpModal.vue      # Level-up celebration
│   │   │   │   ├── StreakMilestoneModal.vue
│   │   │   │   ├── AchievementBadge.vue      # Individual achievement badge
│   │   │   │   ├── AchievementUnlockModal.vue # Achievement unlock celebration
│   │   │   │   └── AchievementsPanel.vue     # All achievements grid view
│   │   │   └── learning/            # Learning mode components
│   │   │       ├── VocabularyCard.vue   # Word card with 3 audio buttons
│   │   │       ├── FlashcardMode.vue    # Flip card with 3 audio buttons
│   │   │       ├── QuizMode.vue         # Multiple choice quiz
│   │   │       └── ConversationPractice.vue  # Fixed dialogue with Play All
│   │   ├── composables/
│   │   │   ├── useArticleParser.js  # Parse [[word]] markers (SRP)
│   │   │   ├── useChatApi.js        # API communication
│   │   │   ├── useChatStorage.js    # Chat history persistence
│   │   │   ├── useDarkMode.js       # Theme toggle
│   │   │   ├── useLearningProgress.js # Chapter completion state (SRP)
│   │   │   ├── useLearningStorage.js  # Learning data persistence (DIP)
│   │   │   └── useUserProgress.js   # XP, ranks, streaks (gamification)
│   │   ├── data/
│   │   │   ├── characters.js        # AI character definitions
│   │   │   ├── articles.js          # Reading materials
│   │   │   ├── chapterLoader.js     # YAML chapter loader (supports **/*.yml)
│   │   │   └── chapters/            # YAML vocabulary chapters (flat or by level)
│   │   │       ├── *.yml            # Flat structure OR
│   │   │       ├── beginner/*.yml   # Level-based subfolders
│   │   │       ├── intermediate/*.yml
│   │   │       └── advanced/*.yml
│   │   ├── utils/
│   │   │   └── tts.js               # Web Speech API for audio
│   │   └── i18n/locales/            # en.json, ja.json
│   └── package.json
├── backend/
│   ├── server.js                    # Node.js Express server
│   ├── Code.gs                      # Google Apps Script version (same logic)
│   └── .env                         # GEMINI_API_KEYS, MOCK_API, SKIP_AUTH
└── docs/                            # Feature documentation
    ├── README.md
    ├── learning-mode.md             # Learning mode & chapters
    ├── xp-system.md
    ├── rank-system.md
    └── streak-system.md
```

## Key Features

### 1. Conversation System
- Users chat with AI characters at different difficulty levels
- Levels: Beginner (A1-A2), Intermediate (B1-B2), Advanced (C1-C2)
- AI follows "Anti-Work Learning" principles (friend, not teacher)

### 2. Gamification (useUserProgress.js)
- **XP System**: User message +5 XP, AI response +2 XP
- **Ranks**: 10 levels from Novice (0 XP) to Legend (5500 XP)
- **Streaks**: Daily consecutive login tracking with milestone bonuses
- **Achievements**: 12 badges across 4 categories (First Steps, Consistency, Learning, Mastery)
- See `docs/` folder for detailed documentation

### 3. Article Mode
- Users can practice by discussing pre-loaded articles
- Character stays in role while discussing content

### 4. Learning Mode (Default)
- **YAML-based chapters**: Add `.yml` files to `src/data/chapters/` (flat or in level subfolders)
- **Folder organization**: Supports `chapters/*.yml` or `chapters/{beginner,intermediate,advanced}/*.yml`
- **Four learning modes**: List, Flashcard, Quiz, Conversation Practice
- **Audio**: Web Speech API with 3 buttons (word, meaning, sentence)
- **Play All**: Play entire conversation sequentially
- **Bilingual mode**: Toggle to show both target + native language
- **Voice speed**: Dropdown with 3 modes:
  - Normal (0.9x) - Regular speed
  - Slow (0.3x) - Very slow for careful listening
  - Word by Word (0.5x) - Each word played separately with highlighting
- **Progress tracking**: Quiz and conversation completion saved to localStorage
- See `docs/learning-mode.md` for detailed documentation

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
  Body: { messages, characterId, levelId, language, isGreeting, article }
  Returns: { reply, hints }

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
All user progress stored in localStorage under key `chatmate_userProgress`. Includes: totalXP, currentStreak, longestStreak, messagesSent, claimedMilestones.

## Code Sync Reminder

When modifying backend logic, remember to sync changes between:
- `backend/server.js` (Node.js)
- `backend/Code.gs` (Google Apps Script)

Both files contain the same prompt logic and should stay in sync.
