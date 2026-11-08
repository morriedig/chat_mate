// Full backup / restore of the app's localStorage data.
// Backup file: { format: 'chatmate-backup', schemaVersion: 1, exportedAt, appVersion, entries: { key: rawString } }
// Only whitelisted keys go in or come out; restore replaces every whitelisted key
// (no per-record merge) and rolls back if any write fails.

export const BACKUP_FORMAT = 'chatmate-backup'
export const SCHEMA_VERSION = 1
export const APP_VERSION = 'build-5'
export const MAX_BACKUP_BYTES = 20 * 1024 * 1024

// value kinds: 'json' = JSON text, 'chat' = base64(encodeURIComponent(JSON)) from useChatStorage,
// 'text' = free text, or a validator function for small plain-string settings
const isOneOf = (...values) => v => values.includes(v)
const shortWord = v => /^[A-Za-z-]{1,16}$/.test(v)

export const FIXED_KEYS = {
  // progress and gamification
  chatmate_userProgress: { category: 'progress', kind: 'json' },
  chatmate_dailyGoal: { category: 'progress', kind: 'json' },
  chatmate_dailyChallenge: { category: 'progress', kind: 'json' },
  chatmate_weeklyQuests: { category: 'progress', kind: 'json' },
  chatmate_placementResult: { category: 'progress', kind: 'json' },
  chatmate_progress_seen: { category: 'progress', kind: 'json' },
  // practice
  chatmate_srsProgress: { category: 'practice', kind: 'json' },
  chatmate_mistakes: { category: 'practice', kind: 'json' },
  chatmate_daily_practice: { category: 'practice', kind: 'json' },
  chatmate_daily_opinion: { category: 'practice', kind: 'json' },
  chatmate_vocabBank: { category: 'practice', kind: 'json' },
  chatmate_learningProgress: { category: 'practice', kind: 'json' },
  chatmate_preLessonProgress: { category: 'practice', kind: 'json' },
  chatmate_retell: { category: 'practice', kind: 'json' },
  chatmate_scenarios: { category: 'practice', kind: 'json' },
  chatmate_speaking_queue: { category: 'practice', kind: 'json' },
  chatmate_speaking_sessions: { category: 'practice', kind: 'json' },
  chatmate_rescue_stats: { category: 'practice', kind: 'json' },
  chatmate_personal_scenarios: { category: 'practice', kind: 'json' },
  // chats
  chatmate_opinionChat: { category: 'chats', kind: 'json' },
  chatmate_lastSession: { category: 'chats', kind: 'json' },
  // diary
  chatmate_diary_entries: { category: 'diary', kind: 'json' },
  chatmate_diary_pending_feedback: { category: 'diary', kind: 'json' },
  chatmate_diary_draft: { category: 'diary', kind: 'text' },
  // character memory
  chatmate_memory_sessions: { category: 'memory', kind: 'json' },
  // settings
  chatmate_darkMode: { category: 'settings', kind: isOneOf('dark', 'light') },
  chatmate_locale: { category: 'settings', kind: shortWord },
  chatmate_motherTongue: { category: 'settings', kind: shortWord },
  chatmate_voice_pause_ms: { category: 'settings', kind: v => /^\d{1,6}$/.test(v) },
  chatmate_onboarded: { category: 'settings', kind: isOneOf('1') },
  chatmate_home_more_open: { category: 'settings', kind: isOneOf('0', '1') },
}

// Device identity, web-preview flag, the obsolete SRS key and the one-shot placement hand-off
export const EXCLUDED_KEYS = [
  'chatmate_clientId',
  'chatmate_allow_web',
  'chatmate_srs',
  'chatmate_placement_result',
]

