// Format date to local YYYY-MM-DD string
export function toLocalDateKey(date) {
  if (date == null) return null
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return null
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Get today's date as local YYYY-MM-DD
export function getTodayKey() {
  return toLocalDateKey(new Date())
}

// Map app language codes to BCP 47 locale codes
export const LOCALE_MAP = { en: 'en-US', ja: 'ja-JP', zh: 'zh-TW' }
