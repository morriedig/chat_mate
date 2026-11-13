// Chapter YAML `icon` → Material Symbols name for the learning screen.
// Older chapters use emoji, mapped here by topic. New chapters write the
// Material Symbols name itself (e.g. "update"), which is used as-is.
// Anything else falls back to menu_book.
const EMOJI_SYMBOLS = {
  '🍽️': 'restaurant',
  '👨‍👩‍👧‍👦': 'group',
  '🏠': 'home',
  '🌤️': 'partly_cloudy_day',
  '⏰': 'schedule',
  '☀️': 'wb_sunny',
  '🚌': 'directions_bus',
  '👕': 'apparel',
  '🏥': 'local_hospital',
  '🎮': 'sports_esports',
  '📖': 'auto_stories',
  '💬': 'forum',
  '🎭': 'theater_comedy',
  '🧳': 'luggage',
  '🎬': 'movie',
  '🔮': 'event_upcoming',
  '🏆': 'workspace_premium',
  '🪪': 'badge',
  '💡': 'lightbulb',
  '⚡': 'speed',
  '🙅': 'block',
  '🤝': 'handshake',
  '❓': 'help',
  '🗣️': 'record_voice_over',
  '☝️': 'info',
  '🤔': 'psychology_alt',
}

const SYMBOL_NAME = /^[a-z][a-z0-9_]*$/

export function chapterSymbol(icon) {
  if (EMOJI_SYMBOLS[icon]) return EMOJI_SYMBOLS[icon]
  return typeof icon === 'string' && SYMBOL_NAME.test(icon) ? icon : 'menu_book'
}
