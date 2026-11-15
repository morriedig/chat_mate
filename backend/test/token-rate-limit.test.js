// GET ?action=token in Code.gs, run in a vm sandbox with an in-memory CacheService and a controllable clock.
// server.js can't be loaded in tests (see code-gs.test.js); it carries the same limits.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ORIGIN = 'https://morriedig.github.io';
const START = Date.UTC(2026, 10, 15, 0, 0, 0); // on a 10-minute boundary

function loadCodeGs() {
  const store = new Map();
  const clock = { now: START };
  let uuid = 0;
  const sandbox = {
    clock,
    console: { log() {}, error() {} },
    PropertiesService: { getScriptProperties: () => ({ getProperty: name => (name === 'ALLOWED_ORIGINS' ? ORIGIN : '') }) },
    CacheService: {
      getScriptCache: () => ({
        get: key => (store.has(key) ? store.get(key) : null),
        getAll: keys => Object.fromEntries(keys.filter(k => store.has(k)).map(k => [k, store.get(k)])),
        put: (key, value) => store.set(key, value),
        putAll: values => Object.entries(values).forEach(([k, v]) => store.set(k, v)),
      }),
    },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
    Utilities: { getUuid: () => `uuid-${++uuid}` },
    ContentService: {
      MimeType: { JSON: 'json' },
      createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }),
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(new URL('../Code.gs', import.meta.url), 'utf8') + `
    ;Date.now = () => clock.now;
    globalThis.gs = { doGet, validateToken };`, sandbox);
  const requestToken = clientId => sandbox.gs.doGet({
    parameter: { action: 'token', origin: ORIGIN, ...(clientId === undefined ? {} : { clientId }) },
  });
  return { requestToken, clock, gs: sandbox.gs };
}

test('two clients on the same origin both get a token within the same minute', () => {
  const { requestToken, gs } = loadCodeGs();
  const a = requestToken('client_a');
  const b = requestToken('client_b');
  assert.equal(a.success, true);
  assert.equal(b.success, true);
  assert.equal(b.expiresIn, 3600);
  assert.equal(gs.validateToken(b.token), true);
});

test('the same client is limited within 10 seconds and allowed again after', () => {
  const { requestToken, clock } = loadCodeGs();
  assert.equal(requestToken('client_a').success, true);
  clock.now += 9999;
  assert.deepEqual({ ...requestToken('client_a') }, { success: false, error: 'Token rate limit exceeded. Try again later.' });
  clock.now += 1;
  assert.equal(requestToken('client_a').success, true);
});

test('requests without a valid clientId share the old one-per-minute origin limit', () => {
  const { requestToken, clock } = loadCodeGs();
  assert.equal(requestToken(undefined).success, true);
  assert.equal(requestToken('').success, false);
  assert.equal(requestToken('x'.repeat(257)).success, false);
  clock.now += 59999;
  assert.equal(requestToken(undefined).success, false);
  assert.equal(requestToken('client_a').success, true); // clients with an id aren't held back by old ones
  clock.now += 1;
  assert.equal(requestToken(undefined).success, true);
});

test('at most 300 tokens are issued across all clients per 10 minutes', () => {
  const { requestToken, clock } = loadCodeGs();
  for (let i = 0; i < 300; i++) assert.equal(requestToken(`client_${i}`).success, true);
  assert.equal(requestToken('client_new').success, false);
  assert.equal(requestToken(undefined).success, false);
  clock.now += 600000;
  assert.equal(requestToken('client_new').success, true);
});

test('server.js uses the same token limits and passes clientId from the query', () => {
  const read = name => readFileSync(new URL('../' + name, import.meta.url), 'utf8');
  const limits = text => text.match(/^const TOKEN_(CLIENT_WINDOW_MS|ORIGIN_WINDOW_MS|GLOBAL_LIMIT|GLOBAL_WINDOW_MS) = \d+;/gm);
  const server = read('server.js');
  assert.equal(limits(server).length, 4);
  assert.deepEqual(limits(server), limits(read('Code.gs')));
  assert.match(server, /checkTokenRateLimit\(origin, req\.query\.clientId\)/);
});

test('a clientId outside [A-Za-z0-9_-] falls back to the origin limit', () => {
  const { requestToken } = loadCodeGs();
  assert.equal(requestToken('客戶端甲').success, true); // first token for the origin key
  assert.equal(requestToken('客戶端乙').success, false); // same origin key, within the minute
  assert.equal(requestToken('client_ok-1').success, true)
});
