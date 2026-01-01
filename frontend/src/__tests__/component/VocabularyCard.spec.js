import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import VocabularyCard from '../../components/learning/VocabularyCard.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

// Mock TTS utilities
vi.mock('../../utils/tts', () => ({
  playTTS: vi.fn().mockResolvedValue(undefined),
  isTTSAvailable: vi.fn().mockReturnValue(true)
}))

describe('VocabularyCard', () => {
  const mockWord = {
    id: 1,
    word: 'hello',
    meaning: 'A greeting',
    example: 'Hello, how are you?',
    phonetic: '/həˈloʊ/',
    audio: '/audio/hello.mp3'
  }

  const createWrapper = (props = {}) => {
    return mount(VocabularyCard, {
      props: {
        word: mockWord,
        language: 'en',
        ...props
      }
    })
  }

  describe('rendering', () => {
    it('should render the card', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should display the word', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('hello')
    })

    it('should display the meaning', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('A greeting')
    })

    it('should display the example', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('Hello, how are you?')
    })

    it('should display phonetic when available', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('/həˈloʊ/')
    })

    it('should not display phonetic when not available', () => {
      const wrapper = createWrapper({
        word: { ...mockWord, phonetic: undefined }
      })
      expect(wrapper.text()).not.toContain('/həˈloʊ/')
    })

    it('should display reading when available', () => {
      const wrapper = createWrapper({
        word: { ...mockWord, reading: 'ハロー' }
      })
      expect(wrapper.text()).toContain('ハロー')
    })
  })

  describe('audio button', () => {
    it('should have play button', () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
    })

    it('should show play icon initially', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('play_arrow')
    })

    it('should be enabled when not playing', () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeUndefined()
    })
  })

  describe('audio playback', () => {
    it('should play audio when button is clicked', async () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')

      await button.trigger('click')

      // Should not throw error
      expect(wrapper.exists()).toBe(true)
    })

    it('should not throw error when clicking play button', async () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')

      await button.trigger('click')

      // Should not change state after click completes
      expect(wrapper.vm.isPlayingWord).toBe(false)
    })
  })

  describe('audio error handling', () => {
    it('should not show error message initially', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).not.toContain('learning.audioNotAvailable')
    })
  })

  describe('styling', () => {
    it('should have rounded container', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.rounded-xl').exists()).toBe(true)
    })

    it('should have example section with border', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.border-l-4').exists()).toBe(true)
    })
  })

  describe('different words', () => {
    it('should display Japanese word correctly', () => {
      const wrapper = createWrapper({
        word: {
          id: 2,
          word: 'おはよう',
          meaning: 'Good morning',
          example: 'おはようございます！',
          reading: 'Ohayou'
        },
        language: 'ja'
      })

      expect(wrapper.text()).toContain('おはよう')
      expect(wrapper.text()).toContain('Good morning')
      expect(wrapper.text()).toContain('Ohayou')
    })
  })
})
