/**
 * Chat Mate - Google Apps Script Backend
 *
 * This script handles:
 * 1. Proxying requests to Gemini API (hides API key)
 * 2. Building system prompts for characters
 * 3. Saving conversations to Google Sheets
 */

// === CONFIGURATION ===
// Set your Gemini API keys in Script Properties:
// File > Project Settings > Script Properties > Add: GEMINI_API_KEYS = key1,key2
const GEMINI_API_KEYS = (PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEYS') || '').split(',').filter(k => k.trim());
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
let currentKeyIndex = 0;

// === MAIN ENDPOINT ===
// Note: Google Apps Script handles CORS automatically for web apps deployed with "Anyone" access

// Handle GET requests (for testing the endpoint)
function doGet(e) {
  return createResponse({
    success: true,
    message: 'Chat Mate API is running. Use POST to send messages.',
    keys: GEMINI_API_KEYS.length
  });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { messages, character, level, isGreeting } = data;

    // Build system prompt
    const systemPrompt = buildSystemPrompt(character, level);

    // Build conversation for Gemini
    const geminiMessages = buildGeminiMessages(systemPrompt, messages, isGreeting);

    // Call Gemini API
    const reply = callGemini(geminiMessages);

    // Return response
    return createResponse({ success: true, reply });

  } catch (error) {
    return createResponse({ success: false, error: error.message });
  }
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// === GEMINI API ===
function callGemini(messages) {
  const payload = {
    contents: messages,
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 256,
      topP: 0.95,
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

  // Try each API key until one works
  let lastError = null;
  for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
    const keyIndex = (currentKeyIndex + i) % GEMINI_API_KEYS.length;
    const apiKey = GEMINI_API_KEYS[keyIndex].trim();

    try {
      const response = UrlFetchApp.fetch(`${GEMINI_URL}?key=${apiKey}`, options);
      const result = JSON.parse(response.getContentText());

      if (result.error) {
        lastError = result.error.message;
        // Check if rate limited
        if (result.error.code === 429 || result.error.message.includes('quota') || result.error.message.includes('rate')) {
          currentKeyIndex = (keyIndex + 1) % GEMINI_API_KEYS.length;
          continue;
        }
        throw new Error(result.error.message);
      }

      return result.candidates[0].content.parts[0].text;
    } catch (e) {
      lastError = e.message;
      // If it's a quota/rate error, try next key
      if (e.message.includes('quota') || e.message.includes('rate') || e.message.includes('429')) {
        currentKeyIndex = (keyIndex + 1) % GEMINI_API_KEYS.length;
        continue;
      }
      // For other errors, throw immediately
      throw e;
    }
  }

  throw new Error(lastError || 'All API keys failed. Please try again later.');
}

function buildGeminiMessages(systemPrompt, messages, isGreeting) {
  const geminiMessages = [];

  // System prompt as first user message (Gemini doesn't have system role)
  geminiMessages.push({
    role: 'user',
    parts: [{ text: systemPrompt + '\n\n---\nStart the conversation now.' }]
  });

  // Add fake model acknowledgment
  geminiMessages.push({
    role: 'model',
    parts: [{ text: 'Got it! I\'ll stay in character.' }]
  });

  if (isGreeting) {
    // For initial greeting, ask AI to start
    geminiMessages.push({
      role: 'user',
      parts: [{ text: '[System: The user just started a conversation. Send a natural greeting based on your character and today\'s context.]' }]
    });
  } else {
    // Add conversation history
    for (const msg of messages) {
      geminiMessages.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }
  }

  return geminiMessages;
}

// === SYSTEM PROMPTS ===
function buildSystemPrompt(character, level) {
  const characterPrompt = getCharacterPrompt(character);
  const levelInstructions = getLevelInstructions(level);
  const dailyContext = generateDailyContext(character);

  return `${characterPrompt}

---

## Today's Context
${dailyContext}

---

## Language Level: ${level.toUpperCase()}
${levelInstructions}

---

## Core Behavior

1. **Conversation Balance**: Talk about 43% of the time. Share experiences, react, then let user respond.

2. **Natural Flow**:
   - Don't interview the user
   - Share before you ask
   - Sometimes just react without questions
   - Use filler words naturally (like, you know, actually, honestly)

3. **Be Human**:
   - Have opinions
   - Show emotions
   - Make small jokes
   - Reference your daily life
   - Remember what user said earlier in conversation

4. **Language Rules**:
   - Use contractions (I'm, don't, gonna)
   - Casual punctuation
   - Short messages (2-4 sentences usually)
   - No bullet points or lists in conversation

5. **Never**:
   - Say "That's a great question!"
   - Give long explanations
   - Be overly positive/encouraging
   - Sound like an AI assistant
   - Use formal language`;
}

function getCharacterPrompt(character) {
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

function getLevelInstructions(level) {
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

function generateDailyContext(character) {
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
  const randomIndex = Math.floor(Math.random() * characterContexts.length);
  return characterContexts[randomIndex];
}

// === TEST FUNCTION ===
function testPrompt() {
  const prompt = buildSystemPrompt('emma', 'intermediate');
}
