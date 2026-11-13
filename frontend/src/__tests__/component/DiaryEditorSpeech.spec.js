import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key) => key })
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

import DiaryEditor from '../../components/diary/DiaryEditor.vue'

const micButton = (wrapper) => wrapper.find('button[aria-pressed]')
const textarea = (wrapper) => wrapper.find('textarea')
const submitButton = (wrapper) => wrapper.findAll('button').find(b => b.text().includes('diary.getFeedback'))

async function mountWithText(text) {
  const wrapper = mount(DiaryEditor, { props: { language: 'en' } })
  await flushPromises()
  if (text) await textarea(wrapper).setValue(text)
  return wrapper
}

describe('DiaryEditor speech-to-text', () => {
  beforeEach(() => {
    localStorage.clear()
    listens = []
    listenOnce.mockClear()
    stopListening.mockClear()
  })

  it('appends interim and final text to what was already written', async () => {
    const wrapper = await mountWithText('Today ')
    await micButton(wrapper).trigger('click')
    expect(listens[0].options.language).toBe('en')

    listens[0].options.onInterim('I went')
    await flushPromises()
    expect(textarea(wrapper).element.value).toBe('Today I went')

    listens[0].resolve('I went out')
    await flushPromises()
    expect(textarea(wrapper).element.value).toBe('Today I went out')
    expect(micButton(wrapper).attributes('aria-pressed')).toBe('false')
    expect(stopListening).not.toHaveBeenCalled()
  })

  it('keeps the text when nothing was heard', async () => {
    const wrapper = await mountWithText('Today')
    await micButton(wrapper).trigger('click')
    listens[0].resolve('')
    await flushPromises()
    expect(textarea(wrapper).element.value).toBe('Today')
    expect(micButton(wrapper).attributes('aria-pressed')).toBe('false')
  })

  it('keeps typed text and abandons the listen when the user types instead', async () => {
    const wrapper = await mountWithText('Today')
    await micButton(wrapper).trigger('click')
    await textarea(wrapper).setValue('Today was fine')
    expect(stopListening).toHaveBeenCalledTimes(1)
    expect(micButton(wrapper).attributes('aria-pressed')).toBe('false')

    listens[0].options.onInterim('late words')
    listens[0].resolve('')
    await flushPromises()
    expect(textarea(wrapper).element.value).toBe('Today was fine')
  })

  it('submits what is on screen and drops a transcript that arrives afterwards', async () => {
    const wrapper = await mountWithText('Today ')
    await micButton(wrapper).trigger('click')
    listens[0].options.onInterim('I rested')
    await flushPromises()

    await submitButton(wrapper).trigger('click')
    expect(wrapper.emitted('submit')[0]).toEqual(['Today I rested'])
    expect(stopListening).toHaveBeenCalledTimes(1)
    expect(micButton(wrapper).attributes('aria-pressed')).toBe('false')

    listens[0].resolve('I rested a lot')
    await flushPromises()
    expect(textarea(wrapper).element.value).toBe('Today I rested')
  })
})
