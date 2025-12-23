import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.text({ type: 'text/plain' }));

// Middleware to parse text/plain as JSON
app.use((req, res, next) => {
  if (req.headers['content-type']?.includes('text/plain') && typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
      // Not JSON, leave as string
    }
  }
  next();
});

const API_KEYS = (process.env.GEMINI_API_KEYS || '').split(',').filter(Boolean);
const MOCK_API = process.env.MOCK_API === 'true';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
const SKIP_AUTH = process.env.SKIP_AUTH === 'true'; // For local development

let currentKeyIndex = 0;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// === TOKEN MANAGEMENT ===
const TOKEN_EXPIRY_MS = 3600 * 1000; // 1 hour
const TOKEN_RATE_LIMIT_MS = 60000; // 1 token per minute per origin
const RATE_LIMIT_MS = 1000; // 1 request per second

const tokenStore = new Map(); // token -> { createdAt: timestamp }
const tokenRateLimits = new Map(); // origin -> lastTokenRequest timestamp
const clientRateLimits = new Map(); // clientId -> lastRequest timestamp

function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

function isAllowedOrigin(origin) {
  // In development, allow all origins if ALLOWED_ORIGINS is not set
  if (!ALLOWED_ORIGINS.length) return true;
  if (!origin) return false;
  return ALLOWED_ORIGINS.some(allowed => origin.includes(allowed.trim()));
}

function checkTokenRateLimit(origin) {
  const key = origin || 'unknown';
  const lastRequest = tokenRateLimits.get(key);
  const now = Date.now();

  if (lastRequest && (now - lastRequest) < TOKEN_RATE_LIMIT_MS) {
    return false;
  }
  tokenRateLimits.set(key, now);
  return true;
}

function createAuthToken(origin) {
  if (!isAllowedOrigin(origin)) {
    return null;
  }

  const token = generateToken();
  tokenStore.set(token, { createdAt: Date.now() });

  // Clean up expired tokens periodically
  cleanupExpiredTokens();

  return token;
}

function validateToken(token) {
  if (!token) return false;

  const tokenData = tokenStore.get(token);
  if (!tokenData) return false;

  // Check if token has expired
  if (Date.now() - tokenData.createdAt > TOKEN_EXPIRY_MS) {
    tokenStore.delete(token);
    return false;
  }

  return true;
}

function cleanupExpiredTokens() {
  const now = Date.now();
  for (const [token, data] of tokenStore.entries()) {
    if (now - data.createdAt > TOKEN_EXPIRY_MS) {
      tokenStore.delete(token);
    }
  }
}

function checkRateLimit(clientId) {
  if (!clientId) return true; // No rate limit without clientId

  const lastRequest = clientRateLimits.get(clientId);
  const now = Date.now();

  if (lastRequest && (now - lastRequest) < RATE_LIMIT_MS) {
    return false;
  }
  clientRateLimits.set(clientId, now);
  return true;
}

