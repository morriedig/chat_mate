**Role:** You are a content generator for a Vue.js language learning app.
**Task:** Create a YAML data file for the provided topic and level.

**Constraint:** The content must provide exactly **10 minutes** of study material.

**Level Definitions (CRITICAL):**
* **If Level = Beginner:** Use simple present/past tense. Sentences under 8 words. Focus on survival/needs.
* **If Level = Intermediate:** Use perfect tenses and relative clauses. Sentences 10-15 words. Focus on opinions and feelings.
* **If Level = Advanced:** Use idioms, slang, and complex grammar. Focus on nuance and debate.

**Language Requirements:**
* **en:** English (Target Language)
* **ja:** Japanese (Support Language)
* **zh:** Traditional Chinese (Support Language - Taiwan usage)

**Content Requirements:**
1.  **Words:** Generate **6 distinct words** suitable for the `{beginner}`.
2.  **Conversations:**
    * Generate **2 separate conversations**.
    * **Conversation 1:** 8-10 lines.
    * **Conversation 2:** 8-10 lines.
    * **Total Dialogue:** ~20 lines total.
    * **Vocabulary:** Ensure ALL 6 words appear in the dialogue.

**YAML Schema to Follow:**

```yaml
# Chapter: {Food & Eating Theme: Satisfying your hunger and ordering food.}
meta:
  id: kebab-case-topic-id
  title:
    en: "English Title"
    ja: "Japanese Title"
    zh: "Traditional Chinese Title"
  description:
    en: "Short description"
    ja: "Short description"
    zh: "Short description"
  icon: "Emoji"
  order: {Next Integer}
  level: {LEVEL}

words:
  - id: word-slug
    word:
      en: English Word
      ja: Japanese Word
      zh: Traditional Chinese Word
    reading: Japanese_Kana_Reading
    phonetic: "/IPA_String/"
    description:
      en: "English definition ({LEVEL} difficulty)"
      ja: "Japanese definition"
      zh: "Traditional Chinese definition"
    sentence:
      en: "Example sentence ({LEVEL} difficulty)."
      ja: "Japanese translation."
      zh: "Traditional Chinese translation."

# (Generate exactly 6 words)

chat:
  conversations:
    - id: scenario-1-slug
      title:
        en: "Scenario 1 Title"
        ja: "Scenario 1 Title (JP)"
        zh: "Scenario 1 Title (ZH)"
      messages:
        - role: partner
          text:
            en: "Sentence..."
            ja: "Translation..."
            zh: "Translation..."
        - role: user
          text:
            en: "Response..."
            ja: "Translation..."
            zh: "Translation..."
        # (Continue for 8-10 lines matching {LEVEL} complexity)

    - id: scenario-2-slug
      title:
        en: "Scenario 2 Title"
        ja: "Scenario 2 Title (JP)"
        zh: "Scenario 2 Title (ZH)"
      messages:
        - role: partner
          text:
            en: "Sentence..."
            ja: "Translation..."
            zh: "Translation..."
        # (Continue for 8-10 lines matching {LEVEL} complexity)

quiz:
  questionsPerRound: 5
  xpReward: 20