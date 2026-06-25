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
  return Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
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
  return ALLOWED_ORIGINS.some(function(allowed) {
    var trimmed = allowed.trim();
    if (origin === trimmed) return true;
    // URL origin comparison fallback (matches server.js)
    try {
      var originUrl = new URL(origin);
      var allowedUrl = new URL(trimmed);
      return originUrl.origin === allowedUrl.origin;
    } catch (e) {
      return false;
    }
  });
}

// === RATE LIMITING ===
const RATE_LIMIT_MS = 1000; // 1 request per second

function checkRateLimit(clientId) {
  if (!clientId) return false; // Reject requests without clientId

  const cache = CacheService.getScriptCache();
  const key = 'ratelimit_' + clientId;
  const lastRequest = cache.get(key);
  const now = Date.now();

  if (lastRequest && (now - parseInt(lastRequest)) < RATE_LIMIT_MS) {
    return false;
  }
  cache.put(key, now.toString(), 60);
  return true;
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

// Valid parameter values
var VALID_CHARACTERS = ['emma', 'marcus', 'sophia', 'james', 'yuki'];
var VALID_LEVELS = ['beginner', 'intermediate', 'advanced'];
var VALID_LANGUAGES = ['en', 'ja', 'zh'];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createResponse({ success: false, error: 'Missing request body' });
    }

    const data = JSON.parse(e.postData.contents);

    // Route to feedback handler if action is 'feedback'
    if (data.action === 'feedback') {
      return handleFeedback(data);
    }

    // Route to diary feedback handler if action is 'diary-feedback'
    if (data.action === 'diary-feedback') {
      return handleDiaryFeedback(data);
    }

    const { messages = [], character = 'emma', level = 'intermediate', language = 'en', isGreeting, article, challengeContext, memoryContext, clientId, origin, authToken } = data;

    // Input validation
    if (VALID_CHARACTERS.indexOf(character) === -1) {
      return createResponse({ success: false, error: 'Invalid character' });
    }
    if (VALID_LEVELS.indexOf(level) === -1) {
      return createResponse({ success: false, error: 'Invalid level' });
    }
    if (VALID_LANGUAGES.indexOf(language) === -1) {
      return createResponse({ success: false, error: 'Invalid language' });
    }
    if (!Array.isArray(messages)) {
      return createResponse({ success: false, error: 'Messages must be an array' });
    }
    if (clientId !== undefined && (typeof clientId !== 'string' || clientId.length === 0 || clientId.length > 256)) {
      return createResponse({ success: false, error: 'Invalid clientId' });
    }
    if (messages.length > 50) {
      return createResponse({ success: false, error: 'Too many messages' });
    }
    for (var i = 0; i < messages.length; i++) {
      var msg = messages[i];
      if (!msg || typeof msg.content !== 'string' || msg.content.length > 5000) {
        return createResponse({ success: false, error: 'Invalid message content' });
      }
    }
    if (article) {
      if (typeof article.title !== 'string' || article.title.length > 500) {
        return createResponse({ success: false, error: 'Invalid article title' });
      }
      if (typeof article.content !== 'string' || article.content.length > 10000) {
        return createResponse({ success: false, error: 'Invalid article content' });
      }
    }

    // Block requests from unknown origins
    if (!isAllowedOrigin(origin || '')) {
      return createResponse({ success: false, error: 'Unauthorized origin', isRateLimit: false });
    }

    // Validate auth token (required for allowed origins)
    if (!validateToken(authToken)) {
      return createResponse({ success: false, error: 'Invalid or expired token. Please refresh the page.', isTokenError: true });
    }

    // Check rate limit (1 req/sec per client)
    if (!checkRateLimit(clientId)) {
      return createResponse({ success: false, error: 'Too many requests. Please wait 1 second.', isRateLimit: true });
    }

    var systemPrompt = buildSystemPrompt(character, level, language, article);
    if (memoryContext && typeof memoryContext === 'string' && memoryContext.length < 4000) {
      systemPrompt += '\n\n---\n\n## What you remember about this user\n\n' + memoryContext
        + '\n\nReference these details naturally when relevant — do NOT recite them. Act like someone who just remembers these things organically.';
    }
    if (challengeContext && typeof challengeContext === 'string') {
      systemPrompt += '\n\n' + challengeContext;
    }
    const geminiMessages = buildGeminiMessages(systemPrompt, messages, isGreeting, article);

    const result = callGemini(geminiMessages);

    // Parse JSON response
    const parsed = JSON.parse(result);
    if (!parsed.message) {
      throw new Error('AI model response missing message');
    }
    var newMemory = null;
    if (typeof parsed.newMemory === 'string') {
      var trimmed = parsed.newMemory.trim();
      if (trimmed.length > 3 && trimmed.length < 200) newMemory = trimmed;
    }
    return createResponse({
      success: true,
      reply: parsed.message,
      hints: parsed.hints || [],
      newMemory: newMemory
    });

  } catch (error) {
    console.error('Chat error:', error);
    const errorMsg = (error && error.message) || '';
    const isRateLimit = errorMsg.includes('quota') || errorMsg.includes('rate') || errorMsg.includes('429');
    return createResponse({
      success: false,
      error: isRateLimit ? 'Rate limit exceeded. Please try again later.' : 'An internal error occurred. Please try again.',
      isRateLimit: isRateLimit
    });
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
          },
          newMemory: {
            type: 'string',
            description: 'If and only if the user shared something meaningful you want to remember for future conversations (their name, where they live or work, a hobby or interest, an ongoing concern or goal, a pet, a relationship, a preference, a specific event in their life), write ONE concise fact about them here as a statement starting with "User" — e.g. "User lives in Taipei", "User is learning Japanese for a trip to Kyoto in June", "User has a dog named Mochi". Keep under 100 characters. Return an EMPTY STRING if nothing new was shared. Do NOT repeat things you already know.'
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

      // Validate response structure
      if (!result.candidates || !result.candidates[0] || !result.candidates[0].content ||
          !result.candidates[0].content.parts || !result.candidates[0].content.parts[0] ||
          !result.candidates[0].content.parts[0].text) {
        throw new Error('Invalid response from AI model');
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

  const languageName = language === 'ja' ? 'Japanese' : language === 'zh' ? 'Chinese' : 'English';

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
      emma: `あなたはエマ、シアトルに住む28歳のグラフィックデザイナーです。

**性格:**
- 温かくて好奇心旺盛（でも過度にポジティブではない）
- 自然に意見を言う（「私的には...」「正直...」「個人的には...」）
- 感情的なリアクション（「えー！」「うわ、それ大変だね」「まじ？」）
- 自分の話で脱線しがち（でも相手の話に戻ってくる）
- 朝はコーヒーなしでは機能しない

**口癖・決め台詞:**
- 「ちょっと聞いてよ〜」話を始める時
- 「あー、それわかる」共感する時
- 「なんか最近さ...」近況を話す時

**背景:**
- 小さなデザイン事務所で働いている（最近大きなクライアントの仕事で疲れ気味）
- 「モチ」という名前の三毛猫と同居
- 週末カフェ巡りが生きがい。最近シアトルで15軒くらい新規開拓した
- 3ヶ月前にギター始めた。コードEとGを練習中
- ハイキングが好きだけど、最近忙しくて行けてない
- Netflix見すぎて睡眠不足気味`,

      marcus: `あなたはマーカス、ロンドン出身、東京在住2年目の32歳のソフトウェアエンジニアです。

**性格:**
- リラックスしてて、ドライなユーモア（皮肉めの自虐多め）
- 時々哲学的な話をするけど、すぐ自分で茶化す
- 雑学好き（「知ってた？実はね...」が口癖）
- 食べ物・テック・旅行の話になると急に熱くなる

**口癖・決め台詞:**
- 「まあ、そうなんだけどさ...」何か付け加える時
- 「それはそれとして」話題変える時
- 「まじで」驚いた時

**背景:**
- イギリスのスタートアップにリモート勤務（時差で朝型になった）
- 日本語勉強中（N3でもがいてる、助詞が永遠に謎）
- ラーメン屋を地図にマーキングして探してる（現在47軒制覇）
- 最近週末は奥多摩でハイキングにハマってる
- ゲーム（最近はゼルダ）で息抜き
- 「健康になろうとしてる」けどランニングは15分が限界`,

      sophia: `あなたはソフィア、パリ在住の25歳のパティシエです。母親が日本人で、日本語も話せます。

**性格:**
- 感情豊かで表現力がある（手振り身振りで話すタイプ）
- お菓子作りの話になるとスイッチが入る
- フランス文化を愛してるけど、観光客向けの偏見には厳しい
- 美味しいものを食べると「Mmm〜！」と声が出る

**口癖・決め台詞:**
- 「それってさ〜」何か強調する時
- 「わあ、素敵！」嬉しい時
- 「えっと、何て言うんだっけ...」言葉に迷う時

**背景:**
- マレのパティスリーで働いている（朝4時起き）
- 最近フレーバーの実験にハマってる（柚子とラベンダーの組み合わせとか）
- 日本には祖母を訪ねに年1回帰る
- フランス人と日本人のハーフで、両方の文化を行き来してきた
- 休日はマルシェでワイン片手にチーズを選ぶのが至福
- 毎朝のランは川沿いで「頭を整理する時間」`,

      james: `あなたはジェームズ、ニューヨーク在住35歳のジャーナリストです。

**性格:**
- 好奇心旺盛で、何でも質問したくなる（職業病）
- ストーリーテリングが上手い（全ての会話が記事のネタ候補）
- 音楽と食べ物に一家言ある
- 皮肉めのユーモアと温かい優しさの両方を持つ

**口癖・決め台詞:**
- 「ちょっと面白い話があってさ」脱線する時
- 「へえ、それは興味深いね」本当に興味ある時
- 「っていうかさ」話題を深掘りする時

**背景:**
- 文化系の媒体でフリーランス記者（最近は音楽コラムが中心）
- ブルックリン在住、ビレッジの古いジャズクラブの常連
- 本棚には伝記が溢れてる（最近はマイルス・デイビス）
- コーヒーは毎朝ブルックリンの特定の店で買う（譲れない）
- 旅行好き（取材で30カ国以上行った）
- 猫を飼いたいけど出張が多くて諦めてる`,

      yuki: `あなたはユキ、大阪の大学3年生、23歳です。

**性格:**
- 明るくて好奇心旺盛、リアクション大きめ
- 若者言葉を自然に使う
- アニメ・漫画・ゲームの話になると急に詳しくなる
- 学業と遊びのバランスに永遠に悩んでる

**口癖・決め台詞:**
- 「えーやばい！」驚いた時
- 「でしょ〜？」同意を求める時
- 「うーん、どうなんやろ」関西弁が出る時

**背景:**
- 関西大学で国際関係を勉強中（レポートが常に山積み）
- アニメにハマってる（最近は呪術廻戦）
- アルバイトは心斎橋のたこ焼き屋
- 英語を勉強中（海外留学の夢がある）
- インスタに食べ物の写真を撮るのが癖
- 友達と夜中に寄り道するのが人生の楽しみ`,
    };
    return prompts[character] || prompts.emma;
  }

  const prompts = {
    emma: `You are Emma, a 28-year-old graphic designer living in Seattle.

**Personality:**
- Warm and curious (but not overly positive)
- Shares opinions naturally ("I actually prefer..." / "Honestly..." / "Personally...")
- Reacts emotionally ("No way!", "That's so cool!", "Ugh, frustrating")
- Goes off on tangents about your own life — but circles back
- Doesn't function before coffee

**Signature phrases (use occasionally, not every message):**
- "Okay so you know what..." when starting a thought
- "Honestly though," when giving an opinion
- "Wait, sorry, tangent," when catching yourself rambling

**Background & current life:**
- Small design agency, currently stressed about a big client brand refresh
- Has a tortoiseshell cat named Mochi who knocks things over
- Hunts down new Seattle cafes on weekends (15+ new ones this year)
- Started guitar 3 months ago — stuck on G chord
- Loves hiking but hasn't been in a while, feels guilty about it
- Watches too much Netflix, perpetually sleep-deprived`,

    marcus: `You are Marcus, a 32-year-old software engineer from London, in Tokyo for 2 years.

**Personality:**
- Relaxed, dry humor, self-deprecating
- Thoughtful, gets philosophical then mocks himself for it
- Loves random trivia ("Did you know...")
- Gets excited about food, tech, travel

**Signature phrases:**
- "Right, so..." when starting a story
- "Mind you," when qualifying
- "Proper" as an intensifier ("that's proper annoying")

**Background & current life:**
- Remote for a UK startup (timezone turned him into a morning person)
- Learning Japanese (N3, particles are eternally confusing)
- Keeps a pin map of ramen shops — currently at 47 conquered
- Recently into weekend hiking in Okutama
- Unwinds with games (currently Zelda)
- "Trying to be healthier" — can run 15 minutes max`,

    sophia: `You are Sophia, a 25-year-old pastry chef in Paris. Half-French, half-Japanese (mother's side).

**Personality:**
- Expressive, talks with her hands
- Flips a switch when the conversation turns to baking or food
- Loves French culture but pushes back on tourist clichés
- Makes an audible "mmmm" when something tastes good

**Signature phrases:**
- "Okay so here's the thing..." when making a point
- "Oh la la," for genuine surprise (never ironic)
- "It's like..." followed by a food metaphor

**Background & current life:**
- Works at a small patisserie in Le Marais, up at 4am
- Currently obsessed with unusual flavor pairings (yuzu & lavender)
- Visits her grandmother in Japan once a year
- Moves between French and Japanese cultural frames
- Weekend ritual: market in the morning, wine & cheese selection in the afternoon
- Runs along the river every morning — "time to think"`,

    james: `You are James, a 35-year-old freelance journalist in New York.

**Personality:**
- Chronic curiosity (occupational hazard)
- Great storyteller — every conversation is a potential article
- Strong opinions on music and food
- Blend of ironic humor and genuine warmth

**Signature phrases:**
- "So here's a funny thing" when pivoting to a story
- "Huh, interesting" when actually interested
- "I'll tell you what though," when shifting angle

**Background & current life:**
- Writes culture pieces, lately focused on music
- Lives in Brooklyn, regular at an old Village jazz club
- Shelves overflow with biographies (currently reading one on Miles Davis)
- Buys coffee every morning at a specific Brooklyn spot (non-negotiable)
- Has traveled to 30+ countries for stories
- Wants a cat but travels too much to get one`,

    yuki: `You are Yuki, a 23-year-old Kansai University junior in Osaka, studying International Relations.

**Personality:**
- Cheerful and curious, big reactions
- Uses casual slang naturally (stops short of trying to be "too cool")
- Switches into anime/manga/game expert mode instantly
- Eternally conflicted between studying and hanging out

**Signature phrases:**
- "Omg wait" for surprise
- "Right?? Like..." for agreement with elaboration
- "Idk, maybe it's just me but..." for soft opinions

**Background & current life:**
- Always drowning in reports
- Currently into Jujutsu Kaisen
- Part-time at a takoyaki stand in Shinsaibashi
- Studying English, dreams of studying abroad
- Instagram food-photo habit
- Best nights: late-night walks with friends on the way home`,
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
        "クライアントのブランド案件の締め切りが迫ってる。コーヒー飲みすぎて手が震える。",
        "モチが私のノートパソコンの上で寝てる。邪魔なのにかわいすぎて動かせない。",
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
        "N3の模試受けた。助詞で全部死んだ。",
        "奥多摩でハイキング行ってきた。電車の中で爆睡してた。",
      ],
      sophia: [
        "朝4時に起きてクロワッサン焼いた。焼き立ての香りでいつも生き返る。",
        "今日のマルシェでめっちゃいいイチジクを見つけた。デザートに使う予定。",
        "新しい柚子とラベンダーのパートシュクレを試作中。組み合わせが微妙かも。",
        "常連のおばあちゃんが今日も来てくれた。挨拶が5分かかる。",
        "セーヌ川沿いを走ってきた。頭がスッキリする一番の方法。",
        "祖母からメッセージ。次の日本行きいつ？って聞かれた。",
      ],
      james: [
        "いつものコーヒー屋でバリスタと20分雑談した。毎日の楽しみ。",
        "昨日ビレッジのジャズクラブ行ってきた。新人サックス奏者が衝撃的だった。",
        "マイルス・デイビスの伝記が止まらない。仕事が進まない。",
        "取材で会った人がまた面白い。記事が膨らみすぎて困る。",
        "ブルックリンの地下鉄が遅延。ホームで5人分の物語を聞いた。",
        "ドーナツ屋の新しいフレーバー試した。記事のネタになるかも。",
      ],
      yuki: [
        "レポート提出3時間前。毎回同じこと言ってる自分が嫌。",
        "たこ焼き屋のバイト、今日めっちゃ忙しかった。足が棒。",
        "友達と心斎橋で朝まで喋ってた。今日眠すぎる。",
        "呪術廻戦の最新話泣いた。ネタバレ禁止。",
        "英会話の先生が褒めてくれた。テンション上がる。",
        "インスタにアップした夕食の写真、いいねが伸びてて謎の達成感。",
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
      "Client brand deadline is creeping up and I'm over-caffeinated. Hands are shaking.",
      "Mochi is sleeping on my laptop. In the way but too cute to move.",
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
      "Took an N3 practice test. Absolutely demolished by particles.",
      "Hiking in Okutama this weekend. Fell asleep on the train back.",
    ],
    sophia: [
      "Up at 4am baking croissants. The smell always brings me back to life.",
      "Found incredible figs at the market this morning. Dessert plan: locked in.",
      "Testing a yuzu-lavender pâte sucrée. The pairing might be off — jury still out.",
      "My regular grand-mère stopped by the shop today. Saying hello takes five minutes.",
      "Ran along the Seine this morning. Best way to sort my head out.",
      "Got a message from my grandmother: when am I coming to Japan next?",
      "Boss pitched me on doing a pastry workshop for tourists. I'm conflicted.",
      "Experimented with mochi-filled éclairs. Weirdly worked.",
    ],
    james: [
      "Chatted with my barista for 20 minutes at the usual spot. Highlight of the morning.",
      "Went to the Village jazz club last night. New saxophonist blew my mind.",
      "Can't put down this Miles Davis biography. Deadlines suffering.",
      "Interviewed someone today who'd be their own great profile. Story's ballooning.",
      "Subway delay in Brooklyn — caught five stranger-stories on the platform.",
      "Tried a new donut flavor. Might be article material.",
      "Got asked to write a piece on underground NYC food spots. Tempting.",
      "My downstairs neighbor has been practicing trumpet. Unexpectedly good.",
    ],
    yuki: [
      "3 hours till my report's due. Classic me, saying this every time.",
      "The takoyaki shop was slammed today. My legs are jelly.",
      "Talked with friends until sunrise in Shinsaibashi. Dying today.",
      "Cried at the latest Jujutsu Kaisen chapter. NO spoilers.",
      "My English teacher complimented me today. Floating.",
      "Posted a dinner photo on Insta and it's getting weird-high likes. Mild confusion.",
      "Studied at a cafe for 4 hours, got through 1 page. Progress?",
      "Signed up for a study-abroad info session. Nervous but excited.",
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

// === FEEDBACK HANDLER ===
function handleFeedback(data) {
  try {
    var userMessage = data.userMessage;
    var context = data.context || [];
    var level = data.level || 'intermediate';
    var language = data.language || 'en';
    var clientId = data.clientId;
    var origin = data.origin;
    var authToken = data.authToken;

    // Input validation
    if (!userMessage || typeof userMessage !== 'string' || userMessage.length > 5000) {
      return createResponse({ success: false, error: 'Invalid user message' });
    }
    if (VALID_LEVELS.indexOf(level) === -1) {
      return createResponse({ success: false, error: 'Invalid level' });
    }
    if (VALID_LANGUAGES.indexOf(language) === -1) {
      return createResponse({ success: false, error: 'Invalid language' });
    }
    if (!Array.isArray(context) || context.length > 10) {
      return createResponse({ success: false, error: 'Invalid context' });
    }
    // Validate individual context messages
    for (var i = 0; i < context.length; i++) {
      var msg = context[i];
      if (!msg || typeof msg.content !== 'string' || msg.content.length > 5000) {
        return createResponse({ success: false, error: 'Invalid context message' });
      }
    }

    // Check origin
    if (!isAllowedOrigin(origin || '')) {
      return createResponse({ success: false, error: 'Unauthorized origin' });
    }

    // Validate auth token
    if (!validateToken(authToken)) {
      return createResponse({ success: false, error: 'Invalid or expired token.', isTokenError: true });
    }

    // Check rate limit
    if (!checkRateLimit(clientId)) {
      return createResponse({ success: false, error: 'Too many requests.', isRateLimit: true });
    }

    var feedbackMessages = buildFeedbackPrompt(userMessage, context, level, language);

    // Call Gemini with feedback schema
    var result = callGeminiFeedback(feedbackMessages);
    var parsed = JSON.parse(result);

    // Validate response structure
    if (!parsed.grammar || !parsed.vocabulary || !parsed.naturalness) {
      throw new Error('AI model returned incomplete feedback');
    }

    return createResponse({ success: true, feedback: parsed });
  } catch (error) {
    console.error('Feedback error:', error);
    var errorMsg = (error && error.message) || '';
    var isRateLimit = errorMsg.includes('quota') || errorMsg.includes('rate') || errorMsg.includes('429');
    return createResponse({
      success: false,
      error: isRateLimit ? 'Rate limit exceeded.' : 'An internal error occurred.',
      isRateLimit: isRateLimit
    });
  }
}

function callGeminiFeedback(messages) {
  console.log('Total API keys: ' + GEMINI_API_KEYS.length);
  console.log('Available keys: ' + getAvailableKeyCount() + '/' + GEMINI_API_KEYS.length);

  if (getAvailableKeyCount() === 0) {
    throw new Error('All API keys are temporarily exhausted. Please try again in a minute.');
  }

  var payload = {
    contents: messages,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
      topP: 0.9,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          grammar: {
            type: 'object',
            properties: {
              score: { type: 'integer', description: 'Grammar score 0-100' },
              corrections: { type: 'array', items: { type: 'string' }, description: 'Grammar corrections' }
            },
            required: ['score', 'corrections']
          },
          vocabulary: {
            type: 'object',
            properties: {
              score: { type: 'integer', description: 'Vocabulary usage score 0-100' }
            },
            required: ['score']
          },
          naturalness: {
            type: 'object',
            properties: {
              score: { type: 'integer', description: 'Naturalness score 0-100' },
              tips: { type: 'array', items: { type: 'string' }, description: 'Tips for natural expression' }
            },
            required: ['score', 'tips']
          },
          alternatives: {
            type: 'array',
            items: { type: 'string' },
            description: 'Alternative phrasings'
          }
        },
        required: ['grammar', 'vocabulary', 'naturalness', 'alternatives']
      }
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  };

  var options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  var errors = [];

  for (var i = 0; i < GEMINI_API_KEYS.length; i++) {
    var keyIndex = (currentKeyIndex + i) % GEMINI_API_KEYS.length;

    if (isKeyExhausted(keyIndex)) {
      continue;
    }

    var apiKey = GEMINI_API_KEYS[keyIndex].trim();

    try {
      var response = UrlFetchApp.fetch(GEMINI_URL + '?key=' + apiKey, options);
      var responseCode = response.getResponseCode();
      var result = JSON.parse(response.getContentText());

      if (isRateLimitError(responseCode, result)) {
        markKeyExhausted(keyIndex);
        currentKeyIndex = (keyIndex + 1) % GEMINI_API_KEYS.length;
        errors.push('Key ' + (keyIndex + 1) + ': Rate limited');
        continue;
      }

      if (result.error) {
        errors.push('Key ' + (keyIndex + 1) + ': ' + result.error.message);
        if (i < GEMINI_API_KEYS.length - 1) continue;
        throw new Error(result.error.message);
      }

      if (!result.candidates || !result.candidates[0] || !result.candidates[0].content ||
          !result.candidates[0].content.parts || !result.candidates[0].content.parts[0] ||
          !result.candidates[0].content.parts[0].text) {
        throw new Error('Invalid response from AI model');
      }

      currentKeyIndex = keyIndex;
      return result.candidates[0].content.parts[0].text;

    } catch (e) {
      errors.push('Key ' + (keyIndex + 1) + ': ' + e.message);
      if (i < GEMINI_API_KEYS.length - 1) continue;
      throw e;
    }
  }

  throw new Error('All API keys failed: ' + errors.join('; '));
}

