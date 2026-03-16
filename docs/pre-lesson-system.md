# Pre-Lesson System — Design & Implementation Document

> Synthesized from 3 parallel analysis agents (Pedagogy, Architecture, UX) on 2026-03-16

---

## 1. Problem Statement

A complete beginner learning Japanese cannot start Chapter 1 ("Me and You") because they don't know hiragana. The chapter presents `私`, `あなた`, `名前` with romaji readings, but never teaches how to read the characters. Similar gaps exist for Chinese (pinyin/tones) and potentially English (for non-Latin-script users).

**Goal**: Build a "Pre-Lesson" system that teaches foundational decoding skills before Chapter 1, using a YAML-based plugin architecture consistent with the existing chapter system.

---

## 2. Design Principles

- **Anti-Work Learning**: Frame as "Crack the code" not "Study a table." Short sessions (10-15 min), no timed drills by default, no failure states
- **Word unlocking as motivation**: Each character learned "unlocks" real words the learner can read
- **Audio-first**: Hear the sound, then see the character (not text-first)
- **Mnemonics are first-class**: Displayed prominently, not hidden in tooltips. Can be character-voiced ("Yuki says: This looks like a ninja star!")
- **Soft gate, not hard lock**: Pre-lessons recommended before Chapter 1, but always skippable
- **Existing users unaffected**: Migration check — if user already has Chapter 1+ progress, pre-lessons are optional

---

## 3. Content Design by Language

### 3.1 Japanese (Priority 1)

**The script wall**: 46 basic hiragana + 25 dakuten + 33 combo kana = 104 total. But only ~15 characters are needed to read Chapter 1.

**Teaching order: Frequency-weighted, not row-based**

Traditional textbooks teach あ→か→さ row by row. Instead, teach characters that let the learner read **real words immediately**:

| Session | Characters (count) | Words Unlocked | Time |
|---------|-------------------|----------------|------|
| 1: "Your First Words" | わ た し あ な は い え で す か も の が (15) | わたし, あなた, はい, いいえ, です, か | ~15 min |
| 2: "People & Things" | と も だ ち ま え れ せ ん き (12) | ともだち, なまえ, だれ, せんせい, すき | ~15 min |
| 3: "Actions" | べ る む み よ く (10) | たべる, のむ, みる, よむ, いく | ~15 min |
| 4-6: Remaining hiragana | Fill gaps + dakuten (が, ざ, だ, ば, ぱ) | Complete 46 basic hiragana | ~15 min each |

**Minimum viable for Chapter 1**: Sessions 1-2 (27 characters). Remaining characters have romaji fallback.

**Katakana**: Deferred to after Chapter 2-3 (when katakana loanwords appear). 3 sessions.

**Pronunciation rules**: 1 session (long vowels, double consonants っ, pitch accent awareness).

**Total: 9 pre-lessons for Japanese** (~2-3 weeks casual / 5 days intensive)

### 3.2 Chinese (Priority 2)

**The tone barrier**: Four tones change word meaning. Pinyin is the bridge to reading.

| Session | Content | Time |
|---------|---------|------|
| 1: "Hearing the Music" | Four tones introduction. Tone discrimination (1st vs 4th, then 2nd vs 3rd) | ~15 min |
| 2: "Speaking the Music" | Tone production practice. Tone pairs. Tone sandhi (3rd+3rd → 2nd+3rd) | ~15 min |
| 3: "Pinyin Sounds" | Initials group 1 (b,p,m,f,d,t,n,l) with all tones | ~15 min |
| 4: "Tricky Sounds" | Initials group 2 (zh/ch/sh vs z/c/s vs j/q/x) | ~15 min |
| 5: "Pinyin Finals" | Simple + compound finals (ai, ei, ao, ou, an, en, etc.) | ~15 min |
| 6: "Tone Rules" | Sandhi rules, yi/bu rules, tone pair drills | ~15 min |
| 7: "Basic Strokes" | 8 basic strokes, 10-15 common radicals (optional) | ~15 min |

**Approach**: Pinyin first, characters as companions. All chapter content shows pinyin above characters. No character recognition required before Chapter 1.

**Total: 7 pre-lessons for Chinese** (~2 weeks casual / 4 days intensive)

### 3.3 English (Priority 3)

**Most learners don't need it** (CJK speakers know Latin alphabet from school). Make it optional with diagnostic gate.

