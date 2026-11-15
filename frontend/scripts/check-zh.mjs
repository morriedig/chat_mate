// Checks for the Taiwan Mandarin content (chapters/zh/** and daily/zh/**).
// Called from check-chapter.mjs when the path is under a zh folder:
//   node scripts/check-chapter.mjs src/data/chapters/zh/beginner/01-self-introduction.yml
//   node scripts/check-chapter.mjs src/data/chapters/zh/foundation/pinyin-01-tones.yml
//   node scripts/check-chapter.mjs src/data/daily/zh/beginner/patterns.yml
//   node scripts/check-chapter.mjs src/data/daily/zh/beginner/vocab.yml
// Pinyin rules: tone marks (not numbers), one syllable per space-separated
// token, punctuation may stick to a syllable. The number of syllables must
// equal the number of Chinese characters (plus Latin/digit runs such as A, B).
import fs from 'node:fs'
import path from 'node:path'

// Common Simplified-only characters. Characters that are also normal in
// Traditional text (台 后 里 干 面 只 才 系 准 云 …) are left out on purpose.
const SIMPLIFIED = '们这说过还时间对没请问门车东馆买卖见长发书学习会为经么样现点题开关让谢认识应该进头钱觉听读写语处据报个吗妈马骂飞饭绿爱谁猫号边远运动热块钟医药员电脑话银转错给红条楼层厅厨卫带饮几儿两岁国湾体气节园图华业务从与专丢并当着冲师乐欢视软网线机场铁汇约达迟难帮种颜单双录饱饿锅鸡鱼汤饺盐酱凉温冻烫顾试户缴费厕卧阳邻灯净脏旧换坏疗烦烧咙实张诊挂预针伤肿痒复检验结帐账扫码积赠优选择总计现钞营闹丽亲爷孙妇联属区县乡镇谓离满宽轻紧简页归来亚尔罗欧广产厂压历杂护礼览势际庆齐黄盘炉庙签证讯'
const SIMPLIFIED_RE = new RegExp(`[${[...new Set(SIMPLIFIED)].join('')}]`, 'g')

