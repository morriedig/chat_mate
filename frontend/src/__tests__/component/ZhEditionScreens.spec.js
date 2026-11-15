import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import SetupScreen from '../../components/SetupScreen.vue'
import SettingsScreen from '../../components/SettingsScreen.vue'
import WelcomeOnboarding from '../../components/WelcomeOnboarding.vue'
import DailyPromptCard from '../../components/chat/DailyPromptCard.vue'

// Every component in this file is rendered as the Chinese edition
vi.mock('../../edition', async () => (await import('../helpers/editions')).zhEdition)

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key) => key, locale: ref('en') }),
}))

vi.mock('../../composables/useDarkMode', () => ({
  useDarkMode: () => ({ isDark: ref(false), toggle: vi.fn() }),
}))

vi.mock('../../composables/useUserProgress', () => ({
  useUserProgress: () => ({ progress: ref({ totalXP: 0 }), resetProgress: vi.fn() }),
}))

vi.mock('../../composables/useProgressSeen', () => ({
  useProgressSeen: () => ({ hasNew: ref(false) }),
}))

vi.mock('../../composables/useDailyChallenge', () => ({
  useDailyChallenge: () => ({ startChallenge: vi.fn() }),
}))

const setChatState = vi.fn()
vi.mock('../../composables/useNavState', () => ({
  useNavState: () => ({ setChatState, setLearningState: vi.fn(), selectedLevel: ref(null) }),
}))

vi.mock('../../composables/useLastSession', () => ({
  useLastSession: () => ({ load: () => null, saveChatSession: vi.fn(), saveLearningSession: vi.fn() }),
}))

vi.mock('../../data/characters.js', () => ({
  characters: [
    { id: 'emma', name: 'Emma', age: 28, location: 'Seattle', languages: ['en'] },
    { id: 'meiling', name: 'Mei-ling', age: 27, location: 'Taipei', languages: ['zh'] },
  ],
  levels: [
    { id: 'beginner' },
    { id: 'intermediate' },
    { id: 'advanced' },
  ],
}))

describe('Chinese edition home screen', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('chatmate_home_more_open', '1')
    mockPush.mockClear()
    setChatState.mockClear()
  })

  const createWrapper = () => mount(SetupScreen, {
    global: {
      stubs: { Teleport: true, DailyChallengeCard: true, ScenarioSelector: true, ProgressPanel: true, HomeHero: true, WelcomeOnboarding: true },
    },
  })

  async function openChatMode(wrapper) {
    const modes = wrapper.findAll('[data-test="primary-mode"]')
    await modes.find(m => m.text().includes('setup.primaryModes.chat.name')).trigger('click')
  }

  it('hides the mother tongue picker', () => {
    expect(createWrapper().find('select').exists()).toBe(false)
  })

  it('shows a 2-step route without say-it-three-times, and no opinion entries', () => {
    const wrapper = createWrapper()
    expect(wrapper.findAll('ol > li')).toHaveLength(2)
    expect(wrapper.find('.retell-card').exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'DailyOpinionCard' }).exists()).toBe(false)
    expect(wrapper.find('.opinion-chat-entry').exists()).toBe(false)
  })

  it('offers chat and learning but not the diary', () => {
    const wrapper = createWrapper()
    const modes = wrapper.findAll('[data-test="primary-mode"]').map(m => m.text())
    expect(modes).toHaveLength(2)
    expect(modes.join()).not.toContain('diary.mode')
  })

  it('leaves out role-play scenarios and the placement test from the tools', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[data-test="tool-scenarios"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="tool-placement"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="tool-progress"]').exists()).toBe(true)
  })

  it('lists only Mandarin-speaking friends, beginner level and free chat', async () => {
    const wrapper = createWrapper()
    await openChatMode(wrapper)

    const friends = wrapper.findAll('[data-test="character"]')
    expect(friends).toHaveLength(1)
    expect(friends[0].text()).toContain('Mei-ling')
    expect(wrapper.findAll('[data-test="chat-level"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-test="chat-mode"]').map(m => m.text()).join()).not.toContain('setup.modes.article.name')
  })

  it('starts the free chat in Mandarin', async () => {
    const wrapper = createWrapper()
    await openChatMode(wrapper)
    await wrapper.find('[data-test="character"]').trigger('click')
    await wrapper.find('[data-test="chat-level"]').trigger('click')
    await wrapper.find('button.start-button').trigger('click')

    expect(setChatState).toHaveBeenCalledWith(expect.objectContaining({ language: 'zh' }))
    expect(wrapper.findComponent({ name: 'DailyChallengeCard' }).exists()).toBe(false)
    expect(mockPush).toHaveBeenCalledWith('/chat')
  })

  it('learns Chinese at beginner level only', () => {
    const wrapper = createWrapper()
    const targets = wrapper.findAll('[data-test="target-language"]')
    expect(targets).toHaveLength(1)
    expect(targets[0].attributes('aria-checked')).toBe('true')
    expect(wrapper.findAll('[data-test="learning-level"]')).toHaveLength(1)
  })
})

describe('Chinese edition settings', () => {
  it('hides the language block', () => {
    const wrapper = mount(SettingsScreen, { global: { stubs: { Teleport: true } } })
    expect(wrapper.find('#settings-language').exists()).toBe(false)
    expect(wrapper.find('#settings-appearance').exists()).toBe(true)
  })
})

describe('Chinese edition onboarding', () => {
  it('ends with one start button and no placement test', async () => {
    const wrapper = mount(WelcomeOnboarding, { global: { stubs: { Teleport: true } } })
    // Walk to the last page
    for (let page = 0; page < 5; page++) {
      const next = wrapper.findAll('button').find(b => b.text() === 'welcome.next')
      if (!next) break
      await next.trigger('click')
    }
    expect(wrapper.text()).not.toContain('welcome.takeTest')
    await wrapper.find('[data-test="welcome-finish"]').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('take-test')).toBeUndefined()
  })
})

describe('Chinese edition daily prompt card', () => {
  it('has no write-in-diary button', () => {
    const wrapper = mount(DailyPromptCard, { props: { level: 'beginner', language: 'en' } })
    expect(wrapper.find('[data-test="write-in-diary"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('dailyPrompt.tryIt')
  })
})
