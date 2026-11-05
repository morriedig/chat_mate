import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TypingIndicator from '../../components/chat/TypingIndicator.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

describe('TypingIndicator', () => {
  const mockCharacter = {
    id: 'sakura',
    name: 'Sakura',
    avatar: '🌸'
  }

  const createWrapper = (props = {}) => {
    return mount(TypingIndicator, {
      props: {
        character: mockCharacter,
        ...props
      }
    })
  }

  describe('rendering', () => {
    it('should render the typing indicator', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should display a monogram avatar named after the friend', () => {
      const wrapper = createWrapper()
      const avatar = wrapper.find('[role="img"]')
      expect(avatar.text()).toBe('S')
      expect(avatar.attributes('aria-label')).toBe('Sakura')
      expect(wrapper.text()).not.toContain('🌸')
    })

    it('should say the friend is replying', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('chat.typing')
      expect(wrapper.attributes('role')).toBe('status')
    })

    it('should show two static bars instead of bouncing dots', () => {
      const wrapper = createWrapper()
      expect(wrapper.findAll('.typing-bar').length).toBe(2)
      expect(wrapper.find('.animate-bounce').exists()).toBe(false)
    })
  })

  describe('styling', () => {

    it('should align to the left like assistant messages', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.items-end').exists()).toBe(true)
    })
  })

  describe('different characters', () => {
    it('should display different character avatars', () => {
      const wrapper = createWrapper({
        character: { id: 'kenji', name: 'Kenji', avatar: '🎌' }
      })

      expect(wrapper.find('[role="img"]').attributes('aria-label')).toBe('Kenji')
      expect(wrapper.find('[role="img"]').text()).toBe('K')
    })
  })
})