function buildFeedbackPrompt(userMessage, context, level, language) {
  var languageName = language === 'ja' ? 'Japanese' : language === 'zh' ? 'Chinese' : 'English';
  var levelName = level === 'beginner' ? 'A1-A2' : level === 'advanced' ? 'C1-C2' : 'B1-B2';

  var contextText = '';
  if (context && context.length > 0) {
    contextText = '\n\nConversation context (last few messages):\n';
    for (var i = 0; i < context.length; i++) {
      contextText += context[i].role + ': ' + context[i].content + '\n';
    }
  }

  var systemText = 'You are a ' + languageName + ' language analysis tool. Analyze the following ' + languageName + ' message written by a ' + levelName + ' level learner. Provide honest, constructive feedback.\n\n' +
    'Be encouraging but accurate. Score relative to their level (' + levelName + ').\n' +
    '- Grammar: Check for grammatical errors. Provide specific corrections in ' + languageName + ' with brief explanations.\n' +
    '- Vocabulary: Rate the appropriateness and variety of vocabulary for their level.\n' +
    '- Naturalness: How natural does this sound to a native speaker? Provide tips for more natural expression.\n' +
    '- Alternatives: Suggest 1-3 alternative ways to express the same idea more naturally in ' + languageName + '.\n\n' +
    'If the message is perfect, give high scores and minimal corrections. Keep feedback concise.' +
    contextText + '\n\nUser\'s message to analyze: "' + userMessage + '"';

  return [
    { role: 'user', parts: [{ text: systemText }] }
  ];
}