| Session | Content | Time |
|---------|---------|------|
| 1: "Tricky Sounds" | th, r/l, v/b minimal pairs. Sounds that don't exist in Japanese/Chinese | ~15 min |
| 2: "Stress & Rhythm" | Word stress, sentence stress, linked speech | ~15 min |

**Skip mechanism**: Show 5 written English words with audio → match. Score 4/5+ → skip entirely.

**Total: 2 pre-lessons for English** (optional, skippable)

---

## 4. Learning Activities

### 4.1 Activity Flow per Session

```
1. Explore (CharacterGrid / List) — passive browsing, tap-to-hear     2-3 min
2. Recognize (Flashcard) — front=character, back=reading+mnemonic      3-5 min
3. Match (MatchingGame) — audio/reading → tap correct character         2-3 min
4. Test (Quiz) — scored assessment with new question types              3-5 min
                                                              Total: ~10-15 min
```

### 4.2 Reusable vs New Components

| Existing Component | Reusable? | Notes |
|---|---|---|
| `VocabularyCard.vue` | Yes | Character cards follow same layout (audio + content) |
| `FlashcardMode.vue` | Yes | Characters mapped to word shape via adapter |
| `QuizMode.vue` | Extend | Add new question types: `char_to_reading`, `reading_to_char`, `audio_to_char` |
| `ConversationPractice.vue` | No | Not applicable at pre-lesson level |
| `playTTS` (tts.js) | Yes | All audio |
| `useLearningProgress` | Yes | Quiz completion tracking (arbitrary chapter IDs) |
| `useSRS` | Yes | Character review scheduling |
| `useFlashcard` | Yes | Data-agnostic flip/index/shuffle state |

| New Component | Purpose |
|---|---|
| `CharacterCard.vue` | Single character: char, reading, romaji, mnemonic, audio, example word |
| `CharacterGrid.vue` | 5×10 hiragana table with tap-to-hear. Cells "light up" as learned |
| `CharacterMatchGame.vue` | Audio plays → tap correct character from 5 options |
| `TonePractice.vue` | Chinese: play tone → select tone number (Phase 2) |

### 4.3 New Quiz Question Types

```
char_to_reading:  Show あ → pick [a, ka, sa, ta]
reading_to_char:  Show "ka" → pick [か, き, く, け]
audio_to_char:    Play sound → pick character from grid
tone_id:          Play syllable → pick tone number [1, 2, 3, 4]
```

Adapter function to reuse existing `QuizMode.vue`:

```js
function charactersAsWords(characters) {
  return characters.map(c => ({
    id: c.id,
    word: c.char,
    meaning: c.reading,
    reading: c.romaji,
    example: c.exampleWord?.word || '',
    nativeWord: c.exampleWord?.nativeWord || '',
    nativeMeaning: c.reading,
    nativeExample: c.exampleWord?.nativeWord || '',
  }))
}
```

---

## 5. YAML Schema

### 5.1 File Location

```
src/data/chapters/{lang}/foundation/*.yml
```

Uses existing glob pattern `./chapters/**/*.yml`. Automatically picked up by `chapterLoader.js`.

### 5.2 Schema Definition

```yaml
meta:
  id: hiragana-01-vowels-k           # unique identifier
  title:
    en: "Hiragana: Vowels & K-row"
    ja: "ひらがな：母音とか行"
    zh: "平假名：母音與ka行"
  description:
    en: "Learn the 5 vowels and the ka-row"
    ja: "5つの母音とか行を学びましょう"
    zh: "學習5個母音和ka行"
  icon: "あ"
  order: 0.1                          # < 1 ensures sorting before Chapter 1
  level: foundation                   # distinguishes from beginner/intermediate/advanced
  type: pre-lesson                    # discriminator for loader logic
  group:                              # UI grouping label
    en: "Hiragana"
    ja: "ひらがな"
  estimatedMinutes: 15
  prerequisite: null                  # or ID of previous pre-lesson

characters:
  - id: a
    char: "あ"
    reading: "a"
    romaji: "a"
    audio_hint: "ah, as in 'father'"
    mnemonic:
      en: "A person crossing a street, saying 'Ahh!'"
      zh: "一個人過馬路，說「啊！」"
    stroke_count: 3
    row: "vowel"                      # grouping within character set
    examples:
      - word: "あめ"
        reading: "ame"
        meaning: { en: "rain", zh: "雨" }
      - word: "あさ"
        reading: "asa"
        meaning: { en: "morning", zh: "早上" }

  - id: ka
    char: "か"
    reading: "ka"
    romaji: "ka"
    audio_hint: "ka, as in 'car'"
    mnemonic:
      en: "A knife cutting — 'KA-chop!'"
      zh: "刀子切東西——「咔嚓！」"
    stroke_count: 3
    row: "k"
    examples:
      - word: "かさ"
        reading: "kasa"
        meaning: { en: "umbrella", zh: "傘" }

# Optional: words array for vocabulary tied to the characters
words: []

# Grid layout hints
grid:
  columns: 5
  groupBy: "row"

# Matching drill config
matching:
  pairs: 5
  modes:
    - "char_to_reading"
    - "audio_to_char"

# Quiz config
quiz:
  questionsPerRound: 10
  xpReward: 15
  questionTypes:
    - "char_to_reading"
    - "reading_to_char"
    - "audio_to_char"
```