const LEVELS = '(?:beginner|intermediate|advanced)'
export const DYNAMIC_PATTERNS = [
  // useDiaryStorage: chatmate_diary_entry_<id>
  { re: /^chatmate_diary_entry_[A-Za-z0-9_-]{1,64}$/, category: 'diary', kind: 'json' },
  // useCharacterMemory: chatmate_memory_<characterId>
  { re: /^chatmate_memory_[a-z][a-z0-9-]{0,39}$/, category: 'memory', kind: 'json' },
  // useChatStorage: chatmate_<language>_<character>_<level>[_article_<id> | _opinion | _mission_<id> | _task_<date>_<id>]
  { re: new RegExp(`^chatmate_[a-z]{2}_[a-z][a-z0-9-]{0,39}_${LEVELS}(?:_[A-Za-z0-9_-]{1,120})?$`), category: 'chats', kind: 'chat' },
]

export const CATEGORIES = ['progress', 'practice', 'chats', 'diary', 'memory', 'settings']

export function classifyKey(key) {
  if (typeof key !== 'string' || EXCLUDED_KEYS.includes(key)) return null
  if (Object.prototype.hasOwnProperty.call(FIXED_KEYS, key)) return FIXED_KEYS[key]
  return DYNAMIC_PATTERNS.find(p => p.re.test(key)) || null
}

export function isBackupKey(key) {
  return classifyKey(key) !== null
}

function decodeChat(value) {
  return JSON.parse(decodeURIComponent(atob(value)))
}

export function isValidValue(key, value) {
  const rule = classifyKey(key)
  if (!rule || typeof value !== 'string') return false
  try {
    if (rule.kind === 'json') {
      JSON.parse(value)
      return true
    }
    if (rule.kind === 'chat') {
      if (value === '') return true
      const parsed = decodeChat(value)
      return parsed !== null && typeof parsed === 'object'
    }
    if (rule.kind === 'text') return true
    return rule.kind(value)
  } catch {
    return false
  }
}

function storageKeys(storage) {
  const keys = []
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)
    if (key !== null) keys.push(key)
  }
  return keys
}

export function readWhitelisted(storage = localStorage) {
  const entries = {}
  for (const key of storageKeys(storage)) {
    if (!isBackupKey(key)) continue
    const value = storage.getItem(key)
    if (value !== null) entries[key] = value
  }
  return entries
}

export function buildBackup(storage = localStorage, now = new Date()) {
  const entries = readWhitelisted(storage)
  const sorted = {}
  for (const key of Object.keys(entries).sort()) sorted[key] = entries[key]
  return {
    format: BACKUP_FORMAT,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: now.toISOString(),
    appVersion: APP_VERSION,
    entries: sorted,
  }
}

export function backupFileName(now = new Date()) {
  const pad = n => String(n).padStart(2, '0')
  return `chatmate-backup-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.json`
}

export class BackupError extends Error {
  constructor(code) {
    super(code)
    this.code = code // 'invalid' | 'unsupported' | 'corrupt' | 'tooLarge'
  }
}

// Parse and validate a backup file's text. Throws BackupError; never touches storage.
// Returns { exportedAt, appVersion, entries (whitelisted, validated), ignored: [keys] }
export function parseBackup(text) {
  if (typeof text !== 'string') throw new BackupError('invalid')
  if (text.length > MAX_BACKUP_BYTES) throw new BackupError('tooLarge')
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new BackupError('invalid')
  }
  if (!data || typeof data !== 'object' || Array.isArray(data) || data.format !== BACKUP_FORMAT) {
    throw new BackupError('invalid')
  }
  if (data.schemaVersion !== SCHEMA_VERSION) throw new BackupError('unsupported')
  if (typeof data.exportedAt !== 'string' || Number.isNaN(Date.parse(data.exportedAt))) {
    throw new BackupError('invalid')
  }
  const raw = data.entries
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new BackupError('invalid')

  const entries = {}
  const ignored = []
  for (const [key, value] of Object.entries(raw)) {
    if (!isBackupKey(key)) {
      ignored.push(key)
      continue
    }
    // A whitelisted key with broken content means the file is damaged: refuse the whole file
    if (!isValidValue(key, value)) throw new BackupError('corrupt')
    entries[key] = value
  }
  return {
    exportedAt: data.exportedAt,
    appVersion: typeof data.appVersion === 'string' ? data.appVersion : '',
    entries,
    ignored,
  }
}