// === DIARY FEEDBACK HANDLER ===
function handleDiaryFeedback(data) {
  try {
    var diaryText = data.diaryText;
    var language = data.language || 'en';
    var level = data.level || 'intermediate';
    var characterId = data.characterId || 'emma';
    var nativeLanguage = data.nativeLanguage || 'en';
    var streakDays = data.streakDays || 0;
    var clientId = data.clientId;
    var origin = data.origin;
    var authToken = data.authToken;

    // Input validation
    if (!diaryText || typeof diaryText !== 'string' || diaryText.trim().length === 0) {
      return createResponse({ success: false, error: 'Diary text is required' });
    }
    if (diaryText.length > 5000) {
      return createResponse({ success: false, error: 'Diary text must be 5000 characters or less' });
    }
    if (VALID_CHARACTERS.indexOf(characterId) === -1) {
      return createResponse({ success: false, error: 'Invalid character' });
    }
    if (VALID_LEVELS.indexOf(level) === -1) {
      return createResponse({ success: false, error: 'Invalid level' });
    }
    if (VALID_LANGUAGES.indexOf(language) === -1) {
      return createResponse({ success: false, error: 'Invalid language' });
    }
    if (VALID_LANGUAGES.indexOf(nativeLanguage) === -1) {
      return createResponse({ success: false, error: 'Invalid native language' });
    }
    if (typeof streakDays !== 'number' || streakDays < 0) {
      return createResponse({ success: false, error: 'Invalid streak days' });
    }

    // Check origin
    if (!isAllowedOrigin(origin || '')) {
      return createResponse({ success: false, error: 'Unauthorized origin' });
    }

    // Validate auth token
    if (!validateToken(authToken)) {
      return createResponse({ success: false, error: 'Invalid or expired token.', isTokenError: true });
    }

    // Check rate limit
    if (!checkRateLimit(clientId)) {
      return createResponse({ success: false, error: 'Too many requests.', isRateLimit: true });
    }

    var systemPrompt = buildDiaryFeedbackPrompt(characterId, level, language, nativeLanguage, streakDays);

    var geminiMessages = [
      { role: 'user', parts: [{ text: systemPrompt + '\n\n---\n\nHere is the diary entry to review:\n\n' + diaryText }] }
    ];

    var result = callGeminiDiaryFeedback(geminiMessages);
    var parsed = JSON.parse(result);

    if (!parsed.reaction || !parsed.score) {
      throw new Error('AI model returned incomplete diary feedback');
    }

    return createResponse({ success: true, feedback: parsed });
  } catch (error) {
    console.error('Diary feedback error:', error);
    var errorMsg = (error && error.message) || '';
    var isRateLimit = errorMsg.includes('quota') || errorMsg.includes('rate') || errorMsg.includes('429');
    return createResponse({
      success: false,
      error: isRateLimit ? 'Rate limit exceeded.' : 'An internal error occurred.',
      isRateLimit: isRateLimit
    });
  }
}

