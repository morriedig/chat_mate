import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatMessage from '../../components/chat/ChatMessage.vue'

describe('ChatMessage', () => {
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
      }
    })
  }

  describe('user message', () => {
    it('should render user message correctly', () => {
      const wrapper = createWrapper({
        message: { role: 'user', content: 'Hello there!' }
      })

      expect(wrapper.text()).toContain('Hello there!')
      expect(wrapper.text()).toContain('You')
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
})