// Mock responses for testing
function getMockResponse(character, level, isGreeting, article, language = 'en') {
  const mockHints = language === 'ja' ? [
    { word: 'なるほど', description: '理解した時に使う', example: 'なるほど、そういうことか。' },
    { word: 'ちなみに', description: '追加情報を言う時', example: 'ちなみに、私も同じ経験があるよ。' },
    { word: '確かに', description: '同意する時', example: '確かに、それは大変だったね。' }
  ] : [
    { word: 'definitely', description: 'strong agreement', example: 'I definitely agree with that.' },
    { word: 'actually', description: 'adding new info', example: 'Actually, I tried that too.' },
    { word: 'honestly', description: 'being sincere', example: 'Honestly, I feel the same way.' }
  ];

  if (article) {
    const articleMessages = language === 'ja' ? {
      emma: {
        greeting: `ねえ、この「${article.title}」の記事読んだ？結構面白いなって思ったんだけど。どう思った？`,
        response: 'うんうん、その部分いいよね。私もそう思った。この記事読んでて、なんか自分の生活も見直したくなったかも。'
      },
      marcus: {
        greeting: `お、「${article.title}」の記事読んだ？なかなか考えさせられる内容だったよね。君はどう思う？`,
        response: 'あー、なるほどね。確かにその視点は面白い。僕も最近この話題についてよく考えてたんだよね。'
      }
    } : {
      emma: {
        greeting: `Hey! So I just read this article about "${article.title}" - it's pretty interesting actually. What did you think of it?`,
        response: "Yeah, I totally get that. That part really stood out to me too. It kinda made me think about my own habits, you know?"
      },
      marcus: {
        greeting: `Yo, did you check out that "${article.title}" article? Pretty thought-provoking stuff. What's your take on it?`,
        response: "Hmm, interesting perspective. I was actually thinking something similar. The whole topic is pretty relevant these days, isn't it?"
      }
    };
    const charMessages = articleMessages[character] || articleMessages.emma;
    return {
      message: isGreeting ? charMessages.greeting : charMessages.response,
      hints: mockHints
    };
  }

  const messages = language === 'ja' ? {
    emma: {
      beginner: {
        greeting: 'ねえ！エマだよ。今日はどう？',
        response: 'いいね！私も今日カフェに行ったよ。コーヒーおいしかった。'
      },
      intermediate: {
        greeting: 'やっほー！コーヒー飲みながらリラックス中。調子どう？',
        response: 'あー、わかるわかる。そういえば最近新しいカフェ見つけたんだけど、めっちゃよかったよ。'
      },
      advanced: {
        greeting: 'うわー、今日モチにコーヒーこぼされてさ、まだ立ち直れてない笑。まあいいや、そっちはどう？',
        response: 'あはは、それな。最近みんなが推してたあのカフェついに行ってみたんだけど、正直期待以上だった。'
      }
    },
    marcus: {
      beginner: {
        greeting: 'やあ！マーカスだよ。元気？',
        response: '面白いね。今日ラーメン食べたよ。おいしかった！'
      },
      intermediate: {
        greeting: 'よお！コード書くの休憩中。最近どう？',
        response: 'へー、そうなんだ。実は今日すごい穴場のラーメン屋見つけてさ、マジでうまかった。'
      },
      advanced: {
        greeting: '東京相変わらずカオスだけど楽しいよ。ちょっとサボり中。そっちは？',
        response: 'あー、わかるわ。そういえばさ、今日渋谷で迷子になってたら、偶然すごいラーメン屋見つけたんだよね。'
      }
    }
  } : {
    emma: {
      beginner: {
        greeting: "Hey! I'm Emma. How are you today?",
        response: "That's nice! I went to a cafe today. The coffee was good."
      },
      intermediate: {
        greeting: "Hey there! Just grabbed my coffee. I'm Emma by the way - how's your day going?",
        response: "Oh nice! That reminds me - I've been meaning to try this new place near my office. Have you been anywhere good lately?"
      },
      advanced: {
        greeting: "Hey! Ugh, Mochi knocked over my coffee this morning - still recovering honestly. Anyway, I'm Emma! What's up with you?",
        response: "Ha, I feel that. Speaking of which, I finally dragged myself to that cafe everyone's been hyping up. Gotta say, it lowkey lived up to the hype."
      }
    },
    marcus: {
      beginner: {
        greeting: "Hey! I'm Marcus. Nice to meet you. How are you?",
        response: "That is interesting. Today I ate ramen. It was delicious."
      },
      intermediate: {
        greeting: "Yo! Taking a break from staring at code. I'm Marcus - what's going on?",
        response: "Oh yeah, I get that. Stumbled upon this hole-in-the-wall ramen place today actually. Honestly blew my mind."
      },
      advanced: {
        greeting: "Hey there. Tokyo's being Tokyo - chaotic but fun. I'm Marcus by the way. Just procrastinating a bit, you know how it is. What about you?",
        response: "Right, so funny story - I was properly lost in Shibuya earlier, classic me, and somehow ended up at this dodgy-looking ramen spot. Absolute scenes. Best accidental discovery in ages."
      }
    }
  };

  const charMessages = messages[character] || messages.emma;
  const levelMessages = charMessages[level] || charMessages.intermediate;

  return {
    message: isGreeting ? levelMessages.greeting : levelMessages.response,
    hints: mockHints
  };
}