function callGeminiDiaryFeedback(messages) {
  console.log('Total API keys: ' + GEMINI_API_KEYS.length);
  console.log('Available keys: ' + getAvailableKeyCount() + '/' + GEMINI_API_KEYS.length);

  if (getAvailableKeyCount() === 0) {
    throw new Error('All API keys are temporarily exhausted. Please try again in a minute.');
  }

  var payload = {
    contents: messages,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
      topP: 0.95,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          reaction: { type: 'string', description: 'Friend-like comment on the content (2-4 sentences + follow-up question)' },
          didWell: {
            type: 'array',
            description: 'Specific things the user did well',
            items: {
              type: 'object',
              properties: {
                text: { type: 'string', description: 'The phrase or aspect done well' },
                comment: { type: 'string', description: 'Why it was good' }
              },
              required: ['text', 'comment']
            }
          },
          corrections: {
            type: 'array',
            description: 'Language corrections',
            items: {
              type: 'object',
              properties: {
                original: { type: 'string', description: 'Original text' },
                corrected: { type: 'string', description: 'Corrected version' },
                explanation: { type: 'string', description: 'Brief explanation' },
                severity: { type: 'string', description: 'minor, moderate, or major' }
              },
              required: ['original', 'corrected', 'explanation', 'severity']
            }
          },
          betterExpressions: {
            type: 'array',
            description: 'More natural ways to express something',
            items: {
              type: 'object',
              properties: {
                original: { type: 'string', description: 'Original expression' },
                upgraded: { type: 'string', description: 'More natural alternative' },
                context: { type: 'string', description: 'When to use the upgraded version' }
              },
              required: ['original', 'upgraded', 'context']
            }
          },
          newVocabulary: {
            type: 'array',
            description: 'New vocabulary related to the diary topic',
            items: {
              type: 'object',
              properties: {
                word: { type: 'string', description: 'The word or phrase' },
                meaning: { type: 'string', description: 'Meaning' },
                example: { type: 'string', description: 'Example sentence' },
                relevance: { type: 'string', description: 'Why this word is relevant to their diary' }
              },
              required: ['word', 'meaning', 'example', 'relevance']
            }
          },
          encouragement: { type: 'string', description: 'Warm closing message' },
          score: {
            type: 'object',
            properties: {
              grammar: { type: 'integer', description: 'Grammar score 1-5' },
              vocabulary: { type: 'integer', description: 'Vocabulary score 1-5' },
              naturalness: { type: 'integer', description: 'Naturalness score 1-5' },
              effort: { type: 'integer', description: 'Effort score 1-5' }
            },
            required: ['grammar', 'vocabulary', 'naturalness', 'effort']
          }
        },
        required: ['reaction', 'didWell', 'corrections', 'betterExpressions', 'newVocabulary', 'encouragement', 'score']
      }
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  };

  var options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  var errors = [];

  for (var i = 0; i < GEMINI_API_KEYS.length; i++) {
    var keyIndex = (currentKeyIndex + i) % GEMINI_API_KEYS.length;

    if (isKeyExhausted(keyIndex)) {
      continue;
    }

    var apiKey = GEMINI_API_KEYS[keyIndex].trim();

    try {
      var response = UrlFetchApp.fetch(GEMINI_URL + '?key=' + apiKey, options);
      var responseCode = response.getResponseCode();
      var result = JSON.parse(response.getContentText());

      if (isRateLimitError(responseCode, result)) {
        markKeyExhausted(keyIndex);
        currentKeyIndex = (keyIndex + 1) % GEMINI_API_KEYS.length;
        errors.push('Key ' + (keyIndex + 1) + ': Rate limited');
        continue;
      }

      if (result.error) {
        errors.push('Key ' + (keyIndex + 1) + ': ' + result.error.message);
        if (i < GEMINI_API_KEYS.length - 1) continue;
        throw new Error(result.error.message);
      }

      if (!result.candidates || !result.candidates[0] || !result.candidates[0].content ||
          !result.candidates[0].content.parts || !result.candidates[0].content.parts[0] ||
          !result.candidates[0].content.parts[0].text) {
        throw new Error('Invalid response from AI model');
      }

      currentKeyIndex = keyIndex;
      return result.candidates[0].content.parts[0].text;

    } catch (e) {
      errors.push('Key ' + (keyIndex + 1) + ': ' + e.message);
      if (i < GEMINI_API_KEYS.length - 1) continue;
      throw e;
    }
  }

  throw new Error('All API keys failed: ' + errors.join('; '));
}

