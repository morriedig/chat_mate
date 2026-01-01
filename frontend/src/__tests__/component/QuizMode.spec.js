import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import QuizMode from '../../components/learning/QuizMode.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

// Mock words for testing
const mockWords = [
  { id: 1, word: 'hello', meaning: 'greeting', example: 'Hello there!', phonetic: '/həˈloʊ/' },
  { id: 2, word: 'goodbye', meaning: 'farewell', example: 'Goodbye friend!', phonetic: '/ɡʊdˈbaɪ/' },
  { id: 3, word: 'thanks', meaning: 'gratitude', example: 'Thanks for helping!', phonetic: '/θæŋks/' },
  { id: 4, word: 'please', meaning: 'polite request', example: 'Please help me.', phonetic: '/pliːz/' }
]

describe('QuizMode', () => {
  let wrapper

  const createWrapper = (props = {}) => {
    return mount(QuizMode, {
      props: {
        words: mockWords,
        language: 'en',
        ...props
      },
      global: {
        stubs: {
          // Stub material symbols
          'span': false
        }
      }
    })
  }

  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('rendering', () => {
    it('should render quiz interface', () => {
      expect(wrapper.find('.flex.flex-col.items-center').exists()).toBe(true)
    })

    it('should display progress bar', () => {
      expect(wrapper.find('.h-2.bg-slate-200').exists()).toBe(true)
    })

    it('should display question card', () => {
      expect(wrapper.find('.rounded-2xl').exists()).toBe(true)
    })

    it('should display answer options', () => {
      const buttons = wrapper.findAll('button')
      // At least 2-4 answer options should be displayed
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })

    it('should display current question text', () => {
      expect(wrapper.text()).toMatch(/learning\.whatMeans/)
    })
  })

  describe('answer selection', () => {
    it('should allow selecting an answer', async () => {
      const optionButtons = wrapper.findAll('.w-full.p-4.rounded-xl.border-2')

      expect(optionButtons.length).toBeGreaterThanOrEqual(2)

      await optionButtons[0].trigger('click')

      // After clicking, the next button should appear
      expect(wrapper.text()).toMatch(/learning\.nextQuestion|learning\.finishQuiz/)
    })

    it('should disable options after answer is selected', async () => {
      const optionButtons = wrapper.findAll('.w-full.p-4.rounded-xl.border-2')

      await optionButtons[0].trigger('click')

      // Check that buttons are disabled
      const disabledButtons = wrapper.findAll('.w-full.p-4.rounded-xl.border-2[disabled]')
      expect(disabledButtons.length).toBeGreaterThan(0)
    })

    it('should show feedback after answering', async () => {
      const optionButtons = wrapper.findAll('.w-full.p-4.rounded-xl.border-2')

      await optionButtons[0].trigger('click')

      // Feedback section should be visible
      expect(wrapper.text()).toMatch(/learning\.correct|learning\.incorrect/)
    })
  })

  describe('navigation', () => {
    it('should move to next question when next button is clicked', async () => {
      const optionButtons = wrapper.findAll('.w-full.p-4.rounded-xl.border-2')
      await optionButtons[0].trigger('click')

      // Find and click next button
      const nextButton = wrapper.find('.w-full.py-4.rounded-xl.bg-primary')
      await nextButton.trigger('click')

      // Progress should update
      expect(wrapper.text()).toMatch(/2 \/|learning\.question 2/)
    })
  })

  describe('quiz completion', () => {
    it('should emit complete event when quiz finishes', async () => {
      // Answer all questions
      for (let i = 0; i < mockWords.length; i++) {
        const optionButtons = wrapper.findAll('.w-full.p-4.rounded-xl.border-2')
        await optionButtons[0].trigger('click')

        const nextButton = wrapper.find('.w-full.py-4.rounded-xl.bg-primary')
        await nextButton.trigger('click')
      }

      // Check complete event was emitted
      expect(wrapper.emitted('complete')).toBeTruthy()
      expect(wrapper.emitted('complete').length).toBe(1)

      // Check event payload
      const payload = wrapper.emitted('complete')[0][0]
      expect(payload).toHaveProperty('score')
      expect(payload).toHaveProperty('total')
      expect(payload).toHaveProperty('accuracy')
      expect(payload).toHaveProperty('xpEarned')
    })

    it('should show completion screen after quiz ends', async () => {
      // Answer all questions
      for (let i = 0; i < mockWords.length; i++) {
        const optionButtons = wrapper.findAll('.w-full.p-4.rounded-xl.border-2')
        await optionButtons[0].trigger('click')

        const nextButton = wrapper.find('.w-full.py-4.rounded-xl.bg-primary')
        await nextButton.trigger('click')
      }

      // Completion screen should show
      expect(wrapper.text()).toMatch(/learning\.quizComplete/)
      expect(wrapper.text()).toMatch(/learning\.yourScore/)
    })

    it('should show review answers after completion', async () => {
      // Answer all questions
      for (let i = 0; i < mockWords.length; i++) {
        const optionButtons = wrapper.findAll('.w-full.p-4.rounded-xl.border-2')
        await optionButtons[0].trigger('click')

        const nextButton = wrapper.find('.w-full.py-4.rounded-xl.bg-primary')
        await nextButton.trigger('click')
      }

      expect(wrapper.text()).toMatch(/learning\.reviewAnswers/)
    })
  })

  describe('restart functionality', () => {
    it('should restart quiz when try again is clicked', async () => {
      // Complete the quiz
      for (let i = 0; i < mockWords.length; i++) {
        const optionButtons = wrapper.findAll('.w-full.p-4.rounded-xl.border-2')
        await optionButtons[0].trigger('click')

        const nextButton = wrapper.find('.w-full.py-4.rounded-xl.bg-primary')
        await nextButton.trigger('click')
      }

      // Find and click restart button
      const restartButton = wrapper.find('.w-full.py-4.rounded-xl.bg-primary')
      await restartButton.trigger('click')

      // Should be back at first question
      expect(wrapper.text()).toMatch(/1 \//)
      expect(wrapper.text()).not.toMatch(/learning\.quizComplete/)
    })
  })

  describe('props reactivity', () => {
    it('should reinitialize when words prop changes', async () => {
      const newWords = [
        { id: 10, word: 'test', meaning: 'test meaning', example: 'Test example' }
      ]

      await wrapper.setProps({ words: newWords })

      // Quiz should reset
      expect(wrapper.text()).toMatch(/1 \//)
    })
  })

  describe('XP display', () => {
    it('should show XP earned after completion', async () => {
      // Complete the quiz
      for (let i = 0; i < mockWords.length; i++) {
        const optionButtons = wrapper.findAll('.w-full.p-4.rounded-xl.border-2')
        await optionButtons[0].trigger('click')

        const nextButton = wrapper.find('.w-full.py-4.rounded-xl.bg-primary')
        await nextButton.trigger('click')
      }

      // XP should be displayed
      expect(wrapper.text()).toMatch(/XP.*learning\.earned/)
    })
  })
})
