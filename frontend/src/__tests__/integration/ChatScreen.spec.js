import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ChatScreen from '../../components/ChatScreen.vue'

// Mock vue-router
const mockPush = vi.fn()
const mockReplace = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace
  })
}))

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

// Mock useNavState
const navCharacter = ref({ id: 'sakura', name: 'Sakura', avatar: '\u{1F338}' })
const navLevel = ref({ id: 'beginner', name: 'Beginner' })
const navLanguage = ref('en')
const navArticle = ref(null)
const navMode = ref('free')
const navScenario = ref(null)

vi.mock('../../composables/useNavState', () => ({
  useNavState: () => ({
    selectedCharacter: navCharacter,
    selectedLevel: navLevel,
    selectedLanguage: navLanguage,
    selectedArticle: navArticle,
    chatMode: navMode,
    activeScenario: navScenario,
    clearArticle: vi.fn()
  })
}))

// Mock useChatStorage
vi.mock('../../composables/useChatStorage', () => ({
  useChatStorage: () => ({
    load: () => ({ messages: [], hints: [] }),
    autoSave: vi.fn(),
    clear: vi.fn()
  })
}))

// Mock useChatApi
const mockSendMessage = vi.fn().mockResolvedValue({
  reply: 'Hello! Nice to meet you!',
  hints: []
})

vi.mock('../../composables/useChatApi', () => ({
  useChatApi: () => ({
    isLoading: ref(false),
    error: ref(null),
    sendMessage: mockSendMessage,
    sendFeedback: vi.fn()
  })
}))

// Mock useUserProgress
vi.mock('../../composables/useUserProgress', () => ({
  useUserProgress: () => ({
    onMessageSent: vi.fn(),
    onMessageReceived: vi.fn(),
    onArticleStarted: vi.fn(),
    trackCharacterInteraction: vi.fn(),
    showLevelUp: ref(false),
    showStreakMilestone: ref(false),
    showAchievementUnlock: ref(false)
  })
}))

// Mock useDailyGoal
vi.mock('../../composables/useDailyGoal', () => ({
  useDailyGoal: () => ({
    startTimer: vi.fn(),
    stopTimer: vi.fn()
  })
}))

// Mock useDailyChallenge
vi.mock('../../composables/useDailyChallenge', () => ({
  useDailyChallenge: () => ({
    trackChallengeMessage: vi.fn(() => false),
    getChallengeContext: vi.fn(() => null),
    isChallengeCompleted: ref(false)
  })
}))

// Mock useWeeklyQuests
vi.mock('../../composables/useWeeklyQuests', () => ({
  useWeeklyQuests: () => ({
    onChatMessage: vi.fn()
  })
}))

// Stub child components
const ChatHeaderStub = {
  template: '<div class="chat-header-stub"></div>',
  props: ['character', 'level', 'isArticleMode', 'showArticle', 'isLoading']
}

const ChatMessageStub = {
  template: '<div class="chat-message-stub">{{ message.content }}</div>',
  props: ['message', 'character']
}

const ChatInputStub = {
  template: '<div class="chat-input-stub"><input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" /><button @click="$emit(\'send\')">Send</button></div>',
  props: ['modelValue', 'disabled', 'language'],
  emits: ['update:modelValue', 'send'],
  methods: {
    focus() {
      // Stub method for ChatScreen's focusInput call
    }
  }
}

const TypingIndicatorStub = {
  template: '<div class="typing-indicator-stub"></div>',
  props: ['character']
}

const VocabularyHintsStub = {
  template: '<div class="vocabulary-hints-stub"></div>',
  props: ['hints']
}

const ArticlePanelStub = {
  template: '<div class="article-panel-stub"></div>',
  props: ['article']
}

