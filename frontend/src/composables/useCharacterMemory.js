import { ref, computed } from 'vue'

const STORAGE_KEY_PREFIX = 'chatmate_memory_'
const MAX_MEMORIES_PER_CHARACTER = 15
const SESSION_LIST_KEY = 'chatmate_memory_sessions'

const memoryCache = ref({})

function loadMemories(characterId) {
  if (memoryCache.value[characterId]) return memoryCache.value[characterId]
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + characterId)
    if (!raw) {
      memoryCache.value[characterId] = { memories: [], meta: { firstMet: null, conversationCount: 0 } }
      return memoryCache.value[characterId]
    }
    const parsed = JSON.parse(raw)
    const data = {
      memories: Array.isArray(parsed.memories) ? parsed.memories : [],
      meta: parsed.meta || { firstMet: null, conversationCount: 0 },
    }
    memoryCache.value[characterId] = data
    return data
  } catch {
    memoryCache.value[characterId] = { memories: [], meta: { firstMet: null, conversationCount: 0 } }
    return memoryCache.value[characterId]
  }
}

function persist(characterId) {
  const data = memoryCache.value[characterId]
  if (!data) return
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + characterId, JSON.stringify(data))
  } catch {
    // storage full — drop oldest memory and retry once
    data.memories = data.memories.slice(-Math.floor(MAX_MEMORIES_PER_CHARACTER / 2))
    try { localStorage.setItem(STORAGE_KEY_PREFIX + characterId, JSON.stringify(data)) } catch {}
  }
}

function normalizeFact(fact) {
  if (!fact || typeof fact !== 'string') return null
  const trimmed = fact.trim().replace(/\s+/g, ' ')
  if (trimmed.length < 4 || trimmed.length > 200) return null
  return trimmed
}

function isDuplicate(newFact, existing) {
  const lower = newFact.toLowerCase()
  return existing.some(m => {
    const e = m.fact.toLowerCase()
    if (e === lower) return true
    if (e.includes(lower) || lower.includes(e)) return true
    return false
  })
}

export function useCharacterMemory() {
  function getMemories(characterId) {
    if (!characterId) return []
    const data = loadMemories(characterId)
    return data.memories
  }

  function getMeta(characterId) {
    if (!characterId) return { firstMet: null, conversationCount: 0 }
    const data = loadMemories(characterId)
    return data.meta
  }

  function addMemory(characterId, fact) {
    if (!characterId) return false
    const normalized = normalizeFact(fact)
    if (!normalized) return false
    const data = loadMemories(characterId)
    if (isDuplicate(normalized, data.memories)) return false
    data.memories.push({ fact: normalized, createdAt: Date.now() })
    if (data.memories.length > MAX_MEMORIES_PER_CHARACTER) {
      data.memories = data.memories.slice(-MAX_MEMORIES_PER_CHARACTER)
    }
    persist(characterId)
    return true
  }

  function removeMemory(characterId, index) {
    if (!characterId) return
    const data = loadMemories(characterId)
    if (index < 0 || index >= data.memories.length) return
    data.memories.splice(index, 1)
    persist(characterId)
  }

  function clearMemories(characterId) {
    if (!characterId) return
    memoryCache.value[characterId] = { memories: [], meta: loadMemories(characterId).meta }
    persist(characterId)
  }

  function markSessionStart(characterId) {
    if (!characterId) return
    const data = loadMemories(characterId)
    if (!data.meta.firstMet) {
      data.meta.firstMet = Date.now()
    }
    data.meta.conversationCount = (data.meta.conversationCount || 0) + 1
    data.meta.lastConversation = Date.now()
    persist(characterId)
  }

  function buildContextString(characterId, characterName) {
    const memories = getMemories(characterId)
    const meta = getMeta(characterId)
    if (!memories.length && !meta.conversationCount) return null

    const parts = []
    if (meta.conversationCount > 1) {
      parts.push(`This is your conversation #${meta.conversationCount} with this user. You already know each other.`)
    }
    if (memories.length > 0) {
      const facts = memories.slice(-10).map(m => `- ${m.fact}`).join('\n')
      parts.push(`Things you remember about this user (reference naturally when relevant, do NOT list them mechanically):\n${facts}`)
    }
    return parts.join('\n\n')
  }

  function getAllCharactersWithMemories() {
    const result = []
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
          const charId = key.slice(STORAGE_KEY_PREFIX.length)
          const data = loadMemories(charId)
          if (data.memories.length > 0 || data.meta.conversationCount > 0) {
            result.push({ characterId: charId, ...data })
          }
        }
      }
    } catch {}
    return result
  }

  return {
    getMemories,
    getMeta,
    addMemory,
    removeMemory,
    clearMemories,
    markSessionStart,
    buildContextString,
    getAllCharactersWithMemories,
  }
}
