# Learning Mode

Vocabulary learning system with chapters, flashcards, quizzes, and conversation practice.

**Note:** Learning Mode is the default mode when users open the app.

## Chapter System

Chapters are defined in YAML files at `frontend/src/data/chapters/*.yml`. Adding a new YAML file automatically creates a new chapter.

### YAML Structure

```yaml
meta:
  id: travel-basics
  title:
    en: "Travel Basics"
    ja: "旅行の基本"
  description:
    en: "Essential words for travel"
    ja: "旅行に必要な基本単語"
  icon: "✈️"
  order: 1
  level: beginner

words:
  - id: airport
    word:
      en: airport
      ja: 空港
    reading: くうこう
    phonetic: "/ˈer.pɔːrt/"
    description:
      en: "A place where planes take off and land"
      ja: "飛行機が離着陸する場所"
    sentence:
      en: "I need to go to the airport."
      ja: "空港に行かなければなりません。"

chat:
  conversations:
    - id: at-airport
      title:
        en: "At the Airport"
        ja: "空港で"
      messages:
        - role: partner
          text:
            en: "Excuse me, where is the check-in counter?"
            ja: "すみません、チェックインカウンターはどこですか？"
        - role: user
          text:
            en: "It's over there, near the entrance."
            ja: "あそこです、入口の近くです。"
        - role: partner
          text:
            en: "Thank you! Do you know what time the flight departs?"
            ja: "ありがとう！飛行機は何時に出発しますか？"
        - role: user
          text:
            en: "I think it's at 3 PM. You should check your ticket."
            ja: "3時だと思います。チケットを確認してください。"
    - id: lost-luggage
      title:
        en: "Lost Luggage"
        ja: "荷物をなくした"
      messages:
        - role: partner
          text:
            en: "Oh no, I can't find my luggage!"
            ja: "大変、荷物が見つからない！"
        - role: user
          text:
            en: "Don't worry. Let's go to the information desk."
            ja: "心配しないで。案内所に行きましょう。"

quiz:
  questionsPerRound: 5
  xpReward: 20
```

### Chapter Loader

`frontend/src/data/chapterLoader.js` dynamically loads all YAML files using Vite's `import.meta.glob`.

Key functions:
- `getChaptersByLevel(language, level)` - Get chapters filtered by level
- `getChapterWords(chapterId, language)` - Get words with bilingual data
- `getChapterConversations(chapterId, language)` - Get fixed conversations for practice

## Learning Modes

### 1. List View
Browse vocabulary cards with:
- Word + native translation (bilingual mode)
- Meaning/description
- Example sentence
- Audio playback for word, meaning, and sentence

### 2. Flashcard Mode
Flip cards to memorize:
- Front: Word + pronunciation + audio button
- Back: Meaning + example sentence (each with audio button)
- Shuffle and navigate with arrows
- Audio playback for word, meaning, and sentence
- Bilingual display support

### 3. Quiz Mode
Multiple choice questions:
- 4 options per question
- XP rewards based on accuracy
- Review incorrect answers

### 4. Conversation Practice
Fixed dialogues using learned vocabulary:
- Pre-written conversations in YAML
- Alternating partner/user roles
- Audio playback for each line (click speaker icon)
- "Play All" button to play entire conversation sequentially
- Bilingual display support
- Users can practice reading and listening

## Fixed Conversation Format

Each chapter can include multiple practice conversations:

```yaml
chat:
  conversations:
    - id: unique-id
      title:
        en: "Conversation Title"
        ja: "会話のタイトル"
      messages:
        - role: partner    # The conversation partner speaks
          text:
            en: "Hello, how can I help you?"
            ja: "こんにちは、何かお手伝いしましょうか？"
        - role: user       # The learner's response
          text:
            en: "I'm looking for the station."
            ja: "駅を探しています。"
```

### Roles
- `partner` - The native speaker / conversation partner
- `user` - The learner's part (what they should say)

### Features
- Each message has audio playback
- Bilingual mode shows both languages
- Users can listen, repeat, and practice
- No AI required - fully offline capable

## Audio System

Uses Web Speech API (`frontend/src/utils/tts.js`) for text-to-speech:

```javascript
import { playTTS, stopTTS, isTTSAvailable, splitTextForHighlight } from './utils/tts'

// Play audio with speed mode and word callback
playTTS(text, language, speedMode, onWordChange)

// Stop any playing audio
stopTTS()

// Check if TTS is supported
isTTSAvailable()

// Split text for word-by-word display
splitTextForHighlight(text, language)
```

