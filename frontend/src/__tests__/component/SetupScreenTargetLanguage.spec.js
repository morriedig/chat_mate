import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import SetupScreen from '../../components/SetupScreen.vue'

// English build (stays English in a VITE_EDITION=zh test run). useMotherTongue is NOT mocked:
// the real supportedLanguages (ja hidden) leaves one language to learn, which once hid the section
vi.mock('../../edition', async () => (await import('../helpers/editions')).enEdition)

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

// Mock useUserProgress
vi.mock('../../composables/useUserProgress', () => ({
  useUserProgress: () => ({
    progress: ref({ totalXP: 0 })
  })
}))

vi.mock('../../composables/useProgressSeen', () => ({
  useProgressSeen: () => ({ hasNew: ref(false) })
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
    { id: 'kenji', name: 'Kenji', avatar: '🎌', age: '30', location: 'Osaka' },
    { id: 'meiling', name: 'Mei-ling', avatar: '👩‍💼', age: '27', location: 'Taipei', languages: ['zh'] }
  ],
  levels: [
    { id: 'beginner', icon: '🌱' },
    { id: 'intermediate', icon: '🌿' },
    { id: 'advanced', icon: '🌳' }
  ]
}))

describe('SetupScreen target language (real useMotherTongue)', () => {
  it('shows "I want to learn" in learning mode even with a single language to learn', async () => {
    localStorage.clear()
    const wrapper = mount(SetupScreen, {
      global: {
        stubs: {
          Teleport: true,
          DailyChallengeCard: true,
          ScenarioSelector: true,
          ProgressPanel: true,
          HomeHero: true,
          WelcomeOnboarding: true
        }
      }
    })
    await wrapper.findAll('[data-test="primary-mode"]')[1].trigger('click') // Learning mode card

    expect(wrapper.vm.primaryMode).toBe('learning')
    expect(wrapper.find('#home-target-title').exists()).toBe(true)
    expect(wrapper.findAll('[data-test="target-language"]')).toHaveLength(1)
  })
})
