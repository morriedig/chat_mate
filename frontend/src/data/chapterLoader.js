import yaml from 'js-yaml'

// Import all YAML files from chapters directory (supports level-based subfolders)
// Structure: chapters/*.yml OR chapters/{beginner,intermediate,advanced}/*.yml
const chapterFiles = import.meta.glob('./chapters/**/*.yml', { eager: true, query: '?raw', import: 'default' })

/**
 * Parse a single YAML chapter file into structured data
 */
function parseChapter(yamlContent) {
  try {
    return yaml.load(yamlContent)
  } catch (e) {
    console.error('Failed to parse chapter YAML:', e)
    return null
  }
}

/**
 * Transform chapter words to the format expected by components
 * Audio is handled by Web Speech API in VocabularyCard
 * Returns both target language and native language for bilingual support
 */
function transformWords(chapter, language) {
  if (!chapter?.words) return []

  // Determine the "other" language for bilingual display
  const nativeLanguage = language === 'ja' ? 'en' : 'ja'

  return chapter.words.map((wordData, index) => {
    const word = wordData.word[language] || wordData.word.en
    const nativeWord = wordData.word[nativeLanguage] || wordData.word.en

    return {
      id: `${chapter.meta.id}_${wordData.id}`,
      word,
      nativeWord,
      meaning: wordData.description[language] || wordData.description.en,
      nativeMeaning: wordData.description[nativeLanguage] || wordData.description.en,
      example: wordData.sentence[language] || wordData.sentence.en,
      nativeExample: wordData.sentence[nativeLanguage] || wordData.sentence.en,
      phonetic: language === 'en' ? wordData.phonetic : undefined,
      reading: language === 'ja' ? wordData.reading : undefined
    }
  })
}

/**
 * Load and parse all chapters from YAML files
 */
function loadAllChapters() {
  const chapters = []

  for (const [path, content] of Object.entries(chapterFiles)) {
    const chapter = parseChapter(content)
    if (chapter?.meta) {
      chapters.push(chapter)
    }
  }

  // Sort by order
  chapters.sort((a, b) => (a.meta.order || 999) - (b.meta.order || 999))

  return chapters
}

// Cache loaded chapters
let cachedChapters = null

/**
 * Get all chapters (cached)
 */
export function getChapters() {
  if (!cachedChapters) {
    cachedChapters = loadAllChapters()
  }
  return cachedChapters
}

/**
 * Get chapter list with metadata for display
 */
export function getChapterList(language = 'en') {
  const chapters = getChapters()

  return chapters.map(chapter => ({
    id: chapter.meta.id,
    title: chapter.meta.title[language] || chapter.meta.title.en,
    description: chapter.meta.description[language] || chapter.meta.description.en,
    icon: chapter.meta.icon,
    level: chapter.meta.level,
    wordCount: chapter.words?.length || 0,
    order: chapter.meta.order
  }))
}

/**
 * Get chapters filtered by level
 */
export function getChaptersByLevel(language = 'en', level = 'beginner') {
  return getChapterList(language).filter(ch => ch.level === level)
}

/**
 * Get a single chapter by ID
 */
export function getChapter(chapterId) {
  const chapters = getChapters()
  return chapters.find(ch => ch.meta.id === chapterId)
}

/**
 * Get words for a specific chapter
 */
export function getChapterWords(chapterId, language = 'en') {
  const chapter = getChapter(chapterId)
  if (!chapter) return []

  return transformWords(chapter, language)
}

/**
 * Get fixed conversations for a chapter
 */
export function getChapterConversations(chapterId, language = 'en') {
  const chapter = getChapter(chapterId)
  if (!chapter?.chat?.conversations) return []

  const nativeLanguage = language === 'ja' ? 'en' : 'ja'

  return chapter.chat.conversations.map(conv => ({
    id: conv.id,
    title: conv.title[language] || conv.title.en,
    messages: conv.messages.map(msg => ({
      role: msg.role,
      text: msg.text[language] || msg.text.en,
      nativeText: msg.text[nativeLanguage] || msg.text.en
    }))
  }))
}

/**
 * Get quiz settings for a chapter
 */
export function getChapterQuizSettings(chapterId) {
  const chapter = getChapter(chapterId)
  return chapter?.quiz || { questionsPerRound: 5, xpReward: 20 }
}

/**
 * Get all available levels from chapters
 */
export function getAvailableLevels() {
  const chapters = getChapters()
  const levels = new Set(chapters.map(ch => ch.meta.level))
  return Array.from(levels)
}

/**
 * Reload chapters (useful for hot reload during development)
 */
export function reloadChapters() {
  cachedChapters = null
  return getChapters()
}

// Export for backward compatibility with existing vocabulary.js interface
export const chapters = {
  getChapters,
  getChapterList,
  getChaptersByLevel,
  getChapter,
  getChapterWords,
  getChapterConversations,
  getChapterQuizSettings,
  getAvailableLevels,
  reloadChapters
}

export default chapters
