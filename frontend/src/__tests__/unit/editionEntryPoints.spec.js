import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { zhEdition, enEdition } from '../helpers/editions'
import en from '../../i18n/locales/en.json'
import zhEditionEn from '../../i18n/locales/zh-edition.en.json'

// Loads a module fresh, as the Chinese edition (zh) or the default English build (en)
async function load(path, edition) {
  vi.resetModules()
  vi.doMock('../../edition', () => (edition === 'zh' ? zhEdition : enEdition))
  return import(path)
}

afterEach(() => {
  vi.doUnmock('../../edition')
  vi.resetModules()
})

describe('i18n per edition', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('keeps the saved interface language and the English strings in the English build', async () => {
    localStorage.setItem('chatmate_locale', 'zh')
    const { default: i18n } = await load('../../i18n/index.js', 'en')

    expect(i18n.global.locale.value).toBe('zh')
    expect(i18n.global.t('app.subtitle', {}, { locale: 'en' })).toBe(en.app.subtitle)
  })

  it('fixes the Chinese edition to English and ignores the saved interface language', async () => {
    localStorage.setItem('chatmate_locale', 'zh')
    const { default: i18n } = await load('../../i18n/index.js', 'zh')

    expect(i18n.global.locale.value).toBe('en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('says Mandarin instead of English in the Chinese edition and keeps every other string', async () => {
    const { default: i18n } = await load('../../i18n/index.js', 'zh')
    const t = i18n.global.t

    expect(t('app.subtitle')).toBe('Turn the Mandarin you know into Mandarin you can say')
    expect(t('setup.yourLevel')).toBe('Your Mandarin level')
    expect(t('dailyPractice.speak.typeNote')).toContain('2 Chinese characters')
    expect(t('setup.startChatting')).toBe(en.setup.startChatting)
  })

  it('does not point to the diary or role-play, which the Chinese edition hides', async () => {
    const { default: i18n } = await load('../../i18n/index.js', 'zh')
    const hint = i18n.global.t('home.moreHint')

    expect(hint).not.toMatch(/diary|role-play/i)
    expect(hint).toContain('learning record')
  })

  it('only overrides strings that exist in en.json, besides the new friends', () => {
    const missing = []
    function walk(over, base, path) {
      for (const [key, value] of Object.entries(over)) {
        const here = path ? `${path}.${key}` : key
        if (typeof value === 'object') walk(value, base?.[key], here)
        else if (typeof base?.[key] !== 'string') missing.push(here)
      }
    }
    walk(zhEditionEn, en, '')
    expect(missing).toEqual(['characters.meiling.tagline', 'characters.zhiwei.tagline'])
  })

  it('leaves no string that says English in the Chinese edition', async () => {
    const { default: i18n } = await load('../../i18n/index.js', 'zh')
    const messages = i18n.global.getLocaleMessage('en')
    expect(JSON.stringify(messages)).not.toMatch(/English/)
  })
})

describe('nav state per edition', () => {
  it('starts chats in the language the edition teaches', async () => {
    const zh = await load('../../composables/useNavState.js', 'zh')
    expect(zh.useNavState().selectedLanguage.value).toBe('zh')
    const en = await load('../../composables/useNavState.js', 'en')
    expect(en.useNavState().selectedLanguage.value).toBe('en')
  })
})

describe('router per edition', () => {
  const HIDDEN_PATHS = ['/articles', '/placement-test', '/diary', '/daily-opinion', '/retell']
  const route = (router, path) => router.getRoutes().find(r => r.path === path)

  it('sends hidden pages back home in the Chinese edition', async () => {
    const { default: router } = await load('../../router.js', 'zh')
    for (const path of HIDDEN_PATHS) {
      expect(route(router, path).redirect, path).toBe('/')
    }
    expect(route(router, '/daily-practice').redirect).toBeUndefined()
  })

  it('keeps every page in the English build', async () => {
    const { default: router } = await load('../../router.js', 'en')
    for (const path of HIDDEN_PATHS) {
      expect(route(router, path).redirect, path).toBeUndefined()
    }
  })
})

describe('weekly quests per edition', () => {
  it('never picks diary or daily challenge quests in the Chinese edition', async () => {
    const { QUEST_POOL } = await load('../../composables/useWeeklyQuests.js', 'zh')
    const ids = QUEST_POOL.map(q => q.id)
    expect(ids.some(id => id.startsWith('diary_') || id === 'challenge_3')).toBe(false)
    expect(ids).toContain('chat_5')
  })

  it('keeps the whole pool in the English build', async () => {
    const { QUEST_POOL } = await load('../../composables/useWeeklyQuests.js', 'en')
    expect(QUEST_POOL).toHaveLength(16)
  })
})

