import { describe, it, expect, beforeEach } from 'vitest'

// We need to reset the singleton state between tests
// by clearing localStorage and re-importing
let useDiaryStorage

describe('useDiaryStorage', () => {
  beforeEach(async () => {
    localStorage.clear()
    // Reset module to clear singleton state
    const mod = await import('../../composables/useDiaryStorage.js')
    useDiaryStorage = mod.useDiaryStorage
  })

  function createEntry(overrides = {}) {
    return {
      id: 'test-' + Math.random().toString(36).substring(2, 8),
      createdAt: new Date().toISOString(),
      title: 'Test entry',
      body: 'This is a test diary entry body text.',
      wordCount: 8,
      language: 'en',
      feedbackStatus: 'none',
      feedback: null,
      ...overrides
    }
  }

  describe('init', () => {
    it('should load empty index from empty localStorage', () => {
      const storage = useDiaryStorage()
      storage.init()
      expect(storage.entryIndex.value).toEqual([])
    })

    it('should load existing index from localStorage', () => {
      const indexData = [
        { id: 'entry1', createdAt: '2026-01-01T00:00:00Z', title: 'Hello', wordCount: 5, feedbackStatus: 'none', language: 'en' }
      ]
      localStorage.setItem('chatmate_diary_entries', JSON.stringify(indexData))

      const storage = useDiaryStorage()
      storage.init()
      expect(storage.entryIndex.value).toEqual(indexData)
    })
  })

  describe('saveEntry', () => {
    it('should save entry to localStorage', () => {
      const storage = useDiaryStorage()
      storage.init()

      const entry = createEntry({ id: 'save-test' })
      const result = storage.saveEntry(entry)

      expect(result).toBe(true)
      const stored = JSON.parse(localStorage.getItem('chatmate_diary_entry_save-test'))
      expect(stored.id).toBe('save-test')
      expect(stored.body).toBe(entry.body)
    })

    it('should add entry metadata to index', () => {
      const storage = useDiaryStorage()
      storage.init()

      const entry = createEntry({ id: 'idx-test', title: 'Index test' })
      storage.saveEntry(entry)

      expect(storage.entryIndex.value.length).toBe(1)
      expect(storage.entryIndex.value[0].id).toBe('idx-test')
      expect(storage.entryIndex.value[0].title).toBe('Index test')
    })

    it('should prepend new entries to the index', () => {
      const storage = useDiaryStorage()
      storage.init()

      const entry1 = createEntry({ id: 'first' })
      const entry2 = createEntry({ id: 'second' })
      storage.saveEntry(entry1)
      storage.saveEntry(entry2)

      expect(storage.entryIndex.value[0].id).toBe('second')
      expect(storage.entryIndex.value[1].id).toBe('first')
    })

    it('should update existing entry in-place', () => {
      const storage = useDiaryStorage()
      storage.init()

      const entry = createEntry({ id: 'update-test', title: 'Original' })
      storage.saveEntry(entry)

      const updated = { ...entry, title: 'Updated', feedbackStatus: 'done' }
      storage.saveEntry(updated)

      expect(storage.entryIndex.value.length).toBe(1)
      expect(storage.entryIndex.value[0].title).toBe('Updated')
      expect(storage.entryIndex.value[0].feedbackStatus).toBe('done')
    })

    it('should persist index to localStorage', () => {
      const storage = useDiaryStorage()
      storage.init()

      const entry = createEntry({ id: 'persist-test' })
      storage.saveEntry(entry)

      const savedIndex = JSON.parse(localStorage.getItem('chatmate_diary_entries'))
      expect(savedIndex.length).toBe(1)
      expect(savedIndex[0].id).toBe('persist-test')
    })
  })

  describe('loadEntry', () => {
    it('should retrieve entry by ID', () => {
      const storage = useDiaryStorage()
      storage.init()

      const entry = createEntry({ id: 'load-test', body: 'Load me!' })
      storage.saveEntry(entry)

      const loaded = storage.loadEntry('load-test')
      expect(loaded).toBeTruthy()
      expect(loaded.id).toBe('load-test')
      expect(loaded.body).toBe('Load me!')
    })

    it('should return null for non-existent entry', () => {
      const storage = useDiaryStorage()
      storage.init()

      const loaded = storage.loadEntry('does-not-exist')
      expect(loaded).toBeNull()
    })
  })

  describe('deleteEntry', () => {
    it('should remove entry from localStorage', () => {
      const storage = useDiaryStorage()
      storage.init()

      const entry = createEntry({ id: 'del-test' })
      storage.saveEntry(entry)

      storage.deleteEntry('del-test')

      expect(localStorage.getItem('chatmate_diary_entry_del-test')).toBeNull()
    })

    it('should remove entry from index', () => {
      const storage = useDiaryStorage()
      storage.init()

      const entry1 = createEntry({ id: 'keep' })
      const entry2 = createEntry({ id: 'remove' })
      storage.saveEntry(entry1)
      storage.saveEntry(entry2)

      storage.deleteEntry('remove')

      expect(storage.entryIndex.value.length).toBe(1)
      expect(storage.entryIndex.value[0].id).toBe('keep')
    })

    it('should update localStorage index after deletion', () => {
      const storage = useDiaryStorage()
      storage.init()

      const entry = createEntry({ id: 'del-persist' })
      storage.saveEntry(entry)
      storage.deleteEntry('del-persist')

      const savedIndex = JSON.parse(localStorage.getItem('chatmate_diary_entries'))
      expect(savedIndex.length).toBe(0)
    })

    it('should return true on deletion', () => {
      const storage = useDiaryStorage()
      storage.init()

      const entry = createEntry({ id: 'del-return' })
      storage.saveEntry(entry)
      const result = storage.deleteEntry('del-return')
      expect(result).toBe(true)
    })
  })

  describe('auto-prune at 450+ entries', () => {
    it('should prune entries when exceeding MAX_ENTRIES (450)', () => {
      const storage = useDiaryStorage()
      storage.init()

      // Add 451 entries
      for (let i = 0; i < 451; i++) {
        const entry = createEntry({
          id: `prune-${i}`,
          createdAt: new Date(2026, 0, 1 + i).toISOString(),
          feedbackStatus: 'none'
        })
        storage.saveEntry(entry)
      }

      expect(storage.entryIndex.value.length).toBeLessThanOrEqual(450)
    })

    it('should prune entries without feedback first', () => {
      const storage = useDiaryStorage()
      storage.init()

      // Add 449 entries with feedback
      for (let i = 0; i < 449; i++) {
        const entry = createEntry({
          id: `feedback-${i}`,
          createdAt: new Date(2026, 0, 1 + i).toISOString(),
          feedbackStatus: 'done'
        })
        storage.saveEntry(entry)
      }

      // Add 1 entry without feedback
      const noFeedback = createEntry({
        id: 'no-feedback',
        createdAt: new Date(2026, 6, 1).toISOString(),
        feedbackStatus: 'none'
      })
      storage.saveEntry(noFeedback)

      // Add 1 more to trigger pruning (now at 451)
      const trigger = createEntry({
        id: 'trigger',
        createdAt: new Date(2026, 6, 2).toISOString(),
        feedbackStatus: 'done'
      })
      storage.saveEntry(trigger)

      // The no-feedback entry should have been pruned
      expect(storage.entryIndex.value.find(e => e.id === 'no-feedback')).toBeUndefined()
      expect(storage.entryIndex.value.length).toBeLessThanOrEqual(450)
    })
  })

  describe('split-key storage', () => {
    it('should store index separately from entries', () => {
      const storage = useDiaryStorage()
      storage.init()

      const entry = createEntry({ id: 'split-test' })
      storage.saveEntry(entry)

      // Index stored under its own key
      const index = JSON.parse(localStorage.getItem('chatmate_diary_entries'))
      expect(index).toBeTruthy()
      expect(index[0].id).toBe('split-test')

      // Entry stored under separate key
      const stored = JSON.parse(localStorage.getItem('chatmate_diary_entry_split-test'))
      expect(stored).toBeTruthy()
      expect(stored.body).toBe(entry.body)

      // Index should NOT contain body (lightweight metadata only)
      expect(index[0].body).toBeUndefined()
    })
  })

  describe('getEntriesByMonth', () => {
    it('should filter entries by year and month', () => {
      const storage = useDiaryStorage()
      storage.init()

      const jan = createEntry({ id: 'jan', createdAt: '2026-01-15T10:00:00Z' })
      const feb = createEntry({ id: 'feb', createdAt: '2026-02-10T10:00:00Z' })
      const jan2 = createEntry({ id: 'jan2', createdAt: '2026-01-20T10:00:00Z' })

      storage.saveEntry(jan)
      storage.saveEntry(feb)
      storage.saveEntry(jan2)

      const janEntries = storage.getEntriesByMonth(2026, 0) // month is 0-indexed
      expect(janEntries.length).toBe(2)
      expect(janEntries.every(e => e.id.startsWith('jan'))).toBe(true)
    })

    it('should return empty array for month with no entries', () => {
      const storage = useDiaryStorage()
      storage.init()

      const entry = createEntry({ id: 'test', createdAt: '2026-03-01T10:00:00Z' })
      storage.saveEntry(entry)

      const result = storage.getEntriesByMonth(2026, 5) // June, no entries
      expect(result).toEqual([])
    })
  })

  describe('handles corrupt localStorage gracefully', () => {
    it('should return empty index when localStorage has invalid JSON', () => {
      localStorage.setItem('chatmate_diary_entries', 'not valid json!!!')

      const storage = useDiaryStorage()
      storage.init()

      expect(storage.entryIndex.value).toEqual([])
    })

    it('should return null when loading entry with invalid JSON', () => {
      localStorage.setItem('chatmate_diary_entry_bad', '{invalid')

      const storage = useDiaryStorage()
      storage.init()

      const loaded = storage.loadEntry('bad')
      expect(loaded).toBeNull()
    })
  })
})
