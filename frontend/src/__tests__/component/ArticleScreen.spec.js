import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import ArticleScreen from '../../components/ArticleScreen.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: ref('en')
  })
}))

// Mock articles data
vi.mock('../../data/articles.js', () => ({
  articles: {
    en: [
      {
        id: 'article-1',
        topic_id: 'greetings',
        levels: {
          beginner: {
            title: 'Basic Greetings',
            content: 'Hello [[world]]! This is a test article.',
            ai_opening_line: 'Let us discuss greetings!',
            vocabulary: [
              { word: 'world', definition: 'The earth' },
              { word: 'hello', definition: 'A greeting' }
            ]
          }
        }
      },
      {
        id: 'article-2',
        topic_id: 'food',
        levels: {
          beginner: {
            title: 'Japanese Food',
            content: 'Sushi is delicious.',
            ai_opening_line: 'Let us talk about food!',
            vocabulary: [
              { word: 'sushi', definition: 'Japanese rice dish' }
            ]
          }
        }
      }
    ]
  }
}))

// Mock useArticleParser
vi.mock('../../composables/useArticleParser', () => ({
  stripMarkers: (text) => text.replace(/\[\[(\w+)\]\]/g, '$1')
}))

describe('ArticleScreen', () => {
  const mockLevel = {
    id: 'beginner',
    name: 'Beginner',
    icon: '🌱'
  }

  const createWrapper = (props = {}) => {
    return mount(ArticleScreen, {
      props: {
        level: mockLevel,
        ...props
      }
    })
  }

  describe('rendering', () => {
    it('should render the screen', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.min-h-screen').exists()).toBe(true)
    })

    it('should display title', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('articles.title')
    })

    it('should have back button', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.text()).toContain('arrow_back')
    })
  })

  describe('level indicator', () => {
    it('should show level label', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('articles.levelLabel')
    })

    it('should show current level name', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('levels.beginner.name')
    })
  })

  describe('articles list', () => {
    it('should display filtered articles', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('Basic Greetings')
      expect(wrapper.text()).toContain('Japanese Food')
    })

    it('should show article preview', () => {
      const wrapper = createWrapper()
      // Preview should contain stripped content
      expect(wrapper.text()).toContain('Hello world')
    })

    it('should show vocabulary keywords', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('articles.keyWords')
      expect(wrapper.text()).toContain('world')
    })

    it('should render article cards', () => {
      const wrapper = createWrapper()
      const cards = wrapper.findAll('.rounded-xl.border')
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  describe('article selection', () => {
    it('should emit select event when article is clicked', async () => {
      const wrapper = createWrapper()
      // Use more specific selector for article cards (not the back button icon)
      const articleCards = wrapper.findAll('.rounded-xl.border.cursor-pointer')

      await articleCards[0].trigger('click')

      expect(wrapper.emitted('select')).toBeTruthy()
    })

    it('should pass correct article data on select', async () => {
      const wrapper = createWrapper()
      // Use more specific selector for article cards (not the back button icon)
      const articleCards = wrapper.findAll('.rounded-xl.border.cursor-pointer')

      await articleCards[0].trigger('click')

      const payload = wrapper.emitted('select')[0][0]
      expect(payload).toHaveProperty('id')
      expect(payload).toHaveProperty('title')
      expect(payload).toHaveProperty('content')
      expect(payload).toHaveProperty('vocabulary')
    })
  })

  describe('navigation', () => {
    it('should emit back event when back button is clicked', async () => {
      const wrapper = createWrapper()
      const backButton = wrapper.find('button')

      await backButton.trigger('click')

      expect(wrapper.emitted('back')).toBeTruthy()
    })
  })

  describe('empty state', () => {
    it('should show no articles message when empty', () => {
      const wrapper = createWrapper({
        level: { id: 'nonexistent', name: 'None' }
      })

      expect(wrapper.text()).toContain('articles.noArticles')
    })
  })

  describe('responsive design', () => {
    it('should have max width container', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.max-w-3xl').exists()).toBe(true)
    })
  })
})
