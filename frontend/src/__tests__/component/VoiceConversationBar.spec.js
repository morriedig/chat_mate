import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import VoiceConversationBar from '../../components/chat/VoiceConversationBar.vue'
import ChatMessage from '../../components/chat/ChatMessage.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key) => key })
}))

const playTTS = vi.fn(() => Promise.resolve())
vi.mock('../../utils/tts', () => ({
  playTTS: (...args) => playTTS(...args),
  stopTTS: vi.fn(),
  isTTSAvailable: () => true,
}))

let nextHeard = 'I think working from home is better.'
const listenOnce = vi.fn(() => Promise.resolve(nextHeard))
vi.mock('../../utils/stt', () => ({
  listenOnce: (...args) => listenOnce(...args),
  stopListening: vi.fn(),
  isSTTAvailable: () => true,
}))

describe('VoiceConversationBar', () => {
  beforeEach(() => {
    playTTS.mockClear()
    listenOnce.mockClear()
    nextHeard = 'I think working from home is better.'
  })

  const mountBar = (props = {}) => mount(VoiceConversationBar, {
    props: { lastReply: 'What do you think about working from home?', ...props },
  })

  it('waits for a tap before speaking', () => {
    mountBar()
    expect(playTTS).not.toHaveBeenCalled()
  })

  it('speaks the reply, listens, and sends what it heard', async () => {
    const wrapper = mountBar()

    await wrapper.find('button.rounded-full.bg-primary').trigger('click')
    await flushPromises()

    expect(playTTS).toHaveBeenCalledWith('What do you think about working from home?', 'en', 'normal')
    expect(listenOnce).toHaveBeenCalled()
    expect(wrapper.emitted('send')).toEqual([['I think working from home is better.']])
  })

  it('speaks each new reply and listens again', async () => {
    const wrapper = mountBar()
    await wrapper.find('button.rounded-full.bg-primary').trigger('click')
    await flushPromises()

    await wrapper.setProps({ lastReply: 'Why is that?' })
    await flushPromises()

    expect(playTTS).toHaveBeenLastCalledWith('Why is that?', 'en', 'normal')
    expect(listenOnce).toHaveBeenCalledTimes(2)
  })

  it('does not send when nothing was heard', async () => {
    nextHeard = ''
    const wrapper = mountBar()

    await wrapper.find('button.rounded-full.bg-primary').trigger('click')
    await flushPromises()

    expect(wrapper.emitted('send')).toBeUndefined()
    expect(wrapper.text()).toContain('voiceChat.didntHear')
  })
})

describe('ChatMessage hideText', () => {
  const character = { name: 'Emma', avatar: '👩‍🎨' }

  it('blurs the reply until tapped', async () => {
    const wrapper = mount(ChatMessage, {
      props: { message: { role: 'assistant', content: 'Hello there' }, character, hideText: true },
    })

    expect(wrapper.find('.blur-\\[6px\\]').exists()).toBe(true)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('reveal')).toHaveLength(1)
  })

  it('shows the reply normally by default', () => {
    const wrapper = mount(ChatMessage, {
      props: { message: { role: 'assistant', content: 'Hello there' }, character },
    })

    expect(wrapper.find('.blur-\\[6px\\]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Hello there')
  })
})
