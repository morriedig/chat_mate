import { ref, readonly } from 'vue'

const INDEX_KEY = 'chatmate_diary_entries'
const ENTRY_PREFIX = 'chatmate_diary_entry_'
const MAX_ENTRIES = 450

function loadIndex() {
  try {
    const raw = localStorage.getItem(INDEX_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveIndex(data) {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

function entryKey(id) {
  return ENTRY_PREFIX + id
}

// Singleton state
const entryIndex = ref(loadIndex())

export function useDiaryStorage() {
  function init() {
    entryIndex.value = loadIndex()
  }

  function saveEntry(entry) {
    // Save individual entry data
    try {
      localStorage.setItem(entryKey(entry.id), JSON.stringify(entry))
    } catch {
      return false
    }

    // Update index (lightweight metadata only)
    const index = [...entryIndex.value]
    const existing = index.findIndex(e => e.id === entry.id)
    const meta = {
      id: entry.id,
      createdAt: entry.createdAt,
      title: entry.title,
      wordCount: entry.wordCount,
      feedbackStatus: entry.feedbackStatus || 'none',
      language: entry.language,
    }

    if (existing >= 0) {
      index[existing] = meta
    } else {
      index.unshift(meta)
    }

    // Auto-prune at MAX_ENTRIES
    if (index.length > MAX_ENTRIES) {
      pruneEntries(index)
    }

    entryIndex.value = index
    saveIndex(index)
    return true
  }

  function pruneEntries(index) {
    // Remove oldest entries without feedback first
    while (index.length > MAX_ENTRIES) {
      const noFeedbackIdx = findLastIndex(index, e => e.feedbackStatus === 'none')
      if (noFeedbackIdx >= 0) {
        const removed = index.splice(noFeedbackIdx, 1)[0]
        localStorage.removeItem(entryKey(removed.id))
      } else {
        // All have feedback, remove the oldest
        const removed = index.pop()
        localStorage.removeItem(entryKey(removed.id))
      }
    }
  }

  function findLastIndex(arr, predicate) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (predicate(arr[i])) return i
    }
    return -1
  }

  function loadEntry(id) {
    try {
      const raw = localStorage.getItem(entryKey(id))
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  function deleteEntry(id) {
    localStorage.removeItem(entryKey(id))
    const index = entryIndex.value.filter(e => e.id !== id)
    entryIndex.value = index
    saveIndex(index)
    return true
  }

  function getEntriesByMonth(year, month) {
    return entryIndex.value.filter(e => {
      const date = new Date(e.createdAt)
      return date.getFullYear() === year && date.getMonth() === month
    })
  }

  return {
    entryIndex: readonly(entryIndex),
    init,
    saveEntry,
    loadEntry,
    deleteEntry,
    getEntriesByMonth,
  }
}