describe('achievements per edition', () => {
  it('drops diary, article and unreachable achievements in the Chinese edition', async () => {
    const { ACHIEVEMENTS } = await load('../../composables/useAchievements.js', 'zh')
    const ids = ACHIEVEMENTS.map(a => a.id)
    expect(ACHIEVEMENTS.some(a => a.category === 'writing')).toBe(false)
    expect(ids).not.toContain('bookworm')
    expect(ids).not.toContain('polyglot')
    expect(ids).not.toContain('hiragana_master')
    expect(ids).not.toContain('script_scholar')
    expect(ids).toContain('first_chat')
  })

  it('keeps all achievements in the English build', async () => {
    const { ACHIEVEMENTS } = await load('../../composables/useAchievements.js', 'en')
    expect(ACHIEVEMENTS).toHaveLength(24)
  })
})

describe('task chat topics per edition', () => {
  it('picks a Taiwan-life beginner task in the Chinese edition', async () => {
    const { pickTask, TASKS_ZH } = await load('../../composables/usePatternTask.js', 'zh')
    expect(TASKS_ZH.length).toBeGreaterThanOrEqual(4)
    expect(TASKS_ZH).toContain(pickTask(new Date('2026-11-15T00:00:00Z')))
    for (const task of TASKS_ZH) expect(task.en && task.zh).toBeTruthy()
  })

  it('keeps the English tasks in the English build', async () => {
    const { pickTask, TASKS } = await load('../../composables/usePatternTask.js', 'en')
    expect(TASKS).toContain(pickTask(new Date('2026-11-15T00:00:00Z')))
  })
})

describe('characterFor', () => {
  it('keeps the preferred friend when they speak the language', async () => {
    const { characters, characterFor } = await import('../../data/characters.js')
    const marcus = characters.find(c => c.id === 'marcus')
    expect(characterFor('en', marcus)).toBe(marcus)
  })

  it('switches to the first friend who speaks the language', async () => {
    const { characters, characterFor } = await import('../../data/characters.js')
    const emma = characters.find(c => c.id === 'emma')
    expect(characterFor('zh', emma).id).toBe('meiling')
    expect(characterFor('en', null).id).toBe('emma')
  })

  it('has two Taiwanese friends who only speak Mandarin', async () => {
    const { characters } = await import('../../data/characters.js')
    const zh = characters.filter(c => c.languages.includes('zh'))
    expect(zh.map(c => c.id)).toEqual(['meiling', 'zhiwei'])
    expect(zh.every(c => c.languages.length === 1)).toBe(true)
  })
})

describe('task chat launcher per edition', () => {
  const setChatState = vi.fn()
  const push = vi.fn()

  async function launch(edition, selected) {
    vi.resetModules()
    setChatState.mockClear()
    vi.doMock('vue-router', () => ({ useRouter: () => ({ push }) }))
    vi.doMock('../../composables/useNavState', async () => {
      const { ref } = await import('vue')
      return { useNavState: () => ({ setChatState, selectedCharacter: ref(selected) }) }
    })
    vi.doMock('../../composables/useDailyPractice', async () => {
      const { ref } = await import('vue')
      return { useDailyPractice: () => ({ todayPatterns: ref([]), level: ref(null) }) }
    })
    vi.doMock('../../edition', () => (edition === 'zh' ? zhEdition : enEdition))
    const { useTaskChatLauncher } = await import('../../composables/useTaskChatLauncher.js')
    useTaskChatLauncher().startTaskChat()
    return setChatState.mock.calls[0][0]
  }

  afterEach(() => {
    vi.doUnmock('vue-router')
    vi.doUnmock('../../composables/useNavState')
    vi.doUnmock('../../composables/useDailyPractice')
  })

  it('chats in Mandarin with a Taiwanese friend at beginner level in the Chinese edition', async () => {
    const emma = { id: 'emma', languages: ['en'] }
    const state = await launch('zh', emma)
    expect(state.language).toBe('zh')
    expect(state.character.id).toBe('meiling')
    expect(state.level.id).toBe('beginner')
  })

  it('keeps English, the chosen friend and intermediate in the English build', async () => {
    const marcus = { id: 'marcus', languages: ['en', 'ja'] }
    const state = await launch('en', marcus)
    expect(state.language).toBe('en')
    expect(state.character).toEqual(marcus)
    expect(state.level.id).toBe('intermediate')
  })
})
