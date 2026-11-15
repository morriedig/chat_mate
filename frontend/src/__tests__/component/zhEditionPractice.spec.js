import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

// Chinese edition screens: Chinese sentences, pinyin, zh-TW speech, hidden English-only buttons
vi.mock('../../edition', async () => ({
  ...(await import('../helpers/editions.js')).zhEdition,
  isFeatureEnabled: feature => feature !== 'dailyOpinion',
}))
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: key => key }) }))
vi.mock('vue-router', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('../../composables/useDailyGoal', () => ({ useDailyGoal: () => ({ startTimer: vi.fn(), stopTimer: vi.fn() }) }))
vi.mock('../../composables/useTaskChatLauncher', () => ({ useTaskChatLauncher: () => ({ startTaskChat: vi.fn() }) }))
vi.mock('../../utils/tts', () => ({ playTTS: vi.fn(), stopTTS: vi.fn() }))
vi.mock('../../utils/stt', () => ({ isSTTAvailable: () => false, listenOnce: vi.fn(), stopListening: vi.fn() }))

const PATTERN = {
  id: 'pattern:beginner:yao',
  level: 'beginner',
  pattern: '我要……',
  meaning: 'I want …',
  when: '',
  examples: [{ zh: '我要一杯珍奶。', en: 'I want a bubble tea.', pinyin: 'wǒ yào yì bēi zhēn nǎi.' }],
  choice: { situation: 'At a drink shop', options: ['我要一杯珍奶。', '我一杯要珍奶。'], answer: 0, explain: '' },
  task: '',
  match: ['我要'],
}
vi.mock('../../data/dailyLoader', () => ({
  getDailyPatterns: () => [PATTERN],
  getDailyVocab: () => [],
}))

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const baseCore = {
  errorKey: null, errorSource: 'builtin', patternId: PATTERN.id, speakingSource: 'pattern', speakingItemId: null,
  fallbackPrompt: null, errorCompletedAt: null, patternCompletedAt: null, speakingAttempt: null, speakingMode: null,
  speakingCompletedAt: null, completedAt: null,
}

function seedPlan(plan) {
  localStorage.setItem('chatmate_daily_practice', JSON.stringify({
    version: 2,
    level: 'beginner',
    plans: { [todayKey()]: { level: 'beginner', patternIds: [PATTERN.id], wordIds: [], mistakeIds: [], bankIds: [], listening: [], done: {}, ...plan } },
  }))
}

async function mountScreen() {
  vi.resetModules()
  const { default: DailyPracticeScreen } = await import('../../components/DailyPracticeScreen.vue')
  const { playTTS } = await import('../../utils/tts')
  const wrapper = mount(DailyPracticeScreen, { attachTo: document.body })
  await flushPromises()
  return { wrapper, playTTS }
}

const button = (wrapper, text) => wrapper.findAll('button').find(b => b.text() === text)

describe('DailyPracticeScreen (Chinese edition)', () => {
  beforeEach(() => {
    localStorage.clear()
    document.body.innerHTML = ''
  })

  it('shows the Chinese example with pinyin under it and the English translation, and reads it in Chinese', async () => {
    seedPlan({ core: { ...baseCore, errorCompletedAt: '2026-11-15T00:00:00Z' } })
    const { wrapper, playTTS } = await mountScreen()

    const sentence = wrapper.find('[lang="zh-Hant-TW"]')
    expect(sentence.text()).toBe('我要一杯珍奶。')
    const lines = sentence.element.parentElement.textContent
    expect(lines).toContain('wǒ yào yì bēi zhēn nǎi.')
    expect(lines).toContain('I want a bubble tea.')
    expect(lines.indexOf('wǒ yào')).toBeLessThan(lines.indexOf('I want'))

    await sentence.element.closest('button').click()
    expect(playTTS).toHaveBeenLastCalledWith('我要一杯珍奶。', 'zh', 'normal')
    wrapper.unmount()
  })

  it('finishes a Chinese dictation and offers no "Write opinion" button', async () => {
    seedPlan({
      core: { ...baseCore, completedAt: '2026-11-15T00:00:00Z' },
      done: { [PATTERN.id]: true },
      listening: [{ id: 'listen:dictation', mode: 'dictation', zh: '我要這個。', en: 'I want this one.', pinyin: 'wǒ yào zhè ge.' }],
    })
    const { wrapper, playTTS } = await mountScreen()

    await wrapper.find('.core-more').trigger('click')
    expect(playTTS).toHaveBeenLastCalledWith('我要這個。', 'zh', 'normal')

    await wrapper.find('textarea').setValue('我要那個')
    await button(wrapper, 'listening.check').trigger('click')
    // Per-character compare: only 這 is marked, and the pinyin shows with the answer
    expect(wrapper.findAll('[role=status] [lang] .text-error').map(s => s.text())).toEqual(['這'])
    expect(wrapper.text()).toContain('wǒ yào zhè ge.')

    await button(wrapper, 'dailyPractice.next').trigger('click')
    expect(wrapper.text()).toContain('dailyPractice.doneTitle')
    expect(button(wrapper, 'dailyPractice.writeOpinion')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('CoreSpeakingCard (Chinese edition)', () => {
  it('needs 2 Chinese characters before a typed answer can be sent', async () => {
    const { default: CoreSpeakingCard } = await import('../../components/practice/CoreSpeakingCard.vue')
    const wrapper = mount(CoreSpeakingCard, { props: { prompt: { source: 'pattern', cue: '你想喝什麼？', hint: '', pattern: '我要……', match: ['我要'] } } })
    const send = () => wrapper.find('.core-send')

    await wrapper.find('textarea').setValue('好')
    expect(send().attributes('disabled')).toBeDefined()
    await wrapper.find('textarea').setValue('ok sure')
    expect(send().attributes('disabled')).toBeDefined()
    await wrapper.find('textarea').setValue('好啊')
    expect(send().attributes('disabled')).toBeUndefined()
  })
})

describe('ChatMessage (Chinese edition)', () => {
  const character = { id: 'mei', name: 'Mei' }

  it('marks Chinese content and shows pinyin under the reply when turned on', async () => {
    const { default: ChatMessage } = await import('../../components/chat/ChatMessage.vue')
    const wrapper = mount(ChatMessage, {
      props: { message: { role: 'assistant', content: '你好嗎？' }, character, language: 'zh', showPinyin: true },
      global: { stubs: { FeedbackPanel: true } },
    })
    expect(wrapper.find('.clickable-words').attributes('lang')).toBe('zh-Hant-TW')
    await vi.waitFor(() => expect(wrapper.find('.message-pinyin').exists()).toBe(true), { timeout: 5000 })
    expect(wrapper.find('.message-pinyin').text()).toBe('nǐ hǎo ma？')

    await wrapper.setProps({ showPinyin: false })
    await flushPromises()
    expect(wrapper.find('.message-pinyin').exists()).toBe(false)
  })

  it('adds no lang or pinyin in an English chat', async () => {
    const { default: ChatMessage } = await import('../../components/chat/ChatMessage.vue')
    const wrapper = mount(ChatMessage, {
      props: { message: { role: 'assistant', content: 'Hello there' }, character, language: 'en', showPinyin: true },
      global: { stubs: { FeedbackPanel: true } },
    })
    await flushPromises()
    expect(wrapper.find('[lang]').exists()).toBe(false)
    expect(wrapper.find('.message-pinyin').exists()).toBe(false)
  })
})
