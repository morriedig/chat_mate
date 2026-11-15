/**
 * Word-level diff between what the learner wrote and the target sentence.
 * Returns the target's words marked `same` or `changed`, plus whether the two
 * match once case and punctuation are ignored.
 *
 * Text with Chinese characters is compared per character (Chinese has no spaces
 * between words); punctuation is ignored and shown attached to the character
 * before it. Each part has `space`: whether a space follows it when shown.
 */
const HAN = /\p{Script=Han}/u

function tokens(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean)
}

function bare(word) {
  return word.toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9']/g, '')
}

function wordTokens(text) {
  return tokens(text).map(word => ({ text: word, key: bare(word), space: true }))
}

// One token per Chinese character, one per run of Latin letters/digits
function hanTokens(text) {
  const out = []
  let prefix = ''
  for (const [ch, han, word, space] of String(text || '').trim().matchAll(/(\p{Script=Han})|([A-Za-z0-9'‘’]+)|(\s+)|./gu)) {
    const last = out[out.length - 1]
    if (han || word) {
      out.push({ text: prefix + ch, key: han ? ch : bare(word), space: false })
      prefix = ''
    } else if (space) {
      if (last) last.space = true
    } else if (last) {
      last.text += ch
    } else {
      prefix += ch
    }
  }
  return out
}

export function diffWords(written, target) {
  const useHan = HAN.test(String(written || '')) || HAN.test(String(target || ''))
  const tokenize = useHan ? hanTokens : wordTokens
  const a = tokenize(written).map(t => t.key)
  const bTokens = tokenize(target)
  const b = bTokens.map(t => t.key)

  // Longest common subsequence table
  const lcs = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }

  const parts = []
  let i = 0
  let j = 0
  while (j < b.length) {
    if (i < a.length && a[i] === b[j]) {
      parts.push({ text: bTokens[j].text, same: true, space: bTokens[j].space })
      i++
      j++
    } else if (i < a.length && lcs[i + 1][j] >= lcs[i][j + 1]) {
      i++
    } else {
      parts.push({ text: bTokens[j].text, same: false, space: bTokens[j].space })
      j++
    }
  }

  const matches = a.filter(Boolean).join(' ') === b.filter(Boolean).join(' ')
  return { parts, matches }
}
