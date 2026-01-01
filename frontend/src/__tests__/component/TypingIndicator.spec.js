import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TypingIndicator from '../../components/chat/TypingIndicator.vue'

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

    it('should display character avatar', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('🌸')
    })

    it('should display character name', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('Sakura')
    })

    it('should show three bouncing dots', () => {
      const wrapper = createWrapper()
      const dots = wrapper.findAll('.animate-bounce')
      expect(dots.length).toBe(3)
    })

    it('should have proper animation delays for dots', () => {
      const wrapper = createWrapper()
      const dots = wrapper.findAll('.animate-bounce')

      // Check that animation delays are set (format may vary by browser/parser)
      expect(dots[0].attributes('style')).toMatch(/animation-delay:\s*0ms/)
      expect(dots[1].attributes('style')).toMatch(/animation-delay:\s*150ms/)
      expect(dots[2].attributes('style')).toMatch(/animation-delay:\s*300ms/)
    })
  })

  describe('styling', () => {
    it('should have rounded bubble container', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.rounded-2xl').exists()).toBe(true)
    })

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

      expect(wrapper.text()).toContain('🎌')
      expect(wrapper.text()).toContain('Kenji')
    })
  })
})
