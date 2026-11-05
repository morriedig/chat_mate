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
      expect(wrapper.find('.vocab-hints').exists()).toBe(true)
    })

    it('should not render when hints array is empty', () => {
      const wrapper = createWrapper({ hints: [] })
      expect(wrapper.find('.vocab-hints').exists()).toBe(false)
    })

    it('should display "try using" label', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('chat.tryUsing')
    })

    it('should not use a sparkle icon', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).not.toContain('auto_awesome')
    })
  })

  describe('hint chips', () => {
    it('should render one chip per hint', () => {
      const wrapper = createWrapper()
      expect(wrapper.findAll('.vocab-hint').length).toBe(3)
    })

    it('should display hint word', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('こんにちは')
      expect(wrapper.text()).toContain('ありがとう')
      expect(wrapper.text()).toContain('すみません')
    })

    it('shows the description and example in quotes when a chip is tapped', async () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).not.toContain('A common greeting used during daytime')

      await wrapper.findAll('.vocab-hint')[0].trigger('click')

      expect(wrapper.findAll('.vocab-hint')[0].attributes('aria-expanded')).toBe('true')
      expect(wrapper.find('.vocab-hint-detail').text()).toContain('A common greeting used during daytime')
      expect(wrapper.find('.vocab-hint-detail').text()).toContain('“こんにちは、元気ですか？”')
    })

    it('switches to another hint, and closes on a second tap', async () => {
      const wrapper = createWrapper()
      const chips = wrapper.findAll('.vocab-hint')

      await chips[0].trigger('click')
      await chips[1].trigger('click')
      expect(wrapper.find('.vocab-hint-detail').text()).toContain('Thank you (informal)')
      expect(wrapper.text()).not.toContain('A common greeting used during daytime')

      await chips[1].trigger('click')
      expect(wrapper.find('.vocab-hint-detail').exists()).toBe(false)
    })

    it('closes the detail when new hints arrive', async () => {
      const wrapper = createWrapper()
      await wrapper.findAll('.vocab-hint')[0].trigger('click')

      await wrapper.setProps({ hints: [mockHints[2]] })

      expect(wrapper.find('.vocab-hint-detail').exists()).toBe(false)
    })
  })

  describe('layout', () => {
    it('should scroll horizontally as one quiet row', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.overflow-x-auto').exists()).toBe(true)
    })
  })
})
