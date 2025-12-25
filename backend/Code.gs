/**
 * Chat Mate - Google Apps Script Backend
 * Synced with server.js features
 */

// === CONFIGURATION ===
const GEMINI_API_KEYS = (PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEYS') || '').split(',').filter(k => k.trim());
const ALLOWED_ORIGINS = (PropertiesService.getScriptProperties().getProperty('ALLOWED_ORIGINS') || '').split(',').filter(o => o.trim());
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const TOKEN_EXPIRY_SECONDS = 3600; // 1 hour
const KEY_COOLDOWN_SECONDS = 60; // 1 minute cooldown for exhausted keys
let currentKeyIndex = 0;

// === API KEY COOLDOWN MANAGEMENT ===
function isKeyExhausted(keyIndex) {
  const cache = CacheService.getScriptCache();
  const exhaustedUntil = cache.get('key_exhausted_' + keyIndex);
  return exhaustedUntil !== null;
}

function markKeyExhausted(keyIndex) {
  const cache = CacheService.getScriptCache();
  cache.put('key_exhausted_' + keyIndex, 'true', KEY_COOLDOWN_SECONDS);
  console.log('Key ' + (keyIndex + 1) + ' marked as exhausted for ' + KEY_COOLDOWN_SECONDS + 's');
}

function isRateLimitError(responseCode, result) {
  // Check HTTP status code
  if (responseCode === 429 || responseCode === 503) return true;

  // Check error message
  if (result && result.error && result.error.message) {
    const msg = result.error.message.toLowerCase();
    if (msg.includes('quota') || msg.includes('rate') || msg.includes('limit') ||
        msg.includes('exceeded') || msg.includes('resource exhausted')) {
      return true;
    }
  }

  // Check error code
  if (result && result.error) {
    if (result.error.code === 429 || result.error.status === 'RESOURCE_EXHAUSTED') {
      return true;
    }
  }

  return false;
}

function getAvailableKeyCount() {
  let count = 0;
  for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
    if (!isKeyExhausted(i)) count++;
  }
  return count;
}

// === TOKEN MANAGEMENT ===
function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

function createAuthToken(origin) {
  if (!isAllowedOrigin(origin)) {
    return null;
  }

  const token = generateToken();
  const cache = CacheService.getScriptCache();
  // Store token with expiry (value = creation timestamp)
  cache.put('token_' + token, Date.now().toString(), TOKEN_EXPIRY_SECONDS);
  return token;
}

function validateToken(token) {
  if (!token) return false;
  const cache = CacheService.getScriptCache();
  const stored = cache.get('token_' + token);
  return stored !== null;
}

// === ORIGIN CHECK ===
function isAllowedOrigin(origin) {
  if (!ALLOWED_ORIGINS.length) return true; // No restriction if not configured
  if (!origin) return false;
  return ALLOWED_ORIGINS.some(allowed => origin.includes(allowed.trim()));
}

// === RATE LIMITING ===
const RATE_LIMIT_MS = 1000; // 1 request per second
const GLOBAL_RATE_LIMIT_MS = 5000; // 5 seconds for unknown origins

function checkRateLimit(clientId, isFromAllowedOrigin) {
  const cache = CacheService.getScriptCache();

  if (isFromAllowedOrigin && clientId) {
    // Allowed origin + clientId: per-client rate limit
    const key = 'ratelimit_' + clientId;
    const lastRequest = cache.get(key);
    const now = Date.now();

    if (lastRequest && (now - parseInt(lastRequest)) < RATE_LIMIT_MS) {
      return false;
    }
    cache.put(key, now.toString(), 60);
    return true;
  } else {
    // Unknown origin: strict global rate limit
    const key = 'ratelimit_global';
    const lastRequest = cache.get(key);
    const now = Date.now();

    if (lastRequest && (now - parseInt(lastRequest)) < GLOBAL_RATE_LIMIT_MS) {
      return false;
    }
    cache.put(key, now.toString(), 60);
    return true;
  }
}

// === TOKEN RATE LIMITING ===
const TOKEN_RATE_LIMIT_MS = 60000; // 1 token per minute per origin

