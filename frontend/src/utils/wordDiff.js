/**
 * Word-level diff between what the learner wrote and the target sentence.
 * Returns the target's words marked `same` or `changed`, plus whether the two
 * match once case and punctuation are ignored.
 */
function tokens(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean)
}

function bare(word) {
  return word.toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9']/g, '')
}

export function diffWords(written, target) {
  const a = tokens(written).map(bare)
  const bWords = tokens(target)
  const b = bWords.map(bare)

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
      parts.push({ text: bWords[j], same: true })
      i++
      j++
    } else if (i < a.length && lcs[i + 1][j] >= lcs[i][j + 1]) {
      i++
    } else {
      parts.push({ text: bWords[j], same: false })
      j++
    }
  }

  const matches = a.filter(Boolean).join(' ') === b.filter(Boolean).join(' ')
  return { parts, matches }
}