// What a restore would do to the current storage
export function previewRestore(parsed, storage = localStorage) {
  const current = readWhitelisted(storage)
  const incoming = Object.keys(parsed.entries)
  const add = incoming.filter(k => !(k in current))
  const overwrite = incoming.filter(k => k in current)
  const remove = Object.keys(current).filter(k => !(k in parsed.entries))
  const categories = {}
  for (const key of incoming) {
    const { category } = classifyKey(key)
    categories[category] = (categories[category] || 0) + 1
  }
  return {
    exportedAt: parsed.exportedAt,
    appVersion: parsed.appVersion,
    categories: CATEGORIES.filter(c => categories[c]).map(c => ({ id: c, count: categories[c] })),
    add,
    overwrite,
    remove,
    ignore: [...parsed.ignored],
  }
}

function removeWhitelisted(storage) {
  for (const key of storageKeys(storage)) {
    if (isBackupKey(key)) storage.removeItem(key)
  }
}

// Replace every whitelisted key with the backup. On any failure, put the snapshot back and rethrow.
export function applyRestore(parsed, storage = localStorage) {
  const snapshot = readWhitelisted(storage)
  try {
    removeWhitelisted(storage)
    for (const [key, value] of Object.entries(parsed.entries)) {
      storage.setItem(key, value)
    }
  } catch (err) {
    try {
      removeWhitelisted(storage)
      for (const [key, value] of Object.entries(snapshot)) storage.setItem(key, value)
    } catch {
      // nothing more we can do; the original error is what the user sees
    }
    throw err
  }
}

// "Clear all data": every whitelisted key plus leftovers, keeping the device id and web flag
export function clearAllData(storage = localStorage) {
  removeWhitelisted(storage)
  storage.removeItem('chatmate_srs')
  storage.removeItem('chatmate_placement_result')
}

function isShareCancel(err) {
  return /cancel/i.test(String(err?.message || err || ''))
}

function downloadInBrowser(json, fileName) {
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

async function shareOnDevice(json, fileName) {
  const [{ Filesystem, Directory, Encoding }, { Share }] = await Promise.all([
    import('@capacitor/filesystem'),
    import('@capacitor/share'),
  ])
  const { uri } = await Filesystem.writeFile({
    path: fileName,
    data: json,
    directory: Directory.Cache,
    encoding: Encoding.UTF8,
  })
  try {
    await Share.share({ title: fileName, files: [uri] })
  } catch (err) {
    if (!isShareCancel(err)) throw err
    return 'cancelled'
  }
  return 'shared'
}

async function isNative() {
  try {
    const { Capacitor } = await import('@capacitor/core')
    return Capacitor.isNativePlatform()
  } catch {
    return false
  }
}

// Export: share sheet on iOS (Files / iCloud Drive), download link on the web.
// Returns 'shared' | 'cancelled' | 'downloaded'
export async function exportBackup(storage = localStorage) {
  const now = new Date()
  const json = JSON.stringify(buildBackup(storage, now), null, 2)
  const fileName = backupFileName(now)
  if (await isNative()) {
    try {
      return await shareOnDevice(json, fileName)
    } catch (err) {
      // An app build without the plugins reports UNIMPLEMENTED; fall back to the download link
      if (err?.code !== 'UNIMPLEMENTED' && !/not implemented/i.test(String(err?.message))) throw err
    }
  }
  downloadInBrowser(json, fileName)
  return 'downloaded'
}

// Opens the file picker; resolves with the file's text, or null when nothing was chosen
export function pickBackupFile() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'
    input.onchange = async () => {
      const file = input.files && input.files[0]
      if (!file) return resolve(null)
      if (file.size > MAX_BACKUP_BYTES) return reject(new BackupError('tooLarge'))
      try {
        resolve(await file.text())
      } catch {
        reject(new BackupError('invalid'))
      }
    }
    input.click()
  })
}
