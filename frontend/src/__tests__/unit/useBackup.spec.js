import { describe, it, expect, beforeEach } from 'vitest'
import {
  buildBackup,
  parseBackup,
  previewRestore,
  applyRestore,
  clearAllData,
  isBackupKey,
  isValidValue,
  backupFileName,
  BackupError,
} from '../../composables/useBackup'

const chatValue = obj => btoa(encodeURIComponent(JSON.stringify(obj)))

function seed() {
  localStorage.clear()
  const data = {
    chatmate_userProgress: JSON.stringify({ xp: 120 }),
    chatmate_srsProgress: JSON.stringify({ 'word:beginner:1': { interval: 3 } }),
    chatmate_srs: JSON.stringify({ old: true }),
    chatmate_clientId: 'client_abc',
    chatmate_allow_web: '1',
    chatmate_placement_result: JSON.stringify({ level: 'beginner' }),
    chatmate_mistakes: JSON.stringify({ items: [{ id: 'm1' }] }),
    chatmate_daily_practice: JSON.stringify({ version: 1, plans: {} }),
    chatmate_diary_entries: JSON.stringify([{ id: 'abc123' }]),
    chatmate_diary_entry_abc123: JSON.stringify({ id: 'abc123', text: 'Hi' }),
    chatmate_memory_emma: JSON.stringify({ memories: [{ fact: 'likes tea' }] }),
    chatmate_en_emma_beginner: chatValue({ messages: [{ role: 'user', content: 'hello' }], hints: [] }),
    'chatmate_en_emma_intermediate_task_2026-11-06_if-you-ask-me': chatValue({ messages: [], hints: [] }),
    chatmate_speaking_queue: JSON.stringify({ version: 1, items: [] }),
    chatmate_darkMode: 'dark',
    chatmate_voice_pause_ms: '2500',
    other_app_key: 'keep me',
  }
  for (const [k, v] of Object.entries(data)) localStorage.setItem(k, v)
  return data
}

describe('whitelist', () => {
  it('accepts fixed, dynamic and new-batch keys', () => {
    for (const key of [
      'chatmate_userProgress', 'chatmate_srsProgress', 'chatmate_speaking_queue', 'chatmate_rescue_stats',
      'chatmate_personal_scenarios', 'chatmate_speaking_sessions', 'chatmate_diary_entry_lx2k9abc',
      'chatmate_memory_emma', 'chatmate_en_emma_beginner', 'chatmate_ja_yuki_advanced_opinion',
      'chatmate_en_marcus_beginner_article_coffee-break', 'chatmate_en_emma_beginner_mission_food',
    ]) {
      expect(isBackupKey(key), key).toBe(true)
    }
  })

  it('rejects excluded and unknown keys', () => {
    for (const key of [
      'chatmate_clientId', 'chatmate_allow_web', 'chatmate_srs', 'chatmate_placement_result',
      'chatmate_token', 'chatmate_en_emma_expert', 'chatmate_english_emma_beginner', 'other_app_key',
      'chatmate_memory_', 'chatmate_diary_entry_',
    ]) {
      expect(isBackupKey(key), key).toBe(false)
    }
  })

  it('validates content by kind', () => {
    expect(isValidValue('chatmate_userProgress', '{"xp":1}')).toBe(true)
    expect(isValidValue('chatmate_userProgress', '{xp')).toBe(false)
    expect(isValidValue('chatmate_en_emma_beginner', chatValue({ messages: [] }))).toBe(true)
    expect(isValidValue('chatmate_en_emma_beginner', '%%%not-base64')).toBe(false)
    expect(isValidValue('chatmate_darkMode', 'dark')).toBe(true)
    expect(isValidValue('chatmate_darkMode', 'purple')).toBe(false)
    expect(isValidValue('chatmate_voice_pause_ms', '2500')).toBe(true)
    expect(isValidValue('chatmate_voice_pause_ms', 'slow')).toBe(false)
    expect(isValidValue('chatmate_diary_draft', 'free text {')).toBe(true)
    expect(isValidValue('chatmate_userProgress', 42)).toBe(false)
  })
})

