import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CharacterCard from '../../components/learning/CharacterCard.vue'

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

describe('CharacterCard', () => {
  const mockCharacter = {
    id: 'a',
    char: 'あ',
    reading: 'a',
    romaji: 'a',
    mnemonic: 'A person crossing a street, saying "Ahh!"',
    audioHint: 'ah, as in "father"',
    strokeCount: 3,
    row: 'vowel',
    examples: [
      { word: 'あめ', reading: 'ame', meaning: 'rain' },
      { word: 'あさ', reading: 'asa', meaning: 'morning' }
    ]
  }

  const createWrapper = (props = {}) => {
    return mount(CharacterCard, {
      props: {
        character: mockCharacter,
        language: 'ja',
        ...props
      }
    })
  }

  describe('rendering', () => {
    it('should render the card', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should display the character in large text', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('あ')
      expect(wrapper.find('.text-4xl').exists()).toBe(true)
    })

    it('should display romaji below the character', () => {
      const wrapper = createWrapper()
      const romaji = wrapper.find('.text-sm.text-primary')
      expect(romaji.exists()).toBe(true)
      expect(romaji.text()).toBe('a')
    })

    it('should display the mnemonic prominently', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('A person crossing a street')
    })

    it('should display the audio hint', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('ah, as in "father"')
    })

    it('should display stroke count', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('prelesson.strokes')
    })

    it('should display example words', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('あめ')
      expect(wrapper.text()).toContain('ame')
      expect(wrapper.text()).toContain('rain')
      expect(wrapper.text()).toContain('あさ')
    })

    it('should have rounded-2xl container', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.rounded-2xl').exists()).toBe(true)
    })
  })

  describe('learned state', () => {
    it('should show green left border when learned', () => {
      const wrapper = createWrapper({ learned: true })
      expect(wrapper.find('.border-l-green-500').exists()).toBe(true)
    })

    it('should show checkmark badge when learned', () => {
      const wrapper = createWrapper({ learned: true })
      expect(wrapper.text()).toContain('check_circle')
      expect(wrapper.text()).toContain('prelesson.learned')
    })

    it('should not show checkmark badge when not learned', () => {
      const wrapper = createWrapper({ learned: false })
      expect(wrapper.text()).not.toContain('prelesson.learned')
    })
  })

  describe('audio button', () => {
    it('should have a play button for the character', () => {
      const wrapper = createWrapper()
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeGreaterThanOrEqual(1)
    })

    it('should show play icon initially', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('play_arrow')
    })

    it('should have audio buttons for example words', () => {
      const wrapper = createWrapper()
      // Main play button + 2 example audio buttons
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('audio playback', () => {
    it('should not throw error when play button is clicked', async () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      await button.trigger('click')
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('missing optional data', () => {
    it('should handle character without examples', () => {
      const wrapper = createWrapper({
        character: { ...mockCharacter, examples: [] }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).not.toContain('prelesson.exampleWords')
    })

    it('should handle character without mnemonic', () => {
      const wrapper = createWrapper({
        character: { ...mockCharacter, mnemonic: undefined }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle character without strokeCount', () => {
      const wrapper = createWrapper({
        character: { ...mockCharacter, strokeCount: undefined }
      })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('dark mode support', () => {
    it('should have dark mode classes', () => {
      const wrapper = createWrapper()
      const html = wrapper.html()
      expect(html).toContain('dark:')
    })
  })
})
