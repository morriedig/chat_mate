import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FlashcardMode from '../../components/learning/FlashcardMode.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

// Mock Audio API
class MockAudio {
  constructor() {
    this.onended = null
    this.onerror = null
  }
  play() {
    return Promise.resolve()
  }
}
global.Audio = MockAudio

// Mock words for testing
const mockWords = [
  { id: 1, word: 'hello', meaning: 'greeting', example: 'Hello there!', reading: 'ハロー', audio: '/audio/hello.mp3' },
  { id: 2, word: 'goodbye', meaning: 'farewell', example: 'Goodbye friend!', reading: 'グッバイ', audio: '/audio/goodbye.mp3' },
  { id: 3, word: 'thanks', meaning: 'gratitude', example: 'Thanks for helping!', phonetic: '/θæŋks/', audio: '/audio/thanks.mp3' }
]

describe('FlashcardMode', () => {
  let wrapper

  const createWrapper = (props = {}) => {
    return mount(FlashcardMode, {
      props: {
        words: mockWords,
        language: 'en',
        ...props
      }
    })
  }

  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('rendering', () => {
    it('should render flashcard container', () => {
      expect(wrapper.find('.flex.flex-col.items-center').exists()).toBe(true)
    })

    it('should display progress bar', () => {
      expect(wrapper.find('.h-2.bg-slate-200').exists()).toBe(true)
    })

    it('should display flashcard', () => {
      expect(wrapper.find('.perspective-1000').exists()).toBe(true)
    })

    it('should display navigation buttons', () => {
      const navButtons = wrapper.findAll('.size-12.rounded-full')
      expect(navButtons.length).toBe(2) // prev and next buttons
    })

    it('should display shuffle button', () => {
      expect(wrapper.text()).toMatch(/learning\.shuffle/)
    })
  })

  describe('card display', () => {
    it('should show word on front of card', () => {
      expect(wrapper.text()).toMatch(/hello|goodbye|thanks/)
    })

    it('should show audio play button', () => {
      expect(wrapper.text()).toMatch(/learning\.listen/)
    })

    it('should show tap to flip hint', () => {
      expect(wrapper.text()).toMatch(/learning\.tapToFlip/)
    })
  })

  describe('flip functionality', () => {
    it('should flip card when clicked', async () => {
      const flashcard = wrapper.find('.perspective-1000')

      await flashcard.trigger('click')

      // Card should have rotate-y-180 class after flip
      const innerCard = wrapper.find('.transition-transform.duration-500')
      expect(innerCard.classes()).toContain('rotate-y-180')
    })

    it('should show meaning after flip', async () => {
      const flashcard = wrapper.find('.perspective-1000')

      await flashcard.trigger('click')

      // After flip, meaning should be visible (in the back face)
      expect(wrapper.text()).toMatch(/greeting|farewell|gratitude/)
    })

    it('should show example after flip', async () => {
      const flashcard = wrapper.find('.perspective-1000')

      await flashcard.trigger('click')

      // Example should be visible
      expect(wrapper.text()).toMatch(/Hello there!|Goodbye friend!|Thanks for helping!/)
    })

    it('should toggle flip state on multiple clicks', async () => {
      const flashcard = wrapper.find('.perspective-1000')

      await flashcard.trigger('click')
      let innerCard = wrapper.find('.transition-transform.duration-500')
      expect(innerCard.classes()).toContain('rotate-y-180')

      await flashcard.trigger('click')
      innerCard = wrapper.find('.transition-transform.duration-500')
      expect(innerCard.classes()).not.toContain('rotate-y-180')
    })
  })

  describe('navigation', () => {
    it('should disable prev button on first card', () => {
      const prevButton = wrapper.findAll('.size-12.rounded-full')[0]
      expect(prevButton.attributes('disabled')).toBeDefined()
    })

    it('should enable next button on first card', () => {
      const nextButton = wrapper.findAll('.size-12.rounded-full')[1]
      expect(nextButton.attributes('disabled')).toBeUndefined()
    })

    it('should move to next card when next is clicked', async () => {
      const nextButton = wrapper.findAll('.size-12.rounded-full')[1]

      await nextButton.trigger('click')

      // Progress should update
      expect(wrapper.text()).toMatch(/2 \//)
    })

    it('should enable prev button after moving to second card', async () => {
      const nextButton = wrapper.findAll('.size-12.rounded-full')[1]
      await nextButton.trigger('click')

      const prevButton = wrapper.findAll('.size-12.rounded-full')[0]
      expect(prevButton.attributes('disabled')).toBeUndefined()
    })

    it('should go back when prev is clicked', async () => {
      // Move to second card
      const nextButton = wrapper.findAll('.size-12.rounded-full')[1]
      await nextButton.trigger('click')

      // Move back
      const prevButton = wrapper.findAll('.size-12.rounded-full')[0]
      await prevButton.trigger('click')

      expect(wrapper.text()).toMatch(/1 \//)
    })

    it('should disable next button on last card', async () => {
      // Navigate to last card
      for (let i = 0; i < mockWords.length - 1; i++) {
        const nextButton = wrapper.findAll('.size-12.rounded-full')[1]
        await nextButton.trigger('click')
      }

      const nextButton = wrapper.findAll('.size-12.rounded-full')[1]
      expect(nextButton.attributes('disabled')).toBeDefined()
    })

    it('should reset flip state when navigating', async () => {
      // Flip card
      const flashcard = wrapper.find('.perspective-1000')
      await flashcard.trigger('click')

      // Navigate
      const nextButton = wrapper.findAll('.size-12.rounded-full')[1]
      await nextButton.trigger('click')

      // Card should not be flipped
      const innerCard = wrapper.find('.transition-transform.duration-500')
      expect(innerCard.classes()).not.toContain('rotate-y-180')
    })
  })

  describe('shuffle functionality', () => {
    it('should shuffle cards when shuffle button is clicked', async () => {
      const shuffleButton = wrapper.find('.px-6.py-3.rounded-xl')

      await shuffleButton.trigger('click')

      // Cards should still be present but may be in different order
      expect(wrapper.text()).toMatch(/hello|goodbye|thanks/)
    })

    it('should reset to first card after shuffle', async () => {
      // Navigate to second card
      const nextButton = wrapper.findAll('.size-12.rounded-full')[1]
      await nextButton.trigger('click')

      // Shuffle
      const shuffleButton = wrapper.find('.px-6.py-3.rounded-xl')
      await shuffleButton.trigger('click')

      // Should be back at first card
      expect(wrapper.text()).toMatch(/1 \//)
    })

    it('should reset flip state after shuffle', async () => {
      // Flip card
      const flashcard = wrapper.find('.perspective-1000')
      await flashcard.trigger('click')

      // Shuffle
      const shuffleButton = wrapper.find('.px-6.py-3.rounded-xl')
      await shuffleButton.trigger('click')

      // Card should not be flipped
      const innerCard = wrapper.find('.transition-transform.duration-500')
      expect(innerCard.classes()).not.toContain('rotate-y-180')
    })
  })

  describe('progress tracking', () => {
    it('should show correct progress percentage', () => {
      // First card of 3 = ~33%
      expect(wrapper.text()).toMatch(/33%|34%/)
    })

    it('should update progress as cards are viewed', async () => {
      const nextButton = wrapper.findAll('.size-12.rounded-full')[1]

      await nextButton.trigger('click')
      expect(wrapper.text()).toMatch(/67%|66%/)

      await nextButton.trigger('click')
      expect(wrapper.text()).toMatch(/100%/)
    })

    it('should show card count', () => {
      expect(wrapper.text()).toMatch(/1 \/ 3/)
    })
  })

  describe('audio functionality', () => {
    it('should have play button', () => {
      const playButton = wrapper.find('button.mt-6')
      expect(playButton.exists()).toBe(true)
    })

    it('should play audio when play button is clicked', async () => {
      const playButton = wrapper.find('button.mt-6')

      // Click should not throw error
      await playButton.trigger('click')
    })
  })

  describe('props reactivity', () => {
    it('should reinitialize when words prop changes', async () => {
      const newWords = [
        { id: 10, word: 'test', meaning: 'test meaning', example: 'Test example' }
      ]

      await wrapper.setProps({ words: newWords })

      // Should show new word
      expect(wrapper.text()).toMatch(/test/)
      expect(wrapper.text()).toMatch(/1 \/ 1/)
    })
  })

  describe('reading and phonetic display', () => {
    it('should show reading if word has reading property', async () => {
      // Navigate through all cards to find one with reading
      let foundReading = false
      const nextButton = wrapper.findAll('.size-12.rounded-full')[1]

      for (let i = 0; i < mockWords.length; i++) {
        if (wrapper.text().match(/ハロー|グッバイ/)) {
          foundReading = true
          break
        }
        if (i < mockWords.length - 1) {
          await nextButton.trigger('click')
        }
      }

      expect(foundReading).toBe(true)
    })

    it('should show phonetic if word has phonetic property', async () => {
      // Navigate through all cards to find one with phonetic
      let foundPhonetic = false
      const nextButton = wrapper.findAll('.size-12.rounded-full')[1]

      for (let i = 0; i < mockWords.length; i++) {
        if (wrapper.text().match(/\/θæŋks\//)) {
          foundPhonetic = true
          break
        }
        if (i < mockWords.length - 1) {
          await nextButton.trigger('click')
        }
      }

      expect(foundPhonetic).toBe(true)
    })
  })

  describe('keyboard hints', () => {
    it('should display keyboard hints on desktop', () => {
      expect(wrapper.text()).toMatch(/learning\.keyboardHints/)
    })
  })
})