describe('buildBackup', () => {
  beforeEach(seed)

  it('includes SRS progress but not the old SRS key, client id or temp keys', () => {
    const backup = buildBackup(localStorage, new Date('2026-11-06T12:00:00.000Z'))
    expect(backup).toMatchObject({
      format: 'chatmate-backup',
      schemaVersion: 1,
      exportedAt: '2026-11-06T12:00:00.000Z',
      appVersion: 'build-5',
    })
    expect(backup.entries.chatmate_srsProgress).toBeDefined()
    expect(backup.entries).not.toHaveProperty('chatmate_srs')
    expect(backup.entries).not.toHaveProperty('chatmate_clientId')
    expect(backup.entries).not.toHaveProperty('chatmate_allow_web')
    expect(backup.entries).not.toHaveProperty('chatmate_placement_result')
    expect(backup.entries).not.toHaveProperty('other_app_key')
    expect(backup.entries.chatmate_en_emma_beginner).toBeDefined()
    expect(backup.entries.chatmate_memory_emma).toBeDefined()
    expect(backup.entries.chatmate_diary_entry_abc123).toBeDefined()
  })

  it('names the file by local date', () => {
    expect(backupFileName(new Date(2026, 10, 6, 9))).toBe('chatmate-backup-2026-11-06.json')
  })
})

describe('parseBackup', () => {
  const valid = entries => JSON.stringify({ format: 'chatmate-backup', schemaVersion: 1, exportedAt: '2026-11-06T12:00:00.000Z', appVersion: 'build-5', entries })

  it('separates unknown keys as ignored', () => {
    const parsed = parseBackup(valid({ chatmate_userProgress: '{}', chatmate_clientId: 'x', evil_key: '1' }))
    expect(Object.keys(parsed.entries)).toEqual(['chatmate_userProgress'])
    expect(parsed.ignored.sort()).toEqual(['chatmate_clientId', 'evil_key'])
  })

  it.each([
    ['not json', '{oops', 'invalid'],
    ['wrong format', JSON.stringify({ format: 'other', schemaVersion: 1, exportedAt: '2026-01-01', entries: {} }), 'invalid'],
    ['old backup format', JSON.stringify({ userProgress: '{}', exportedAt: '2026-01-01' }), 'invalid'],
    ['future version', JSON.stringify({ format: 'chatmate-backup', schemaVersion: 2, exportedAt: '2026-01-01', entries: {} }), 'unsupported'],
    ['missing entries', JSON.stringify({ format: 'chatmate-backup', schemaVersion: 1, exportedAt: '2026-01-01' }), 'invalid'],
    ['bad date', JSON.stringify({ format: 'chatmate-backup', schemaVersion: 1, exportedAt: 'yesterday', entries: {} }), 'invalid'],
  ])('rejects %s', (_, text, code) => {
    expect(() => parseBackup(text)).toThrow(BackupError)
    try { parseBackup(text) } catch (err) { expect(err.code).toBe(code) }
  })

  it('rejects a file whose whitelisted value is damaged', () => {
    expect(() => parseBackup(valid({ chatmate_userProgress: '{', chatmate_mistakes: '{}' }))).toThrow(/corrupt/)
  })
})

