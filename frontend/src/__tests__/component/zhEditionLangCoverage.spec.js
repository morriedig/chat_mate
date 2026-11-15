import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import { zhEdition, enEdition } from '../helpers/editions'
import { hanCoverage, langAttributes } from '../helpers/langCoverage'

// Guard: in the Chinese edition every piece of Chinese text on these screens sits inside
// lang="zh-Hant-TW" (Traditional glyphs), and the English edition renders no lang at all.
// A new screen that shows target-language content gets a scenario here.
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: key => key, locale: ref('en') }) }))
vi.mock('vue-router', () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn() }) }))
vi.mock('../../utils/tts', () => ({
  playTTS: vi.fn().mockResolvedValue(undefined),
  stopTTS: vi.fn(),
  isTTSAvailable: () => true,
  splitTextForHighlight: text => text.split(' '),
}))
// Speech recognition is off unless a scenario turns it on (listening states with a live transcript)
const stt = vi.hoisted(() => ({ available: false, listenOnce: null }))
vi.mock('../../utils/stt', () => ({
  isSTTAvailable: () => stt.available,
  listenOnce: (...args) => stt.listenOnce?.(...args) ?? new Promise(() => {}),
  stopListening: vi.fn(),
  extendListening: () => false,
}))
vi.mock('../../composables/useLearningProgress', () => ({
  useLearningProgress: () => ({
    markConversationCompleted: vi.fn(),
    markQuizCompleted: vi.fn(),
    getChapterCompletionStatus: () => ({ quiz: false, conversation: false, complete: false }),
  }),
}))
vi.mock('../../composables/useDailyGoal', () => ({ useDailyGoal: () => ({ startTimer: vi.fn(), stopTimer: vi.fn() }) }))
vi.mock('../../composables/useTaskChatLauncher', () => ({ useTaskChatLauncher: () => ({ startTaskChat: vi.fn() }) }))
vi.mock('../../composables/useSentenceCheck', async (importOriginal) => ({
  ...(await importOriginal()),
  useSentenceCheck: () => ({
    isChecking: ref(false),
    checkSentence: vi.fn(async () => ({
      usedPattern: true, isNatural: false, corrected: '我要一杯珍奶。', comment: 'Put the amount after the verb.', better: '我想要一杯珍奶。', errorType: 'other',
    })),
  }),
}))
vi.mock('../../composables/useChatSummary', () => ({
  useChatSummary: () => ({
    isLoading: ref(false),
    failure: ref(null),
    summarize: vi.fn(async () => ({
      points: [{ original: '我一杯要珍奶', hint: 'Where does the amount go?', corrected: '我要一杯珍奶', explanation: 'Amount after the verb.', type: 'word-choice' }],
      usedPatternIds: ['p1'],
      encouragement: 'Nice chat!',
      repeatTomorrow: { enabled: true, original: '我一杯要珍奶', target: '我要一杯珍奶', cue: 'Order a bubble tea', hint: '', patternId: 'p1' },
    })),
  }),
}))
vi.mock('../../composables/useSpeakingQueue', () => ({
  useSpeakingQueue: () => ({ queueRepeatTomorrow: () => ({ status: 'queued' }) }),
}))