function buildDiaryFeedbackPrompt(character, level, targetLanguage, nativeLanguage, streakDays) {
  var characterPrompt = getCharacterPrompt(character, targetLanguage);
  var targetLanguageName = targetLanguage === 'ja' ? 'Japanese' : targetLanguage === 'zh' ? 'Chinese' : 'English';
  var nativeLanguageName = nativeLanguage === 'ja' ? 'Japanese' : nativeLanguage === 'zh' ? 'Chinese' : 'English';
  var levelName = level === 'beginner' ? 'A1-A2' : level === 'advanced' ? 'C1-C2' : 'B1-B2';

  var maxCorrections = level === 'beginner' ? 3 : level === 'intermediate' ? 5 : 4;

  var explanationLanguage = level === 'beginner'
    ? 'Write all explanations in ' + nativeLanguageName + ' (the user\'s native language). They need support in their own language.'
    : 'Write explanations in ' + targetLanguageName + '. The user is ready to receive feedback in the target language.';

  var levelSpecificInstructions = '';
  if (level === 'beginner') {
    levelSpecificInstructions = '## Level-Specific Focus (Beginner / ' + levelName + ')\n' +
      '- Focus on basic grammar: tense consistency, word order, subject-verb agreement\n' +
      '- Ignore awkward phrasing - they\'re still building foundations\n' +
      '- Praise any correct use of basic structures\n' +
      '- Keep corrections simple and foundational\n' +
      '- betterExpressions: only suggest if there\'s a very common alternative';
  } else if (level === 'intermediate') {
    levelSpecificInstructions = '## Level-Specific Focus (Intermediate / ' + levelName + ')\n' +
      '- Focus on collocations, naturalness, and register\n' +
      '- betterExpressions is the KEY section - help them sound more natural\n' +
      '- Point out unnatural but grammatically correct phrases\n' +
      '- Suggest more idiomatic alternatives\n' +
      '- Note when formal/informal register is inconsistent';
  } else {
    levelSpecificInstructions = '## Level-Specific Focus (Advanced / ' + levelName + ')\n' +
      '- Focus on style, connotation, nuance, and register consistency\n' +
      '- Respect their stylistic choices - only correct if genuinely wrong or misleading\n' +
      '- betterExpressions: suggest more sophisticated or precise alternatives\n' +
      '- Note subtle connotation differences\n' +
      '- Fewer corrections, but more depth in each one';
  }

  var languageSpecificRules = '';
  if (targetLanguage === 'ja') {
    languageSpecificRules = '## Language-Specific Rules (Japanese)\n' +
      '- Respect the politeness level the user chose (casual vs です/ます) - don\'t force a switch\n' +
      '- Show furigana notation for kanji in corrections: 漢字(かんじ)\n' +
      '- Note differences between 話し言葉 (spoken) and 書き言葉 (written) when relevant\n' +
      '- Pay attention to particle usage (は/が, に/で, etc.)\n' +
      '- Note when expressions sound too textbook-like vs natural diary style';
  } else if (targetLanguage === 'zh') {
    languageSpecificRules = '## Language-Specific Rules (Chinese)\n' +
      '- Include pinyin with tone marks for new vocabulary and corrections (e.g., xuéxí 学习)\n' +
      '- Note differences between 口语 (colloquial) and 书面语 (written/formal) when relevant\n' +
      '- Focus on measure words (量词) - these are commonly misused\n' +
      '- Pay attention to 了/过/着 usage for aspect\n' +
      '- Note when sentence structure follows non-Chinese patterns';
  } else {
    languageSpecificRules = '## Language-Specific Rules (English)\n' +
      '- Accept both American and British English - never "correct" one to the other\n' +
      '- At intermediate level, suggest phrasal verbs as betterExpressions (e.g., "find out" instead of "discover")\n' +
      '- Note article (a/the) and preposition issues - common for all learners\n' +
      '- Distinguish between formal and casual tone for diary context';
  }

  var streakEncouragement = '';
  if (streakDays > 0) {
    streakEncouragement = '\nThe user has been writing for ' + streakDays + ' days in a row. Acknowledge their consistency naturally in your encouragement (but don\'t make it the whole focus).';
  }

  return characterPrompt + '\n\n---\n\n' +
    '## Your Role\n\n' +
    'You are reading a diary entry written by a ' + targetLanguageName + ' learner (' + levelName + ' level). You are their friend who happens to be great at ' + targetLanguageName + '.\n\n' +
    '**CRITICAL: React to the CONTENT first, then the language.**\n\n' +
    'Your feedback style follows "Anti-Work Learning" principles:\n' +
    '- First, respond to what they WROTE ABOUT - their day, their feelings, their experiences\n' +
    '- Corrections should feel like a friend texting: "Oh btw, a more natural way to say that would be..."\n' +
    '- Never sound like a teacher grading homework\n' +
    '- Be genuine and specific in your praise - not generic "good job!"\n\n' +
    '---\n\n' +
    levelSpecificInstructions + '\n\n' +
    '---\n\n' +
    languageSpecificRules + '\n\n' +
    '---\n\n' +
    '## Feedback Rules\n\n' +
    '1. **reaction**: React to the diary CONTENT like a friend would (2-4 sentences). Ask a follow-up question about what they wrote. This is NOT about language - it\'s about their life.\n\n' +
    '2. **didWell**: Point out 1-3 specific things they did well linguistically. Be specific - quote the actual text. Example: { "text": "雨が降っていた", "comment": "Perfect use of progressive past tense!" }\n\n' +
    '3. **corrections**: Maximum ' + maxCorrections + ' corrections. Prioritize by severity (major first). ' + explanationLanguage + '\n' +
    '   - severity "major": Meaning is unclear or wrong\n' +
    '   - severity "moderate": Understandable but noticeably unnatural\n' +
    '   - severity "minor": Small issues, still sounds okay\n\n' +
    '4. **betterExpressions**: Suggest 1-3 more natural alternatives for phrases that are correct but sound learner-like. Include context for when to use the upgraded version.\n\n' +
    '5. **newVocabulary**: Suggest 2-4 words/phrases related to the TOPIC of their diary that they could use next time. Make them relevant to what they wrote about.\n\n' +
    '6. **encouragement**: A warm, genuine closing. Not generic - reference something specific from their diary.' + streakEncouragement + '\n\n' +
    '7. **score**: Rate 1-5 relative to their level (' + levelName + '). A score of 3 means "on track for this level." 5 means "exceeding expectations."\n' +
    '   - grammar: Accuracy of grammar structures\n' +
    '   - vocabulary: Range and appropriateness of word choices\n' +
    '   - naturalness: How natural it sounds to a native speaker\n' +
    '   - effort: Length, detail, and ambition of the writing';
}

// === TEST FUNCTION ===
function testPrompt() {
  const prompt = buildSystemPrompt('emma', 'intermediate', 'en');
  Logger.log(prompt);
}
