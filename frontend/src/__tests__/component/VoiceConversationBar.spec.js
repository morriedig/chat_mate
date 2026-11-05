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
const extendListening = vi.fn(() => true)
vi.mock('../../utils/stt', () => ({
  listenOnce: (...args) => listenOnce(...args),
  stopListening: vi.fn(),
  extendListening: (...args) => extendListening(...args),
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

    await wrapper.find('button.voice-start').trigger('click')
    await flushPromises()

    expect(playTTS).toHaveBeenCalledWith('What do you think about working from home?', 'en', 'normal')
    expect(listenOnce).toHaveBeenCalled()
    expect(wrapper.emitted('send')).toEqual([['I think working from home is better.']])
  })

  it('speaks each new reply and listens again', async () => {
    const wrapper = mountBar()
    await wrapper.find('button.voice-start').trigger('click')
    await flushPromises()

    await wrapper.setProps({ lastReply: 'Why is that?' })
    await flushPromises()

    expect(playTTS).toHaveBeenLastCalledWith('Why is that?', 'en', 'normal')
    expect(listenOnce).toHaveBeenCalledTimes(2)
  })

  it('does not send when nothing was heard', async () => {
    nextHeard = ''
    const wrapper = mountBar()

    await wrapper.find('button.voice-start').trigger('click')
    await flushPromises()

    expect(wrapper.emitted('send')).toBeUndefined()
    expect(wrapper.text()).toContain('voiceChat.didntHear')
  })
})

describe('VoiceConversationBar pauses', () => {
  beforeEach(() => {
    localStorage.clear()
    extendListening.mockClear()
  })

  it('offers "still thinking" while listening and keeps the turn open', async () => {
    let finish
    listenOnce.mockImplementationOnce(() => new Promise(resolve => { finish = resolve }))
    const wrapper = mount(VoiceConversationBar, { props: { lastReply: 'Hi!' } })
    expect(wrapper.find('.still-thinking').exists()).toBe(false)

    await wrapper.find('button.voice-start').trigger('click')
    await flushPromises()
    // Listening: static dot + "your turn", no pulse
    expect(wrapper.find('.voice-mic.is-listening').exists()).toBe(true)
    expect(wrapper.find('.animate-pulse').exists()).toBe(false)
    await wrapper.find('.still-thinking').trigger('click')

    expect(extendListening).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.still-thinking').text()).toBe('voiceChat.takeYourTime')
    finish('')
    await flushPromises()
    expect(wrapper.find('.still-thinking').exists()).toBe(false)
  })

  it('cycles the pause length and remembers it', async () => {
    const wrapper = mount(VoiceConversationBar, { props: { lastReply: 'Hi!' } })
    await wrapper.find('.pause-length').trigger('click')
    expect(localStorage.getItem('chatmate_voice_pause_ms')).toBe('4000')
    await wrapper.find('.pause-length').trigger('click')
    expect(localStorage.getItem('chatmate_voice_pause_ms')).toBe('1500')
  })
})

describe('ChatMessage hideText', () => {
  const character = { name: 'Emma', avatar: '👩‍🎨' }

  it('hides the reply behind text bars until tapped', async () => {
    const wrapper = mount(ChatMessage, {
      props: { message: { role: 'assistant', content: 'Hello there' }, character, hideText: true },
    })

    // Never blurred readable text: the words are not in the DOM at all
    expect(wrapper.text()).not.toContain('Hello there')
    expect(wrapper.find('[class*="blur"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('voiceChat.listenFirst')
    await wrapper.find('button.hidden-reply').trigger('click')
    expect(wrapper.emitted('reveal')).toHaveLength(1)
  })

  it('shows the reply normally by default', () => {
    const wrapper = mount(ChatMessage, {
      props: { message: { role: 'assistant', content: 'Hello there' }, character },
    })

    expect(wrapper.find('.hidden-reply').exists()).toBe(false)
    expect(wrapper.text()).toContain('Hello there')
  })
})
