import yaml from 'js-yaml'

// Daily practice content: daily/{targetLanguage}/{level}/{patterns|vocab}.yml
const dailyFiles = import.meta.glob('./daily/**/*.yml', { eager: true, query: '?raw', import: 'default' })

function parseFile(content) {
  try {
    return yaml.load(content)
  } catch (e) {
    console.error('Failed to parse daily practice YAML:', e)
    return null
  }
}

function loadItems(targetLanguage, level, kind) {
  const content = dailyFiles[`./daily/${targetLanguage}/${level}/${kind}.yml`]
  if (!content) return []
  const data = parseFile(content)
  const items = (kind === 'patterns' ? data?.patterns : data?.words) || []
  // Ids are namespaced so pattern and word SRS records never collide with chapter words
  const prefix = kind === 'patterns' ? 'pattern' : 'word'
  return items.map(item => ({ ...item, id: `${prefix}:${level}:${item.id}`, level }))
}

export function getDailyPatterns(level, targetLanguage = 'en') {
  return loadItems(targetLanguage, level, 'patterns')
}

export function getDailyVocab(level, targetLanguage = 'en') {
  return loadItems(targetLanguage, level, 'vocab')
}
