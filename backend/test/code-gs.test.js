// Code.gs is a plain Apps Script file, so it can run in a sandbox with the Apps Script globals it touches at load
// time stubbed. server.js can't be loaded in tests (it starts a timer and a server); rules-sync.test.js checks that
// the two share the same rules and Taiwan Mandarin prompts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function loadCodeGs() {
  const sandbox = {
    console: { log() {}, error() {} },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => '' }) },
  };
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(new URL('../Code.gs', import.meta.url), 'utf8') + `
    ;globalThis.gs = { VALID_CHARACTERS, getSentenceCheckSchema, getChatSummarySchema, getFeedbackResponseSchema,
      getDiaryFeedbackSchema, validateChatSummaryInput, buildSystemPrompt, buildFeedbackPrompt, buildSentenceCheckPrompt,
      buildChatSummaryPrompt, buildDiaryFeedbackPrompt };`, sandbox);
  return sandbox.gs;
}

const gs = loadCodeGs();
const EN_TYPES = ['article', 'tense', 'third-person-s', 'plural', 'connector', 'word-choice', 'other'];
const ZH_TYPES = ['measure-word', 'aspect', 'word-order', 'de-particle', 'word-choice', 'other'];
// Simplified-only characters that used to appear in the Chinese rules (学习, 口语/书面语, 量词, 了/过/着)
const SIMPLIFIED = /[学习语书词过着]/;

const enums = language => [
  gs.getSentenceCheckSchema(language).properties.errorType.enum,
  gs.getChatSummarySchema(language).properties.points.items.properties.type.enum,
  gs.getFeedbackResponseSchema(language).properties.grammar.properties.correctionTypes.items.enum,
  gs.getDiaryFeedbackSchema(language).properties.corrections.items.properties.type.enum,
];

test('every schema enum uses the error types of the target language', () => {
  for (const list of enums('en')) assert.deepEqual([...list], EN_TYPES);
  for (const list of enums('zh')) assert.deepEqual([...list], ZH_TYPES);
});

test('chat-summary accepts a missing or supported language and rejects anything else', () => {
  const messages = [{ role: 'user', content: '我要一個咖啡' }];
  assert.equal(gs.validateChatSummaryInput(messages, [], 'beginner', 'en', undefined), '');
  assert.equal(gs.validateChatSummaryInput(messages, [], 'beginner', 'en', 'zh'), '');
  assert.equal(gs.validateChatSummaryInput(messages, [], 'beginner', 'en', 'fr'), 'Invalid language');
});

test('the Taiwan friends are valid characters with their own persona, day and beginner level', () => {
  assert.ok(gs.VALID_CHARACTERS.includes('meiling') && gs.VALID_CHARACTERS.includes('zhiwei'));
  const meiling = gs.buildSystemPrompt('meiling', 'beginner', 'zh');
  assert.match(meiling, /林美玲/);
  assert.match(meiling, /TOCFL A1-A2/);
  assert.match(meiling, /Traditional characters \(繁體字\) only/);
  assert.match(gs.buildSystemPrompt('zhiwei', 'beginner', 'zh'), /陳志偉.*Tainan/);
});

test('English chat prompts carry none of the Taiwan Mandarin rules', () => {
  const emma = gs.buildSystemPrompt('emma', 'beginner', 'en');
  assert.doesNotMatch(emma, /Taiwan|繁體/);
  assert.match(emma, /Respond in English only/);
});

test('Chinese message feedback keeps the ASCII-quoted correction format and Mandarin error focus', () => {
  const text = gs.buildFeedbackPrompt('我要一個書', [], 'beginner', 'zh', 'en')[0].parts[0].text;
  assert.match(text, /"<original words>" → "<corrected words>" — <brief explanation in English>/);
  assert.match(text, /ASCII double quotes/);
  assert.match(text, /Measure words/);
  assert.doesNotMatch(text, /Mandarin speakers/);
});

test('Chinese sentence check and chat summary prompts are written for Taiwan Mandarin learners', () => {
  const check = gs.buildSentenceCheckPrompt('我要一杯咖啡', '我要…', 'I want…', '', 'beginner', 'en', 'zh');
  const summary = gs.buildChatSummaryPrompt([{ role: 'user', content: '我要一個咖啡' }], [], 'beginner', 'en', 'zh');
  for (const prompt of [check, summary]) {
    assert.match(prompt, /learner of Taiwan Mandarin whose native language is English/);
    assert.doesNotMatch(prompt, /English-speaking friend|Common errors for Mandarin speakers/);
  }
  assert.match(summary, /copied character for character/);
});

test('English sentence check and chat summary prompts are unchanged by the language field', () => {
  const args = ['I like it', 'I like …', '', '', 'beginner', 'zh'];
  assert.equal(gs.buildSentenceCheckPrompt(...args, 'en'), gs.buildSentenceCheckPrompt(...args));
  assert.match(gs.buildSentenceCheckPrompt(...args, 'en'), /^You are a friendly English-speaking friend/);
});

test('Chinese diary rules use Traditional characters and Chinese error types', () => {
  const prompt = gs.buildDiaryFeedbackPrompt('meiling', 'beginner', 'zh', 'en', 0);
  const rules = prompt.slice(prompt.indexOf('## Language-Specific Rules'), prompt.indexOf('## Feedback Rules'));
  assert.match(rules, /學習.*口語.*書面語.*量詞.*了\/過\/著/s);
  assert.doesNotMatch(rules, SIMPLIFIED);
  assert.match(prompt, /type: the error kind \(measure-word, aspect, word-order, de-particle, word-choice, other\)/);
});
