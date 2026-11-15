import type { CapacitorConfig } from '@capacitor/cli'

/**
 * Capacitor config for both iOS apps. The CLI only reads capacitor.config.{ts,js,json} from the
 * cwd, so the edition comes from the CHATMATE_EDITION env var:
 * - unset (default): the English app, com.morrie.chatmate, native project in ios/
 * - 'zh': Chat Mate 華語, com.morrie.chatmate.zh, native project in ios-zh/
 * Plan: docs/plans/zh-edition.md (9. iOS); build steps: docs/ios.md
 */
const allowNavigation = ['morriedig.github.io', 'script.google.com', 'script.googleusercontent.com']

const english: CapacitorConfig = {
  appId: 'com.morrie.chatmate',
  appName: 'Chat Mate',
  webDir: 'dist',
  server: {
    url: 'https://morriedig.github.io/chat_mate/app/',
    allowNavigation,
  },
  ios: {
    contentInset: 'never',
    backgroundColor: '#101c22',
  },
}

const chinese: CapacitorConfig = {
  appId: 'com.morrie.chatmate.zh',
  appName: 'Chat Mate 華語',
  webDir: 'dist-zh',
  server: {
    url: 'https://morriedig.github.io/chat_mate/zh/app/',
    allowNavigation,
  },
  ios: {
    path: 'ios-zh',
    contentInset: 'never',
    backgroundColor: '#101c22',
  },
}

export function capacitorConfig(edition: string | undefined): CapacitorConfig {
  return edition === 'zh' ? chinese : english
}

export default capacitorConfig(process.env.CHATMATE_EDITION)
