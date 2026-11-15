// Guard for lang tags on target-language content (docs/plans/zh-edition.md section 5):
// in the Chinese edition every text node with a Han character must sit inside an element
// with lang="zh-Hant-TW" (so Traditional glyphs render); the English edition sets no lang.
const HAN = /\p{Script=Han}/u
const LATIN_WORD = /\p{Script=Latin}+/gu

// An English sentence that quotes a Chinese word ("The simplest way to order: 我要 + item.")
// is an explanation, not Chinese content, and is out of scope (docs/plans/zh-edition.md §5).
// Three or more English words mark it; 我要一杯 latte stays Chinese content.
export function isEnglishExplanation(text) {
  return (String(text).match(LATIN_WORD) || []).length >= 3
}

function textNodes(root) {
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes = []
  for (let node = walker.nextNode(); node; node = walker.nextNode()) nodes.push(node)
  return nodes
}

/**
 * Han text inside `root` and the pieces of it that aren't tagged `tag`.
 * The tag must come from inside `root`, so a lang on <html> doesn't count.
 * English explanations that quote Chinese words are left out (see isEnglishExplanation).
 */
export function hanCoverage(root, tag = 'zh-Hant-TW') {
  const han = textNodes(root).filter(node => HAN.test(node.nodeValue) && !isEnglishExplanation(node.nodeValue))
  const untagged = han
    .filter(node => {
      const owner = node.parentElement?.closest('[lang]')
      return !owner || !root.contains(owner) || owner.getAttribute('lang') !== tag
    })
    .map(node => node.nodeValue.trim())
  return { hanCount: han.length, untagged }
}

/** Every lang attribute inside `root` (the English edition should have none). */
export function langAttributes(root) {
  return Array.from(root.querySelectorAll('[lang]')).map(el => `${el.tagName.toLowerCase()}[lang=${el.getAttribute('lang')}]`)
}