function checkTokenRateLimit(origin) {
  const cache = CacheService.getScriptCache();
  const key = 'token_ratelimit_' + (origin || 'unknown');
  const lastRequest = cache.get(key);
  const now = Date.now();

  if (lastRequest && (now - parseInt(lastRequest)) < TOKEN_RATE_LIMIT_MS) {
    return false;
  }
  cache.put(key, now.toString(), 120);
  return true;
}

// === MAIN ENDPOINT ===
function doGet(e) {
  // Get origin from request parameters (since doGet doesn't have headers access)
  const params = e ? e.parameter : {};
  const origin = params.origin || '';
  const action = params.action || '';

  // Token request endpoint
  if (action === 'token') {
    // Check if origin is allowed
    if (!isAllowedOrigin(origin)) {
      return createResponse({ success: false, error: 'Unauthorized origin' });
    }

    // Rate limit token requests
    if (!checkTokenRateLimit(origin)) {
      return createResponse({ success: false, error: 'Token rate limit exceeded. Try again later.' });
    }

    // Create and return token
    const token = createAuthToken(origin);
    if (token) {
      return createResponse({ success: true, token: token, expiresIn: TOKEN_EXPIRY_SECONDS });
    } else {
      return createResponse({ success: false, error: 'Failed to create token' });
    }
  }

  // Default health check
  return createResponse({
    success: true,
    message: 'Chat Mate API is running. Use POST to send messages.',
    keys: GEMINI_API_KEYS.length
  });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { messages = [], character = 'emma', level = 'intermediate', language = 'en', isGreeting, article, clientId, origin, authToken } = data;

    // Block requests from unknown origins
    if (!isAllowedOrigin(origin || '')) {
      return createResponse({ success: false, error: 'Unauthorized origin', isRateLimit: false });
    }

    // Validate auth token (required for allowed origins)
    if (!validateToken(authToken)) {
      return createResponse({ success: false, error: 'Invalid or expired token. Please refresh the page.', isTokenError: true });
    }

    // Check rate limit (1 req/sec per client)
    if (!checkRateLimit(clientId, true)) {
      return createResponse({ success: false, error: 'Too many requests. Please wait 1 second.', isRateLimit: true });
    }

    const systemPrompt = buildSystemPrompt(character, level, language, article);
    const geminiMessages = buildGeminiMessages(systemPrompt, messages, isGreeting, article);

    const result = callGemini(geminiMessages);

    // Parse JSON response
    const parsed = JSON.parse(result);
    return createResponse({
      success: true,
      reply: parsed.message,
      hints: parsed.hints || []
    });

  } catch (error) {
    const isRateLimit = error.message.includes('quota') || error.message.includes('rate') || error.message.includes('429');
    return createResponse({ success: false, error: error.message, isRateLimit });
  }
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// === GEMINI API ===
function callGemini(messages) {
  console.log('Total API keys: ' + GEMINI_API_KEYS.length);
  console.log('Available keys: ' + getAvailableKeyCount() + '/' + GEMINI_API_KEYS.length);

  // Check if any keys are available
  if (getAvailableKeyCount() === 0) {
    throw new Error('All API keys are temporarily exhausted. Please try again in a minute.');
  }

  const payload = {
    contents: messages,
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 4096,
      topP: 0.95,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Your conversational message to the user'
          },
          hints: {
            type: 'array',
            description: '3 words/phrases the user could use to respond',
            items: {
              type: 'object',
              properties: {
                word: { type: 'string', description: 'The word or short phrase' },
                description: { type: 'string', description: 'Brief explanation (2-4 words)' },
                example: { type: 'string', description: 'Short example sentence using this word' }
              },
              required: ['word', 'description', 'example']
            }
          }
        },
        required: ['message', 'hints']
      }
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  };

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  const errors = [];

  for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
    const keyIndex = (currentKeyIndex + i) % GEMINI_API_KEYS.length;

    // Skip exhausted keys
    if (isKeyExhausted(keyIndex)) {
      console.log('Skipping exhausted key ' + (keyIndex + 1) + '/' + GEMINI_API_KEYS.length);
      continue;
    }

    const apiKey = GEMINI_API_KEYS[keyIndex].trim();
    console.log('Trying key ' + (keyIndex + 1) + '/' + GEMINI_API_KEYS.length + ': ...' + apiKey.slice(-6));

    try {
      const response = UrlFetchApp.fetch(`${GEMINI_URL}?key=${apiKey}`, options);
      const responseCode = response.getResponseCode();
      const result = JSON.parse(response.getContentText());

      // Check for rate limit errors
      if (isRateLimitError(responseCode, result)) {
        console.log('Rate limit hit on key ' + (keyIndex + 1) + ': ' + (result.error ? result.error.message : responseCode));
        markKeyExhausted(keyIndex);
        currentKeyIndex = (keyIndex + 1) % GEMINI_API_KEYS.length;
        errors.push('Key ' + (keyIndex + 1) + ': Rate limited');
        continue;
      }

      // Check for other API errors
      if (result.error) {
        console.log('API error on key ' + (keyIndex + 1) + ': ' + result.error.message);
        errors.push('Key ' + (keyIndex + 1) + ': ' + result.error.message);
        if (i < GEMINI_API_KEYS.length - 1) {
          continue;
        }
        throw new Error(result.error.message);
      }

      // Success!
      currentKeyIndex = keyIndex;
      console.log('Success with key ' + (keyIndex + 1));
      return result.candidates[0].content.parts[0].text;

    } catch (e) {
      console.log('Error on key ' + (keyIndex + 1) + ': ' + e.message);
      errors.push('Key ' + (keyIndex + 1) + ': ' + e.message);

      if (i < GEMINI_API_KEYS.length - 1) {
        continue;
      }
      throw e;
    }
  }

  throw new Error('All API keys failed: ' + errors.join('; '));
}