// ---------- Chinese fixtures (explanations stay English: they are not tagged) ----------
const WORDS = [
  { id: 1, word: '珍奶', pinyin: 'zhēn nǎi', meaning: 'bubble tea', example: '我要一杯珍奶。', sentencePinyin: 'wǒ yào yì bēi zhēn nǎi.' },
  { id: 2, word: '捷運', pinyin: 'jié yùn', meaning: 'MRT', example: '我坐捷運。' },
  { id: 3, word: '便當', pinyin: 'biàn dāng', meaning: 'lunch box', example: '我買便當。' },
  { id: 4, word: '夜市', pinyin: 'yè shì', meaning: 'night market', example: '我去夜市。' },
]
const CLOZE = [
  { id: 'c1', type: 'cloze', sentence: '我___一杯珍奶。', answer: '要', options: ['要', '是', '在', '有'], explain: 'Use it for wanting something.' },
  { id: 'c2', type: 'cloze', sentence: '他___學生。', answer: '是', options: ['是', '要', '在', '有'], explain: 'Links two nouns.' },
]
const PATTERNS = [
  {
    id: 'pattern:beginner:yao', level: 'beginner', pattern: '我要……', pinyin: 'wǒ yào ……', meaning: 'I want …', when: '',
    examples: [{ zh: '我要一杯珍奶。', en: 'I want a bubble tea.', pinyin: 'wǒ yào yì bēi zhēn nǎi.' }],
    choice: { situation: 'At a drink shop', options: ['我要一杯珍奶。', '我一杯要珍奶。'], answer: 0, explain: 'The amount goes after the verb.' },
    task: 'Order something you like.', match: ['我要'],
    mistake: { wrong: '我一杯要珍奶。', right: '我要一杯珍奶。', why: 'The amount goes after the verb.' },
  },
  {
    id: 'pattern:beginner:xiang', level: 'beginner', pattern: '我想……', pinyin: 'wǒ xiǎng ……', meaning: 'I would like …', when: '',
    examples: [{ zh: '我想去夜市。', en: 'I would like to go to the night market.', pinyin: 'wǒ xiǎng qù yè shì.' }],
    choice: { situation: 'Making plans', options: ['我想去夜市。', '我去想夜市。'], answer: 0, explain: 'The verb comes after the helper.' },
    task: 'Say where you would like to go.', match: ['我想'],
    mistake: { wrong: '我去想夜市。', right: '我想去夜市。', why: 'The verb follows the helper.' },
  },
]
const VOCAB = [
  { id: 'word:beginner:yeshi', level: 'beginner', word: '夜市', pinyin: 'yè shì', pos: 'n.', meaning: 'night market', example: { zh: '我們去夜市吧。', en: "Let's go to the night market.", pinyin: 'wǒ men qù yè shì ba.' }, collocations: ['逛夜市'], note: '' },
  { id: 'word:beginner:jieyun', level: 'beginner', word: '捷運', pinyin: 'jié yùn', pos: 'n.', meaning: 'MRT', example: { zh: '我坐捷運。', en: 'I take the MRT.' }, collocations: [], note: '' },
  { id: 'word:beginner:biandang', level: 'beginner', word: '便當', pinyin: 'biàn dāng', pos: 'n.', meaning: 'lunch box', example: { zh: '我買便當。', en: 'I buy a lunch box.' }, collocations: [], note: '' },
]
const LISTEN_DICTATION = { id: 'listen:dictation', mode: 'dictation', zh: '我要這個。', en: 'I want this one.', pinyin: 'wǒ yào zhè ge.' }
const LISTEN_CHOOSE = { id: 'listen:choose', mode: 'choose', zh: '我要這個。', en: 'I want this one.', options: ['我要這個。', '我要那個。'] }
vi.mock('../../data/dailyLoader', () => ({
  getDailyPatterns: () => PATTERNS,
  getDailyVocab: () => VOCAB,
}))

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Core done; the extras are the second pattern, a word and a dictation
function seedPracticePlan() {
  const core = {
    errorKey: null, errorSource: 'builtin', patternId: PATTERNS[0].id, speakingSource: 'pattern', speakingItemId: null,
    fallbackPrompt: null, errorCompletedAt: null, patternCompletedAt: null, speakingAttempt: null, speakingMode: null,
    speakingCompletedAt: null, completedAt: '2026-11-15T00:00:00Z',
  }
  localStorage.setItem('chatmate_daily_practice', JSON.stringify({
    version: 2,
    level: 'beginner',
    plans: {
      [todayKey()]: {
        level: 'beginner', patternIds: PATTERNS.map(p => p.id), wordIds: [VOCAB[0].id], mistakeIds: [], bankIds: [],
        listening: [LISTEN_DICTATION], done: {}, core,
      },
    },
  }))
}

