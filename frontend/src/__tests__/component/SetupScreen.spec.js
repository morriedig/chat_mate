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
    setLearningState: vi.fn(),
    selectedLevel: ref(null)
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
          AnalyticsDashboard: true,
          HomeHero: true,
          WelcomeOnboarding: true
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
      const modeCards = wrapper.findAll('[data-test="primary-mode"]')

      await modeCards[0].trigger('click') // Chat mode card

      expect(wrapper.vm.primaryMode).toBe('chat')
    })

    it('should switch to diary mode when clicked', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('[data-test="primary-mode"]')

      await modeCards[2].trigger('click') // Diary mode card

      expect(wrapper.vm.primaryMode).toBe('diary')
    })

    it('should display diary mode icon', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('edit_note')
    })

    it('should mark the selected mode with aria-checked', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('[data-test="primary-mode"]')
      await modeCards[0].trigger('click')

      expect(modeCards[0].attributes('aria-checked')).toBe('true')
      expect(modeCards[1].attributes('aria-checked')).toBe('false')
    })
  })

  describe('chat mode options', () => {
    it('should show character selection when in chat mode', async () => {
      const wrapper = createWrapper()
      // Switch to chat mode first
      const modeCards = wrapper.findAll('[data-test="primary-mode"]')
      await modeCards[0].trigger('click')

      expect(wrapper.text()).toContain('setup.choosePartner')
    })

    it('should display available characters when in chat mode', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('[data-test="primary-mode"]')
      await modeCards[0].trigger('click')

      expect(wrapper.text()).toContain('Sakura')
      expect(wrapper.text()).toContain('Kenji')
    })

    it('should show level selection when in chat mode', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('[data-test="primary-mode"]')
      await modeCards[0].trigger('click')

      expect(wrapper.text()).toContain('setup.yourLevel')
    })

    it('should display levels as CEFR text codes, not emoji, when in chat mode', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('[data-test="primary-mode"]')
      await modeCards[0].trigger('click')

      expect(wrapper.text()).toContain('A1–A2')
      expect(wrapper.text()).toContain('B1–B2')
      expect(wrapper.text()).toContain('C1–C2')
      expect(wrapper.text()).not.toContain('🌱')
    })

    it('should show chat mode selection when in chat mode', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('[data-test="primary-mode"]')
      await modeCards[0].trigger('click')

      expect(wrapper.text()).toContain('setup.chooseMode')
      expect(wrapper.text()).toContain('setup.modes.free.name')
      expect(wrapper.text()).toContain('setup.modes.article.name')
    })

    it('should select character when clicked', async () => {
      const wrapper = createWrapper()
      // Switch to chat mode first
      const modeCards = wrapper.findAll('[data-test="primary-mode"]')
      await modeCards[0].trigger('click')

      const characterCards = wrapper.findAll('[data-test="character"]')
      await characterCards[0].trigger('click')

      expect(wrapper.vm.selectedCharacter).toBeTruthy()
      expect(wrapper.vm.selectedCharacter.id).toBe('sakura')
    })

    it('should select level when clicked', async () => {
      const wrapper = createWrapper()
      // Switch to chat mode first
      const modeCards = wrapper.findAll('[data-test="primary-mode"]')
      await modeCards[0].trigger('click')

      const levelRows = wrapper.findAll('[data-test="chat-level"]')
      await levelRows[0].trigger('click')

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
      const modeCards = wrapper.findAll('[data-test="primary-mode"]')
      await modeCards[0].trigger('click')

      const startButton = wrapper.find('button.start-button')
      expect(startButton.attributes('disabled')).toBeDefined()
    })

    it('should display correct text for chat mode', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('[data-test="primary-mode"]')
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
      const modeCards = wrapper.findAll('[data-test="primary-mode"]')
      await modeCards[2].trigger('click')

      expect(wrapper.find('button.start-button').text()).toContain('setup.startDiary')
    })

    it('should not be disabled for diary mode', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('[data-test="primary-mode"]')
      await modeCards[2].trigger('click')

      const startButton = wrapper.find('button.start-button')
      expect(startButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('navigation', () => {
    it('should navigate to /chat when starting chat mode', async () => {
      const wrapper = createWrapper()

      // Switch to chat mode
      const modeCards = wrapper.findAll('[data-test="primary-mode"]')
      await modeCards[0].trigger('click')

      // Select character
      const characterCards = wrapper.findAll('[data-test="character"]')
      await characterCards[0].trigger('click')

      // Select level
      const levelRows = wrapper.findAll('[data-test="chat-level"]')
      await levelRows[0].trigger('click')

      // Click start
      const startButton = wrapper.find('button.start-button')
      await startButton.trigger('click')

      expect(mockPush).toHaveBeenCalledWith('/chat')
    })

    it('should navigate to /diary when starting diary mode', async () => {
      const wrapper = createWrapper()

      // Switch to diary mode
      const modeCards = wrapper.findAll('[data-test="primary-mode"]')
      await modeCards[2].trigger('click')

      // Click start
      const startButton = wrapper.find('button.start-button')
      await startButton.trigger('click')

      expect(mockPush).toHaveBeenCalledWith('/diary')
    })
  })

  describe('opinion chat entry', () => {
    it('should show the opinion chat card', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.opinion-chat-entry').exists()).toBe(true)
      expect(wrapper.text()).toContain('opinionChat.homeTitle')
    })

    it('should go straight to /chat without picking a character first', async () => {
      const wrapper = createWrapper()
      await wrapper.find('.opinion-chat-entry').trigger('click')
      expect(mockPush).toHaveBeenCalledWith('/chat')
    })
  })

  describe('home route and More', () => {
    beforeEach(() => {
      localStorage.removeItem('chatmate_home_more_open')
    })

    it('should list practice, task chat and say-it-three-times in that order', () => {
      const wrapper = createWrapper()
      const steps = wrapper.findAll('ol > li')
      expect(steps).toHaveLength(3)
      expect(steps[0].findComponent({ name: 'DailyPracticeCard' }).exists()).toBe(true)
      expect(steps[1].findComponent({ name: 'TaskChatCard' }).exists()).toBe(true)
      expect(steps[2].find('.retell-card').exists()).toBe(true)
    })

    it('should mark exactly one route step as current', () => {
      const wrapper = createWrapper()
      const current = wrapper.findAll('ol > li[aria-current="step"]')
      expect(current).toHaveLength(1)
    })

    it('should keep the other options collapsed under More until it is opened', async () => {
      const wrapper = createWrapper()
      const more = wrapper.find('button[aria-controls="home-more"]')
      expect(more.attributes('aria-expanded')).toBe('false')
      expect(wrapper.find('#home-more').attributes('style')).toContain('display: none')

      await more.trigger('click')

      expect(more.attributes('aria-expanded')).toBe('true')
      expect(wrapper.find('#home-more').attributes('style') || '').not.toContain('display: none')
    })

    it('should open each tool from the grouped tools list', async () => {
      const wrapper = createWrapper()
      await wrapper.find('[data-test="tool-placement"]').trigger('click')
      expect(mockPush).toHaveBeenCalledWith('/placement-test')
      await wrapper.find('[data-test="tool-analytics"]').trigger('click')
      expect(wrapper.vm.showAnalytics).toBe(true)
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
