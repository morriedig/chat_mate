import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  VALID_LANGUAGES, ERROR_TYPES, getErrorTypes, getErrorTypeDescription,
  resolveLanguage, normalizeForCompare, sanitizeRepeatTomorrow,
} from '../lib/rules.js';

// The English rule as it was before languages were added
const legacyNormalize = text => String(text || '').toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();

test('resolveLanguage defaults to English and rejects unsupported values', () => {
  assert.equal(resolveLanguage(undefined), 'en');
  assert.equal(resolveLanguage(null), 'en');
  for (const language of VALID_LANGUAGES) assert.equal(resolveLanguage(language), language);
  for (const bad of ['fr', '', 'EN', 1, {}]) assert.equal(resolveLanguage(bad), '');
});

test('English keeps its 7 error types; Chinese has its own 6', () => {
  assert.deepEqual(getErrorTypes('en'), ['article', 'tense', 'third-person-s', 'plural', 'connector', 'word-choice', 'other']);
  assert.deepEqual(getErrorTypes('zh'), ['measure-word', 'aspect', 'word-order', 'de-particle', 'word-choice', 'other']);
  assert.match(getErrorTypeDescription('en'), /^Error kind: article \(a\/an\/the\)/);
  assert.match(getErrorTypeDescription('zh'), /measure-word .*aspect .*了\/過\/著.*word-order .*de-particle .*的\/得\/地/);
});

test('languages without their own error types use the English list', () => {
  assert.equal(getErrorTypes('ja'), ERROR_TYPES);
  assert.equal(getErrorTypes(undefined), ERROR_TYPES);
  assert.equal(getErrorTypeDescription('ja'), getErrorTypeDescription('en'));
});

test('normalizeForCompare gives the same English output as before for every non-Chinese language', () => {
  const samples = ['Yesterday, I GO to the office!', "I'm  here...\nreally", '  Café — naïve 42 ', '我要一杯珍奶', '', null];
  for (const language of [undefined, 'en', 'ja']) {
    for (const text of samples) assert.equal(normalizeForCompare(text, language), legacyNormalize(text));
  }
});

test('normalizeForCompare keeps Chinese characters and drops punctuation and spaces', () => {
  assert.equal(normalizeForCompare('我要一杯珍奶！', 'zh'), '我要一杯珍奶');
  assert.equal(normalizeForCompare('你好， 我是 Amy。', 'zh'), '你好我是amy');
  assert.equal(normalizeForCompare('「一杯」１００元', 'zh'), '一杯100元');
  assert.equal(normalizeForCompare('？！。，', 'zh'), '');
});

const enMessages = [{ role: 'user', content: 'Yesterday I go to the office.' }, { role: 'assistant', content: 'Oh nice' }];
const enItem = extra => ({ enabled: true, original: ' Yesterday I go to the office ', target: 'Yesterday I went to the office', cue: 'Say where you went yesterday', hint: 'past', patternId: 'p1', ...extra });

test('English repeatTomorrow: the learner\'s own sentence is kept and unknown pattern ids are dropped', () => {
  assert.deepEqual(sanitizeRepeatTomorrow(enItem({}), enMessages, ['p1']), {
    enabled: true, original: 'Yesterday I go to the office', target: 'Yesterday I went to the office', cue: 'Say where you went yesterday', hint: 'past', patternId: 'p1',
  });
  assert.equal(sanitizeRepeatTomorrow(enItem({ patternId: 'zz' }), enMessages, ['p1']).patternId, '');
});

test('English repeatTomorrow is turned off when it is not the learner\'s or the cue gives the target away', () => {
  assert.equal(sanitizeRepeatTomorrow(enItem({ original: 'Oh nice' }), enMessages, []).enabled, false);
  assert.equal(sanitizeRepeatTomorrow(enItem({ cue: 'Say: yesterday I went to the office!' }), enMessages, []).enabled, false);
});

const zhMessages = [{ role: 'user', content: '我要一個咖啡，謝謝。' }, { role: 'assistant', content: '好喔，要冰的嗎？' }];
const zhItem = extra => ({ enabled: true, original: '我要一個咖啡', target: '我要一杯咖啡', cue: 'Order one coffee at a café', hint: 'Watch the measure word for drinks', patternId: '', ...extra });

test('Chinese repeatTomorrow keeps the learner\'s sentence even when its punctuation differs', () => {
  const result = sanitizeRepeatTomorrow(zhItem({ original: '我要一個咖啡！' }), zhMessages, [], 'zh');
  assert.equal(result.enabled, true);
  assert.equal(result.target, '我要一杯咖啡');
});

test('Chinese repeatTomorrow is turned off for a sentence the learner never wrote', () => {
  // The friend said this one; before languages were handled, Chinese normalized to "" and always matched
  assert.equal(sanitizeRepeatTomorrow(zhItem({ original: '要冰的嗎' }), zhMessages, [], 'zh').enabled, false);
});

test('Chinese repeatTomorrow is turned off when the cue or hint contains the target', () => {
  assert.equal(sanitizeRepeatTomorrow(zhItem({ cue: 'Say 「我要一杯咖啡。」' }), zhMessages, [], 'zh').enabled, false);
  assert.equal(sanitizeRepeatTomorrow(zhItem({ hint: '我要 一杯 咖啡' }), zhMessages, [], 'zh').enabled, false);
});

test('Chinese repeatTomorrow is turned off when original has no Chinese left to match', () => {
  assert.equal(sanitizeRepeatTomorrow(zhItem({ original: '...!' }), zhMessages, [], 'zh').enabled, false);
});
