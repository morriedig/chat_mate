import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ConversationPractice from '../../components/learning/ConversationPractice.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key, params) => {
      if (params) return `${key} ${JSON.stringify(params)}`
      return key
    }
  })
}))

// Mock tts utilities
vi.mock('../../utils/tts', () => ({
  playTTS: vi.fn().mockResolvedValue(undefined),
  stopTTS: vi.fn(),
  splitTextForHighlight: (text) => text.split(' ')
}))

// Mock useLearningProgress
vi.mock('../../composables/useLearningProgress', () => ({
  useLearningProgress: () => ({
    markConversationCompleted: vi.fn()
  })
}))

describe('ConversationPractice', () => {
  const mockConversations = [
    {
      id: 'conv1',
      title: 'At the Airport',
      messages: [
        { role: 'partner', text: 'Hello! Where are you flying today?', nativeText: 'こんにちは！今日はどこに飛びますか？' },
        { role: 'user', text: 'I am going to Tokyo.', nativeText: '東京に行きます。' },
        { role: 'partner', text: 'That sounds exciting!', nativeText: 'それはワクワクしますね！' }
      ]
    },
    {
      id: 'conv2',
      title: 'Buying a Ticket',
      messages: [
        { role: 'partner', text: 'Can I help you?', nativeText: 'お手伝いしましょうか？' },
        { role: 'user', text: 'I need a ticket to Osaka.', nativeText: '大阪への切符が必要です。' }
      ]
    }
  ]

  const createWrapper = (props = {}) => {
    return mount(ConversationPractice, {
      props: {
        conversations: mockConversations,
        language: 'en',
        ...props
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the component', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should show conversation list title before selecting a conversation', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('learning.conversation.title')
    })

    it('should show select dialogue subtitle', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('learning.conversation.selectDialogue')
    })

    it('should display all conversation titles in the list', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('At the Airport')
      expect(wrapper.text()).toContain('Buying a Ticket')
    })

    it('should show message count for each conversation', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('3')
      expect(wrapper.text()).toContain('2')
    })

    it('should show no conversations message when list is empty', () => {
      const wrapper = createWrapper({ conversations: [] })
      expect(wrapper.text()).toContain('learning.conversation.noConversations')
    })
  })

  describe('header', () => {
    it('should show back button', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.material-symbols-outlined').text()).toContain('arrow_back')
    })

    it('should emit back event when back button clicked from list view', async () => {
      const wrapper = createWrapper()
      const backButton = wrapper.find('button')
      await backButton.trigger('click')
      expect(wrapper.emitted('back')).toBeTruthy()
    })
  })

  describe('selecting a conversation', () => {
    it('should show conversation dialogue after selecting', async () => {
      const wrapper = createWrapper()
      // Click on the first conversation button in the list
      const convButtons = wrapper.findAll('.space-y-3 button')
      await convButtons[0].trigger('click')
      await wrapper.vm.$nextTick()

      // Should now show the messages
      expect(wrapper.text()).toContain('Hello! Where are you flying today?')
      expect(wrapper.text()).toContain('I am going to Tokyo.')
    })

    it('should show Play All button when conversation is selected', async () => {
      const wrapper = createWrapper()
      const convButtons = wrapper.findAll('.space-y-3 button')
      await convButtons[0].trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('learning.conversation.playAll')
    })

    it('should show practice dialogue subtitle when conversation is selected', async () => {
      const wrapper = createWrapper()
      const convButtons = wrapper.findAll('.space-y-3 button')
      await convButtons[0].trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('learning.conversation.practiceDialogue')
    })

    it('should show role labels for messages', async () => {
      const wrapper = createWrapper()
      const convButtons = wrapper.findAll('.space-y-3 button')
      await convButtons[0].trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('learning.conversation.partner')
      expect(wrapper.text()).toContain('learning.conversation.you')
    })

    it('should show native text in bilingual mode', async () => {
      const wrapper = createWrapper({ bilingual: true })
      const convButtons = wrapper.findAll('.space-y-3 button')
      await convButtons[0].trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('こんにちは！今日はどこに飛びますか？')
    })

    it('should show practice tip', async () => {
      const wrapper = createWrapper()
      const convButtons = wrapper.findAll('.space-y-3 button')
      await convButtons[0].trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('learning.conversation.practiceTip')
      expect(wrapper.text()).toContain('learning.conversation.practiceTipText')
    })
  })

  describe('navigation within component', () => {
    it('should go back to list when back button clicked from conversation view', async () => {
      const wrapper = createWrapper()
      // Select a conversation first
      const convButtons = wrapper.findAll('.space-y-3 button')
      await convButtons[0].trigger('click')
      await wrapper.vm.$nextTick()

      // Now click back button - should go back to list, not emit 'back'
      const backButton = wrapper.find('button')
      await backButton.trigger('click')
      await wrapper.vm.$nextTick()

      // Should show conversation list again
      expect(wrapper.text()).toContain('learning.conversation.selectDialogue')
      // Should NOT have emitted back (it goes to list instead)
      expect(wrapper.emitted('back')).toBeFalsy()
    })
  })

  describe('audio playback', () => {
    it('should have volume buttons for each message', async () => {
      const wrapper = createWrapper()
      const convButtons = wrapper.findAll('.space-y-3 button')
      await convButtons[0].trigger('click')
      await wrapper.vm.$nextTick()

      // Each message should have a volume_up button
      const volumeIcons = wrapper.findAll('.material-symbols-outlined').filter(el => el.text().includes('volume_up'))
      expect(volumeIcons.length).toBe(mockConversations[0].messages.length)
    })
  })

  describe('selected conversation title', () => {
    it('should display the selected conversation title in the header', async () => {
      const wrapper = createWrapper()
      const convButtons = wrapper.findAll('.space-y-3 button')
      await convButtons[0].trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('At the Airport')
    })
  })
})
