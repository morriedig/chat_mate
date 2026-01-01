import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VocabularyHints from '../../components/chat/VocabularyHints.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

describe('VocabularyHints', () => {
  const mockHints = [
    {
      word: 'こんにちは',
      description: 'A common greeting used during daytime',
      example: 'こんにちは、元気ですか？'
    },
    {
      word: 'ありがとう',
      description: 'Thank you (informal)',
      example: 'ありがとう！助かりました。'
    },
    {
      word: 'すみません',
      description: 'Excuse me / Sorry',
      example: 'すみません、道を教えてください。'
    }
  ]

  const createWrapper = (props = {}) => {
    return mount(VocabularyHints, {
      props: {
        hints: mockHints,
        ...props
      }
    })
  }

  describe('rendering', () => {
    it('should render when hints are provided', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should not render when hints array is empty', () => {
      const wrapper = createWrapper({ hints: [] })
      expect(wrapper.find('.max-w-3xl').exists()).toBe(false)
    })

    it('should display "try using" header', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('chat.tryUsing')
    })

    it('should show auto_awesome icon', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('auto_awesome')
    })
  })

  describe('hint cards', () => {
    it('should render all hint cards', () => {
      const wrapper = createWrapper()
      const cards = wrapper.findAll('.flex.flex-col.p-3')
      expect(cards.length).toBe(3)
    })

    it('should display hint word', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('こんにちは')
      expect(wrapper.text()).toContain('ありがとう')
      expect(wrapper.text()).toContain('すみません')
    })

    it('should display hint description', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('A common greeting used during daytime')
      expect(wrapper.text()).toContain('Thank you (informal)')
    })

    it('should display example in quotes', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('こんにちは、元気ですか？')
    })
  })

  describe('single hint', () => {
    it('should render single hint correctly', () => {
      const wrapper = createWrapper({
        hints: [mockHints[0]]
      })

      expect(wrapper.text()).toContain('こんにちは')
      expect(wrapper.text()).toContain('A common greeting used during daytime')
    })
  })

  describe('styling', () => {
    it('should have horizontal scrolling on mobile', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.overflow-x-auto').exists()).toBe(true)
    })

    it('should use grid layout on larger screens', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.sm\\:grid').exists()).toBe(true)
    })

    it('should have cards with fixed width on mobile', () => {
      const wrapper = createWrapper()
      const cards = wrapper.findAll('.w-48')
      expect(cards.length).toBeGreaterThan(0)
    })
  })
})
