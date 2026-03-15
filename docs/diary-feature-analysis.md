# Daily Diary Feature — Complete Analysis Report

> 5 parallel agents analyzed: Competitive Landscape, UX Design, Technical Architecture, Gamification, AI Prompt Engineering

---

## 1. Competitive Analysis

### Market Overview

| App | Free Writing | AI Feedback | Human Feedback | Gamification | Diary Format |
|-----|:-----------:|:-----------:|:--------------:|:------------:|:------------:|
| Duolingo | No | No | No | Strong | No |
| HelloTalk | Yes | No | Yes (peers) | Moderate | No (social feed) |
| LangCorrect | Yes | No | Yes (peers) | Weak | Yes |
| italki | Yes | No | Yes (volunteers) | None | Yes (neglected) |
| Busuu | No | Yes (poor) | Yes | Moderate | No |
| HiNative | Partial | No | Yes | Weak | No (Q&A) |
| Journaly | Yes | No | Yes (peers) | Weak | Yes |
| LangJournal | Yes | Yes | No | Weak | Yes |

### Key Market Gap

**No app combines all three: instant AI feedback + structured daily prompts + strong gamification.**

This is Chat Mate's opportunity — integrate diary writing with existing gamification (XP, streaks, achievements) and AI character personalities for a unique "journaling with a friend" experience.

### Chat Mate's Unique Position

- AI characters respond in-personality (not generic grammar checker)
- Daily prompts adapted by CEFR level (existing `DailyPromptCard` extends naturally)
- Full gamification stack already in place
- "Anti-Work Learning" philosophy = writing feels like texting a friend

---

## 2. UX Design

### Navigation

- **New route**: `/#/diary` (top-level, alongside chat/learning/articles)
- **Entry points**: SetupScreen mode card, DailyPromptCard "Write in diary" button, quick access icon
- **No character/level selection needed** — reuses existing settings

### Two Modes

**Write Mode** (default):
```
┌─────────────────────────────────┐
│ ← Today's Diary    Mar 15 [⏱] │
├─────────────────────────────────┤
│ 💡 TODAY'S PROMPT              │
│ "What can you see from your    │
│  window right now?"            │
│ [Use this]  [Another]     [✕]  │
│                                │
│ ┌────────────────────────────┐ │
│ │ Write about your day...    │ │
│ │                            │ │
│ │                            │ │
│ └────────────────────────────┘ │
│                                │
│ 0/80 words [═══        ] [🎤] │
│ [       Get Feedback ➤       ] │
└────────────────────────────────┘
```

