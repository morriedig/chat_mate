import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import LevelUpModal from '../../components/chat/LevelUpModal.vue'

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
const mockShowLevelUp = ref(false)
const mockNewRank = ref(null)
const mockDismissLevelUp = vi.fn()
const mockProgress = ref({ totalXP: 500 })

vi.mock('../../composables/useUserProgress', () => ({
  useUserProgress: () => ({
    showLevelUp: mockShowLevelUp,
    newRank: mockNewRank,
    dismissLevelUp: mockDismissLevelUp,
    progress: mockProgress
  })
}))

describe('LevelUpModal', () => {
  const createWrapper = () => {
    return mount(LevelUpModal, {
      global: {
        stubs: {
          Teleport: true,
          Transition: false
        }
      }
    })
  }

  beforeEach(() => {
    mockShowLevelUp.value = false
    mockNewRank.value = null
    mockDismissLevelUp.mockClear()
  })

  describe('visibility', () => {
    it('should not render when showLevelUp is false', () => {
      mockShowLevelUp.value = false
      const wrapper = createWrapper()
      expect(wrapper.find('.fixed').exists()).toBe(false)
    })

    it('should not render when newRank is null', () => {
      mockShowLevelUp.value = true
      mockNewRank.value = null
      const wrapper = createWrapper()
      expect(wrapper.find('.fixed').exists()).toBe(false)
    })

    it('should render when both conditions are met', async () => {
      mockShowLevelUp.value = true
      mockNewRank.value = {
        level: 3,
        title: 'Student',
        icon: '🎓'
      }

      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.fixed').exists()).toBe(true)
    })
  })

  describe('content', () => {
    beforeEach(() => {
      mockShowLevelUp.value = true
      mockNewRank.value = {
        level: 3,
        title: 'Student',
        icon: '🎓'
      }
    })

    it('should display rank icon', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('🎓')
    })

    it('should display level up text', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('rank.levelUp')
    })

    it('should display new rank level', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Lv.3')
    })

    it('should display total XP', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('rank.totalXP')
    })

    it('should have continue button', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('rank.continue')
    })
  })

  describe('dismiss functionality', () => {
    beforeEach(() => {
      mockShowLevelUp.value = true
      mockNewRank.value = {
        level: 3,
        title: 'Student',
        icon: '🎓'
      }
    })

    it('should call dismissLevelUp when continue button is clicked', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const continueButton = wrapper.find('button')
      await continueButton.trigger('click')

      expect(mockDismissLevelUp).toHaveBeenCalled()
    })

    it('should call dismissLevelUp when backdrop is clicked', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      const backdrop = wrapper.find('.fixed')
      await backdrop.trigger('click')

      expect(mockDismissLevelUp).toHaveBeenCalled()
    })
  })

  describe('animations', () => {
    beforeEach(() => {
      mockShowLevelUp.value = true
      mockNewRank.value = {
        level: 3,
        title: 'Student',
        icon: '🎓'
      }
    })

    it('should have bouncing icon animation', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.animate-bounce').exists()).toBe(true)
    })

    it('should have confetti elements', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.findAll('.confetti').length).toBe(20)
    })
  })
})