- `text` - Text to speak
- `language` - 'en', 'ja', etc.
- `speedMode` - 'normal', 'slow', or 'word'
- `onWordChange` - Callback `(wordIndex, word, allWords) => void` for word-by-word highlighting

No external audio files needed - pronunciation is generated on-the-fly.

## User Controls

### Voice Speed (Dropdown)
Three speed modes available via dropdown selector:
- **Normal** (0.9x) - Regular playback speed
- **Slow** (0.3x) - Very slow for careful listening
- **Word by Word** (0.5x) - Plays each word separately with pauses, highlights current word

In Word by Word mode, the currently playing word is highlighted with a colored background.

### Bilingual Mode (Toggle)
- OFF: Target language only
- ON: Shows both languages (default for beginners)

When bilingual mode is enabled:
- Words show: `airport (空港)`
- Meanings show in both languages
- Example sentences show translations

## File Structure

```
frontend/src/
├── components/
│   ├── LearningScreen.vue      # Main learning container
│   └── learning/
│       ├── VocabularyCard.vue  # Word card with 3 audio buttons
│       ├── FlashcardMode.vue   # Flip card with 3 audio buttons
│       ├── QuizMode.vue        # Multiple choice quiz
│       └── ConversationPractice.vue  # Fixed dialogue practice
├── data/
│   ├── chapterLoader.js        # YAML loader & transformer
│   └── chapters/               # YAML chapter files
│       ├── travel-basics.yml
│       ├── food-dining.yml
│       └── daily-life.yml
└── utils/
    └── tts.js                  # Web Speech API wrapper
```

## Progress Tracking

Learning progress is saved to localStorage and tracks:

### Chapter Completion
- **Quiz**: Marked complete when score >= 60%
- **Conversation**: Marked complete when user plays all messages via "Play All"
- Chapters show green checkmarks when both quiz and conversation are completed

### Data Stored
```javascript
{
  words: {
    wordId: { learned: bool, practiceCount: number, lastPracticed: date }
  },
  chapters: {
    chapterId: {
      quizCompleted: bool,
      quizScore: number,
      quizBestScore: number,
      conversationCompleted: bool
    }
  },
  stats: {
    totalWordsLearned: number,
    totalQuizzesPassed: number,
    totalConversationsCompleted: number
  }
}
```

### Composable API (SOLID)

Progress tracking follows SOLID principles:
- **SRP**: `useLearningProgress` handles state, `useLearningStorage` handles persistence
- **DIP**: Progress depends on storage abstraction, not localStorage directly

```javascript
// useLearningProgress.js - State management (SRP)
import { useLearningProgress } from './composables/useLearningProgress'

const {
  // Quiz
  markQuizCompleted,        // (chapterId, score, total) => { percentage, passed }
  isQuizCompleted,          // (chapterId) => bool
  getQuizBestScore,         // (chapterId) => number

  // Conversation
  markConversationCompleted, // (chapterId)
  isConversationCompleted,  // (chapterId) => bool

  // Chapter
  isChapterCompleted,       // (chapterId) => bool
  getChapterCompletionStatus, // (chapterId) => { quiz, conversation, complete, quizBestScore }

  // Stats & Reset
  stats,                    // reactive stats object
  resetProgress             // () => void
} = useLearningProgress()

// useLearningStorage.js - Persistence (DIP)
import { loadProgress, saveProgress, clearProgress } from './composables/useLearningStorage'
```

## Adding New Chapters

1. Create a new `.yml` file in `frontend/src/data/chapters/`
2. Follow the YAML structure above
3. Set `order` for sorting position
4. Set `level` to match difficulty (beginner, intermediate, advanced)
5. The chapter appears automatically on next page load

### Folder Organization (Optional)

Chapters can be organized into subfolders by level:

```
frontend/src/data/chapters/
├── beginner/
│   ├── ordering-coffee.yml
│   ├── morning-routine.yml
│   └── travel-basics.yml
├── intermediate/
│   ├── business-meeting.yml
│   └── food-dining.yml
└── advanced/
    ├── debate-topics.yml
    └── cultural-nuances.yml
```

The loader uses `**/*.yml` glob pattern, so both flat structure and subfolders work. The `level` field in YAML determines filtering, not the folder name.
