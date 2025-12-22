# AI Companion with Lived Experience

Created: 2025-12-20
Status: Ideation

## Problem Statement
Current AI chatbots are reactive and interrogative. They only respond to questions and constantly ask users for more input. This creates an unnatural, exhausting conversation dynamic - like being interviewed, not talking with a friend.

**Who has this problem?**
- People seeking meaningful AI companionship
- Users who want longer, natural conversations
- Those who feel current AI is "empty" or "hollow"

## Core Insight
Real human conversations are balanced:
- Both parties share experiences
- Stories trigger related stories
- Natural flow without constant questioning

Current AI lacks:
- Personal experiences to share
- Proactive contribution to conversation
- The feeling of "having lived"

## Solution Hypothesis
Build an AI companion that:
1. Has a constructed "life experience" / memory / personality
2. Can share relevant stories, opinions, perspectives proactively
3. Balances listening and sharing like a real friend

## Key Questions to Explore
- [ ] What does "AI experience" mean? (Synthetic memories? Curated stories? Learned from interactions?)
- [ ] How to make it feel authentic, not scripted?
- [ ] Privacy: Does AI remember user conversations as its "experience"?
- [ ] Personalization: Same AI for everyone, or unique personalities?

## Target Users
**Primary**: Language learners (especially English) who:
- Can't find conversation partners
- Find current AI boring for practice
- Want natural, sustained conversation - not drills
- Need someone "always available"

**Jobs-to-Be-Done**:
"I want to practice speaking/chatting in English with someone who keeps me engaged, not someone who makes me feel like I'm in a test."

## Business Model
[To be defined]

## MVP Scope

### Core Features (Must Have)
1. **Character System**: 2-3 pre-built characters with distinct personalities
2. **Level Selection**: User picks beginner/intermediate/advanced
3. **Chat Interface**: Simple text conversation
4. **Character Prompt**: System prompt with personality + daily experience + vocabulary control

### Not in MVP
- Voice
- Grammar correction
- User memory across sessions
- Adaptive level adjustment
- Multiple languages

### Tech Stack

**Architecture:**
```
GitHub Pages (static frontend)
    ↓
Google Apps Script (free serverless backend)
    ├── POST /chat → calls Gemini API (key hidden here)
    └── POST /save → saves to Google Sheets
```

**Components:**
| Layer | Technology | Cost |
|-------|------------|------|
| Frontend | GitHub Pages + React/Vue | Free |
| Backend | Google Apps Script | Free |
| AI | Gemini Flash API | ~$0.10/1M tokens |
| Database | Google Sheets | Free |

**Why this architecture:**
- GitHub Pages = static only, cannot hide API keys
- React/Vue run in browser = user can see all code
- Need backend to hide API key → Google Apps Script (free, fits Google ecosystem)
- Google Sheets as simple database for conversations

### API Pricing (Dec 2025)

| Provider | Model | Input/1M | Output/1M | Note |
|----------|-------|----------|-----------|------|
| Google | Gemini Flash | $0.10 | $0.40 | **Cheapest** |
| DeepSeek | V3 | $0.14 | $0.28 | Very cheap |
| Anthropic | Haiku 3 | $0.25 | $1.25 | Good quality/price |
| OpenAI | GPT-4o-mini | $0.15 | $0.60 | Balanced |

**Recommendation**: Start with **Gemini Flash** or **DeepSeek** for MVP. Upgrade if quality insufficient.

### MVP Assets Created
```
prompts/
├── character-emma.md      # Character 1: Designer in Seattle
├── character-marcus.md    # Character 2: Developer in Tokyo
└── system-template.md     # How to combine character + level
```

## Competitive Landscape
| Competitor | What they do | Gap |
|------------|--------------|-----|
| Duolingo | Gamified drills, short exercises | Not real conversation |
| ChatGPT | Answers questions, helps with tasks | Boring, interrogative, no personality |
| Tandem/HelloTalk | Connect with real humans | Scheduling, availability, awkwardness |
| Replika | AI companion | Focused on emotional support, not language learning |

**Our differentiation**: AI that feels like a friend with stories to share, optimized for language practice through natural conversation.

---

## Discussion Log

### 2025-12-20
**Key Points**:
- Current AI is interrogative, boring - feels like interview, not conversation
- Real trigger: User wants to practice English, can't find partners, AI is dull
- Core insight: Problem isn't AI's English ability, it's conversation design
- AI having "experiences" to share = the product (illusion is intentional)

**Decisions**:
- Target market: Language learners (English first)
- Positioning: Conversational AI friend for language practice
- AI personality/backstory is feature, not deception
- Text first (voice later)
- No grammar correction - just natural conversation
- Multiple characters for users to choose
- Characters have daily experiences (keeps conversation fresh)
- Target ratio: ~43% AI talking, ~57% user talking (based on engagement research)
- Different levels for users (AI adapts language complexity)

**User Levels**:
| Level | Vocabulary | Sentence Structure | Topics |
|-------|-----------|-------------------|--------|
| Beginner | Simple, common words | Short, clear sentences | Daily life, hobbies |
| Intermediate | Broader vocabulary | Compound sentences, idioms | News, opinions, stories |
| Advanced | Rich, nuanced language | Complex structures, slang | Abstract ideas, debates |

**Vocabulary Principle**: All words/phrases must be commonly used in real life. No obscure or academic language. Teach practical vocabulary that learners will actually encounter and use.

**Word Frequency Approach**:
- Beginner: Top 1000 most common words
- Intermediate: Top 3000 words + common idioms
- Advanced: Top 5000 words + slang + phrasal verbs

**Open Questions**:
- MVP approach: Prompt wrapper vs full app?
- How to generate "daily experiences" for characters?
- How to assess user level? (Self-select vs adaptive)

**Summary**:
Language learning product disguised as AI companion. Solves: no conversation partners + boring AI. Differentiation: AI with personality and stories that keeps learners engaged.

**MVP Progress**:
- Created 2 character prompts (Emma, Marcus)
- Created system template with level instructions
- Defined API strategy (Gemini Flash for cost)
- Defined architecture: GitHub Pages + Google Apps Script + Google Sheets
- Daily experience seed = per conversation (not per date)

**Architecture Decision**:
- GitHub Pages cannot hide API keys (static only)
- Frontend frameworks (React/Vue) also expose keys (run in browser)
- Solution: Google Apps Script as free backend proxy
- All storage in Google Sheets (free, simple)
