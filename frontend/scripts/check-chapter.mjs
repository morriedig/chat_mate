// Checks one weekly intermediate chapter before it ships (see docs/plans/weekly-chapter.md).
// Usage (from frontend/): node scripts/check-chapter.mjs src/data/chapters/en/intermediate/NN-slug.yml
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
const require = createRequire(path.resolve('package.json'))
const yaml = require('js-yaml')
const file = process.argv[2]
if (!file) { console.error("usage: node scripts/check-chapter.mjs <path/to/NN-slug.yml>"); process.exit(2) }
const dir = path.dirname(file)
const errs = []
const orders = new Map(), metaIds = new Map()
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.yml'))) {
  const d = yaml.load(fs.readFileSync(path.join(dir, f), 'utf8'))
  if (orders.has(d.meta.order)) errs.push(`duplicate order ${d.meta.order}: ${f} / ${orders.get(d.meta.order)}`)
  orders.set(d.meta.order, f)
  if (metaIds.has(d.meta.id)) errs.push(`duplicate meta.id ${d.meta.id}`)
  metaIds.set(d.meta.id, f)
}
const src = fs.readFileSync(file, 'utf8')
const d = yaml.load(src)
const L = ['en', 'ja', 'zh']
const tri = (o, where) => L.forEach(l => { if (typeof o?.[l] !== 'string' || !o[l].trim()) errs.push(`${where}.${l} missing`) })
const m = d.meta
if (!m?.id || !/^[a-z0-9-]+$/.test(m.id)) errs.push('meta.id missing/invalid')
tri(m.title, 'meta.title'); tri(m.description, 'meta.description')
if (m.level !== 'intermediate') errs.push('meta.level must be intermediate')
if (!Number.isInteger(m.order)) errs.push('meta.order must be an integer')
if (!/^[a-z][a-z0-9_]*$/.test(m.icon || '')) errs.push('meta.icon must be a Material Symbols name')
const nn = path.basename(file).match(/^(\d\d)-[a-z0-9-]+\.yml$/)
if (!nn || Number(nn[1]) !== m.order) errs.push('file name must be NN-slug.yml with NN == meta.order')
const ids = new Set()
for (const [i, w] of (d.words || []).entries()) {
  const at = `words[${i}](${w.id})`
  if (!w.id || ids.has(w.id)) errs.push(`${at} id missing/duplicate`); ids.add(w.id)
  tri(w.word, `${at}.word`); tri(w.description, `${at}.description`); tri(w.sentence, `${at}.sentence`)
  if (!w.reading) errs.push(`${at}.reading missing`)
  if (!/^\/.+\/$/.test(w.phonetic || '')) errs.push(`${at}.phonetic must be /IPA/`)
}
if ((d.words || []).length < 12) errs.push(`only ${(d.words || []).length} words (aim 14-18)`)
const convIds = new Set()
for (const c of d.chat?.conversations || []) {
  if (!c.id || convIds.has(c.id) || ids.has(c.id)) errs.push(`conversation id ${c.id} missing/duplicate`); convIds.add(c.id)
  tri(c.title, `conv ${c.id}.title`)
  c.messages.forEach((msg, j) => { if (!['partner', 'user'].includes(msg.role)) errs.push(`conv ${c.id}[${j}] bad role`); tri(msg.text, `conv ${c.id}[${j}].text`) })
}
if ((d.chat?.conversations || []).length < 3) errs.push('need 3 conversations')
const q = d.quiz
if (!Number.isInteger(q?.questionsPerRound) || !Number.isInteger(q?.xpReward)) errs.push('quiz.questionsPerRound/xpReward missing')
const base = t => String(t || '').replace(/\s*\(.*?\)\s*/g, ' ').trim().toLowerCase()
const wordSet = new Set((d.words || []).map(w => base(w.word.en)))
for (const [i, c] of (q?.cloze || []).entries()) {
  if ((c.sentence.match(/___/g) || []).length !== 1) errs.push(`cloze[${i}] needs exactly one ___`)
  if (!c.options?.includes(c.answer)) errs.push(`cloze[${i}] answer not in options`)
  if (new Set(c.options).size !== c.options?.length || c.options?.length !== 4) errs.push(`cloze[${i}] needs 4 distinct options`)
  if (!wordSet.has(String(c.answer).toLowerCase())) errs.push(`cloze[${i}] answer "${c.answer}" matches no word.en`)
  tri(c.explain, `cloze[${i}].explain`)
}
if ((q?.cloze || []).length < 6) errs.push('need at least 6 cloze questions')
// Common simplified-only characters: zh must be Taiwan Traditional Chinese
const zhText = JSON.stringify(d, (k, v) => v).match(/"zh":"(?:[^"\\]|\\.)*"/g) || []
const simp = zhText.join('').match(/[们这说时对会过还没为发经么样见现点问题开关买卖东车门长让请谢认识应该进头钱觉学习听读写语处据报]/g)
if (simp) errs.push(`simplified Chinese in zh: ${[...new Set(simp)].join(' ')}`)
const emoji = src.match(/\p{Extended_Pictographic}/gu)
if (emoji) errs.push(`emoji found: ${[...new Set(emoji)].join(' ')}`)
console.log(errs.length ? 'FAIL\n- ' + errs.join('\n- ') : `OK ${m.id}: ${d.words.length} words, ${d.chat.conversations.length} conversations, ${q.cloze.length} cloze`)
process.exit(errs.length ? 1 : 0)
