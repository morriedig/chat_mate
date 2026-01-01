import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import SetupScreen from '../../components/SetupScreen.vue'

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
  const createWrapper = () => {
    return mount(SetupScreen, {
      global: {
        stubs: {
          Teleport: true
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
    it('should show chat and learning mode options', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('setup.primaryModes.chat.name')
      expect(wrapper.text()).toContain('setup.primaryModes.learning.name')
    })

    it('should default to chat mode', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.primaryMode).toBe('chat')
    })

    it('should switch to learning mode when clicked', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('.grid.grid-cols-2 > div')

      await modeCards[1].trigger('click') // Learning mode card

      expect(wrapper.vm.primaryMode).toBe('learning')
    })
  })

  describe('chat mode options', () => {
    it('should show character selection', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('setup.choosePartner')
    })

    it('should display available characters', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('Sakura')
      expect(wrapper.text()).toContain('Kenji')
    })

    it('should show level selection', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('setup.yourLevel')
    })

    it('should display available levels', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('🌱')
      expect(wrapper.text()).toContain('🌿')
      expect(wrapper.text()).toContain('🌳')
    })

    it('should show chat mode selection', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('setup.chooseMode')
      expect(wrapper.text()).toContain('setup.modes.free.name')
      expect(wrapper.text()).toContain('setup.modes.article.name')
    })

    it('should select character when clicked', async () => {
      const wrapper = createWrapper()
      const characterCards = wrapper.findAll('.w-72')

      await characterCards[0].trigger('click')

      expect(wrapper.vm.selectedCharacter).toBeTruthy()
      expect(wrapper.vm.selectedCharacter.id).toBe('sakura')
    })

    it('should select level when clicked', async () => {
      const wrapper = createWrapper()
      const levelCards = wrapper.findAll('.grid.grid-cols-3 > div')

      await levelCards[0].trigger('click')

      expect(wrapper.vm.selectedLevel).toBeTruthy()
    })
  })

  describe('learning mode options', () => {
    beforeEach(async () => {
      // Switch to learning mode first
    })

    it('should show learning level selection when in learning mode', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('.grid.grid-cols-2 > div')
      await modeCards[1].trigger('click')

      expect(wrapper.text()).toContain('setup.learningLevel')
    })

    it('should show learning mode info when in learning mode', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('.grid.grid-cols-2 > div')
      await modeCards[1].trigger('click')

      expect(wrapper.text()).toContain('setup.learningModeInfo.title')
    })
  })

  describe('start button', () => {
    it('should be disabled initially in chat mode', () => {
      const wrapper = createWrapper()
      const startButton = wrapper.find('button.w-full')
      expect(startButton.attributes('disabled')).toBeDefined()
    })

    it('should display correct text for chat mode', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('setup.startChatting')
    })

    it('should display correct text for learning mode', async () => {
      const wrapper = createWrapper()
      const modeCards = wrapper.findAll('.grid.grid-cols-2 > div')
      await modeCards[1].trigger('click')

      expect(wrapper.text()).toContain('setup.startLearning')
    })
  })

  describe('events', () => {
    it('should emit start event with correct data when starting chat', async () => {
      const wrapper = createWrapper()

      // Select character
      const characterCards = wrapper.findAll('.w-72')
      await characterCards[0].trigger('click')

      // Select level
      const levelCards = wrapper.findAll('.grid.grid-cols-3 > div')
      await levelCards[0].trigger('click')

      // Click start
      const startButton = wrapper.find('button.w-full')
      await startButton.trigger('click')

      expect(wrapper.emitted('start')).toBeTruthy()
      const payload = wrapper.emitted('start')[0][0]
      expect(payload).toHaveProperty('character')
      expect(payload).toHaveProperty('level')
      expect(payload).toHaveProperty('language')
      expect(payload).toHaveProperty('mode')
    })

    it('should emit startLearning event when starting learning mode', async () => {
      const wrapper = createWrapper()

      // Switch to learning mode
      const modeCards = wrapper.findAll('.grid.grid-cols-2 > div')
      await modeCards[1].trigger('click')

      // Select level
      const levelCards = wrapper.findAll('.grid.grid-cols-3 > div')
      await levelCards[0].trigger('click')

      // Click start
      const startButton = wrapper.find('button.w-full')
      await startButton.trigger('click')

      expect(wrapper.emitted('startLearning')).toBeTruthy()
      const payload = wrapper.emitted('startLearning')[0][0]
      expect(payload).toHaveProperty('level')
      expect(payload).toHaveProperty('language')
    })
  })

  describe('header controls', () => {
    it('should have dark mode toggle', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toMatch(/dark_mode|light_mode/)
    })

    it('should have language toggle', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('translate')
    })
  })
})