### 5.3 Chinese Tone Pre-Lesson Schema

```yaml
meta:
  id: pinyin-tones
  title:
    en: "The Four Tones"
    ja: "四声"
    zh: "四聲"
  icon: "声"
  order: 0.1
  level: foundation
  type: pre-lesson

characters:
  - id: tone1
    char: "ā"
    reading: "First tone (high flat)"
    romaji: "ā"
    tone: 1
    tone_description:
      en: "High and level, like singing a sustained note"
    audio_hint: "High flat pitch, like 'maaaah'"
    example_word:
      word: { zh: "妈", en: "mother" }
      pinyin: "mā"

  - id: tone2
    char: "á"
    reading: "Second tone (rising)"
    romaji: "á"
    tone: 2
    tone_description:
      en: "Rising pitch, like asking 'huh?'"
    audio_hint: "Rising pitch, like a surprised 'what?'"
    example_word:
      word: { zh: "麻", en: "hemp" }
      pinyin: "má"

  # ... tone3, tone4, neutral
```

---

## 6. Technical Architecture

### 6.1 Loader Changes (`chapterLoader.js`)

Add these exports:

```js
// Get pre-lessons for a language
export function getPreLessons(targetLanguage = 'ja', uiLanguage = 'en') {
  return getChapterList(targetLanguage, uiLanguage)
    .filter(ch => ch.level === 'foundation')
}

// Get characters from a pre-lesson chapter
export function getChapterCharacters(chapterId, targetLanguage, motherTongue = 'en') {
  const chapter = getChapter(chapterId, targetLanguage)
  if (!chapter?.characters) return []
  return chapter.characters.map(c => ({
    id: `${chapter.meta.id}_${c.id}`,
    char: c.char,
    reading: c.reading,
    romaji: c.romaji,
    strokeCount: c.stroke_count,
    mnemonic: c.mnemonic?.[motherTongue] || c.mnemonic?.en,
    audioHint: c.audio_hint,
    tone: c.tone,
    toneDescription: c.tone_description?.[motherTongue] || c.tone_description?.en,
    row: c.row,
    examples: (c.examples || []).map(ex => ({
      word: ex.word,
      reading: ex.reading,
      meaning: ex.meaning[motherTongue] || ex.meaning.en,
    })),
  }))
}

// Check if a chapter is a pre-lesson
export function isPreLesson(chapterId, targetLanguage) {
  const chapter = getChapter(chapterId, targetLanguage)
  return chapter?.meta?.type === 'pre-lesson'
}
```

Add `type` to `getChapterList` return object:

```js
type: chapter.meta.type || 'chapter',
```

Sorting is automatic: `order: 0.1` sorts before `order: 1` (Chapter 1).

### 6.2 New Composable: `usePreLessonProgress.js`

```js
const STORAGE_KEY = 'chatmate_preLessonProgress'

// Data shape:
{
  lessons: {
    'hiragana-01-vowels-k': {
      charactersLearned: ['a', 'i', 'u', 'e', 'o', 'ka', 'ki'],
      quizCompleted: false,
      quizBestScore: 0,
      matchingCompleted: false,
    }
  },
  stats: {
    totalCharactersLearned: 7,
    totalPreLessonsCompleted: 0,
  }
}
```

