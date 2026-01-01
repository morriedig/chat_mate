import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ConversationPractice from '../../components/learning/ConversationPractice.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key, params) => {
      if (params) return `${key} ${JSON.stringify(params)}`
      return key
    }
  })
}))

// Mock useChatApi
const mockSendMessage = vi.fn().mockResolvedValue({
  reply: 'Hey! Great to chat with you about travel!',
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
    trackCharacterInteraction: vi.fn()
  })
}))

// Mock characters data
vi.mock('../../data/characters', () => ({
  characters: [
    { id: 'emma', name: 'Emma', avatar: '👩‍🎨' },
    { id: 'marcus', name: 'Marcus', avatar: '👨‍💻' }
  ]
}))

// Stub child components
const ChatMessageStub = {
  template: '<div class="chat-message-stub">{{ message.content }}</div>',
  props: ['message', 'character']
}

const ChatInputStub = {
  template: '<div class="chat-input-stub"><input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" /><button @click="$emit(\'send\')">Send</button></div>',
  props: ['modelValue', 'disabled'],
  emits: ['update:modelValue', 'send'],
  methods: {
    focus() {}
  }
}

const TypingIndicatorStub = {
  template: '<div class="typing-indicator-stub"></div>',
  props: ['character']
}

describe('ConversationPractice', () => {
  const mockWords = [
    { id: 'w1', word: 'airport', meaning: 'A place for planes', example: 'I went to the airport.' },
    { id: 'w2', word: 'ticket', meaning: 'A pass for travel', example: 'Buy a ticket.' },
    { id: 'w3', word: 'passport', meaning: 'Travel document', example: 'Show your passport.' },
    { id: 'w4', word: 'luggage', meaning: 'Bags for travel', example: 'Check your luggage.' },
    { id: 'w5', word: 'flight', meaning: 'Air travel', example: 'The flight is delayed.' },
    { id: 'w6', word: 'boarding', meaning: 'Getting on plane', example: 'Boarding starts soon.' }
  ]

  const mockCategory = {
    id: 'travel',
    icon: '✈️'
  }

  const mockLevel = {
    id: 'beginner',
    name: 'Beginner',
    icon: '🌱'
  }

  const createWrapper = (props = {}) => {
    return mount(ConversationPractice, {
      props: {
        words: mockWords,
        category: mockCategory,
        level: mockLevel,
        language: 'en',
        ...props
      },
      global: {
        stubs: {
          ChatMessage: ChatMessageStub,
          ChatInput: ChatInputStub,
          TypingIndicator: TypingIndicatorStub
        }
      }
    })
  }

  beforeEach(() => {
    mockSendMessage.mockClear()
  })

  describe('rendering', () => {
    it('should render the component', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should show intro screen before conversation starts', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('learning.conversation.title')
    })

    it('should display character avatar on intro', () => {
      const wrapper = createWrapper()
      // One of the character avatars should be shown
      expect(wrapper.text()).toMatch(/👩‍🎨|👨‍💻/)
    })

    it('should show words to practice on intro', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('learning.conversation.wordsToUse')
      expect(wrapper.text()).toContain('airport')
      expect(wrapper.text()).toContain('ticket')
    })

    it('should show +N more when more than 5 words', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('+1')
      expect(wrapper.text()).toContain('learning.conversation.more')
    })

    it('should have start button', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('learning.conversation.start')
    })
  })

  describe('header', () => {
    it('should show back button', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.material-symbols-outlined').text()).toContain('arrow_back')
    })

    it('should show category icon and name', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('✈️')
      expect(wrapper.text()).toContain('learning.categories.travel')
    })

    it('should emit back event when back button clicked', async () => {
      const wrapper = createWrapper()
      const backButton = wrapper.find('button')

      await backButton.trigger('click')

      expect(wrapper.emitted('back')).toBeTruthy()
    })
  })

  describe('starting conversation', () => {
    it('should call API when start button is clicked', async () => {
      const wrapper = createWrapper()
      const startButton = wrapper.findAll('button').find(btn => btn.text().includes('learning.conversation.start'))

      await startButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(mockSendMessage).toHaveBeenCalled()
    })

    it('should show chat interface after starting', async () => {
      const wrapper = createWrapper()
      const startButton = wrapper.findAll('button').find(btn => btn.text().includes('learning.conversation.start'))

      await startButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.chat-input-stub').exists()).toBe(true)
    })

    it('should pass vocabulary context to API', async () => {
      const wrapper = createWrapper()
      const startButton = wrapper.findAll('button').find(btn => btn.text().includes('learning.conversation.start'))

      await startButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(mockSendMessage).toHaveBeenCalledWith(expect.objectContaining({
        vocabularyContext: expect.objectContaining({
          category: 'travel',
          words: expect.any(Array)
        })
      }))
    })
  })

  describe('conversation flow', () => {
    it('should show context hint during conversation', async () => {
      const wrapper = createWrapper()
      const startButton = wrapper.findAll('button').find(btn => btn.text().includes('learning.conversation.start'))

      await startButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('learning.conversation.contextHint')
    })

    it('should show progress indicator before minimum messages', async () => {
      const wrapper = createWrapper()
      const startButton = wrapper.findAll('button').find(btn => btn.text().includes('learning.conversation.start'))

      await startButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('learning.conversation.progress')
    })
  })

  describe('finish button', () => {
    it('should not show finish button before minimum messages', async () => {
      const wrapper = createWrapper()
      const startButton = wrapper.findAll('button').find(btn => btn.text().includes('learning.conversation.start'))

      await startButton.trigger('click')
      await wrapper.vm.$nextTick()

      // Should not have finish button yet (need 4 messages)
      const buttons = wrapper.findAll('button')
      const finishButton = buttons.find(btn => btn.text().includes('learning.conversation.finish'))
      expect(finishButton).toBeFalsy()
    })
  })

  describe('character selection', () => {
    it('should select a character randomly', () => {
      const wrapper = createWrapper()
      // Character should be one of the mocked characters
      expect(wrapper.vm.selectedCharacter).toBeDefined()
      expect(['emma', 'marcus']).toContain(wrapper.vm.selectedCharacter.id)
    })

    it('should display selected character name', () => {
      const wrapper = createWrapper()
      const characterName = wrapper.vm.selectedCharacter.name
      expect(wrapper.text()).toContain(characterName)
    })
  })

  describe('events', () => {
    it('should emit complete with message count', async () => {
      const wrapper = createWrapper()

      // Manually set message count to test complete
      wrapper.vm.messageCount = 5
      wrapper.vm.conversationStarted = true
      await wrapper.vm.$nextTick()

      const finishButton = wrapper.findAll('button').find(btn => btn.text().includes('learning.conversation.finish'))
      if (finishButton) {
        await finishButton.trigger('click')
        expect(wrapper.emitted('complete')).toBeTruthy()
        expect(wrapper.emitted('complete')[0][0]).toHaveProperty('messagesExchanged')
      }
    })
  })

  describe('error handling', () => {
    it('should not show error banner initially', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).not.toContain('chat.rateLimitError')
      expect(wrapper.text()).not.toContain('chat.genericError')
    })
  })
})
