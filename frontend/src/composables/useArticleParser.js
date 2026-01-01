import { computed } from 'vue'

/**
 * Composable for parsing article content with vocabulary markers.
 * Follows Single Responsibility Principle - only handles parsing logic.
 *
 * @param {Object} article - Reactive article object with content and vocabulary
 * @returns {Object} - vocabularyMap and contentSegments
 */
export function useArticleParser(article) {
  // Create a vocabulary lookup map (word -> vocabulary data)
  const vocabularyMap = computed(() => {
    const map = {}
    const vocab = article.value?.vocabulary || article?.vocabulary
    if (vocab) {
      vocab.forEach(item => {
        map[item.word.toLowerCase()] = item
      })
    }
    return map
  })

  // Parse content and split into segments (text, vocab, break)
  const contentSegments = computed(() => {
    const content = article.value?.content || article?.content
    if (!content) return []

    return parseContent(content, vocabularyMap.value)
  })

  return {
    vocabularyMap,
    contentSegments
  }
}

/**
 * Parse content string into segments.
 * Extensible: can add more marker types in the future.
 *
 * @param {string} content - Raw content with [[word]] markers
 * @param {Object} vocabMap - Vocabulary lookup map
 * @returns {Array} - Array of segment objects
 */
function parseContent(content, vocabMap) {
  const segments = []
  const regex = /\[\[([^\]]+)\]\]/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index)
      addTextSegments(segments, text)
    }

    // Add the vocabulary word
    const word = match[1]
    const vocabData = vocabMap[word.toLowerCase()]
    if (vocabData) {
      segments.push({ type: 'vocab', word, data: vocabData })
    } else {
      // Fallback: treat as plain text if no vocab data found
      segments.push({ type: 'text', content: word })
    }

    lastIndex = regex.lastIndex
  }

  // Add remaining text
  if (lastIndex < content.length) {
    addTextSegments(segments, content.slice(lastIndex))
  }

  return segments
}

/**
 * Add text segments, splitting by newlines for paragraph breaks.
 *
 * @param {Array} segments - Segments array to append to
 * @param {string} text - Text to split and add
 */
function addTextSegments(segments, text) {
  const parts = text.split('\n')
  parts.forEach((part, i) => {
    if (part) {
      segments.push({ type: 'text', content: part })
    }
    if (i < parts.length - 1) {
      segments.push({ type: 'break' })
    }
  })
}

/**
 * Strip [[word]] markers from content for plain text preview.
 *
 * @param {string} content - Raw content with markers
 * @returns {string} - Plain text without markers
 */
export function stripMarkers(content) {
  if (!content) return ''
  return content.replace(/\[\[([^\]]+)\]\]/g, '$1')
}