Key methods:
- `markCharacterLearned(lessonId, characterId)` — called when user taps/studies a character
- `isCharacterLearned(lessonId, characterId)` — for grid cell states
- `markQuizCompleted(lessonId, score, total)`
- `markMatchingCompleted(lessonId)`
- `isPreLessonCompleted(lessonId)` — all characters learned + quiz passed
- `arePreLessonsComplete(targetLanguage)` — all pre-lessons for that language done
- `areChaptersLocked(targetLanguage)` — includes migration check for existing users

Migration check:

```js
function areChaptersLocked(targetLanguage) {
  // If user already has progress on any regular chapter, don't lock
  const regularChapters = getRegularChapters(targetLanguage, 'beginner')
  const hasExistingProgress = regularChapters.some(ch => {
    const status = getChapterCompletionStatus(ch.id)
    return status.quiz || status.conversation
  })
  if (hasExistingProgress) return false

  return !arePreLessonsComplete(targetLanguage)
}
```

### 6.3 Component Architecture

```
LearningScreen.vue
├── [Chapter list view]
│   ├── Pre-Lesson Section (foundation cards, above chapters)
│   │   └── PreLessonCard (violet/indigo gradient, character progress bar)
│   ├── Lock Divider ("Complete foundation to unlock")
│   └── Regular Chapters (dimmed if locked)
│
├── [Pre-lesson selected]
│   ├── Mode tabs: [Grid] [Flashcard] [Match] [Quiz]
│   ├── CharacterGrid.vue
│   │   └── CharacterCard.vue[] (69×69px cells on iPhone)
│   ├── FlashcardMode.vue (characters → words adapter)
│   ├── CharacterMatchGame.vue (audio → tap character)
│   └── QuizMode.vue (extended question types)
│
├── [Regular chapter selected]
│   └── (existing behavior, unchanged)
```

### 6.4 No New Route Needed

Pre-lessons integrate into the existing `/learning` route. `LearningScreen.vue` detects pre-lessons via `getPreLessons()` and renders them as a special section. When a pre-lesson is selected, mode tabs switch to character-specific components.

### 6.5 Storage Keys

| Key | Contents | New? |
|---|---|---|
| `chatmate_preLessonProgress` | Character learning + quiz completion per pre-lesson | New |
| `chatmate_learningProgress` | Regular chapter quiz/conversation (unchanged) | Existing |
| `chatmate_userProgress` | XP, streaks, achievements (unchanged) | Existing |
| `chatmate_srsProgress` | SRS scheduling (works with character IDs) | Existing |

---

## 7. UX Design

### 7.1 Entry Point: Auto-Detect Gate

When user enters Learning mode with Japanese + Beginner and has no pre-lesson progress:

```
┌──────────────────────────────────┐
│                                  │
│         あ  ア  漢               │
│    (animated fade-in one by one) │
│                                  │
│    "Before we start..."          │
│    "Japanese uses special        │
│     writing systems. Let's       │
│     learn the basics first!"     │
│                                  │
│  [=== Start Hiragana Basics ===] │
│                                  │
│    "I already know this"         │
│    (text link → placement test)  │
│                                  │
└──────────────────────────────────┘
```

Shows once per language. After dismissal, pre-lessons appear as Chapter 0 cards in the list.

### 7.2 Character Grid (Hiragana Table)

```
┌──────────────────────────────────┐
│ ← Hiragana       12/46 collected│
├──────────────────────────────────┤
│                                  │
│  ┌────┐┌────┐┌────┐┌────┐┌────┐│
│  │ あ ││ い ││ う ││ え ││ お ││
│  │ a  ││ i  ││ u  ││ e  ││ o  ││
│  │ ✓  ││ ✓  ││ ✓  ││ ✓  ││ ✓  ││
│  └────┘└────┘└────┘└────┘└────┘│
│  ┌────┐┌────┐┌────┐┌────┐┌────┐│
│  │ か ││ き ││ く ││ け ││ こ ││
│  │ ka ││ ki ││ ku ││ ke ││ ko ││
│  │ ✓  ││ ✓  ││ 🟡 ││    ││    ││
│  └────┘└────┘└────┘└────┘└────┘│
│  ┌────┐┌────┐┌────┐┌────┐┌────┐│
│  │ さ ││ し ││ す ││ せ ││ そ ││
│  │ 🔒 ││ 🔒 ││ 🔒 ││ 🔒 ││ 🔒 ││
│  └────┘└────┘└────┘└────┘└────┘│
│  ... (remaining rows)           │
│                                  │
│  [=== Continue: か Row (3/5) ===]│
└──────────────────────────────────┘
```

