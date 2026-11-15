// Pure rules shared by server.js and Code.gs.
// Code.gs can't import, so it carries a copy of everything between the markers below with `export ` removed;
// backend/test/rules-sync.test.js fails when the two drift apart.

// === SHARED RULES (keep in sync with backend/lib/rules.js) ===
export var VALID_LANGUAGES = ['en', 'ja', 'zh'];

// Every correction is tagged so the app can bring a learner's most common error kinds back for review more often
export var ERROR_TYPES = ['article', 'tense', 'third-person-s', 'plural', 'connector', 'word-choice', 'other'];
export var ERROR_TYPE_DESCRIPTION = 'Error kind: article (a/an/the), tense (verb tense or verb form), third-person-s (he/she/it verb without -s), plural (plurals or countability), connector (linking words, e.g. sentence-initial So/And/But, a fragment starting with Because, "Although ... but"), word-choice (wrong or unnatural word or collocation), other';

// Learners of Mandarin get their own kinds
export var ZH_ERROR_TYPES = ['measure-word', 'aspect', 'word-order', 'de-particle', 'word-choice', 'other'];
export var ZH_ERROR_TYPE_DESCRIPTION = 'Error kind: measure-word (missing or wrong measure word, e.g. 一個書 → 一本書), aspect (了/過/著 missing, extra or in the wrong place), word-order (time, place or other parts in the wrong position, e.g. 我吃飯在家 → 我在家吃飯), de-particle (的/得/地 mixed up, e.g. 跑的很快 → 跑得很快), word-choice (wrong or unnatural word, including a Mainland word where Taiwan uses another), other';

// The error kinds for a target language; English's list for every language without its own
export function getErrorTypes(language) {
  return language === 'zh' ? ZH_ERROR_TYPES : ERROR_TYPES;
}

export function getErrorTypeDescription(language) {
  return language === 'zh' ? ZH_ERROR_TYPE_DESCRIPTION : ERROR_TYPE_DESCRIPTION;
}

// Optional `language` request field: missing means English; returns '' when the value isn't supported
export function resolveLanguage(value) {
  if (value === undefined || value === null) return 'en';
  return typeof value === 'string' && VALID_LANGUAGES.indexOf(value) !== -1 ? value : '';
}

export var REPEAT_TOMORROW_MAX_CHARS = 300;

// Chinese has no spaces between words: keep Han characters, letters and digits, drop punctuation and spaces.
// Everything else keeps the English rule (letters, digits, apostrophes, single spaces).
export function normalizeForCompare(text, language) {
  if (language === 'zh') {
    return String(text || '').normalize('NFKC').toLowerCase().replace(/[^㐀-䶿一-鿿a-z0-9]+/g, '');
  }
  return String(text || '').toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

// Keep repeatTomorrow only when it is the learner's own sentence and the cue doesn't give the answer away
export function sanitizeRepeatTomorrow(item, messages, knownIds, language) {
  var off = { enabled: false, original: '', target: '', cue: '', hint: '', patternId: '' };
  if (!item || typeof item !== 'object' || item.enabled !== true) return off;
  var fields = ['original', 'target', 'cue', 'hint'];
  for (var i = 0; i < fields.length; i++) {
    var value = item[fields[i]];
    if (typeof value !== 'string' || value.length > REPEAT_TOMORROW_MAX_CHARS) return off;
  }
  var original = item.original.trim();
  var target = item.target.trim();
  var cue = item.cue.trim();
  if (!original || !target || !cue) return off;
  var normalOriginal = normalizeForCompare(original, language);
  // A Chinese sentence with no Chinese left in it can't be matched against the chat
  if (language === 'zh' && !normalOriginal) return off;
  var learnerText = normalizeForCompare(messages.filter(function(m) { return m.role === 'user'; }).map(function(m) { return m.content; }).join(' \n '), language);
  if (learnerText.indexOf(normalOriginal) === -1) return off;
  var normalTarget = normalizeForCompare(target, language);
  if (normalTarget && (normalizeForCompare(cue, language).indexOf(normalTarget) !== -1 || normalizeForCompare(item.hint, language).indexOf(normalTarget) !== -1)) return off;
  var patternId = typeof item.patternId === 'string' && knownIds.indexOf(item.patternId) !== -1 ? item.patternId : '';
  return { enabled: true, original: original, target: target, cue: cue, hint: item.hint.trim(), patternId: patternId };
}
// === END SHARED RULES ===
