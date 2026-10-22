import { ref, computed } from 'vue'
import { getChapter } from '../data/chapterLoader'
import { detectConnectorsInOrder } from '../utils/connectorDetect'
import {
  OPINION_CHAPTER_ID,
  OPINION_TOPICS,
  CONNECTOR_TARGETS,
  CONNECTOR_INSERT_TEXT,
  HINT_POOL,
  TRY_NEXT_ORDER,
} from '../data/opinionChat'

const STORAGE_KEY = 'chatmate_opinionChat'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return {
      topicIndex: Number.isInteger(parsed?.topicIndex) ? parsed.topicIndex : 0,
      // characterId → topic id of that character's saved opinion chat
      chatTopics: parsed?.chatTopics && typeof parsed.chatTopics === 'object' ? parsed.chatTopics : {},
    }
  } catch {
    return { topicIndex: 0, chatTopics: {} }
  }
}

function saveState(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage unavailable
  }
}

// Singleton state
const state = ref(loadState())

/**
 * Pick which connectors to show in the hint strip.
 * Unused connectors come first so the user sees variety; the window moves each round.
 * @param {number} round - usually the number of user turns so far
 * @param {string[]} usedIds - connectors already used in this chat
 * @param {number} size
 */
export function getHintBatch(round, usedIds = [], size = 4, pool = HINT_POOL) {
  const unused = pool.filter(id => !usedIds.includes(id))
  const source = unused.length >= size ? unused : pool
  const start = ((round * size) % source.length + source.length) % source.length
  const batch = []
  for (let i = 0; i < Math.min(size, source.length); i++) {
    batch.push(source[(start + i) % source.length])
  }
  return batch
}

// Split a message into sentences, keeping end punctuation
export function splitSentences(text) {
  return (text || '')
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(Boolean)
}

/**
 * Build the end-of-chat summary from the user's messages.
 * @returns {{ userTurns: number, used: Array<{id, sentence}>, tryNext: string[], bestSentence: string|null }}
 */
export function buildOpinionSummary(messages, targets = CONNECTOR_TARGETS, order = TRY_NEXT_ORDER) {
  const userMessages = (messages || []).filter(m => m.role === 'user' && typeof m.content === 'string')
  const used = new Map()
  let best = null
  let longest = null

  for (const msg of userMessages) {
    for (const sentence of splitSentences(msg.content)) {
      const ids = detectConnectorsInOrder(sentence, targets)
      ids.forEach(id => {
        if (!used.has(id)) used.set(id, { id, sentence })
      })
      if (ids.length > 0 && (!best || ids.length > best.score || (ids.length === best.score && sentence.length > best.sentence.length))) {
        best = { sentence, score: ids.length }
      }
      const wordCount = sentence.split(/\s+/).length
      if (wordCount >= 4 && (!longest || sentence.length > longest.length)) {
        longest = sentence
      }
    }
  }

  return {
    userTurns: userMessages.length,
    used: [...used.values()],
    tryNext: order.filter(id => !used.has(id)).slice(0, 2),
    // Prefer a sentence with connectors; otherwise the user's fullest sentence
    bestSentence: best?.sentence || longest || null,
  }
}

export function useOpinionChat() {
  const topic = computed(() => OPINION_TOPICS[state.value.topicIndex % OPINION_TOPICS.length])

  function nextTopic() {
    state.value = { ...state.value, topicIndex: (state.value.topicIndex + 1) % OPINION_TOPICS.length }
    saveState(state.value)
    return topic.value
  }

  // Remember which topic a character's saved chat is about
  function markChatTopic(characterId) {
    if (!characterId) return
    state.value = { ...state.value, chatTopics: { ...state.value.chatTopics, [characterId]: topic.value.id } }
    saveState(state.value)
  }

  function isChatOnCurrentTopic(characterId) {
    return state.value.chatTopics[characterId] === topic.value.id
  }

  function topicText(lang) {
    return topic.value[lang] || topic.value.en
  }

  /**
   * Connector details from the giving-reasons chapter, localized to the mother tongue.
   * `meaning` is empty when the mother tongue is English (the word itself is the meaning).
   */
  function getConnectorInfo(id, motherTongue = 'en') {
    const chapter = getChapter(OPINION_CHAPTER_ID, 'en')
    const word = chapter?.words?.find(w => w.id === id)
    return {
      id,
      label: word?.word?.en || CONNECTOR_INSERT_TEXT[id] || id,
      insert: CONNECTOR_INSERT_TEXT[id] || word?.word?.en || id,
      meaning: motherTongue === 'en' ? '' : (word?.word?.[motherTongue] || ''),
      example: word?.sentence?.en || '',
    }
  }

  return {
    topic,
    nextTopic,
    topicText,
    markChatTopic,
    isChatOnCurrentTopic,
    getConnectorInfo,
    targets: CONNECTOR_TARGETS,
  }
}
