import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key) => key })
}))

const request = vi.fn()
const clear = vi.fn()
vi.mock('../../composables/useSpeechRescue', async () => {
  const { ref } = await import('vue')
  const actual = await vi.importActual('../../composables/useSpeechRescue')
  return {
    ...actual,
    useSpeechRescue: () => {
      const result = ref(null)
      const isLoading = ref(false)
      return {
        isLoading,
        result,
        request: async (args) => { request(args); result.value = request.nextResult },
        clear: () => { clear(); result.value = null },
      }
    },
  }
})

let resolveListen = null
const stopListening = vi.fn(() => resolveListen?.(''))
vi.mock('../../utils/stt', () => ({
  listenOnce: vi.fn(() => new Promise(resolve => { resolveListen = resolve })),
  stopListening: (...args) => stopListening(...args),
  extendListening: vi.fn(() => true),
  isSTTAvailable: () => true,
}))
vi.mock('../../utils/tts', () => ({
  playTTS: vi.fn(() => Promise.resolve()),
  stopTTS: vi.fn(),
  isTTSAvailable: () => true,
}))

import ChatInput from '../../components/chat/ChatInput.vue'
import VoiceConversationBar from '../../components/chat/VoiceConversationBar.vue'

const messages = [{ role: 'assistant', content: 'Should we skip the meeting?' }]
const rescueContext = { messages, task: null, patterns: [], level: 'intermediate', language: 'en', nativeLanguage: 'zh', sessionType: 'free' }

describe('SpeechRescue in ChatInput', () => {
  beforeEach(() => {
    request.mockClear()
    clear.mockClear()
    document.body.innerHTML = ''
  })

  const mountInput = (props = {}) => mount(ChatInput, {
    props: { modelValue: '', rescueContext, ...props },
    attachTo: document.body,
  })

  it('has no "I\'m stuck" button without a rescue context', () => {
    const wrapper = mount(ChatInput, { props: { modelValue: '' } })
    expect(wrapper.find('.rescue-trigger').exists()).toBe(false)
  })

  it('opens the sheet with the three options', async () => {
    const wrapper = mountInput()
    await wrapper.find('.rescue-trigger').trigger('click')
    const options = document.querySelectorAll('.rescue-option')
    expect([...options].map(o => o.className.match(/rescue-option-(\w+)/)[1])).toEqual(['starter', 'intent', 'frame'])
  })

  it('shows the hint above the input without sending or filling the input', async () => {
    request.nextResult = { mode: 'starter', pieces: ['The main reason is'], frame: '', source: 'ai' }
    const wrapper = mountInput()
    await wrapper.find('.rescue-trigger').trigger('click')
    document.querySelector('.rescue-option-starter').click()
    await flushPromises()

    expect(request).toHaveBeenCalledWith({ mode: 'starter', context: rescueContext })
    expect(wrapper.find('.rescue-starter').text()).toContain('The main reason is')
    // Card sits before the textarea
    const html = wrapper.html()
    expect(html.indexOf('speech-rescue-card')).toBeLessThan(html.indexOf('<textarea'))
    expect(wrapper.emitted('send')).toBeFalsy()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('intent: asks for what you mean, then shows separate pieces', async () => {
    request.nextResult = { mode: 'intent', pieces: ["can't make the meeting", 'because'], frame: '', source: 'ai' }
    const wrapper = mountInput()
    await wrapper.find('.rescue-trigger').trigger('click')
    document.querySelector('.rescue-option-intent').click()
    await flushPromises()

    const textarea = document.querySelector('#rescue-intent-input')
    textarea.value = '我明天不能開會'
    textarea.dispatchEvent(new Event('input'))
    await flushPromises()
    document.querySelector('.rescue-submit').click()
    await flushPromises()

    expect(request).toHaveBeenCalledWith({ mode: 'intent', intent: '我明天不能開會', context: rescueContext })
    expect(wrapper.findAll('.rescue-pieces li').map(li => li.text())).toEqual(["can't make the meeting", 'because'])
  })

  it('intent that failed offers to try another way, keeping the text', async () => {
    request.nextResult = { mode: 'intent', pieces: [], frame: '', source: 'fallback', reason: 'busy' }
    const wrapper = mountInput()
    await wrapper.find('.rescue-trigger').trigger('click')
    document.querySelector('.rescue-option-intent').click()
    await flushPromises()
    const textarea = document.querySelector('#rescue-intent-input')
    textarea.value = '我想請假'
    textarea.dispatchEvent(new Event('input'))
    await flushPromises()
    document.querySelector('.rescue-submit').click()
    await flushPromises()

    expect(wrapper.find('.rescue-note').text()).toBe('rescue.intentFailed')
    await wrapper.find('.rescue-retry').trigger('click')
    expect(document.querySelector('#rescue-intent-input').value).toBe('我想請假')
  })

  it('frame: marks the slots', async () => {
    request.nextResult = { mode: 'frame', pieces: [], frame: "I'd say [your choice], because [your reason]", source: 'ai' }
    const wrapper = mountInput()
    await wrapper.find('.rescue-trigger').trigger('click')
    document.querySelector('.rescue-option-frame').click()
    await flushPromises()
    expect(wrapper.findAll('.rescue-frame .rescue-slot').map(s => s.text())).toEqual(['[your choice]', '[your reason]'])
    expect(wrapper.find('.rescue-frame').text()).toBe("I'd say [your choice], because [your reason]")
  })

  it('a new message clears the hint', async () => {
    request.nextResult = { mode: 'starter', pieces: ['I think'], frame: '', source: 'fallback', reason: 'offline' }
    const wrapper = mountInput()
    await wrapper.find('.rescue-trigger').trigger('click')
    document.querySelector('.rescue-option-starter').click()
    await flushPromises()
    expect(wrapper.find('.speech-rescue-card').exists()).toBe(true)
    expect(wrapper.find('.rescue-note').text()).toBe('rescue.fallback.offline')

    await wrapper.setProps({ rescueContext: { ...rescueContext, messages: [...messages, { role: 'user', content: 'I think so' }] } })
    await flushPromises()
    expect(wrapper.find('.speech-rescue-card').exists()).toBe(false)
  })
})

describe('SpeechRescue in VoiceConversationBar', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    stopListening.mockClear()
  })

  it('pauses listening and does not send what was heard while the sheet is open', async () => {
    const wrapper = mount(VoiceConversationBar, {
      props: { lastReply: 'What do you think?', rescueContext },
      attachTo: document.body,
    })
    await wrapper.find('button.voice-start').trigger('click')
    await flushPromises()
    expect(wrapper.find('.still-thinking').exists()).toBe(true) // listening

    await wrapper.find('.rescue-trigger').trigger('click')
    await flushPromises()

    expect(stopListening).toHaveBeenCalled()
    expect(document.querySelector('.rescue-option-starter')).not.toBeNull()
    expect(wrapper.emitted('send')).toBeFalsy()
  })
})
