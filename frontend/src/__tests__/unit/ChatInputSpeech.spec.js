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
  extendListening: vi.fn(() => true),
}))

import ChatInput from '../../components/chat/ChatInput.vue'

const micButton = (wrapper) => wrapper.find('button[aria-pressed]')
const lastValue = (wrapper) => wrapper.emitted('update:modelValue').at(-1)[0]

describe('ChatInput speech-to-text', () => {
  beforeEach(() => {
    listens = []
    listenOnce.mockClear()
    stopListening.mockClear()
  })

  it('appends interim and final text to what was already typed', async () => {
    const wrapper = mount(ChatInput, { props: { modelValue: 'Hello ', language: 'ja' } })
    await micButton(wrapper).trigger('click')
    expect(listenOnce).toHaveBeenCalledTimes(1)
    expect(listens[0].options.language).toBe('ja')
    expect(micButton(wrapper).attributes('aria-pressed')).toBe('true')

    listens[0].options.onInterim('I think')
    expect(lastValue(wrapper)).toBe('Hello I think')

    listens[0].resolve('I think so')
    await flushPromises()
    expect(lastValue(wrapper)).toBe('Hello I think so')
    expect(wrapper.find('textarea').element.value).toBe('Hello I think so')
    expect(micButton(wrapper).attributes('aria-pressed')).toBe('false')
  })

  it('keeps the existing text when nothing was heard', async () => {
    const wrapper = mount(ChatInput, { props: { modelValue: 'Hello' } })
    await micButton(wrapper).trigger('click')
    listens[0].resolve('')
    await flushPromises()
    expect(lastValue(wrapper)).toBe('Hello')
  })

  it('stop button calls stopListening', async () => {
    const wrapper = mount(ChatInput, { props: { modelValue: '' } })
    await micButton(wrapper).trigger('click')
    await micButton(wrapper).trigger('click')
    expect(stopListening).toHaveBeenCalledTimes(1)
  })

  it('logs a recognition error and resets the mic', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(ChatInput, { props: { modelValue: '' } })
    await micButton(wrapper).trigger('click')
    listens[0].reject(new Error('not-allowed'))
    await flushPromises()
    expect(error).toHaveBeenCalledWith('Speech recognition error:', 'not-allowed')
    expect(micButton(wrapper).attributes('aria-pressed')).toBe('false')
    error.mockRestore()
  })

  it('stops on unmount and ignores a result that arrives afterwards', async () => {
    const wrapper = mount(ChatInput, { props: { modelValue: 'Hi' } })
    await micButton(wrapper).trigger('click')
    const emittedBefore = wrapper.emitted('update:modelValue')?.length ?? 0
    wrapper.unmount()
    expect(stopListening).toHaveBeenCalledTimes(1)

    listens[0].resolve('too late')
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')?.length ?? 0).toBe(emittedBefore)
  })
})