const HAN = /\p{Script=Han}/gu
const LATIN_RUN = /[A-Za-z0-9]+/g
const TONE = { ā: 'a', á: 'a', ǎ: 'a', à: 'a', ē: 'e', é: 'e', ě: 'e', è: 'e', ī: 'i', í: 'i', ǐ: 'i', ì: 'i', ō: 'o', ó: 'o', ǒ: 'o', ò: 'o', ū: 'u', ú: 'u', ǔ: 'u', ù: 'u', ǖ: 'ü', ǘ: 'ü', ǚ: 'ü', ǜ: 'ü' }
const SYLLABLE = /^(zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?(iang|iong|uang|ueng|iao|ian|uai|uan|üan|ang|eng|ing|ong|ai|ei|ao|ou|an|en|in|un|ün|ia|ie|iu|ua|uo|ui|ue|üe|er|a|o|e|i|u|ü)$/
const PUNCT_EDGE = /^[\s,.?!;:"'“”‘’()（）「」『』、，。？！；：…—-]+|[\s,.?!;:"'“”‘’()（）「」『』、，。？！；：…—-]+$/g

function isText(v) { return typeof v === 'string' && v.trim().length > 0 }

/** Units that need one pinyin token each: Han characters + Latin/digit runs. */
export function syllableUnits(zh) {
  const s = String(zh || '')
  return (s.match(HAN) || []).length + (s.match(LATIN_RUN) || []).length
}

/** Check one pinyin token: valid syllable and tone mark in the right place. */
export function syllableProblem(token) {
  const lower = token.toLowerCase()
  if (/^[a-z0-9]+$/i.test(token) && /[A-Z0-9]/.test(token) && token.length <= 3 && !SYLLABLE.test(lower)) return null // placeholder like A / B
  const marks = [...lower].filter(c => TONE[c])
  if (marks.length > 1) return `"${token}" has ${marks.length} tone marks`
  if (/[1-5]/.test(lower)) return `"${token}" uses tone numbers`
  const base = [...lower].map(c => TONE[c] || c).join('').replace(/v/g, 'ü')
  if (!SYLLABLE.test(base)) return `"${token}" is not a pinyin syllable`
  if (marks.length === 1) {
    const i = [...lower].findIndex(c => TONE[c])
    let want
    if (base.includes('a')) want = base.indexOf('a')
    else if (base.includes('e')) want = base.indexOf('e')
    else if (base.includes('ou')) want = base.indexOf('o')
    else want = Math.max(...['i', 'o', 'u', 'ü'].map(v => base.lastIndexOf(v)))
    if (i !== want) return `"${token}" has the tone mark on the wrong vowel`
  }
  return null
}

/** Compare a Chinese string with its pinyin; returns a list of problems. */
export function pinyinProblems(zh, pinyin) {
  if (!isText(pinyin)) return ['pinyin missing']
  const tokens = pinyin.split(/\s+/).map(t => t.replace(PUNCT_EDGE, '')).filter(Boolean)
  const out = []
  for (const t of tokens) { const p = syllableProblem(t); if (p) out.push(p) }
  const want = syllableUnits(zh)
  if (tokens.length !== want) out.push(`pinyin has ${tokens.length} syllables but "${zh}" needs ${want}`)
  return out
}

export function simplifiedIn(text) {
  return [...new Set(String(text || '').match(SIMPLIFIED_RE) || [])]
}

function checkChapter(file, d, src, yaml, errs) {
  const isFoundation = /\/foundation\//.test(path.resolve(file).split(path.sep).join('/'))
  const dir = path.dirname(file)
  const orders = new Map(), metaIds = new Map()
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.yml'))) {
    const other = yaml.load(fs.readFileSync(path.join(dir, f), 'utf8'))
    if (orders.has(other.meta.order)) errs.push(`duplicate order ${other.meta.order}: ${f} / ${orders.get(other.meta.order)}`)
    orders.set(other.meta.order, f)
    if (metaIds.has(other.meta.id)) errs.push(`duplicate meta.id ${other.meta.id}`)
    metaIds.set(other.meta.id, f)
  }
  const zhStrings = []
  const two = (o, where) => {
    ;['en', 'zh'].forEach(l => { if (!isText(o?.[l])) errs.push(`${where}.${l} missing`) })
    if (o && 'ja' in o && !isText(o.ja)) errs.push(`${where}.ja is empty`)
    if (isText(o?.zh)) zhStrings.push([where, o.zh])
  }
  const py = (zh, pinyin, where) => pinyinProblems(zh, pinyin).forEach(p => errs.push(`${where}: ${p}`))
  const m = d.meta || {}
  if (!m.id || !/^[a-z0-9-]+$/.test(m.id)) errs.push('meta.id missing/invalid')
  two(m.title, 'meta.title'); two(m.description, 'meta.description')

  if (isFoundation) {
    if (m.level !== 'foundation' || m.type !== 'pre-lesson') errs.push('foundation chapter needs level: foundation, type: pre-lesson')
    for (const [i, c] of (d.characters || []).entries()) {
      if (!c.id || !c.char) errs.push(`characters[${i}] id/char missing`)
      for (const [j, ex] of (c.examples || []).entries()) {
        const at = `characters[${i}](${c.id}).examples[${j}]`
        zhStrings.push([at, ex.word])
        py(ex.word, ex.reading, `${at}.reading`)
        two(ex.meaning, `${at}.meaning`)
      }
      if (!(c.examples || []).length) errs.push(`characters[${i}](${c.id}) has no examples`)
    }
  } else {
    if (m.level !== 'beginner') errs.push('meta.level must be beginner')
    if (!Number.isInteger(m.order)) errs.push('meta.order must be an integer')
    if (!/^[a-z][a-z0-9_]*$/.test(m.icon || '')) errs.push('meta.icon must be a Material Symbols name')
    const nn = path.basename(file).match(/^(\d\d)-[a-z0-9-]+\.yml$/)
    if (!nn || Number(nn[1]) !== m.order) errs.push('file name must be NN-slug.yml with NN == meta.order')
    const ids = new Set()
    for (const [i, w] of (d.words || []).entries()) {
      const at = `words[${i}](${w.id})`
      if (!w.id || ids.has(w.id)) errs.push(`${at} id missing/duplicate`); ids.add(w.id)
      two(w.word, `${at}.word`); two(w.description, `${at}.description`); two(w.sentence, `${at}.sentence`)
      py(w.word?.zh, w.pinyin, `${at}.pinyin`)
      py(w.sentence?.zh, w.sentencePinyin, `${at}.sentencePinyin`)
    }
    const nWords = (d.words || []).length
    if (nWords < 12 || nWords > 16) errs.push(`${nWords} words (need 12-16)`)
    const convIds = new Set()
    for (const c of d.chat?.conversations || []) {
      if (!c.id || convIds.has(c.id) || ids.has(c.id)) errs.push(`conversation id ${c.id} missing/duplicate`); convIds.add(c.id)
      two(c.title, `conv ${c.id}.title`)
      if ((c.title?.en || '').length > 22) errs.push(`conv ${c.id}.title.en longer than 22 characters`)
      if ((c.title?.zh || '').length > 8) errs.push(`conv ${c.id}.title.zh longer than 8 characters`)
      const msgs = c.messages || []
      if (msgs.length < 6 || msgs.length > 10) errs.push(`conv ${c.id} has ${msgs.length} lines (need 6-10)`)
      msgs.forEach((msg, j) => {
        if (!['partner', 'user'].includes(msg.role)) errs.push(`conv ${c.id}[${j}] bad role`)
        two(msg.text, `conv ${c.id}[${j}].text`)
        py(msg.text?.zh, msg.pinyin, `conv ${c.id}[${j}].pinyin`)
      })
    }
    if ((d.chat?.conversations || []).length !== 3) errs.push('need 3 conversations')
    const q = d.quiz
    if (!Number.isInteger(q?.questionsPerRound) || !Number.isInteger(q?.xpReward)) errs.push('quiz.questionsPerRound/xpReward missing')
    const base = t => String(t || '').replace(/\s*\(.*?\)\s*/g, ' ').trim().toLowerCase()
    const wordSet = new Set((d.words || []).map(w => base(w.word?.zh)))
    for (const [i, c] of (q?.cloze || []).entries()) {
      if ((c.sentence.match(/___/g) || []).length !== 1) errs.push(`cloze[${i}] needs exactly one ___`)
      if (!c.options?.includes(c.answer)) errs.push(`cloze[${i}] answer not in options`)
      if (new Set(c.options).size !== c.options?.length || c.options?.length !== 4) errs.push(`cloze[${i}] needs 4 distinct options`)
      if (!wordSet.has(String(c.answer).toLowerCase())) errs.push(`cloze[${i}] answer "${c.answer}" matches no word.zh`)
      if (!isText(c.explain?.en)) errs.push(`cloze[${i}].explain.en missing`)
      zhStrings.push([`cloze[${i}]`, [c.sentence, ...(c.options || [])].join(' ')])
    }
    const nCloze = (q?.cloze || []).length
    if (nCloze < 6 || nCloze > 8) errs.push(`${nCloze} cloze questions (need 6-8)`)
  }

  for (const [where, text] of zhStrings) {
    const s = simplifiedIn(text)
    if (s.length) errs.push(`simplified Chinese in ${where}: ${s.join(' ')}`)
  }
  const emoji = src.match(/\p{Extended_Pictographic}/gu)
  if (emoji) errs.push(`emoji found: ${[...new Set(emoji)].join(' ')}`)
  if (isFoundation) return `OK ${m.id}: ${(d.characters || []).length} characters`
  return `OK ${m.id}: ${d.words?.length} words, ${d.chat?.conversations?.length} conversations, ${d.quiz?.cloze?.length} cloze`
}

function checkExample(ex, at, errs, zhStrings) {
  if (!isText(ex?.zh) || !isText(ex?.en)) errs.push(`${at} needs zh and en`)
  pinyinProblems(ex?.zh, ex?.pinyin).forEach(p => errs.push(`${at}.pinyin: ${p}`))
  zhStrings.push([at, ex?.zh])
}

function checkDaily(file, d, src, errs) {
  const kind = path.basename(file, '.yml')
  const zhStrings = []
  if (!['beginner', 'intermediate', 'advanced'].includes(d?.level)) errs.push('level missing/invalid')
  if (d?.level && path.basename(path.dirname(file)) !== d.level) errs.push(`level ${d.level} does not match folder`)
  const ids = new Set()
  let summary
  if (kind === 'patterns') {
    const list = d?.patterns || []
    for (const [i, p] of list.entries()) {
      const at = `patterns[${i}](${p.id})`
      if (!p.id || !/^[a-z0-9-]+$/.test(p.id) || ids.has(p.id)) errs.push(`${at} id missing/invalid/duplicate`); ids.add(p.id)
      for (const k of ['pack', 'pattern', 'meaning', 'when', 'task']) if (!isText(p[k])) errs.push(`${at}.${k} missing`)
      pinyinProblems(p.pattern, p.pinyin).forEach(e => errs.push(`${at}.pinyin: ${e}`))
      zhStrings.push([`${at}.pattern`, p.pattern])
      if (!Array.isArray(p.examples) || p.examples.length < 2) errs.push(`${at} needs at least 2 examples`)
      ;(p.examples || []).forEach((ex, j) => checkExample(ex, `${at}.examples[${j}]`, errs, zhStrings))
      if (!Array.isArray(p.match) || !p.match.length || p.match.some(s => !isText(s))) errs.push(`${at}.match must be a non-empty list of strings`)
      else {
        p.match.forEach(s => { if (!/\p{Script=Han}/u.test(s)) errs.push(`${at}.match "${s}" has no Chinese characters`) })
        zhStrings.push([`${at}.match`, p.match.join(' ')])
        ;(p.examples || []).forEach((ex, j) => {
          if (!p.match.every(s => String(ex?.zh || '').includes(s))) errs.push(`${at}.examples[${j}] does not contain every match part (${p.match.join(', ')})`)
        })
      }
      const c = p.choice
      if (!c || !isText(c.situation) || !isText(c.explain) || !Array.isArray(c.options) || c.options.length !== 3 ||
        new Set(c.options).size !== 3 || !Number.isInteger(c.answer) || c.answer < 0 || c.answer > 2) {
        errs.push(`${at}.choice needs situation, 3 distinct options, answer 0-2, explain`)
      } else zhStrings.push([`${at}.choice.options`, c.options.join(' ')])
      if (p.mistake) {
        if (!isText(p.mistake.wrong) || !isText(p.mistake.right) || !isText(p.mistake.why)) errs.push(`${at}.mistake needs wrong/right/why`)
        else {
          if (!/[A-Za-z]{3,}/.test(p.mistake.why)) errs.push(`${at}.mistake.why must be English`)
          zhStrings.push([`${at}.mistake`, `${p.mistake.wrong} ${p.mistake.right}`])
        }
      }
      for (const k of ['meaning', 'when', 'task']) if (isText(p[k]) && !/[A-Za-z]{3,}/.test(p[k])) errs.push(`${at}.${k} must be English`)
    }
    if (list.length < 20) errs.push(`only ${list.length} patterns (need at least 20)`)
    summary = `OK daily zh/${d?.level} patterns: ${list.length} patterns`
  } else if (kind === 'vocab') {
    const list = d?.words || []
    for (const [i, w] of list.entries()) {
      const at = `words[${i}](${w.id})`
      if (!w.id || !/^[a-z0-9-]+$/.test(w.id) || ids.has(w.id)) errs.push(`${at} id missing/invalid/duplicate`); ids.add(w.id)
      for (const k of ['word', 'pos', 'meaning', 'note']) if (!isText(w[k])) errs.push(`${at}.${k} missing`)
      pinyinProblems(w.word, w.pinyin).forEach(e => errs.push(`${at}.pinyin: ${e}`))
      zhStrings.push([`${at}.word`, w.word])
      checkExample(w.example, `${at}.example`, errs, zhStrings)
      if (isText(w.word) && !String(w.example?.zh || '').includes(w.word)) errs.push(`${at}.example.zh does not contain "${w.word}"`)
      if (!Array.isArray(w.collocations) || !w.collocations.length) errs.push(`${at}.collocations missing`)
      else zhStrings.push([`${at}.collocations`, w.collocations.join(' ')])
      if (isText(w.meaning) && !/[A-Za-z]{3,}/.test(w.meaning)) errs.push(`${at}.meaning must be English`)
    }
    if (list.length < 40) errs.push(`only ${list.length} words (need at least 40)`)
    summary = `OK daily zh/${d?.level} vocab: ${list.length} words`
  } else {
    errs.push('daily file must be patterns.yml or vocab.yml')
  }
  for (const [where, text] of zhStrings) {
    const s = simplifiedIn(text)
    if (s.length) errs.push(`simplified Chinese in ${where}: ${s.join(' ')}`)
  }
  const emoji = src.match(/\p{Extended_Pictographic}/gu)
  if (emoji) errs.push(`emoji found: ${[...new Set(emoji)].join(' ')}`)
  return summary
}

export function checkZhFile(file, yaml) {
  const errs = []
  const src = fs.readFileSync(file, 'utf8')
  const d = yaml.load(src)
  const isDaily = /\/daily\/zh\//.test(path.resolve(file).split(path.sep).join('/'))
  const summary = isDaily ? checkDaily(file, d, src, errs) : checkChapter(file, d, src, yaml, errs)
  return { errs, summary }
}