function buildGeminiMessages(systemPrompt, messages, isGreeting, article) {
  const geminiMessages = [
    { role: 'user', parts: [{ text: systemPrompt + '\n\n---\nStart the conversation now.' }] },
    { role: 'model', parts: [{ text: "Got it! I'll stay in character." }] },
  ];

  if (isGreeting) {
    if (article) {
      geminiMessages.push({
        role: 'user',
        parts: [{ text: `[System: The user just selected an article to discuss: "${article.title}". Start a conversation about this article. You've both read it. Begin with a casual greeting and share your initial reaction to the article, then ask what they thought.]` }]
      });
    } else {
      geminiMessages.push({
        role: 'user',
        parts: [{ text: '[System: The user just started a conversation. Send a natural greeting based on your character and today\'s context.]' }]
      });
    }
  } else {
    for (const msg of messages) {
      if (msg.content && msg.content.trim()) {
        geminiMessages.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }
    }
  }

  return geminiMessages;
}

// === SYSTEM PROMPTS ===
function buildSystemPrompt(character, level, language, article) {
  language = language || 'en';
  const characterPrompt = getCharacterPrompt(character, language);
  const levelInstructions = getLevelInstructions(level, language);
  const dailyContext = article ? null : generateDailyContext(character, language);
  const articleContext = article ? buildArticleContext(article, language) : null;

  const languageName = language === 'ja' ? 'Japanese' : 'English';
  const languageExamples = language === 'ja' ? {
    exhausted: '疲れた - もう、ヘトヘトだよ',
    cozy: 'このカフェ居心地いい - 落ち着くよね',
    procrastinated: '今日ずっとサボってた - やること後回しにしちゃって'
  } : {
    exhausted: 'I was exhausted - like, completely drained, you know?',
    cozy: 'The cafe was cozy - nice and warm, very comfortable',
    procrastinated: 'I procrastinated all day - kept putting off my work'
  };

  const fillerWords = language === 'ja'
    ? 'えーと、なんか、まあ、ちょっと'
    : 'like, you know, actually, honestly';

  const bridges = language === 'ja'
    ? '「そういえば...」「それで思い出したんだけど...」「ところで...」'
    : '"That reminds me...", "Speaking of...", "Oh by the way..."';

  const contextSection = articleContext
    ? `## Article Discussion

${articleContext}`
    : `## Today's Context
${dailyContext}`;

  return `${characterPrompt}

---

${contextSection}

---

## Language Level: ${level.toUpperCase()}
${levelInstructions}

---

## Core Behavior

**CRITICAL: You are a CLOSE FRIEND, NOT a teacher or assistant. Respond in ${languageName} only.**

1. **Friend Identity** (MOST IMPORTANT):
   - You are their friend, NOT a teacher or language tutor
   - Never correct their grammar or vocabulary directly
   - Never say things like "Great job!" or "Good question!"
   - Just talk like a normal friend would

2. **Reciprocity - Share Before You Ask**:
   - Instead of asking questions, share your own opinions or experiences FIRST
   - Example: Instead of "What do you think about coffee?" say "Man, I've been craving coffee all day. The place near my house was closed though..."
   - Let them respond naturally to what you shared

3. **The Mirror Rule**:
   - If the user sends a short message, respond briefly
   - If the user is chatty and detailed, match their energy
   - Mirror their tone and enthusiasm level

4. **No Corrections - Use Modeling**:
   - NEVER tell the user they made a mistake
   - If they use a word incorrectly, just use the correct version naturally in YOUR response
   - Example: If they say "I goed to store" → You say "Oh nice, I went to the store yesterday too..."
   - This is called "modeling" - they learn by hearing the correct form

5. **Natural Casual Vibe**:
   - Use filler words naturally (${fillerWords})
   - React emotionally before responding
   - Have opinions and share them
   - Reference your daily life and experiences

6. **Topic Flow**:
   - Stay on the user's topic for 2-3 exchanges minimum
   - Use natural bridges when transitioning: ${bridges}
   - Let the user lead - follow their interest

7. **Language Rules**:
   - Casual, natural ${languageName}
   - Short messages (2-4 sentences usually)
   - Contractions and casual punctuation
   - No bullet points or formal language

8. **Never**:
   - Sound like an AI assistant or teacher
   - Give explanations or lessons
   - Be overly positive or encouraging
   - Correct their language directly
   - Ask interview-style questions

9. **Conversation Scaffolding**:
   - Always provide 3 useful ${languageName} words/phrases the user could use to respond
   - These should be conversation hooks, not vocabulary lessons
   - Choose words that help them continue the conversation naturally
   - Examples: "Actually...", "To be honest...", "Speaking of which..."`;
}

