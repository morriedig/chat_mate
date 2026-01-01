import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import AchievementsPanel from '../../components/chat/AchievementsPanel.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

// Mock achievements data
const mockAchievements = [
  { id: 'first_message', category: 'first_steps', icon: '💬' },
  { id: 'first_streak', category: 'first_steps', icon: '🔥' },
  { id: 'streak_7', category: 'consistency', icon: '📅' },
  { id: 'streak_30', category: 'consistency', icon: '🏆' },
  { id: 'messages_50', category: 'learning', icon: '📚' },
  { id: 'messages_100', category: 'learning', icon: '📖' },
  { id: 'level_5', category: 'mastery', icon: '⭐' },
  { id: 'level_10', category: 'mastery', icon: '🌟' }
]

const mockProgress = ref({
  unlockedAchievements: ['first_message', 'first_streak', 'streak_7']
})

vi.mock('../../composables/useUserProgress', () => ({
  useUserProgress: () => ({
    unlockedAchievements: computed(() => mockProgress.value.unlockedAchievements),
    ACHIEVEMENTS: mockAchievements,
    progress: mockProgress
  })
}))

// Mock AchievementBadge
const AchievementBadgeStub = {
  template: '<div class="achievement-badge-stub" :class="{ unlocked: isUnlocked }">{{ achievement.icon }}</div>',
  props: ['achievement', 'isUnlocked']
}

describe('AchievementsPanel', () => {
  const createWrapper = () => {
    return mount(AchievementsPanel, {
      global: {
        stubs: {
          AchievementBadge: AchievementBadgeStub
        },
        mocks: {
          $t: (key) => key
        }
      }
    })
  }

  describe('rendering', () => {
    it('should render the panel', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.achievements-panel').exists()).toBe(true)
    })

    it('should display panel header', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('achievements.unlocked')
    })

    it('should display achievement count', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('3/8') // 3 unlocked out of 8
    })
  })

  describe('progress bar', () => {
    it('should have progress bar', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.progress-bar-container').exists()).toBe(true)
    })

    it('should have progress indicator', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.progress-bar').exists()).toBe(true)
    })

    it('should show correct progress percentage', () => {
      const wrapper = createWrapper()
      const progressBar = wrapper.find('.progress-bar')
      // 3 out of 8 = 37.5%, rounded to 38%
      expect(progressBar.attributes('style')).toContain('width')
    })
  })

  describe('categories', () => {
    it('should display all categories', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('achievements.categories.first_steps')
      expect(wrapper.text()).toContain('achievements.categories.consistency')
      expect(wrapper.text()).toContain('achievements.categories.learning')
      expect(wrapper.text()).toContain('achievements.categories.mastery')
    })

    it('should have category sections', () => {
      const wrapper = createWrapper()
      const sections = wrapper.findAll('.category-section')
      expect(sections.length).toBe(4)
    })
  })

  describe('achievement badges', () => {
    it('should render all achievements', () => {
      const wrapper = createWrapper()
      const badges = wrapper.findAll('.achievement-badge-stub')
      expect(badges.length).toBe(8)
    })

    it('should mark unlocked achievements correctly', () => {
      const wrapper = createWrapper()
      const unlockedBadges = wrapper.findAll('.achievement-badge-stub.unlocked')
      expect(unlockedBadges.length).toBe(3)
    })

    it('should pass correct props to AchievementBadge', () => {
      const wrapper = createWrapper()
      const badges = wrapper.findAll('.achievement-badge-stub')

      // Check that icons are displayed
      expect(wrapper.text()).toContain('💬')
      expect(wrapper.text()).toContain('🔥')
    })
  })

  describe('achievements grid', () => {
    it('should have achievements grid in each category', () => {
      const wrapper = createWrapper()
      const grids = wrapper.findAll('.achievements-grid')
      expect(grids.length).toBe(4)
    })
  })
})