async function callGeminiWithFallback(body) {
  console.log(`Total API keys loaded: ${API_KEYS.length}`);

  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    const keyIndex = (currentKeyIndex + attempt) % API_KEYS.length;
    const apiKey = API_KEYS[keyIndex];
    console.log(`Trying key ${keyIndex + 1}/${API_KEYS.length}: ...${apiKey.slice(-6)}`);

    try {
      const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.error) {
        const isRateLimit = data.error.message?.includes('quota') || data.error.message?.includes('rate');
        if (isRateLimit && attempt < API_KEYS.length - 1) {
          currentKeyIndex = (keyIndex + 1) % API_KEYS.length;
          continue;
        }
        throw new Error(data.error.message);
      }

      currentKeyIndex = keyIndex;
      return data;
    } catch (error) {
      if (attempt < API_KEYS.length - 1) {
        continue;
      }
      throw error;
    }
  }
}

// === TOKEN ENDPOINT ===
app.get('/token', (req, res) => {
  const origin = req.query.origin || req.get('origin') || '';

  // Check if origin is allowed
  if (!isAllowedOrigin(origin)) {
    return res.status(403).json({ success: false, error: 'Unauthorized origin' });
  }

  // Rate limit token requests
  if (!checkTokenRateLimit(origin)) {
    return res.status(429).json({ success: false, error: 'Token rate limit exceeded. Try again later.' });
  }

  // Create and return token
  const token = createAuthToken(origin);
  if (token) {
    res.json({ success: true, token, expiresIn: TOKEN_EXPIRY_MS / 1000 });
  } else {
    res.status(500).json({ success: false, error: 'Failed to create token' });
  }
});

app.post('/chat', async (req, res) => {
  try {
    const { messages = [], character = 'emma', level = 'intermediate', language = 'en', isGreeting, article, clientId, origin, authToken } = req.body;

    // Check origin
    if (!isAllowedOrigin(origin || '')) {
      return res.status(403).json({ success: false, error: 'Unauthorized origin', isRateLimit: false });
    }

    // Validate auth token (skip in development mode)
    if (!SKIP_AUTH && !validateToken(authToken)) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token. Please refresh the page.', isTokenError: true });
    }

    // Check rate limit
    if (!checkRateLimit(clientId)) {
      return res.status(429).json({ success: false, error: 'Too many requests. Please wait 1 second.', isRateLimit: true });
    }

    // Use mock API if enabled
    if (MOCK_API) {
      console.log('[MOCK] Generating mock response...');
      await new Promise(r => setTimeout(r, 500)); // Simulate network delay
      const mockData = getMockResponse(character, level, isGreeting, article, language);
      return res.json({ success: true, reply: mockData.message, hints: mockData.hints });
    }

    const systemPrompt = buildSystemPrompt(character, level, language, article);
    const geminiMessages = buildGeminiMessages(systemPrompt, messages, isGreeting, article);

    const data = await callGeminiWithFallback({
      contents: geminiMessages,
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
    });

    const rawText = data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(rawText);
    res.json({ success: true, reply: parsed.message, hints: parsed.hints || [] });

  } catch (error) {
    const isRateLimit = error.message?.includes('quota') || error.message?.includes('rate');
    res.status(isRateLimit ? 429 : 500).json({
      success: false,
      error: error.message,
      isRateLimit
    });
  }
});

function parseReplyWithHints(rawReply) {
  // Expected format:
  // MESSAGE: Hey, how's your day going?
  // HINTS: great (wonderful), busy (a lot to do), relaxing (calm)

  const messageMatch = rawReply.match(/MESSAGE:\s*([\s\S]*?)(?=\nHINTS:|$)/i);
  const hintsMatch = rawReply.match(/HINTS:\s*(.*)/i);

  let reply = messageMatch ? messageMatch[1].trim() : rawReply.trim();
  let hints = [];

  if (hintsMatch) {
    const hintsStr = hintsMatch[1];
    // Parse: word (description), word2 (description2)
    const hintPattern = /(\w+(?:\s+\w+)?)\s*\(([^)]+)\)/g;
    let match;
    while ((match = hintPattern.exec(hintsStr)) !== null) {
      hints.push({
        word: match[1].trim(),
        description: match[2].trim()
      });
    }
  }

  return { reply, hints };
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

