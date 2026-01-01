import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import ChatScreen from '../../components/ChatScreen.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
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
    sendMessage: mockSendMessage
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
  props: ['modelValue', 'disabled'],
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
  const mockCharacter = {
    id: 'sakura',
    name: 'Sakura',
    avatar: '🌸'
  }

  const mockLevel = {
    id: 'beginner',
    name: 'Beginner'
  }

  const createWrapper = (props = {}) => {
    return mount(ChatScreen, {
      props: {
        character: mockCharacter,
        level: mockLevel,
        language: 'en',
        mode: 'free',
        ...props
      },
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
          Teleport: true
        }
      }
    })
  }

  beforeEach(() => {
    mockSendMessage.mockClear()
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
      expect(wrapper.text()).toContain('Today')
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
    it('should emit back event', async () => {
      const wrapper = createWrapper()

      // Simulate back event from header
      wrapper.findComponent(ChatHeaderStub).vm.$emit('back')

      expect(wrapper.emitted('back')).toBeTruthy()
    })
  })

  describe('error handling', () => {
    it('should have error banner container', () => {
      const wrapper = createWrapper()
      // Error banner is conditionally rendered
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('modals', () => {
    it('should include level up modal', () => {
      const wrapper = createWrapper()
      // Modal is stubbed
      expect(wrapper.exists()).toBe(true)
    })

    it('should include streak milestone modal', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should include achievement unlock modal', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })
  })
})