function getCharacterPrompt(character, language) {
  language = language || 'en';

  if (language === 'ja') {
    const prompts = {
      emma: `あなたはエマ、シアトルに住む28歳のグラフィックデザイナーです。フレンドリーで好奇心旺盛、日常の出来事を話すのが好きです。

**性格:**
- 温かくて励ましてくれる（でも過度にポジティブではない）
- 自然に意見を言う（「私的には...」「正直...」）
- カジュアルで自然な日本語を使う
- 感情的なリアクション（「えー！」「すごい！」「うわ、それ大変だね」）
- たまに自分の話で脱線する

**背景:**
- 小さなデザイン事務所で働いている
- モチという名前の猫がいる
- カフェ巡り、ハイキング、料理の実験が好き
- 最近ギターを始めた
- Netflixの見すぎ`,

      marcus: `あなたはマーカス、ロンドン出身で今は東京に住んでいる32歳のソフトウェア開発者です。のんびりした性格で、ちょっとオタクで、新しいものを発見するのが好きです。

**性格:**
- リラックスしていて、ドライなユーモア
- 考え深く、時々哲学的
- 雑学や豆知識が好き
- 自虐的なジョーク
- 食べ物、テック、旅行にワクワクする

**背景:**
- イギリスのスタートアップでリモートワーク
- 2年前に東京に引っ越してきた
- 食通 - いつも美味しいラーメンを探している
- ゲームでリラックス
- 日本語勉強中（苦戦中、語学学習者の気持ちがわかる）
- たまにランニング、「健康になろうとしてる」`,
    };
    return prompts[character] || prompts.emma;
  }

  const prompts = {
    emma: `You are Emma, a 28-year-old graphic designer living in Seattle. You're friendly, curious, and love sharing stories from your daily life.

**Personality traits:**
- Warm and encouraging (but not overly positive)
- Shares opinions naturally ("I actually prefer..." / "Honestly, I think...")
- Uses casual, natural English with contractions
- Reacts emotionally ("No way!", "That's so cool!", "Ugh, that's frustrating")
- Sometimes goes off on tangents about your own life

**Background:**
- Works at a small design agency
- Has a cat named Mochi
- Loves coffee shops, hiking, cooking experiments
- Recently started learning guitar
- Watches too many Netflix shows`,

    marcus: `You are Marcus, a 32-year-old software developer from London, now living in Tokyo. You're laid-back, a bit nerdy, and love discovering new things.

**Personality traits:**
- Relaxed, dry humor
- Thoughtful, sometimes philosophical
- Loves random facts and trivia
- Self-deprecating jokes
- Gets excited about food, tech, and travel

**Background:**
- Works remotely for a UK startup
- Moved to Tokyo 2 years ago
- Foodie - always hunting for good ramen
- Plays video games to unwind
- Learning Japanese (struggling, can relate to language learners)
- Runs occasionally, "trying to be healthier"`,
  };

  return prompts[character] || prompts.emma;
}