**Cell states**:
- ✓ Mastered: `bg-green-100 border-green-400`
- 🟡 In Progress: `bg-amber-100 border-amber-400`
- 🔒 Locked: `bg-slate-100 text-slate-300` (dimmed, character visible)
- Empty: not yet viewed

**Mobile layout (393px)**: 5 columns × 69px each + 4px gaps = 361px. Fits perfectly.

**Interactions**: Tap any cell → play pronunciation via TTS. Tap mastered cell → green pulse. Tap locked cell → gentle shake.

### 7.3 Character Match Game

```
┌──────────────────────────────────┐
│ ← Match Game         Score: 4/5 │
├──────────────────────────────────┤
│                                  │
│  [═══════════════> 80%]          │
│                                  │
│  ┌────────────────────────────┐  │
│  │       🔊 (playing "ku")   │  │
│  │                            │  │
│  │  "Tap the character        │  │
│  │   you hear"                │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │  か  │  │  き  │  │  く  │  │
│  └──────┘  └──────┘  └──────┘  │
│                                  │
│  ┌──────┐  ┌──────┐             │
│  │  け  │  │  こ  │             │
│  └──────┘  └──────┘             │
│                                  │
│  (correct: green flash + ✓)     │
│  (wrong: red shake + reveal)    │
└──────────────────────────────────┘
```

### 7.4 Row Completion Celebration

```
┌──────────────────────────────────┐
│                                  │
│         🎉 Row Complete!         │
│                                  │
│     か  き  く  け  こ           │
│     (bounce-in one by one)       │
│                                  │
│     "You mastered the K-row!"    │
│     +5 XP                        │
│                                  │
│  [=== Continue to さ Row ===]    │
│                                  │
└──────────────────────────────────┘
```

### 7.5 Skip / Placement Test

- "I already know this" → 10 random characters, pick romaji
- 8+/10: Skip all pre-lessons
- 5-7/10: Skip mastered rows, review weak ones
- 0-4/10: Recommend starting from beginning (but still allow skip)
- **User can ALWAYS skip.** Even at 0/10 there is a "Skip anyway" link.

---

## 8. Gamification Integration

### 8.1 XP Rewards

| Action | XP |
|--------|-----|
| Study a character (first time) | +2 |
| Complete row matching game | +5 |
| Complete row quiz (≥70%) | +5 |
| Complete all characters in a pre-lesson | +15 bonus |
| Complete ALL pre-lessons for a language | +25 bonus |

### 8.2 New Achievements

| ID | Name | Icon | Condition |
|----|------|------|-----------|
| `first_character` | First Steps | あ | Learn first character |
| `hiragana_master` | Hiragana Master | 🏆 | All 46 hiragana mastered |
| `katakana_master` | Katakana Master | 🏆 | All 46 katakana mastered |
| `tone_master` | Tone Master | 🎵 | Pass all Chinese tone drills |
| `script_scholar` | Script Scholar | 📜 | Complete all pre-lessons for any language |

### 8.3 Streak Integration

Pre-lesson activity counts toward daily streak (call `startTimer/stopTimer` from `useDailyGoal`, same as ChatScreen and DiaryScreen).

### 8.4 Weekly Quest Integration

New quest type: `prelesson_characters` — "Learn N new characters this week" (target: 10 or 20).

---

## 9. File Inventory

### New Files

| File | Purpose |
|------|---------|
| `src/data/chapters/ja/foundation/hiragana-01-vowels-k.yml` | Session 1: vowels + k-row |
| `src/data/chapters/ja/foundation/hiragana-02-s-t.yml` | Session 2: s-row + t-row |
| `src/data/chapters/ja/foundation/hiragana-03-n-h.yml` | Session 3: n-row + h-row |
| `src/data/chapters/ja/foundation/hiragana-04-m-y-r-w.yml` | Session 4: remaining rows |
| `src/data/chapters/ja/foundation/hiragana-05-dakuten.yml` | Session 5: dakuten + combos |
| `src/data/chapters/zh/foundation/pinyin-01-tones.yml` | Chinese tones intro |
| `src/data/chapters/zh/foundation/pinyin-02-initials.yml` | Chinese pinyin initials |
| `src/data/chapters/zh/foundation/pinyin-03-finals.yml` | Chinese pinyin finals |
| `src/components/learning/CharacterCard.vue` | Single character tile |
| `src/components/learning/CharacterGrid.vue` | 5×10 hiragana table |
| `src/components/learning/CharacterMatchGame.vue` | Audio→character matching |
| `src/composables/usePreLessonProgress.js` | Progress tracking |

