import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = name => readFileSync(new URL('../' + name, import.meta.url), 'utf8');
const between = (text, start, end) => {
  const from = text.indexOf(start);
  const to = text.indexOf(end, from);
  assert.ok(from !== -1 && to !== -1, `markers "${start}" … "${end}" not found`);
  return text.slice(from, to + end.length);
};

const rules = read('lib/rules.js');
const server = read('server.js');
const codeGs = read('Code.gs');

test('Code.gs carries the shared rules from lib/rules.js word for word (without export)', () => {
  const start = '// === SHARED RULES (keep in sync with backend/lib/rules.js) ===';
  const end = '// === END SHARED RULES ===';
  assert.equal(between(codeGs, start, end), between(rules, start, end).replace(/^export /gm, ''));
});

test('server.js and Code.gs have the same Taiwan Mandarin prompts', () => {
  const start = '// === TAIWAN MANDARIN PROMPTS (identical in server.js and Code.gs) ===';
  const end = '// === END TAIWAN MANDARIN PROMPTS ===';
  assert.equal(between(codeGs, start, end), between(server, start, end));
});

test('server.js uses lib/rules.js instead of its own copies', () => {
  assert.match(server, /from '\.\/lib\/rules\.js'/);
  for (const name of ['function normalizeForCompare', 'function sanitizeRepeatTomorrow', 'ERROR_TYPES =', 'VALID_LANGUAGES =']) {
    assert.ok(!server.includes(name), `server.js still defines ${name}`);
  }
});