// Core done and every extra done except one listening item, so finishing it reaches the all-done screen
function seedAllButLastExtra() {
  const core = {
    errorKey: null, errorSource: 'builtin', patternId: PATTERNS[0].id, speakingSource: 'pattern', speakingItemId: null,
    fallbackPrompt: null, errorCompletedAt: null, patternCompletedAt: null, speakingAttempt: null, speakingMode: null,
    speakingCompletedAt: null, completedAt: '2026-11-15T00:00:00Z',
  }
  localStorage.setItem('chatmate_daily_practice', JSON.stringify({
    version: 2,
    level: 'beginner',
    plans: {
      [todayKey()]: {
        level: 'beginner', patternIds: PATTERNS.map(p => p.id), wordIds: [VOCAB[0].id], mistakeIds: [], bankIds: [],
        listening: [LISTEN_CHOOSE], done: { [PATTERNS[0].id]: true, [PATTERNS[1].id]: true, [VOCAB[0].id]: true }, core,
      },
    },
  }))
}

// Speech recognition that hears `interim`, then waits until the returned function is called with the final text
function hearing(interim) {
  let finish
  stt.available = true
  stt.listenOnce = ({ onInterim }) => new Promise(resolve => {
    onInterim?.(interim)
    finish = resolve
  })
  return text => finish(text)
}

const button = (wrapper, text) => wrapper.findAll('button').find(b => b.text() === text)