describe('preview and restore', () => {
  let original
  beforeEach(() => { original = seed() })

  it('counts keys to add, overwrite, remove and ignore', () => {
    const parsed = parseBackup(JSON.stringify({
      format: 'chatmate-backup', schemaVersion: 1, exportedAt: '2026-11-06T12:00:00.000Z',
      entries: {
        chatmate_userProgress: '{"xp":999}',
        chatmate_retell: '[]',
        chatmate_memory_marcus: '{"memories":[]}',
        unknown_key: 'x',
      },
    }))
    const preview = previewRestore(parsed)
    expect(preview.add.sort()).toEqual(['chatmate_memory_marcus', 'chatmate_retell'])
    expect(preview.overwrite).toEqual(['chatmate_userProgress'])
    expect(preview.remove).toContain('chatmate_srsProgress')
    expect(preview.remove).not.toContain('chatmate_clientId')
    expect(preview.ignore).toEqual(['unknown_key'])
    expect(preview.categories).toEqual([
      { id: 'progress', count: 1 },
      { id: 'practice', count: 1 },
      { id: 'memory', count: 1 },
    ])
  })

  it('round-trips everything after the app is emptied', () => {
    const text = JSON.stringify(buildBackup())
    clearAllData()
    expect(localStorage.getItem('chatmate_srsProgress')).toBeNull()
    applyRestore(parseBackup(text))
    for (const key of [
      'chatmate_mistakes', 'chatmate_srsProgress', 'chatmate_diary_entries', 'chatmate_diary_entry_abc123',
      'chatmate_en_emma_beginner', 'chatmate_memory_emma', 'chatmate_daily_practice', 'chatmate_userProgress',
    ]) {
      expect(localStorage.getItem(key), key).toBe(original[key])
    }
    expect(localStorage.getItem('chatmate_clientId')).toBe('client_abc')
  })

  it('replaces whitelisted data completely and leaves other keys alone', () => {
    applyRestore(parseBackup(JSON.stringify({
      format: 'chatmate-backup', schemaVersion: 1, exportedAt: '2026-11-06T12:00:00.000Z',
      entries: { chatmate_userProgress: '{"xp":5}', chatmate_clientId: 'stolen' },
    })))
    expect(localStorage.getItem('chatmate_userProgress')).toBe('{"xp":5}')
    expect(localStorage.getItem('chatmate_mistakes')).toBeNull()
    expect(localStorage.getItem('chatmate_en_emma_beginner')).toBeNull()
    expect(localStorage.getItem('chatmate_clientId')).toBe('client_abc')
    expect(localStorage.getItem('chatmate_allow_web')).toBe('1')
    expect(localStorage.getItem('other_app_key')).toBe('keep me')
  })

  it('rolls back to the snapshot when a write fails', () => {
    const parsed = parseBackup(JSON.stringify({
      format: 'chatmate-backup', schemaVersion: 1, exportedAt: '2026-11-06T12:00:00.000Z',
      entries: { chatmate_userProgress: '{"xp":5}', chatmate_mistakes: '{"items":[]}' },
    }))
    // Storage that hits its quota on the second write of the restore
    let calls = 0
    const failing = {
      get length() { return localStorage.length },
      key: i => localStorage.key(i),
      getItem: k => localStorage.getItem(k),
      removeItem: k => localStorage.removeItem(k),
      setItem(k, v) {
        calls++
        if (calls === 2) throw new DOMException('full', 'QuotaExceededError')
        localStorage.setItem(k, v)
      },
    }
    expect(() => applyRestore(parsed, failing)).toThrow(/full/)
    for (const [key, value] of Object.entries(original)) {
      expect(localStorage.getItem(key), key).toBe(value)
    }
  })

  it('a corrupt file changes nothing', () => {
    const dump = () => Object.fromEntries(Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)).map(k => [k, localStorage.getItem(k)]))
    const before = dump()
    expect(() => parseBackup('{"format":"chatmate-backup","schemaVersion":1,"exportedAt":"2026-11-06","entries":{"chatmate_mistakes":"{"}}')).toThrow()
    expect(dump()).toEqual(before)
  })
})

describe('clearAllData', () => {
  beforeEach(seed)

  it('removes every whitelisted key and the old SRS key, keeps the device id', () => {
    clearAllData()
    expect(localStorage.getItem('chatmate_srsProgress')).toBeNull()
    expect(localStorage.getItem('chatmate_srs')).toBeNull()
    expect(localStorage.getItem('chatmate_en_emma_beginner')).toBeNull()
    expect(localStorage.getItem('chatmate_diary_entry_abc123')).toBeNull()
    expect(localStorage.getItem('chatmate_memory_emma')).toBeNull()
    expect(localStorage.getItem('chatmate_speaking_queue')).toBeNull()
    expect(localStorage.getItem('chatmate_clientId')).toBe('client_abc')
    expect(localStorage.getItem('chatmate_allow_web')).toBe('1')
    expect(localStorage.getItem('other_app_key')).toBe('keep me')
  })
})