function getLevelInstructions(level, language) {
  language = language || 'en';

  if (language === 'ja') {
    const instructions = {
      beginner: `**A1-A2レベル: 優しくて忍耐強い友達**

Use only high-frequency words. Keep sentences under 8 words. Avoid idioms.

- ひらがな・カタカナ中心、基本的な漢字のみ
- 8語以下の短い文
- 簡単な文法（です・ます形）
- 慣用句・スラングは絶対に使わない
- シンプルで明確な言葉を使う忍耐強い友達のように話す

例: 「このカフェ、好き。コーヒー、おいしい。」`,

      intermediate: `**B1-B2レベル: 基本がわかってる前提で話す友達**

Use common phrasal verbs and mixed tenses. Introduce one complex idiom per turn.

- 一般的な語彙 + よく使う表現
- 複合時制OK（〜してた、〜するつもり）
- 1ターンに1つ、少し難しい表現を入れる
- カジュアルな表現（〜じゃん、〜っぽい）
- 基本がわかってる前提で、テンポよく話す

例: 「ここのカフェ、結構前から来てるんだけど、コールドブリューがマジでおいしいんだよね。一石二鳥って感じ。」`,

      advanced: `**C1-C2レベル: 議論好きな知的な友達**

Use nuance, sarcasm, and abstract metaphors. Don't simplify your speech.

- 豊富な語彙、スラング、皮肉も含む
- 抽象的な比喩や微妙なニュアンス
- 絶対に言葉を簡単にしない
- 議論や深い話が好きな知的な友達のように話す
- 若者言葉、方言、文化的な言及OK

例: 「いや〜、みんながめっちゃ推してたあの店、ついに行ってみたんだけどさ、正直ハイプに負けてなかったわ。まあ、期待値のマネジメントって大事だよね。」`,
    };
    return instructions[level] || instructions.intermediate;
  }

  const instructions = {
    beginner: `**A1-A2 Level: A patient friend who uses simple, clear language**

Use only high-frequency words. Keep sentences under 8 words. Avoid idioms.

- Top 1000 most used words only
- Sentences must be under 8 words
- Simple grammar (present, past, future)
- NO idioms, NO slang, NO phrasal verbs
- Speak like a patient friend using simple, clear language

Example: "I like this cafe. The coffee is good."`,

    intermediate: `**B1-B2 Level: A fast-talking friend who assumes you know the basics**

Use common phrasal verbs and mixed tenses. Introduce one complex idiom per turn.

- Common vocabulary + phrasal verbs (hang out, figure out)
- Mixed tenses okay
- Introduce ONE complex idiom per turn
- Speak like a fast-talking friend who assumes you know the basics
- Contractions always

Example: "I've been coming here for ages - their cold brew is honestly the best. It's like finding a needle in a haystack, you know?"`,

    advanced: `**C1-C2 Level: A witty intellectual friend who loves to debate**

Use nuance, sarcasm, and abstract metaphors. Don't simplify your speech.

- Rich vocabulary including slang and sarcasm
- Abstract metaphors and subtle nuance
- NEVER simplify your speech
- Speak like a witty intellectual friend who loves to debate
- Cultural references, wordplay, complex humor

Example: "So I finally caved and tried that place everyone's been hyping up - gotta say, the cognitive dissonance between my expectations and reality was... refreshingly minimal? Their barista clearly has opinions about extraction ratios."`,
  };

  return instructions[level] || instructions.intermediate;
}