describe('ChatScreen', () => {
  const createWrapper = (overrides = {}) => {
    // Set nav state for each test
    navCharacter.value = overrides.character || { id: 'sakura', name: 'Sakura', avatar: '\u{1F338}' }
    navLevel.value = overrides.level || { id: 'beginner', name: 'Beginner' }
    navLanguage.value = overrides.language || 'en'
    navMode.value = overrides.mode || 'free'
    navArticle.value = overrides.article || null
    navScenario.value = overrides.scenario || null

    return mount(ChatScreen, {
      global: {
        stubs: {
          ChatHeader: ChatHeaderStub,
          ChatMessage: ChatMessageStub,
          ChatInput: ChatInputStub,
          TypingIndicator: TypingIndicatorStub,
          VocabularyHints: VocabularyHintsStub,
          ArticlePanel: ArticlePanelStub,
          LevelUpModal: true,
          StreakMilestoneModal: true,
          AchievementUnlockModal: true,
          WordSavePopup: true,
          VocabularyBankPanel: true,
          DailyPromptCard: true,
          MicroReward: true,
          Teleport: true
        }
      }
    })
  }

  beforeEach(() => {
    mockSendMessage.mockClear()
    mockPush.mockClear()
    mockReplace.mockClear()
  })

  describe('rendering', () => {
    it('should render the chat screen', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.flex.h-screen').exists()).toBe(true)
    })

    it('should render chat header', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.chat-header-stub').exists()).toBe(true)
    })

    it('should render chat input', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.chat-input-stub').exists()).toBe(true)
    })

    it('should show date separator', () => {
      const wrapper = createWrapper()
      // The date separator shows a formatted date (e.g., "Mar 15"), not "Today"
      // Just verify the date separator element exists
      expect(wrapper.find('.text-xs.font-medium.text-slate-400').exists()).toBe(true)
    })
  })

  describe('free chat mode', () => {
    it('should not show article panel in free mode', () => {
      const wrapper = createWrapper({ mode: 'free' })
      expect(wrapper.find('.article-panel-stub').exists()).toBe(false)
    })

    it('should show vocabulary hints in free mode', () => {
      const wrapper = createWrapper({ mode: 'free' })
      expect(wrapper.find('.vocabulary-hints-stub').exists()).toBe(true)
    })
  })

  describe('article mode', () => {
    const mockArticle = {
      id: 'article-1',
      title: 'Test Article',
      content: 'Article content here'
    }

    it('should show article panel in article mode', () => {
      const wrapper = createWrapper({
        mode: 'article',
        article: mockArticle
      })
      expect(wrapper.find('.article-panel-stub').exists()).toBe(true)
    })

    it('should not show vocabulary hints in article mode', () => {
      const wrapper = createWrapper({
        mode: 'article',
        article: mockArticle
      })
      expect(wrapper.find('.vocabulary-hints-stub').exists()).toBe(false)
    })
  })

  describe('message sending', () => {
    it('should call API when message is sent', async () => {
      const wrapper = createWrapper()

      // Set input value
      const input = wrapper.find('input')
      await input.setValue('Hello!')

      // Click send
      const sendButton = wrapper.find('button')
      await sendButton.trigger('click')

      // Wait for async operations
      await wrapper.vm.$nextTick()

      expect(mockSendMessage).toHaveBeenCalled()
    })
  })

  describe('events', () => {
    it('should navigate back when back event emitted from header', async () => {
      const wrapper = createWrapper()

      // Simulate back event from header
      wrapper.findComponent(ChatHeaderStub).vm.$emit('back')

      // In free mode, handleBack calls router.push('/')
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  describe('error handling', () => {
    it('should have error banner container', () => {
      const wrapper = createWrapper()
      // Error banner is conditionally rendered via v-if="errorMessage"
      // When no error, it should not be visible
      expect(wrapper.find('.bg-red-100').exists()).toBe(false)
    })
  })

  describe('modals', () => {
    it('should include level up modal', () => {
      const wrapper = createWrapper()
      expect(wrapper.findComponent({ name: 'LevelUpModal' }).exists()).toBe(true)
    })

    it('should include streak milestone modal', () => {
      const wrapper = createWrapper()
      expect(wrapper.findComponent({ name: 'StreakMilestoneModal' }).exists()).toBe(true)
    })

    it('should include achievement unlock modal', () => {
      const wrapper = createWrapper()
      expect(wrapper.findComponent({ name: 'AchievementUnlockModal' }).exists()).toBe(true)
    })
  })
})
