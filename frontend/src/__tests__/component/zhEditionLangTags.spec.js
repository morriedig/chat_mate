import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { zhEdition, enEdition } from '../helpers/editions'

// Target-language text carries lang="zh-Hant-TW" in the Chinese edition (so Traditional
// glyphs render) and no lang attribute in the English edition.
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: key => key }) }))
vi.mock('../../utils/tts', () => ({
  playTTS: vi.fn().mockResolvedValue(undefined),
  stopTTS: vi.fn(),
  isTTSAvailable: () => true,
  splitTextForHighlight: text => text.split(' '),
}))
vi.mock('../../utils/stt', () => ({ isSTTAvailable: () => false, listenOnce: vi.fn(), stopListening: vi.fn() }))
vi.mock('../../composables/useLearningProgress', () => ({
  useLearningProgress: () => ({ markConversationCompleted: vi.fn(), markQuizCompleted: vi.fn() }),
}))

// Loads a component fresh, as the Chinese edition (zh) or the English build (en)
async function load(path, edition) {
  vi.resetModules()
  vi.doMock('../../edition', () => (edition === 'zh' ? zhEdition : enEdition))
  return (await import(path)).default
}

afterEach(() => {
  vi.doUnmock('../../edition')
  vi.resetModules()
})

const WORDS = [
  { id: 1, word: '珍奶', meaning: 'bubble tea', example: '我要一杯珍奶。' },
  { id: 2, word: '捷運', meaning: 'MRT', example: '我坐捷運。' },
  { id: 3, word: '便當', meaning: 'lunch box', example: '我買便當。' },
  { id: 4, word: '夜市', meaning: 'night market', example: '我去夜市。' },
]

// Each case mounts a component and returns the texts that are Chinese content
const CASES = [
  ['VocabularyCard', async (edition) => {
    const C = await load('../../components/learning/VocabularyCard.vue', edition)
    return { wrapper: mount(C, { props: { word: WORDS[0], language: 'zh' } }), texts: ['珍奶', '"我要一杯珍奶。"'] }
  }],
  ['FlashcardMode', async (edition) => {
    const C = await load('../../components/learning/FlashcardMode.vue', edition)
    return { wrapper: mount(C, { props: { words: [WORDS[0]], language: 'zh' } }), texts: ['珍奶'] }
  }],
  ['QuizMode', async (edition) => {
    const C = await load('../../components/learning/QuizMode.vue', edition)
    const wrapper = mount(C, { props: { words: WORDS, language: 'zh' } })
    return { wrapper, texts: [wrapper.find('[data-testid="quiz-prompt"] h2').text()] }
  }],
  ['ConversationPractice', async (edition) => {
    const C = await load('../../components/learning/ConversationPractice.vue', edition)
    const conversations = [{ id: 'c1', title: 'Drinks', messages: [{ role: 'partner', text: '你要喝什麼？' }] }]
    const wrapper = mount(C, { props: { conversations, language: 'zh' } })
    await wrapper.find('[data-testid="conversation-item"]').trigger('click')
    return { wrapper, texts: ['你要喝什麼？'] }
  }],
  ['MistakeCard', async (edition) => {
    const C = await load('../../components/practice/MistakeCard.vue', edition)
    const wrapper = mount(C, { props: { mistake: { id: 'm1', source: 'chat', original: '我一杯要珍奶', corrected: '我要一杯珍奶' } } })
    await wrapper.find('textarea').setValue('我要一杯珍奶')
    await wrapper.findAll('button').find(b => b.text() === 'mistakes.compare').trigger('click')
    return { wrapper, texts: ['“我一杯要珍奶”', '我要一杯珍奶'] }
  }],
  ['BankWordCard', async (edition) => {
    const C = await load('../../components/practice/BankWordCard.vue', edition)
    return { wrapper: mount(C, { props: { word: { id: 'b1', word: '夜市', meaning: 'night market' } } }), texts: ['夜市'] }
  }],
  ['CoreSpeakingCard', async (edition) => {
    const C = await load('../../components/practice/CoreSpeakingCard.vue', edition)
    const prompt = { source: 'chat-summary', cue: 'Say it again', hint: '', target: '我要一杯珍奶。' }
    return { wrapper: mount(C, { props: { prompt, attempt: { mode: 'text', text: '我一杯要珍奶' } } }), texts: ['我要一杯珍奶。'] }
  }],
]

describe('lang tag on Chinese content', () => {
  it.each(CASES)('%s marks it zh-Hant-TW in the Chinese edition', async (_, setup) => {
    const { wrapper, texts } = await setup('zh')
    const tagged = wrapper.findAll('[lang="zh-Hant-TW"]').map(el => el.text())
    for (const text of texts) expect(tagged).toContain(text)
  })

  it.each(CASES)('%s adds no lang attribute in the English edition', async (_, setup) => {
    const { wrapper } = await setup('en')
    expect(wrapper.find('[lang]').exists()).toBe(false)
  })
})
