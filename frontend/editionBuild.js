/**
 * Build settings for each edition (VITE_EDITION), used by vite.config.js.
 * The app reads its edition from src/edition.js; this file runs in Node at build time,
 * where import.meta.env isn't available, so the names are repeated here.
 * Plan: docs/plans/zh-edition.md
 */
const SETTINGS = {
  en: {
    base: '/chat_mate/app/',
    publicDir: 'public',
    outDir: 'dist',
    appName: 'Chat Mate',
    manifestName: 'Chat Mate - AI Language Learning',
    description: 'Practice languages with AI friends',
    appleTouchIcon: 'icons/apple-touch-icon.png',
  },
  zh: {
    base: '/chat_mate/zh/app/',
    // Icons and other static files of the Chinese app (public/ stays the English app's)
    publicDir: 'public-zh',
    outDir: 'dist-zh',
    appName: 'Chat Mate 華語',
    manifestName: 'Chat Mate 華語 - Learn Taiwan Mandarin',
    description: 'Learn Taiwan Mandarin by chatting with AI friends',
    appleTouchIcon: 'icons/apple-touch-icon.png',
  },
}

export function resolveEdition(value) {
  return value === 'zh' ? 'zh' : 'en'
}

/**
 * @param {string} edition - 'en' or 'zh'
 * @param {{ githubPages?: boolean }} options - GitHub Pages serves the app under /chat_mate/…; local dev uses '/'
 */
export function editionBuild(edition, { githubPages = false } = {}) {
  const settings = SETTINGS[resolveEdition(edition)]
  return { ...settings, base: githubPages ? settings.base : '/' }
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * index.html is shared; `define` doesn't reach HTML, so the title, description and
 * apple-touch-icon are swapped here. The English build gets the same values as index.html.
 */
export function transformIndexHtml(html, settings) {
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(settings.appName)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${escapeHtml(settings.description)}$2`)
    .replace(/(<link rel="apple-touch-icon" href=")[^"]*(")/, `$1${escapeHtml(settings.appleTouchIcon)}$2`)
}
