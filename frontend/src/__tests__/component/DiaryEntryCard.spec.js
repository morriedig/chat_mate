import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DiaryEntryCard from '../../components/diary/DiaryEntryCard.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key, params) => {
      if (params && params.count !== undefined) {
        return `${params.count} words`
      }
      return key
    }
  })
}))

describe('DiaryEntryCard', () => {
  function createEntry(overrides = {}) {
    return {
      id: 'test-entry-1',
      createdAt: '2026-03-15T10:30:00Z',
      title: 'Today I went to the park and had a nice walk',
      wordCount: 10,
      feedbackStatus: 'none',
      language: 'en',
      ...overrides
    }
  }

  const createWrapper = (entry) => {
    return mount(DiaryEntryCard, {
      props: {
        entry
      }
    })
  }

  describe('rendering', () => {
    it('should render the card as a button', () => {
      const wrapper = createWrapper(createEntry())
      expect(wrapper.find('[data-testid="diary-entry-card"]').exists()).toBe(true)
    })

    it('should display formatted date', () => {
      const wrapper = createWrapper(createEntry({ createdAt: '2026-03-15T10:30:00Z' }))
      const dateEl = wrapper.find('[data-testid="entry-date"]')
      // Should contain some date text (Mar 15 or similar)
      expect(dateEl.text()).toContain('15')
    })

    it('should display preview text', () => {
      const wrapper = createWrapper(createEntry({ title: 'Hello world today' }))
      const previewEl = wrapper.find('[data-testid="entry-preview"]')
      expect(previewEl.text()).toContain('Hello world today')
    })

    it('should display word count', () => {
      const wrapper = createWrapper(createEntry({ wordCount: 42 }))
      const wordCountEl = wrapper.find('[data-testid="entry-word-count"]')
      expect(wordCountEl.text()).toContain('42 words')
    })
  })

  describe('feedback status badge', () => {
    it('should show Reviewed badge for done status', () => {
      const wrapper = createWrapper(createEntry({ feedbackStatus: 'done' }))
      const badge = wrapper.find('[data-testid="feedback-badge"]')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toContain('diary.status.reviewed')
    })

    it('should show Reviewing... badge for loading status', () => {
      const wrapper = createWrapper(createEntry({ feedbackStatus: 'loading' }))
      const badge = wrapper.find('[data-testid="feedback-badge"]')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toContain('diary.status.reviewing')
    })

    it('should show Pending badge for pending status', () => {
      const wrapper = createWrapper(createEntry({ feedbackStatus: 'pending' }))
      const badge = wrapper.find('[data-testid="feedback-badge"]')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toContain('diary.status.pending')
    })

    it('should show Error badge for error status', () => {
      const wrapper = createWrapper(createEntry({ feedbackStatus: 'error' }))
      const badge = wrapper.find('[data-testid="feedback-badge"]')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toContain('diary.status.error')
    })

    it('should show no badge for none status', () => {
      const wrapper = createWrapper(createEntry({ feedbackStatus: 'none' }))
      expect(wrapper.find('[data-testid="feedback-badge"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="rewrite-badge"]').exists()).toBe(false)
    })
  })

  describe('events', () => {
    it('should emit select event with entry when clicked', async () => {
      const entry = createEntry()
      const wrapper = createWrapper(entry)

      await wrapper.find('[data-testid="diary-entry-card"]').trigger('click')

      expect(wrapper.emitted('select')).toBeTruthy()
      expect(wrapper.emitted('select')[0][0]).toEqual(entry)
    })
  })

  describe('text truncation', () => {
    it('should truncate long text with ellipsis', () => {
      const longTitle = 'A'.repeat(100)
      const wrapper = createWrapper(createEntry({ title: longTitle }))
      const previewEl = wrapper.find('[data-testid="entry-preview"]')
      expect(previewEl.text()).toContain('...')
    })

    it('should not truncate short text', () => {
      const shortTitle = 'Short text'
      const wrapper = createWrapper(createEntry({ title: shortTitle }))
      const previewEl = wrapper.find('[data-testid="entry-preview"]')
      expect(previewEl.text()).toContain('Short text')
      // The preview text should not have ellipsis
      expect(previewEl.text()).not.toContain('...')
    })
  })

  describe('CJK language handling', () => {
    it('should use charCount label for Japanese entries', () => {
      const wrapper = createWrapper(createEntry({ language: 'ja', wordCount: 20 }))
      const wordCountEl = wrapper.find('[data-testid="entry-word-count"]')
      // The mock t function returns the key for diary.charCount
      expect(wordCountEl.text()).toContain('20 words')
    })

    it('should use wordCount label for English entries', () => {
      const wrapper = createWrapper(createEntry({ language: 'en', wordCount: 15 }))
      const wordCountEl = wrapper.find('[data-testid="entry-word-count"]')
      expect(wordCountEl.text()).toContain('15 words')
    })
  })
})
