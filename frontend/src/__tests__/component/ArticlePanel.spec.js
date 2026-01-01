import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import ArticlePanel from '../../components/chat/ArticlePanel.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

// Mock useArticleParser
vi.mock('../../composables/useArticleParser', () => ({
  useArticleParser: (articleRef) => ({
    contentSegments: computed(() => [
      { type: 'text', content: 'This is some text. ' },
      { type: 'vocab', word: 'example', data: { definition: 'A sample' } },
      { type: 'text', content: ' and more text.' },
      { type: 'break' },
      { type: 'text', content: 'New paragraph.' }
    ])
  })
}))

// Mock VocabularyWord
const VocabularyWordStub = {
  template: '<span class="vocab-word-stub">{{ word }}</span>',
  props: ['word', 'vocabularyData']
}

describe('ArticlePanel', () => {
  const mockArticle = {
    id: 'article-1',
    title: 'Learning Japanese',
    content: 'This is a [[example]] article content.',
    vocabulary: [
      { word: 'example', definition: 'A sample' },
      { word: 'test', definition: 'A trial' }
    ]
  }

  const createWrapper = (props = {}) => {
    return mount(ArticlePanel, {
      props: {
        article: mockArticle,
        ...props
      },
      global: {
        stubs: {
          VocabularyWord: VocabularyWordStub
        }
      }
    })
  }

  describe('rendering', () => {
    it('should render the panel', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should display article title', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('Learning Japanese')
    })

    it('should have scrollable container', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.overflow-y-auto').exists()).toBe(true)
    })
  })

  describe('content segments', () => {
    it('should render text segments', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('This is some text.')
      expect(wrapper.text()).toContain('and more text.')
    })

    it('should render vocabulary word components', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.vocab-word-stub').exists()).toBe(true)
    })

    it('should render line breaks', () => {
      const wrapper = createWrapper()
      const breaks = wrapper.findAll('br')
      expect(breaks.length).toBeGreaterThan(0)
    })
  })

  describe('vocabulary list', () => {
    it('should display key words header', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('articles.keyWords')
    })

    it('should display all vocabulary items', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('example')
      expect(wrapper.text()).toContain('test')
    })

    it('should display vocabulary definitions', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('A sample')
      expect(wrapper.text()).toContain('A trial')
    })

    it('should render vocabulary cards', () => {
      const wrapper = createWrapper()
      const vocabCards = wrapper.findAll('.bg-white.border')
      expect(vocabCards.length).toBe(2)
    })
  })

  describe('responsive design', () => {
    it('should have width constraints', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.lg\\:w-\\[500px\\]').exists()).toBe(true)
    })

    it('should have max height on mobile', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.max-h-64').exists()).toBe(true)
    })
  })

  describe('different articles', () => {
    it('should display different article titles', () => {
      const wrapper = createWrapper({
        article: {
          id: 'article-2',
          title: 'Advanced Grammar',
          content: 'Grammar content here.',
          vocabulary: []
        }
      })

      expect(wrapper.text()).toContain('Advanced Grammar')
    })

    it('should handle articles with no vocabulary', () => {
      const wrapper = createWrapper({
        article: {
          id: 'article-3',
          title: 'Simple Article',
          content: 'No vocabulary here.',
          vocabulary: []
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('articles.keyWords')
    })
  })
})
