import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key) => key }) }))
vi.mock('vue-router', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('../../composables/useDailyGoal', () => ({ useDailyGoal: () => ({ startTimer: vi.fn(), stopTimer: vi.fn() }) }))

const submitAnswer = vi.fn(() => Promise.resolve())
vi.mock('../../composables/useDailyOpinion', async (importOriginal) => ({
  ...(await importOriginal()),
  useDailyOpinion: () => ({
    question: ref({ id: 'wfh', en: 'Is working from home better?', ja: '', zh: '' }),
    connectorIds: ref([]),
    todayRecord: ref(null),
    isDoneToday: ref(false),
    streak: ref(0),
    isLoadingFeedback: ref(false),
    refreshDay: vi.fn(),
    saveDraft: vi.fn(),
    submitAnswer,
    startRewrite: vi.fn(),
    cancelRewrite: vi.fn(),
    retryFeedback: vi.fn(),
    processPending: vi.fn(),
    markSentenceSaved: vi.fn(),
  }),
}))

let listens = []
const listenOnce = vi.fn((options) => new Promise((resolve, reject) => {
  listens.push({ options, resolve, reject })
}))
const stopListening = vi.fn()
vi.mock('../../utils/stt', () => ({
  isSTTAvailable: () => true,
  listenOnce: (...args) => listenOnce(...args),
  stopListening: (...args) => stopListening(...args),
}))

import DailyOpinionScreen from '../../components/DailyOpinionScreen.vue'

const micButton = (wrapper) => wrapper.find('button[aria-pressed]')
const textarea = (wrapper) => wrapper.find('textarea')
const submitButton = (wrapper) => wrapper.findAll('button').find(b => b.text().includes('dailyOpinion.submit'))

async function mountWithText(text) {
  const wrapper = mount(DailyOpinionScreen)
  await flushPromises()
  if (text) await textarea(wrapper).setValue(text)
  return wrapper
}

describe('DailyOpinionScreen speech-to-text', () => {
  beforeEach(() => {
    localStorage.clear()
    listens = []
    listenOnce.mockClear()
    stopListening.mockClear()
    submitAnswer.mockClear()
  })

  it('appends to the answer with a space between, always in English', async () => {
    const wrapper = await mountWithText('I agree.')
    await micButton(wrapper).trigger('click')
    expect(listens[0].options.language).toBe('en')

    listens[0].options.onInterim('Because')
    await flushPromises()
    expect(textarea(wrapper).element.value).toBe('I agree. Because')

    listens[0].resolve('Because I save time')
    await flushPromises()
    expect(textarea(wrapper).element.value).toBe('I agree. Because I save time')
    expect(micButton(wrapper).attributes('aria-pressed')).toBe('false')
  })

  it('keeps the answer without a dangling space when nothing was heard', async () => {
    const wrapper = await mountWithText('I agree.')
    await micButton(wrapper).trigger('click')
    listens[0].resolve('')
    await flushPromises()
    expect(textarea(wrapper).element.value).toBe('I agree.')
    expect(micButton(wrapper).attributes('aria-pressed')).toBe('false')
  })

  it('keeps typed text and abandons the listen when the user types instead', async () => {
    const wrapper = await mountWithText('I agree.')
    await micButton(wrapper).trigger('click')
    await textarea(wrapper).setValue('I agree. It saves time.')
    expect(stopListening).toHaveBeenCalledTimes(1)
    expect(micButton(wrapper).attributes('aria-pressed')).toBe('false')

    listens[0].options.onInterim('late words')
    listens[0].resolve('')
    await flushPromises()
    expect(textarea(wrapper).element.value).toBe('I agree. It saves time.')
  })

  it('submits what is on screen and drops a transcript that arrives afterwards', async () => {
    const wrapper = await mountWithText('I agree.')
    await micButton(wrapper).trigger('click')
    listens[0].options.onInterim('Because')
    await flushPromises()

    await submitButton(wrapper).trigger('click')
    await flushPromises()
    expect(submitAnswer.mock.calls[0][0]).toBe('I agree. Because')
    expect(stopListening).toHaveBeenCalledTimes(1)

    listens[0].resolve('Because I save time')
    await flushPromises()
    expect(textarea(wrapper).element.value).toBe('I agree. Because')
  })
})
