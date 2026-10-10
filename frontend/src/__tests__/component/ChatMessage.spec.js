import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatMessage from '../../components/chat/ChatMessage.vue'
import { CONNECTOR_TARGETS } from '../../data/opinionChat'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

describe('ChatMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockCharacter = {
    id: 'sakura',
    name: 'Sakura',
    avatar: '🌸'
  }

  const createWrapper = (props = {}) => {
    return mount(ChatMessage, {
      props: {
        message: { role: 'user', content: 'Hello' },
        character: mockCharacter,
        ...props
      },
      global: {
        stubs: {
          FeedbackPanel: { template: '<div class="feedback-panel-stub"></div>' }
        }
      }
    })
  }

  describe('user message', () => {
    it('should render user message correctly', () => {
      const wrapper = createWrapper({
        message: { role: 'user', content: 'Hello there!' }
      })

      expect(wrapper.text()).toContain('Hello there!')
      expect(wrapper.text()).toContain('feedback.you')
    })

    it('should show user avatar', () => {
      const wrapper = createWrapper({
        message: { role: 'user', content: 'Test' }
      })

      expect(wrapper.text()).toContain('👤')
    })

    it('should align user message to the right', () => {
      const wrapper = createWrapper({
        message: { role: 'user', content: 'Test' }
      })

      expect(wrapper.find('.justify-end').exists()).toBe(true)
    })

    it('should apply primary background to user messages', () => {
      const wrapper = createWrapper({
        message: { role: 'user', content: 'Test' }
      })

      expect(wrapper.find('.bg-primary').exists()).toBe(true)
    })
  })

  describe('assistant message', () => {
    it('should render assistant message correctly', () => {
      const wrapper = createWrapper({
        message: { role: 'assistant', content: 'Hi! How can I help?' }
      })

      expect(wrapper.text()).toContain('Hi! How can I help?')
      expect(wrapper.text()).toContain('Sakura')
    })

    it('should show character avatar', () => {
      const wrapper = createWrapper({
        message: { role: 'assistant', content: 'Test' }
      })

      expect(wrapper.text()).toContain('🌸')
    })

    it('should align assistant message to the left', () => {
      const wrapper = createWrapper({
        message: { role: 'assistant', content: 'Test' }
      })

      expect(wrapper.find('.justify-end').exists()).toBe(false)
    })

    it('should display character name', () => {
      const wrapper = createWrapper({
        message: { role: 'assistant', content: 'Test' }
      })

      expect(wrapper.text()).toContain('Sakura')
    })
  })

  describe('message content', () => {
    it('should preserve whitespace in messages', () => {
      const wrapper = createWrapper({
        message: { role: 'user', content: 'Line 1\nLine 2' }
      })

      expect(wrapper.find('.whitespace-pre-wrap').exists()).toBe(true)
    })

    it('should handle long messages with word break', () => {
      const wrapper = createWrapper({
        message: { role: 'user', content: 'A very long message that might overflow' }
      })

      expect(wrapper.find('.break-words').exists()).toBe(true)
    })

    it('should handle empty content gracefully', () => {
      const wrapper = createWrapper({
        message: { role: 'user', content: '' }
      })

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('different characters', () => {
    it('should display different character avatars', () => {
      const wrapper = createWrapper({
        message: { role: 'assistant', content: 'Test' },
        character: { id: 'kenji', name: 'Kenji', avatar: '🎌' }
      })

      expect(wrapper.text()).toContain('🎌')
      expect(wrapper.text()).toContain('Kenji')
    })
  })
  describe('connector highlights', () => {
    it('highlights connectors in user messages when targets are given', () => {
      const wrapper = createWrapper({
        message: { role: 'user', content: 'I left early so that I could rest.' },
        highlightTargets: CONNECTOR_TARGETS
      })
      const marks = wrapper.findAll('.connector-mark')
      expect(marks).toHaveLength(1)
      expect(marks[0].text()).toBe('so that')
      expect(marks[0].attributes('data-connector')).toBe('so-that')
      expect(wrapper.text()).toContain('I left early so that I could rest.')
    })

    it('does not highlight without targets', () => {
      const wrapper = createWrapper({
        message: { role: 'user', content: 'I agree because it is fun.' }
      })
      expect(wrapper.findAll('.connector-mark')).toHaveLength(0)
    })

    it('does not highlight assistant messages', () => {
      const wrapper = createWrapper({
        message: { role: 'assistant', content: 'Me too, because it is fun.' },
        highlightTargets: CONNECTOR_TARGETS
      })
      expect(wrapper.findAll('.connector-mark')).toHaveLength(0)
    })
  })
})
