import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import VocabularyWord from '../../components/chat/VocabularyWord.vue'

describe('VocabularyWord', () => {
  const mockVocabularyData = {
    definition: 'A greeting used in the morning',
    explanation: 'Used until around noon',
    example: 'おはようございます、先生！'
  }

  const createWrapper = (props = {}) => {
    return mount(VocabularyWord, {
      props: {
        word: 'おはよう',
        vocabularyData: mockVocabularyData,
        ...props
      }
    })
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('rendering', () => {
    it('should render the word', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('おはよう')
    })

    it('should have vocabulary-word class', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.vocabulary-word').exists()).toBe(true)
    })

    it('should not show popup initially', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.vocabulary-popup').exists()).toBe(false)
    })
  })

  describe('popup behavior', () => {
    it('should show popup on mouseenter', async () => {
      const wrapper = createWrapper()
      const wordWrapper = wrapper.find('.vocabulary-word-wrapper')

      await wordWrapper.trigger('mouseenter')

      expect(wrapper.find('.vocabulary-popup').exists()).toBe(true)
    })

    it('should hide popup on mouseleave after delay', async () => {
      const wrapper = createWrapper()
      const wordWrapper = wrapper.find('.vocabulary-word-wrapper')

      await wordWrapper.trigger('mouseenter')
      expect(wrapper.find('.vocabulary-popup').exists()).toBe(true)

      await wordWrapper.trigger('mouseleave')
      vi.advanceTimersByTime(150) // Wait for hide timeout

      await wrapper.vm.$nextTick()
      expect(wrapper.find('.vocabulary-popup').exists()).toBe(false)
    })

    it('should cancel hide timeout on re-enter', async () => {
      const wrapper = createWrapper()
      const wordWrapper = wrapper.find('.vocabulary-word-wrapper')

      await wordWrapper.trigger('mouseenter')
      await wordWrapper.trigger('mouseleave')
      vi.advanceTimersByTime(50) // Partial timeout

      await wordWrapper.trigger('mouseenter')
      vi.advanceTimersByTime(100) // Complete original timeout

      // Popup should still be visible
      expect(wrapper.find('.vocabulary-popup').exists()).toBe(true)
    })
  })

  describe('popup content', () => {
    it('should display word in popup header', async () => {
      const wrapper = createWrapper()
      await wrapper.find('.vocabulary-word-wrapper').trigger('mouseenter')

      expect(wrapper.find('.popup-word').text()).toBe('おはよう')
    })

    it('should display definition', async () => {
      const wrapper = createWrapper()
      await wrapper.find('.vocabulary-word-wrapper').trigger('mouseenter')

      expect(wrapper.text()).toContain('A greeting used in the morning')
    })

    it('should display explanation when available', async () => {
      const wrapper = createWrapper()
      await wrapper.find('.vocabulary-word-wrapper').trigger('mouseenter')

      expect(wrapper.text()).toContain('Used until around noon')
    })

    it('should display example when available', async () => {
      const wrapper = createWrapper()
      await wrapper.find('.vocabulary-word-wrapper').trigger('mouseenter')

      expect(wrapper.text()).toContain('おはようございます、先生！')
    })

    it('should not show explanation section when not provided', async () => {
      const wrapper = createWrapper({
        vocabularyData: {
          definition: 'Test definition'
        }
      })
      await wrapper.find('.vocabulary-word-wrapper').trigger('mouseenter')

      expect(wrapper.text()).not.toContain('Explanation')
    })

    it('should not show example section when not provided', async () => {
      const wrapper = createWrapper({
        vocabularyData: {
          definition: 'Test definition'
        }
      })
      await wrapper.find('.vocabulary-word-wrapper').trigger('mouseenter')

      expect(wrapper.text()).not.toContain('Example')
    })
  })

  describe('popup position', () => {
    it('should default to bottom position', async () => {
      const wrapper = createWrapper()
      await wrapper.find('.vocabulary-word-wrapper').trigger('mouseenter')

      expect(wrapper.find('.vocabulary-popup.bottom').exists()).toBe(true)
    })

    it('should support top position', async () => {
      const wrapper = createWrapper({ popupPosition: 'top' })
      await wrapper.find('.vocabulary-word-wrapper').trigger('mouseenter')

      expect(wrapper.find('.vocabulary-popup.top').exists()).toBe(true)
    })
  })

  describe('different words', () => {
    it('should display different vocabulary words', () => {
      const wrapper = createWrapper({
        word: 'さようなら',
        vocabularyData: {
          definition: 'Goodbye'
        }
      })

      expect(wrapper.text()).toContain('さようなら')
    })
  })
})
