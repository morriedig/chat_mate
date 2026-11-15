import { describe, it, expect, vi, afterEach } from 'vitest'

// The values of the capacitor.config.json this file replaced; the English iOS app must keep them
const OLD_ENGLISH_JSON = {
  appId: 'com.morrie.chatmate',
  appName: 'Chat Mate',
  webDir: 'dist',
  server: {
    url: 'https://morriedig.github.io/chat_mate/app/',
    allowNavigation: ['morriedig.github.io', 'script.google.com', 'script.googleusercontent.com'],
  },
  ios: {
    contentInset: 'never',
    backgroundColor: '#101c22',
  },
}

async function loadConfig(edition) {
  vi.resetModules()
  if (edition === undefined) vi.stubEnv('CHATMATE_EDITION', undefined)
  else vi.stubEnv('CHATMATE_EDITION', edition)
  return (await import('../../../capacitor.config.ts')).default
}

describe('capacitor.config.ts', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('gives the English app exactly the old JSON config when CHATMATE_EDITION is unset', async () => {
    expect(await loadConfig(undefined)).toStrictEqual(OLD_ENGLISH_JSON)
  })

  it('gives Chat Mate 華語 its own app id, name, web dir, URL and ios-zh project', async () => {
    expect(await loadConfig('zh')).toStrictEqual({
      appId: 'com.morrie.chatmate.zh',
      appName: 'Chat Mate 華語',
      webDir: 'dist-zh',
      server: {
        url: 'https://morriedig.github.io/chat_mate/zh/app/',
        allowNavigation: OLD_ENGLISH_JSON.server.allowNavigation,
      },
      ios: {
        path: 'ios-zh',
        contentInset: 'never',
        backgroundColor: '#101c22',
      },
    })
  })
})
