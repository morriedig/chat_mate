import { ref, computed } from 'vue'

const STORAGE_KEY = 'chatmate_vocabBank'

function loadBank() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveBank(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

// Singleton state
const bank = ref(loadBank())

export function generateWordId(word) {
  // Use a simple hash-like approach: lowercase + encode special chars
  const normalized = word.trim().toLowerCase()
  // Use encodeURIComponent to handle all Unicode safely, then clean up
  return encodeURIComponent(normalized).replace(/%/g, '_').slice(0, 100)
}

export function useVocabularyBank() {
  const words = computed(() => Object.values(bank.value))
  const wordCount = computed(() => words.value.length)

  function addWord({ word, translation, context, source }) {
    const id = generateWordId(word)
    if (bank.value[id]) return false // Already exists

    const newBank = { ...bank.value }
    newBank[id] = {
      id,
      word: word.trim(),
      translation: translation || '',
      context: context || '',
      source: source || 'chat',
      addedAt: new Date().toISOString().split('T')[0],
    }
    bank.value = newBank
    if (!saveBank(bank.value)) {
      // Revert on save failure
      delete newBank[id]
      bank.value = { ...newBank }
      return false
    }
    return true
  }

  function removeWord(id) {
    if (!bank.value[id]) return false
    const newBank = { ...bank.value }
    delete newBank[id]
    bank.value = newBank
    saveBank(bank.value)
    return true
  }

  function hasWord(word) {
    return !!bank.value[generateWordId(word)]
  }

  function getWord(id) {
    return bank.value[id] || null
  }

  function searchWords(query) {
    if (!query) return words.value
    const q = query.toLowerCase()
    return words.value.filter(w =>
      w.word.toLowerCase().includes(q) ||
      (w.translation || '').toLowerCase().includes(q)
    )
  }

  function updateTranslation(id, translation) {
    if (!bank.value[id]) return
    bank.value = {
      ...bank.value,
      [id]: { ...bank.value[id], translation }
    }
    saveBank(bank.value)
  }

  function resetBank() {
    bank.value = {}
    saveBank(bank.value)
  }

  return {
    words,
    wordCount,
    addWord,
    removeWord,
    hasWord,
    getWord,
    searchWords,
    updateTranslation,
    resetBank,
  }
}
