import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import AchievementUnlockModal from '../../components/chat/AchievementUnlockModal.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

// Mock useUserProgress
const mockShowAchievementUnlock = ref(false)
const mockNewAchievement = ref(null)
const mockDismissAchievementUnlock = vi.fn()

vi.mock('../../composables/useUserProgress', () => ({
  useUserProgress: () => ({
    showAchievementUnlock: mockShowAchievementUnlock,
    newAchievement: mockNewAchievement,
    dismissAchievementUnlock: mockDismissAchievementUnlock
  })
}))

describe('AchievementUnlockModal', () => {
  const createWrapper = () => {
    return mount(AchievementUnlockModal, {
      global: {
        stubs: {
          Teleport: true,
          Transition: false
        },
        mocks: {
          $t: (key) => key
        }
      }
    })
  }

  beforeEach(() => {
    mockShowAchievementUnlock.value = false
    mockNewAchievement.value = null
    mockDismissAchievementUnlock.mockClear()
  })

  describe('visibility', () => {
    it('should not render when showAchievementUnlock is false', () => {
      mockShowAchievementUnlock.value = false
      const wrapper = createWrapper()
      expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })

    it('should not render when newAchievement is null', () => {
      mockShowAchievementUnlock.value = true
      mockNewAchievement.value = null
      const wrapper = createWrapper()
      expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })

    it('should render when both conditions are met', async () => {
      mockShowAchievementUnlock.value = true
      mockNewAchievement.value = {
        id: 'first_message',
        category: 'first_steps',
        icon: '💬'
      }

      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    })
  })

  describe('content', () => {
    beforeEach(() => {
      mockShowAchievementUnlock.value = true
      mockNewAchievement.value = {
        id: 'first_message',
        category: 'first_steps',
        icon: '💬'
      }
    })

    it('should display achievement icon', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('💬')
    })

    it('should display unlocked text', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('achievements.unlocked')
    })

    it('should display achievement title', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('achievements.first_message.title')
    })

    it('should display achievement description', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('achievements.first_message.description')
    })

    it('should display category tag', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('achievements.categories.first_steps')
    })

    it('should have continue button', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('achievements.continue')
    })
  })

  describe('dismiss functionality', () => {
    beforeEach(() => {
      mockShowAchievementUnlock.value = true
      mockNewAchievement.value = {
        id: 'first_message',
        category: 'first_steps',
        icon: '💬'
      }
    })

    it('should call dismissAchievementUnlock when continue button is clicked', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const continueButton = wrapper.find('.continue-btn')
      await continueButton.trigger('click')

      expect(mockDismissAchievementUnlock).toHaveBeenCalled()
    })

    it('should call dismiss when backdrop is clicked', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const overlay = wrapper.find('.modal-overlay')
      await overlay.trigger('click')

      expect(mockDismissAchievementUnlock).toHaveBeenCalled()
    })
  })

  describe('animations', () => {
    beforeEach(() => {
      mockShowAchievementUnlock.value = true
      mockNewAchievement.value = {
        id: 'first_message',
        category: 'first_steps',
        icon: '💬'
      }
    })

    it('should have badge icon with animation', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.badge-icon-large').exists()).toBe(true)
    })

    it('should have confetti elements', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.findAll('.confetti').length).toBe(12)
    })

    it('should have celebration container', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.celebration').exists()).toBe(true)
    })
  })

  describe('different achievements', () => {
    it('should display different achievement data', async () => {
      mockShowAchievementUnlock.value = true
      mockNewAchievement.value = {
        id: 'streak_7',
        category: 'consistency',
        icon: '🔥'
      }

      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('🔥')
      expect(wrapper.text()).toContain('achievements.streak_7.title')
      expect(wrapper.text()).toContain('achievements.categories.consistency')
    })
  })
})