**History Mode** (toggle):
```
┌─────────────────────────────────┐
│ ← Diary History  [📅] [≡]     │
├─────────────────────────────────┤
│ [contribution grid - 8 weeks]  │
│ Diary streak: 5 days           │
│                                │
│ ┌────────────────────────────┐ │
│ │ Mar 15              85字   │ │
│ │ 今日は公園に行きました...   │ │
│ │ [═══|  ] 3 suggestions     │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ Mar 14              62字   │ │
│ │ 朝ごはんにパンケーキを...   │ │
│ │ [════| ] 1 suggestion      │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

### Feedback Display — "Friend's Response" Model

Feedback is presented as **a friend reading your diary and responding**, not a teacher's grade sheet:

1. **Friend's Comment** — AI character reacts to the content in-personality (chat bubble style)
2. **Nice Job** — Green cards highlighting what the user did well (always shown first)
3. **A Few Things to Try** — Corrections as before/after cards with casual explanations
4. **Words to Try** — Vocabulary suggestions related to what they wrote (addable to vocab bank)
5. **Progress Bar** — 5-segment indicator (vague & encouraging, no numeric score shown)

### Mobile-First (iPhone 15, 393px)

- `max-w-2xl mx-auto px-4` content area
- `safe-area-top` on header, `safe-area-bottom` on footer
- `text-base` (16px) textarea to prevent iOS zoom-on-focus
- Prompt card auto-collapses when textarea focused
- Swipe-to-delete on history entries

---

## 3. Technical Architecture

### Data Model

```js
{
  id: 'diary_20260315_143022',
  version: 1,
  createdAt: '2026-03-15T14:30:22Z',
  language: 'ja',
  level: 'beginner',
  body: '今日は公園に行きました...',
  prompt: 'What did you eat today?',
  wordCount: 42,
  feedbackStatus: 'none' | 'pending' | 'fetched' | 'error',
  feedback: null | { corrections, encouragement, vocabularySuggestions, ... },
  xpAwarded: false,
}
```

### localStorage Strategy

Split-key approach (avoids single large blob):

| Key | Contents |
|-----|----------|
| `chatmate_diary_entries` | Lightweight index: [{id, date, wordCount, feedbackStatus}] |
| `chatmate_diary_entry_{id}` | Individual full entry + feedback |
| `chatmate_diary_stats` | Aggregate stats: total entries, streak, vocab used |

**Budget**: ~2.2 KB/entry × 500 entries = ~1.1 MB (within 5MB localStorage limit)

Auto-prune at 450 entries, warn user, prefer removing entries without feedback.

### New Files

**Composables** (SRP pattern):
```
composables/
├── useDiary.js              # Orchestrator
├── useDiaryStorage.js       # localStorage CRUD (split-key)
├── useDiaryFeedback.js      # API call + offline queue
├── useDiaryPrompts.js       # Daily prompt rotation
└── useDiaryStats.js         # Aggregate stats
```

**Components**:
```
components/diary/
├── DiaryScreen.vue          # Top-level route view
├── DiaryEditor.vue          # Textarea + word count + submit
├── DiaryFeedback.vue        # Friend comment + corrections + vocab
├── DiaryCorrection.vue      # Single correction with diff
├── DiaryHistory.vue         # List + calendar views
├── DiaryEntryCard.vue       # Entry preview card
├── DiaryCalendar.vue        # Month grid
├── DiaryPromptBanner.vue    # Today's prompt
└── ContributionGrid.vue     # GitHub-style heatmap
```

### API Endpoint

**New**: `POST /api/diary-feedback` (separate from `/api/chat`)

```
Request:  { diaryText, language, level, characterId, nativeLanguage, streakDays }
Response: { feedback: { reaction, didWell, corrections, betterExpressions, newVocabulary, encouragement, score, entryMeta } }
```

### Offline Support

- Writing always works offline (auto-save to localStorage every 500ms)
- Feedback requests queued when offline, processed on reconnect
- History fully functional offline

### Migration Impact

**100% additive** — no existing files need internal changes. Only:
- `router.js` — add `/diary` route (lazy loaded)
- `SetupScreen.vue` — add "Diary" mode card
- `server.js` / `Code.gs` — add endpoint
- i18n JSON files — add diary keys

Bundle impact: ~13 KB gzipped (lazy loaded, zero initial load impact)

---

## 4. Gamification Design (Octalysis Framework)

### XP Rewards

| Action | XP | Cap |
|--------|-----|-----|
| Submit diary entry (30+ words) | +15 | 1/day |
| Use 1-3 vocab bank words | +3 | — |
| Use 4+ vocab bank words | +8 | — |
| Use word learned in last 7 days | +2/word | max 3 |
| First diary of the day | +5 | — |
| AI feedback received | +2 | — |
| **Daily diary cap** | — | **35 XP** |

### New Achievements (8 badges → total 20)

| Badge | Name | Condition |
|-------|------|-----------|
| 📓 | **Dear Diary** | First diary entry |
| 📖 | **Week in Words** | 7 different days with entries |
| 📚 | **Monthly Memoir** | 30 different days |
| 🧵 | **Word Weaver** | Use 5 vocab bank words in diary |
| 📕 | **Living Dictionary** | Use 25 vocab bank words |
| 🖋️ | **Ink Never Dries** | 7-day diary streak |
| 💭 | **Deep Thoughts** | Single entry with 200+ words |
| 🏛️ | **Centurion Scribe** | 100 total entries |

### Streak Integration

- Diary entry counts toward **main daily streak** (same as chat/learning)
- **Separate writing streak** displayed on diary screen (low-stakes, no freeze)
- Writing streak milestones: 3 days (sparkle), 7 days (confetti + badge), 14/30 days (confetti)

### Weekly Quest Integration

3 new quest types added to rotation:
- **Journal Keeper**: Write entries on N days (3 or 5)
- **Vocab in Action**: Use N vocab bank words in diary (5 or 10)
- **Storyteller**: Write N total words (150 or 300)

### Motivation Loops

| Loop | Timeframe | Mechanic |
|------|-----------|----------|
| The Prompt Pull | Daily | Curiosity → Write → AI response (surprise) → XP → Come back |
| The Quest Nudge | Weekly | Quest card → Write through week → Bonus XP |
| The Collection Build | Long-term | Growing diary → Milestones → Badges → Continue |

**Core insight**: The AI friend's response is the primary motivator, not XP. XP is secondary reinforcement.

### Anti-Patterns Avoided

- No word count pressure (minimum is low, XP doesn't scale with length)
- No grammar scoring (AI never assigns grades)
- No mandatory daily writing (streak breaks silently)
- No public leaderboards (diary stays private)
- No over-notification (max 1/day, in-character)

---

## 5. AI Prompt Engineering

### System Prompt Core Rules

1. **React to CONTENT first** — before any language feedback, respond to what they wrote about
2. **Corrections feel like friend texting** — "Oh btw, a more natural way..." not "This is incorrect"
3. **Praise specific things** — "I like how you used 'nevertheless'" not "good job"
4. **Stay in character** — Emma connects to hiking, Marcus to tech
5. **Cap corrections** — Beginner: max 3, Intermediate: max 5, Advanced: max 4

### Level-Specific Feedback

| Level | Focus | Ignore | Explain In |
|-------|-------|--------|------------|
| Beginner | Basic grammar, tense, word order | Awkward phrasing, advanced grammar | Native language |
| Intermediate | Collocations, naturalness, register | Minor style issues | Target language |
| Advanced | Style, connotation, register consistency | Acceptable stylistic choices | Target language |

### Response JSON Structure

```json
{
  "reaction": "Friend-like comment about the content (2-4 sentences + follow-up question)",
  "didWell": [{ "text": "...", "comment": "..." }],
  "corrections": [{ "original": "...", "corrected": "...", "explanation": "...", "severity": "minor|moderate|major" }],
  "betterExpressions": [{ "original": "...", "upgraded": "...", "context": "..." }],
  "newVocabulary": [{ "word": "...", "meaning": "...", "example": "...", "relevance": "..." }],
  "encouragement": "Warm closing message",
  "score": { "grammar": 1-5, "vocabulary": 1-5, "naturalness": 1-5, "effort": 1-5 },
  "entryMeta": { "detectedLanguage": "...", "wordCount": N, "isSubstantial": bool, "topicTags": [] }
}
```

### Edge Cases Handled

- **Very short entries**: Still give feedback, gently encourage more
- **Wrong language**: Respond warmly, offer to help translate their thoughts
- **Mixed languages**: Normal for beginners, offer alternatives for native-language words
- **Copy-pasted/AI text**: Gently encourage writing without looking things up
- **Sensitive content**: Empathy first, reduce corrections to 1-2
- **Empty/nonsensical**: Friendly nudge to try again

### Language-Specific Rules

- **English**: Accept American & British, suggest phrasal verbs at intermediate
- **Japanese**: Respect chosen politeness level, show furigana, note 話し言葉 vs 書き言葉
- **Chinese**: Include pinyin with tone marks, note 口语 vs 书面语, focus on measure words & complements

---

## 6. Implementation Recommendation

### Phase 1 (MVP)
- DiaryScreen with write mode + basic feedback display
- `useDiaryStorage` + `useDiaryFeedback` composables
- `POST /api/diary-feedback` endpoint
- XP integration (submit entry = +15 XP)
- Counts toward daily streak

### Phase 2 (Engagement)
- History mode with list view + entry cards
- Diary achievements (8 new badges)
- Writing streak counter
- Daily prompt integration

### Phase 3 (Polish)
- Calendar view + contribution grid
- Vocabulary bank integration (save words from feedback)
- Weekly quest integration
- Offline feedback queue
- "Rewrite" feature for second attempts

---

## 7. Why This Works for Chat Mate

The diary fills a critical gap: **output practice**. Chat is real-time and ephemeral; learning mode is structured input. The diary is **reflective output** — users think, compose, and receive thoughtful feedback at their own pace.

It reinforces the Anti-Work Learning philosophy: you're not doing homework, you're telling your AI friend about your day. The friend happens to notice when you could say something more naturally. That's it.

**Competitive moat**: No existing app combines AI character personalities + instant contextual feedback + level-adaptive prompts + Duolingo-level gamification for diary writing. This is an uncontested position.
