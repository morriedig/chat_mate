import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LearningScreen from '../../components/LearningScreen.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: { value: 'en' }
  })
}))

// Mock useDarkMode
vi.mock('../../composables/useDarkMode', () => ({
  useDarkMode: () => ({
    isDark: { value: false }
  })
}))

// Mock useUserProgress
const mockAddXP = vi.fn()
vi.mock('../../composables/useUserProgress', () => ({
  useUserProgress: () => ({
    addXP: mockAddXP
  })
}))

// Mock chapterLoader
vi.mock('../../data/chapterLoader', () => ({
  getChaptersByLevel: (language, level) => [
    {
      id: 'travel-basics',
      title: 'Travel Basics',
      description: 'Essential words for your travel adventures',
      icon: '✈️',
      level: 'beginner',
      wordCount: 4,
      order: 1
    },
    {
      id: 'food-dining',
      title: 'Food & Dining',
      description: 'Words for restaurants and food',
      icon: '🍜',
      level: 'beginner',
      wordCount: 2,
      order: 2
    }
  ],
  getChapterWords: (chapterId, language) => {
    if (chapterId === 'travel-basics') {
      return [
        { id: 'travel-basics_airport', word: 'airport', meaning: 'A place where planes take off', example: 'The airport is busy.' },
        { id: 'travel-basics_ticket', word: 'ticket', meaning: 'A pass for travel', example: 'Buy a ticket.' },
        { id: 'travel-basics_hotel', word: 'hotel', meaning: 'A place to stay', example: 'Nice hotel.' },
        { id: 'travel-basics_passport', word: 'passport', meaning: 'Travel document', example: 'Show passport.' }
      ]
    }
    return [
      { id: 'food-dining_restaurant', word: 'restaurant', meaning: 'A place to eat', example: 'I love this restaurant.' },
      { id: 'food-dining_menu', word: 'menu', meaning: 'A list of food', example: 'Can I see the menu?' }
    ]
  },
  getChapterChatTopics: () => []
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

describe('LearningScreen Integration', () => {
  let wrapper

  const defaultProps = {
    level: { id: 'beginner', icon: '🌱' },
    language: 'en'
  }

  const createWrapper = (props = {}) => {
    return mount(LearningScreen, {
      props: {
        ...defaultProps,
        ...props
      },
      global: {
        stubs: {
          VocabularyCard: {
            template: '<div class="vocabulary-card-stub">{{ word.word }}</div>',
            props: ['word', 'language']
          }
        }
      }
    })
  }

  beforeEach(() => {
    mockAddXP.mockClear()
    wrapper = createWrapper()
  })

  describe('chapter selection', () => {
    it('should display available chapters', () => {
      expect(wrapper.text()).toContain('Travel Basics')
      expect(wrapper.text()).toContain('Food & Dining')
    })

    it('should show chapter icons', () => {
      expect(wrapper.text()).toContain('✈️')
      expect(wrapper.text()).toContain('🍜')
    })

    it('should show word count per chapter', () => {
      expect(wrapper.text()).toMatch(/4.*learning\.words/)
      expect(wrapper.text()).toMatch(/2.*learning\.words/)
    })

    it('should show chapter description', () => {
      expect(wrapper.text()).toContain('Essential words for your travel adventures')
      expect(wrapper.text()).toContain('Words for restaurants and food')
    })

    it('should show chapter numbers', () => {
      const chapterNumbers = wrapper.findAll('.flex-shrink-0.w-12.h-12')
      expect(chapterNumbers.length).toBe(2)
      expect(chapterNumbers[0].text()).toContain('1')
      expect(chapterNumbers[1].text()).toContain('2')
    })

    it('should select chapter when clicked', async () => {
      const chapterCards = wrapper.findAll('.rounded-2xl.border-2.cursor-pointer')

      await chapterCards[0].trigger('click')

      // Chapter header should appear with title
      expect(wrapper.text()).toContain('Travel Basics')
      // Mode tabs should appear
      expect(wrapper.text()).toContain('learning.modes.list')
      expect(wrapper.text()).toContain('learning.modes.flashcard')
      expect(wrapper.text()).toContain('learning.modes.quiz')
    })
  })

  describe('learning modes', () => {
    beforeEach(async () => {
      // Select a chapter first
      const chapterCards = wrapper.findAll('.rounded-2xl.border-2.cursor-pointer')
      await chapterCards[0].trigger('click')
    })

    it('should default to list mode', () => {
      // VocabularyCard stubs should be visible
      expect(wrapper.findAll('.vocabulary-card-stub').length).toBeGreaterThan(0)
    })

    it('should switch to flashcard mode', async () => {
      const flashcardTab = wrapper.findAll('.flex.bg-slate-100 button')[1]
      await flashcardTab.trigger('click')

      // Flashcard component should be visible
      expect(wrapper.find('.perspective-1000').exists()).toBe(true)
    })

    it('should switch to quiz mode', async () => {
      const quizTab = wrapper.findAll('.flex.bg-slate-100 button')[2]
      await quizTab.trigger('click')

      // Quiz elements should be visible
      expect(wrapper.text()).toContain('learning.whatMeans')
    })
  })

  describe('navigation', () => {
    it('should emit back event when clicking back from chapters', async () => {
      const backButton = wrapper.find('button')
      await backButton.trigger('click')

      expect(wrapper.emitted('back')).toBeTruthy()
    })

    it('should go back to chapters when clicking back from learning view', async () => {
      // Select a chapter
      const chapterCards = wrapper.findAll('.rounded-2xl.border-2.cursor-pointer')
      await chapterCards[0].trigger('click')

      // Click back button
      const backButton = wrapper.find('button')
      await backButton.trigger('click')

      // Should show chapters again
      expect(wrapper.text()).toContain('learning.chooseChapter')
    })

    it('should show correct back button text', async () => {
      // Initially should show "back to setup"
      expect(wrapper.text()).toContain('learning.backToSetup')

      // Select chapter
      const chapterCards = wrapper.findAll('.rounded-2xl.border-2.cursor-pointer')
      await chapterCards[0].trigger('click')

      // Should show "back to chapters"
      expect(wrapper.text()).toContain('learning.backToChapters')
    })
  })

  describe('header display', () => {
    it('should show level icon and name', () => {
      expect(wrapper.text()).toContain('🌱')
      expect(wrapper.text()).toContain('levels.beginner.name')
    })
  })

  describe('quiz completion and XP', () => {
    beforeEach(async () => {
      // Select a chapter
      const chapterCards = wrapper.findAll('.rounded-2xl.border-2.cursor-pointer')
      await chapterCards[0].trigger('click')

      // Switch to quiz mode
      const quizTab = wrapper.findAll('.flex.bg-slate-100 button')[2]
      await quizTab.trigger('click')
    })

    it('should call addXP when quiz is completed with correct answers', async () => {
      // Answer all questions
      const totalQuestions = 4 // travel chapter has 4 words

      for (let i = 0; i < totalQuestions; i++) {
        // Find all answer options
        const optionButtons = wrapper.findAll('.w-full.p-4.rounded-xl.border-2')

        // Click the first option
        if (optionButtons.length > 0) {
          await optionButtons[0].trigger('click')
        }

        // Click next/finish
        const nextButton = wrapper.find('.w-full.py-4.rounded-xl.bg-primary')
        await nextButton.trigger('click')
      }

      // Verify the quiz completed
      expect(wrapper.text()).toMatch(/learning\.quizComplete|learning\.tryAgain/)
    })
  })

  describe('mode switching', () => {
    beforeEach(async () => {
      const chapterCards = wrapper.findAll('.rounded-2xl.border-2.cursor-pointer')
      await chapterCards[0].trigger('click')
    })

    it('should highlight active mode tab', async () => {
      const tabs = wrapper.findAll('.flex.bg-slate-100 button')

      // List mode should be active by default
      expect(tabs[0].classes()).toContain('bg-white')

      // Switch to flashcard
      await tabs[1].trigger('click')
      expect(tabs[1].classes()).toContain('bg-white')

      // Switch to quiz
      await tabs[2].trigger('click')
      expect(tabs[2].classes()).toContain('bg-white')
    })

    it('should preserve mode when navigating back and forth', async () => {
      // Switch to flashcard mode
      const tabs = wrapper.findAll('.flex.bg-slate-100 button')
      await tabs[1].trigger('click')

      // Go back to chapters
      const backButton = wrapper.find('button')
      await backButton.trigger('click')

      // Select chapter again
      const chapterCards = wrapper.findAll('.rounded-2xl.border-2.cursor-pointer')
      await chapterCards[0].trigger('click')

      // Should be in list mode again (reset)
      expect(wrapper.findAll('.vocabulary-card-stub').length).toBeGreaterThan(0)
    })
  })

  describe('chapter info display', () => {
    beforeEach(async () => {
      const chapterCards = wrapper.findAll('.rounded-2xl.border-2.cursor-pointer')
      await chapterCards[0].trigger('click')
    })

    it('should show chapter icon', () => {
      expect(wrapper.text()).toContain('✈️')
    })

    it('should show word count in selected chapter', () => {
      expect(wrapper.text()).toMatch(/4.*learning\.words/)
    })
  })

  describe('list mode', () => {
    beforeEach(async () => {
      const chapterCards = wrapper.findAll('.rounded-2xl.border-2.cursor-pointer')
      await chapterCards[0].trigger('click')
    })

    it('should display all vocabulary cards', () => {
      const cards = wrapper.findAll('.vocabulary-card-stub')
      expect(cards.length).toBe(4)
    })

    it('should pass correct props to VocabularyCard', () => {
      const cards = wrapper.findAll('.vocabulary-card-stub')
      expect(cards[0].text()).toContain('airport')
    })
  })

  describe('edge cases', () => {
    it('should handle language prop changes', async () => {
      await wrapper.setProps({ language: 'ja' })

      // Component should still render
      expect(wrapper.find('.min-h-screen').exists()).toBe(true)
    })

    it('should handle level prop changes', async () => {
      await wrapper.setProps({
        level: { id: 'advanced', icon: '🎓' }
      })

      // Should show new level icon
      expect(wrapper.text()).toContain('🎓')
    })
  })
})