// Each scenario mounts a component, walks it through its states and calls snap() on each one
const SCENARIOS = [
  ['DailyPracticeScreen (pattern, word and listening steps)', async ({ load, snap }) => {
    seedPracticePlan()
    const C = await load('../../components/DailyPracticeScreen.vue')
    const wrapper = mount(C, { attachTo: document.body })
    await flushPromises()
    await wrapper.find('.core-more').trigger('click')
    snap(wrapper, 'pattern: learn')
    await button(wrapper, 'dailyPractice.startPractice').trigger('click')
    snap(wrapper, 'pattern: quiz')
    await wrapper.findAll('[role=radio]').find(b => b.text().includes('我去想')).trigger('click')
    snap(wrapper, 'pattern: quiz answered')
    await button(wrapper, 'dailyPractice.next').trigger('click')
    await wrapper.find('#dp-own-sentence').setValue('我一杯要珍奶')
    await button(wrapper, 'dailyPractice.check').trigger('click')
    await flushPromises()
    snap(wrapper, 'pattern: sentence check')
    await wrapper.findAll('[role=group] button')[0].trigger('click')
    await flushPromises()
    snap(wrapper, 'word: learn')
    await button(wrapper, 'dailyPractice.startPractice').trigger('click')
    snap(wrapper, 'word: quiz')
    await wrapper.findAll('[role=radio]').find(b => b.text().includes('夜市')).trigger('click')
    snap(wrapper, 'word: quiz answered')
    await button(wrapper, 'dailyPractice.next').trigger('click')
    await wrapper.findAll('[role=group] button')[0].trigger('click')
    await flushPromises()
    await wrapper.find('textarea').setValue('我要那個')
    await button(wrapper, 'listening.check').trigger('click')
    snap(wrapper, 'listening: dictation checked')
    return wrapper
  }],
  ['QuizMode (word quiz)', async ({ load, snap }) => {
    const C = await load('../../components/learning/QuizMode.vue')
    const wrapper = mount(C, { props: { words: WORDS, language: 'zh' } })
    snap(wrapper, 'question')
    await wrapper.findAll('[data-testid="quiz-option"]')[0].trigger('click')
    snap(wrapper, 'answered')
    for (let i = 0; i < 20 && wrapper.find('[data-testid="quiz-next"]').exists(); i++) {
      await wrapper.find('[data-testid="quiz-next"]').trigger('click')
      if (wrapper.find('[data-testid="quiz-option"]').exists()) await wrapper.findAll('[data-testid="quiz-option"]')[0].trigger('click')
    }
    snap(wrapper, 'result')
    return wrapper
  }],
  ['QuizMode (cloze)', async ({ load, snap }) => {
    const C = await load('../../components/learning/QuizMode.vue')
    const wrapper = mount(C, { props: { words: WORDS, language: 'zh', cloze: CLOZE } })
    snap(wrapper, 'question')
    await wrapper.findAll('[data-testid="quiz-option"]')[0].trigger('click')
    snap(wrapper, 'answered')
    for (let i = 0; i < 20 && wrapper.find('[data-testid="quiz-next"]').exists(); i++) {
      await wrapper.find('[data-testid="quiz-next"]').trigger('click')
      if (wrapper.find('[data-testid="quiz-option"]').exists()) await wrapper.findAll('[data-testid="quiz-option"]')[0].trigger('click')
    }
    snap(wrapper, 'result')
    return wrapper
  }],
  ['VocabularyCard', async ({ load, snap }) => {
    const C = await load('../../components/learning/VocabularyCard.vue')
    const wrapper = mount(C, { props: { word: WORDS[0], language: 'zh' } })
    snap(wrapper, 'card')
    return wrapper
  }],
  ['FlashcardMode', async ({ load, snap }) => {
    const C = await load('../../components/learning/FlashcardMode.vue')
    const wrapper = mount(C, { props: { words: [WORDS[0]], language: 'zh' } })
    snap(wrapper, 'front')
    await wrapper.find('[data-testid="flashcard"]').trigger('click')
    snap(wrapper, 'back')
    return wrapper
  }],
  ['ConversationPractice', async ({ load, snap }) => {
    const C = await load('../../components/learning/ConversationPractice.vue')
    const conversations = [{
      id: 'c1', title: 'Drinks',
      messages: [
        { role: 'partner', text: '你要喝什麼？', pinyin: 'nǐ yào hē shén me？', nativeText: 'What would you like to drink?' },
        { role: 'user', text: '我要一杯珍奶。', nativeText: 'A bubble tea, please.' },
      ],
    }]
    const wrapper = mount(C, { props: { conversations, language: 'zh' } })
    await wrapper.find('[data-testid="conversation-item"]').trigger('click')
    snap(wrapper, 'dialogue')
    return wrapper
  }],
  ['ChatMessage', async ({ load, snap }) => {
    const C = await load('../../components/chat/ChatMessage.vue')
    const character = { id: 'meiling', name: 'Mei-ling' }
    const friend = mount(C, { props: { message: { role: 'assistant', content: '你今天想喝什麼？' }, character, language: 'zh' } })
    snap(friend, 'friend message')
    const feedback = {
      grammar: { score: 80, corrections: ['"我一杯要珍奶" → "我要一杯珍奶" — The amount goes after the verb.'] },
      alternatives: ['我想要一杯珍奶。'],
      naturalness: { score: 70, tips: ['說「我想要」比較客氣。'] },
    }
    const user = mount(C, { props: { message: { role: 'user', content: '我一杯要珍奶', feedback }, character, language: 'zh' } })
    await user.find('.explain-toggle').trigger('click')
    snap(user, 'user message with feedback')
    return friend
  }],
  ['ChatSummaryPanel', async ({ load, snap }) => {
    const C = await load('../../components/chat/ChatSummaryPanel.vue')
    const mission = { id: 'm1', targets: [{ id: 'p1', phrase: '我要……' }, { id: 'p2', phrase: '我想……' }] }
    const wrapper = mount(C, {
      props: { mission, messages: [], usedIds: [], character: { name: 'Mei-ling' }, motherTongue: 'en' },
      global: { stubs: { Teleport: true } },
    })
    await flushPromises()
    await wrapper.find('.summary-show-answer').trigger('click')
    snap(wrapper, 'summary with answer shown')
    return wrapper
  }],
  ['FeedbackPanel', async ({ load, snap }) => {
    const C = await load('../../components/chat/FeedbackPanel.vue')
    const feedback = {
      grammar: { score: 80, corrections: ['"我一杯要珍奶" → "我要一杯珍奶" — The amount goes after the verb.'] },
      vocabulary: { score: 90 },
      alternatives: ['我想要一杯珍奶。'],
      naturalness: { score: 70, tips: ['說「我想要」比較客氣。'] },
    }
    const wrapper = mount(C, { props: { feedback } })
    snap(wrapper, 'feedback')
    return wrapper
  }],
  ['VocabularyHints', async ({ load, snap }) => {
    const C = await load('../../components/chat/VocabularyHints.vue')
    const hints = [{ word: '珍奶', description: 'bubble tea', example: '我要一杯珍奶。' }, { word: '夜市', description: 'night market', example: '' }]
    const wrapper = mount(C, { props: { hints } })
    snap(wrapper, 'words')
    await wrapper.find('.vocab-hint').trigger('click')
    snap(wrapper, 'word opened')
    return wrapper
  }],
  ['VocabularyBankPanel', async ({ load, snap }) => {
    localStorage.setItem('chatmate_vocabBank', JSON.stringify([
      { id: 'v1', word: '夜市', translation: 'night market', context: '我們去夜市吧。', source: 'Chat', addedAt: '2026-11-15' },
    ]))
    const C = await load('../../components/chat/VocabularyBankPanel.vue')
    const wrapper = mount(C, { global: { stubs: { Teleport: true } } })
    snap(wrapper, 'saved words')
    return wrapper
  }],
  ['MistakeCard', async ({ load, snap }) => {
    const C = await load('../../components/practice/MistakeCard.vue')
    const wrapper = mount(C, { props: { mistake: { id: 'm1', source: 'chat', original: '我一杯要珍奶', corrected: '我要一杯珍奶', explanation: 'The amount goes after the verb.', hint: 'Where does the amount go?' } } })
    snap(wrapper, 'fix')
    await wrapper.find('textarea').setValue('我要一杯珍奶')
    await button(wrapper, 'mistakes.compare').trigger('click')
    snap(wrapper, 'compare')
    return wrapper
  }],
  ['BankWordCard', async ({ load, snap }) => {
    const C = await load('../../components/practice/BankWordCard.vue')
    const wrapper = mount(C, { props: { word: { id: 'b1', word: '夜市', translation: 'night market', context: '我們去夜市吧。' } } })
    snap(wrapper, 'recall')
    await button(wrapper, 'dailyPractice.reveal').trigger('click')
    snap(wrapper, 'revealed')
    return wrapper
  }],
  ['CoreSpeakingCard', async ({ load, snap }) => {
    const C = await load('../../components/practice/CoreSpeakingCard.vue')
    const prompt = { source: 'pattern', cue: 'Order something you like.', hint: 'I want …', pattern: '我要……', match: ['我要'], target: '我要一杯珍奶。' }
    const before = mount(C, { props: { prompt } })
    snap(before, 'prompt')
    const after = mount(C, { props: { prompt, attempt: { mode: 'text', text: '我一杯要珍奶' } } })
    snap(after, 'answer revealed')
    return after
  }],
  ['ListeningCard', async ({ load, snap }) => {
    const C = await load('../../components/practice/ListeningCard.vue')
    const choose = mount(C, { props: { item: LISTEN_CHOOSE } })
    snap(choose, 'choose')
    await choose.findAll('[role=radio]')[0].trigger('click')
    snap(choose, 'choose answered')
    const dictation = mount(C, { props: { item: LISTEN_DICTATION } })
    await dictation.find('textarea').setValue('我要那個')
    await button(dictation, 'listening.check').trigger('click')
    snap(dictation, 'dictation checked')
    return dictation
  }],
  ['DailyPracticeScreen (all done)', async ({ load, snap }) => {
    seedAllButLastExtra()
    const C = await load('../../components/DailyPracticeScreen.vue')
    const wrapper = mount(C, { attachTo: document.body })
    await flushPromises()
    await wrapper.find('.core-more').trigger('click')
    await wrapper.findAll('[role=radio]').find(b => b.text().includes('我要這個')).trigger('click')
    await button(wrapper, 'dailyPractice.next').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('dailyPractice.doneTitle')
    snap(wrapper, 'all done')
    return wrapper
  }],
  ['ConnectorMissionBar (task chat targets)', async ({ load, snap }) => {
    const C = await load('../../components/chat/ConnectorMissionBar.vue')
    const targets = [{ id: 'p1', phrase: '我要……' }, { id: 'p2', phrase: '我想……' }]
    const wrapper = mount(C, { props: { targets, usedIds: ['p1'], task: 'Order a drink you like.', canEnd: true } })
    snap(wrapper, 'targets')
    return wrapper
  }],
  ['WordSavePopup', async ({ load, snap }) => {
    const C = await load('../../components/chat/WordSavePopup.vue')
    const wrapper = mount(C, { props: { word: '珍奶', context: '我要一杯珍奶。' }, global: { stubs: { Teleport: true } } })
    snap(wrapper, 'save sheet')
    return wrapper
  }],
  ['VoiceConversationBar (live transcript)', async ({ load, snap }) => {
    const finish = hearing('我要')
    const C = await load('../../components/chat/VoiceConversationBar.vue')
    const wrapper = mount(C, { props: { language: 'zh', friendName: 'Mei-ling' } })
    await wrapper.find('.voice-start').trigger('click')
    await flushPromises()
    snap(wrapper, 'listening')
    finish('我要一杯珍奶')
    await flushPromises()
    snap(wrapper, 'thinking')
    return wrapper
  }],
  ['CoreSpeakingCard (listening)', async ({ load, snap }) => {
    hearing('我要')
    const C = await load('../../components/practice/CoreSpeakingCard.vue')
    const prompt = { source: 'pattern', cue: 'Order something you like.', hint: 'I want …', pattern: '我要……', match: ['我要'], target: '我要一杯珍奶。' }
    const wrapper = mount(C, { props: { prompt } })
    await wrapper.find('.core-speak').trigger('click')
    await flushPromises()
    snap(wrapper, 'interim transcript')
    return wrapper
  }],
  ['CharacterCard (zh foundation)', async ({ load, snap }) => {
    const C = await load('../../components/learning/CharacterCard.vue')
    const character = {
      id: 'pinyin-02-initials_b', char: 'b', reading: "b as in 'boy'", romaji: 'b', audioHint: "Like English 'b' in 'boy'",
      examples: [{ word: '爸', reading: 'bà', meaning: 'dad' }, { word: '不', reading: 'bù', meaning: 'not' }],
    }
    const wrapper = mount(C, { props: { character, language: 'zh' } })
    snap(wrapper, 'card')
    return wrapper
  }],
  ['LearningScreen (zh foundation)', async ({ load, snap }) => {
    const C = await load('../../components/LearningScreen.vue')
    const { useNavState } = await import('../../composables/useNavState')
    const nav = useNavState()
    nav.learningLevel.value = { id: 'beginner' }
    nav.selectedTargetLanguage.value = 'zh'
    nav.selectedMotherTongue.value = 'en'
    nav.uiLanguage.value = 'en'
    const wrapper = mount(C)
    await flushPromises()
    snap(wrapper, 'hub')
    await wrapper.findAll('[data-testid="prelesson-row"]')[0].trigger('click')
    snap(wrapper, 'foundation cards')
    return wrapper
  }],
  ['DailyPromptCard', async ({ load, snap }) => {
    const C = await load('../../components/chat/DailyPromptCard.vue')
    const wrapper = mount(C, { props: { level: 'beginner', language: 'zh' } })
    snap(wrapper, 'prompt')
    return wrapper
  }],
]

