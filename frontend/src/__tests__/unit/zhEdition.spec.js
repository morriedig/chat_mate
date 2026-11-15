import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Chinese edition: Taiwan Mandarin for English speakers
vi.mock('../../edition', async () => (await import('../helpers/editions.js')).zhEdition)

const ZH_PATTERNS = [
  {
    id: 'pattern:beginner:yao',
    level: 'beginner',
    pattern: '我要……',
    meaning: 'I want …',
    examples: [
      { zh: '我要一杯珍奶。', en: 'I want a bubble tea.', pinyin: 'wǒ yào yì bēi zhēn nǎi.' },
      { zh: '我要這個。', en: 'I want this one.', pinyin: 'wǒ yào zhè ge.' },
    ],
    choice: { situation: '', options: ['我要一杯咖啡。', '我一杯要咖啡。'], answer: 0 },
    task: '',
    match: ['我要'],
  },
  {
    id: 'pattern:beginner:qingwen',
    level: 'beginner',
    pattern: '請問……',
    meaning: 'Excuse me, …',
    examples: [
      { zh: '請問捷運站在哪裡？', en: 'Excuse me, where is the MRT station?', pinyin: 'qǐng wèn jié yùn zhàn zài nǎ lǐ?' },
      { zh: '請問多少錢？', en: 'Excuse me, how much is it?', pinyin: 'qǐng wèn duō shǎo qián?' },
    ],
    choice: { situation: '', options: ['請問廁所在哪裡？', '廁所請問在哪裡？'], answer: 0 },
    task: '',
    match: ['請問'],
  },
]

describe('buildListening (Chinese edition)', () => {
  it('reads zh as the sentence, en as the translation, and keeps the pinyin', async () => {
    const { buildListening } = await import('../../composables/useDailyPractice')
    const items = buildListening([ZH_PATTERNS[0]], [], ZH_PATTERNS)
    expect(items.map(i => i.mode)).toEqual(['choose', 'dictation'])
    expect(items[0]).toMatchObject({ zh: '我要一杯珍奶。', en: 'I want a bubble tea.', pinyin: 'wǒ yào yì bēi zhēn nǎi.' })
    expect(items[0].options).toContain('我要一杯珍奶。')
    expect(items[0].options).toHaveLength(3)
    expect(items[1]).toMatchObject({ zh: '我要這個。', en: 'I want this one.', pinyin: 'wǒ yào zhè ge.' })
  })

  it('skips examples with no Chinese sentence', async () => {
    const { buildListening } = await import('../../composables/useDailyPractice')
    expect(buildListening([{ id: 'p', examples: [{ en: 'only English' }] }], [], [])).toEqual([])
  })
})

describe('isValidCoreAnswer (Chinese edition)', () => {
  it('needs at least 2 Chinese characters when typed', async () => {
    const { isValidCoreAnswer } = await import('../../composables/useDailyPractice')
    expect(isValidCoreAnswer('text', '好')).toBe(false)
    expect(isValidCoreAnswer('text', 'ok fine')).toBe(false)
    expect(isValidCoreAnswer('text', '好啊')).toBe(true)
    expect(isValidCoreAnswer('voice', '好')).toBe(true)
  })
})

describe('useDailyPractice (Chinese edition)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })
  afterEach(() => {
    vi.doUnmock('../../data/dailyLoader')
  })

  it('starts at beginner and loads the Chinese daily content', async () => {
    const getDailyPatterns = vi.fn(() => ZH_PATTERNS)
    const getDailyVocab = vi.fn(() => [])
    vi.doMock('../../data/dailyLoader', () => ({ getDailyPatterns, getDailyVocab }))
    const { useDailyPractice } = await import('../../composables/useDailyPractice')
    const practice = useDailyPractice()

    expect(practice.level.value).toBe('beginner')
    expect(practice.levels).toEqual(['beginner'])
    expect(getDailyPatterns).toHaveBeenCalledWith('beginner', 'zh')
    expect(getDailyVocab).toHaveBeenCalledWith('beginner', 'zh')
    expect(practice.todayListening.value[0].zh).toBe('我要一杯珍奶。')
  })

  it('ignores a saved English-edition level it has no content for', async () => {
    localStorage.setItem('chatmate_daily_practice', JSON.stringify({ version: 2, level: 'intermediate', plans: {} }))
    vi.doMock('../../data/dailyLoader', () => ({ getDailyPatterns: () => ZH_PATTERNS, getDailyVocab: () => [] }))
    const { useDailyPractice } = await import('../../composables/useDailyPractice')
    expect(useDailyPractice().level.value).toBe('beginner')
  })
})