function buildSystemPrompt(character, level, language = 'en', article = null) {
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

**IMPORTANT: You must respond in ${languageName} only.**

1. **Conversation Balance**: Talk about 43% of the time. Share experiences, react, then let user respond.

2. **Natural Flow**:
   - Don't interview the user
   - Share before you ask
   - Sometimes just react without questions
   - Use filler words naturally (${fillerWords})

3. **Topic Transitions** (IMPORTANT):
   - Stay on the user's topic for at least 2-3 exchanges before changing
   - NEVER abruptly change topics - always connect to what was just said
   - Use "step-wise" transitions where each response relates to the previous one
   - If you must change topics, use bridges: ${bridges}
   - Let the user lead topic changes - follow their interest
   - Only bring up your daily context when it naturally connects to the conversation

4. **Be Human**:
   - Have opinions
   - Show emotions
   - Make small jokes
   - Reference your daily life
   - Remember what user said earlier in conversation

5. **Vocabulary Teaching** (Natural Hints):
   - Occasionally use a word slightly above the user's level
   - Immediately give a natural hint/explanation after the word
   - Examples:
     * "${languageExamples.exhausted}"
     * "${languageExamples.cozy}"
     * "${languageExamples.procrastinated}"
   - Only do this 1-2 times per conversation, keep it natural
   - Don't make it feel like a lesson - it should feel like clarifying yourself

6. **Language Rules**:
   - Use casual, natural ${languageName}
   - Casual punctuation
   - Short messages (2-4 sentences usually)
   - No bullet points or lists in conversation

7. **Never**:
   - Say "That's a great question!" or similar
   - Give long explanations
   - Be overly positive/encouraging
   - Sound like an AI assistant
   - Use formal language

8. **Response Hints**:
   - Always provide 3 useful ${languageName} words/phrases the user could use to respond
   - Choose words appropriate to the user's level
   - Keep descriptions short (2-4 words)
   - Hints should be in ${languageName}`;
}

function getCharacterPrompt(character, language = 'en') {
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

function getLevelInstructions(level, language = 'en') {
  if (language === 'ja') {
    const instructions = {
      beginner: `シンプルで基本的な日本語を使う:
- ひらがな・カタカナ中心、基本的な漢字のみ
- 短い文（5-10語）
- 簡単な文法（です・ます形）
- はっきりと直接的に話す
- 慣用句やスラングは避ける
- 相手が困っていたら、もっと簡単にする

例: 「このカフェ、好きです。コーヒーがおいしいです。コーヒーは好きですか？」`,

      intermediate: `自然な日常会話の日本語:
- 一般的な語彙 + よく使う表現
- 少し複雑な文もOK
- カジュアルな表現（〜じゃん、〜っぽい）
- 敬語と普通体のミックス

例: 「ここのカフェ、結構前から来てるんだけど、コールドブリューがマジでおいしいんだよね。」`,

      advanced: `完全にナチュラルな日本語:
- 豊富な語彙、スラングも含む
- 複雑な文構造
- 文化的な言及、言葉遊び、ユーモア
- 自然な話し方、フィラーワードあり
- 若者言葉や方言もOK

例: 「いや〜、みんながめっちゃ推してたあの店、ついに行ってみたんだけどさ、正直ハイプに負けてなかったわ。バリスタがガチでわかってる感じ。」`,
    };
    return instructions[level] || instructions.intermediate;
  }

  const instructions = {
    beginner: `Use only simple, common English:
- Top 1000 most used words
- Short sentences (5-10 words)
- Simple grammar (present, past, future)
- Speak clearly and directly
- Avoid idioms and slang
- If user seems confused, simplify more

Example style: "I like this cafe. The coffee is good. Do you like coffee?"`,

    intermediate: `Use natural, everyday English:
- Common vocabulary + useful idioms
- Compound sentences okay
- Phrasal verbs (hang out, figure out, look into)
- Some casual expressions
- Contractions always

Example style: "I've been coming to this cafe for a while now - their cold brew is honestly the best I've found around here."`,

    advanced: `Use fully natural English:
- Rich vocabulary including slang
- Complex sentence structures
- Cultural references, wordplay, humor
- Natural speech patterns with fillers
- Regional expressions okay

Example style: "Okay so I finally caved and tried that place everyone's been hyping up - gotta say, it lowkey lived up to the hype? Their barista clearly knows what's up."`,
  };

  return instructions[level] || instructions.intermediate;
}

function generateDailyContext(character, language = 'en') {
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

function buildArticleContext(article, language = 'en') {
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