// Runs a scenario as one edition; returns every snapshot's root element and label
async function run(setup, edition) {
  const snaps = []
  const load = async (path) => {
    vi.resetModules()
    vi.doMock('../../edition', () => (edition === 'zh' ? zhEdition : enEdition))
    return (await import(path)).default
  }
  const snap = (wrapper, label) => snaps.push({ label, html: wrapper.element.cloneNode(true) })
  const wrapper = await setup({ load, snap })
  wrapper?.unmount()
  return snaps
}

describe('lang coverage of Chinese content', () => {
  beforeEach(() => {
    stt.available = false
    stt.listenOnce = null
    localStorage.clear()
    document.body.innerHTML = ''
  })
  afterEach(() => {
    vi.doUnmock('../../edition')
    vi.resetModules()
  })

  it.each(SCENARIOS)('%s: every Chinese text is inside lang="zh-Hant-TW" in the Chinese edition', async (_, setup) => {
    const snaps = await run(setup, 'zh')
    for (const { label, html } of snaps) {
      const { hanCount, untagged } = hanCoverage(html)
      expect(hanCount, `${label}: shows Chinese`).toBeGreaterThan(0)
      expect(untagged, `${label}: untagged Chinese`).toEqual([])
    }
  })

  it.each(SCENARIOS)('%s: no lang attribute in the English edition', async (_, setup) => {
    const snaps = await run(setup, 'en')
    for (const { label, html } of snaps) {
      expect(langAttributes(html), label).toEqual([])
    }
  })
})
