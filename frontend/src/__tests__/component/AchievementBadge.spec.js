import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AchievementBadge from '../../components/chat/AchievementBadge.vue'

// Mock vue-i18n globally
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

describe('AchievementBadge', () => {
  const mockAchievement = {
    id: 'first_message',
    category: 'first_steps',
    icon: '💬'
  }

  const createWrapper = (props = {}) => {
    return mount(AchievementBadge, {
      props: {
        achievement: mockAchievement,
        isUnlocked: false,
        ...props
      },
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
  }

  describe('rendering', () => {
    it('should render the badge', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.achievement-badge').exists()).toBe(true)
    })

    it('should display achievement title', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('achievements.first_message.title')
    })

    it('should display achievement description', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('achievements.first_message.description')
    })
  })

  describe('unlocked state', () => {
    it('should have unlocked class when unlocked', () => {
      const wrapper = createWrapper({ isUnlocked: true })
      expect(wrapper.find('.achievement-badge.unlocked').exists()).toBe(true)
    })

    it('should display achievement icon when unlocked', () => {
      const wrapper = createWrapper({ isUnlocked: true })
      expect(wrapper.text()).toContain('💬')
    })

    it('should not have locked class when unlocked', () => {
      const wrapper = createWrapper({ isUnlocked: true })
      expect(wrapper.find('.achievement-badge.locked').exists()).toBe(false)
    })
  })

  describe('locked state', () => {
    it('should have locked class when locked', () => {
      const wrapper = createWrapper({ isUnlocked: false })
      expect(wrapper.find('.achievement-badge.locked').exists()).toBe(true)
    })

    it('should display lock icon when locked', () => {
      const wrapper = createWrapper({ isUnlocked: false })
      expect(wrapper.text()).toContain('🔒')
    })

    it('should not have unlocked class when locked', () => {
      const wrapper = createWrapper({ isUnlocked: false })
      expect(wrapper.find('.achievement-badge.unlocked').exists()).toBe(false)
    })

    it('should show hint in title attribute when locked', () => {
      const wrapper = createWrapper({ isUnlocked: false })
      const badge = wrapper.find('.achievement-badge')
      expect(badge.attributes('title')).toBe('achievements.first_message.hint')
    })

    it('should not show hint in title attribute when unlocked', () => {
      const wrapper = createWrapper({ isUnlocked: true })
      const badge = wrapper.find('.achievement-badge')
      expect(badge.attributes('title')).toBe('')
    })
  })

  describe('different achievements', () => {
    it('should display different achievement icons', () => {
      const wrapper = createWrapper({
        achievement: {
          id: 'streak_7',
          category: 'consistency',
          icon: '🔥'
        },
        isUnlocked: true
      })

      expect(wrapper.text()).toContain('🔥')
    })

    it('should display different achievement titles', () => {
      const wrapper = createWrapper({
        achievement: {
          id: 'messages_100',
          category: 'learning',
          icon: '📚'
        }
      })

      expect(wrapper.text()).toContain('achievements.messages_100.title')
    })
  })

  describe('styling', () => {
    it('should have badge-icon container', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.badge-icon').exists()).toBe(true)
    })

    it('should have badge-info container', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.badge-info').exists()).toBe(true)
    })

    it('should have badge-title element', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.badge-title').exists()).toBe(true)
    })

    it('should have badge-desc element', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.badge-desc').exists()).toBe(true)
    })
  })
})