### Modified Files

| File | Change |
|------|--------|
| `src/data/chapterLoader.js` | Add `getPreLessons()`, `getChapterCharacters()`, `isPreLesson()`. Add `type` to return. |
| `src/components/LearningScreen.vue` | Pre-lesson section above chapters. Soft lock on regular chapters. Character-specific mode tabs when pre-lesson selected. |
| `src/composables/useAchievements.js` | Add 5 pre-lesson achievements |
| `src/composables/useWeeklyQuests.js` | Add `prelesson_characters` quest type |
| `src/i18n/locales/en.json` | Foundation-related i18n keys |
| `src/i18n/locales/ja.json` | Foundation-related i18n keys |
| `src/i18n/locales/zh.json` | Foundation-related i18n keys |

### Unchanged Files

- `src/composables/useSRS.js` — works as-is with character IDs
- `src/composables/useLearningStorage.js` — works as-is
- `src/components/learning/FlashcardMode.vue` — reused via adapter
- `src/components/learning/QuizMode.vue` — reused (extend question types)
- `src/router.js` — no new routes needed

---

## 10. Implementation Phases

### Phase 1: MVP (Japanese Hiragana)

1. Create YAML: `hiragana-01-vowels-k.yml` and `hiragana-02-s-t.yml`
2. Extend `chapterLoader.js`: `getPreLessons()`, `getChapterCharacters()`, `isPreLesson()`
3. Create `CharacterCard.vue` (reuse TTS pattern from VocabularyCard)
4. Create `CharacterGrid.vue` (5-col table, tap-to-hear, cell states)
5. Create `usePreLessonProgress.js` (character tracking + gate logic)
6. Update `LearningScreen.vue` (pre-lesson section + soft lock)
7. Add i18n keys

### Phase 2: Engagement

8. Create `CharacterMatchGame.vue`
9. Extend `QuizMode.vue` with new question types
10. Add XP rewards for pre-lesson activities
11. Add pre-lesson achievements
12. Complete hiragana sessions 3-5

### Phase 3: Chinese + Polish

13. Create Chinese pinyin/tone YAML files
14. Create `TonePractice.vue` (tone discrimination exercise)
15. Add katakana pre-lessons
16. Placement test / skip mechanism
17. Writing practice (stroke order, Canvas — requires SVG data)

---

## 11. Performance & Bundle Impact

| Addition | Estimated Size (gzipped) |
|----------|-------------------------|
| Pre-lesson YAML files (all languages) | ~8 KB |
| CharacterGrid + CharacterCard | ~3 KB |
| CharacterMatchGame | ~4 KB |
| usePreLessonProgress composable | ~1 KB |
| TonePractice (Phase 3) | ~2 KB |
| **Total** | **~18 KB (lazy loaded)** |

Zero impact on initial load. All pre-lesson components are rendered inside the lazy-loaded `LearningScreen.vue`.

---

## 12. Open Questions

1. **Teaching order**: Frequency-weighted (pedagogy recommendation) vs traditional row-based (cleaner grid fill). **Decision**: Use frequency-weighted for Session 1-2 (motivation), then row-based for Sessions 3+ (systematic completion).

2. **Matching game interaction**: Drag-and-drop vs tap-to-pair. **Decision**: Tap-to-pair (more reliable on mobile).

3. **Pre-lesson daily goal**: Should count toward daily study time. **Decision**: Yes, call `startTimer/stopTimer` same as other screens.

4. **Completion threshold**: 70% quiz score to mark a pre-lesson as "complete" (not 100%, to avoid frustration).

5. **Character grid "reveal" vs "always visible"**: Locked characters shown dimmed (visible but greyed out) vs hidden (silhouette/question mark). **Decision**: Dimmed — lets learner see the full scope without feeling overwhelmed.