describe('feedback requests (Chinese edition)', () => {
  async function load(path) {
    vi.resetModules()
    vi.stubEnv('VITE_API_URL', 'http://api.test/chat')
    vi.doMock('../../composables/useChatApi', () => ({
      getAuthToken: vi.fn(() => Promise.resolve('token')),
      requestAuthToken: vi.fn(() => Promise.resolve('token2')),
      clearAuthToken: vi.fn(),
    }))
    return import(path)
  }
  function mockFetch(body) {
    const fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve(body) }))
    vi.stubGlobal('fetch', fetch)
    return fetch
  }
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it("sentence check sends language: 'zh'", async () => {
    const fetch = mockFetch({ success: true, check: {} })
    const { useSentenceCheck } = await load('../../composables/useSentenceCheck')
    await useSentenceCheck().checkSentence({ sentence: '我要一杯咖啡', pattern: '我要……', meaning: '', task: '', level: 'beginner', nativeLanguage: 'en' })
    expect(JSON.parse(fetch.mock.calls[0][1].body).language).toBe('zh')
  })

  it("chat summary sends language: 'zh'", async () => {
    const fetch = mockFetch({ success: true, summary: { points: [] } })
    const { useChatSummary } = await load('../../composables/useChatSummary')
    await useChatSummary().summarize({ messages: [{ role: 'user', content: '你好' }], level: 'beginner', nativeLanguage: 'en' })
    expect(JSON.parse(fetch.mock.calls[0][1].body).language).toBe('zh')
  })
})

describe('pinyin (Chinese edition)', () => {
  async function toPinyin() {
    const { loadPinyin } = await import('../../utils/pinyin')
    return loadPinyin()
  }

  it('converts Traditional to Simplified one character at a time (same length)', async () => {
    const { default: OpenCC } = await import('opencc-js/t2cn')
    const toSimplified = OpenCC.Converter({ from: 'tw', to: 'cn' })
    for (const text of ['計程車', '我去銀行還沒到', '你怎麼了？', '頭髮長得很長', '這個東西多少錢？']) {
      expect(toSimplified(text)).toHaveLength(text.length)
    }
    expect(toSimplified('計程車')).toBe('计程车')
  })

  it('reads common words right after conversion', async () => {
    const annotate = await toPinyin()
    expect(annotate('怎麼')).toBe('zěn me')
    expect(annotate('銀行')).toBe('yín háng')
    expect(annotate('還沒')).toBe('hái méi')
  })

  it('reads 長得 as zhǎng de', async () => {
    expect(await toPinyin().then(a => a('他長得很高'))).toBe('tā zhǎng de hěn gāo')
  })

  it('uses the Taiwan reading of 垃圾', async () => {
    expect(await toPinyin().then(a => a('倒垃圾'))).toBe('dǎo lè sè')
  })

  it('leaves 東西南北 alone', async () => {
    expect(await toPinyin().then(a => a('東西南北'))).toBe('dōng xī nán běi')
  })

  it('keeps punctuation after the syllable before it and skips non-Chinese spacing', async () => {
    expect(await toPinyin().then(a => a('你好嗎？我很好。'))).toBe('nǐ hǎo ma？ wǒ hěn hǎo。')
  })
})
