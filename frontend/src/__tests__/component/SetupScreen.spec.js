import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import SetupScreen from '../../components/SetupScreen.vue'

// Mock vue-router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: ref('en')
  })
}))

// Mock useDarkMode
vi.mock('../../composables/useDarkMode', () => ({
  useDarkMode: () => ({
    isDark: ref(false),
    toggle: vi.fn()
  })
}))

// Mock useMotherTongue
vi.mock('../../composables/useMotherTongue', () => ({
  useMotherTongue: () => ({
    motherTongue: ref('en'),
    setMotherTongue: vi.fn()
  }),
  supportedLanguages: [
    { id: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { id: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { id: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇹🇼' }
  ]
}))

// Mock useUserProgress
vi.mock('../../composables/useUserProgress', () => ({
  useUserProgress: () => ({
    progress: ref({ totalXP: 0 })
  })
}))

// Mock useDailyChallenge
vi.mock('../../composables/useDailyChallenge', () => ({
  useDailyChallenge: () => ({
    startChallenge: vi.fn()
  })
}))

// Mock useNavState
vi.mock('../../composables/useNavState', () => ({
  useNavState: () => ({
    setChatState: vi.fn(),
    setLearningState: vi.fn()
  })
}))

// Mock useLastSession
vi.mock('../../composables/useLastSession', () => ({
  useLastSession: () => ({
    load: () => null,
    saveChatSession: vi.fn(),
    saveLearningSession: vi.fn()
  })
}))

// Mock characters data
vi.mock('../../data/characters.js', () => ({
  characters: [
    { id: 'sakura', name: 'Sakura', avatar: '🌸', age: '25', location: 'Tokyo' },
    { id: 'kenji', name: 'Kenji', avatar: '🎌', age: '30', location: 'Osaka' }
  ],
  levels: [
    { id: 'beginner', icon: '🌱' },
    { id: 'intermediate', icon: '🌿' },
    { id: 'advanced', icon: '🌳' }
  ]
}))

describe('SetupScreen', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  const createWrapper = () => {
    return mount(SetupScreen, {
      global: {
        stubs: {
          Teleport: true,
          DailyChallengeCard: true,
          WeeklyQuestsPanel: true,
          ScenarioSelector: true,
          ShareCardPanel: true,
          AnalyticsDashboard: true
        }
      }
    })
  }

  describe('rendering', () => {
    it('should render the setup screen', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.min-h-screen').exists()).toBe(true)
    })

    it('should display app title', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('app.title')
    })

    it('should display app subtitle', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('app.subtitle')
    })
  })

  describe('primary mode selection', () => {
    it('should show chat, learning, and diary mode options', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('setup.primaryModes.chat.name')
      expect(wrapper.text()).toContain('setup.primaryModes.learning.name')
      expect(wrapper.text()).toContain('diary.mode')
    })

    it('should default to learning mode', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.primaryMode).toBe('learning')
    })

    it('should switch to chat mode when clicked', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('.grid.grid-cols-3 > div')

      await modeCards[0].trigger('click') // Chat mode card

      expect(wrapper.vm.primaryMode).toBe('chat')
    })

    it('should switch to diary mode when clicked', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('.grid.grid-cols-3 > div')

      await modeCards[2].trigger('click') // Diary mode card

      expect(wrapper.vm.primaryMode).toBe('diary')
    })

    it('should display diary mode icon', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('edit_note')
    })
  })

  describe('chat mode options', () => {
    it('should show character selection when in chat mode', async () => {
      const wrapper = createWrapper()
      // Switch to chat mode first
      const modeCards = wrapper.findAll('.grid.grid-cols-3 > div')
      await modeCards[0].trigger('click')

      expect(wrapper.text()).toContain('setup.choosePartner')
    })

    it('should display available characters when in chat mode', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('.grid.grid-cols-3 > div')
      await modeCards[0].trigger('click')

      expect(wrapper.text()).toContain('Sakura')
      expect(wrapper.text()).toContain('Kenji')
    })

    it('should show level selection when in chat mode', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('.grid.grid-cols-3 > div')
      await modeCards[0].trigger('click')

      expect(wrapper.text()).toContain('setup.yourLevel')
    })

    it('should display available levels when in chat mode', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('.grid.grid-cols-3 > div')
      await modeCards[0].trigger('click')

      expect(wrapper.text()).toContain('🌱')
      expect(wrapper.text()).toContain('🌿')
      expect(wrapper.text()).toContain('🌳')
    })

    it('should show chat mode selection when in chat mode', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('.grid.grid-cols-3 > div')
      await modeCards[0].trigger('click')

      expect(wrapper.text()).toContain('setup.chooseMode')
      expect(wrapper.text()).toContain('setup.modes.free.name')
      expect(wrapper.text()).toContain('setup.modes.article.name')
    })

    it('should select character when clicked', async () => {
      const wrapper = createWrapper()
      // Switch to chat mode first
      const modeCards = wrapper.findAll('.grid.grid-cols-3 > div')
      await modeCards[0].trigger('click')

      const characterCards = wrapper.findAll('.w-72')
      await characterCards[0].trigger('click')

      expect(wrapper.vm.selectedCharacter).toBeTruthy()
      expect(wrapper.vm.selectedCharacter.id).toBe('sakura')
    })

    it('should select level when clicked', async () => {
      const wrapper = createWrapper()
      // Switch to chat mode first
      const modeCards = wrapper.findAll('.grid.grid-cols-3 > div')
      await modeCards[0].trigger('click')

      // Find the level grid (grid-cols-3 inside chat mode options, not the primary mode grid)
      const levelCards = wrapper.findAll('.grid.grid-cols-3 > div')
      // Skip first 3 (primary mode cards), get the level cards
      await levelCards[3].trigger('click')

      expect(wrapper.vm.selectedLevel).toBeTruthy()
    })
  })

  describe('learning mode options', () => {
    it('should show learning level selection when in learning mode', async () => {
      const wrapper = createWrapper()
      // Already in learning mode by default
      expect(wrapper.text()).toContain('setup.learningLevel')
    })

    it('should show learning mode info when in learning mode', async () => {
      const wrapper = createWrapper()
      // Already in learning mode by default
      expect(wrapper.text()).toContain('setup.learningModeInfo.title')
    })
  })

  describe('start button', () => {
    it('should be disabled initially in chat mode', async () => {
      const wrapper = createWrapper()
      // Switch to chat mode
      const modeCards = wrapper.findAll('.grid.grid-cols-3 > div')
      await modeCards[0].trigger('click')

      const startButton = wrapper.find('button.w-full')
      expect(startButton.attributes('disabled')).toBeDefined()
    })

    it('should display correct text for chat mode', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('.grid.grid-cols-3 > div')
      await modeCards[0].trigger('click')

      expect(wrapper.text()).toContain('setup.startChatting')
    })

    it('should display correct text for learning mode', async () => {
      const wrapper = createWrapper()
      // Already in learning mode by default
      expect(wrapper.text()).toContain('setup.startLearning')
    })

    it('should display diary mode text for diary mode', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('.grid.grid-cols-3 > div')
      await modeCards[2].trigger('click')

      expect(wrapper.text()).toContain('diary.mode')
    })

    it('should not be disabled for diary mode', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('.grid.grid-cols-3 > div')
      await modeCards[2].trigger('click')

      const startButton = wrapper.find('button.w-full')
      expect(startButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('navigation', () => {
    it('should navigate to /chat when starting chat mode', async () => {
      const wrapper = createWrapper()

      // Switch to chat mode
      const modeCards = wrapper.findAll('.grid.grid-cols-3 > div')
      await modeCards[0].trigger('click')

      // Select character
      const characterCards = wrapper.findAll('.w-72')
      await characterCards[0].trigger('click')

      // Select level (skip first 3 primary mode cards)
      const levelCards = wrapper.findAll('.grid.grid-cols-3 > div')
      await levelCards[3].trigger('click')

      // Click start
      const startButton = wrapper.find('button.w-full')
      await startButton.trigger('click')

      expect(mockPush).toHaveBeenCalledWith('/chat')
    })

    it('should navigate to /diary when starting diary mode', async () => {
      const wrapper = createWrapper()

      // Switch to diary mode
      const modeCards = wrapper.findAll('.grid.grid-cols-3 > div')
      await modeCards[2].trigger('click')

      // Click start
      const startButton = wrapper.find('button.w-full')
      await startButton.trigger('click')

      expect(mockPush).toHaveBeenCalledWith('/diary')
    })
  })

  describe('header controls', () => {
    it('should have dark mode toggle', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toMatch(/dark_mode|light_mode/)
    })

    it('should have language selector', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('select').exists()).toBe(true)
    })
  })
})
