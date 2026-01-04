import yaml from 'js-yaml'

// Import all YAML files from chapters directory
// New structure: chapters/{targetLanguage}/{level}/*.yml
// Example: chapters/ja/beginner/basic-greetings.yml (for learning Japanese)
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
 * Extract target language from file path
 * Path format: ./chapters/{targetLanguage}/{level}/filename.yml
 */
function getTargetLanguageFromPath(path) {
  const match = path.match(/\.\/chapters\/([a-z]{2})\//)
  return match ? match[1] : null
}

/**
 * Transform chapter words to the format expected by components
 * Audio is handled by Web Speech API in VocabularyCard
 * Returns both target language and native language (mother tongue) for bilingual support
 * @param {Object} chapter - The chapter data
 * @param {string} targetLanguage - Target learning language (e.g., 'ja', 'en', 'zh')
 * @param {string} motherTongue - User's mother tongue (e.g., 'en', 'ja', 'zh')
 */
function transformWords(chapter, targetLanguage, motherTongue = 'en') {
  if (!chapter?.words) return []

  return chapter.words.map((wordData, index) => {
    // Target language word (what user is learning)
    const word = wordData.word[targetLanguage] || wordData.word.en
    // Mother tongue translation (for bilingual display)
    const nativeWord = wordData.word[motherTongue] || wordData.word.en

    return {
      id: `${chapter.meta.id}_${wordData.id}`,
      word,
      nativeWord,
      meaning: wordData.description[targetLanguage] || wordData.description.en,
      nativeMeaning: wordData.description[motherTongue] || wordData.description.en,
      example: wordData.sentence[targetLanguage] || wordData.sentence.en,
      nativeExample: wordData.sentence[motherTongue] || wordData.sentence.en,
      phonetic: targetLanguage === 'en' ? wordData.phonetic : undefined,
      reading: targetLanguage === 'ja' ? wordData.reading : undefined
    }
  })
}

/**
 * Load and parse all chapters from YAML files, organized by target language
 */
function loadAllChapters() {
  const chaptersByLanguage = {}

  for (const [path, content] of Object.entries(chapterFiles)) {
    const targetLanguage = getTargetLanguageFromPath(path)
    if (!targetLanguage) continue

    const chapter = parseChapter(content)
    if (chapter?.meta) {
      // Add target language to chapter meta
      chapter.meta.targetLanguage = targetLanguage

      if (!chaptersByLanguage[targetLanguage]) {
        chaptersByLanguage[targetLanguage] = []
      }
      chaptersByLanguage[targetLanguage].push(chapter)
    }
  }

  // Sort each language's chapters by order
  for (const lang of Object.keys(chaptersByLanguage)) {
    chaptersByLanguage[lang].sort((a, b) => (a.meta.order || 999) - (b.meta.order || 999))
  }

  return chaptersByLanguage
}

// Cache loaded chapters by language
let cachedChaptersByLanguage = null

/**
 * Get all chapters organized by target language (cached)
 */
export function getAllChaptersByLanguage() {
  if (!cachedChaptersByLanguage) {
    cachedChaptersByLanguage = loadAllChapters()
  }
  return cachedChaptersByLanguage
}

/**
 * Get chapters for a specific target language
 * @param {string} targetLanguage - The language user wants to learn (e.g., 'ja', 'en', 'zh')
 */
export function getChapters(targetLanguage = 'ja') {
  const allChapters = getAllChaptersByLanguage()
  return allChapters[targetLanguage] || []
}

/**
 * Get available target languages (languages that have chapters)
 */
export function getAvailableTargetLanguages() {
  const allChapters = getAllChaptersByLanguage()
  return Object.keys(allChapters)
}

/**
 * Get chapter list with metadata for display
 * @param {string} targetLanguage - The language user wants to learn
 * @param {string} uiLanguage - UI display language for titles/descriptions
 */
export function getChapterList(targetLanguage = 'ja', uiLanguage = 'en') {
  const chapters = getChapters(targetLanguage)

  return chapters.map(chapter => ({
    id: chapter.meta.id,
    title: chapter.meta.title[uiLanguage] || chapter.meta.title.en,
    description: chapter.meta.description[uiLanguage] || chapter.meta.description.en,
    icon: chapter.meta.icon,
    level: chapter.meta.level,
    targetLanguage: chapter.meta.targetLanguage,
    wordCount: chapter.words?.length || 0,
    order: chapter.meta.order
  }))
}

/**
 * Get chapters filtered by target language and level
 * @param {string} targetLanguage - The language user wants to learn
 * @param {string} level - Difficulty level (beginner, intermediate, advanced)
 * @param {string} uiLanguage - UI display language
 */
export function getChaptersByLevel(targetLanguage = 'ja', level = 'beginner', uiLanguage = 'en') {
  return getChapterList(targetLanguage, uiLanguage).filter(ch => ch.level === level)
}

/**
 * Get a single chapter by ID and target language
 */
export function getChapter(chapterId, targetLanguage = 'ja') {
  const chapters = getChapters(targetLanguage)
  return chapters.find(ch => ch.meta.id === chapterId)
}

/**
 * Get words for a specific chapter
 * @param {string} chapterId - Chapter ID
 * @param {string} targetLanguage - The language user is learning
 * @param {string} motherTongue - User's native language for bilingual display
 */
export function getChapterWords(chapterId, targetLanguage = 'ja', motherTongue = 'en') {
  const chapter = getChapter(chapterId, targetLanguage)
  if (!chapter) return []

  return transformWords(chapter, targetLanguage, motherTongue)
}

/**
 * Get fixed conversations for a chapter
 * @param {string} chapterId - Chapter ID
 * @param {string} targetLanguage - The language user is learning
 * @param {string} motherTongue - User's native language for bilingual display
 */
export function getChapterConversations(chapterId, targetLanguage = 'ja', motherTongue = 'en') {
  const chapter = getChapter(chapterId, targetLanguage)
  if (!chapter?.chat?.conversations) return []

  return chapter.chat.conversations.map(conv => ({
    id: conv.id,
    title: conv.title[targetLanguage] || conv.title.en,
    messages: conv.messages.map(msg => ({
      role: msg.role,
      text: msg.text[targetLanguage] || msg.text.en,
      nativeText: msg.text[motherTongue] || msg.text.en
    }))
  }))
}

/**
 * Get quiz settings for a chapter
 */
export function getChapterQuizSettings(chapterId, targetLanguage = 'ja') {
  const chapter = getChapter(chapterId, targetLanguage)
  return chapter?.quiz || { questionsPerRound: 5, xpReward: 20 }
}

/**
 * Get all available levels for a target language
 */
export function getAvailableLevels(targetLanguage = 'ja') {
  const chapters = getChapters(targetLanguage)
  const levels = new Set(chapters.map(ch => ch.meta.level))
  return Array.from(levels)
}

/**
 * Reload chapters (useful for hot reload during development)
 */
export function reloadChapters() {
  cachedChaptersByLanguage = null
  return getAllChaptersByLanguage()
}

// Export for backward compatibility
export const chapters = {
  getChapters,
  getChapterList,
  getChaptersByLevel,
  getChapter,
  getChapterWords,
  getChapterConversations,
  getChapterQuizSettings,
  getAvailableLevels,
  getAvailableTargetLanguages,
  reloadChapters
}

export default chapters
