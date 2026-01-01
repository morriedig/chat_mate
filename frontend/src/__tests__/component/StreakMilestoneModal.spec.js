import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import StreakMilestoneModal from '../../components/chat/StreakMilestoneModal.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key, params) => {
      if (params) return `${key} ${JSON.stringify(params)}`
      return key
    }
  })
}))

// Mock useUserProgress
const mockShowStreakMilestone = ref(false)
const mockCurrentMilestone = ref(null)
const mockDismissStreakMilestone = vi.fn()

vi.mock('../../composables/useUserProgress', () => ({
  useUserProgress: () => ({
    showStreakMilestone: mockShowStreakMilestone,
    currentMilestone: mockCurrentMilestone,
    dismissStreakMilestone: mockDismissStreakMilestone
  })
}))

describe('StreakMilestoneModal', () => {
  const createWrapper = () => {
    return mount(StreakMilestoneModal, {
      global: {
        stubs: {
          Teleport: true,
          Transition: false
        }
      }
    })
  }

  beforeEach(() => {
    mockShowStreakMilestone.value = false
    mockCurrentMilestone.value = null
    mockDismissStreakMilestone.mockClear()
  })

  describe('visibility', () => {
    it('should not render when showStreakMilestone is false', () => {
      mockShowStreakMilestone.value = false
      const wrapper = createWrapper()
      expect(wrapper.find('.fixed').exists()).toBe(false)
    })

    it('should not render when currentMilestone is null', () => {
      mockShowStreakMilestone.value = true
      mockCurrentMilestone.value = null
      const wrapper = createWrapper()
      expect(wrapper.find('.fixed').exists()).toBe(false)
    })

    it('should render when both conditions are met', async () => {
      mockShowStreakMilestone.value = true
      mockCurrentMilestone.value = {
        days: 7,
        icon: '🔥',
        bonus: 50
      }

      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.fixed').exists()).toBe(true)
    })
  })

  describe('content', () => {
    beforeEach(() => {
      mockShowStreakMilestone.value = true
      mockCurrentMilestone.value = {
        days: 7,
        icon: '🔥',
        bonus: 50
      }
    })

    it('should display milestone icon', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('🔥')
    })

    it('should display streak bonus text', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('rank.streakBonus')
    })

    it('should display fire emoji', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      // The modal has fire emoji in the days count section
      expect(wrapper.text()).toContain('🔥')
    })

    it('should display streak milestone days', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('rank.streakMilestone')
    })

    it('should display bonus XP', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('+50 XP')
    })

    it('should have continue button', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('rank.continue')
    })
  })

  describe('dismiss functionality', () => {
    beforeEach(() => {
      mockShowStreakMilestone.value = true
      mockCurrentMilestone.value = {
        days: 7,
        icon: '🔥',
        bonus: 50
      }
    })

    it('should call dismissStreakMilestone when continue button is clicked', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const continueButton = wrapper.find('button')
      await continueButton.trigger('click')

      expect(mockDismissStreakMilestone).toHaveBeenCalled()
    })

    it('should call dismissStreakMilestone when backdrop is clicked', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const backdrop = wrapper.find('.fixed')
      await backdrop.trigger('click')

      expect(mockDismissStreakMilestone).toHaveBeenCalled()
    })
  })

  describe('animations', () => {
    beforeEach(() => {
      mockShowStreakMilestone.value = true
      mockCurrentMilestone.value = {
        days: 7,
        icon: '🔥',
        bonus: 50
      }
    })

    it('should have bouncing icon animation', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.animate-bounce').exists()).toBe(true)
    })

    it('should have fire particle elements', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.findAll('.fire-particle').length).toBe(15)
    })
  })

  describe('different milestones', () => {
    it('should display different milestone values', async () => {
      mockShowStreakMilestone.value = true
      mockCurrentMilestone.value = {
        days: 30,
        icon: '🏆',
        bonus: 200
      }

      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('🏆')
      expect(wrapper.text()).toContain('+200 XP')
    })
  })
})