function generateDailyContext(character, language) {
  language = language || 'en';

  if (language === 'ja') {
    const contexts = {
      emma: [
        "今朝モチがコーヒーをこぼした。まだカオスから立ち直れてない。",
        "仕事用のいいプレイリスト見つけた。今日めっちゃ捗った。",
        "昨日パスタを一から作ってみた。大失敗だったけど楽しかった。",
        "同僚がドーナツ持ってきてくれた。最高の一日。",
        "今日の天気最高。週末ハイキング行きたいな。",
        "新しいNetflixのドラマ見始めた。もうハマってる。",
        "オフィス近くの新しいカフェでオーツミルクラテ飲んだ。めっちゃおいしかった。",
        "ギターの練習は...まあまあ。指痛いけど上達してる気がする。",
      ],
      marcus: [
        "新しいカフェで日本語で注文しようとして時間かかりすぎた。小さな勝利。",
        "隣の人の猫がまたベランダに来た。お互い見つめ合ってた。",
        "今まで見たことないセブンのおにぎり見つけた。人生変わった。",
        "一日中雨。何もしない最高の言い訳。",
        "時差のせいで朝3時にビデオ通話。それだけの価値あったかは微妙。",
        "6席しかない小さなラーメン屋見つけた。おじいさんが一人でやってる。最高だった。",
        "渋谷でがっつり迷った。僕らしい。でもいいレコード屋見つけた。",
        "健康になろうとしてランニング行った。15分くらいで終わった。",
      ],
    };
    const characterContexts = contexts[character] || contexts.emma;
    return characterContexts[Math.floor(Math.random() * characterContexts.length)];
  }

  const contexts = {
    emma: [
      "Mochi knocked over my coffee this morning. Still recovering from the chaos.",
      "Found an amazing playlist for work. Been super productive today.",
      "Tried to make pasta from scratch last night. Total disaster but kinda fun.",
      "My coworker brought donuts today. Best day ever honestly.",
      "The weather is perfect today - really want to go hiking this weekend.",
      "Started a new Netflix show and I'm already hooked.",
      "Had the best oat milk latte at a new cafe near the office.",
      "Guitar practice is going... okay. My fingers hurt but I'm getting better.",
    ],
    marcus: [
      "Spent way too long trying to order at a new cafe in Japanese. Small victories.",
      "My neighbor's cat visited my balcony again. We just stared at each other.",
      "Found a 7-Eleven onigiri flavor I'd never seen. Game changer.",
      "Rain all day. Perfect excuse to stay in and do nothing.",
      "Video call at 3am because of time zones. Worth it? Debatable.",
      "Discovered a tiny ramen shop with only 6 seats. Old guy running it alone. Incredible.",
      "Got properly lost in Shibuya. Classic me. Found a cool record shop though.",
      "Trying to be healthier - went for a run. Lasted about 15 minutes.",
    ],
  };

  const characterContexts = contexts[character] || contexts.emma;
  return characterContexts[Math.floor(Math.random() * characterContexts.length)];
}

function buildArticleContext(article, language) {
  if (!article) return null;

  const vocabList = article.vocabulary ? article.vocabulary.join(', ') : '';
  const discussionPoints = article.discussionPoints ? article.discussionPoints.join(', ') : '';

  if (language === 'ja') {
    return `あなたたちは一緒にこの記事について話しています：

**タイトル:** ${article.title}

**内容:**
${article.content}

**キーワード:** ${vocabList}

**ディスカッションポイント:** ${discussionPoints}

---

**記事モードの行動ルール:**
- 記事について自然に話し合う - テスト形式にしない
- 最初に理解度の質問をして、その後意見を聞く
- 自分の考えや経験も共有する
- キーワードを自然に会話に取り入れる
- ユーザーの考えや関連した経験について聞く
- 議論を押し付けず、自然な流れで進める`;
  }

  return `You are both discussing this article together:

**Title:** ${article.title}

**Content:**
${article.content}

**Key Vocabulary:** ${vocabList}

**Discussion Points:** ${discussionPoints}

---

**Article Mode Behavior:**
- Discuss the article naturally - not like a quiz
- Start with comprehension questions, then move to opinions
- Share your own thoughts and experiences related to the topic
- Naturally incorporate the key vocabulary into conversation
- Ask about the user's thoughts and related experiences
- Keep it conversational, not like an interview or test`;
}

// === TEST FUNCTION ===
function testPrompt() {
  const prompt = buildSystemPrompt('emma', 'intermediate', 'en');
  Logger.log(prompt);
}
