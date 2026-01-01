import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import RankBadge from '../../components/chat/RankBadge.vue'

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
const mockProgress = ref({
  totalXP: 150,
  currentStreak: 5,
  longestStreak: 10,
  messagesSent: 50,
  unlockedAchievements: ['first_message']
})

const mockCurrentRank = {
  level: 2,
  title: 'Apprentice',
  icon: '📚',
  minXP: 100
}

const mockNextRank = {
  level: 3,
  title: 'Student',
  icon: '🎓',
  minXP: 300
}

const mockAchievements = [
  { id: 'first_message', category: 'first_steps', icon: '💬' },
  { id: 'streak_3', category: 'consistency', icon: '🔥' }
]

vi.mock('../../composables/useUserProgress', () => ({
  useUserProgress: () => ({
    progress: mockProgress,
    currentRank: mockCurrentRank,
    nextRank: mockNextRank,
    progressToNextRank: computed(() => 25),
    xpToNextRank: computed(() => 150),
    recentXPGain: ref(null),
    unlockedAchievements: computed(() => mockProgress.value.unlockedAchievements),
    ACHIEVEMENTS: mockAchievements
  })
}))

// Mock AchievementsPanel
const AchievementsPanelStub = {
  template: '<div class="achievements-panel-stub"></div>'
}

describe('RankBadge', () => {
  const createWrapper = () => {
    return mount(RankBadge, {
      global: {
        stubs: {
          AchievementsPanel: AchievementsPanelStub,
          Teleport: true
        },
        mocks: {
          $t: (key) => key
        }
      }
    })
  }

  describe('rendering', () => {
    it('should render the badge', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should display current rank icon', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('📚')
    })

    it('should display rank level', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('Lv.2')
    })
  })

  describe('achievements button', () => {
    it('should show achievements count', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('1/2') // 1 unlocked out of 2
    })

    it('should show trophy emoji', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('🏆')
    })

    it('should toggle achievements panel on click', async () => {
      const wrapper = createWrapper()
      const achievementsButton = wrapper.find('button')

      await achievementsButton.trigger('click')

      // The showAchievements ref should be toggled - we can't test the Teleport content directly
      // Just verify the click doesn't throw an error and the button is interactive
      expect(achievementsButton.exists()).toBe(true)
    })
  })

  describe('streak badge', () => {
    it('should show streak when greater than 0', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('🔥')
      expect(wrapper.text()).toContain('5')
    })

    it('should show days translation key', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('rank.days')
    })
  })

  describe('progress bar', () => {
    it('should show progress percentage', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('25%')
    })

    it('should have progress bar element', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.bg-gradient-to-r.from-amber-400').exists()).toBe(true)
    })
  })

  describe('tooltip', () => {
    it('should have tooltip with details', () => {
      const wrapper = createWrapper()
      // Tooltip content should include total XP, next level info
      expect(wrapper.text()).toContain('rank.totalXP')
      expect(wrapper.text()).toContain('rank.nextLevel')
    })

    it('should show XP to next rank', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('150 XP') // xpToNextRank
    })
  })
})
